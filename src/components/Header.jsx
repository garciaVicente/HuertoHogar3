import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ count, user, onLogout }) {
  const [open, setOpen] = useState(false);
  const customerLinks = [['/', 'Inicio'], ['/productos', 'Productos'], ['/categorias', 'Categorías'], ['/ofertas', 'Ofertas'], ['/carrito', 'Carrito']];
  const sellerLinks = [['/productos', 'Productos'], ['/vendedor', 'Órdenes']];
  const adminLinks = [...customerLinks, ['/blogs', 'Blog'], ['/nosotros', 'Nosotros'], ['/contacto', 'Contacto']];
  const links = user?.role === 'VENDEDOR' ? sellerLinks : user?.role === 'ADMIN' ? adminLinks : customerLinks;
  return <header className="site-header sticky-top shadow-sm"><nav className="navbar navbar-expand-lg container py-3" aria-label="Navegación principal">
    <Link to="/" className="navbar-brand fw-bold">🌱 HuertoHogar</Link>
    <button type="button" className="navbar-toggler" aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(!open)}><span className="navbar-toggler-icon" /></button>
    <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}><div className="navbar-nav ms-auto gap-lg-2 align-items-lg-center">
      {links.map(([url, title]) => <NavLink to={url} className="nav-link" key={url} onClick={() => setOpen(false)}>{title === 'Carrito' ? <>🛒 Carrito <span className="badge text-bg-success">{count}</span></> : title}</NavLink>)}
      {!user && <><NavLink to="/contacto" className="nav-link">Contacto</NavLink><Link className="btn btn-outline-success btn-sm" to="/login">Ingresar</Link><Link className="btn btn-success btn-sm" to="/registro">Crear cuenta</Link></>}
      {user?.role === 'CLIENTE' && <button className="btn btn-outline-success btn-sm" onClick={onLogout}>Salir</button>}
      {user?.role === 'VENDEDOR' && <><span className="small text-muted">Vendedor: {user.name}</span><button className="btn btn-outline-success btn-sm" onClick={onLogout}>Salir</button></>}
      {user?.role === 'ADMIN' && <><NavLink to="/admin" className="nav-link">Administración</NavLink><span className="small text-muted">{user.name}</span><button className="btn btn-outline-success btn-sm" onClick={onLogout}>Salir</button></>}
    </div></div>
  </nav></header>;
}
