package com.pinyourword.william.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.pinyourword.william.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "pin_media", indexes = {
    @Index(name = "idx_pin_media_pin_id", columnList = "pin_id"),
    @Index(name = "idx_pin_media_pin_order", columnList = "pin_id, upload_order"),
    @Index(name = "idx_pin_media_user_created", columnList = "user_id, created_at"),
    @Index(name = "idx_pin_media_type", columnList = "media_type")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PinMedia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, columnDefinition = "UUID DEFAULT uuid_generate_v4()")
    private UUID uuid;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pin_id", nullable = false)
    private Pin pin;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    
    @Column(name = "media_type", nullable = false, length = 20)
    private String mediaType;
    
    @Column(name = "storage_url", nullable = false, length = 512)
    private String storageUrl;
    
    @Column(name = "thumbnail_url", length = 512)
    private String thumbnailUrl;
    
    @Column(name = "upload_order", nullable = false)
    @Builder.Default
    private Short uploadOrder = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }
    
    public enum MediaType {
        IMAGE("image"),
        VIDEO("video");
        
        private final String value;
        
        MediaType(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
