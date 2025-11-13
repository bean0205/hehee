package com.pinyourword.william.dto.auth;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    @Size(max = 100, message = "Display name must not exceed 100 characters")
    private String displayName;
    
    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;
    
    private String avatarUrl;
    
    private String coverUrl;
    
    private String profileVisibility; // public, private
    
    private String notesVisibility; // private, followers, public
    
    private String bucketlistVisibility; // private, followers, public
}
