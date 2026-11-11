package cl.huertohogar.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import cl.huertohogar.api.dto.CatalogDtos.*;
import cl.huertohogar.api.service.CatalogoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/productos")
public class ProductoV2Controller {
    private final CatalogoService catalog;
    public ProductoV2Controller(CatalogoService catalog) { this.catalog = catalog; }
    @GetMapping public List<ProductoResponse> all() { return catalog.products(); }
    @GetMapping("/{id}") public ProductoResponse get(@PathVariable Long id) { return catalog.product(id); }
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED) public ProductoResponse create(@Valid @RequestBody ProductoRequest request) { return catalog.create(request); }
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}") public ProductoResponse update(@PathVariable Long id, @Valid @RequestBody ProductoRequest request) { return catalog.update(id,request); }
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}") @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) { catalog.delete(id); }
}
