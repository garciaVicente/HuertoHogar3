package cl.huertohogar.api.model;

public record Usuario(Long id, String nombre, String email, String passwordHash, String rol) {}
