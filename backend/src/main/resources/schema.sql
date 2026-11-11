CREATE TABLE IF NOT EXISTS usuario (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  rol VARCHAR(20) NOT NULL,
  CONSTRAINT ck_usuario_rol CHECK (rol IN ('ADMIN','VENDEDOR','CLIENTE'))
);
CREATE TABLE IF NOT EXISTS categoria (
  id VARCHAR(60) PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS producto (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500),
  precio DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen VARCHAR(500),
  descuento INT NOT NULL DEFAULT 0,
  categoria_id VARCHAR(60) NOT NULL,
  CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id),
  CONSTRAINT ck_producto_precio CHECK (precio > 0),
  CONSTRAINT ck_producto_stock CHECK (stock >= 0),
  CONSTRAINT ck_producto_descuento CHECK (descuento BETWEEN 0 AND 90)
);
CREATE TABLE IF NOT EXISTS boleta (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  numero VARCHAR(40) NOT NULL UNIQUE,
  fecha DATETIME NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  usuario_id BIGINT NOT NULL,
  direccion_entrega VARCHAR(180) NOT NULL,
  comuna VARCHAR(80) NOT NULL,
  region VARCHAR(80) NOT NULL,
  metodo_entrega VARCHAR(20) NOT NULL,
  CONSTRAINT fk_boleta_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);
CREATE TABLE IF NOT EXISTS detalle_boleta (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  boleta_id BIGINT NOT NULL,
  producto_id BIGINT NOT NULL,
  nombre_producto VARCHAR(100) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_detalle_boleta FOREIGN KEY (boleta_id) REFERENCES boleta(id),
  CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES producto(id),
  CONSTRAINT ck_detalle_cantidad CHECK (cantidad BETWEEN 1 AND 20)
);
