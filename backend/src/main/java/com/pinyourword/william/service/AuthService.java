package com.pinyourword.william.service;


import com.pinyourword.william.dto.request.*;
import com.pinyourword.william.dto.response.AuthResponse;
import com.pinyourword.william.entity.user.User;
import com.pinyourword.william.exception.BadRequestException;
import com.pinyourword.william.exception.ResourceNotFoundException;
import com.pinyourword.william.exception.UnauthorizedException;
import com.pinyourword.william.repository.UserRepository;
import com.pinyourword.william.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    
    @Value("${app.jwt.expiration}")
    private long jwtExpiration;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }
        
        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .displayName(request.getDisplayName() != null ? request.getDisplayName() : request.getUsername())
                .hashedPassword(passwordEncoder.encode(request.getPassword()))
                .visitedCountriesCount(0)
                .visitedCitiesCount(0)
                .totalPinsCount(0)
                .profileVisibility("public")
                .bucketlistVisibility("public")
                .notesVisibility("private")
                .subscriptionStatus("free")
                .build();
        
        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getUuid());
        
        // Generate JWT token
        String token = tokenProvider.generateToken(user.getUuid());
        
        return buildAuthResponse(token, user);
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("User attempting to login: {}", request.getEmailOrUsername());
        
        // Find user by email or username
        User user = findUserByEmailOrUsername(request.getEmailOrUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));
        
        // Check if user is deleted
        if (user.isDeleted()) {
            throw new UnauthorizedException("Account has been deleted");
        }
        
        // Check password
        if (user.getHashedPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        
        log.info("User logged in successfully: {}", user.getUuid());
        
        String token = tokenProvider.generateToken(user.getUuid());
        
        return buildAuthResponse(token, user);
    }
    
    @Transactional
    public AuthResponse socialLogin(SocialLoginRequest request) {
        log.info("Social login attempt with provider: {}", request.getProvider());
        
        // TODO: Verify ID token with provider (Google/Apple)
        String providerId = extractProviderIdFromToken(request);
        String email = request.getEmail();
        
        User user;
        
        // Check if user exists with this provider ID
        Optional<User> existingUser = findUserByProviderId(request.getProvider(), providerId);
        
        if (existingUser.isPresent()) {
            user = existingUser.get();
            
            if (user.isDeleted()) {
                throw new UnauthorizedException("Account has been deleted");
            }
            
            log.info("Existing social user logged in: {}", user.getUuid());
        } else {
            // Create new user
            String username = generateUsernameFromEmail(email);
            
            // Ensure username is unique
            int suffix = 1;
            String finalUsername = username;
            while (userRepository.existsByUsername(finalUsername)) {
                finalUsername = username + suffix;
                suffix++;
            }
            
            User newUser = User.builder()
                    .email(email)
                    .username(finalUsername)
                    .displayName(request.getDisplayName() != null ? request.getDisplayName() : finalUsername)
                    .avatarUrl(request.getAvatarUrl())
                    .profileVisibility("public")
                    .notesVisibility("private")
                    .bucketlistVisibility("public")
                    .subscriptionStatus("free")
                    .visitedCountriesCount(0)
                    .visitedCitiesCount(0)
                    .totalPinsCount(0)
                    .build();
            
            // Set provider ID
            if (request.getProvider() == SocialLoginRequest.SocialProvider.GOOGLE) {
                newUser.setGoogleId(providerId);
            } else if (request.getProvider() == SocialLoginRequest.SocialProvider.APPLE) {
                newUser.setAppleId(providerId);
            }
            
            user = userRepository.save(newUser);
            log.info("New social user registered: {}", user.getUuid());
        }
        
        String token = tokenProvider.generateToken(user.getUuid());
        
        return buildAuthResponse(token, user);
    }
    
    @Transactional(readOnly = true)
    public AuthResponse.UserResponse getCurrentUser(UUID userUuid) {
        User user = userRepository.findActiveByUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userUuid));
        
        return mapToUserResponse(user);
    }
    
    @Transactional
    public AuthResponse.UserResponse updateProfile(UUID userUuid, UpdateProfileRequest request) {
        User user = userRepository.findActiveByUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userUuid));
        
        // Update user fields
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }
        if (request.getCoverUrl() != null) {
            user.setCoverUrl(request.getCoverUrl());
        }
        if (request.getProfileVisibility() != null) {
            validateVisibility(request.getProfileVisibility(), "public", "private");
            user.setProfileVisibility(request.getProfileVisibility());
        }
        if (request.getNotesVisibility() != null) {
            validateVisibility(request.getNotesVisibility(), "private", "followers", "public");
            user.setNotesVisibility(request.getNotesVisibility());
        }
        if (request.getBucketlistVisibility() != null) {
            validateVisibility(request.getBucketlistVisibility(), "private", "followers", "public");
            user.setBucketlistVisibility(request.getBucketlistVisibility());
        }
        
        user = userRepository.save(user);
        log.info("User profile updated: {}", user.getUuid());
        
        return mapToUserResponse(user);
    }
    
    @Transactional
    public void changePassword(UUID userUuid, ChangePasswordRequest request) {
        User user = userRepository.findActiveByUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userUuid));
        
        // Check if user has a password (not social login only)
        if (user.getHashedPassword() == null) {
            throw new BadRequestException("Cannot change password for social login accounts");
        }
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getHashedPassword())) {
            throw new UnauthorizedException("Current password is incorrect");
        }
        
        // Update password
        user.setHashedPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        log.info("Password changed for user: {}", user.getUuid());
    }
    
    @Transactional
    public void deleteAccount(UUID userUuid) {
        User user = userRepository.findActiveByUuid(userUuid)
                .orElseThrow(() -> new ResourceNotFoundException("User", "uuid", userUuid));
        
        // Soft delete
        user.setDeletedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        
        log.info("User account deleted (soft delete): {}", user.getUuid());
    }
    
    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public boolean isUsernameTaken(String username) {
        return userRepository.existsByUsername(username);
    }
    
    // Helper methods
    
    private Optional<User> findUserByEmailOrUsername(String emailOrUsername) {
        if (emailOrUsername.contains("@")) {
            return userRepository.findActiveByEmail(emailOrUsername);
        } else {
            return userRepository.findActiveByUsername(emailOrUsername);
        }
    }
    
    private Optional<User> findUserByProviderId(SocialLoginRequest.SocialProvider provider, String providerId) {
        if (provider == SocialLoginRequest.SocialProvider.GOOGLE) {
            return userRepository.findByGoogleId(providerId);
        } else if (provider == SocialLoginRequest.SocialProvider.APPLE) {
            return userRepository.findByAppleId(providerId);
        }
        return Optional.empty();
    }
    
    private String extractProviderIdFromToken(SocialLoginRequest request) {
        // TODO: Implement actual token verification with Google/Apple
        // For now, just use the idToken as provider ID
        return request.getIdToken();
    }
    
    private String generateUsernameFromEmail(String email) {
        if (email == null) {
            return "user" + System.currentTimeMillis();
        }
        String username = email.split("@")[0];
        username = username.replaceAll("[^a-zA-Z0-9_]", "");
        return username;
    }
    
    private void validateVisibility(String value, String... allowedValues) {
        for (String allowed : allowedValues) {
            if (allowed.equals(value)) {
                return;
            }
        }
        throw new BadRequestException("Invalid visibility value: " + value);
    }
    
    private AuthResponse buildAuthResponse(String token, User user) {
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .expiresIn(jwtExpiration / 1000)
                .user(mapToUserResponse(user))
                .build();
    }
    
    private AuthResponse.UserResponse mapToUserResponse(User user) {
        return AuthResponse.UserResponse.builder()
                .uuid(user.getUuid())
                .email(user.getEmail())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .coverUrl(user.getCoverUrl())
                .profileVisibility(user.getProfileVisibility())
                .notesVisibility(user.getNotesVisibility())
                .bucketlistVisibility(user.getBucketlistVisibility())
                .subscriptionStatus(user.getSubscriptionStatus())
                .visitedCountriesCount(user.getVisitedCountriesCount())
                .visitedCitiesCount(user.getVisitedCitiesCount())
                .totalPinsCount(user.getTotalPinsCount())
                .build();
    }
}
