package cl.huertohogar.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import cl.huertohogar.api.ApiException;
import cl.huertohogar.api.dto.AuthDtos.UserResponse;
import cl.huertohogar.api.dto.UserDtos.UpdateRoleRequest;
import cl.huertohogar.api.repository.UsuarioRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {
    private final UsuarioRepository users;
    public UsuarioController(UsuarioRepository users) { this.users = users; }
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping public List<UserResponse> all() { return users.findAll().stream().map(u -> new UserResponse(u.id(),u.nombre(),u.email(),u.rol())).toList(); }
    @SecurityRequirement(name = "bearerAuth")
    @PatchMapping("/{id}/rol") public UserResponse role(@PathVariable Long id, @Valid @RequestBody UpdateRoleRequest request) {
        if (users.findById(id).isEmpty()) throw ApiException.notFound("Usuario no encontrado");
        users.updateRole(id,request.rol()); var u = users.findById(id).orElseThrow(); return new UserResponse(u.id(),u.nombre(),u.email(),u.rol());
    }
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}") @org.springframework.web.bind.annotation.ResponseStatus(org.springframework.http.HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id) {
        if (users.findById(id).isEmpty()) throw ApiException.notFound("Usuario no encontrado");
        try { users.delete(id); } catch (Exception ex) { throw ApiException.conflict("No se puede eliminar un usuario con boletas asociadas"); }
    }
}
