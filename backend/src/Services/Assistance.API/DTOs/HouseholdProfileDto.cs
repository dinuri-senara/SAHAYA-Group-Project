using System.Collections.Generic;

namespace Sahaya.Assistance.API.DTOs
{
    public class HouseholdProfileDto
    {
        public string ResidenceType { get; set; } = "Family";
        public int TotalMembers { get; set; } = 1;
        public HouseholdCompositionDto Composition { get; set; } = new();
        public string Address { get; set; } = string.Empty;
        public string District { get; set; } = "Colombo";
        public string City { get; set; } = string.Empty;
        public string Province { get; set; } = "Western";
        public string EmergencyContactName { get; set; } = string.Empty;
        public string EmergencyContactPhone { get; set; } = string.Empty;
        public bool NoSpecialNeeds { get; set; } = false;
        public bool PreferNotToDisclose { get; set; } = false;
        public Dictionary<string, VulnerabilityCategoryDto> Vulnerabilities { get; set; } = new();
    }

    public class HouseholdCompositionDto
    {
        public int TotalMembers { get; set; } = 1;
        public int Infants { get; set; }
        public int Children { get; set; }
        public int Adults { get; set; } = 1;
        public int Elderly { get; set; }
    }

    public class VulnerabilityCategoryDto
    {
        public bool Selected { get; set; }
        public int AffectedCount { get; set; } = 1;
        public string? Details { get; set; }
        public bool RequiresSpecialMobility { get; set; }
    }
}
