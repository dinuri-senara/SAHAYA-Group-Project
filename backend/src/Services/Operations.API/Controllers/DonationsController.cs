using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sahaya.Operations.API.DTOs;
using Sahaya.Operations.API.Services;

namespace Sahaya.Operations.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class DonationsController : BaseApiController
{
    private readonly IDonationService _donationService;

    public DonationsController(IDonationService donationService)
    {
        _donationService = donationService;
    }

    [HttpGet("campaigns")]
    public async Task<ActionResult<IReadOnlyList<DonationCampaignDto>>> GetCampaigns(CancellationToken ct)
    {
        var campaigns = await _donationService.GetAllCampaignsAsync(ct);
        return Ok(campaigns);
    }

    [HttpPost("campaigns")]
    public async Task<ActionResult<DonationCampaignDto>> CreateCampaign([FromBody] CreateCampaignDto dto, CancellationToken ct)
    {
        var created = await _donationService.CreateCampaignAsync(dto, ct);
        return Ok(created);
    }

    [HttpPost("monetary")]
    public async Task<ActionResult<DonationDto>> DonateMonetary([FromBody] CreateMonetaryDonationDto dto, CancellationToken ct)
    {
        var donation = await _donationService.RecordMonetaryDonationAsync(CurrentUserId, CurrentUserName, dto, ct);
        return Ok(donation);
    }

    [HttpPost("in-kind")]
    public async Task<ActionResult<DonationDto>> DonateInKind([FromBody] CreateInKindDonationDto dto, CancellationToken ct)
    {
        var donation = await _donationService.RecordInKindDonationAsync(CurrentUserId, CurrentUserName, dto, ct);
        return Ok(donation);
    }

    [HttpGet("my-donations")]
    public async Task<ActionResult<IReadOnlyList<DonationDto>>> GetMyDonations(CancellationToken ct)
    {
        var donations = await _donationService.GetDonationsByDonorAsync(CurrentUserId, ct);
        return Ok(donations);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<DonationDto>>> GetAllDonations(CancellationToken ct)
    {
        var all = await _donationService.GetAllDonationsAsync(ct);
        return Ok(all);
    }
}
