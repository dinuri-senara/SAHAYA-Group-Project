using System;
using System.Collections.Generic;

namespace Sahaya.Assistance.API.DTOs
{
    public class AssistanceRequestResponseDto
    {
        public Guid Id { get; set; }
        public string ReferenceCode { get; set; } = string.Empty;
        public string CitizenId { get; set; } = string.Empty;
        public string CitizenName { get; set; } = string.Empty;
        public string CitizenPhone { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int UrgencyId { get; set; }
        public string UrgencyName { get; set; } = string.Empty;
        public int AffectedCount { get; set; }
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? SpecialNeeds { get; set; }
        public List<string> EvidenceImages { get; set; } = new();
        public string Status { get; set; } = "Submitted";
        public DateTime CreatedAtUtc { get; set; }

        public int? FeedbackRating { get; set; }
        public List<string>? FeedbackTags { get; set; }
        public string? FeedbackComments { get; set; }

        public List<StatusHistoryItemDto> StatusTimeline { get; set; } = new();
    }

    public class StatusHistoryItemDto
    {
        public Guid Id { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? UpdatedByName { get; set; }
        public DateTime TimestampUtc { get; set; }
    }

    public class RequestTrackingDto
    {
        public string ReferenceCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public int PeopleCount { get; set; }
        public DateTime LoggedAtUtc { get; set; }
        public List<StatusHistoryItemDto> Milestones { get; set; } = new();
    }
}
