package com.research.journal.controller;

import com.research.journal.model.Paper;
import com.research.journal.model.Review;
import com.research.journal.model.User;
import com.research.journal.service.EditorService;
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
import java.util.Map;

@RestController
@RequestMapping("/api/editor")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class EditorController {
    
    @Autowired
    private EditorService editorService;
    
    @GetMapping("/papers/unassigned")
    public ResponseEntity<List<Paper>> getUnassignedPapers() {
        List<Paper> papers = editorService.getUnassignedPapers();
        return ResponseEntity.ok(papers);
    }
    
    @GetMapping("/papers")
    public ResponseEntity<List<Paper>> getMyPapers(Authentication authentication) {
        List<Paper> papers = editorService.getEditorPapers(authentication.getName());
        return ResponseEntity.ok(papers);
    }
    
    @PutMapping("/papers/{id}/assign")
    public ResponseEntity<?> assignPaperToMe(@PathVariable Long id, Authentication authentication) {
        try {
            Paper paper = editorService.assignPaperToEditor(id, authentication.getName());
            return ResponseEntity.ok(paper);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/papers/{paperId}/assign-reviewer")
    public ResponseEntity<?> assignReviewer(
            @PathVariable Long paperId,
            @RequestBody Map<String, Long> request) {
        try {
            Long reviewerId = request.get("reviewerId");
            Review review = editorService.assignReviewer(paperId, reviewerId);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/reviewers")
    public ResponseEntity<List<User>> getAvailableReviewers() {
        List<User> reviewers = editorService.getAvailableReviewers();
        return ResponseEntity.ok(reviewers);
    }
    
    @GetMapping("/papers/{id}/reviews")
    public ResponseEntity<List<Review>> getPaperReviews(@PathVariable Long id) {
        List<Review> reviews = editorService.getPaperReviews(id);
        return ResponseEntity.ok(reviews);
    }
    
    @PutMapping("/papers/{id}/decision")
    public ResponseEntity<?> makeFinalDecision(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        try {
            Paper.Status decision = Paper.Status.valueOf(request.get("decision"));
            String comments = request.get("comments");
            Paper paper = editorService.makeFinalDecision(id, decision, comments);
            return ResponseEntity.ok(paper);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/papers/{id}/download")
    public ResponseEntity<?> downloadPaper(@PathVariable Long id, Authentication authentication) {
        try {
            Paper paper = editorService.getPaperById(id);
            if (paper == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify editor has access to this paper
            if (!editorService.hasAccessToPaper(id, authentication.getName())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            // Construct full path to file
            String uploadsDir = "uploads";
            Path filePath = Paths.get(uploadsDir, paper.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + paper.getTitle() + ".pdf\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
