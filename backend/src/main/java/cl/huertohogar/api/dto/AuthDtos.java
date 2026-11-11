package cl.huertohogar.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}
    public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 80) @Pattern(regexp = "^[\\p{L}]+(?: +[\\p{L}]+)*$", message = "El nombre solo puede contener letras y espacios") String nombre,
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(min = 8, max = 72) String password
    ) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}
    public record UserResponse(Long id, String nombre, String email, String rol) {}
    public record AuthResponse(String token, UserResponse usuario) {}
}
