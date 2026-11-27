using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Sahaya.Common.Entities;

namespace Sahaya.AIIntelligence.API.Models
{
    [Table("AIRecommendations")]
    public class AIRecommendation : BaseEntity
    {
        [Required]
        public Guid RequestId { get; set; }

        [Required]
        [MaxLength(100)]
        public string PredictedCategory { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string RecommendedPriority { get; set; } = "Medium";

        [Range(0.0, 1.0)]
        public double ConfidenceScore { get; set; } = 0.85;

        [Required]
        [MaxLength(2000)]
        public string RationaleText { get; set; } = string.Empty;

        public DateTime GeneratedAtUtc { get; set; } = DateTime.UtcNow;

        [MaxLength(50)]
        public string ReviewStatus { get; set; } = "Pending"; // Pending, Accepted, Overridden, Rejected
    }

    [Table("HumanOverrideAudits")]
    public class HumanOverrideAudit : BaseEntity
    {
        [Required]
        public Guid RequestId { get; set; }

        [Required]
        public Guid CoordinatorUserId { get; set; }

        [Required]
        public string OriginalRecommendationJson { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string HumanAction { get; set; } = "Accepted"; // Accepted, Overridden, Rejected

        [MaxLength(50)]
        public string? ModifiedPriority { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Justification { get; set; } = string.Empty;

        public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
    }

    [Table("DuplicateMatches")]
    public class DuplicateMatch : BaseEntity
    {
        [Required]
        public Guid PrimaryRequestId { get; set; }

        [Required]
        public Guid DuplicateRequestId { get; set; }

        [Range(0.0, 1.0)]
        public double SimilarityScore { get; set; }

        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;

        public DateTime MatchedAtUtc { get; set; } = DateTime.UtcNow;
    }

    [Table("AIChatSessions")]
    public class AIChatSession : BaseEntity
    {
        [Required]
        [MaxLength(100)]
        public string SessionId { get; set; } = string.Empty;

        [Required]
        public string UserQuery { get; set; } = string.Empty;

        [Required]
        public string AIResponse { get; set; } = string.Empty;

        public bool IsFallback { get; set; } = false;

        [MaxLength(10)]
        public string Language { get; set; } = "en"; // en, si

        public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;
    }
}
