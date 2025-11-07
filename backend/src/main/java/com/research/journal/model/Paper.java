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
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "papers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Paper {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(length = 5000)
    private String abstractText;
    
    @Column
    private String keywords;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_editor_id")
    private User assignedEditor;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.SUBMITTED;
    
    @Column
    private String filePath;
    
    @Column
    private String originalFileName;
    
    @Column
    private Integer currentVersion = 1;
    
    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();
    
    @OneToMany(mappedBy = "paper", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Revision> revisions = new ArrayList<>();
    
    @OneToOne(mappedBy = "paper", cascade = CascadeType.ALL)
    private PlagiarismCheck plagiarismCheck;
    
    @Column
    private LocalDateTime submittedAt;
    
    @Column
    private LocalDateTime publishedAt;
    
    @Column(length = 2000)
    private String editorComments;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum Status {
        SUBMITTED,
        UNDER_REVIEW,
        REVISION_REQUIRED,
        REVISED,
        ACCEPTED,
        REJECTED,
        PUBLISHED
    }
}
