package com.research.journal.dto;

import com.research.journal.model.Review;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSubmissionDto {
    
    @NotNull(message = "Recommendation is required")
    private Review.Recommendation recommendation;
    
    private String comments;
    
    @Min(1)
    @Max(10)
    private Integer qualityScore;
    
    @Min(1)
    @Max(10)
    private Integer originalityScore;
    
    @Min(1)
    @Max(10)
    private Integer clarityScore;
    
    @Min(1)
    @Max(10)
    private Integer significanceScore;
}
