using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Sahaya.Assistance.API.DTOs;
using Sahaya.Common.Models;

namespace Sahaya.Assistance.API.Services
{
    public interface IAssistanceService
    {
        Task<Result<AssistanceRequestResponseDto>> CreateRequestAsync(string citizenId, string citizenName, string citizenPhone, CreateAssistanceRequestDto dto);
        Task<Result<RequestTrackingDto>> CreateGuestEmergencyRequestAsync(GuestEmergencyRequestDto dto);
        Task<Result<RequestTrackingDto>> TrackRequestByCodeAsync(string referenceCode);
        Task<Result<List<AssistanceRequestResponseDto>>> GetAllRequestsAsync(string? category = null, string? status = null);
        Task<Result<List<AssistanceRequestResponseDto>>> GetCitizenRequestsAsync(string citizenId);
        Task<Result<AssistanceRequestResponseDto>> GetRequestByIdAsync(Guid id);
        Task<Result> SubmitFeedbackAsync(Guid id, SubmitFeedbackDto dto);
    }
}

