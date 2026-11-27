using System;
using Microsoft.EntityFrameworkCore;
using Sahaya.AIIntelligence.API.Models;

namespace Sahaya.AIIntelligence.API.Data
{
    public class AIIntelligenceDbContext : DbContext
    {
        public AIIntelligenceDbContext(DbContextOptions<AIIntelligenceDbContext> options)
            : base(options)
        {
        }

        public DbSet<AIRecommendation> AIRecommendations => Set<AIRecommendation>();
        public DbSet<HumanOverrideAudit> HumanOverrideAudits => Set<HumanOverrideAudit>();
        public DbSet<DuplicateMatch> DuplicateMatches => Set<DuplicateMatch>();
        public DbSet<AIChatSession> AIChatSessions => Set<AIChatSession>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AIRecommendation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.RequestId);
                entity.Property(e => e.ConfidenceScore).HasPrecision(5, 4);
            });

            modelBuilder.Entity<HumanOverrideAudit>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.RequestId);
                entity.HasIndex(e => e.CoordinatorUserId);
                entity.HasIndex(e => e.TimestampUtc);
            });

            modelBuilder.Entity<DuplicateMatch>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.PrimaryRequestId);
                entity.HasIndex(e => e.DuplicateRequestId);
            });

            modelBuilder.Entity<AIChatSession>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.SessionId);
            });
        }

        public void SeedInitialData()
        {
            if (AIRecommendations.Any()) return;

            var sampleRequestId1 = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var sampleRequestId2 = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var coordinatorId = Guid.Parse("33333333-3333-3333-3333-333333333333");

            // Seed initial AI Recommendation
            var rec1 = new AIRecommendation
            {
                Id = Guid.NewGuid(),
                RequestId = sampleRequestId1,
                PredictedCategory = "MedicalAssistance",
                RecommendedPriority = "Critical",
                ConfidenceScore = 0.942,
                RationaleText = "NLP detected life-threatening medical emergency (infant breathing distress + rising flood waters in Kelaniya zone). Immediate priority dispatched.",
                GeneratedAtUtc = DateTime.UtcNow.AddMinutes(-30),
                ReviewStatus = "Accepted"
            };

            var rec2 = new AIRecommendation
            {
                Id = Guid.NewGuid(),
                RequestId = sampleRequestId2,
                PredictedCategory = "DrinkingWater",
                RecommendedPriority = "High",
                ConfidenceScore = 0.885,
                RationaleText = "Household with 6 occupants reported contaminated well water after levee breach. Water tanker dispatch recommended.",
                GeneratedAtUtc = DateTime.UtcNow.AddMinutes(-15),
                ReviewStatus = "Pending"
            };

            AIRecommendations.AddRange(rec1, rec2);

            // Seed initial Human Override Audit
            var audit1 = new HumanOverrideAudit
            {
                Id = Guid.NewGuid(),
                RequestId = sampleRequestId1,
                CoordinatorUserId = coordinatorId,
                OriginalRecommendationJson = "{\"RecommendedPriority\":\"Critical\",\"ConfidenceScore\":0.942,\"PredictedCategory\":\"MedicalAssistance\"}",
                HumanAction = "Accepted",
                ModifiedPriority = null,
                Justification = "Confirmed critical medical distress with regional Sri Lanka Red Cross rapid squad.",
                TimestampUtc = DateTime.UtcNow.AddMinutes(-25)
            };

            HumanOverrideAudits.Add(audit1);

            SaveChanges();
        }
    }
}
