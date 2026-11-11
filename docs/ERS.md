# ERS HuertoHogar — Versión 3.0

Documento actualizado para la Evaluación Parcial 3. La versión editable completa está en `ERS.docx`.

## Alcance
Frontend React/Vite + Bootstrap, backend Spring Boot, MySQL, API REST versionada, Swagger, JWT y control de acceso por roles.

## Roles
- ADMIN: acceso total.
- VENDEDOR: solo consulta productos, detalle de productos, boletas y detalle de boletas.
- CLIENTE: tienda, carrito y checkout.

## Validaciones
- Nombres: letras Unicode y espacios; `123` y `Juan123` se rechazan.
- Correo: se rechaza `aaaaa@.gmail.com`.
- Stock: entero >= 0; stock 20 es válido.
- Carrito: máximo 20 unidades por producto y no más que stock.
- Compra: backend vuelve a validar con transacción y bloqueo de fila.
- Pago rechazado: no descuenta stock.

## Modelo
USUARIO, BOLETA, DETALLE_BOLETA, PRODUCTO y CATEGORIA, con relaciones uno a muchos según el diagrama incluido en `figuras/modelo_datos.png`.
