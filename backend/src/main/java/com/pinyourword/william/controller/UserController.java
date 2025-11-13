package com.pinyourword.william.controller;


import com.pinyourword.william.dto.response.ApiResponse;
import com.pinyourword.william.dto.response.UserProfileResponse;
import com.pinyourword.william.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User management APIs")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/me")
    @Operation(summary = "Get current user profile", description = "Get the profile of the authenticated user")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getCurrentUser(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        UserProfileResponse profile = userService.getCurrentUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
    
    @PatchMapping("/me")
    @Operation(summary = "Update current user profile", description = "Update display name, bio, etc.")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            Authentication authentication,
            @RequestBody Map<String, String> updates) {
        UUID userId = (UUID) authentication.getPrincipal();
        String displayName = updates.get("display_name");
        String bio = updates.get("bio");
        
        UserProfileResponse profile = userService.updateProfile(userId, displayName, bio);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }
    
    @DeleteMapping("/me")
    @Operation(summary = "Delete account", description = "Soft delete the user account")
    public ResponseEntity<ApiResponse<Void>> deleteAccount(Authentication authentication) {
        UUID userId = (UUID) authentication.getPrincipal();
        userService.deleteAccount(userId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{username}")
    @Operation(summary = "Get user by username", description = "Get public profile of a user by username")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getUserByUsername(@PathVariable String username) {
        UserProfileResponse profile = userService.getUserProfileByUsername(username);
        return ResponseEntity.ok(ApiResponse.success(profile));
    }
}
