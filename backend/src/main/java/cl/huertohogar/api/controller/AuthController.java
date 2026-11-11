package cl.huertohogar.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import cl.huertohogar.api.dto.AuthDtos.*;
import cl.huertohogar.api.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService auth;
    public AuthController(AuthService auth) { this.auth = auth; }
    @PostMapping("/registro") @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.CREATED) public AuthResponse register(@Valid @RequestBody RegisterRequest request) { return auth.register(request); }
    @PostMapping("/login") public AuthResponse login(@Valid @RequestBody LoginRequest request) { return auth.login(request); }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me") public UserResponse me(Authentication authentication) { return auth.current(authentication.getName()); }
}
