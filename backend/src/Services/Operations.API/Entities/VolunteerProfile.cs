using Sahaya.Common.Entities;
using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.Entities;

public class VolunteerProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string SkillsJson { get; set; } = "[]";
    public VolunteerAvailability AvailabilityStatus { get; set; } = VolunteerAvailability.Available;
    public string ServiceArea { get; set; } = string.Empty;
    public bool IsVerified { get; set; } = true;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }

    public ICollection<VolunteerTask> Tasks { get; set; } = new List<VolunteerTask>();
}
