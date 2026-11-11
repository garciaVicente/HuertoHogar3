package cl.huertohogar.api.model;

import java.math.BigDecimal;

public record Producto(Long id, String nombre, String descripcion, BigDecimal precio, Integer stock,
                       String imagen, Integer descuento, String categoriaId, String categoriaNombre) {}
