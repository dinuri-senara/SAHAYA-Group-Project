using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahaya.Assistance.API.DTOs;
using Sahaya.Assistance.API.Services;
using Sahaya.Assistance.API.Services.Validators;

namespace Sahaya.Assistance.API.Controllers
{
    [ApiController]
    [Route("api/v1")]
    public class AssistanceController : ControllerBase
    {
        private readonly IAssistanceService _assistanceService;

        public AssistanceController(IAssistanceService assistanceService)
        {
            _assistanceService = assistanceService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("sub")?.Value 
                ?? "u-citizen-demo";
        }

        private string GetCurrentUserName()
        {
            return User.FindFirst(ClaimTypes.Name)?.Value 
                ?? User.FindFirst("name")?.Value 
                ?? "Chaminda Silva";
        }

        private string GetCurrentUserPhone()
        {
            return User.FindFirst(ClaimTypes.MobilePhone)?.Value 
                ?? User.FindFirst("phone")?.Value 
                ?? "+94 77 123 4567";
        }

        /// <summary>
        /// Submit a verified emergency assistance request with GPS coordinates
        /// </summary>
        [HttpPost("requests")]
        public async Task<IActionResult> CreateRequest([FromBody] CreateAssistanceRequestDto dto)
        {
            var validator = new CreateAssistanceRequestValidator();
            var validation = await validator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                return BadRequest(new { errors = validation.Errors.Select(e => e.ErrorMessage) });
            }

            var citizenId = GetCurrentUserId();
            var citizenName = GetCurrentUserName();
            var citizenPhone = GetCurrentUserPhone();

            var result = await _assistanceService.CreateRequestAsync(citizenId, citizenName, citizenPhone, dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return Ok(result.Data);
        }

        /// <summary>
        /// Public guest SOS creation returning tracking code
        /// </summary>
        [HttpPost("emergency/guest-request")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateGuestEmergencyRequest([FromBody] GuestEmergencyRequestDto dto)
        {
            var validator = new GuestEmergencyRequestValidator();
            var validation = await validator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                return BadRequest(new { errors = validation.Errors.Select(e => e.ErrorMessage) });
            }

            var result = await _assistanceService.CreateGuestEmergencyRequestAsync(dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return Ok(result.Data);
        }

        /// <summary>
        /// Real-time request milestone tracking for guests using reference code
        /// </summary>
        [HttpGet("requests/track/{code}")]
        [AllowAnonymous]
        public async Task<IActionResult> TrackRequest(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                return BadRequest(new { message = "Reference tracking code cannot be empty." });
            }

            var result = await _assistanceService.TrackRequestByCodeAsync(code);
            if (!result.IsSuccess)
            {
                return NotFound(new { message = result.ErrorMessage });
            }

            return Ok(result.Data);
        }

        /// <summary>
        /// Historical distress calls for logged-in citizen
        /// </summary>
        [HttpGet("citizen/requests")]
        public async Task<IActionResult> GetCitizenRequests()
        {
            var citizenId = GetCurrentUserId();
            var result = await _assistanceService.GetCitizenRequestsAsync(citizenId);
            return Ok(result.Data);
        }

        /// <summary>
        /// Get details of an assistance request by ID
        /// </summary>
        [HttpGet("requests/{id:guid}")]
        public async Task<IActionResult> GetRequestById(Guid id)
        {
            var result = await _assistanceService.GetRequestByIdAsync(id);
            if (!result.IsSuccess)
            {
                return NotFound(new { message = result.ErrorMessage });
            }

            return Ok(result.Data);
        }

        /// <summary>
        /// Post-delivery citizen satisfaction rating and feedback
        /// </summary>
        [HttpPost("requests/{id:guid}/feedback")]
        public async Task<IActionResult> SubmitFeedback(Guid id, [FromBody] SubmitFeedbackDto dto)
        {
            var result = await _assistanceService.SubmitFeedbackAsync(id, dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return Ok(new { message = "Feedback recorded successfully." });
        }
    }
}
