package com.pinyourword.william.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "follow_relationships", indexes = {
    @Index(name = "idx_follow_relationships_following", columnList = "following_id"),
    @Index(name = "idx_follow_relationships_follower", columnList = "follower_id, created_at"),
    @Index(name = "idx_follow_relationships_created", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(FollowRelationship.FollowRelationshipId.class)
public class FollowRelationship {
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private User follower;
    
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private User following;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    // Composite Key class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FollowRelationshipId implements Serializable {
        private Long follower;
        private Long following;
    }
}
