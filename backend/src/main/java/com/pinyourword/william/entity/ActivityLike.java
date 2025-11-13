package com.pinyourword.william.entity;

import com.pinyourword.william.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_likes",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_activity_likes_activity_user", columnNames = {"activity_id", "user_id"})
    },
    indexes = {
        @Index(name = "idx_activity_likes_activity", columnList = "activity_id"),
        @Index(name = "idx_activity_likes_user", columnList = "user_id, created_at"),
        @Index(name = "idx_activity_likes_activity_created", columnList = "activity_id, created_at")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
