using Sahaya.Operations.API.DTOs;

namespace Sahaya.Operations.API.Services;

public interface IVolunteerService
{
    Task<IReadOnlyList<VolunteerProfileDto>> GetAllVolunteersAsync(CancellationToken cancellationToken = default);
    Task<VolunteerProfileDto?> GetProfileByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<VolunteerProfileDto> RegisterOrUpdateProfileAsync(Guid userId, string fullName, string email, CreateVolunteerProfileDto dto, CancellationToken cancellationToken = default);
    Task<VolunteerTaskDto> AssignTaskAsync(CreateVolunteerTaskDto dto, Guid assignedById, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<VolunteerTaskDto>> GetTasksForVolunteerAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<VolunteerTaskDto>> GetAvailableTasksAsync(CancellationToken cancellationToken = default);
    Task<VolunteerTaskDto> AcceptTaskAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default);
    Task<VolunteerTaskDto> UpdateTaskStatusAsync(Guid taskId, Guid userId, UpdateVolunteerTaskStatusDto dto, CancellationToken cancellationToken = default);
    Task RecordCheckInAsync(Guid userId, VolunteerCheckInDto dto, CancellationToken cancellationToken = default);
}
