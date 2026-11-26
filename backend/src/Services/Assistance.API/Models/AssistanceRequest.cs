using System;
using System.Collections.Generic;
using Sahaya.Common.Entities;

namespace Sahaya.Assistance.API.Models
{
    public class AssistanceRequest : BaseEntity
    {
        public string ReferenceCode { get; set; } = string.Empty;
        public string CitizenId { get; set; } = string.Empty;
        public string CitizenName { get; set; } = string.Empty;
        public string CitizenPhone { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = "Food";
        public int UrgencyId { get; set; }
        public string UrgencyName { get; set; } = "Medium";
        public int AffectedCount { get; set; } = 1;
        public string Address { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string? SpecialNeeds { get; set; }
        public string? EvidenceImagesJson { get; set; }
        public string Status { get; set; } = "Submitted";

        // Post-Delivery Feedback (Coursework 1.1 A)
        public int? FeedbackRating { get; set; }
        public string? FeedbackTagsJson { get; set; }
        public string? FeedbackComments { get; set; }
        public DateTime? FeedbackSubmittedAtUtc { get; set; }

        public ICollection<RequestStatusHistory> StatusHistories { get; set; } = new List<RequestStatusHistory>();
    }
}
