using System;
using Microsoft.EntityFrameworkCore;
using Sahaya.Coordination.API.Models;

namespace Sahaya.Coordination.API.Data
{
    public class CoordinationDbContext : DbContext
    {
        public CoordinationDbContext(DbContextOptions<CoordinationDbContext> options) : base(options) { }

        public DbSet<CrisisEvent> CrisisEvents => Set<CrisisEvent>();
        public DbSet<OperationalArea> OperationalAreas => Set<OperationalArea>();
        public DbSet<CoordinatorDecision> CoordinatorDecisions => Set<CoordinatorDecision>();
        public DbSet<EscalationLog> EscalationLogs => Set<EscalationLog>();
        public DbSet<TriageRecord> TriageRecords => Set<TriageRecord>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<CrisisEvent>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.DisasterType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Severity).IsRequired().HasMaxLength(30);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(30);

                entity.HasMany(e => e.OperationalAreas)
                      .WithOne(o => o.CrisisEvent)
                      .HasForeignKey(o => o.CrisisEventId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OperationalArea>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Province).IsRequired().HasMaxLength(100);
                entity.Property(e => e.District).IsRequired().HasMaxLength(100);
                entity.Property(e => e.CommanderName).HasMaxLength(120);
            });

            modelBuilder.Entity<CoordinatorDecision>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RequestId).IsRequired().HasMaxLength(60);
                entity.Property(e => e.Action).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<EscalationLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RequestId).IsRequired().HasMaxLength(60);
                entity.Property(e => e.Reason).IsRequired().HasMaxLength(500);
            });

            modelBuilder.Entity<TriageRecord>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RequestReferenceCode).IsRequired().HasMaxLength(50);
                entity.Property(e => e.CitizenName).IsRequired().HasMaxLength(120);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Urgency).IsRequired().HasMaxLength(30);
                entity.Property(e => e.LifecycleStatus).IsRequired().HasMaxLength(30);
            });

            // Seed Initial Sri Lankan Humanitarian Crisis Events
            var floodEventId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var kelaniEventId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

            modelBuilder.Entity<CrisisEvent>().HasData(
                new CrisisEvent
                {
                    Id = floodEventId,
                    Title = "South-Western Monsoon Flash Floods & Levee Breach",
                    Description = "Major inundation across lower Kelani, Gin Ganga and Kalu Ganga basins following 280mm precipitation.",
                    DisasterType = "Flood",
                    Severity = "Critical",
                    Latitude = 6.9271,
                    Longitude = 79.8612,
                    RadiusKm = 25.0,
                    AffectedCount = 14200,
                    Status = "Active",
                    StartedAtUtc = new DateTime(2026, 11, 18, 4, 30, 0, DateTimeKind.Utc),
                    CreatedAtUtc = new DateTime(2026, 11, 18, 4, 30, 0, DateTimeKind.Utc)
                },
                new CrisisEvent
                {
                    Id = kelaniEventId,
                    Title = "Sedawatta & Wellampitiya Rising Levee Water Surge",
                    Description = "Attanagalu Oya and lower Kelani river flood buffer threshold exceeded at Dunamale gauge (4.75m).",
                    DisasterType = "Flood",
                    Severity = "High",
                    Latitude = 6.9480,
                    Longitude = 79.8920,
                    RadiusKm = 12.0,
                    AffectedCount = 5800,
                    Status = "Active",
                    StartedAtUtc = new DateTime(2026, 11, 19, 2, 0, 0, DateTimeKind.Utc),
                    CreatedAtUtc = new DateTime(2026, 11, 19, 2, 0, 0, DateTimeKind.Utc)
                }
            );

            // Seed Operational Areas
            modelBuilder.Entity<OperationalArea>().HasData(
                new OperationalArea
                {
                    Id = Guid.Parse("11111111-0000-0000-0000-000000000001"),
                    CrisisEventId = floodEventId,
                    Province = "Western Province",
                    District = "Colombo",
                    DSDivision = "Kolonnawa / Wellampitiya",
                    CommanderName = "Capt. Gamini Silva (SL Navy)",
                    ContactPhone = "+94 11 267 8900",
                    ResponseStatus = "Active Deployment",
                    SheltersOpen = 6,
                    DepotStockStatus = "Warning",
                    CreatedAtUtc = new DateTime(2026, 11, 18, 5, 0, 0, DateTimeKind.Utc)
                },
                new OperationalArea
                {
                    Id = Guid.Parse("11111111-0000-0000-0000-000000000002"),
                    CrisisEventId = floodEventId,
                    Province = "Western Province",
                    District = "Gampaha",
                    DSDivision = "Kelaniya & Biyagama",
                    CommanderName = "Major R. Wijesinghe (First Responders)",
                    ContactPhone = "+94 11 291 1234",
                    ResponseStatus = "Relief Distribution",
                    SheltersOpen = 8,
                    DepotStockStatus = "Critical",
                    CreatedAtUtc = new DateTime(2026, 11, 18, 5, 30, 0, DateTimeKind.Utc)
                },
                new OperationalArea
                {
                    Id = Guid.Parse("11111111-0000-0000-0000-000000000003"),
                    CrisisEventId = kelaniEventId,
                    Province = "Southern Province",
                    District = "Galle",
                    DSDivision = "Baddegama / Nilwala Basin",
                    CommanderName = "Southern Disaster Command Officer",
                    ContactPhone = "+94 91 223 4567",
                    ResponseStatus = "Continuous Monitoring",
                    SheltersOpen = 4,
                    DepotStockStatus = "Adequate",
                    CreatedAtUtc = new DateTime(2026, 11, 19, 2, 30, 0, DateTimeKind.Utc)
                }
            );

            // Seed Initial Triage Queue Records
            modelBuilder.Entity<TriageRecord>().HasData(
                new TriageRecord
                {
                    Id = Guid.Parse("22222222-0000-0000-0000-000000000001"),
                    RequestReferenceCode = "REQ-101",
                    CitizenName = "Kavinda Fernando",
                    ContactPhone = "+94 71 889 2211",
                    Category = "DrinkingWater",
                    Urgency = "Immediate",
                    Narrative = "Drinking water contamination. 14 families stranded on upper rooftop of temple.",
                    LocationName = "Sedawatta Temple, Wellampitiya",
                    Latitude = 6.9420,
                    Longitude = 79.8870,
                    PeopleCount = 45,
                    LifecycleStatus = "Submitted",
                    SlaTargetHours = 4.0,
                    ElapsedHours = 1.2,
                    IsAiAssessed = true,
                    AiConfidenceScore = 0.94,
                    AiRecommendationSummary = "Urgent Clean Water Purification Packs & Rescue Rafts advised.",
                    CreatedAtUtc = new DateTime(2026, 11, 19, 6, 30, 0, DateTimeKind.Utc)
                },
                new TriageRecord
                {
                    Id = Guid.Parse("22222222-0000-0000-0000-000000000002"),
                    RequestReferenceCode = "REQ-102",
                    CitizenName = "Nimali Wickramasinghe",
                    ContactPhone = "+94 77 452 9901",
                    Category = "Medical",
                    Urgency = "Critical",
                    Narrative = "Insulin and emergency pediatric medical care required immediately for infant and elderly diabetic patient.",
                    LocationName = "Pugoda Bridge North, Gampaha",
                    Latitude = 6.9740,
                    Longitude = 80.0150,
                    PeopleCount = 5,
                    LifecycleStatus = "UnderReview",
                    AssignedResponderUnit = "Mobile Paramedic Unit 02",
                    SlaTargetHours = 4.0,
                    ElapsedHours = 2.1,
                    IsAiAssessed = true,
                    AiConfidenceScore = 0.98,
                    AiRecommendationSummary = "Critical cold-chain insulin transportation flag detected.",
                    CreatedAtUtc = new DateTime(2026, 11, 19, 7, 15, 0, DateTimeKind.Utc)
                },
                new TriageRecord
                {
                    Id = Guid.Parse("22222222-0000-0000-0000-000000000003"),
                    RequestReferenceCode = "REQ-103",
                    CitizenName = "Sunil Shantha",
                    ContactPhone = "+94 75 112 3344",
                    Category = "Food",
                    Urgency = "High",
                    Narrative = "Dry rations needed for elderly care home evacuated to community hall.",
                    LocationName = "Biyagama Central Community Hall",
                    Latitude = 6.9480,
                    Longitude = 79.9920,
                    PeopleCount = 30,
                    LifecycleStatus = "Dispatched",
                    AssignedResponderUnit = "Sri Lanka Red Cross Rations Van",
                    SlaTargetHours = 6.0,
                    ElapsedHours = 3.4,
                    IsAiAssessed = true,
                    AiConfidenceScore = 0.89,
                    AiRecommendationSummary = "Approved direct dry biscuit & water packet allocation.",
                    CreatedAtUtc = new DateTime(2026, 11, 19, 8, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
