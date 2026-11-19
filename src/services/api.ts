import {
  AuthResponse,
  User,
  AssistanceRequest,
  RequestStatusHistory,
  CrisisEvent,
  CoordinatorDashboardData,
  AIRecommendation,
  Resource,
  ResourceAllocation,
  Shelter,
  ShelterAssignment,
  VolunteerProfile,
  VolunteerTask,
  DonationCampaign,
  Donation,
  NotificationItem,
  DuplicateMatch,
  SystemOverviewReport,
  AuditLogItem,
  RequestStatus,
  RequestCategory,
  RequestUrgency,
  UserRole,
  UserSummary,
  UserRoleCounts,
  SystemHealthMetrics,
  VolunteerCheckIn
} from '../types';

// Mock DB for pure client-side standalone execution
const mockUser: User = {
  id: 'u-admin-1',
  fullName: 'Operational Officer',
  email: 'admin@sahaya.lk',
  phoneNumber: '+94 77 123 4567',
  role: 'Admin',
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
};

const mockIncidents: CrisisEvent[] = [
  {
    id: 'inc-1',
    title: 'Kelani River Flood Surge - Level 4',
    description: 'Heavy precipitation has breached primary flood levees in Kelaniya and Kolonnawa sectors.',
    severity: 'Severe',
    location: 'Kelaniya, Western Province',
    latitude: 6.9547,
    longitude: 79.9189,
    radiusKm: 15,
    affectedCount: 2450,
    status: 'Active',
    startedAt: '2026-11-18T04:00:00Z',
    createdAt: '2026-11-18T04:00:00Z',
  },
  {
    id: 'inc-2',
    title: 'Kaduwela Safe Evacuation Corridor',
    description: 'Low-lying access roads blocked. Armed forces rescue teams deployed with inflatable boats.',
    severity: 'Critical',
    location: 'Kaduwela, Western Province',
    latitude: 6.9328,
    longitude: 79.9837,
    radiusKm: 8,
    affectedCount: 1100,
    status: 'Active',
    startedAt: '2026-11-18T08:00:00Z',
    createdAt: '2026-11-18T08:00:00Z',
  },
];

const mockRequests: AssistanceRequest[] = [
  {
    id: 'req-1',
    citizenId: 'cit-1',
    citizenName: 'Kavinda Fernando',
    citizenPhone: '+94 71 889 2211',
    category: 'Water' as RequestCategory,
    urgency: 'Immediate' as RequestUrgency,
    description: 'Drinking water contamination. 14 families stranded on upper rooftop of temple.',
    location: 'Sedawatta, Wellampitiya',
    latitude: 6.942,
    longitude: 79.887,
    peopleCount: 45,
    status: 'Pending' as RequestStatus,
    createdAt: '2026-11-19T06:30:00Z',
  },
  {
    id: 'req-2',
    citizenId: 'cit-2',
    citizenName: 'Nimali Wickramasinghe',
    citizenPhone: '+94 77 452 9901',
    category: 'Medical' as RequestCategory,
    urgency: 'Critical' as RequestUrgency,
    description: 'Insulin and emergency pediatric medical care required immediately.',
    location: 'Pugoda Bridge North',
    latitude: 6.974,
    longitude: 80.015,
    peopleCount: 4,
    status: 'Assigned' as RequestStatus,
    createdAt: '2026-11-19T07:15:00Z',
  },
  {
    id: 'req-3',
    citizenId: 'cit-3',
    citizenName: 'Sunil Shantha',
    citizenPhone: '+94 75 112 3344',
    category: 'Food' as RequestCategory,
    urgency: 'High' as RequestUrgency,
    description: 'Dry rations needed for elderly care home evacuated to community hall.',
    location: 'Biyagama Central',
    latitude: 6.948,
    longitude: 79.992,
    peopleCount: 30,
    status: 'InProgress' as RequestStatus,
    createdAt: '2026-11-19T08:00:00Z',
  },
];

const mockShelters: Shelter[] = [
  {
    id: 'sh-1',
    name: 'Kelaniya Maha Vidyalaya Safe Camp',
    address: 'Biyagama Rd, Kelaniya',
    latitude: 6.958,
    longitude: 79.921,
    capacity: 600,
    currentOccupancy: 420,
    availableCapacity: 180,
    contactPerson: 'Capt. Gamini Silva',
    contactPhone: '+94 11 291 1234',
    status: 'Open',
    facilities: ['Clean Water', 'Medical Tent', 'Sanitation', 'Hot Meals'],
  },
  {
    id: 'sh-2',
    name: 'Kaduwela Community Center',
    address: 'High Level Rd, Kaduwela',
    latitude: 6.935,
    longitude: 79.981,
    capacity: 400,
    currentOccupancy: 390,
    availableCapacity: 10,
    contactPerson: 'Mrs. H. Dissanayake',
    contactPhone: '+94 11 289 4455',
    status: 'Full',
    facilities: ['Dry Shelter', 'First Aid', 'Solar Power'],
  },
];

const mockResources: Resource[] = [
  {
    id: 'res-1',
    name: 'Clean Water Purification Packs (5L)',
    category: 'Water',
    quantity: 1250,
    unit: 'Packs',
    warehouseLocation: 'Depot A - Kelaniya',
    expiryDate: '2027-12-31',
  },
  {
    id: 'res-2',
    name: 'Emergency High-Energy Biscuit Rations',
    category: 'Food',
    quantity: 4800,
    unit: 'Boxes',
    warehouseLocation: 'Depot B - Peliyagoda',
    expiryDate: '2027-06-30',
  },
  {
    id: 'res-3',
    name: 'Inflatable Life Rafts & Life Jackets',
    category: 'Rescue',
    quantity: 65,
    unit: 'Sets',
    warehouseLocation: 'Disaster Rapid Center Colombo',
  },
];

const mockCampaigns: DonationCampaign[] = [
  {
    id: 'camp-1',
    title: 'Western Province Flood Disaster Relief Fund 2026',
    description: 'Urgent crowdfunding to procure hot meals, infant nutrition, and clean water filtration kits for displaced families.',
    targetAmount: 2500000,
    raisedAmount: 1845000,
    startDate: '2026-11-15T00:00:00Z',
    endDate: '2026-12-31T00:00:00Z',
    status: 'Active',
    crisisEventId: 'inc-1',
  },
];

const mockUsers: UserSummary[] = [
  {
    id: 'u-1',
    fullName: 'Operational Officer',
    email: 'admin@sahaya.lk',
    role: 'Admin',
    isActive: true,
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'u-2',
    fullName: 'Dinuri Senara',
    email: 'dinuri.s@sahaya.lk',
    role: 'Coordinator',
    isActive: true,
    createdAt: '2026-02-15T00:00:00Z',
  },
  {
    id: 'u-3',
    fullName: 'Kasun Wickramasinghe',
    email: 'kasun.w@field.sahaya.lk',
    role: 'Volunteer',
    isActive: true,
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'u-4',
    fullName: 'Nimal Jayawardena',
    email: 'nimal.j@gmail.com',
    role: 'Citizen',
    isActive: true,
    createdAt: '2026-04-12T00:00:00Z',
  },
  {
    id: 'u-5',
    fullName: 'Global Hope Humanitarian Org',
    email: 'aid@globalhope.org',
    role: 'Donor',
    isActive: true,
    createdAt: '2026-05-20T00:00:00Z',
  },
];

export const api = {
  // Auth
  async login(email: string, _password: string): Promise<AuthResponse> {
    return {
      token: 'mock-jwt-token-active-session',
      userId: mockUser.id,
      email: email || mockUser.email,
      fullName: mockUser.fullName,
      role: 'Admin',
      expiresIn: 86400,
    };
  },

  async register(data: any): Promise<AuthResponse> {
    return {
      token: 'mock-jwt-token-new-reg',
      userId: 'u-new',
      email: data.email,
      fullName: data.fullName,
      role: 'Citizen',
      expiresIn: 86400,
    };
  },

  async getCurrentUser(): Promise<User> {
    return mockUser;
  },

  async updateProfile(data: { fullName: string; phoneNumber: string }): Promise<User> {
    return { ...mockUser, ...data };
  },

  async changePassword(_data: any): Promise<{ message: string }> {
    return { message: 'Password updated successfully.' };
  },

  // Crisis Events / Incidents
  async getIncidents(): Promise<CrisisEvent[]> {
    return mockIncidents;
  },

  async getIncident(id: string): Promise<CrisisEvent> {
    return mockIncidents.find((i) => i.id === id) || mockIncidents[0];
  },

  async createIncident(data: any): Promise<CrisisEvent> {
    const newInc: CrisisEvent = {
      id: `inc-${Date.now()}`,
      ...data,
      status: 'Active',
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    mockIncidents.unshift(newInc);
    return newInc;
  },

  async updateIncident(id: string, data: any): Promise<CrisisEvent> {
    const inc = mockIncidents.find((i) => i.id === id);
    if (inc) Object.assign(inc, data);
    return inc || mockIncidents[0];
  },

  // Assistance Requests
  async getRequests(_filters?: any): Promise<AssistanceRequest[]> {
    return mockRequests;
  },

  async getRequest(id: string): Promise<AssistanceRequest> {
    return mockRequests.find((r) => r.id === id) || mockRequests[0];
  },

  async createRequest(data: any): Promise<AssistanceRequest> {
    const newReq: AssistanceRequest = {
      id: `req-${Date.now()}`,
      citizenId: mockUser.id,
      citizenName: mockUser.fullName,
      citizenPhone: mockUser.phoneNumber,
      ...data,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    mockRequests.unshift(newReq);
    return newReq;
  },

  async updateRequestStatus(id: string, status: RequestStatus, _note?: string): Promise<AssistanceRequest> {
    const req = mockRequests.find((r) => r.id === id);
    if (req) req.status = status;
    return req || mockRequests[0];
  },

  async getRequestHistory(_id: string): Promise<RequestStatusHistory[]> {
    return [
      {
        id: 'h-1',
        assistanceRequestId: _id,
        fromStatus: 'Pending',
        toStatus: 'Assigned',
        changedByEmail: 'coordinator@sahaya.lk',
        changedAt: new Date().toISOString(),
        notes: 'Dispatched volunteer unit with high-clearance rescue vehicle.',
      },
    ];
  },

  async getMyRequests(): Promise<AssistanceRequest[]> {
    return mockRequests;
  },

  // Coordinator Dashboard
  async getCoordinatorDashboard(): Promise<CoordinatorDashboardData> {
    return {
      activeCrisisEvents: mockIncidents,
      pendingRequestsCount: mockRequests.filter((r) => r.status === 'Pending').length,
      assignedRequestsCount: mockRequests.filter((r) => r.status === 'Assigned').length,
      inProgressRequestsCount: mockRequests.filter((r) => r.status === 'InProgress').length,
      resolvedRequestsCount: 142,
      criticalUrgencyCount: 18,
      recentRequests: mockRequests,
      topNeededResources: [
        { resourceName: 'Bottled Water', totalRequested: 2400, totalAvailable: 1250, shortage: 1150 },
        { resourceName: 'Dry Ration Packs', totalRequested: 1800, totalAvailable: 4800, shortage: 0 },
      ],
      aiTriageQueueCount: 5,
    };
  },

  // Shelters
  async getShelters(): Promise<Shelter[]> {
    return mockShelters;
  },

  async getShelter(id: string): Promise<Shelter> {
    return mockShelters.find((s) => s.id === id) || mockShelters[0];
  },

  async createShelter(data: any): Promise<Shelter> {
    const s: Shelter = {
      id: `sh-${Date.now()}`,
      ...data,
      currentOccupancy: 0,
      availableCapacity: data.capacity,
      status: 'Open',
    };
    mockShelters.push(s);
    return s;
  },

  async updateShelter(id: string, data: any): Promise<Shelter> {
    const s = mockShelters.find((item) => item.id === id);
    if (s) Object.assign(s, data);
    return s || mockShelters[0];
  },

  async assignShelter(data: any): Promise<ShelterAssignment> {
    return {
      id: `sha-${Date.now()}`,
      shelterId: data.shelterId,
      citizenId: data.citizenId || 'cit-1',
      assistanceRequestId: data.assistanceRequestId,
      numberOfPeople: data.numberOfPeople || 1,
      assignedAt: new Date().toISOString(),
      status: 'Occupied',
    };
  },

  // Resources
  async getResources(): Promise<Resource[]> {
    return mockResources;
  },

  async getResource(id: string): Promise<Resource> {
    return mockResources.find((r) => r.id === id) || mockResources[0];
  },

  async createResource(data: any): Promise<Resource> {
    const r: Resource = { id: `res-${Date.now()}`, ...data };
    mockResources.push(r);
    return r;
  },

  async updateResource(id: string, data: any): Promise<Resource> {
    const r = mockResources.find((item) => item.id === id);
    if (r) Object.assign(r, data);
    return r || mockResources[0];
  },

  async allocateResource(data: any): Promise<ResourceAllocation> {
    return {
      id: `alloc-${Date.now()}`,
      resourceId: data.resourceId,
      assistanceRequestId: data.assistanceRequestId,
      quantityAllocated: data.quantityAllocated,
      allocatedAt: new Date().toISOString(),
      allocatedByEmail: 'coordinator@sahaya.lk',
      status: 'Dispatched',
    };
  },

  // AI Recommendations
  async getAIRecommendation(requestId: string): Promise<AIRecommendation> {
    return {
      id: `ai-rec-${requestId}`,
      assistanceRequestId: requestId,
      suggestedCategory: 'Water',
      suggestedUrgency: 'Critical',
      suggestedShelterId: mockShelters[0].id,
      suggestedShelterName: mockShelters[0].name,
      confidenceScore: 0.94,
      explanation: 'Keyword analysis and water levee breach proximity indicate high dehydration and disease contagion risk.',
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
  },

  async acceptAIRecommendation(_id: string): Promise<void> {},
  async overrideAIRecommendation(_id: string, _data: any): Promise<void> {},

  // Volunteers
  async getVolunteers(): Promise<VolunteerProfile[]> {
    return [
      {
        id: 'vol-1',
        userId: 'u-3',
        fullName: 'Kasun Wickramasinghe',
        skills: ['First Aid (Red Cross)', 'Offroad 4x4 Driving', 'Water Rescue'],
        isAvailable: true,
        currentLatitude: 6.95,
        currentLongitude: 79.92,
        rating: 4.9,
        completedTasksCount: 28,
      },
      {
        id: 'vol-2',
        userId: 'u-vol-2',
        fullName: 'Dr. Priyantha Alwis',
        skills: ['Emergency Medicine', 'Pediatric Triage'],
        isAvailable: true,
        currentLatitude: 6.93,
        currentLongitude: 79.98,
        rating: 5.0,
        completedTasksCount: 42,
      },
    ];
  },

  async getVolunteerProfile(_id: string): Promise<VolunteerProfile> {
    return (await this.getVolunteers())[0];
  },

  async updateVolunteerAvailability(_isAvailable: boolean): Promise<void> {},

  async getVolunteerTasks(): Promise<VolunteerTask[]> {
    return [
      {
        id: 'task-1',
        volunteerId: 'vol-1',
        assistanceRequestId: 'req-1',
        description: 'Deploy inflatable boat to evacuate 14 trapped families from Sedawatta temple.',
        status: 'Assigned',
        assignedAt: new Date().toISOString(),
      },
    ];
  },

  async updateTaskStatus(_id: string, _status: string): Promise<void> {},
  async recordVolunteerCheckIn(_data: any): Promise<VolunteerCheckIn> {
    return {
      id: `chk-${Date.now()}`,
      volunteerId: 'vol-1',
      latitude: _data.latitude,
      longitude: _data.longitude,
      batteryLevel: 92,
      isEmergency: false,
      timestamp: new Date().toISOString(),
    };
  },

  // Donations & Crowdfunding
  async getCampaigns(): Promise<DonationCampaign[]> {
    return mockCampaigns;
  },

  async getCampaign(id: string): Promise<DonationCampaign> {
    return mockCampaigns.find((c) => c.id === id) || mockCampaigns[0];
  },

  async createCampaign(data: any): Promise<DonationCampaign> {
    const c: DonationCampaign = {
      id: `camp-${Date.now()}`,
      ...data,
      raisedAmount: 0,
      startDate: new Date().toISOString(),
      status: 'Active',
    };
    mockCampaigns.push(c);
    return c;
  },

  async recordMonetaryDonation(data: any): Promise<Donation> {
    return {
      id: `don-${Date.now()}`,
      donorName: data.donorName || 'Anonymous Well-Wisher',
      donorEmail: data.donorEmail || 'donor@sahaya.lk',
      amount: data.amount,
      donationType: 'Monetary',
      campaignId: data.campaignId,
      createdAt: new Date().toISOString(),
    };
  },

  async recordInKindDonation(data: any): Promise<Donation> {
    return {
      id: `don-${Date.now()}`,
      donorName: data.donorName || 'Local Supplier',
      donorEmail: data.donorEmail || 'supplier@sahaya.lk',
      amount: 0,
      itemDescription: data.itemDescription,
      quantity: data.quantity,
      donationType: 'InKind',
      campaignId: data.campaignId,
      createdAt: new Date().toISOString(),
    };
  },

  async getAllDonations(): Promise<Donation[]> {
    return [
      {
        id: 'don-1',
        donorName: 'Dialog Axiata Foundation',
        donorEmail: 'foundation@dialog.lk',
        amount: 500000,
        donationType: 'Monetary',
        campaignId: 'camp-1',
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        id: 'don-2',
        donorName: 'Keells Super Distribution',
        donorEmail: 'csr@keells.com',
        amount: 0,
        itemDescription: '1000 Bottled Water Cartons',
        quantity: 1000,
        donationType: 'InKind',
        campaignId: 'camp-1',
        createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
      },
    ];
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return [
      {
        id: 'notif-1',
        title: 'Emergency Flood Alert - Kelani River Levee',
        message: 'Water levels exceeded Minor Flood threshold (7.2ft). Evacuation protocols active.',
        type: 'Warning',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'notif-2',
        title: 'New Aid Request Assigned',
        message: 'Sedawatta Temple aid request assigned to Kelaniya rescue squad.',
        type: 'Info',
        isRead: false,
        createdAt: new Date().toISOString(),
      },
    ];
  },

  async markNotificationRead(_id: string): Promise<void> {},
  async markAllNotificationsRead(): Promise<void> {},
  async broadcastAlert(_data: any): Promise<void> {},

  // Reports & Governance (Admin Overview & Telemetry)
  async getSystemOverview(): Promise<SystemOverviewReport> {
    return {
      activeIncidents: mockIncidents.length,
      totalRequests: 1420,
      pendingRequests: 42,
      resolvedRequests: 1378,
      totalShelters: mockShelters.length,
      totalShelterCapacity: 5000,
      shelterOccupancyPercentage: 74,
      totalDonationsRaised: 1845000,
      totalInKindDonations: 320,
      activeVolunteers: 65,
      totalRegisteredUsers: mockUsers.length + 475,
    };
  },

  async getUserCountsByRole(): Promise<UserRoleCounts> {
    return {
      totalUsers: 480,
      citizens: 310,
      coordinators: 28,
      volunteers: 112,
      donors: 24,
      admins: 6,
    };
  },

  async getSystemHealthMetrics(): Promise<SystemHealthMetrics> {
    return {
      status: 'Online',
      databaseConnected: true,
      databaseLatencyMs: 3,
      processMemoryMb: 52,
      totalEntities: 2450,
    };
  },

  async getAuditLogs(_count: number = 30): Promise<AuditLogItem[]> {
    return [
      {
        id: '1',
        action: 'USER_ROLE_ASSIGN',
        entityName: 'UserAccount',
        entityId: 'u-101',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        userEmail: 'admin@sahaya.lk',
        details: 'Assigned Coordinator role to Dinuri Senara',
      },
      {
        id: '2',
        action: 'REQUEST_TRIAGE',
        entityName: 'AssistanceRequest',
        entityId: 'req-442',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        userEmail: 'coordinator@sahaya.lk',
        details: 'Accepted AI Recommendation: Allocated 50 Clean Water Ration packs',
      },
      {
        id: '3',
        action: 'RESOURCE_ALLOCATE',
        entityName: 'ResourceStock',
        entityId: 'res-88',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        userEmail: 'logistics@sahaya.lk',
        details: 'Dispatched emergency mobile boat to Kelaniya flood sector',
      },
    ];
  },

  async getDuplicateMatches(): Promise<DuplicateMatch[]> {
    return [];
  },

  async getOverviewReport(): Promise<SystemOverviewReport> {
    return this.getSystemOverview();
  },

  async getShelterReport(): Promise<any[]> {
    return mockShelters.map((s) => ({
      shelterId: s.id,
      shelterName: s.name,
      totalCapacity: s.capacity,
      currentOccupancy: s.currentOccupancy,
      occupancyRate: Math.round((s.currentOccupancy / s.capacity) * 100),
      status: s.status,
    }));
  },

  async getDonationCampaigns(): Promise<DonationCampaign[]> {
    return mockCampaigns;
  },

  async createDonationCampaign(data: any): Promise<DonationCampaign> {
    return this.createCampaign(data);
  },

  async getDonations(): Promise<Donation[]> {
    return this.getAllDonations();
  },

  async createDonation(data: any): Promise<Donation> {
    return this.recordMonetaryDonation(data);
  },

  async assignToShelter(shelterId: string, data: any): Promise<ShelterAssignment> {
    return this.assignShelter({ shelterId, ...data });
  },

  async detectDuplicates(_requestId?: string): Promise<DuplicateMatch[]> {
    return [];
  },

  // User Management
  async getUsers(role?: string, search?: string): Promise<UserSummary[]> {
    let result = [...mockUsers];
    if (role && role !== 'All') {
      result = result.filter((u) => u.role === role);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return result;
  },

  async getUserById(id: string): Promise<UserSummary> {
    return mockUsers.find((u) => u.id === id) || mockUsers[0];
  },

  async updateUserRole(id: string, data: { newRole: number; justification: string }): Promise<void> {
    const roles: UserRole[] = ['Citizen', 'Coordinator', 'Volunteer', 'Donor', 'Admin'];
    const u = mockUsers.find((item) => item.id === id);
    if (u) {
      u.role = roles[data.newRole] || 'Citizen';
    }
  },

  async toggleUserStatus(id: string, data: { isActive: boolean; justification: string }): Promise<void> {
    const u = mockUsers.find((item) => item.id === id);
    if (u) {
      u.isActive = data.isActive;
    }
  },
};
