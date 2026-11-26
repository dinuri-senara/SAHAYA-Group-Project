using System;
using System.Collections.Generic;
using Sahaya.Common.Entities;

namespace Sahaya.Assistance.API.Models
{
    public class HouseholdProfile : BaseEntity
    {
        public string CitizenId { get; set; } = string.Empty;
        public string ResidenceType { get; set; } = "Family";
        public int TotalMembers { get; set; } = 1;
        public string CompositionJson { get; set; } = "{}";
        public string Address { get; set; } = string.Empty;
        public string District { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = string.Empty;
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        public string Status { get; set; } = "Completed";
        public bool NoSpecialNeeds { get; set; } = false;
        public bool PreferNotToDisclose { get; set; } = false;

        public ICollection<VulnerableMember> VulnerableMembers { get; set; } = new List<VulnerableMember>();
    }
}
