using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Sahaya.Assistance.API.DTOs;
using Sahaya.Assistance.API.Services;
using Sahaya.Assistance.API.Services.Validators;

namespace Sahaya.Assistance.API.Controllers
{
    [ApiController]
    [Route("api/v1/citizen/household-profile")]
    public class HouseholdController : ControllerBase
    {
        private readonly IHouseholdService _householdService;

        public HouseholdController(IHouseholdService householdService)
        {
            _householdService = householdService;
        }

        private string GetCurrentUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("sub")?.Value 
                ?? "u-citizen-demo";
        }

        /// <summary>
        /// Retrieve vulnerable household members and medical needs for logged-in citizen
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            var citizenId = GetCurrentUserId();
            var result = await _householdService.GetHouseholdProfileAsync(citizenId);
            return Ok(result.Data);
        }

        /// <summary>
        /// Manage and update vulnerable household members and medical needs
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> SaveProfile([FromBody] HouseholdProfileDto dto)
        {
            var validator = new HouseholdProfileValidator();
            var validation = await validator.ValidateAsync(dto);
            if (!validation.IsValid)
            {
                return BadRequest(new { errors = validation.Errors.Select(e => e.ErrorMessage) });
            }

            var citizenId = GetCurrentUserId();
            var result = await _householdService.SaveHouseholdProfileAsync(citizenId, dto);
            if (!result.IsSuccess)
            {
                return BadRequest(new { message = result.ErrorMessage });
            }

            return Ok(result.Data);
        }
    }
}
