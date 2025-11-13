package com.pinyourword.william.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_feeds", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_feeds_user_activity", columnNames = {"user_id", "activity_id"})
    },
    indexes = {
        @Index(name = "idx_user_feeds_user_timestamp", columnList = "user_id, feed_timestamp"),
        @Index(name = "idx_user_feeds_user_seen", columnList = "user_id, is_seen, feed_timestamp"),
        @Index(name = "idx_user_feeds_activity", columnList = "activity_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserFeed {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;
    
    @Column(name = "feed_timestamp", nullable = false)
    @Builder.Default
    private LocalDateTime feedTimestamp = LocalDateTime.now();
    
    @Column(name = "is_seen", nullable = false)
    @Builder.Default
    private Boolean isSeen = false;
    
    @PrePersist
    protected void onCreate() {
        if (feedTimestamp == null) {
            feedTimestamp = LocalDateTime.now();
        }
    }
}
