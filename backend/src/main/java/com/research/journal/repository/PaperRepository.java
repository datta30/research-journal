package com.research.journal.repository;

import com.research.journal.model.Paper;
import com.research.journal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperRepository extends JpaRepository<Paper, Long> {
    
    List<Paper> findByAuthorId(Long authorId);
    
    List<Paper> findByAssignedEditorId(Long editorId);
    
    List<Paper> findByStatus(Paper.Status status);
    
    List<Paper> findByAuthor(User author);
    
    @Query("SELECT p FROM Paper p WHERE p.assignedEditor IS NULL AND p.status = 'SUBMITTED'")
    List<Paper> findUnassignedPapers();
    
    @Query("SELECT p FROM Paper p WHERE p.status = 'PUBLISHED' ORDER BY p.publishedAt DESC")
    List<Paper> findPublishedPapers();
    
    Long countByStatus(Paper.Status status);
    
    Long countByAuthorId(Long authorId);
}
