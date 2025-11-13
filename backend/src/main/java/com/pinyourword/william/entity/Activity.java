package com.pinyourword.william.entity;

import com.pinyourword.william.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "activities", indexes = {
    @Index(name = "idx_activities_actor_type", columnList = "actor_id, activity_type"),
    @Index(name = "idx_activities_created_at", columnList = "created_at"),
    @Index(name = "idx_activities_object", columnList = "object_id, object_type"),
    @Index(name = "idx_activities_actor_created", columnList = "actor_id, created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id", nullable = false)
    private User actor;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "activity_type", nullable = false, length = 30)
    private ActivityType activityType;
    
    @Column(name = "object_id")
    private Long objectId;
    
    @Column(name = "object_type", length = 50)
    private String objectType; // 'pin', 'user', 'badge'
    
    // JSONB metadata for flexible storage
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private Map<String, Object> metadata = new HashMap<>();
    
    @Column(columnDefinition = "TEXT")
    private String caption;
    
    // Denormalized counters for performance
    @Column(name = "likes_count", nullable = false)
    @Builder.Default
    private Integer likesCount = 0;
    
    @Column(name = "comments_count", nullable = false)
    @Builder.Default
    private Integer commentsCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ActivityLike> likes = new ArrayList<>();
    
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ActivityComment> comments = new ArrayList<>();
    
    @OneToMany(mappedBy = "activity", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserFeed> userFeeds = new ArrayList<>();
    
    // Helper methods
    public void incrementLikesCount() {
        this.likesCount++;
    }
    
    public void decrementLikesCount() {
        if (this.likesCount > 0) {
            this.likesCount--;
        }
    }
    
    public void incrementCommentsCount() {
        this.commentsCount++;
    }
    
    public void decrementCommentsCount() {
        if (this.commentsCount > 0) {
            this.commentsCount--;
        }
    }
    
    public enum ActivityType {
        NEW_PIN_VISITED("new_pin_visited"),
        NEW_PIN_WANT_TO_GO("new_pin_want_to_go"),
        NEW_FOLLOW("new_follow"),
        ACHIEVEMENT_COUNTRIES("achievement_countries"),
        ACHIEVEMENT_CITIES("achievement_cities"),
        ACHIEVEMENT_PINS("achievement_pins"),
        EARNED_BADGE("earned_badge"),
        UPDATE_PIN("update_pin");
        
        private final String value;
        
        ActivityType(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
