import React, { useEffect, useState } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import { HomePage, CatalogPage, DetailPage, CartPage, CategoriesPage, OffersPage } from './pages/ShopPages.jsx';
import { ContactPage, AuthPage } from './pages/FormsPages.jsx';
import { BlogPage, ArticlePage, AboutPage } from './pages/ContentPages.jsx';
import { CheckoutPage, OrderResultPage } from './pages/CheckoutPages.jsx';
import AdminPage from './pages/AdminPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { addItem, cartCount, changeQuantity, loadCart, readJson, cartLimit } from './utils/storage.js';
import { initialProducts } from './data/products.js';
import { initialCategories, KEYS, loadCollection, saveCollection, createRecord, updateRecord } from './data/database.js';
import { apiRequest } from './utils/api.js';

function RoleRoute({ user, roles, children }) {
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function NoSellerRoute({ user, children }) {
  return user?.role === 'VENDEDOR' ? <Navigate to="/vendedor" replace /> : children;
}

function PublicContentRoute({ user, children }) {
  return ['CLIENTE','VENDEDOR'].includes(user?.role) ? <Navigate to="/" replace /> : children;
}

function normalizeOrder(row) {
  const status = ({ PAGADA:'pagado', RECHAZADA:'rechazado', PREPARANDO:'preparando', ENTREGADA:'entregado' })[row.estado] || String(row.estado).toLowerCase();
  return {
    id: row.id, number: row.numero, createdAt: row.fecha, status, total: Number(row.total),
    customer: { name: row.nombreCliente, lastName: '', email: row.emailCliente, street: row.direccion, city: row.comuna, region: row.region },
    items: (row.items || []).map(item => ({ id: item.productoId, name: item.nombre, quantity: item.cantidad, price: Number(item.precio) }))
  };
}

function productPayload(product) {
  return { nombre: product.name, descripcion: product.description || '', precio: Number(product.price), stock: Number(product.stock), imagen: product.image || '', descuento: Number(product.discount || 0), categoriaId: product.category };
}

export default function App() {
  const [products, setProducts] = useState(() => loadCollection(KEYS.products, initialProducts));
  const [categories, setCategories] = useState(() => loadCollection(KEYS.categories, initialCategories));
  const [orders, setOrders] = useState(() => loadCollection(KEYS.orders));
  const [cart, setCart] = useState(loadCart);
  const [user, setUser] = useState(() => localStorage.getItem('huerto_token') ? readJson('huerto_session', null) : null);
  const [notice, setNotice] = useState('');
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => { saveCollection('huerto_cart', cart); }, [cart]);
  useEffect(() => { saveCollection(KEYS.products, products); }, [products]);
  useEffect(() => { saveCollection(KEYS.categories, categories); }, [categories]);
  useEffect(() => { saveCollection(KEYS.orders, orders); }, [orders]);

  useEffect(() => {
    if (!localStorage.getItem('huerto_token')) return;
    apiRequest('/v1/auth/me').then(row => {
      const next = { id:row.id, name:row.nombre, email:row.email, role:row.rol };
      setUser(next); localStorage.setItem('huerto_session', JSON.stringify(next));
    }).catch(() => { localStorage.removeItem('huerto_token'); localStorage.removeItem('huerto_session'); setUser(null); });
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([apiRequest('/v2/productos'), apiRequest('/v1/categorias')])
      .then(([productRows, categoryRows]) => {
        if (!alive) return;
        setProducts(productRows.map(p => ({ id:p.id, name:p.nombre, description:p.descripcion, price:Number(p.precio), stock:p.stock, image:p.imagen, discount:p.descuento, category:p.category })));
        setCategories(categoryRows.map(c => ({ id:c.id, name:c.nombre })));
        setApiReady(true);
        setNotice('Conectado al backend de HuertoHogar.');
      })
      .catch(error => { if (alive) { setApiReady(false); setNotice(`${error.message} Se muestran datos guardados localmente.`); } });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!user || !['ADMIN','VENDEDOR'].includes(user.role)) return;
    apiRequest('/v1/boletas').then(rows => setOrders(rows.map(normalizeOrder))).catch(error => setNotice(error.message));
  }, [user]);

  async function saveProducts(next) {
    if (!apiReady) throw new Error('No hay conexión con el backend. No se guardaron los cambios.');
    const currentIds = new Set(products.map(p => String(p.id)));
    const nextIds = new Set(next.map(p => String(p.id)));
    for (const old of products) if (!nextIds.has(String(old.id))) await apiRequest(`/v2/productos/${old.id}`, { method:'DELETE' });
    for (const item of next) {
      const payload = productPayload(item);
      if (currentIds.has(String(item.id))) await apiRequest(`/v2/productos/${item.id}`, { method:'PUT', body:JSON.stringify(payload) });
      else await apiRequest('/v2/productos', { method:'POST', body:JSON.stringify(payload) });
    }
    const rows = await apiRequest('/v2/productos');
    setProducts(rows.map(p => ({ id:p.id, name:p.nombre, description:p.descripcion, price:Number(p.precio), stock:p.stock, image:p.imagen, discount:p.descuento, category:p.category })));
  }

  async function saveCategories(next) {
    if (!apiReady) throw new Error('No hay conexión con el backend. No se guardaron los cambios.');
    const currentIds = new Set(categories.map(c => String(c.id)));
    const nextIds = new Set(next.map(c => String(c.id)));
    for (const old of categories) if (!nextIds.has(String(old.id))) await apiRequest(`/v1/categorias/${old.id}`, { method:'DELETE' });
    for (const item of next) {
      if (currentIds.has(String(item.id))) await apiRequest(`/v1/categorias/${item.id}`, { method:'PUT', body:JSON.stringify({ nombre:item.name }) });
      else await apiRequest('/v1/categorias', { method:'POST', body:JSON.stringify({ nombre:item.name }) });
    }
    const rows = await apiRequest('/v1/categorias');
    setCategories(rows.map(c => ({ id:c.id, name:c.nombre })));
  }

  function add(product) {
    const current = cart.find(item => item.id === product.id)?.quantity || 0;
    const maximum = cartLimit(product);
    if (current >= maximum) { setNotice(`No puedes agregar más de ${maximum} unidades de ${product.name}.`); return; }
    setCart(old => addItem(old, product));
    setNotice(`${product.name} agregado al carrito.`);
  }
  function changeCartQuantity(id, amount) {
    const product = products.find(p => p.id === id);
    const quantity = cart.find(item => item.id === id)?.quantity || 0;
    if (amount > 0 && quantity >= cartLimit(product)) { setNotice(`Límite alcanzado: máximo ${cartLimit(product)} unidades de ${product?.name || 'este producto'}.`); return; }
    setCart(old => changeQuantity(old, id, amount, products));
  }
  function signIn(next) { setUser(next); localStorage.setItem('huerto_session', JSON.stringify(next)); }
  function signOut() { setUser(null); localStorage.removeItem('huerto_session'); localStorage.removeItem('huerto_token'); }

  async function finishOrder(order) {
    if (!user || !['CLIENTE','ADMIN'].includes(user.role)) return Promise.reject(new Error('Inicia sesión con una cuenta autorizada para comprar.'));
    const response = await apiRequest('/v1/boletas', {
      method:'POST',
      body:JSON.stringify({
        items:order.items.map(item => ({ productoId:item.id, cantidad:item.quantity })),
        direccion:[order.customer.street,order.customer.apartment].filter(Boolean).join(', '),
        comuna:order.customer.city, region:order.customer.region,
        metodoEntrega:order.customer.delivery, pagoAprobado:order.status === 'pagado'
      })
    });
    const saved = normalizeOrder(response);
    const nextOrders = [saved, ...orders.filter(row => row.id !== saved.id)];
    setOrders(nextOrders); saveCollection(KEYS.orders,nextOrders);
    if (saved.status === 'pagado') setCart([]);
    try {
      const freshProducts = await apiRequest('/v2/productos');
      setProducts(freshProducts.map(p => ({ id:p.id, name:p.nombre, description:p.descripcion, price:Number(p.precio), stock:p.stock, image:p.imagen, discount:p.descuento, category:p.category })));
    } catch { setNotice('Compra registrada. No se pudo actualizar el catálogo en pantalla; recarga para sincronizarlo.'); }
    return saved;
  }

  async function editOrder(id, status) {
    const map = { pagado:'PAGADA', rechazada:'RECHAZADA', rechazado:'RECHAZADA', preparando:'PREPARANDO', entregado:'ENTREGADA', entregada:'ENTREGADA' };
    await apiRequest(`/v1/boletas/${id}/estado`, { method:'PATCH', body:JSON.stringify({ estado:map[status] || status.toUpperCase() }) });
    const rows = await apiRequest('/v1/boletas'); setOrders(rows.map(normalizeOrder));
  }

  return <div className="d-flex flex-column min-vh-100">
    <Header count={cartCount(cart)} user={user} onLogout={signOut} />
    {notice && <div role="status" className={`alert ${apiReady ? 'alert-success' : 'alert-warning'} text-center rounded-0 mb-0`}>{notice} <button aria-label="Cerrar aviso" className="btn-close ms-3" onClick={() => setNotice('')} /></div>}
    <main className="flex-grow-1"><Routes>
      <Route path="/" element={<HomePage products={products} onAdd={add} />} />
      <Route path="/productos" element={<CatalogPage products={products} categories={categories} onAdd={add} />} />
      <Route path="/productos/:id" element={<DetailPage products={products} onAdd={add} />} />
      <Route path="/categorias" element={<NoSellerRoute user={user}><CategoriesPage products={products} categories={categories} /></NoSellerRoute>} />
      <Route path="/categorias/:category" element={<NoSellerRoute user={user}><CatalogPage products={products} categories={categories} onAdd={add} /></NoSellerRoute>} />
      <Route path="/ofertas" element={<NoSellerRoute user={user}><OffersPage products={products} onAdd={add} /></NoSellerRoute>} />
      <Route path="/carrito" element={<NoSellerRoute user={user}><CartPage cart={cart} products={products} onChange={changeCartQuantity} onRemove={id => setCart(old => old.filter(p => p.id !== id))} onClear={() => setCart([])} /></NoSellerRoute>} />
      <Route path="/checkout" element={<RoleRoute user={user} roles={['CLIENTE','ADMIN']}><CheckoutPage cart={cart} products={products} user={user} onComplete={finishOrder} /></RoleRoute>} />
      <Route path="/compra/exito/:id" element={<RoleRoute user={user} roles={['CLIENTE','ADMIN']}><OrderResultPage orders={orders} approved /></RoleRoute>} />
      <Route path="/compra/error/:id" element={<RoleRoute user={user} roles={['CLIENTE','ADMIN']}><OrderResultPage orders={orders} approved={false} /></RoleRoute>} />
      <Route path="/contacto" element={<PublicContentRoute user={user}><ContactPage /></PublicContentRoute>} />
      <Route path="/login" element={<AuthPage mode="login" onAuth={signIn} />} />
      <Route path="/registro" element={<AuthPage mode="registro" onAuth={signIn} />} />
      <Route path="/perfil" element={<PublicContentRoute user={user}><ProfilePage user={user} orders={orders} onAuth={signIn} /></PublicContentRoute>} />
      <Route path="/blogs" element={<PublicContentRoute user={user}><BlogPage /></PublicContentRoute>} /><Route path="/blogs/:id" element={<PublicContentRoute user={user}><ArticlePage /></PublicContentRoute>} />
      <Route path="/nosotros" element={<PublicContentRoute user={user}><AboutPage /></PublicContentRoute>} />
      <Route path="/admin" element={<RoleRoute user={user} roles={['ADMIN']}><AdminPage role="ADMIN" products={products} categories={categories} orders={orders} onSaveProducts={saveProducts} onSaveCategories={saveCategories} onEditOrder={editOrder} /></RoleRoute>} />
      <Route path="/vendedor" element={<RoleRoute user={user} roles={['VENDEDOR']}><AdminPage role="VENDEDOR" products={products} categories={categories} orders={orders} onSaveProducts={saveProducts} onSaveCategories={saveCategories} onEditOrder={editOrder} /></RoleRoute>} />
      <Route path="*" element={<div className="container py-5"><h1>Página no encontrada</h1><Link to="/">Volver al inicio</Link></div>} />
    </Routes></main>
    <footer className="site-footer py-4"><div className="container d-flex flex-column flex-md-row justify-content-between gap-2"><span>© HuertoHogar · Productos orgánicos</span><span>Proyecto académico · Evaluación Parcial 3</span></div></footer>
  </div>;
}
