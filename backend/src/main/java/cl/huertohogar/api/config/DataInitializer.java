package cl.huertohogar.api.config;

import cl.huertohogar.api.repository.CategoriaRepository;
import cl.huertohogar.api.repository.ProductoRepository;
import cl.huertohogar.api.repository.UsuarioRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean CommandLineRunner loadInitialData(UsuarioRepository users, CategoriaRepository categories, ProductoRepository products, PasswordEncoder encoder) {
        return args -> {
            if (users.findByEmail("admin@huertohogar.cl").isEmpty()) users.save("Administrador HuertoHogar","admin@huertohogar.cl",encoder.encode("Admin123!"),"ADMIN");
            if (users.findByEmail("vendedor@huertohogar.cl").isEmpty()) users.save("Vendedor HuertoHogar","vendedor@huertohogar.cl",encoder.encode("Vendedor123!"),"VENDEDOR");
            if (categories.findAll().isEmpty()) {
                categories.insert("frutas","Frutas"); categories.insert("verduras","Verduras"); categories.insert("despensa","Despensa");
            }
            if (products.findAll().isEmpty()) {
                products.insert("Manzanas Orgánicas","Manzanas rojas crujientes y libres de pesticidas por kilo.",new BigDecimal("2500"),20,"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",0,"frutas");
                products.insert("Tomates Limachinos","Tomates de sabor intenso cultivados localmente por kilo.",new BigDecimal("1800"),3,"https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",0,"verduras");
                products.insert("Miel Orgánica Natural","Miel 100% pura de floración nativa, frasco de 500g.",new BigDecimal("5500"),20,"https://images.unsplash.com/photo-1613548058193-1cd24c1bebcf?w=400",15,"despensa");
                products.insert("Espinaca Fresca","Manojo de espinaca recién cosechada, rica en hierro.",new BigDecimal("1200"),2,"https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",0,"verduras");
                products.insert("Naranjas de Cítrico","Jugosas naranjas de estación por kilo.",new BigDecimal("2200"),12,"https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400",0,"frutas");
                products.insert("Aceite de Oliva Extra Virgen","Prensado en frío, botella de cristal de 1 litro.",new BigDecimal("7900"),10,"https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400",10,"despensa");
            }
        };
    }
}
