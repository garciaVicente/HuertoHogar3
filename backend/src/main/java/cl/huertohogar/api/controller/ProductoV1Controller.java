package cl.huertohogar.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import cl.huertohogar.api.dto.CatalogDtos.*;
import cl.huertohogar.api.service.CatalogoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoV1Controller {
    private final CatalogoService catalog;
    public ProductoV1Controller(CatalogoService catalog) { this.catalog = catalog; }
    @GetMapping public List<ProductoBasico> all() { return catalog.basicProducts(); }
    @GetMapping("/{id}") public ProductoBasico get(@PathVariable Long id) { var p = catalog.product(id); return new ProductoBasico(p.id(),p.nombre(),p.precio(),p.stock(),p.category()); }
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED) public ProductoResponse create(@Valid @RequestBody ProductoRequest request) { return catalog.create(request); }
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}") public ProductoResponse update(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) { return catalog.update(id,request); }
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}") @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { catalog.delete(id); }
}
