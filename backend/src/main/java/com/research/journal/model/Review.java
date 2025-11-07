package com.research.journal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paper_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "revisions", "hibernateLazyInitializer", "handler"})
    private Paper paper;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    private User reviewer;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Recommendation recommendation;
    
    @Column(length = 5000)
    private String comments;
    
    @Column
    private Integer qualityScore;
    
    @Column
    private Integer originalityScore;
    
    @Column
    private Integer clarityScore;
    
    @Column
    private Integer significanceScore;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewStatus status = ReviewStatus.PENDING;
    
    @Column
    private LocalDateTime assignedAt;
    
    @Column
    private LocalDateTime completedAt;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum Recommendation {
        ACCEPT,
        MINOR_REVISION,
        MAJOR_REVISION,
        REJECT
    }
    
    public enum ReviewStatus {
        PENDING,
        IN_PROGRESS,
        COMPLETED
    }
}
