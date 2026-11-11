package cl.huertohogar.api.repository;

import cl.huertohogar.api.model.Categoria;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class CategoriaRepository {
    private final JdbcTemplate jdbc;
    public CategoriaRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public List<Categoria> findAll() { return jdbc.query("SELECT id,nombre FROM categoria ORDER BY nombre", (rs,n) -> new Categoria(rs.getString("id"), rs.getString("nombre"))); }
    public Optional<Categoria> findById(String id) { return jdbc.query("SELECT id,nombre FROM categoria WHERE id=?", (rs,n) -> new Categoria(rs.getString("id"), rs.getString("nombre")), id).stream().findFirst(); }
    public void insert(String id, String nombre) { jdbc.update("INSERT INTO categoria(id,nombre) VALUES(?,?)", id, nombre); }
    public void update(String id, String nombre) { jdbc.update("UPDATE categoria SET nombre=? WHERE id=?", nombre, id); }
    public void delete(String id) { jdbc.update("DELETE FROM categoria WHERE id=?", id); }
    public boolean hasProducts(String id) { return Boolean.TRUE.equals(jdbc.queryForObject("SELECT EXISTS(SELECT 1 FROM producto WHERE categoria_id=?)", Boolean.class, id)); }
}
