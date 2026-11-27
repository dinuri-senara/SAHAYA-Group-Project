using System;
using System.ComponentModel.DataAnnotations;
using Sahaya.Common.Enums;

namespace Sahaya.Identity.API.DTOs
{
    // STRIDE Tampering & Input Validation (Strict DataAnnotations)
    public record LoginRequest(
        [Required][EmailAddress][MaxLength(150)] string Email,
        [Required][MinLength(6)][MaxLength(100)] string Password
    );
    
    public record RegisterRequest(
        [Required][EmailAddress][MaxLength(150)] string Email,
        [Required][MinLength(6)][MaxLength(100)] string Password,
        [Required][MaxLength(120)] string FullName,
        [MaxLength(20)] string PhoneNumber,
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

    public record UpdateUserStatusRequest(
        [Required] bool IsActive, 
        [Required][MinLength(5)][MaxLength(300)] string Justification
    );
    
    public record UpdateUserRoleRequest(
        [Required] UserRole NewRole, 
        [Required][MinLength(5)][MaxLength(300)] string Justification
    );
}
