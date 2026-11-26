using System;
using Sahaya.Common.Entities;

namespace Sahaya.Assistance.API.Models
{
    public class VulnerableMember : BaseEntity
    {
        public Guid HouseholdProfileId { get; set; }
        public string Category { get; set; } = string.Empty;
        public int AffectedCount { get; set; } = 1;
        public string? MedicalDetails { get; set; }
        public bool RequiresSpecialMobility { get; set; } = false;

        public HouseholdProfile? HouseholdProfile { get; set; }
    }
}
