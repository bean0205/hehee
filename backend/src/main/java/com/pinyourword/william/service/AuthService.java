package com.pinyourword.william.service;


import com.pinyourword.william.dto.request.LoginRequest;
import com.pinyourword.william.dto.request.RegisterRequest;
import com.pinyourword.william.dto.response.AuthResponse;
import com.pinyourword.william.entity.User;
import com.pinyourword.william.exception.BadRequestException;
import com.pinyourword.william.exception.UnauthorizedException;
import com.pinyourword.william.repository.UserRepository;
import com.pinyourword.william.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already in use");
        }
        
        // Create new user
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .displayName(request.getDisplayName())
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
        
        // Generate JWT token
        String token = tokenProvider.generateToken(user.getUuid());
        
        return AuthResponse.builder()
                .user(mapToUserResponse(user))
                .accessToken(token)
                .build();
    }
    
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndNotDeleted(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
        
        if (user.getHashedPassword() == null || 
            !passwordEncoder.matches(request.getPassword(), user.getHashedPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        
        String token = tokenProvider.generateToken(user.getUuid());
        
        return AuthResponse.builder()
                .user(mapToUserResponse(user))
                .accessToken(token)
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
                .build();
    }
}
