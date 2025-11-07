package com.research.journal.controller;

import com.research.journal.dto.PaperSubmissionDto;
import com.research.journal.model.Paper;
import com.research.journal.model.PlagiarismCheck;
import com.research.journal.model.Revision;
import com.research.journal.service.PaperService;
import com.research.journal.service.PlagiarismService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/author")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthorController {
    
    @Autowired
    private PaperService paperService;
    
    @Autowired
    private PlagiarismService plagiarismService;
    
    @PostMapping("/papers/submit")
    public ResponseEntity<?> submitPaper(
            @RequestParam("title") String title,
            @RequestParam("abstractText") String abstractText,
            @RequestParam("keywords") String keywords,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            PaperSubmissionDto submissionDto = new PaperSubmissionDto();
            submissionDto.setTitle(title);
            submissionDto.setAbstractText(abstractText);
            submissionDto.setKeywords(keywords);
            
            Paper paper = paperService.submitPaper(submissionDto, file, authentication.getName());
            return ResponseEntity.ok(paper);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/papers")
    public ResponseEntity<List<Paper>> getMyPapers(Authentication authentication) {
        List<Paper> papers = paperService.getAuthorPapers(authentication.getName());
        return ResponseEntity.ok(papers);
    }
    
    @GetMapping("/papers/{id}")
    public ResponseEntity<?> getPaper(@PathVariable Long id, Authentication authentication) {
        try {
            Paper paper = paperService.getPaperById(id);
            if (!paper.getAuthor().getEmail().equals(authentication.getName())) {
                return ResponseEntity.status(403).body("Unauthorized access");
            }
            return ResponseEntity.ok(paper);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/papers/{id}/revise")
    public ResponseEntity<?> submitRevision(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("changeLog") String changeLog,
            Authentication authentication) {
        try {
            Paper paper = paperService.submitRevision(id, file, changeLog, authentication.getName());
            return ResponseEntity.ok(paper);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/papers/{id}/revisions")
    public ResponseEntity<List<Revision>> getPaperRevisions(@PathVariable Long id) {
        List<Revision> revisions = paperService.getPaperRevisions(id);
        return ResponseEntity.ok(revisions);
    }
    
    @GetMapping("/papers/{id}/plagiarism")
    public ResponseEntity<?> getPlagiarismCheck(@PathVariable Long id) {
        PlagiarismCheck check = plagiarismService.getPlagiarismCheckByPaperId(id);
        if (check == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(check);
    }
    
    @GetMapping("/papers/{id}/download")
    public ResponseEntity<?> downloadPaper(@PathVariable Long id, Authentication authentication) {
        try {
            Paper paper = paperService.getPaperById(id);
            if (paper == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Check authorization
            if (!paper.getAuthor().getEmail().equals(authentication.getName())) {
                return ResponseEntity.status(403).body("Unauthorized access");
            }
            
            // Get the file path and load as Resource
            Path filePath = Paths.get("uploads").resolve(paper.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type
            String contentType = "application/pdf";
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, 
                            "attachment; filename=\"" + paper.getOriginalFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
