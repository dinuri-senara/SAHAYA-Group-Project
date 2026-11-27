using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.DTOs;

public record VolunteerProfileDto(
    Guid Id,
    Guid UserId,
    string FullName,
    string Email,
    string Phone,
    List<string> Skills,
    VolunteerAvailability AvailabilityStatus,
    string ServiceArea,
    bool IsVerified,
    double? Latitude,
    double? Longitude,
    int CompletedTasksCount,
    DateTime CreatedAtUtc
);

public record CreateVolunteerProfileDto(
    List<string> Skills,
    string ServiceArea,
    string Phone,
    double? Latitude = null,
    double? Longitude = null
);

public record VolunteerTaskDto(
    Guid Id,
    Guid VolunteerProfileId,
    string VolunteerName,
    Guid? AssistanceRequestId,
    string? RequestTitle,
    string Title,
    string Description,
    RequestUrgency Priority,
    VolunteerTaskStatus Status,
    DateTime? Deadline,
    DateTime AssignedAt,
    DateTime? CompletedAt,
    string? Notes
);

public record CreateVolunteerTaskDto(
    Guid VolunteerProfileId,
    Guid? AssistanceRequestId,
    string? RequestTitle,
    string Title,
    string Description,
    RequestUrgency Priority,
    DateTime? Deadline
);

public record UpdateVolunteerTaskStatusDto(
    VolunteerTaskStatus Status,
    string? Notes
);

public record VolunteerCheckInDto(
    double Latitude,
    double Longitude,
    string? LocationNotes
);
