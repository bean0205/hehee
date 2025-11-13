package com.pinyourword.william.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.locationtech.jts.geom.Point;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pins", indexes = {
    @Index(name = "idx_pins_user_id", columnList = "user_id"),
    @Index(name = "idx_pins_user_status", columnList = "user_id, status"),
    @Index(name = "idx_pins_country_code", columnList = "address_country_code"),
    @Index(name = "idx_pins_user_created", columnList = "user_id, created_at"),
    @Index(name = "idx_pins_status_created", columnList = "status, created_at"),
    @Index(name = "idx_pins_city_country", columnList = "address_city, address_country")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pin {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, columnDefinition = "UUID DEFAULT uuid_generate_v4()")
    private UUID uuid;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Location data
    @Column(name = "place_name", nullable = false, length = 255)
    private String placeName;
    
    @Column(name = "place_id_google", length = 255)
    private String placeIdGoogle;
    
    // PostGIS Point - SRID 4326 (WGS 84)
    @Column(nullable = false, columnDefinition = "geography(Point, 4326)")
    private Point location;
    
    @Column(name = "address_formatted", length = 512)
    private String addressFormatted;
    
    @Column(name = "address_city", length = 100)
    private String addressCity;
    
    @Column(name = "address_country", length = 100)
    private String addressCountry;
    
    @Column(name = "address_country_code", length = 2)
    private String addressCountryCode;
    
    // Pin status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private PinStatus status = PinStatus.VISITED;
    
    // Content
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "visited_date")
    private LocalDate visitedDate;
    
    @Column
    private Short rating; // 1-5 stars
    
    // Favorite flag
    @Column(name = "is_favorite", nullable = false)
    @Builder.Default
    private Boolean isFavorite = false;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Relationships
    @OneToMany(mappedBy = "pin", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PinMedia> media = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        if (uuid == null) {
            uuid = UUID.randomUUID();
        }
    }
    
    // Helper methods
    public void addMedia(PinMedia pinMedia) {
        media.add(pinMedia);
        pinMedia.setPin(this);
    }
    
    public void removeMedia(PinMedia pinMedia) {
        media.remove(pinMedia);
        pinMedia.setPin(null);
    }
    
    public enum PinStatus {
        VISITED("visited"),
        WANT_TO_GO("want_to_go");
        
        private final String value;
        
        PinStatus(String value) {
            this.value = value;
        }
        
        public String getValue() {
            return value;
        }
    }
}
