package com.research.journal.service;

import com.research.journal.model.Paper;
import com.research.journal.model.Review;
import com.research.journal.model.User;
import com.research.journal.repository.PaperRepository;
import com.research.journal.repository.ReviewRepository;
import com.research.journal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class EditorService {
    
    @Autowired
    private PaperRepository paperRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    public List<Paper> getUnassignedPapers() {
        return paperRepository.findUnassignedPapers();
    }
    
    public List<Paper> getEditorPapers(String editorEmail) {
        User editor = userRepository.findByEmail(editorEmail)
                .orElseThrow(() -> new RuntimeException("Editor not found"));
        return paperRepository.findByAssignedEditorId(editor.getId());
    }
    
    public Paper assignPaperToEditor(Long paperId, String editorEmail) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));
        
        User editor = userRepository.findByEmail(editorEmail)
                .orElseThrow(() -> new RuntimeException("Editor not found"));
        
        if (!editor.getRoles().contains(User.Role.EDITOR)) {
            throw new RuntimeException("User is not an editor");
        }
        
        paper.setAssignedEditor(editor);
        return paperRepository.save(paper);
    }
    
    public Review assignReviewer(Long paperId, Long reviewerId) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));
        
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        
        if (!reviewer.getRoles().contains(User.Role.REVIEWER)) {
            throw new RuntimeException("User is not a reviewer");
        }
        
        // Check if reviewer is already assigned
        List<Review> existingReviews = reviewRepository.findByPaperId(paperId);
        boolean alreadyAssigned = existingReviews.stream()
                .anyMatch(r -> r.getReviewer().getId().equals(reviewerId));
        
        if (alreadyAssigned) {
            throw new RuntimeException("Reviewer already assigned to this paper");
        }
        
        Review review = new Review();
        review.setPaper(paper);
        review.setReviewer(reviewer);
        review.setStatus(Review.ReviewStatus.PENDING);
        review.setAssignedAt(LocalDateTime.now());
        
        paper.setStatus(Paper.Status.UNDER_REVIEW);
        paperRepository.save(paper);
        
        return reviewRepository.save(review);
    }
    
    public Paper makeFinalDecision(Long paperId, Paper.Status decision, String comments) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));
        
        // Validate decision
        if (decision != Paper.Status.ACCEPTED && 
            decision != Paper.Status.REJECTED && 
            decision != Paper.Status.REVISION_REQUIRED) {
            throw new RuntimeException("Invalid decision status");
        }
        
        paper.setStatus(decision);
        paper.setEditorComments(comments);
        
        if (decision == Paper.Status.ACCEPTED) {
            paper.setPublishedAt(LocalDateTime.now());
            paper.setStatus(Paper.Status.PUBLISHED);
        }
        
        return paperRepository.save(paper);
    }
    
    public List<User> getAvailableReviewers() {
        return userRepository.findByRolesContaining(User.Role.REVIEWER);
    }
    
    public List<Review> getPaperReviews(Long paperId) {
        return reviewRepository.findByPaperId(paperId);
    }
    
    public Paper getPaperById(Long paperId) {
        return paperRepository.findById(paperId).orElse(null);
    }
    
    public boolean hasAccessToPaper(Long paperId, String editorEmail) {
        Paper paper = paperRepository.findById(paperId).orElse(null);
        if (paper == null) {
            return false;
        }
        
        User editor = userRepository.findByEmail(editorEmail).orElse(null);
        if (editor == null) {
            return false;
        }
        
        // Editor has access if they are assigned to this paper or if paper is unassigned
        return paper.getAssignedEditor() == null || 
               paper.getAssignedEditor().getId().equals(editor.getId());
    }
}
