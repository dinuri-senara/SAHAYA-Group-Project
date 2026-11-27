using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Sahaya.Operations.API.Data;
using Sahaya.Operations.API.DTOs;
using Sahaya.Operations.API.Entities;
using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.Services;

public class VolunteerService : IVolunteerService
{
    private readonly OperationsDbContext _context;

    public VolunteerService(OperationsDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<VolunteerProfileDto>> GetAllVolunteersAsync(CancellationToken cancellationToken = default)
    {
        var list = await _context.VolunteerProfiles
            .Include(v => v.Tasks)
            .OrderBy(v => v.FullName)
            .ToListAsync(cancellationToken);

        return list.Select(MapToProfileDto).ToList();
    }

    public async Task<VolunteerProfileDto?> GetProfileByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var v = await _context.VolunteerProfiles
            .Include(v => v.Tasks)
            .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken);

        return v != null ? MapToProfileDto(v) : null;
    }

    public async Task<VolunteerProfileDto> RegisterOrUpdateProfileAsync(Guid userId, string fullName, string email, CreateVolunteerProfileDto dto, CancellationToken cancellationToken = default)
    {
        var existing = await _context.VolunteerProfiles
            .Include(v => v.Tasks)
            .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken);

        if (existing != null)
        {
            existing.SkillsJson = JsonSerializer.Serialize(dto.Skills);
            existing.ServiceArea = dto.ServiceArea.Trim();
            existing.Phone = dto.Phone.Trim();
            if (dto.Latitude.HasValue && dto.Longitude.HasValue)
            {
                existing.Latitude = dto.Latitude.Value;
                existing.Longitude = dto.Longitude.Value;
            }
            if (!string.IsNullOrWhiteSpace(fullName)) existing.FullName = fullName;
            if (!string.IsNullOrWhiteSpace(email)) existing.Email = email;
            existing.UpdatedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync(cancellationToken);
            return MapToProfileDto(existing);
        }

        var profile = new VolunteerProfile
        {
            UserId = userId,
            FullName = !string.IsNullOrWhiteSpace(fullName) ? fullName : "Registered Volunteer",
            Email = !string.IsNullOrWhiteSpace(email) ? email : string.Empty,
            SkillsJson = JsonSerializer.Serialize(dto.Skills),
            ServiceArea = dto.ServiceArea.Trim(),
            Phone = dto.Phone.Trim(),
            AvailabilityStatus = VolunteerAvailability.Available,
            IsVerified = true,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude
        };

        _context.VolunteerProfiles.Add(profile);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToProfileDto(profile);
    }

    public async Task<VolunteerTaskDto> AssignTaskAsync(CreateVolunteerTaskDto dto, Guid assignedById, CancellationToken cancellationToken = default)
    {
        var profile = await _context.VolunteerProfiles
            .FirstOrDefaultAsync(v => v.Id == dto.VolunteerProfileId, cancellationToken)
            ?? throw new KeyNotFoundException($"Volunteer profile {dto.VolunteerProfileId} not found.");

        var task = new VolunteerTask
        {
            VolunteerProfileId = dto.VolunteerProfileId,
            AssistanceRequestId = dto.AssistanceRequestId,
            RequestTitle = dto.RequestTitle,
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            Priority = dto.Priority,
            Status = VolunteerTaskStatus.Assigned,
            Deadline = dto.Deadline,
            AssignedById = assignedById,
            AssignedAt = DateTime.UtcNow
        };

        profile.AvailabilityStatus = VolunteerAvailability.Busy;
        _context.VolunteerTasks.Add(task);
        await _context.SaveChangesAsync(cancellationToken);

        return MapToTaskDto(task, profile.FullName);
    }

    public async Task<IReadOnlyList<VolunteerTaskDto>> GetTasksForVolunteerAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await _context.VolunteerProfiles
            .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken);

        if (profile == null) return new List<VolunteerTaskDto>();

        var tasks = await _context.VolunteerTasks
            .Include(t => t.VolunteerProfile)
            .Where(t => t.VolunteerProfileId == profile.Id)
            .OrderByDescending(t => t.AssignedAt)
            .ToListAsync(cancellationToken);

        return tasks.Select(t => MapToTaskDto(t, profile.FullName)).ToList();
    }

    public async Task<IReadOnlyList<VolunteerTaskDto>> GetAvailableTasksAsync(CancellationToken cancellationToken = default)
    {
        var tasks = await _context.VolunteerTasks
            .Include(t => t.VolunteerProfile)
            .Where(t => t.Status == VolunteerTaskStatus.Assigned)
            .OrderByDescending(t => t.AssignedAt)
            .ToListAsync(cancellationToken);

        return tasks.Select(t => MapToTaskDto(t, t.VolunteerProfile?.FullName ?? "Unassigned")).ToList();
    }

    public async Task<VolunteerTaskDto> AcceptTaskAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default)
    {
        var profile = await _context.VolunteerProfiles
            .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken)
            ?? throw new KeyNotFoundException($"Volunteer profile not found for user {userId}.");

        var task = await _context.VolunteerTasks
            .FirstOrDefaultAsync(t => t.Id == taskId && t.VolunteerProfileId == profile.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Task {taskId} not found or not assigned to this volunteer.");

        task.Status = VolunteerTaskStatus.Accepted;
        task.UpdatedAtUtc = DateTime.UtcNow;
        profile.AvailabilityStatus = VolunteerAvailability.Busy;

        await _context.SaveChangesAsync(cancellationToken);

        return MapToTaskDto(task, profile.FullName);
    }

    public async Task<VolunteerTaskDto> UpdateTaskStatusAsync(Guid taskId, Guid userId, UpdateVolunteerTaskStatusDto dto, CancellationToken cancellationToken = default)
    {
        var profile = await _context.VolunteerProfiles
            .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken)
            ?? throw new KeyNotFoundException($"Volunteer profile not found for user {userId}.");

        var task = await _context.VolunteerTasks
            .FirstOrDefaultAsync(t => t.Id == taskId && t.VolunteerProfileId == profile.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Task {taskId} not found or not assigned to this volunteer.");

        task.Status = dto.Status;
        task.UpdatedAtUtc = DateTime.UtcNow;
        if (!string.IsNullOrWhiteSpace(dto.Notes)) task.Notes = dto.Notes.Trim();

        if (dto.Status == VolunteerTaskStatus.Completed)
        {
            task.CompletedAt = DateTime.UtcNow;
            var otherActiveTasks = await _context.VolunteerTasks
                .AnyAsync(t => t.VolunteerProfileId == profile.Id && t.Id != taskId && (t.Status == VolunteerTaskStatus.Accepted || t.Status == VolunteerTaskStatus.InProgress), cancellationToken);

            if (!otherActiveTasks)
            {
                profile.AvailabilityStatus = VolunteerAvailability.Available;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return MapToTaskDto(task, profile.FullName);
    }

    public async Task RecordCheckInAsync(Guid userId, VolunteerCheckInDto dto, CancellationToken cancellationToken = default)
    {
        var profile = await _context.VolunteerProfiles
            .FirstOrDefaultAsync(v => v.UserId == userId, cancellationToken)
            ?? throw new KeyNotFoundException($"Volunteer profile not found for user {userId}.");

        profile.Latitude = dto.Latitude;
        profile.Longitude = dto.Longitude;
        profile.UpdatedAtUtc = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);
    }

    private static VolunteerProfileDto MapToProfileDto(VolunteerProfile v)
    {
        List<string> skills = new();
        try
        {
            skills = JsonSerializer.Deserialize<List<string>>(v.SkillsJson) ?? new List<string>();
        }
        catch { }

        int completed = v.Tasks?.Count(t => t.Status == VolunteerTaskStatus.Completed) ?? 0;

        return new VolunteerProfileDto(
            v.Id,
            v.UserId,
            v.FullName,
            v.Email,
            v.Phone,
            skills,
            v.AvailabilityStatus,
            v.ServiceArea,
            v.IsVerified,
            v.Latitude,
            v.Longitude,
            completed,
            v.CreatedAtUtc
        );
    }

    private static VolunteerTaskDto MapToTaskDto(VolunteerTask t, string volunteerName)
    {
        return new VolunteerTaskDto(
            t.Id,
            t.VolunteerProfileId,
            volunteerName,
            t.AssistanceRequestId,
            t.RequestTitle,
            t.Title,
            t.Description,
            t.Priority,
            t.Status,
            t.Deadline,
            t.AssignedAt,
            t.CompletedAt,
            t.Notes
        );
    }
}
