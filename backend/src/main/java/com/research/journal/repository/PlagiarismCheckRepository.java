package com.research.journal.repository;

import com.research.journal.model.PlagiarismCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlagiarismCheckRepository extends JpaRepository<PlagiarismCheck, Long> {
    
    Optional<PlagiarismCheck> findByPaperId(Long paperId);
    
    List<PlagiarismCheck> findByStatus(PlagiarismCheck.Status status);
}
