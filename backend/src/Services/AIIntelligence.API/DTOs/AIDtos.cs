using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Sahaya.AIIntelligence.API.DTOs
{
    // 1. Triage DTOs
    public class TriageRequestDto
    {
        public Guid? RequestId { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        public string? Category { get; set; } // Food, Water, Medical, Shelter, Rescue
        public string? Urgency { get; set; } // Low, Medium, High, Critical
        public int AffectedCount { get; set; } = 1;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? VulnerableDetails { get; set; }
    }

    public class TriageResultDto
    {
        public Guid Id { get; set; }
        public Guid RequestId { get; set; }
        public string PredictedCategory { get; set; } = string.Empty;
        public string RecommendedPriority { get; set; } = "Medium";
        public double ConfidenceScore { get; set; }
        public string RationaleText { get; set; } = string.Empty;
        public List<string> SuggestedActions { get; set; } = new();
        public DateTime GeneratedAtUtc { get; set; }
    }

    // 2. Duplicate Detection DTOs
    public class DuplicateCheckRequestDto
    {
        public Guid? RequestId { get; set; }

        [Required]
        public string Description { get; set; } = string.Empty;

        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double ThresholdDistanceMeters { get; set; } = 200.0;
        public double ThresholdSimilarity { get; set; } = 0.65;
    }

    public class DuplicateMatchDetailDto
    {
        public Guid ExistingRequestId { get; set; }
        public string ExistingTitle { get; set; } = string.Empty;
        public double DistanceMeters { get; set; }
        public double SimilarityScore { get; set; }
        public string Rationale { get; set; } = string.Empty;
    }

    public class DuplicateCheckResultDto
    {
        public bool IsDuplicate { get; set; }
        public int MatchCount { get; set; }
        public List<DuplicateMatchDetailDto> Matches { get; set; } = new();
    }

    // 3. Human Governance Override DTOs
    public class HumanOverrideRequestDto
    {
        [Required]
        public Guid RequestId { get; set; }

        [Required]
        public Guid CoordinatorUserId { get; set; }

        [Required]
        public string HumanAction { get; set; } = "Accepted"; // Accepted, Overridden, Rejected

        public string? ModifiedPriority { get; set; }

        [Required]
        public string Justification { get; set; } = string.Empty;

        public string? OriginalRecommendationJson { get; set; }
    }

    public class HumanOverrideResultDto
    {
        public bool Success { get; set; }
        public Guid AuditId { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime RecordedAtUtc { get; set; }
    }

    // 4. Conversational Crisis Chat DTOs
    public class AIChatRequestDto
    {
        [Required]
        public string Message { get; set; } = string.Empty;

        public string Language { get; set; } = "en"; // en, si
        public string? SessionId { get; set; }
        public string? RequestContextId { get; set; }
    }

    public class AIChatResponseDto
    {
        public string Reply { get; set; } = string.Empty;
        public bool IsFromFallback { get; set; } = false;
        public List<string> QuickSuggestions { get; set; } = new();
        public string SessionId { get; set; } = string.Empty;
    }
}
