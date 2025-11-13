package com.pinyourword.william.dto.auth;

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
    
    private String accessToken;
    private String tokenType = "Bearer";
    private Long expiresIn; // in seconds
    private UserInfo user;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private UUID uuid;
        private String email;
        private String username;
        private String displayName;
        private String avatarUrl;
        private String coverUrl;
        private String bio;
        private String profileVisibility;
        private String subscriptionStatus;
        private Integer visitedCountriesCount;
        private Integer visitedCitiesCount;
        private Integer totalPinsCount;
    }
}
