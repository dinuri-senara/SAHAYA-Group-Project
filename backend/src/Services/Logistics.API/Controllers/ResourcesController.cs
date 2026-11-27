using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sahaya.Common.Models;
using Sahaya.Logistics.API.Data;
using Sahaya.Logistics.API.DTOs;
using Sahaya.Logistics.API.Models;

namespace Sahaya.Logistics.API.Controllers
{
    [ApiController]
    [Route("api/v1/resources")]
    public class ResourcesController : ControllerBase
    {
        private readonly LogisticsDbContext _db;

        public ResourcesController(LogisticsDbContext db)
        {
            _db = db;
        }

        /// <summary>
        /// Retrieves real-time depot inventory stock levels, low-stock warnings, and category breakdowns
        /// </summary>
        [HttpGet("inventory")]
        public async Task<ActionResult<Result<List<ResourceResponseDto>>>> GetInventory(
            [FromQuery] ResourceCategory? category = null,
            [FromQuery] string? warehouse = null)
        {
            var query = _db.Resources.Where(r => !r.IsDeleted).AsQueryable();

            if (category.HasValue)
            {
                query = query.Where(r => r.Category == category.Value);
            }

            if (!string.IsNullOrWhiteSpace(warehouse))
            {
                query = query.Where(r => r.WarehouseLocation.ToLower().Contains(warehouse.ToLower()));
            }

            var items = await query.OrderBy(r => r.Category).ThenBy(r => r.Name).ToListAsync();
            var dtos = items.Select(MapToResourceDto).ToList();

            return Ok(Result<List<ResourceResponseDto>>.Success(dtos));
        }

        /// <summary>
        /// Retrieves operational inventory summary KPIs
        /// </summary>
        [HttpGet("inventory/summary")]
        public async Task<ActionResult<Result<object>>> GetInventorySummary()
        {
            var items = await _db.Resources.Where(r => !r.IsDeleted).ToListAsync();
            
            var totalItemsCount = items.Count;
            var lowStockCount = items.Count(r => r.AvailableQuantity <= r.LowStockThreshold && r.AvailableQuantity > 0);
            var depletedCount = items.Count(r => r.AvailableQuantity <= 0);
            var totalAllocationsCount = await _db.ResourceAllocations.CountAsync(a => !a.IsDeleted);

            var summary = new
            {
                TotalItemCategories = totalItemsCount,
                LowStockAlerts = lowStockCount,
                DepletedItems = depletedCount,
                TotalAllocationsExecuted = totalAllocationsCount,
                DepotsCovered = items.Select(r => r.WarehouseLocation).Distinct().Count(),
                GeneratedAtUtc = DateTime.UtcNow
            };

            return Ok(Result<object>.Success(summary));
        }

        /// <summary>
        /// Retrieves details of a specific resource inventory item
        /// </summary>
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Result<ResourceResponseDto>>> GetResourceById(Guid id)
        {
            var item = await _db.Resources.FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
            if (item == null)
            {
                return NotFound(Result<ResourceResponseDto>.Failure($"Resource item with ID '{id}' was not found."));
            }

            return Ok(Result<ResourceResponseDto>.Success(MapToResourceDto(item)));
        }

        /// <summary>
        /// Registers a new relief resource category or stock item into depot inventory
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<Result<ResourceResponseDto>>> CreateResource([FromBody] CreateResourceDto request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) || request.TotalQuantity < 0)
            {
                return BadRequest(Result<ResourceResponseDto>.Failure("Item Name and non-negative initial quantity are required."));
            }

            var item = new ResourceItem
            {
                Name = request.Name.Trim(),
                Category = request.Category,
                TotalQuantity = request.TotalQuantity,
                AvailableQuantity = request.TotalQuantity,
                AllocatedQuantity = 0,
                LowStockThreshold = request.LowStockThreshold > 0 ? request.LowStockThreshold : Math.Max(10, request.TotalQuantity * 0.15),
                Unit = string.IsNullOrWhiteSpace(request.Unit) ? "Units" : request.Unit.Trim(),
                WarehouseLocation = string.IsNullOrWhiteSpace(request.WarehouseLocation) ? "Central Logistics Depot - Colombo" : request.WarehouseLocation.Trim(),
                Status = request.TotalQuantity <= 0 ? ResourceStatus.Depleted : ResourceStatus.Available,
                LastReplenishedAtUtc = DateTime.UtcNow
            };

            _db.Resources.Add(item);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetResourceById), new { id = item.Id },
                Result<ResourceResponseDto>.Success(MapToResourceDto(item)));
        }

        /// <summary>
        /// Replenishes warehouse stock upon arrival of new relief shipments or donor contributions
        /// </summary>
        [HttpPost("{id:guid}/replenish")]
        public async Task<ActionResult<Result<ResourceResponseDto>>> ReplenishStock(Guid id, [FromBody] ReplenishStockDto request)
        {
            if (request.AdditionalQuantity <= 0)
            {
                return BadRequest(Result<ResourceResponseDto>.Failure("Replenishment quantity must be greater than zero."));
            }

            var item = await _db.Resources.FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
            if (item == null)
            {
                return NotFound(Result<ResourceResponseDto>.Failure($"Resource item with ID '{id}' was not found."));
            }

            item.TotalQuantity += request.AdditionalQuantity;
            item.AvailableQuantity += request.AdditionalQuantity;
            item.LastReplenishedAtUtc = DateTime.UtcNow;

            // Recalculate status
            if (item.AvailableQuantity > item.LowStockThreshold)
            {
                item.Status = ResourceStatus.Available;
            }
            else if (item.AvailableQuantity > 0)
            {
                item.Status = ResourceStatus.Low;
            }

            item.UpdatedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(Result<ResourceResponseDto>.Success(MapToResourceDto(item)));
        }

        /// <summary>
        /// Allocates relief stock with Concurrency Safety and Over-Allocation Prevention (Coursework Requirement)
        /// </summary>
        [HttpPost("allocate")]
        public async Task<ActionResult<Result<ResourceAllocation>>> AllocateStock([FromBody] CreateAllocationDto request)
        {
            if (request.QuantityAllocated <= 0)
            {
                return BadRequest(Result<ResourceAllocation>.Failure("Allocation quantity must be greater than zero."));
            }

            using var transaction = _db.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory"
                ? null
                : await _db.Database.BeginTransactionAsync();
            try
            {
                var resource = await _db.Resources.FirstOrDefaultAsync(r => r.Id == request.ResourceId && !r.IsDeleted);
                if (resource == null)
                {
                    return NotFound(Result<ResourceAllocation>.Failure("Resource inventory item was not found."));
                }

                // Over-Allocation Prevention Logic (Coursework Core Requirement)
                if (resource.AvailableQuantity < request.QuantityAllocated)
                {
                    return BadRequest(Result<ResourceAllocation>.Failure(
                        $"Insufficient inventory for '{resource.Name}'. Only {resource.AvailableQuantity} {resource.Unit} available in depot. Cannot allocate {request.QuantityAllocated} {resource.Unit}."));
                }

                // Concurrency-safe deduction
                resource.AvailableQuantity -= request.QuantityAllocated;
                resource.AllocatedQuantity += request.QuantityAllocated;

                // Update stock status
                if (resource.AvailableQuantity <= 0)
                {
                    resource.Status = ResourceStatus.Depleted;
                }
                else if (resource.AvailableQuantity <= resource.LowStockThreshold)
                {
                    resource.Status = ResourceStatus.Low;
                }
                resource.UpdatedAtUtc = DateTime.UtcNow;

                // Create Allocation record
                var allocation = new ResourceAllocation
                {
                    ResourceId = resource.Id,
                    ResourceName = resource.Name,
                    Category = resource.Category,
                    AssistanceRequestId = request.AssistanceRequestId,
                    ShelterId = request.ShelterId,
                    QuantityAllocated = request.QuantityAllocated,
                    Unit = resource.Unit,
                    DestinationLocation = string.IsNullOrWhiteSpace(request.DestinationLocation) ? "Disaster Relief Area" : request.DestinationLocation,
                    RecipientName = string.IsNullOrWhiteSpace(request.RecipientName) ? "Emergency Response Team" : request.RecipientName,
                    DispatchedAtUtc = DateTime.UtcNow,
                    Status = AllocationStatus.Dispatched,
                    TrackingNotes = string.IsNullOrWhiteSpace(request.TrackingNotes) ? "Standard logistics dispatch" : request.TrackingNotes
                };

                _db.ResourceAllocations.Add(allocation);
                await _db.SaveChangesAsync();
                if (transaction != null) await transaction.CommitAsync();

                return Ok(Result<ResourceAllocation>.Success(allocation));
            }
            catch (DbUpdateConcurrencyException)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return StatusCode(409, Result<ResourceAllocation>.Failure(
                    "Concurrent modification detected on resource inventory. Another coordinator may have allocated stock simultaneously. Please retry."));
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return StatusCode(500, Result<ResourceAllocation>.Failure($"Stock allocation failed: {ex.Message}"));
            }
        }

        /// <summary>
        /// Retrieves complete Dispatches &amp; Allocations log (Tab 3 in Frontend ResourcesPage)
        /// </summary>
        [HttpGet("allocations")]
        public async Task<ActionResult<Result<List<ResourceAllocation>>>> GetAllocations(
            [FromQuery] AllocationStatus? status = null,
            [FromQuery] Guid? shelterId = null)
        {
            var query = _db.ResourceAllocations.Where(a => !a.IsDeleted).AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(a => a.Status == status.Value);
            }

            if (shelterId.HasValue)
            {
                query = query.Where(a => a.ShelterId == shelterId.Value);
            }

            var allocations = await query.OrderByDescending(a => a.DispatchedAtUtc).ToListAsync();
            return Ok(Result<List<ResourceAllocation>>.Success(allocations));
        }

        /// <summary>
        /// Updates the status of an active dispatch (e.g. marking as Delivered upon reception)
        /// </summary>
        [HttpPatch("allocations/{id:guid}/status")]
        public async Task<ActionResult<Result<ResourceAllocation>>> UpdateAllocationStatus(
            Guid id, [FromBody] UpdateAllocationStatusDto request)
        {
            var allocation = await _db.ResourceAllocations.FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);
            if (allocation == null)
            {
                return NotFound(Result<ResourceAllocation>.Failure($"Allocation dispatch with ID '{id}' was not found."));
            }

            allocation.Status = request.Status;
            if (request.Status == AllocationStatus.Delivered)
            {
                allocation.DeliveredAtUtc = DateTime.UtcNow;
            }

            if (!string.IsNullOrWhiteSpace(request.DeliveryNotes))
            {
                allocation.TrackingNotes = $"{allocation.TrackingNotes} | Delivery Note: {request.DeliveryNotes}".Trim();
            }

            allocation.UpdatedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(Result<ResourceAllocation>.Success(allocation));
        }

        /// <summary>
        /// Retrieves all camp supply requisition requests
        /// </summary>
        [HttpGet("supply-requisitions")]
        public async Task<ActionResult<Result<List<ShelterSupplyRequisition>>>> GetSupplyRequisitions(
            [FromQuery] RequisitionStatus? status = null)
        {
            var query = _db.ShelterSupplyRequisitions.Where(r => !r.IsDeleted).AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(r => r.Status == status.Value);
            }

            var requisitions = await query.OrderByDescending(r => r.Urgency).ThenByDescending(r => r.RequestedAtUtc).ToListAsync();
            return Ok(Result<List<ShelterSupplyRequisition>>.Success(requisitions));
        }

        /// <summary>
        /// Submits a new relief supply requisition from a safe shelter
        /// </summary>
        [HttpPost("supply-requisitions")]
        public async Task<ActionResult<Result<ShelterSupplyRequisition>>> CreateSupplyRequisition(
            [FromBody] CreateRequisitionDto request)
        {
            if (string.IsNullOrWhiteSpace(request.ItemName) || request.QuantityRequested <= 0)
            {
                return BadRequest(Result<ShelterSupplyRequisition>.Failure("Item name and positive quantity requested are required."));
            }

            var requisition = new ShelterSupplyRequisition
            {
                ShelterId = request.ShelterId,
                ShelterName = request.ShelterName,
                Category = request.Category,
                ItemName = request.ItemName.Trim(),
                QuantityRequested = request.QuantityRequested,
                Unit = string.IsNullOrWhiteSpace(request.Unit) ? "Units" : request.Unit,
                Urgency = request.Urgency,
                Justification = request.Justification,
                SourceDepot = request.SourceDepot,
                Status = RequisitionStatus.Pending,
                RequestedBy = "Shelter Administrator",
                RequestedAtUtc = DateTime.UtcNow
            };

            _db.ShelterSupplyRequisitions.Add(requisition);
            await _db.SaveChangesAsync();

            return Ok(Result<ShelterSupplyRequisition>.Success(requisition));
        }

        /// <summary>
        /// Reviews and updates status of a camp supply requisition (Approve, Dispatch, Deliver)
        /// </summary>
        [HttpPatch("supply-requisitions/{id:guid}/review")]
        public async Task<ActionResult<Result<ShelterSupplyRequisition>>> ReviewSupplyRequisition(
            Guid id, [FromBody] UpdateRequisitionStatusDto request)
        {
            var requisition = await _db.ShelterSupplyRequisitions.FirstOrDefaultAsync(r => r.Id == id && !r.IsDeleted);
            if (requisition == null)
            {
                return NotFound(Result<ShelterSupplyRequisition>.Failure($"Requisition with ID '{id}' was not found."));
            }

            requisition.Status = request.Status;
            if (!string.IsNullOrWhiteSpace(request.ReviewNotes))
            {
                requisition.Justification = $"{requisition.Justification} [Review: {request.ReviewNotes}]";
            }

            requisition.UpdatedAtUtc = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(Result<ShelterSupplyRequisition>.Success(requisition));
        }

        // ==========================================
        // Private Helper Mapper
        // ==========================================
        private static ResourceResponseDto MapToResourceDto(ResourceItem r)
        {
            return new ResourceResponseDto
            {
                Id = r.Id,
                Name = r.Name,
                Category = r.Category,
                TotalQuantity = r.TotalQuantity,
                AvailableQuantity = r.AvailableQuantity,
                AllocatedQuantity = r.AllocatedQuantity,
                LowStockThreshold = r.LowStockThreshold,
                Unit = r.Unit,
                WarehouseLocation = r.WarehouseLocation,
                Status = r.Status,
                LastReplenishedAtUtc = r.LastReplenishedAtUtc
            };
        }
    }
}
