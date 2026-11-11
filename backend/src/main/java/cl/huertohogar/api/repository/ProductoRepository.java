package cl.huertohogar.api.repository;

import cl.huertohogar.api.model.Producto;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class ProductoRepository {
    private final JdbcTemplate jdbc;
    private static final String SELECT = "SELECT p.id,p.nombre,p.descripcion,p.precio,p.stock,p.imagen,p.descuento,p.categoria_id,c.nombre categoria_nombre FROM producto p JOIN categoria c ON c.id=p.categoria_id";
    public ProductoRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public List<Producto> findAll() { return jdbc.query(SELECT + " ORDER BY p.id", this::map); }
    public List<Producto> findAllBasic() { return findAll(); }
    public Optional<Producto> findById(Long id) { return jdbc.query(SELECT + " WHERE p.id=?", this::map, id).stream().findFirst(); }
    public Optional<Producto> findByIdForUpdate(Long id) { return jdbc.query(SELECT + " WHERE p.id=? FOR UPDATE", this::map, id).stream().findFirst(); }
    public Long insert(String nombre, String descripcion, BigDecimal precio, Integer stock, String imagen, Integer descuento, String categoriaId) {
        jdbc.update("INSERT INTO producto(nombre,descripcion,precio,stock,imagen,descuento,categoria_id) VALUES(?,?,?,?,?,?,?)", nombre, descripcion, precio, stock, imagen, descuento, categoriaId);
        return jdbc.queryForObject("SELECT LAST_INSERT_ID()", Long.class);
    }
    public void update(Long id, String nombre, String descripcion, BigDecimal precio, Integer stock, String imagen, Integer descuento, String categoriaId) {
        jdbc.update("UPDATE producto SET nombre=?,descripcion=?,precio=?,stock=?,imagen=?,descuento=?,categoria_id=? WHERE id=?", nombre, descripcion, precio, stock, imagen, descuento, categoriaId, id);
    }
    public void updateStock(Long id, int newStock) { jdbc.update("UPDATE producto SET stock=? WHERE id=?", newStock, id); }
    public void delete(Long id) { jdbc.update("DELETE FROM producto WHERE id=?", id); }
    private Producto map(java.sql.ResultSet rs, int n) throws java.sql.SQLException {
        return new Producto(rs.getLong("id"), rs.getString("nombre"), rs.getString("descripcion"), rs.getBigDecimal("precio"), rs.getInt("stock"), rs.getString("imagen"), rs.getInt("descuento"), rs.getString("categoria_id"), rs.getString("categoria_nombre"));
    }
}
