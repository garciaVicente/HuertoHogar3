package cl.huertohogar.api.repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class BoletaRepository {
    private final JdbcTemplate jdbc;
    public BoletaRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }
    public Long insert(String numero, LocalDateTime fecha, BigDecimal total, String estado, Long usuarioId,
                       String direccion, String comuna, String region, String metodoEntrega) {
        KeyHolder key = new GeneratedKeyHolder();
        jdbc.update(connection -> {
            var ps = connection.prepareStatement("INSERT INTO boleta(numero,fecha,total,estado,usuario_id,direccion_entrega,comuna,region,metodo_entrega) VALUES(?,?,?,?,?,?,?,?,?)", new String[]{"id"});
            ps.setString(1, numero); ps.setTimestamp(2, Timestamp.valueOf(fecha)); ps.setBigDecimal(3, total); ps.setString(4, estado); ps.setLong(5, usuarioId); ps.setString(6, direccion); ps.setString(7, comuna); ps.setString(8, region); ps.setString(9, metodoEntrega); return ps;
        }, key);
        return key.getKey().longValue();
    }
    public void insertDetail(Long boletaId, Long productoId, String nombre, int cantidad, BigDecimal precio, BigDecimal subtotal) {
        jdbc.update("INSERT INTO detalle_boleta(boleta_id,producto_id,nombre_producto,cantidad,precio_unitario,subtotal) VALUES(?,?,?,?,?,?)", boletaId, productoId, nombre, cantidad, precio, subtotal);
    }
    public List<MapRow> findAll() {
        return jdbc.query("SELECT b.*,u.nombre nombre_cliente,u.email email_cliente FROM boleta b JOIN usuario u ON u.id=b.usuario_id ORDER BY b.fecha DESC", (rs,n) -> new MapRow(rs.getLong("id"),rs.getString("numero"),rs.getTimestamp("fecha").toLocalDateTime(),rs.getBigDecimal("total"),rs.getString("estado"),rs.getLong("usuario_id"),rs.getString("nombre_cliente"),rs.getString("email_cliente"),rs.getString("direccion_entrega"),rs.getString("comuna"),rs.getString("region"),rs.getString("metodo_entrega")));
    }
    public java.util.Optional<MapRow> findById(Long id) {
        return jdbc.query("SELECT b.*,u.nombre nombre_cliente,u.email email_cliente FROM boleta b JOIN usuario u ON u.id=b.usuario_id WHERE b.id=?", (rs,n) -> new MapRow(rs.getLong("id"),rs.getString("numero"),rs.getTimestamp("fecha").toLocalDateTime(),rs.getBigDecimal("total"),rs.getString("estado"),rs.getLong("usuario_id"),rs.getString("nombre_cliente"),rs.getString("email_cliente"),rs.getString("direccion_entrega"),rs.getString("comuna"),rs.getString("region"),rs.getString("metodo_entrega")), id).stream().findFirst();
    }
    public List<DetailRow> findDetails(Long id) {
        return jdbc.query("SELECT producto_id,nombre_producto,cantidad,precio_unitario,subtotal FROM detalle_boleta WHERE boleta_id=? ORDER BY id", (rs,n) -> new DetailRow(rs.getLong("producto_id"),rs.getString("nombre_producto"),rs.getInt("cantidad"),rs.getBigDecimal("precio_unitario"),rs.getBigDecimal("subtotal")), id);
    }
    public void updateStatus(Long id, String estado) { jdbc.update("UPDATE boleta SET estado=? WHERE id=?", estado, id); }
    public record MapRow(Long id,String numero,LocalDateTime fecha,BigDecimal total,String estado,Long usuarioId,String nombreCliente,String emailCliente,String direccion,String comuna,String region,String metodoEntrega) {}
    public record DetailRow(Long productoId,String nombre,int cantidad,BigDecimal precio,BigDecimal subtotal) {}
}
