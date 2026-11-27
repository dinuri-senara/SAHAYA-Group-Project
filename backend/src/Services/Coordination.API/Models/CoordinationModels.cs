using System;
using System.Collections.Generic;
using Sahaya.Common.Entities;

namespace Sahaya.Coordination.API.Models
{
    /// <summary>
    /// National disaster crisis incident event (Member 3 domain)
    /// </summary>
    public class CrisisEvent : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string DisasterType { get; set; } = "Flood"; // Flood, Landslide, Cyclone, Drought, Tsunami
        public string Severity { get; set; } = "High"; // Low, Medium, High, Critical
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public double RadiusKm { get; set; } = 15.0;
        public int AffectedCount { get; set; } = 0;
        public string Status { get; set; } = "Active"; // Active, Contained, Resolved, Archived
        public DateTime StartedAtUtc { get; set; } = DateTime.UtcNow;

        // One-to-many relationship with Operational Areas
        public ICollection<OperationalArea> OperationalAreas { get; set; } = new List<OperationalArea>();
    }

    /// <summary>
    /// Designated multi-agency operational response zone within a crisis event
    /// </summary>
    public class OperationalArea : BaseEntity
    {
        public Guid CrisisEventId { get; set; }
        public string Province { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string DSDivision { get; set; } = string.Empty;
        public string CommanderName { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string ResponseStatus { get; set; } = "Active Deployment"; // Active Deployment, Relief Distribution, Continuous Monitoring
        public int SheltersOpen { get; set; } = 0;
        public string DepotStockStatus { get; set; } = "Adequate"; // Adequate, Warning, Critical

        public CrisisEvent? CrisisEvent { get; set; }
    }

    /// <summary>
    /// Audit log of coordinator triage decision & unit assignment
    /// </summary>
    public class CoordinatorDecision : BaseEntity
    {
        public string RequestId { get; set; } = string.Empty; // Reference to citizen assistance request
        public Guid CoordinatorUserId { get; set; }
        public string CoordinatorName { get; set; } = "Chief Emergency Coordinator";
        public string Action { get; set; } = "Approved"; // Approved, Assigned, Overridden, Escalated, Rejected
        public int PriorityScore { get; set; } = 4; // 1 (Low) to 5 (Immediate)
        public string AssignedUnit { get; set; } = string.Empty; // e.g. "SL Navy Rescue Unit 04"
        public string DecisionNotes { get; set; } = string.Empty;
        public DateTime DecisionTimestampUtc { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Formal escalation log for overdue cases or safety margin breaches
    /// </summary>
    public class EscalationLog : BaseEntity
    {
        public string RequestId { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string EscalatedToRole { get; set; } = "LeadCoordinator"; // LeadCoordinator, DistrictSecretariat, DisasterManagementCentre
        public Guid EscalatedByUserId { get; set; }
        public string EscalatedByName { get; set; } = "Emergency Coordinator";
        public DateTime EscalatedAtUtc { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Pending"; // Pending, Acknowledged, Resolved
        public string? ResolutionNotes { get; set; }
    }

    /// <summary>
    /// State-machine managed triage case in the coordinator workflow
    /// </summary>
    public class TriageRecord : BaseEntity
    {
        public string RequestReferenceCode { get; set; } = string.Empty; // e.g. "REQ-101"
        public string CitizenName { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string Category { get; set; } = "DrinkingWater"; // DrinkingWater, Medical, Food, EmergencyShelter, RescueTransport
        public string Urgency { get; set; } = "Immediate"; // Low, Medium, High, Critical, Immediate
        public string Narrative { get; set; } = string.Empty;
        public string LocationName { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int PeopleCount { get; set; } = 1;

        // State machine lifecycle: Submitted -> UnderReview -> Dispatched -> Delivered -> Resolved
        public string LifecycleStatus { get; set; } = "Submitted";
        public string? AssignedResponderUnit { get; set; }
        public double SlaTargetHours { get; set; } = 4.0;
        public double ElapsedHours { get; set; } = 1.2;
        public bool IsAiAssessed { get; set; } = true;
        public double AiConfidenceScore { get; set; } = 0.94;
        public string? AiRecommendationSummary { get; set; }
    }
}
