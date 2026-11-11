package cl.huertohogar.api.service;

import cl.huertohogar.api.ApiException;
import cl.huertohogar.api.dto.OrderDtos.*;
import cl.huertohogar.api.model.Producto;
import cl.huertohogar.api.model.Usuario;
import cl.huertohogar.api.repository.BoletaRepository;
import cl.huertohogar.api.repository.ProductoRepository;
import cl.huertohogar.api.repository.UsuarioRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BoletaService {
    private static final int MAX_PER_PRODUCT = 20;
    private final BoletaRepository orders;
    private final ProductoRepository products;
    private final UsuarioRepository users;
    public BoletaService(BoletaRepository orders, ProductoRepository products, UsuarioRepository users) { this.orders = orders; this.products = products; this.users = users; }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario user = users.findByEmail(email).orElseThrow(() -> ApiException.unauthorized("Debes iniciar sesión para comprar"));
        var productIds = new java.util.HashSet<Long>();
        for (ItemRequest item : request.items()) {
            if (!productIds.add(item.productoId())) throw ApiException.badRequest("No repitas el mismo producto en la solicitud; suma sus cantidades en una sola línea");
        }
        BigDecimal total = BigDecimal.ZERO;
        var prepared = new java.util.ArrayList<PreparedItem>();
        for (ItemRequest item : request.items()) {
            if (item.cantidad() > MAX_PER_PRODUCT) throw ApiException.badRequest("El carrito permite máximo 20 unidades por producto");
            Producto product = products.findByIdForUpdate(item.productoId()).orElseThrow(() -> ApiException.notFound("Producto " + item.productoId() + " no encontrado"));
            if (item.cantidad() > product.stock()) throw ApiException.badRequest("Stock insuficiente de " + product.nombre() + ". Disponible: " + product.stock() + ", solicitado: " + item.cantidad());
            BigDecimal price = product.precio().multiply(BigDecimal.valueOf(100 - product.descuento())).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(item.cantidad())).setScale(2, RoundingMode.HALF_UP);
            total = total.add(subtotal);
            prepared.add(new PreparedItem(product,item.cantidad(),price,subtotal));
        }
        boolean paid = request.pagoAprobado();
        LocalDateTime now = LocalDateTime.now();
        String number = "HH-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Long id = orders.insert(number,now,total,paid ? "PAGADA" : "RECHAZADA",user.id(),request.direccion().trim(),request.comuna().trim(),request.region().trim(),request.metodoEntrega());
        for (PreparedItem item : prepared) {
            orders.insertDetail(id,item.product.id(),item.product.nombre(),item.quantity,item.price,item.subtotal);
            if (paid) products.updateStock(item.product.id(),item.product.stock() - item.quantity);
        }
        return get(id);
    }
    public List<OrderResponse> all() { return orders.findAll().stream().map(row -> response(row)).toList(); }
    public OrderResponse get(Long id) {
        var row = orders.findById(id).orElseThrow(() -> ApiException.notFound("Boleta no encontrada"));
        return response(row);
    }
    public OrderResponse updateStatus(Long id, String estado) {
        if (!List.of("PAGADA","RECHAZADA","PREPARANDO","ENTREGADA").contains(estado)) throw ApiException.badRequest("Estado de boleta inválido");
        if (orders.findById(id).isEmpty()) throw ApiException.notFound("Boleta no encontrada");
        orders.updateStatus(id,estado); return get(id);
    }
    private OrderResponse response(BoletaRepository.MapRow row) {
        List<OrderItemResponse> items = orders.findDetails(row.id()).stream().map(d -> new OrderItemResponse(d.productoId(),d.nombre(),d.cantidad(),d.precio(),d.subtotal())).toList();
        return new OrderResponse(row.id(),row.numero(),row.fecha(),row.total(),row.estado(),row.usuarioId(),row.nombreCliente(),row.emailCliente(),row.direccion(),row.comuna(),row.region(),row.metodoEntrega(),items);
    }
    private record PreparedItem(Producto product,int quantity,BigDecimal price,BigDecimal subtotal) {}
}
