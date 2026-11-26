using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sahaya.Coordination.API.Data;
using Sahaya.Coordination.API.DTOs;
using Sahaya.Coordination.API.Models;

namespace Sahaya.Coordination.API.Controllers
{
    [ApiController]
    [Route("api/v1/incidents")]
    public class IncidentsController : ControllerBase
    {
        private readonly CoordinationDbContext _context;

        public IncidentsController(CoordinationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// GET /api/v1/incidents — Active national disaster events with severity levels
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<CrisisEventDto>>> GetActiveIncidents([FromQuery] string? status)
        {
            var query = _context.CrisisEvents.Include(e => e.OperationalAreas).AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(e => e.Status.ToLower() == status.ToLower());
            }

            var events = await query
                .OrderByDescending(e => e.StartedAtUtc)
                .Select(e => new CrisisEventDto(
                    e.Id,
                    e.Title,
                    e.Description,
                    e.DisasterType,
                    e.Severity,
                    e.Latitude,
                    e.Longitude,
                    e.RadiusKm,
                    e.AffectedCount,
                    e.Status,
                    e.StartedAtUtc,
                    e.OperationalAreas.Select(o => new OperationalAreaDto(
                        o.Id,
                        o.CrisisEventId,
                        o.Province,
                        o.District,
                        o.DSDivision,
                        o.CommanderName,
                        o.ContactPhone,
                        o.ResponseStatus,
                        o.SheltersOpen,
                        o.DepotStockStatus
                    )).ToList()
                ))
                .ToListAsync();

            return Ok(events);
        }

        /// <summary>
        /// GET /api/v1/incidents/{id} — Single crisis incident details
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<CrisisEventDto>> GetIncidentById(Guid id)
        {
            var e = await _context.CrisisEvents
                .Include(x => x.OperationalAreas)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (e == null)
                return NotFound(new { message = $"Crisis incident with ID '{id}' was not found." });

            var dto = new CrisisEventDto(
                e.Id,
                e.Title,
                e.Description,
                e.DisasterType,
                e.Severity,
                e.Latitude,
                e.Longitude,
                e.RadiusKm,
                e.AffectedCount,
                e.Status,
                e.StartedAtUtc,
                e.OperationalAreas.Select(o => new OperationalAreaDto(
                    o.Id,
                    o.CrisisEventId,
                    o.Province,
                    o.District,
                    o.DSDivision,
                    o.CommanderName,
                    o.ContactPhone,
                    o.ResponseStatus,
                    o.SheltersOpen,
                    o.DepotStockStatus
                )).ToList()
            );

            return Ok(dto);
        }

        /// <summary>
        /// POST /api/v1/incidents — Register new disaster zone with geographic boundary
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<CrisisEventDto>> CreateIncident([FromBody] CreateCrisisEventDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
                return BadRequest(new { message = "Incident title is required." });

            var crisisEvent = new CrisisEvent
            {
                Title = dto.Title,
                Description = dto.Description,
                DisasterType = dto.DisasterType,
                Severity = dto.Severity,
                Latitude = dto.Latitude,
                Longitude = dto.Longitude,
                RadiusKm = dto.RadiusKm > 0 ? dto.RadiusKm : 15.0,
                AffectedCount = dto.AffectedCount,
                Status = "Active",
                StartedAtUtc = DateTime.UtcNow
            };

            _context.CrisisEvents.Add(crisisEvent);
            await _context.SaveChangesAsync();

            var responseDto = new CrisisEventDto(
                crisisEvent.Id,
                crisisEvent.Title,
                crisisEvent.Description,
                crisisEvent.DisasterType,
                crisisEvent.Severity,
                crisisEvent.Latitude,
                crisisEvent.Longitude,
                crisisEvent.RadiusKm,
                crisisEvent.AffectedCount,
                crisisEvent.Status,
                crisisEvent.StartedAtUtc,
                new List<OperationalAreaDto>()
            );

            return CreatedAtAction(nameof(GetIncidentById), new { id = crisisEvent.Id }, responseDto);
        }

        /// <summary>
        /// POST /api/v1/incidents/{id}/operational-areas — Add operational response area to incident
        /// </summary>
        [HttpPost("{id:guid}/operational-areas")]
        public async Task<ActionResult<OperationalAreaDto>> AddOperationalArea(Guid id, [FromBody] CreateOperationalAreaDto dto)
        {
            var crisisEvent = await _context.CrisisEvents.FindAsync(id);
            if (crisisEvent == null)
                return NotFound(new { message = $"Crisis incident '{id}' not found." });

            var area = new OperationalArea
            {
                CrisisEventId = id,
                Province = dto.Province,
                District = dto.District,
                DSDivision = dto.DSDivision,
                CommanderName = dto.CommanderName,
                ContactPhone = dto.ContactPhone,
                ResponseStatus = "Active Deployment",
                SheltersOpen = dto.SheltersOpen,
                DepotStockStatus = dto.DepotStockStatus
            };

            _context.OperationalAreas.Add(area);
            await _context.SaveChangesAsync();

            return Ok(new OperationalAreaDto(
                area.Id,
                area.CrisisEventId,
                area.Province,
                area.District,
                area.DSDivision,
                area.CommanderName,
                area.ContactPhone,
                area.ResponseStatus,
                area.SheltersOpen,
                area.DepotStockStatus
            ));
        }

        /// <summary>
        /// PUT /api/v1/incidents/{id}/status — Update incident status (Active, Contained, Resolved)
        /// </summary>
        [HttpPut("{id:guid}/status")]
        public async Task<IActionResult> UpdateIncidentStatus(Guid id, [FromBody] string newStatus)
        {
            var incident = await _context.CrisisEvents.FindAsync(id);
            if (incident == null)
                return NotFound(new { message = $"Incident '{id}' not found." });

            incident.Status = newStatus;
            incident.UpdatedAtUtc = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Incident status updated to '{newStatus}'.", id, status = newStatus });
        }
    }
}
