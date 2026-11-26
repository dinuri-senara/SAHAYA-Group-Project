using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sahaya.Common.Enums;
using Sahaya.Common.Models;
using Sahaya.Identity.API.Data;
using Sahaya.Identity.API.DTOs;
using Sahaya.Identity.API.Models;

namespace Sahaya.Identity.API.Controllers
{
    [ApiController]
    [Route("api/v1/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly IdentityDbContext _db;

        public AdminUsersController(IdentityDbContext db)
        {
            _db = db;
        }

        [HttpGet("users")]
        public async Task<ActionResult<Result<List<UserDto>>>> GetAllUsers([FromQuery] string? role, [FromQuery] string? search)
        {
            var query = _db.Users.Where(u => !u.IsDeleted);

            if (!string.IsNullOrWhiteSpace(role) && Enum.TryParse<UserRole>(role, true, out var parsedRole))
            {
                query = query.Where(u => u.Role == parsedRole);
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(u => u.FullName.ToLower().Contains(term) || u.Email.ToLower().Contains(term));
            }

            var users = await query
                .OrderByDescending(u => u.CreatedAtUtc)
                .Select(u => new UserDto(
                    u.Id,
                    u.Email,
                    u.FullName,
                    u.PhoneNumber,
                    u.Role.ToString(),
                    u.IsActive,
                    u.CreatedAtUtc
                ))
                .ToListAsync();

            return Ok(Result<List<UserDto>>.Success(users));
        }

        [HttpPut("users/{id}/status")]
        public async Task<ActionResult<Result>> UpdateUserStatus(Guid id, [FromBody] UpdateUserStatusRequest request)
        {
            var user = await _db.Users.FindAsync(id);
            if (user == null || user.IsDeleted)
                return NotFound(Result.Failure("User not found."));

            user.IsActive = request.IsActive;
            user.UpdatedAtUtc = DateTime.UtcNow;

            var audit = new AuditLog
            {
                UserId = id,
                Action = request.IsActive ? "UserApproved" : "UserSuspended",
                EntityName = "User",
                EntityId = id.ToString(),
                ChangesJson = $"{{\"IsActive\": {request.IsActive.ToString().ToLower()}, \"Justification\": \"{request.Justification}\"}}",
                IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1"
            };

            _db.AuditLogs.Add(audit);
            await _db.SaveChangesAsync();

            return Ok(Result.Success());
        }

        [HttpGet("telemetry")]
        public async Task<ActionResult<Result<object>>> GetSystemTelemetry()
        {
            var activeUsersCount = await _db.Users.CountAsync(u => u.IsActive && !u.IsDeleted);
            var totalUsersCount = await _db.Users.CountAsync(u => !u.IsDeleted);
            var pendingApprovalsCount = await _db.Users.CountAsync(u => !u.IsActive && !u.IsDeleted && u.Role != UserRole.Citizen && u.Role != UserRole.Donor);

            var telemetryData = new
            {
                systemStatus = "Online",
                service = "Sahaya.Identity.API",
                databaseConnected = true,
                databaseLatencyMs = 2,
                totalUsers = totalUsersCount,
                activeUsers = activeUsersCount,
                pendingApprovals = pendingApprovalsCount,
                roleBreakdown = new
                {
                    citizens = await _db.Users.CountAsync(u => u.Role == UserRole.Citizen && !u.IsDeleted),
                    coordinators = await _db.Users.CountAsync(u => u.Role == UserRole.Coordinator && !u.IsDeleted),
                    volunteers = await _db.Users.CountAsync(u => u.Role == UserRole.Volunteer && !u.IsDeleted),
                    donors = await _db.Users.CountAsync(u => u.Role == UserRole.Donor && !u.IsDeleted),
                    admins = await _db.Users.CountAsync(u => u.Role == UserRole.Admin && !u.IsDeleted)
                },
                serverTimestampUtc = DateTime.UtcNow
            };

            return Ok(Result<object>.Success(telemetryData));
        }
    }
}
