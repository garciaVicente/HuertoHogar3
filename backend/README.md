# Backend HuertoHogar API

Java 21 · Spring Boot 3.4 · Spring Security · JWT · JDBC · MySQL 8 · Swagger.

## Ejecutar

1. `docker compose up -d` (inicia MySQL en puerto 3307).
2. Desde esta carpeta: `mvn spring-boot:run`.
3. Swagger: `http://localhost:8080/swagger-ui/index.html`.

La base de datos y las tablas se crean con `schema.sql`. `DataInitializer` inserta categorías, seis productos y cuentas ADMIN/VENDEDOR si todavía no existen.

## Configuración

Variables opcionales: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`. El secreto incluido en `application.properties` es solo para demostración académica.

## Pruebas

`mvn test`
