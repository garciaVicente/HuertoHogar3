# HuertoHogar — Evaluación Parcial 3

Aplicación de tienda con **React + Vite + Bootstrap** y backend **Spring Boot + MySQL + Spring Security + JWT**.

## Requisitos

- Node.js 20 o superior (recomendado Node 22 LTS).
- Java 21.
- Maven 3.9 o superior.
- Docker Desktop con Docker Compose.

## 1. Iniciar MySQL

Desde una terminal, dentro de `backend`:

```bash
docker compose up -d
```

MySQL queda disponible en `localhost:3307`, base `huertohogar`, usuario `huerto`, contraseña `huerto123`.

## 2. Iniciar Spring Boot

En otra terminal:

```bash
cd backend
mvn spring-boot:run
```

API: `http://localhost:8080/api`
Swagger: `http://localhost:8080/swagger-ui/index.html`

## 3. Iniciar React

En la raíz del proyecto:

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. Vite envía `/api` al backend en el puerto 8080.

## Cuentas de demostración

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@huertohogar.cl | Admin123! |
| Vendedor | vendedor@huertohogar.cl | Vendedor123! |
| Cliente | Crear desde «Crear cuenta» | Contraseña definida al registrarse |

Cambiar las contraseñas y el secreto JWT antes de cualquier uso fuera de la demostración académica.

## Roles

- **ADMIN:** acceso completo; administra productos, categorías, usuarios, roles, boletas y reportes.
- **VENDEDOR:** consulta catálogo, detalle de productos, lista de boletas y detalle de boletas. No modifica datos.
- **CLIENTE:** accede a la tienda, carrito y checkout.

Los permisos se validan en Spring Security. Ocultar una opción del menú no es la única protección.

## Validaciones implementadas

- Nombre de usuario y producto: letras Unicode y espacios; rechaza `123` y `Juan123`.
- Correo: formato de dirección con usuario, dominio y extensión; rechaza `aaaaa@.gmail.com`.
- Precio: entero mayor que cero.
- Stock: entero igual o mayor que cero. Un stock de 20 es válido.
- Carrito: máximo 20 unidades por producto y nunca más que el stock real.
- Compra: el backend vuelve a validar cantidad y stock dentro de una transacción con bloqueo de fila.
- Pago rechazado: registra la boleta como rechazada y no descuenta inventario.

## Pruebas

Frontend:

```bash
npm test
```

El reporte HTML de cobertura queda en `coverage/html/index.html`.

Backend:

```bash
cd backend
mvn test
```

## Modelo de datos

`usuario` 1—N `boleta`; `boleta` 1—N `detalle_boleta`; `producto` 1—N `detalle_boleta`; `categoria` 1—N `producto`.

El modelo conserva las cinco tablas propuestas en el Anexo 1: USUARIO, BOLETA, DETALLE_BOLETA, PRODUCTO y CATEGORIA.

## Endpoints principales

- `POST /api/v1/auth/registro`, `POST /api/v1/auth/login`
- `GET /api/v1/productos` (datos básicos)
- `GET /api/v2/productos` (datos detallados)
- CRUD `/api/v1/productos`, `/api/v2/productos`, `/api/v1/categorias` (mutaciones ADMIN)
- `POST /api/v1/boletas` (CLIENTE/ADMIN); GET de boletas (ADMIN/VENDEDOR)
- `/api/v1/usuarios` (ADMIN)

El Anexo 2 y el Anexo 3 contienen ejemplos de API para Pokémon. Para mantener el dominio del proyecto HuertoHogar, sus operaciones/versionado/roles se adaptaron a productos, categorías y boletas; no se consulta PokeAPI.


## Documentos de entrega

En `docs/` están ERS V3, Manual de Usuario, Documentación de APIs (DOCX y XLSX) y APIs e Integración. Los marcadores `CAPTURA REAL PENDIENTE` de los documentos deben reemplazarse por pantallazos del sistema ejecutándose en el computador antes de entregar.
