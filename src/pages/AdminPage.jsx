import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products.js';
import { KEYS, loadCollection, saveCollection, createRecord, updateRecord, deleteRecord, slug } from '../data/database.js';
import { apiRequest } from '../utils/api.js';
import { validateProduct, validName } from '../utils/validation.js';

const emptyProduct = { name: '', category: 'frutas', price: '', stock: 10, image: '', description: '', discount: 0 };
const money = value => formatPrice(Number(value) || 0);

export default function AdminPage({ products, categories, orders, onSaveProducts, onSaveCategories, onEditOrder, role = 'ADMIN' }) {
  const isAdmin = role === 'ADMIN';
  const [tab, setTab] = useState(isAdmin ? 'dashboard' : 'products');
  const [form, setForm] = useState(emptyProduct);
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [categoryName, setCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [users, setUsers] = useState(() => loadCollection(KEYS.users));
  const [openOrder, setOpenOrder] = useState(null);
  const paid = orders.filter(o => ['pagado','PAGADA'].includes(o.status));
  const revenue = paid.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const nav = isAdmin
    ? [['dashboard','Dashboard'], ['orders','Órdenes'], ['products','Productos'], ['categories','Categorías'], ['users','Usuarios'], ['reports','Reportes']]
    : [['products','Productos'], ['orders','Órdenes']];

  useEffect(() => {
    if (!isAdmin) return;
    apiRequest('/v1/usuarios').then(rows => {
      const mapped = rows.map(u => ({ id: u.id, name: u.nombre, email: u.email, role: u.rol }));
      setUsers(mapped); saveCollection(KEYS.users, mapped);
    }).catch(error => setFeedback(error.message));
  }, [isAdmin]);

  async function saveProduct(event) {
    event.preventDefault();
    const errors = validateProduct(form);
    setFormErrors(errors);
    if (Object.keys(errors).length) { setFeedback('Corrige los campos marcados antes de guardar.'); return; }
    const record = { ...form, name: form.name.trim(), price: Number(form.price), stock: Number(form.stock), discount: Number(form.discount), image: form.image.trim(), description: form.description.trim() };
    try {
      const next = editId === null ? createRecord(products, record) : updateRecord(products, editId, record);
      await onSaveProducts(next);
      setForm(emptyProduct); setEditId(null); setFormErrors({}); setFeedback('Producto guardado en la base de datos.');
    } catch (error) { setFeedback(error.message); }
  }
  async function saveCategory(event) {
    event.preventDefault();
    if (!validName(categoryName) || categoryName.trim().length < 2) { setFeedback('La categoría solo puede contener letras y espacios.'); return; }
    const id = slug(categoryName);
    if (!editCategory && categories.some(c => c.id === id)) { setFeedback('La categoría ya existe.'); return; }
    const next = editCategory
      ? updateRecord(categories, editCategory, { name: categoryName.trim() })
      : createRecord(categories, { id, name: categoryName.trim() });
    try { await onSaveCategories(next); setCategoryName(''); setEditCategory(null); setFeedback('Categoría guardada.'); }
    catch (error) { setFeedback(error.message); }
  }
  async function removeCategory(id) {
    if (products.some(p => p.category === id)) { setFeedback('Primero mueve o elimina los productos de esa categoría.'); return; }
    try { await onSaveCategories(deleteRecord(categories, id)); setFeedback('Categoría eliminada.'); }
    catch (error) { setFeedback(error.message); }
  }
  async function changeRole(id, roleValue) {
    try {
      await apiRequest(`/v1/usuarios/${id}/rol`, { method: 'PATCH', body: JSON.stringify({ rol: roleValue }) });
      const next = users.map(u => u.id === id ? { ...u, role: roleValue } : u); setUsers(next); saveCollection(KEYS.users, next); setFeedback('Rol actualizado.');
    } catch (error) { setFeedback(error.message); }
  }
  async function removeUser(id) {
    try { await apiRequest(`/v1/usuarios/${id}`, { method: 'DELETE' }); const next = users.filter(u => u.id !== id); setUsers(next); saveCollection(KEYS.users, next); setFeedback('Usuario eliminado.'); }
    catch (error) { setFeedback(error.message); }
  }
  async function changeOrderStatus(id, status) {
    try { await onEditOrder(id, status); setFeedback('Estado de la boleta actualizado.'); }
    catch (error) { setFeedback(error.message); }
  }

  return <div className="container-fluid container-xl py-5"><h1>{isAdmin ? 'Administración de HuertoHogar' : 'Panel de vendedor'}</h1>
    <p className="text-muted">{isAdmin ? 'Gestión general de la tienda.' : 'Acceso de consulta: productos y órdenes.'}</p>
    <div className="row g-4"><aside className="col-lg-3"><nav aria-label="Menú del panel" className="list-group">{nav.map(([id,name]) => <button type="button" key={id} className={`list-group-item list-group-item-action ${tab === id ? 'active' : ''}`} onClick={() => { setTab(id); setFeedback(''); }}>{name}</button>)}<Link to="/productos" className="list-group-item list-group-item-action">← Volver a tienda</Link></nav></aside>
      <section className="col-lg-9"><div role="status" className="alert alert-info py-2">{feedback || (isAdmin ? 'Los cambios se guardan en MySQL mediante la API REST.' : 'El vendedor solo puede consultar productos y órdenes.')}</div>
        {tab === 'dashboard' && isAdmin && <><h2 className="h4">Dashboard</h2><div className="row g-3 mb-4">{[['Boletas',orders.length],['Productos',products.length],['Usuarios',users.length],['Categorías',categories.length]].map(([label,value]) => <div key={label} className="col-6 col-xl-3"><div className="card p-3 h-100"><small>{label}</small><strong className="fs-2 text-success">{value}</strong></div></div>)}</div><h3 className="h5">Total de boletas pagadas: {money(revenue)}</h3></>}
        {tab === 'products' && <><h2 className="h4">Productos</h2><div className="table-responsive"><table className="table"><thead><tr><th>Nombre</th><th>Precio</th><th>Oferta</th><th>Stock</th>{isAdmin && <th>Acciones</th>}</tr></thead><tbody>{products.map(p => <tr key={p.id}><td>{p.name}</td><td>{money(p.price)}</td><td>{p.discount || 0}%</td><td>{p.stock}</td>{isAdmin && <td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setEditId(p.id); setForm({ name:p.name, category:p.category, price:p.price, stock:p.stock, image:p.image || '', description:p.description || '', discount:p.discount || 0 }); setFormErrors({}); }}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => onSaveProducts(products.filter(row => row.id !== p.id)).catch(error => setFeedback(error.message))}>Eliminar</button></td>}</tr>)}</tbody></table></div>
          {isAdmin && <><h3 className="h5 mt-4">{editId === null ? 'Nuevo producto' : 'Editar producto'}</h3><form onSubmit={saveProduct} className="form-panel" noValidate>
            <label className="form-label" htmlFor="p-name">Nombre</label><input id="p-name" className={`form-control ${formErrors.name ? 'is-invalid' : ''}`} value={form.name} onChange={e => setForm({...form,name:e.target.value})} /><div className="invalid-feedback">{formErrors.name}</div>
            <label className="form-label mt-2" htmlFor="p-price">Precio ($CLP)</label><input id="p-price" type="number" min="1" step="1" className={`form-control ${formErrors.price ? 'is-invalid' : ''}`} value={form.price} onChange={e => setForm({...form,price:e.target.value})} /><div className="invalid-feedback">{formErrors.price}</div>
            <label className="form-label mt-2" htmlFor="p-cat">Categoría</label><select id="p-cat" className={`form-select ${formErrors.category ? 'is-invalid' : ''}`} value={form.category} onChange={e => setForm({...form,category:e.target.value})}>{categories.map(c => <option value={c.id} key={c.id}>{c.name}</option>)}</select><div className="invalid-feedback">{formErrors.category}</div>
            <label className="form-label mt-2" htmlFor="p-stock">Stock disponible</label><input id="p-stock" type="number" min="0" step="1" className={`form-control ${formErrors.stock ? 'is-invalid' : ''}`} value={form.stock} onChange={e => setForm({...form,stock:e.target.value})} /><div className="invalid-feedback">{formErrors.stock}</div>
            <label className="form-label mt-2" htmlFor="p-discount">Descuento (%)</label><input id="p-discount" type="number" min="0" max="90" step="1" className={`form-control ${formErrors.discount ? 'is-invalid' : ''}`} value={form.discount} onChange={e => setForm({...form,discount:e.target.value})} /><div className="invalid-feedback">{formErrors.discount}</div>
            <label className="form-label mt-2" htmlFor="p-image">URL imagen (opcional)</label><input id="p-image" className="form-control" value={form.image} onChange={e => setForm({...form,image:e.target.value})} />
            <label className="form-label mt-2" htmlFor="p-desc">Descripción</label><textarea id="p-desc" className="form-control mb-3" rows="2" value={form.description} onChange={e => setForm({...form,description:e.target.value})}/>
            <button className="btn btn-success">Guardar producto</button>{editId !== null && <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => {setEditId(null);setForm(emptyProduct);setFormErrors({});}}>Cancelar</button>}
          </form><h3 className="h5 mt-4">Productos críticos (stock 5 o menos)</h3><ul>{products.filter(p => p.stock <= 5).map(p => <li key={p.id}>{p.name} — {p.stock} unidades</li>)}</ul></>}</>}
        {tab === 'categories' && isAdmin && <><h2 className="h4">Categorías · CRUD</h2><ul className="list-group mb-3">{categories.map(c => <li className="list-group-item d-flex justify-content-between align-items-center gap-2" key={c.id}><span>{c.name} ({products.filter(p => p.category === c.id).length} productos)</span><div><button className="btn btn-sm btn-outline-primary me-2" onClick={() => {setEditCategory(c.id);setCategoryName(c.name);}}>Editar</button><button className="btn btn-sm btn-outline-danger" onClick={() => removeCategory(c.id)}>Eliminar</button></div></li>)}</ul><form onSubmit={saveCategory} className="d-flex flex-wrap gap-2"><label className="visually-hidden" htmlFor="new-cat">Nombre categoría</label><input className="form-control w-auto" id="new-cat" placeholder="Nombre categoría" value={categoryName} onChange={e => setCategoryName(e.target.value)} /><button className="btn btn-success">{editCategory ? 'Actualizar categoría' : 'Agregar categoría'}</button></form></>}
        {tab === 'orders' && <><h2 className="h4">Órdenes y boletas</h2>{orders.length ? <div className="table-responsive"><table className="table"><thead><tr><th>Boleta</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>{orders.map(o => <React.Fragment key={o.id}><tr><td>{o.number}</td><td>{o.customer?.email || o.customer?.name || o.emailCliente}</td><td>{money(o.total)}</td><td>{isAdmin ? <select aria-label={`Estado ${o.number}`} className="form-select form-select-sm" value={String(o.status).toLowerCase()} onChange={e => changeOrderStatus(o.id, e.target.value)}><option value="pagado">Pagada</option><option value="rechazado">Rechazada</option><option value="preparando">Preparando</option><option value="entregado">Entregada</option></select> : String(o.status).toUpperCase()}</td><td><button className="btn btn-outline-primary btn-sm" onClick={() => setOpenOrder(openOrder === o.id ? null : o.id)}>Ver detalle</button></td></tr>{openOrder === o.id && <tr><td colSpan="5"><strong>Detalle de {o.number}</strong><ul>{o.items?.map((p,i) => <li key={`${p.id}-${i}`}>{p.name} × {p.quantity}: {money(p.price * p.quantity)}</li>)}</ul><p>{o.customer?.name} {o.customer?.lastName} — {o.customer?.street}, {o.customer?.city}</p></td></tr>}</React.Fragment>)}</tbody></table></div> : <p>Sin boletas registradas.</p>}</>}
        {tab === 'users' && isAdmin && <><h2 className="h4">Usuarios y roles</h2><p>Las cuentas nuevas se registran desde Crear cuenta y reciben el rol CLIENTE. Desde aquí el administrador puede asignar otro rol.</p>{users.length ? <div className="table-responsive"><table className="table"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acción</th></tr></thead><tbody>{users.map(u => <tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td><select className="form-select form-select-sm" aria-label={`Rol de ${u.email}`} value={u.role} onChange={e => changeRole(u.id,e.target.value)}><option value="CLIENTE">Cliente</option><option value="VENDEDOR">Vendedor</option><option value="ADMIN">Administrador</option></select></td><td><button className="btn btn-sm btn-outline-danger" onClick={() => removeUser(u.id)}>Eliminar</button></td></tr>)}</tbody></table></div> : <p>No hay usuarios.</p>}</>}
        {tab === 'reports' && isAdmin && <><h2 className="h4">Reportes de venta</h2><p>Boletas totales: <strong>{orders.length}</strong> · Pagadas: <strong>{paid.length}</strong> · Rechazadas: <strong>{orders.filter(o => String(o.status).toLowerCase().includes('rechaz')).length}</strong></p><p>Ventas pagadas: <strong>{money(revenue)}</strong></p><p>Productos críticos: <strong>{products.filter(p => p.stock <= 5).length}</strong></p></>}
      </section></div>
  </div>;
}
