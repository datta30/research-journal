package com.research.journal.service;

import com.research.journal.dto.ReviewSubmissionDto;
import com.research.journal.model.Review;
import com.research.journal.model.User;
import com.research.journal.repository.ReviewRepository;
import com.research.journal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class ReviewerService {
    
    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Review> getAssignedReviews(String reviewerEmail) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        return reviewRepository.findByReviewerId(reviewer.getId());
    }
    
    public List<Review> getPendingReviews(String reviewerEmail) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));
        return reviewRepository.findPendingReviewsByReviewerId(reviewer.getId());
    }
    
    public Review submitReview(Long reviewId, ReviewSubmissionDto reviewDto, String reviewerEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getReviewer().getEmail().equals(reviewerEmail)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        if (review.getStatus() == Review.ReviewStatus.COMPLETED) {
            throw new RuntimeException("Review already completed");
        }
        
        review.setRecommendation(reviewDto.getRecommendation());
        review.setComments(reviewDto.getComments());
        review.setQualityScore(reviewDto.getQualityScore());
        review.setOriginalityScore(reviewDto.getOriginalityScore());
        review.setClarityScore(reviewDto.getClarityScore());
        review.setSignificanceScore(reviewDto.getSignificanceScore());
        review.setStatus(Review.ReviewStatus.COMPLETED);
        review.setCompletedAt(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }
    
    public Review updateReviewStatus(Long reviewId, Review.ReviewStatus status, String reviewerEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getReviewer().getEmail().equals(reviewerEmail)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        review.setStatus(status);
        return reviewRepository.save(review);
    }
    
    public Review getReviewById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }
}
