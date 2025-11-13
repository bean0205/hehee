package com.pinyourword.william.service;


import com.pinyourword.william.dto.response.UserProfileResponse;
import com.pinyourword.william.entity.User;
import com.pinyourword.william.exception.ResourceNotFoundException;
import com.pinyourword.william.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
//    private final FollowRelationshipRepository followRepository;
    
    @Transactional(readOnly = true)
    public UserProfileResponse getCurrentUserProfile(UUID userUuid) {
        User user = userRepository.findByUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userUuid));
        
        return mapToProfileResponse(user, true);
    }
    
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfileByUsername(String username) {
        User user = userRepository.findByUsernameAndNotDeleted(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        
        return mapToProfileResponse(user, false);
    }
    
    @Transactional
    public UserProfileResponse updateProfile(UUID userUuid, String displayName, String bio) {
        User user = userRepository.findByUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userUuid));
        
        if (displayName != null) {
            user.setDisplayName(displayName);
        }
        if (bio != null) {
            user.setBio(bio);
        }
        
        user = userRepository.save(user);
        return mapToProfileResponse(user, true);
    }
    
    @Transactional
    public void deleteAccount(UUID userUuid) {
        User user = userRepository.findByUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userUuid));
        
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }
    
    private UserProfileResponse mapToProfileResponse(User user, boolean includeEmail) {
        // Use denormalized stats from user table
//        long followersCount = followRepository.countFollowersByUserId(user.getId());
//        long followingCount = followRepository.countFollowingByUserId(user.getId());
        
        UserProfileResponse.UserStatsResponse stats = UserProfileResponse.UserStatsResponse.builder()
                .visitedCountriesCount(user.getVisitedCountriesCount().longValue())
                .visitedCitiesCount(user.getVisitedCitiesCount().longValue())
                .totalPinsCount(user.getTotalPinsCount().longValue())
//                .followersCount(followersCount)
//                .followingCount(followingCount)
                .build();
        
        return UserProfileResponse.builder()
                .uuid(user.getUuid())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .coverUrl(user.getCoverUrl())
                .email(includeEmail ? user.getEmail() : null)
                .stats(stats)
                .build();
    }
}
