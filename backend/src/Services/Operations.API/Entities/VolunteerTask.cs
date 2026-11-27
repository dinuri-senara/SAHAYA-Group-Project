using Sahaya.Common.Entities;
using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.Entities;

public class VolunteerTask : BaseEntity
{
    public Guid VolunteerProfileId { get; set; }
    public VolunteerProfile VolunteerProfile { get; set; } = null!;

    public Guid? AssistanceRequestId { get; set; }
    public string? RequestTitle { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public RequestUrgency Priority { get; set; } = RequestUrgency.Medium;
    public VolunteerTaskStatus Status { get; set; } = VolunteerTaskStatus.Assigned;
    public DateTime? Deadline { get; set; }
    public Guid AssignedById { get; set; }
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; set; }
    public string? Notes { get; set; }
}
