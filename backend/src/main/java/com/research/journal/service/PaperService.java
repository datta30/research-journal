package com.research.journal.service;

import com.research.journal.dto.PaperSubmissionDto;
import com.research.journal.model.*;
import com.research.journal.repository.PaperRepository;
import com.research.journal.repository.RevisionRepository;
import com.research.journal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class PaperService {
    
    @Autowired
    private PaperRepository paperRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private RevisionRepository revisionRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @Autowired
    private PlagiarismService plagiarismService;
    
    public Paper submitPaper(PaperSubmissionDto submissionDto, MultipartFile file, String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        
        // Store the file
        String fileName = fileStorageService.storeFile(file);
        
        // Create paper entity
        Paper paper = new Paper();
        paper.setTitle(submissionDto.getTitle());
        paper.setAbstractText(submissionDto.getAbstractText());
        paper.setKeywords(submissionDto.getKeywords());
        paper.setAuthor(author);
        paper.setStatus(Paper.Status.SUBMITTED);
        paper.setFilePath(fileName);
        paper.setOriginalFileName(file.getOriginalFilename());
        paper.setCurrentVersion(1);
        paper.setSubmittedAt(LocalDateTime.now());
        
        Paper savedPaper = paperRepository.save(paper);
        
        // Perform plagiarism check
        plagiarismService.performPlagiarismCheck(savedPaper);
        
        return savedPaper;
    }
    
    public Paper submitRevision(Long paperId, MultipartFile file, String changeLog, String authorEmail) {
        Paper paper = paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));
        
        if (!paper.getAuthor().getEmail().equals(authorEmail)) {
            throw new RuntimeException("Unauthorized access");
        }
        
        if (paper.getStatus() != Paper.Status.REVISION_REQUIRED) {
            throw new RuntimeException("Paper is not in revision required status");
        }
        
        // Store the new version file
        String fileName = fileStorageService.storeFile(file);
        
        // Create revision record
        Revision revision = new Revision();
        revision.setPaper(paper);
        revision.setVersionNumber(paper.getCurrentVersion() + 1);
        revision.setFilePath(fileName);
        revision.setOriginalFileName(file.getOriginalFilename());
        revision.setChangeLog(changeLog);
        revisionRepository.save(revision);
        
        // Update paper
        paper.setFilePath(fileName);
        paper.setOriginalFileName(file.getOriginalFilename());
        paper.setCurrentVersion(paper.getCurrentVersion() + 1);
        paper.setStatus(Paper.Status.REVISED);
        
        return paperRepository.save(paper);
    }
    
    public List<Paper> getAuthorPapers(String authorEmail) {
        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new RuntimeException("Author not found"));
        return paperRepository.findByAuthor(author);
    }
    
    public Paper getPaperById(Long paperId) {
        return paperRepository.findById(paperId)
                .orElseThrow(() -> new RuntimeException("Paper not found"));
    }
    
    public List<Paper> getAllPapers() {
        return paperRepository.findAll();
    }
    
    public List<Paper> getPublishedPapers() {
        return paperRepository.findPublishedPapers();
    }
    
    public List<Revision> getPaperRevisions(Long paperId) {
        return revisionRepository.findByPaperIdOrderByVersionNumberDesc(paperId);
    }
}
