package cl.huertohogar.api.service;

import cl.huertohogar.api.ApiException;
import cl.huertohogar.api.dto.AuthDtos.*;
import cl.huertohogar.api.model.Usuario;
import cl.huertohogar.api.repository.UsuarioRepository;
import cl.huertohogar.api.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UsuarioRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    public AuthService(UsuarioRepository users, PasswordEncoder encoder, JwtService jwt) { this.users = users; this.encoder = encoder; this.jwt = jwt; }
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (users.findByEmail(email).isPresent()) throw ApiException.conflict("Ya existe una cuenta con ese correo");
        Long id = users.save(request.nombre().trim(), email, encoder.encode(request.password()), "CLIENTE");
        Usuario user = users.findById(id).orElseThrow();
        return response(user);
    }
    public AuthResponse login(LoginRequest request) {
        Usuario user = users.findByEmail(request.email().trim().toLowerCase()).orElseThrow(() -> ApiException.unauthorized("Correo o contraseña incorrectos"));
        if (!encoder.matches(request.password(), user.passwordHash())) throw ApiException.unauthorized("Correo o contraseña incorrectos");
        return response(user);
    }
    public UserResponse current(String email) {
        Usuario user = users.findByEmail(email).orElseThrow(() -> ApiException.notFound("Usuario no encontrado"));
        return new UserResponse(user.id(), user.nombre(), user.email(), user.rol());
    }
    private AuthResponse response(Usuario user) {
        return new AuthResponse(jwt.generate(user.email(), user.rol()), new UserResponse(user.id(), user.nombre(), user.email(), user.rol()));
    }
}
