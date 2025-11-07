package com.research.journal.repository;

import com.research.journal.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByPaperId(Long paperId);
    
    List<Review> findByReviewerId(Long reviewerId);
    
    List<Review> findByStatus(Review.ReviewStatus status);
    
    @Query("SELECT r FROM Review r WHERE r.reviewer.id = ?1 AND r.status = 'PENDING'")
    List<Review> findPendingReviewsByReviewerId(Long reviewerId);
    
    @Query("SELECT r FROM Review r WHERE r.paper.id = ?1 AND r.status = 'COMPLETED'")
    List<Review> findCompletedReviewsByPaperId(Long paperId);
    
    Long countByReviewerIdAndStatus(Long reviewerId, Review.ReviewStatus status);
}
