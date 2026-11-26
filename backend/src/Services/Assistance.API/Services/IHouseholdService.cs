using System.Threading.Tasks;
using Sahaya.Assistance.API.DTOs;
using Sahaya.Common.Models;

namespace Sahaya.Assistance.API.Services
{
    public interface IHouseholdService
    {
        Task<Result<HouseholdProfileDto>> GetHouseholdProfileAsync(string citizenId);
        Task<Result<HouseholdProfileDto>> SaveHouseholdProfileAsync(string citizenId, HouseholdProfileDto dto);
    }
}
