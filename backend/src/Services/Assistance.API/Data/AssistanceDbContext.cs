using Microsoft.EntityFrameworkCore;
using Sahaya.Assistance.API.Models;

namespace Sahaya.Assistance.API.Data
{
    public class AssistanceDbContext : DbContext
    {
        public AssistanceDbContext(DbContextOptions<AssistanceDbContext> options) : base(options)
        {
        }

        public DbSet<AssistanceRequest> AssistanceRequests => Set<AssistanceRequest>();
        public DbSet<HouseholdProfile> HouseholdProfiles => Set<HouseholdProfile>();
        public DbSet<VulnerableMember> VulnerableMembers => Set<VulnerableMember>();
        public DbSet<RequestStatusHistory> RequestStatusHistories => Set<RequestStatusHistory>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // AssistanceRequest
            modelBuilder.Entity<AssistanceRequest>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.ReferenceCode).IsUnique();
                entity.HasIndex(e => e.CitizenId);
                entity.HasIndex(e => e.Status);
                entity.Property(e => e.Title).HasMaxLength(250).IsRequired();
                entity.Property(e => e.Address).HasMaxLength(500).IsRequired();
                entity.Property(e => e.ReferenceCode).HasMaxLength(50).IsRequired();

                entity.HasMany(e => e.StatusHistories)
                      .WithOne(h => h.AssistanceRequest)
                      .HasForeignKey(h => h.AssistanceRequestId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // HouseholdProfile
            modelBuilder.Entity<HouseholdProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.CitizenId).IsUnique();
                entity.Property(e => e.CitizenId).HasMaxLength(100).IsRequired();
                entity.Property(e => e.District).HasMaxLength(100);

                entity.HasMany(e => e.VulnerableMembers)
                      .WithOne(v => v.HouseholdProfile)
                      .HasForeignKey(v => v.HouseholdProfileId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // VulnerableMember
            modelBuilder.Entity<VulnerableMember>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Category).HasMaxLength(100).IsRequired();
            });

            // RequestStatusHistory
            modelBuilder.Entity<RequestStatusHistory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Status).HasMaxLength(50).IsRequired();
                entity.Property(e => e.Title).HasMaxLength(200);
            });
        }
    }
}
