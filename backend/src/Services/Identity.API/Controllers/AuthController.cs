using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sahaya.Common.Enums;
using Sahaya.Common.Models;
using Sahaya.Identity.API.Data;
using Sahaya.Identity.API.DTOs;
using Sahaya.Identity.API.Models;
using Sahaya.Identity.API.Services;

namespace Sahaya.Identity.API.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IdentityDbContext _db;
        private readonly ITokenService _tokenService;

        public AuthController(IdentityDbContext db, ITokenService tokenService)
        {
            _db = db;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<Result<AuthResponse>>> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(Result<AuthResponse>.Failure("Invalid login payload."));

            var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == request.Email.ToLower() && !u.IsDeleted);

            // STRIDE Spoofing & Information Disclosure: Generic message prevents user enumeration
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
                return Unauthorized(Result<AuthResponse>.Failure("Invalid email or password."));

            // STRIDE Elevation of Privilege: Block unauthorized or unapproved staff accounts
            if (!user.IsActive)
                return StatusCode(StatusCodes.Status403Forbidden, Result<AuthResponse>.Failure("Account is pending administrator approval or has been suspended."));

            user.LastLoginAtUtc = DateTime.UtcNow;

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshTokenString = _tokenService.GenerateRefreshToken();

            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenString,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(7)
            };

            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            var response = new AuthResponse(
                user.Id,
                user.Email,
                user.FullName,
                user.Role.ToString(),
                accessToken,
                refreshTokenString,
                DateTime.UtcNow.AddHours(8)
            );

            return Ok(Result<AuthResponse>.Success(response));
        }

        [HttpPost("register")]
        public async Task<ActionResult<Result<AuthResponse>>> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(Result<AuthResponse>.Failure("Validation failed for registration input."));

            var existing = await _db.Users.AnyAsync(u => u.Email.ToLower() == request.Email.ToLower());
            if (existing)
                return Conflict(Result<AuthResponse>.Failure("A user with this email address already exists."));

            // STRIDE Elevation of Privilege (E) Mitigation:
            // Public users cannot register as Admin, Coordinator, or Operations Lead.
            // If an attacker attempts to inject an Admin or Coordinator role, forcefully downgrade to Citizen or mark inactive.
            UserRole assignedRole = request.Role;
            if (assignedRole == UserRole.Admin)
            {
                // Forceful defense: Admin accounts cannot be self-registered
                assignedRole = UserRole.Citizen;
            }

            // Only Citizen and Donor are auto-activated. Any other staff role requires Administrator approval.
            bool isAutoActive = assignedRole == UserRole.Citizen || assignedRole == UserRole.Donor;

            var user = new User
            {
                Email = request.Email.Trim().ToLower(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password, workFactor: 11),
                FullName = request.FullName.Trim(),
                PhoneNumber = request.PhoneNumber?.Trim() ?? string.Empty,
                Role = assignedRole,
                IsActive = isAutoActive,
                CreatedAtUtc = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var accessToken = _tokenService.GenerateAccessToken(user);
            var refreshTokenString = _tokenService.GenerateRefreshToken();

            var refreshToken = new RefreshToken
            {
                UserId = user.Id,
                Token = refreshTokenString,
                ExpiresAtUtc = DateTime.UtcNow.AddDays(7)
            };

            _db.RefreshTokens.Add(refreshToken);
            await _db.SaveChangesAsync();

            var response = new AuthResponse(
                user.Id,
                user.Email,
                user.FullName,
                user.Role.ToString(),
                accessToken,
                refreshTokenString,
                DateTime.UtcNow.AddHours(8)
            );

            return Created($"/api/v1/auth/me", Result<AuthResponse>.Success(response));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<Result<UserDto>>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (!Guid.TryParse(userIdClaim, out var userId))
                return Unauthorized(Result<UserDto>.Failure("Invalid authentication token claims."));

            var user = await _db.Users.FindAsync(userId);
            if (user == null || user.IsDeleted)
                return NotFound(Result<UserDto>.Failure("User profile not found."));

            var dto = new UserDto(
                user.Id,
                user.Email,
                user.FullName,
                user.PhoneNumber,
                user.Role.ToString(),
                user.IsActive,
                user.CreatedAtUtc
            );

            return Ok(Result<UserDto>.Success(dto));
        }
    }
}
