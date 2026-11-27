using Microsoft.EntityFrameworkCore;
using Sahaya.Operations.API.Entities;

namespace Sahaya.Operations.API.Data;

public class OperationsDbContext : DbContext
{
    public OperationsDbContext(DbContextOptions<OperationsDbContext> options) : base(options)
    {
    }

    public DbSet<VolunteerProfile> VolunteerProfiles => Set<VolunteerProfile>();
    public DbSet<VolunteerTask> VolunteerTasks => Set<VolunteerTask>();
    public DbSet<DonationCampaign> DonationCampaigns => Set<DonationCampaign>();
    public DbSet<Donation> Donations => Set<Donation>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<VolunteerProfile>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.Property(e => e.FullName).HasMaxLength(200);
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.Phone).HasMaxLength(50);
            entity.Property(e => e.ServiceArea).HasMaxLength(200);
        });

        modelBuilder.Entity<VolunteerTask>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.VolunteerProfile)
                  .WithMany(v => v.Tasks)
                  .HasForeignKey(e => e.VolunteerProfileId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.Property(e => e.Title).HasMaxLength(200);
        });

        modelBuilder.Entity<DonationCampaign>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.TargetAmount).HasPrecision(18, 2);
            entity.Property(e => e.RaisedAmount).HasPrecision(18, 2);
        });

        modelBuilder.Entity<Donation>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Campaign)
                  .WithMany(c => c.Donations)
                  .HasForeignKey(e => e.CampaignId)
                  .OnDelete(DeleteBehavior.SetNull);
            entity.Property(e => e.Amount).HasPrecision(18, 2);
            entity.Property(e => e.EstimatedValue).HasPrecision(18, 2);
            entity.Property(e => e.Currency).HasMaxLength(10);
            entity.Property(e => e.DonorName).HasMaxLength(200);
        });
    }
}
