package com.pinyourword.william.entity.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_users_email", columnList = "email"),
    @Index(name = "idx_users_username", columnList = "username")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, columnDefinition = "UUID DEFAULT uuid_generate_v4()")
    private UUID uuid;

    @Column(unique = true, length = 255)
    private String email;

    @Column(name = "hashed_password", length = 255)
    private String hashedPassword;

    @Column(name = "google_id", unique = true, length = 255)
    private String googleId;

    @Column(name = "apple_id", unique = true, length = 255)
    private String appleId;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(name = "display_name", length = 100)
    private String displayName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(name = "cover_url", length = 512)
    private String coverUrl;

    // Denormalized stats
    @Column(name = "visited_countries_count", nullable = false)
    private Integer visitedCountriesCount ;

    @Column(name = "visited_cities_count", nullable = false)
    private Integer visitedCitiesCount ;

    @Column(name = "total_pins_count", nullable = false)
    private Integer totalPinsCount ;

    // Privacy settings
    @Column(name = "profile_visibility", nullable = false, length = 20)
    private String profileVisibility ;

    @Column(name = "notes_visibility", nullable = false, length = 20)
    private String notesVisibility ;

    @Column(name = "bucketlist_visibility", nullable = false, length = 20)
    private String bucketlistVisibility ;

    // Subscription
    @Column(name = "subscription_status", nullable = false, length = 20)
    private String subscriptionStatus ;

    @Column(name = "subscription_expires_at")
    private LocalDateTime subscriptionExpiresAt;

    // Soft delete
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }

    public boolean isDeleted() {
        return deletedAt != null;
    }
}
