package com.pinyourword.william.controller;


import com.pinyourword.william.dto.request.*;
import com.pinyourword.william.dto.response.ApiResponse;
import com.pinyourword.william.dto.response.AuthResponse;
import com.pinyourword.william.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User authentication and account management APIs")
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account with email and password")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login", description = "Login with email/username and password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
    
    @PostMapping("/social-login")
    @Operation(summary = "Social login", description = "Login or register with Google/Apple")
    public ResponseEntity<ApiResponse<AuthResponse>> socialLogin(@Valid @RequestBody SocialLoginRequest request) {
        AuthResponse response = authService.socialLogin(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
    
    @GetMapping("/me")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get current user", description = "Get the authenticated user's profile")
    public ResponseEntity<ApiResponse<AuthResponse.UserResponse>> getCurrentUser(Authentication authentication) {
        UUID userUuid = (UUID) authentication.getPrincipal();
        AuthResponse.UserResponse userInfo = authService.getCurrentUser(userUuid);
        return ResponseEntity.ok(ApiResponse.success(userInfo));
    }
    
    @PutMapping("/profile")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Update profile", description = "Update the authenticated user's profile")
    public ResponseEntity<ApiResponse<AuthResponse.UserResponse>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        UUID userUuid = (UUID) authentication.getPrincipal();
        AuthResponse.UserResponse userInfo = authService.updateProfile(userUuid, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", userInfo));
    }
    
    @PutMapping("/change-password")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Change password", description = "Change the authenticated user's password")
    public ResponseEntity<ApiResponse<Map<String, String>>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        UUID userUuid = (UUID) authentication.getPrincipal();
        authService.changePassword(userUuid, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", 
                Map.of("message", "Password changed successfully")));
    }
    
    @DeleteMapping("/account")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Delete account", description = "Soft delete the authenticated user's account")
    public ResponseEntity<ApiResponse<Map<String, String>>> deleteAccount(Authentication authentication) {
        UUID userUuid = (UUID) authentication.getPrincipal();
        authService.deleteAccount(userUuid);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", 
                Map.of("message", "Account deleted successfully")));
    }
    
    @GetMapping("/check-email")
    @Operation(summary = "Check email availability", description = "Check if an email is already registered")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkEmail(@RequestParam String email) {
        boolean available = !authService.isEmailTaken(email);
        return ResponseEntity.ok(ApiResponse.success(Map.of("available", available)));
    }
    
    @GetMapping("/check-username")
    @Operation(summary = "Check username availability", description = "Check if a username is already taken")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkUsername(@RequestParam String username) {
        boolean available = !authService.isUsernameTaken(username);
        return ResponseEntity.ok(ApiResponse.success(Map.of("available", available)));
    }
}
