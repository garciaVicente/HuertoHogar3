package cl.huertohogar.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class OrderDtos {
    private OrderDtos() {}
    public record ItemRequest(@NotNull Long productoId, @NotNull @Min(1) @Max(20) Integer cantidad) {}
    public record CreateOrderRequest(
        @NotEmpty @Size(max = 50) List<@Valid ItemRequest> items,
        @NotBlank @Size(max = 180) String direccion,
        @NotBlank @Size(max = 80) String comuna,
        @NotBlank @Size(max = 80) String region,
        @NotBlank @Pattern(regexp = "domicilio|retiro") String metodoEntrega,
        @NotNull Boolean pagoAprobado
    ) {}
    public record OrderItemResponse(Long productoId, String nombre, Integer cantidad, BigDecimal precio, BigDecimal subtotal) {}
    public record OrderResponse(Long id, String numero, LocalDateTime fecha, BigDecimal total, String estado,
        Long usuarioId, String nombreCliente, String emailCliente, String direccion, String comuna, String region,
        String metodoEntrega, List<OrderItemResponse> items) {}
    public record UpdateOrderStatusRequest(@NotBlank String estado) {}
}
