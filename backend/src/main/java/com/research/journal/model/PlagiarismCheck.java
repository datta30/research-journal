package com.research.journal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "plagiarism_checks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PlagiarismCheck {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paper_id", nullable = false)
    @JsonIgnore
    private Paper paper;
    
    @Column(nullable = false)
    private Double similarityScore;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;
    
    @Column(length = 3000)
    private String matchedSources;
    
    @Column(length = 2000)
    private String remarks;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime checkedAt;
    
    public enum Status {
        PASSED,
        FLAGGED,
        REQUIRES_REVIEW
    }
}
