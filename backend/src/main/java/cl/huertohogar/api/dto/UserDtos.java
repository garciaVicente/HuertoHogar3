package cl.huertohogar.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public final class UserDtos {
    private UserDtos() {}
    public record UpdateRoleRequest(@NotBlank @Pattern(regexp = "ADMIN|VENDEDOR|CLIENTE") String rol) {}
}
