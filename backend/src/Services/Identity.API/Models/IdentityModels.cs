using System;
using Sahaya.Common.Entities;
using Sahaya.Common.Enums;

namespace Sahaya.Identity.API.Models
{
    public class User : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public UserRole Role { get; set; } = UserRole.Citizen;
        public bool IsActive { get; set; } = true;
        public DateTime? LastLoginAtUtc { get; set; }
    }

    public class RefreshToken : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAtUtc { get; set; }
        public bool IsRevoked { get; set; } = false;
        public DateTime? RevokedAtUtc { get; set; }
    }

    public class AuditLog : BaseEntity
    {
        public Guid? UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string EntityName { get; set; } = string.Empty;
        public string? EntityId { get; set; }
        public string? ChangesJson { get; set; }
        public string IpAddress { get; set; } = string.Empty;
    }

    public class SystemTelemetry : BaseEntity
    {
        public string ServiceName { get; set; } = "Sahaya.Identity.API";
        public string Status { get; set; } = "Online";
        public double CpuUsagePercent { get; set; } = 4.2;
        public double MemoryUsageMb { get; set; } = 128.5;
        public int DatabaseLatencyMs { get; set; } = 2;
        public int ActiveConnections { get; set; } = 14;
    }
}
