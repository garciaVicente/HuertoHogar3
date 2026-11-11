# Plan de pruebas y validaciones — HuertoHogar EP3

## Validaciones funcionales

| ID | Entrada / acción | Resultado esperado | Capa |
|---|---|---|---|
| VAL-01 | Nombre `123` | Rechazado | React + API |
| VAL-02 | Nombre `Juan123` | Rechazado | React + API |
| VAL-03 | Nombre `María Soto` | Aceptado | React + API |
| VAL-04 | Correo `aaaaa@.gmail.com` | Rechazado | React + API |
| VAL-05 | Correo `ana.perez@gmail.com` | Aceptado | React + API |
| VAL-06 | Stock `20` | Aceptado | React + API |
| VAL-07 | Stock `-1` | Rechazado | React + API |
| VAL-08 | Stock `2.5` | Rechazado | React + API |
| VAL-09 | Carrito `20` unidades | Aceptado si stock >= 20 | React + API |
| VAL-10 | Carrito `21` unidades | Rechazado | React + API |
| VAL-11 | Comprar 100 con stock 20 | HTTP 400, no se registra compra pagada ni se descuenta stock | Spring Boot + MySQL |
| VAL-12 | Pago aprobado por 2 unidades, stock 20 | Boleta PAGADA y stock 18 | Spring Boot + MySQL |
| VAL-13 | Pago rechazado | Boleta RECHAZADA, stock sin cambios | Spring Boot + MySQL |
| SEC-01 | Vendedor intenta editar producto | HTTP 403 | Spring Security |
| SEC-02 | Cliente intenta acceder a administración | HTTP 403 / redirección en frontend | React + Spring Security |
| SEC-03 | Admin administra productos y usuarios | Permitido | React + Spring Security |

## Pruebas automatizadas incluidas

- Frontend: `tests/Validation.spec.jsx`, `tests/Stock.spec.jsx` y pruebas previas de formularios, catálogo, carrito y administración.
- Backend: `backend/src/test/java/cl/huertohogar/api/ValidationRulesTest.java` comprueba nombre de producto, stock y máximo de 20 unidades.

## Estado de ejecución

Las funciones JavaScript de validación y stock se ejecutaron directamente en Node.js y las 16 comprobaciones reportaron PASS. Los archivos JS/JSX pasaron comprobación sintáctica. Las pruebas Jasmine/Karma completas y JUnit/Maven deben ejecutarse en el equipo con dependencias instaladas y servicios disponibles; no se informa un resultado no ejecutado.
