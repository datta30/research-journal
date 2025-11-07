package com.research.journal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "revisions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Revision {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paper_id", nullable = false)
    @JsonIgnoreProperties({"reviews", "revisions", "hibernateLazyInitializer", "handler"})
    private Paper paper;
    
    @Column(nullable = false)
    private Integer versionNumber;
    
    @Column(nullable = false)
    private String filePath;
    
    @Column
    private String originalFileName;
    
    @Column(length = 2000)
    private String changeLog;
    
    @Column(length = 2000)
    private String authorComments;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime uploadedAt;
}
