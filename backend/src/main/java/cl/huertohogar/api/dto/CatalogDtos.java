package cl.huertohogar.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public final class CatalogDtos {
    private CatalogDtos() {}
    public record CategoriaRequest(
        @NotBlank @Size(min = 2, max = 80) @Pattern(regexp = "^[\\p{L}]+(?: +[\\p{L}]+)*$", message = "La categoría solo puede contener letras y espacios") String nombre
    ) {}
    public record CategoriaResponse(String id, String nombre) {}
    public record ProductoRequest(
        @NotBlank @Size(min = 3, max = 100) @Pattern(regexp = "^[\\p{L}]+(?: +[\\p{L}]+)*$", message = "El nombre del producto solo puede contener letras y espacios") String nombre,
        @Size(max = 500) String descripcion,
        @NotNull @DecimalMin("1.00") @Digits(integer = 10, fraction = 0) BigDecimal precio,
        @NotNull @Min(0) Integer stock,
        @Size(max = 500) String imagen,
        @NotNull @Min(0) @Max(90) Integer descuento,
        @NotBlank String categoriaId
    ) {}
    public record ProductoBasico(Long id, String nombre, BigDecimal precio, Integer stock, String categoria) {}
    public record ProductoResponse(Long id, String nombre, String descripcion, BigDecimal precio, Integer stock, String imagen, Integer descuento, String category, String categoryName) {}
}
