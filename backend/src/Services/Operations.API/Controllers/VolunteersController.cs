using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahaya.Operations.API.DTOs;
using Sahaya.Operations.API.Services;

namespace Sahaya.Operations.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class VolunteersController : BaseApiController
{
    private readonly IVolunteerService _volunteerService;

    public VolunteersController(IVolunteerService volunteerService)
    {
        _volunteerService = volunteerService;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<VolunteerProfileDto>>> GetAll(CancellationToken ct)
    {
        var list = await _volunteerService.GetAllVolunteersAsync(ct);
        return Ok(list);
    }

    [HttpGet("profile")]
    public async Task<ActionResult<VolunteerProfileDto>> GetMyProfile(CancellationToken ct)
    {
        var profile = await _volunteerService.GetProfileByUserIdAsync(CurrentUserId, ct);
        if (profile == null) return NotFound(new { message = "Volunteer profile not found for this user account." });
        return Ok(profile);
    }

    [HttpPost("profile")]
    public async Task<ActionResult<VolunteerProfileDto>> RegisterOrUpdateProfile([FromBody] CreateVolunteerProfileDto dto, CancellationToken ct)
    {
        var profile = await _volunteerService.RegisterOrUpdateProfileAsync(CurrentUserId, CurrentUserName, CurrentUserEmail, dto, ct);
        return Ok(profile);
    }

    [HttpPost("tasks")]
    public async Task<ActionResult<VolunteerTaskDto>> AssignTask([FromBody] CreateVolunteerTaskDto dto, CancellationToken ct)
    {
        var task = await _volunteerService.AssignTaskAsync(dto, CurrentUserId, ct);
        return Ok(task);
    }

    [HttpGet("my-tasks")]
    public async Task<ActionResult<IReadOnlyList<VolunteerTaskDto>>> GetMyTasks(CancellationToken ct)
    {
        var tasks = await _volunteerService.GetTasksForVolunteerAsync(CurrentUserId, ct);
        return Ok(tasks);
    }

    [HttpGet("available-tasks")]
    public async Task<ActionResult<IReadOnlyList<VolunteerTaskDto>>> GetAvailableTasks(CancellationToken ct)
    {
        var tasks = await _volunteerService.GetAvailableTasksAsync(ct);
        return Ok(tasks);
    }

    [HttpPost("tasks/{id:guid}/accept")]
    public async Task<ActionResult<VolunteerTaskDto>> AcceptTask(Guid id, CancellationToken ct)
    {
        var task = await _volunteerService.AcceptTaskAsync(id, CurrentUserId, ct);
        return Ok(task);
    }

    [HttpPost("tasks/{id:guid}/status")]
    public async Task<ActionResult<VolunteerTaskDto>> UpdateTaskStatus(Guid id, [FromBody] UpdateVolunteerTaskStatusDto dto, CancellationToken ct)
    {
        var task = await _volunteerService.UpdateTaskStatusAsync(id, CurrentUserId, dto, ct);
        return Ok(task);
    }

    [HttpPost("check-in")]
    public async Task<IActionResult> RecordCheckIn([FromBody] VolunteerCheckInDto dto, CancellationToken ct)
    {
        await _volunteerService.RecordCheckInAsync(CurrentUserId, dto, ct);
        return Ok(new { message = "Field coordinates and check-in recorded successfully.", timestamp = DateTime.UtcNow });
    }
}
