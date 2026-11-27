using Microsoft.EntityFrameworkCore;
using Sahaya.Operations.API.Data;
using Sahaya.Operations.API.DTOs;
using Sahaya.Operations.API.Entities;
using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.Services;

public class DonationService : IDonationService
{
    private readonly OperationsDbContext _context;

    public DonationService(OperationsDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<DonationCampaignDto>> GetAllCampaignsAsync(CancellationToken cancellationToken = default)
    {
        var campaigns = await _context.DonationCampaigns
            .Include(c => c.Donations)
            .OrderByDescending(c => c.IsActive)
            .ThenByDescending(c => c.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return campaigns.Select(MapCampaignToDto).ToList();
    }

    public async Task<DonationCampaignDto> CreateCampaignAsync(CreateCampaignDto dto, CancellationToken cancellationToken = default)
    {
        var campaign = new DonationCampaign
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            TargetAmount = dto.TargetAmount,
            RaisedAmount = 0,
            EndDate = dto.EndDate,
            IsActive = true
        };

        _context.DonationCampaigns.Add(campaign);
        await _context.SaveChangesAsync(cancellationToken);

        return MapCampaignToDto(campaign);
    }

    public async Task<DonationDto> RecordMonetaryDonationAsync(Guid donorUserId, string donorName, CreateMonetaryDonationDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.Amount <= 0)
            throw new ArgumentException("Donation amount must be greater than zero.", nameof(dto.Amount));

        var donation = new Donation
        {
            DonorUserId = donorUserId,
            DonorName = !string.IsNullOrWhiteSpace(donorName) ? donorName : "Anonymous Donor",
            CampaignId = dto.CampaignId,
            DonationType = DonationType.Monetary,
            Amount = dto.Amount,
            Currency = string.IsNullOrWhiteSpace(dto.Currency) ? "LKR" : dto.Currency.ToUpperInvariant(),
            PaymentReference = dto.PaymentReference ?? $"TXN-{Guid.NewGuid().ToString("N")[..8].ToUpper()}",
            Status = DonationStatus.Completed,
            Notes = dto.Notes
        };

        _context.Donations.Add(donation);

        if (dto.CampaignId.HasValue)
        {
            var campaign = await _context.DonationCampaigns.FindAsync(new object[] { dto.CampaignId.Value }, cancellationToken);
            if (campaign != null)
            {
                campaign.RaisedAmount += dto.Amount;
                campaign.UpdatedAtUtc = DateTime.UtcNow;
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        string? campaignTitle = null;
        if (dto.CampaignId.HasValue)
        {
            var c = await _context.DonationCampaigns.FindAsync(new object[] { dto.CampaignId.Value }, cancellationToken);
            campaignTitle = c?.Title;
        }

        return MapDonationToDto(donation, campaignTitle);
    }

    public async Task<DonationDto> RecordInKindDonationAsync(Guid donorUserId, string donorName, CreateInKindDonationDto dto, CancellationToken cancellationToken = default)
    {
        if (dto.ItemQuantity <= 0)
            throw new ArgumentException("Item quantity must be greater than zero.", nameof(dto.ItemQuantity));

        var donation = new Donation
        {
            DonorUserId = donorUserId,
            DonorName = !string.IsNullOrWhiteSpace(donorName) ? donorName : "Anonymous Donor",
            CampaignId = dto.CampaignId,
            DonationType = DonationType.InKind,
            ItemName = dto.ItemName.Trim(),
            ItemCategory = dto.ItemCategory.Trim(),
            ItemQuantity = dto.ItemQuantity,
            ItemUnit = dto.ItemUnit.Trim(),
            EstimatedValue = dto.EstimatedValue,
            Status = DonationStatus.Completed,
            Notes = dto.Notes
        };

        _context.Donations.Add(donation);
        await _context.SaveChangesAsync(cancellationToken);

        string? campaignTitle = null;
        if (dto.CampaignId.HasValue)
        {
            var c = await _context.DonationCampaigns.FindAsync(new object[] { dto.CampaignId.Value }, cancellationToken);
            campaignTitle = c?.Title;
        }

        return MapDonationToDto(donation, campaignTitle);
    }

    public async Task<IReadOnlyList<DonationDto>> GetDonationsByDonorAsync(Guid donorUserId, CancellationToken cancellationToken = default)
    {
        var list = await _context.Donations
            .Include(d => d.Campaign)
            .Where(d => d.DonorUserId == donorUserId)
            .OrderByDescending(d => d.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return list.Select(d => MapDonationToDto(d, d.Campaign?.Title)).ToList();
    }

    public async Task<IReadOnlyList<DonationDto>> GetAllDonationsAsync(CancellationToken cancellationToken = default)
    {
        var list = await _context.Donations
            .Include(d => d.Campaign)
            .OrderByDescending(d => d.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return list.Select(d => MapDonationToDto(d, d.Campaign?.Title)).ToList();
    }

    private static DonationCampaignDto MapCampaignToDto(DonationCampaign c)
    {
        var progress = c.TargetAmount > 0
            ? Math.Min(100.0, Math.Round((double)(c.RaisedAmount / c.TargetAmount) * 100, 1))
            : 0;

        return new DonationCampaignDto(
            c.Id,
            c.Title,
            c.Description,
            c.TargetAmount,
            c.RaisedAmount,
            progress,
            c.StartDate,
            c.EndDate,
            c.IsActive,
            c.Donations?.Count ?? 0,
            c.CreatedAtUtc
        );
    }

    private static DonationDto MapDonationToDto(Donation d, string? campaignTitle)
    {
        return new DonationDto(
            d.Id,
            d.DonorUserId,
            d.DonorName,
            d.CampaignId,
            campaignTitle,
            d.DonationType,
            d.Amount,
            d.Currency,
            d.PaymentReference,
            d.ItemName,
            d.ItemCategory,
            d.ItemQuantity,
            d.ItemUnit,
            d.EstimatedValue,
            d.Status,
            d.Notes,
            d.CreatedAtUtc
        );
    }
}
