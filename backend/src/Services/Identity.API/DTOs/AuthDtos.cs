using System;
using Sahaya.Common.Enums;

namespace Sahaya.Identity.API.DTOs
{
    public record LoginRequest(string Email, string Password);
    
    public record RegisterRequest(
        string Email,
        string Password,
        string FullName,
        string PhoneNumber,
        UserRole Role
    );

    public record AuthResponse(
        Guid UserId,
        string Email,
        string FullName,
        string Role,
        string Token,
        string RefreshToken,
        DateTime ExpiresAtUtc
    );

    public record UserDto(
        Guid Id,
        string Email,
        string FullName,
        string PhoneNumber,
        string Role,
        bool IsActive,
        DateTime CreatedAtUtc
    );

    public record UpdateUserStatusRequest(bool IsActive, string? Justification);
    public record UpdateUserRoleRequest(UserRole NewRole, string Justification);
}
