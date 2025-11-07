package com.research.journal.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaperSubmissionDto {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Abstract is required")
    private String abstractText;
    
    private String keywords;
}
