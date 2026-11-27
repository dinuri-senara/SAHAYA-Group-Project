using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sahaya.Operations.API.Data;
using Sahaya.Operations.API.Enums;

namespace Sahaya.Operations.API.Controllers;

[ApiController]
[Route("api/v1/operations/gis")]
public class GISController : BaseApiController
{
    private readonly OperationsDbContext _context;

    public GISController(OperationsDbContext context)
    {
        _context = context;
    }

    [HttpGet("volunteers-layer")]
    public async Task<IActionResult> GetVolunteersGISLayer(CancellationToken ct)
    {
        var volunteers = await _context.VolunteerProfiles
            .Where(v => v.Latitude.HasValue && v.Longitude.HasValue)
            .Select(v => new
            {
                v.Id,
                v.FullName,
                v.Phone,
                v.ServiceArea,
                v.AvailabilityStatus,
                Status = v.AvailabilityStatus.ToString(),
                Latitude = v.Latitude!.Value,
                Longitude = v.Longitude!.Value,
                ActiveTasksCount = v.Tasks.Count(t => t.Status == VolunteerTaskStatus.InProgress || t.Status == VolunteerTaskStatus.Accepted)
            })
            .ToListAsync(ct);

        return Ok(volunteers);
    }
}
