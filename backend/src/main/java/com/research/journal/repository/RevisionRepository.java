package com.research.journal.repository;

import com.research.journal.model.Revision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RevisionRepository extends JpaRepository<Revision, Long> {
    
    List<Revision> findByPaperIdOrderByVersionNumberDesc(Long paperId);
    
    List<Revision> findByPaperId(Long paperId);
}
