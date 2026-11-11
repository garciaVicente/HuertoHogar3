package cl.huertohogar.api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean OpenAPI huertoOpenApi() {
        return new OpenAPI()
            .info(new Info().title("HuertoHogar API").version("1.0.0").description("API REST para catálogo, categorías, usuarios y boletas de HuertoHogar. Autenticación JWT y roles ADMIN, VENDEDOR y CLIENTE."))
            .components(new Components().addSecuritySchemes("bearerAuth", new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }
}
