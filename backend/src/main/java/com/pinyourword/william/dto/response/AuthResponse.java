package com.pinyourword.william.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private UserResponse user;
    private String accessToken;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserResponse {
        private UUID uuid;
        private String email;
        private String username;
        private String displayName;
        private String bio;
        private String avatarUrl;
        private String coverUrl;
    }
}
