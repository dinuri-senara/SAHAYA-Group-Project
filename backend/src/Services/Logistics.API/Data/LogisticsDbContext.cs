using System;
using Microsoft.EntityFrameworkCore;
using Sahaya.Logistics.API.Models;

namespace Sahaya.Logistics.API.Data
{
    public class LogisticsDbContext : DbContext
    {
        public LogisticsDbContext(DbContextOptions<LogisticsDbContext> options) : base(options) { }

        public DbSet<Shelter> Shelters => Set<Shelter>();
        public DbSet<ShelterStockAudit> ShelterStockAudits => Set<ShelterStockAudit>();
        public DbSet<ResourceItem> Resources => Set<ResourceItem>();
        public DbSet<ResourceAllocation> ResourceAllocations => Set<ResourceAllocation>();
        public DbSet<InterCampTransfer> InterCampTransfers => Set<InterCampTransfer>();
        public DbSet<ShelterSupplyRequisition> ShelterSupplyRequisitions => Set<ShelterSupplyRequisition>();
        public DbSet<ShelterEvacueePlacement> ShelterEvacueePlacements => Set<ShelterEvacueePlacement>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==========================================
            // Entity Configurations
            // ==========================================
            modelBuilder.Entity<Shelter>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.Property(e => e.District).IsRequired().HasMaxLength(80);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(250);
                entity.Property(e => e.Status).HasConversion<int>();
            });

            modelBuilder.Entity<ResourceItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Category).HasConversion<int>();
                entity.Property(e => e.Status).HasConversion<int>();
                entity.Property(e => e.Unit).HasMaxLength(40);
                entity.Property(e => e.WarehouseLocation).HasMaxLength(150);

                // Optimistic Concurrency token for stock deductions
                entity.Property(e => e.RowVersion).IsRowVersion();
            });

            modelBuilder.Entity<ResourceAllocation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ResourceName).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Category).HasConversion<int>();
                entity.Property(e => e.Status).HasConversion<int>();
                entity.Property(e => e.DestinationLocation).HasMaxLength(200);
                entity.Property(e => e.RecipientName).HasMaxLength(120);
            });

            modelBuilder.Entity<InterCampTransfer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.SourceShelterName).HasMaxLength(150);
                entity.Property(e => e.TargetShelterName).HasMaxLength(150);
                entity.Property(e => e.Status).HasConversion<int>();
            });

            modelBuilder.Entity<ShelterSupplyRequisition>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ShelterName).HasMaxLength(150);
                entity.Property(e => e.ItemName).HasMaxLength(150);
                entity.Property(e => e.Category).HasConversion<int>();
                entity.Property(e => e.Urgency).HasConversion<int>();
                entity.Property(e => e.Status).HasConversion<int>();
            });

            modelBuilder.Entity<ShelterStockAudit>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AuditorName).HasMaxLength(100);
            });

            modelBuilder.Entity<ShelterEvacueePlacement>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.HeadOfFamilyName).HasMaxLength(120);
            });

            // ==========================================
            // Deterministic IDs for Seed Data
            // ==========================================
            var shelter1Id = Guid.Parse("44444444-1111-1111-1111-000000000001");
            var shelter2Id = Guid.Parse("44444444-1111-1111-1111-000000000002");
            var shelter3Id = Guid.Parse("44444444-1111-1111-1111-000000000003");
            var shelter4Id = Guid.Parse("44444444-1111-1111-1111-000000000004");
            var shelter5Id = Guid.Parse("44444444-1111-1111-1111-000000000005");

            var res1Id = Guid.Parse("55555555-1111-1111-1111-000000000001");
            var res2Id = Guid.Parse("55555555-1111-1111-1111-000000000002");
            var res3Id = Guid.Parse("55555555-1111-1111-1111-000000000003");
            var res4Id = Guid.Parse("55555555-1111-1111-1111-000000000004");
            var res5Id = Guid.Parse("55555555-1111-1111-1111-000000000005");
            var res6Id = Guid.Parse("55555555-1111-1111-1111-000000000006");

            var baseDate = new DateTime(2026, 1, 15, 8, 30, 0, DateTimeKind.Utc);

            // ==========================================
            // 1. Seed Shelters (Sri Lanka Real-World Safe Zones)
            // ==========================================
            modelBuilder.Entity<Shelter>().HasData(
                new Shelter
                {
                    Id = shelter1Id,
                    Name = "Rahula College Safe Haven",
                    Address = "Rahula Road, Kotuwegoda",
                    District = "Matara",
                    Latitude = 6.0535,
                    Longitude = 80.5482,
                    TotalCapacity = 350,
                    CurrentOccupancy = 280,
                    Status = ShelterStatus.Active,
                    ContactPerson = "Ven. Dhammarathana Thero / Principal",
                    ContactPhone = "+94 41 222 2341",
                    FacilitiesJson = "[\"Clean Drinking Water\",\"First Aid\",\"Medical Officer\",\"Sanitized Bedding\",\"Power Generator\"]",
                    AccessibilityInfo = "Wheelchair ramp available on ground floor auditorium",
                    IsWheelchairAccessible = true,
                    WaterStockLiters = 3200,
                    FoodRationBoxes = 400,
                    MedicalKitPacks = 45,
                    LastStockAuditAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new Shelter
                {
                    Id = shelter2Id,
                    Name = "Ratnapura Central College Hall",
                    Address = "Main Street, Kuruwita Road",
                    District = "Ratnapura",
                    Latitude = 6.6828,
                    Longitude = 80.4034,
                    TotalCapacity = 200,
                    CurrentOccupancy = 185,
                    Status = ShelterStatus.Active,
                    ContactPerson = "Mr. K.L. Samaraweera (Disaster Relief Officer)",
                    ContactPhone = "+94 45 222 3456",
                    FacilitiesJson = "[\"Clean Water Tanks\",\"Warm Meals Kitchen\",\"Emergency Solar Lighting\"]",
                    AccessibilityInfo = "Ground level access with assistance staff",
                    IsWheelchairAccessible = true,
                    WaterStockLiters = 900, // Critical burn-rate (~1.6 days remaining for 185 people)
                    FoodRationBoxes = 95,
                    MedicalKitPacks = 15,
                    LastStockAuditAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new Shelter
                {
                    Id = shelter3Id,
                    Name = "St. Thomas Community Hall",
                    Address = "Church Street, Ukuwela Road",
                    District = "Matale",
                    Latitude = 7.4675,
                    Longitude = 80.6234,
                    TotalCapacity = 150,
                    CurrentOccupancy = 80,
                    Status = ShelterStatus.Active,
                    ContactPerson = "Rev. Father Anthony Perera",
                    ContactPhone = "+94 66 222 1234",
                    FacilitiesJson = "[\"Clean Water Filter\",\"Kitchen\",\"First Aid Station\",\"Child Friendly Space\"]",
                    AccessibilityInfo = "Full wheelchair accessibility ramp",
                    IsWheelchairAccessible = true,
                    WaterStockLiters = 2600, // Surplus water (~10.8 days remaining)
                    FoodRationBoxes = 310,
                    MedicalKitPacks = 30,
                    LastStockAuditAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new Shelter
                {
                    Id = shelter4Id,
                    Name = "Ananda Vidyalaya Safe Zone",
                    Address = "Maradana, Colombo 10",
                    District = "Colombo",
                    Latitude = 6.9271,
                    Longitude = 79.8612,
                    TotalCapacity = 500,
                    CurrentOccupancy = 320,
                    Status = ShelterStatus.Active,
                    ContactPerson = "Col. Prasanna Senaratne",
                    ContactPhone = "+94 11 269 5555",
                    FacilitiesJson = "[\"Medical Clinic\",\"Emergency Surgery Unit\",\"High-Speed Satellite Internet\",\"Purified Water\"]",
                    AccessibilityInfo = "Elevator and tactile paved pathways",
                    IsWheelchairAccessible = true,
                    WaterStockLiters = 4500,
                    FoodRationBoxes = 600,
                    MedicalKitPacks = 75,
                    LastStockAuditAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new Shelter
                {
                    Id = shelter5Id,
                    Name = "Dharmaraja College Disaster Shelter",
                    Address = "Dharmaraja Hill, Lake Round",
                    District = "Kandy",
                    Latitude = 7.2906,
                    Longitude = 80.6337,
                    TotalCapacity = 250,
                    CurrentOccupancy = 190,
                    Status = ShelterStatus.Active,
                    ContactPerson = "Dr. Asela Wickramasinghe",
                    ContactPhone = "+94 81 223 4444",
                    FacilitiesJson = "[\"First Aid\",\"Drinking Water\",\"Hot Meals Kitchen\",\"Emergency Radios\"]",
                    AccessibilityInfo = "Vehicular access directly to main sports pavilion",
                    IsWheelchairAccessible = false,
                    WaterStockLiters = 1500,
                    FoodRationBoxes = 220,
                    MedicalKitPacks = 25,
                    LastStockAuditAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                }
            );

            // ==========================================
            // 2. Seed Depot Resources
            // ==========================================
            modelBuilder.Entity<ResourceItem>().HasData(
                new ResourceItem
                {
                    Id = res1Id,
                    Name = "Clean Bottled Drinking Water (5L)",
                    Category = ResourceCategory.DrinkingWater,
                    TotalQuantity = 15000,
                    AvailableQuantity = 11200,
                    AllocatedQuantity = 3800,
                    LowStockThreshold = 2000,
                    Unit = "Bottles",
                    WarehouseLocation = "Central Logistics Depot - Colombo",
                    Status = ResourceStatus.Available,
                    LastReplenishedAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new ResourceItem
                {
                    Id = res2Id,
                    Name = "Emergency Dry Ration Food Kits (Family Pack)",
                    Category = ResourceCategory.Food,
                    TotalQuantity = 8500,
                    AvailableQuantity = 6100,
                    AllocatedQuantity = 2400,
                    LowStockThreshold = 1500,
                    Unit = "Packs",
                    WarehouseLocation = "Central Logistics Depot - Colombo",
                    Status = ResourceStatus.Available,
                    LastReplenishedAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new ResourceItem
                {
                    Id = res3Id,
                    Name = "Trauma First Aid & Emergency Medical Kits",
                    Category = ResourceCategory.MedicalSupplies,
                    TotalQuantity = 2000,
                    AvailableQuantity = 1450,
                    AllocatedQuantity = 550,
                    LowStockThreshold = 400,
                    Unit = "Kits",
                    WarehouseLocation = "Regional Medical Depot - Ratnapura",
                    Status = ResourceStatus.Available,
                    LastReplenishedAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new ResourceItem
                {
                    Id = res4Id,
                    Name = "Heavy-Duty Weatherproof Tents (6-Person)",
                    Category = ResourceCategory.ShelterTents,
                    TotalQuantity = 1200,
                    AvailableQuantity = 820,
                    AllocatedQuantity = 380,
                    LowStockThreshold = 250,
                    Unit = "Tents",
                    WarehouseLocation = "Central Logistics Depot - Colombo",
                    Status = ResourceStatus.Available,
                    LastReplenishedAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new ResourceItem
                {
                    Id = res5Id,
                    Name = "Family Hygiene & Sanitation Packs",
                    Category = ResourceCategory.Sanitation,
                    TotalQuantity = 6000,
                    AvailableQuantity = 4300,
                    AllocatedQuantity = 1700,
                    LowStockThreshold = 1000,
                    Unit = "Packs",
                    WarehouseLocation = "Southern Logistics Depot - Galle",
                    Status = ResourceStatus.Available,
                    LastReplenishedAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                },
                new ResourceItem
                {
                    Id = res6Id,
                    Name = "Emergency Mobile Diesel Generators (5kVA)",
                    Category = ResourceCategory.PowerAndFuel,
                    TotalQuantity = 45,
                    AvailableQuantity = 12,
                    AllocatedQuantity = 33,
                    LowStockThreshold = 10,
                    Unit = "Generators",
                    WarehouseLocation = "Central Logistics Depot - Colombo",
                    Status = ResourceStatus.Low,
                    LastReplenishedAtUtc = baseDate,
                    CreatedAtUtc = baseDate
                }
            );

            // ==========================================
            // 3. Seed Initial Resource Allocations (Dispatches Log)
            // ==========================================
            modelBuilder.Entity<ResourceAllocation>().HasData(
                new ResourceAllocation
                {
                    Id = Guid.Parse("66666666-1111-1111-1111-000000000001"),
                    ResourceId = res1Id,
                    ResourceName = "Clean Bottled Drinking Water (5L)",
                    Category = ResourceCategory.DrinkingWater,
                    ShelterId = shelter1Id,
                    QuantityAllocated = 500,
                    Unit = "Bottles",
                    DestinationLocation = "Rahula College Safe Haven - Matara",
                    RecipientName = "Ven. Dhammarathana Thero",
                    DispatchedAtUtc = baseDate.AddDays(-2),
                    DeliveredAtUtc = baseDate.AddDays(-2).AddHours(4),
                    Status = AllocationStatus.Delivered,
                    TrackingNotes = "Direct military convoy delivery completed successfully.",
                    CreatedAtUtc = baseDate.AddDays(-2)
                },
                new ResourceAllocation
                {
                    Id = Guid.Parse("66666666-1111-1111-1111-000000000002"),
                    ResourceId = res2Id,
                    ResourceName = "Emergency Dry Ration Food Kits (Family Pack)",
                    Category = ResourceCategory.Food,
                    ShelterId = shelter2Id,
                    QuantityAllocated = 250,
                    Unit = "Packs",
                    DestinationLocation = "Ratnapura Central College Hall",
                    RecipientName = "Mr. K.L. Samaraweera",
                    DispatchedAtUtc = baseDate.AddDays(-1),
                    DeliveredAtUtc = null,
                    Status = AllocationStatus.InTransit,
                    TrackingNotes = "Convoy delayed due to Pelmadulla flash flooding road blockage.",
                    CreatedAtUtc = baseDate.AddDays(-1)
                },
                new ResourceAllocation
                {
                    Id = Guid.Parse("66666666-1111-1111-1111-000000000003"),
                    ResourceId = res3Id,
                    ResourceName = "Trauma First Aid & Emergency Medical Kits",
                    Category = ResourceCategory.MedicalSupplies,
                    ShelterId = shelter3Id,
                    QuantityAllocated = 50,
                    Unit = "Kits",
                    DestinationLocation = "St. Thomas Community Hall - Matale",
                    RecipientName = "Rev. Father Anthony Perera",
                    DispatchedAtUtc = baseDate,
                    DeliveredAtUtc = null,
                    Status = AllocationStatus.Dispatched,
                    TrackingNotes = "Dispatched via Red Cross Ambulance emergency transport.",
                    CreatedAtUtc = baseDate
                }
            );

            // ==========================================
            // 4. Seed Inter-Camp Transfer (Surplus to Depleted Camp)
            // ==========================================
            modelBuilder.Entity<InterCampTransfer>().HasData(
                new InterCampTransfer
                {
                    Id = Guid.Parse("77777777-1111-1111-1111-000000000001"),
                    SourceShelterId = shelter3Id,
                    SourceShelterName = "St. Thomas Community Hall",
                    TargetShelterId = shelter2Id,
                    TargetShelterName = "Ratnapura Central College Hall",
                    WaterLiters = 1200,
                    FoodBoxes = 100,
                    MedicalPacks = 10,
                    TransferredAtUtc = baseDate.AddHours(-12),
                    ApprovedBy = "National Logistics Commander",
                    Notes = "AI-recommended emergency relief convoy to balance camp satiety equity.",
                    Status = TransferStatus.Completed,
                    CreatedAtUtc = baseDate.AddHours(-12)
                }
            );
        }
    }
}
