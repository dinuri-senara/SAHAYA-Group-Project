using System;
using System.Collections.Generic;
using Sahaya.Logistics.API.Models;

namespace Sahaya.Logistics.API.DTOs
{
    // ==========================================
    // Shelter DTOs
    // ==========================================
    public class CreateShelterDto
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int TotalCapacity { get; set; }
        public string ContactPerson { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public List<string> Facilities { get; set; } = new();
        public string AccessibilityInfo { get; set; } = string.Empty;
        public bool IsWheelchairAccessible { get; set; } = true;
    }

    public class UpdateShelterDto
    {
        public int? TotalCapacity { get; set; }
        public int? CurrentOccupancy { get; set; }
        public ShelterStatus? Status { get; set; }
        public string? ContactPhone { get; set; }
        public List<string>? Facilities { get; set; }
        public string? AccessibilityInfo { get; set; }
    }

    public class ShelterResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int TotalCapacity { get; set; }
        public int CurrentOccupancy { get; set; }
        public int AvailableCapacity { get; set; }
        public double OccupancyPercentage { get; set; }
        public ShelterStatus Status { get; set; }
        public string ContactPerson { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public List<string> Facilities { get; set; } = new();
        public string AccessibilityInfo { get; set; } = string.Empty;
        public bool IsWheelchairAccessible { get; set; }

        public double WaterStockLiters { get; set; }
        public int FoodRationBoxes { get; set; }
        public int MedicalKitPacks { get; set; }
        public DateTime? LastStockAuditAtUtc { get; set; }

        // SPHERE Satiety Metrics
        public double DailyWaterConsumptionLiters { get; set; }
        public double WaterDaysRemaining { get; set; }
        public string WaterSatietyStatus { get; set; } = "Adequate";
    }

    public class CampSatietyBurnRateDto
    {
        public Guid ShelterId { get; set; }
        public string ShelterName { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public int CurrentOccupancy { get; set; }
        public double WaterStockLiters { get; set; }
        public double DailyWaterBurnRateLiters { get; set; } // CurrentOccupancy * 3L (SPHERE standard)
        public double WaterDaysRemaining { get; set; }
        public int FoodRationBoxes { get; set; }
        public double FoodDaysRemaining { get; set; }
        public string DepletionUrgency { get; set; } = "Stable"; // Stable, Warning, Critical
        public string Recommendation { get; set; } = string.Empty;
    }

    public class InterCampTransferRequestDto
    {
        public Guid SourceShelterId { get; set; }
        public Guid TargetShelterId { get; set; }
        public double WaterLiters { get; set; }
        public int FoodBoxes { get; set; }
        public int MedicalPacks { get; set; }
        public string Notes { get; set; } = string.Empty;
    }

    public class AssignEvacueesDto
    {
        public Guid? AssistanceRequestId { get; set; }
        public string HeadOfFamilyName { get; set; } = string.Empty;
        public int NumberOfPeople { get; set; }
    }

    // ==========================================
    // Resource Inventory DTOs
    // ==========================================
    public class CreateResourceDto
    {
        public string Name { get; set; } = string.Empty;
        public ResourceCategory Category { get; set; }
        public double TotalQuantity { get; set; }
        public double LowStockThreshold { get; set; }
        public string Unit { get; set; } = "Units";
        public string WarehouseLocation { get; set; } = "Central Logistics Depot - Colombo";
    }

    public class ReplenishStockDto
    {
        public double AdditionalQuantity { get; set; }
        public string SupplierOrDonor { get; set; } = string.Empty;
    }

    public class ResourceResponseDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public ResourceCategory Category { get; set; }
        public double TotalQuantity { get; set; }
        public double AvailableQuantity { get; set; }
        public double AllocatedQuantity { get; set; }
        public double LowStockThreshold { get; set; }
        public string Unit { get; set; } = "Units";
        public string WarehouseLocation { get; set; } = string.Empty;
        public ResourceStatus Status { get; set; }
        public bool IsLowStock => AvailableQuantity <= LowStockThreshold;
        public DateTime? LastReplenishedAtUtc { get; set; }
    }

    public class CreateAllocationDto
    {
        public Guid ResourceId { get; set; }
        public Guid? AssistanceRequestId { get; set; }
        public Guid? ShelterId { get; set; }
        public double QuantityAllocated { get; set; }
        public string DestinationLocation { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string TrackingNotes { get; set; } = string.Empty;
    }

    public class UpdateAllocationStatusDto
    {
        public AllocationStatus Status { get; set; }
        public string? DeliveryNotes { get; set; }
    }

    // ==========================================
    // Shelter Supply Requisition DTOs
    // ==========================================
    public class CreateRequisitionDto
    {
        public Guid ShelterId { get; set; }
        public string ShelterName { get; set; } = string.Empty;
        public ResourceCategory Category { get; set; }
        public string ItemName { get; set; } = string.Empty;
        public double QuantityRequested { get; set; }
        public string Unit { get; set; } = "Units";
        public RequisitionUrgency Urgency { get; set; } = RequisitionUrgency.High;
        public string Justification { get; set; } = string.Empty;
        public string SourceDepot { get; set; } = "Central Logistics Depot - Colombo";
    }

    public class UpdateRequisitionStatusDto
    {
        public RequisitionStatus Status { get; set; }
        public string? ReviewNotes { get; set; }
    }
}
