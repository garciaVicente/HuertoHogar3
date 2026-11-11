package cl.huertohogar.api.service;

import cl.huertohogar.api.ApiException;
import cl.huertohogar.api.dto.CatalogDtos.*;
import cl.huertohogar.api.model.Categoria;
import cl.huertohogar.api.model.Producto;
import cl.huertohogar.api.repository.CategoriaRepository;
import cl.huertohogar.api.repository.ProductoRepository;
import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class CatalogoService {
    private final ProductoRepository products;
    private final CategoriaRepository categories;
    public CatalogoService(ProductoRepository products, CategoriaRepository categories) { this.products = products; this.categories = categories; }
    public List<ProductoResponse> products() { return products.findAll().stream().map(this::detail).toList(); }
    public List<ProductoBasico> basicProducts() { return products.findAll().stream().map(p -> new ProductoBasico(p.id(),p.nombre(),p.precio(),p.stock(),p.categoriaId())).toList(); }
    public ProductoResponse product(Long id) { return detail(products.findById(id).orElseThrow(() -> ApiException.notFound("Producto no encontrado"))); }
    public ProductoResponse create(ProductoRequest r) {
        validateCategory(r.categoriaId());
        Long id = products.insert(r.nombre().trim(), clean(r.descripcion()), r.precio(), r.stock(), clean(r.imagen()), r.descuento(), r.categoriaId());
        return product(id);
    }
    public ProductoResponse update(Long id, ProductoRequest r) {
        if (products.findById(id).isEmpty()) throw ApiException.notFound("Producto no encontrado");
        validateCategory(r.categoriaId());
        products.update(id,r.nombre().trim(),clean(r.descripcion()),r.precio(),r.stock(),clean(r.imagen()),r.descuento(),r.categoriaId());
        return product(id);
    }
    public void delete(Long id) {
        if (products.findById(id).isEmpty()) throw ApiException.notFound("Producto no encontrado");
        try { products.delete(id); } catch (Exception ex) { throw ApiException.conflict("No se puede eliminar: el producto tiene detalles de boletas asociados"); }
    }
    public List<CategoriaResponse> categories() { return categories.findAll().stream().map(c -> new CategoriaResponse(c.id(),c.nombre())).toList(); }
    public CategoriaResponse createCategory(CategoriaRequest r) {
        String id = slug(r.nombre());
        if (categories.findById(id).isPresent()) throw ApiException.conflict("La categoría ya existe");
        categories.insert(id,r.nombre().trim()); return new CategoriaResponse(id,r.nombre().trim());
    }
    public CategoriaResponse updateCategory(String id, CategoriaRequest r) {
        if (categories.findById(id).isEmpty()) throw ApiException.notFound("Categoría no encontrada");
        categories.update(id,r.nombre().trim()); return new CategoriaResponse(id,r.nombre().trim());
    }
    public void deleteCategory(String id) {
        if (categories.findById(id).isEmpty()) throw ApiException.notFound("Categoría no encontrada");
        if (categories.hasProducts(id)) throw ApiException.conflict("Primero mueve o elimina los productos de esta categoría");
        categories.delete(id);
    }
    private void validateCategory(String id) { if (categories.findById(id).isEmpty()) throw ApiException.badRequest("Selecciona una categoría existente"); }
    private ProductoResponse detail(Producto p) { return new ProductoResponse(p.id(),p.nombre(),p.descripcion(),p.precio(),p.stock(),p.imagen(),p.descuento(),p.categoriaId(),p.categoriaNombre()); }
    private String clean(String value) { return value == null ? "" : value.trim(); }
    private String slug(String value) { return Normalizer.normalize(value.trim().toLowerCase(Locale.ROOT), Normalizer.Form.NFD).replaceAll("\\p{M}", "").replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", ""); }
}
