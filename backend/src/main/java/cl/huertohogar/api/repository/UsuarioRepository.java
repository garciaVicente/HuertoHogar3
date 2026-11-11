package cl.huertohogar.api.repository;

import cl.huertohogar.api.model.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class UsuarioRepository {
    private final JdbcTemplate jdbc;
    public UsuarioRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public Optional<Usuario> findByEmail(String email) {
        return jdbc.query("SELECT * FROM usuario WHERE email = ?", (rs, n) -> new Usuario(rs.getLong("id"), rs.getString("nombre"), rs.getString("email"), rs.getString("password_hash"), rs.getString("rol")), email).stream().findFirst();
    }
    public Optional<Usuario> findById(Long id) {
        return jdbc.query("SELECT * FROM usuario WHERE id = ?", (rs, n) -> new Usuario(rs.getLong("id"), rs.getString("nombre"), rs.getString("email"), rs.getString("password_hash"), rs.getString("rol")), id).stream().findFirst();
    }
    public List<Usuario> findAll() {
        return jdbc.query("SELECT * FROM usuario ORDER BY id", (rs, n) -> new Usuario(rs.getLong("id"), rs.getString("nombre"), rs.getString("email"), rs.getString("password_hash"), rs.getString("rol")));
    }
    public Long save(String nombre, String email, String passwordHash, String rol) {
        jdbc.update("INSERT INTO usuario(nombre,email,password_hash,rol) VALUES(?,?,?,?)", nombre, email, passwordHash, rol);
        return jdbc.queryForObject("SELECT id FROM usuario WHERE email = ?", Long.class, email);
    }
    public void updateRole(Long id, String rol) { jdbc.update("UPDATE usuario SET rol=? WHERE id=?", rol, id); }
    public void delete(Long id) { jdbc.update("DELETE FROM usuario WHERE id=?", id); }
}
