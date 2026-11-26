# SAHAYA Humanitarian Aid Platform
## Backend Architecture & Team Work Division (6 Members)
> **Module:** SE205.3 Software Architecture — Coursework 2026 | NSBM Green University Town  
> **Technology Baseline:** C# ASP.NET Core Web API (.NET 8) + Microsoft SQL Server + Clean Microservices Architecture  

---

## 1. Executive Overview & Zero-Conflict Monorepo Strategy

This master specification establishes an enterprise-grade backend architecture for the **SAHAYA Humanitarian Crisis Management and Aid Coordination Platform**. To prevent Git merge conflicts between all 6 team members while developing real relational databases and RESTful APIs, the solution employs a **Structured Monorepo Architecture** with clean vertical-slice domain boundaries. Each member owns an isolated microservice project, independent SQL Server database schema, and designated controllers.

### Solution Directory Structure
```text
SAHAYA-Group-Project/
├── frontend/                        <-- React 19 + TypeScript + Tailwind CSS v4 (Current sahaya-app)
├── backend/                         <-- C# ASP.NET Core .NET 8 Visual Studio Solution (Sahaya.sln)
│   ├── src/
│   │   ├── Sahaya.Gateway/          <-- YARP API Gateway & SSL Termination (Member 1)
│   │   ├── Sahaya.Common/           <-- Shared DTOs, Result Pattern & Base Entities
│   │   ├── Services/
│   │   │   ├── Identity.API/        <-- Member 1 (Lead): Authentication & User Governance
│   │   │   ├── Assistance.API/      <-- Member 2: Citizen SOS & Household Profiles
│   │   │   ├── Coordination.API/    <-- Member 3: Triage Pipeline & Crisis Incidents
│   │   │   ├── Logistics.API/       <-- Member 4: Depot Inventory & Safe Shelters
│   │   │   ├── AIIntelligence.API/  <-- Member 5: AI Decision Engine & Override Audits
│   │   │   └── Operations.API/      <-- Member 6: Volunteers, Leaflet GIS & Donations
└── docs/                            <-- project.md, Architecture & Threat Diagrams
```

---

## 2. Team Work Allocation Matrix (Members 1 - 6)

| Member & Lead Role | Microservice Domain | Database Tables | Target Frontend Routes |
|:---|:---|:---|:---|
| **Member 1 (You - Lead)** | Identity.API + Sahaya.Gateway | Users, Roles, UserRoleAssignments, RefreshTokens, AuditLogs, SystemTelemetry | `/dashboard`, `/admin/dashboard`, `/admin/users`, `/login` |
| **Member 2** | Assistance.API | AssistanceRequests, HouseholdProfiles, VulnerableMembers, RequestStatusHistories | `/citizen/*`, `/request/new`, `/emergency/request`, `/emergency/track` |
| **Member 3** | Coordination.API | CrisisEvents, OperationalAreas, TriageRecords, EscalationLogs, CoordinatorNotes | `/coordinator/dashboard`, `/coordinator/incidents`, `/requests/:id` |
| **Member 4** | Logistics.API | Shelters, ShelterOccupancies, StockDepots, Resources, ResourceAllocations, Transfers | `/shelters`, `/resources` |
| **Member 5** | AIIntelligence.API | AIRecommendations, UrgencyScorings, HumanOverrideAudits, DuplicateMatches | `/coordinator/ai-review`, `AIChatDrawer` |
| **Member 6** | Operations.API | VolunteerProfiles, VolunteerTasks, Donations, DonationCampaigns, PartnerRequisitions, GIS | `/map`, `/volunteers`, `/donations`, `/donor/dashboard` |

---

## 3. Detailed Implementation Specifications & Prompt Templates

### Member 1 (Lead Architect / You): Foundation, Identity API & Gateway
- **Scope & Responsibilities:** National command governance, JWT authentication, RBAC authorization handlers, system telemetry, and YARP API Gateway.
- **Relational Database Entities:**
  - `Users` (Id, Email, PasswordHash, FullName, PhoneNumber, RoleId, IsActive, CreatedAtUtc)
  - `Roles` (Id, RoleName, Description)
  - `RefreshTokens` (Id, UserId, Token, ExpiresAtUtc, RevokedAtUtc)
  - `AuditLogs` (Id, UserId, Action, EntityName, EntityId, ChangesJson, TimestampUtc)
  - `SystemTelemetry` (Id, ServiceName, Status, CpuUsagePct, MemoryUsageMb, LatencyMs, RecordedAtUtc)
- **RESTful Endpoints:**
  - `POST /api/v1/auth/login` — Validates credentials, issues JWT token and refresh token
  - `POST /api/v1/auth/register` — Registers new citizen or public donor accounts
  - `GET /api/v1/auth/me` — Retrieves authenticated user identity and role claims
  - `GET /api/v1/admin/users` — Paginated user directory with role filtering
  - `PUT /api/v1/admin/users/{id}/status` — Activates, approves or suspends user accounts
  - `GET /api/v1/admin/telemetry` — Aggregated microservices telemetry and database health
- **Antigravity Prompt Template (Ready to Copy-Paste):**
```text
Role: Member 1 (Lead Architect)
Task: Implement the Sahaya.Identity.API and Sahaya.Gateway in C# ASP.NET Core .NET 8.
Steps:
1. Create Solution 'Sahaya.sln' with Clean Architecture (Domain, Application, Infrastructure, API).
2. Create EF Core DbContext for Users, Roles, RefreshTokens, AuditLogs, and SystemTelemetry using SQL Server.
3. Configure JWT Bearer token generation with asymmetric/symmetric signing and BCrypt password hashing.
4. Build IdentityController and AdminTelemetryController with full CRUD endpoints and model validation.
5. Setup YARP API Gateway reverse-proxying /api/v1/... routes to respective microservice ports with CORS and Rate Limiting.
```

---

### Member 2: Citizen Assistance & Household SOS API
- **Scope & Responsibilities:** Citizen registration, emergency SOS request wizard, vulnerable household profiles, public guest distress calls, and tracking.
- **Relational Database Entities:**
  - `AssistanceRequests` (Id, ReferenceCode, CitizenId, Title, Description, CategoryId, UrgencyId, AffectedCount, Address, Latitude, Longitude, Status, CreatedAtUtc)
  - `HouseholdProfiles` (Id, CitizenId, ResidenceType, Address, District, Province, EmergencyContactName, EmergencyContactPhone)
  - `VulnerableMembers` (Id, HouseholdProfileId, Category, Name, Age, MedicalDetails, RequiresSpecialMobility)
  - `RequestStatusHistories` (Id, RequestId, Status, Title, Notes, UpdatedByUserId, TimestampUtc)
- **RESTful Endpoints:**
  - `POST /api/v1/requests` — Submit verified emergency assistance request with GPS coordinates
  - `POST /api/v1/emergency/guest-request` — Public guest SOS creation returning tracking code
  - `GET /api/v1/requests/track/{code}` — Real-time request milestone tracking for guests
  - `GET /api/v1/citizen/requests` — Historical distress calls for logged-in citizen
  - `POST /api/v1/citizen/household-profile` — Manage vulnerable household members and medical needs
  - `POST /api/v1/requests/{id}/feedback` — Post-delivery citizen satisfaction rating
- **Antigravity Prompt Template (Ready to Copy-Paste):**
```text
Role: Member 2 (Citizen & Household Domain Developer)
Task: Implement the Sahaya.Assistance.API microservice in C# ASP.NET Core .NET 8.
Steps:
1. Create Assistance.API project with EF Core SQL Server DbContext.
2. Define AssistanceRequests, HouseholdProfiles, VulnerableMembers, and RequestStatusHistories entities.
3. Build AssistanceController and HouseholdController with complete validation (FluentValidation).
4. Implement automatic reference code generator (e.g. EMG-74892) and GPS coordinate boundary checks for Sri Lanka.
5. Document endpoints in Swagger and seed initial citizen distress records.
```

---

### Member 3: Crisis Coordination & Incidents API
- **Scope & Responsibilities:** National disaster registry, emergency coordination triage pipeline, case lifecycle status updates, and operational analytics.
- **Relational Database Entities:**
  - `CrisisEvents` (Id, Title, Description, DisasterType, Severity, Latitude, Longitude, RadiusKm, AffectedCount, Status, StartedAtUtc)
  - `OperationalAreas` (Id, CrisisEventId, Province, District, DSDivision, CommanderName, ContactPhone)
  - `CoordinatorDecisions` (Id, RequestId, CoordinatorUserId, Action, PriorityScore, AssignedUnit, DecisionTimestampUtc)
  - `EscalationLogs` (Id, RequestId, Reason, EscalatedToRole, EscalatedAtUtc)
- **RESTful Endpoints:**
  - `GET /api/v1/incidents` — Active national disaster events with severity levels
  - `POST /api/v1/incidents` — Register new disaster zone with geographic boundary
  - `GET /api/v1/coordinator/pipeline` — Real-time triage queue: Open, Under Review, Dispatched, Resolved
  - `PUT /api/v1/coordinator/requests/{id}/status` — Update lifecycle stage and dispatch rescue units
  - `GET /api/v1/coordinator/summary-metrics` — Operational KPIs: unresolved cases, response time, resource shortages
- **Antigravity Prompt Template (Ready to Copy-Paste):**
```text
Role: Member 3 (Crisis Coordination Domain Developer)
Task: Implement the Sahaya.Coordination.API microservice in C# ASP.NET Core .NET 8.
Steps:
1. Create Coordination.API project with EF Core SQL Server DbContext.
2. Model CrisisEvents, OperationalAreas, CoordinatorDecisions, and EscalationLogs.
3. Implement IncidentsController and CoordinatorController with [Authorize(Roles = 'Coordinator, Admin, CaseManager')].
4. Add state-machine validation ensuring requests progress logically (Submitted -> UnderReview -> Dispatched -> Delivered).
5. Add Swagger documentation and unit test endpoints.
```

---

### Member 4: Logistics Depot & Safe Shelters API
- **Scope & Responsibilities:** Warehouse supply inventory, low-stock safety margins, relief kit dispatch, shelter occupancy tracking, and burn-rate analytics.
- **Relational Database Entities:**
  - `Shelters` (Id, Name, Address, District, Latitude, Longitude, Capacity, CurrentOccupancy, ContactPerson, ContactPhone, FacilitiesJson, IsWheelchairAccessible)
  - `ShelterStockAudits` (Id, ShelterId, WaterStockLiters, FoodRationBoxes, MedicalKits, AuditedAtUtc)
  - `Resources` (Id, Name, Category, TotalQuantity, AvailableQuantity, AllocatedQuantity, LowStockThreshold, Unit, WarehouseLocation)
  - `ResourceAllocations` (Id, ResourceId, AssistanceRequestId, Quantity, AllocatedAtUtc, DispatchedAtUtc)
  - `InterCampTransfers` (Id, SourceShelterId, TargetShelterId, WaterLiters, FoodBoxes, TransferredAtUtc)
- **RESTful Endpoints:**
  - `GET /api/v1/shelters` — Verified evacuation camps with live occupancy progress percentage
  - `POST /api/v1/shelters/{id}/transfer-supplies` — Reallocate surplus resources between camps
  - `GET /api/v1/resources/inventory` — Real-time depot stock with low-stock warnings
  - `POST /api/v1/resources/allocate` — Assign emergency supplies to verified assistance requests
  - `GET /api/v1/shelters/burn-rate` — Calculate daily consumption rates and predicted depletion days
- **Antigravity Prompt Template (Ready to Copy-Paste):**
```text
Role: Member 4 (Logistics & Shelter Domain Developer)
Task: Implement the Sahaya.Logistics.API microservice in C# ASP.NET Core .NET 8.
Steps:
1. Create Logistics.API project with EF Core SQL Server DbContext.
2. Define Shelters, Resources, ResourceAllocations, StockDepots, and InterCampTransfers entities.
3. Build SheltersController and ResourcesController with concurrency handling on stock deductions.
4. Implement burn-rate calculation logic to predict days remaining before food/water run out.
5. Document in Swagger and seed 5 verified shelters and depot assets.
```

---

### Member 5: AI Decision Engine & Human-in-the-Loop Governance API
- **Scope & Responsibilities:** Automated triage classification, NLP urgency confidence scoring, duplicate request detection, and human override audit ledger.
- **Relational Database Entities:**
  - `AIRecommendations` (Id, RequestId, PredictedCategory, RecommendedPriority, ConfidenceScore, RationaleText, GeneratedAtUtc)
  - `HumanOverrideAudits` (Id, RequestId, CoordinatorUserId, OriginalRecommendationJson, HumanAction, ModifiedPriority, Justification, TimestampUtc)
  - `DuplicateMatches` (Id, PrimaryRequestId, DuplicateRequestId, SimilarityScore, MatchedAtUtc)
  - `AIChatSessions` (Id, SessionId, UserQuery, AIResponse, IsFallback, TimestampUtc)
- **RESTful Endpoints:**
  - `POST /api/v1/ai/triage` — Generate AI priority score and explainability breakdown for a request
  - `POST /api/v1/ai/duplicates/detect` — Check if an incoming SOS is a duplicate based on GPS and text similarity
  - `POST /api/v1/ai/override` — Mandatory human governance endpoint to Accept, Override, or Reject AI advice
  - `POST /api/v1/ai/chat` — Real-time conversational AI crisis assistant supporting English and Sinhala
- **Antigravity Prompt Template (Ready to Copy-Paste):**
```text
Role: Member 5 (AI Decision Intelligence Developer)
Task: Implement the Sahaya.AIIntelligence.API microservice in C# ASP.NET Core .NET 8.
Steps:
1. Create AIIntelligence.API project with EF Core SQL Server DbContext.
2. Implement Strategy Pattern: External LLM API Strategy vs. Local Heuristic Safety Rule Engine Fallback.
3. Build AIReviewController with non-repudiation logging into HumanOverrideAudits table.
4. Implement duplicate detection algorithm using Haversine GPS distance (< 200m) and Levenshtein description similarity.
5. Build resilient Polly circuit-breaker fallback for the AI Chat assistant.
```

---

### Member 6: Volunteers, GIS Map & Crowdfunding API
- **Scope & Responsibilities:** Volunteer skill mobilization, field mission assignment, GPS check-ins, Leaflet GIS command map aggregation, and donation pledges.
- **Relational Database Entities:**
  - `VolunteerProfiles` (Id, FullName, Email, Phone, SkillsJson, AvailabilityStatus, ServiceArea, TotalMissionsCompleted)
  - `VolunteerTasks` (Id, VolunteerId, AssistanceRequestId, Title, Priority, DeadlineUtc, Status, CompletedAtUtc)
  - `VolunteerCheckIns` (Id, VolunteerId, Latitude, Longitude, CheckInTimestampUtc)
  - `DonationCampaigns` (Id, Title, Description, TargetAmount, RaisedAmount, EndDateUtc, IsActive)
  - `Donations` (Id, CampaignId, DonorName, Amount, IsMonetary, InKindItemName, InKindQuantity, PaymentRef, CreatedAtUtc)
  - `PartnerRequisitions` (Id, PartnerOrgName, RequestedSupplies, Priority, Status, CreatedAtUtc)
- **RESTful Endpoints:**
  - `GET /api/v1/volunteers` — Volunteer directory with availability and skill tagging
  - `POST /api/v1/volunteers/{id}/assign-task` — Dispatch volunteer to emergency request with task checklist
  - `POST /api/v1/volunteers/check-in` — Record field GPS check-in
  - `GET /api/v1/donations/campaigns` — Active relief funds and progress tracking
  - `POST /api/v1/donations/pledge` — Record monetary or in-kind aid pledge
  - `GET /api/v1/map/layers` — Aggregated geospatial GeoJSON endpoint for Leaflet map markers
- **Antigravity Prompt Template (Ready to Copy-Paste):**
```text
Role: Member 6 (Volunteers, GIS & Donations Domain Developer)
Task: Implement the Sahaya.Operations.API microservice in C# ASP.NET Core .NET 8.
Steps:
1. Create Operations.API project with EF Core SQL Server DbContext.
2. Define VolunteerProfiles, VolunteerTasks, Donations, DonationCampaigns, and PartnerRequisitions entities.
3. Build OperationsController with volunteer dispatch and donation pledge endpoints.
4. Build optimized GET /api/v1/map/layers endpoint combining incidents, shelters, and requests with lat/lon.
5. Add Swagger documentation and seed initial campaigns and volunteers.
```

---

## 4. Git Branching & Integration Protocol (Zero Conflicts)

To guarantee smooth collaboration without code overwrites, team members must adhere to the following workflow:
1. **Member 1** creates the base solution `Sahaya.sln`, `Sahaya.Gateway`, and `Sahaya.Common` projects on branch `develop` and pushes to origin.
2. Each member creates their feature branch from the latest `develop`:
   - Member 1: `feature/backend-member-1-identity`
   - Member 2: `feature/backend-member-2-assistance`
   - Member 3: `feature/backend-member-3-coordination`
   - Member 4: `feature/backend-member-4-logistics`
   - Member 5: `feature/backend-member-5-ai`
   - Member 6: `feature/backend-member-6-operations`
3. Members work strictly within their own `Services/<Domain>.API/` directory. Because files are separate, `git merge develop` occurs with **0% conflicts**.
4. Pull Requests (PRs) are reviewed and merged into `develop` sequentially from Phase 1 to Phase 5.
