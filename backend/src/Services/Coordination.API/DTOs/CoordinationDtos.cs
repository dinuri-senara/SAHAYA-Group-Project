using System;
using System.Collections.Generic;

namespace Sahaya.Coordination.API.DTOs
{
    // --- Incidents & Zones ---
    public record CreateCrisisEventDto(
        string Title,
        string Description,
        string DisasterType,
        string Severity,
        double Latitude,
        double Longitude,
        double RadiusKm,
        int AffectedCount
    );

    public record CrisisEventDto(
        Guid Id,
        string Title,
        string Description,
        string DisasterType,
        string Severity,
        double Latitude,
        double Longitude,
        double RadiusKm,
        int AffectedCount,
        string Status,
        DateTime StartedAtUtc,
        List<OperationalAreaDto> OperationalAreas
    );

    public record OperationalAreaDto(
        Guid Id,
        Guid CrisisEventId,
        string Province,
        string District,
        string DSDivision,
        string CommanderName,
        string ContactPhone,
        string ResponseStatus,
        int SheltersOpen,
        string DepotStockStatus
    );

    public record CreateOperationalAreaDto(
        string Province,
        string District,
        string DSDivision,
        string CommanderName,
        string ContactPhone,
        int SheltersOpen,
        string DepotStockStatus
    );

    // --- Coordination Triage Lifecycle ---
    public record UpdateTriageStatusDto(
        string NewStatus, // UnderReview, Dispatched, Delivered, Resolved
        string? AssignedUnit,
        string? Notes
    );

    public record EscalateCaseDto(
        string Reason,
        string EscalatedToRole // LeadCoordinator, DistrictSecretariat, DisasterManagementCentre
    );

    public record TriageRecordDto(
        Guid Id,
        string RequestReferenceCode,
        string CitizenName,
        string ContactPhone,
        string Category,
        string Urgency,
        string Narrative,
        string LocationName,
        double Latitude,
        double Longitude,
        int PeopleCount,
        string LifecycleStatus,
        string? AssignedResponderUnit,
        double SlaTargetHours,
        double ElapsedHours,
        bool IsAiAssessed,
        double AiConfidenceScore,
        string? AiRecommendationSummary,
        DateTime CreatedAtUtc
    );

    // --- Operational Analytics KPIs (Section 7 Coursework) ---
    public record CoordinatorSummaryMetricsDto(
        int UnresolvedCases,
        double AverageResponseTimeHours,
        int ActiveCrisisSectors,
        double AiOverrideFrequencyPercent,
        int CriticalShortagesCount,
        int TotalMonitoredZones,
        int TotalDispatchedUnits,
        double NationalSlaCompliancePercent
    );
}
