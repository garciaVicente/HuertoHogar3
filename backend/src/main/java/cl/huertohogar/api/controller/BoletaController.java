package cl.huertohogar.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import cl.huertohogar.api.dto.OrderDtos.*;
import cl.huertohogar.api.service.BoletaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/boletas")
public class BoletaController {
    private final BoletaService orders;
    public BoletaController(BoletaService orders) { this.orders = orders; }
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED) public OrderResponse create(@Valid @RequestBody CreateOrderRequest request) { return orders.create(request); }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping public List<OrderResponse> all() { return orders.all(); }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}") public OrderResponse get(@PathVariable Long id) { return orders.get(id); }
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/estado") public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) { return orders.updateStatus(id,request.estado()); }
}
