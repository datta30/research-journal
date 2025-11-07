package com.research.journal.controller;

import com.research.journal.model.Paper;
import com.research.journal.service.PaperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/papers")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PaperController {
    
    @Autowired
    private PaperService paperService;
    
    @GetMapping("/published")
    public ResponseEntity<List<Paper>> getPublishedPapers() {
        List<Paper> papers = paperService.getPublishedPapers();
        return ResponseEntity.ok(papers);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getPaper(@PathVariable Long id) {
        try {
            Paper paper = paperService.getPaperById(id);
            return ResponseEntity.ok(paper);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadPublishedPaper(@PathVariable Long id) {
        try {
            Paper paper = paperService.getPaperById(id);
            
            // Only allow download of published papers
            if (paper.getStatus() != Paper.Status.PUBLISHED) {
                return ResponseEntity.status(403).body("Paper is not published");
            }
            
            Path filePath = Paths.get("uploads", paper.getFilePath());
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
