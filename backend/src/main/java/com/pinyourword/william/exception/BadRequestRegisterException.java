package com.pinyourword.william.exception;

import java.util.Map;

public class BadRequestRegisterException extends RuntimeException {
    private final Map<String, String> errors;

    public BadRequestRegisterException(String message, Map<String, String> errors) {
        super(message);
        this.errors = errors;
    }

    public Map<String, String> getErrors() {
        return errors;
    }

}
