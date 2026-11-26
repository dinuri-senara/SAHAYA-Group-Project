using System;
using Sahaya.Common.Entities;

namespace Sahaya.Assistance.API.Models
{
    public class RequestStatusHistory : BaseEntity
    {
        public Guid AssistanceRequestId { get; set; }
        public string Status { get; set; } = "Submitted";
        public string Title { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? UpdatedByUserId { get; set; }
        public string? UpdatedByName { get; set; }
        public DateTime TimestampUtc { get; set; } = DateTime.UtcNow;

        public AssistanceRequest? AssistanceRequest { get; set; }
    }
}
