package com.pinyourword.william.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SocialLoginRequest {
    
    @NotNull(message = "Provider is required")
    private SocialProvider provider;
    
    @NotBlank(message = "ID token is required")
    private String idToken;
    
    // Optional: For pre-filling user data
    private String email;
    private String displayName;
    private String avatarUrl;
    
    public enum SocialProvider {
        GOOGLE,
        APPLE
    }
}
