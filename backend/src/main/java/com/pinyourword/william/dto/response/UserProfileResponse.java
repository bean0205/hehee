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
public class UserProfileResponse {
    
    private UUID uuid;
    private String username;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private String coverUrl;
    private String email;
    private UserStatsResponse stats;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserStatsResponse {
        private Long visitedCountriesCount;
        private Long visitedCitiesCount;
        private Long totalPinsCount;
        private Long followersCount;
        private Long followingCount;
    }
}
