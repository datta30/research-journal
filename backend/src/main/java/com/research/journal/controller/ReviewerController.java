package com.research.journal.controller;

import com.research.journal.dto.ReviewSubmissionDto;
import com.research.journal.model.Review;
import com.research.journal.service.ReviewerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/reviewer")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReviewerController {
    
    @Autowired
    private ReviewerService reviewerService;
    
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getMyReviews(Authentication authentication) {
        List<Review> reviews = reviewerService.getAssignedReviews(authentication.getName());
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/reviews/pending")
    public ResponseEntity<List<Review>> getPendingReviews(Authentication authentication) {
        List<Review> reviews = reviewerService.getPendingReviews(authentication.getName());
        return ResponseEntity.ok(reviews);
    }
    
    @GetMapping("/reviews/{id}")
    public ResponseEntity<?> getReview(@PathVariable Long id, Authentication authentication) {
        try {
            Review review = reviewerService.getReviewById(id);
            if (!review.getReviewer().getEmail().equals(authentication.getName())) {
                return ResponseEntity.status(403).body("Unauthorized access");
            }
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/reviews/{id}/submit")
    public ResponseEntity<?> submitReview(
            @PathVariable Long id,
            @Valid @RequestBody ReviewSubmissionDto reviewDto,
            Authentication authentication) {
        try {
            Review review = reviewerService.submitReview(id, reviewDto, authentication.getName());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/reviews/{id}/status")
    public ResponseEntity<?> updateReviewStatus(
            @PathVariable Long id,
            @RequestParam Review.ReviewStatus status,
            Authentication authentication) {
        try {
            Review review = reviewerService.updateReviewStatus(id, status, authentication.getName());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/reviews/{id}/download")
    public ResponseEntity<?> downloadPaper(@PathVariable Long id, Authentication authentication) {
        try {
            Review review = reviewerService.getReviewById(id);
            
            // Check authorization - only the assigned reviewer can download
            if (!review.getReviewer().getEmail().equals(authentication.getName())) {
                return ResponseEntity.status(403).body("Unauthorized access");
            }
            
            // Get the paper and file path
            if (review.getPaper() == null) {
                return ResponseEntity.notFound().build();
            }
            
            Path filePath = Paths.get("uploads").resolve(review.getPaper().getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type
            String contentType = "application/pdf";
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + review.getPaper().getOriginalFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
