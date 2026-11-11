package cl.huertohogar.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import cl.huertohogar.api.dto.CatalogDtos.CategoriaRequest;
import cl.huertohogar.api.dto.CatalogDtos.CategoriaResponse;
import cl.huertohogar.api.service.CatalogoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    private final CatalogoService catalog;
    public CategoriaController(CatalogoService catalog) { this.catalog = catalog; }
    @GetMapping public List<CategoriaResponse> all() { return catalog.categories(); }
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED) public CategoriaResponse create(@Valid @RequestBody CategoriaRequest request) { return catalog.createCategory(request); }
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}") public CategoriaResponse update(@PathVariable String id, @Valid @RequestBody CategoriaRequest request) { return catalog.updateCategory(id,request); }
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}") @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT) public void delete(@PathVariable String id) { catalog.deleteCategory(id); }
}
