package com.research.journal.service;

import com.research.journal.model.Paper;
import com.research.journal.model.PlagiarismCheck;
import com.research.journal.repository.PlagiarismCheckRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Random;

@Service
@Transactional
public class PlagiarismService {
    
    @Autowired
    private PlagiarismCheckRepository plagiarismCheckRepository;
    
    /**
     * Basic plagiarism check simulation.
     * In a real system, this would integrate with external plagiarism detection APIs
     * like Turnitin, iThenticate, or Copyscape.
     */
    public PlagiarismCheck performPlagiarismCheck(Paper paper) {
        // Simulate plagiarism check with random similarity score
        Random random = new Random();
        double similarityScore = random.nextDouble() * 100;
        
        PlagiarismCheck check = new PlagiarismCheck();
        check.setPaper(paper);
        check.setSimilarityScore(similarityScore);
        
        // Determine status based on similarity score
        if (similarityScore < 15.0) {
            check.setStatus(PlagiarismCheck.Status.PASSED);
            check.setRemarks("Low similarity detected. Paper appears to be original.");
        } else if (similarityScore < 30.0) {
            check.setStatus(PlagiarismCheck.Status.REQUIRES_REVIEW);
            check.setRemarks("Moderate similarity detected. Manual review recommended.");
        } else {
            check.setStatus(PlagiarismCheck.Status.FLAGGED);
            check.setRemarks("High similarity detected. Requires immediate attention.");
        }
        
        // In real implementation, this would contain actual matched sources
        check.setMatchedSources("Simulated check - No actual sources detected");
        
        return plagiarismCheckRepository.save(check);
    }
    
    public PlagiarismCheck getPlagiarismCheckByPaperId(Long paperId) {
        return plagiarismCheckRepository.findByPaperId(paperId)
                .orElse(null);
    }
}
