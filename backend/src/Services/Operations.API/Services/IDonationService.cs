using Sahaya.Operations.API.DTOs;

namespace Sahaya.Operations.API.Services;

public interface IDonationService
{
    Task<IReadOnlyList<DonationCampaignDto>> GetAllCampaignsAsync(CancellationToken cancellationToken = default);
    Task<DonationCampaignDto> CreateCampaignAsync(CreateCampaignDto dto, CancellationToken cancellationToken = default);
    Task<DonationDto> RecordMonetaryDonationAsync(Guid donorUserId, string donorName, CreateMonetaryDonationDto dto, CancellationToken cancellationToken = default);
    Task<DonationDto> RecordInKindDonationAsync(Guid donorUserId, string donorName, CreateInKindDonationDto dto, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<DonationDto>> GetDonationsByDonorAsync(Guid donorUserId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<DonationDto>> GetAllDonationsAsync(CancellationToken cancellationToken = default);
}
