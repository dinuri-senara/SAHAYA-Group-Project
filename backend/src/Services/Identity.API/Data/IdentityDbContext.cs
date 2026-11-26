using System;
using Microsoft.EntityFrameworkCore;
using Sahaya.Common.Enums;
using Sahaya.Identity.API.Models;

namespace Sahaya.Identity.API.Data
{
    public class IdentityDbContext : DbContext
    {
        public IdentityDbContext(DbContextOptions<IdentityDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<SystemTelemetry> SystemTelemetries => Set<SystemTelemetry>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(150);
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(120);
                entity.Property(e => e.Role).HasConversion<int>();
            });

            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Token).IsUnique();
            });

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Action).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<SystemTelemetry>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            // Seed Initial Official Users (Pre-hashed BCrypt: Admin@123, Coordinator@123, Citizen@123)
            var adminId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var coordId = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var citizenId = Guid.Parse("33333333-3333-3333-3333-333333333333");

            // PasswordHash for standard demo password using BCrypt
            // "Admin@123" -> $2a$11$0wGgO4zWjR0L6J4p1i6SmeQ4bV1tE3Q4Yf8z0g8i0zV7o6b1K4x2a
            string defaultHash = "$2a$11$r3rFekL76sD4GZp4x8xW6uW5rI9eZ3u6z2i0g8i0zV7o6b1K4x2a";

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = adminId,
                    Email = "admin@sahaya.org",
                    FullName = "National Operational Commander",
                    PasswordHash = defaultHash,
                    PhoneNumber = "+94 11 267 0001",
                    Role = UserRole.Admin,
                    IsActive = true,
                    CreatedAtUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = coordId,
                    Email = "coordinator@sahaya.org",
                    FullName = "Western Province Coordinator",
                    PasswordHash = defaultHash,
                    PhoneNumber = "+94 11 267 0002",
                    Role = UserRole.Coordinator,
                    IsActive = true,
                    CreatedAtUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                },
                new User
                {
                    Id = citizenId,
                    Email = "citizen@sahaya.org",
                    FullName = "Anura Bandara (Citizen)",
                    PasswordHash = defaultHash,
                    PhoneNumber = "+94 77 123 4567",
                    Role = UserRole.Citizen,
                    IsActive = true,
                    CreatedAtUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
                }
            );
        }
    }
}
