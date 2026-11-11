package cl.huertohogar.api;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import cl.huertohogar.api.dto.CatalogDtos.ProductoRequest;
import cl.huertohogar.api.dto.AuthDtos.RegisterRequest;
import cl.huertohogar.api.dto.OrderDtos.ItemRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

class ValidationRulesTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test void productNameMustContainLettersOnly() {
        var invalid = new ProductoRequest("123", "", new BigDecimal("2500"), 20, "", 0, "frutas");
        var valid = new ProductoRequest("Manzanas Organicas", "", new BigDecimal("2500"), 20, "", 0, "frutas");
        assertFalse(validator.validate(invalid).isEmpty());
        assertTrue(validator.validate(valid).isEmpty());
    }

    @Test void stockMustBeZeroOrGreaterAndInteger() {
        var negative = new ProductoRequest("Manzanas", "", new BigDecimal("2500"), -1, "", 0, "frutas");
        var valid = new ProductoRequest("Manzanas", "", new BigDecimal("2500"), 20, "", 0, "frutas");
        assertFalse(validator.validate(negative).isEmpty());
        assertTrue(validator.validate(valid).isEmpty());
    }


    @Test void registrationRejectsNumericNameAndMalformedEmail() {
        var invalid = new RegisterRequest("123", "aaaaa@.gmail.com", "ClaveSegura123");
        var valid = new RegisterRequest("María Soto", "maria.soto@gmail.com", "ClaveSegura123");
        assertFalse(validator.validate(invalid).isEmpty());
        assertTrue(validator.validate(valid).isEmpty());
    }

    @Test void cartQuantityCannotExceedTwenty() {
        assertTrue(validator.validate(new ItemRequest(1L, 20)).isEmpty());
        assertFalse(validator.validate(new ItemRequest(1L, 21)).isEmpty());
    }
}
