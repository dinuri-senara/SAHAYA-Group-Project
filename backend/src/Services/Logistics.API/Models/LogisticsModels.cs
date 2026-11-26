using System;
using Sahaya.Common.Entities;

namespace Sahaya.Logistics.API.Models
{
    public enum ShelterStatus
    {
        Active = 1,
        Full = 2,
        Closed = 3,
        Maintenance = 4
    }

    public enum ResourceCategory
    {
        DrinkingWater = 1,
        Food = 2,
        MedicalSupplies = 3,
        ShelterTents = 4,
        Sanitation = 5,
        Clothing = 6,
        PowerAndFuel = 7
    }

    public enum ResourceStatus
    {
        Available = 1,
        Low = 2,
        Critical = 3,
        Depleted = 4
    }

    public enum AllocationStatus
    {
        Allocated = 1,
        Dispatched = 2,
        InTransit = 3,
        Delivered = 4,
        Cancelled = 5
    }

    public enum RequisitionUrgency
    {
        Low = 1,
        Medium = 2,
        High = 3,
        Critical = 4
    }

    public enum RequisitionStatus
    {
        Pending = 1,
        Approved = 2,
        Dispatched = 3,
        Delivered = 4,
        Rejected = 5
    }

    public enum TransferStatus
    {
        Initiated = 1,
        InTransit = 2,
        Completed = 3
    }

    /// <summary>
    /// Safe Shelter Entity (Evacuation camps & humanitarian relief centres)
    /// </summary>
    public class Shelter : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int TotalCapacity { get; set; } = 50;
        public int CurrentOccupancy { get; set; } = 0;
        public ShelterStatus Status { get; set; } = ShelterStatus.Active;
        public string ContactPerson { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string FacilitiesJson { get; set; } = "[\"Clean Water\",\"First Aid\",\"Medical Officer\"]";
        public string AccessibilityInfo { get; set; } = "Wheelchair accessible";
        public bool IsWheelchairAccessible { get; set; } = true;

        // Camp Satiety & Stock Audit metrics (SPHERE humanitarian standards)
        public double WaterStockLiters { get; set; } = 2500;
        public int FoodRationBoxes { get; set; } = 350;
        public int MedicalKitPacks { get; set; } = 40;
        public DateTime? LastStockAuditAtUtc { get; set; } = DateTime.UtcNow;

        public int AvailableCapacity => Math.Max(0, TotalCapacity - CurrentOccupancy);
        public double OccupancyPercentage => TotalCapacity > 0 
            ? Math.Round(((double)CurrentOccupancy / TotalCapacity) * 100, 1) 
            : 0.0;
    }

    /// <summary>
    /// Shelter Stock Audit History
    /// </summary>
    public class ShelterStockAudit : BaseEntity
    {
        public Guid ShelterId { get; set; }
        public string AuditorName { get; set; } = string.Empty;
        public double WaterStockLiters { get; set; }
        public int FoodRationBoxes { get; set; }
        public int MedicalKits { get; set; }
        public string Notes { get; set; } = string.Empty;
        public DateTime AuditedAtUtc { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Warehouse Resource Inventory Entity
    /// </summary>
    public class ResourceItem : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public ResourceCategory Category { get; set; } = ResourceCategory.DrinkingWater;
        public double TotalQuantity { get; set; }
        public double AvailableQuantity { get; set; }
        public double AllocatedQuantity { get; set; }
        public double LowStockThreshold { get; set; }
        public string Unit { get; set; } = "Units";
        public string WarehouseLocation { get; set; } = "Central Logistics Depot - Colombo";
        public ResourceStatus Status { get; set; } = ResourceStatus.Available;
        public DateTime? LastReplenishedAtUtc { get; set; } = DateTime.UtcNow;

        // Concurrency token to prevent over-allocation race conditions
        public byte[]? RowVersion { get; set; }
    }

    /// <summary>
    /// Relief Supplies Dispatch & Allocation Entity
    /// </summary>
    public class ResourceAllocation : BaseEntity
    {
        public Guid ResourceId { get; set; }
        public string ResourceName { get; set; } = string.Empty;
        public ResourceCategory Category { get; set; }
        public Guid? AssistanceRequestId { get; set; }
        public Guid? ShelterId { get; set; }
        public double QuantityAllocated { get; set; }
        public string Unit { get; set; } = "Units";
        public string DestinationLocation { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public DateTime DispatchedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? DeliveredAtUtc { get; set; }
        public AllocationStatus Status { get; set; } = AllocationStatus.Allocated;
        public string TrackingNotes { get; set; } = string.Empty;
    }

    /// <summary>
    /// Inter-Camp Stock Redistribution Entity (Surplus camp to depleted camp convoy)
    /// </summary>
    public class InterCampTransfer : BaseEntity
    {
        public Guid SourceShelterId { get; set; }
        public string SourceShelterName { get; set; } = string.Empty;
        public Guid TargetShelterId { get; set; }
        public string TargetShelterName { get; set; } = string.Empty;
        public double WaterLiters { get; set; }
        public int FoodBoxes { get; set; }
        public int MedicalPacks { get; set; }
        public DateTime TransferredAtUtc { get; set; } = DateTime.UtcNow;
        public string ApprovedBy { get; set; } = "Logistics Coordinator";
        public string Notes { get; set; } = string.Empty;
        public TransferStatus Status { get; set; } = TransferStatus.Completed;
    }

    /// <summary>
    /// Shelter Relief Requisition Request (Camps requesting central supplies)
    /// </summary>
    public class ShelterSupplyRequisition : BaseEntity
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
        public RequisitionStatus Status { get; set; } = RequisitionStatus.Pending;
        public string RequestedBy { get; set; } = "Shelter Administrator";
        public DateTime RequestedAtUtc { get; set; } = DateTime.UtcNow;
    }

    /// <summary>
    /// Citizen Evacuee Placement Record in Shelters
    /// </summary>
    public class ShelterEvacueePlacement : BaseEntity
    {
        public Guid ShelterId { get; set; }
        public Guid? AssistanceRequestId { get; set; }
        public string HeadOfFamilyName { get; set; } = string.Empty;
        public int NumberOfPeople { get; set; } = 1;
        public DateTime AssignedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? DischargedAtUtc { get; set; }
        public string Status { get; set; } = "Sheltered";
    }
}
