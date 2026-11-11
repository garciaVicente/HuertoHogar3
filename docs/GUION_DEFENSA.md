# Guion breve de defensa — HuertoHogar EP3

## 1. Arquitectura
"El proyecto conserva React y Vite en el frontend. Ahora se comunica mediante fetch con una API REST desarrollada en Spring Boot. El backend utiliza Spring Security y JWT, y guarda la información en MySQL."

## 2. Modelo de datos
"Se usan cinco tablas: usuario, boleta, detalle_boleta, producto y categoria. Un usuario puede tener varias boletas; una boleta contiene varios detalles; cada detalle referencia un producto; cada producto pertenece a una categoría."

## 3. Roles
"ADMIN puede administrar todo. VENDEDOR solo consulta productos, detalle de productos, boletas y detalle de boletas. CLIENTE solo usa la tienda y el flujo de compra. Los permisos no se controlan solo ocultando botones: Spring Security los aplica en el backend."

## 4. JWT
"Al registrarse o iniciar sesión, el backend entrega un token JWT con el correo y el rol. React lo envía en Authorization: Bearer para las rutas privadas. Las contraseñas se guardan con BCrypt."

## 5. Stock y carrito
"El stock se valida en React para dar respuesta inmediata, pero también en el servidor. El carrito permite hasta 20 unidades por producto y no puede superar el stock real. Al confirmar una compra, Spring abre una transacción y bloquea la fila del producto para impedir sobreventa. Si el pago simulado se aprueba, descuenta stock; si se rechaza, no lo descuenta."

## 6. API versionada
"La versión 1 entrega datos básicos de productos. La versión 2 entrega más detalle. Swagger permite revisar las rutas y probarlas con el JWT."

## 7. Demostración sugerida
1. Iniciar MySQL con Docker Compose.
2. Iniciar Spring Boot.
3. Mostrar Swagger y GET /api/v2/productos.
4. Iniciar sesión como ADMIN y crear un producto con stock 20.
5. Intentar guardar nombre 123 y stock negativo; explicar el rechazo.
6. Iniciar sesión como CLIENTE, agregar 20 unidades y comprobar que el botón + se bloquea.
7. Intentar enviar 21 unidades desde Swagger o modificar la solicitud; mostrar HTTP 400.
8. Comprar 2 unidades con pago aprobado y verificar que el stock queda en 18.
9. Iniciar sesión como VENDEDOR y mostrar que puede consultar productos/boletas pero no editar.
