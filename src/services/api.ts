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
  VolunteerCheckIn,
  PartnerRequest
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
    location: 'Kaduwela, Colombo District, Western Province',
    latitude: 6.9328,
    longitude: 79.9837,
    radiusKm: 8,
    affectedCount: 1100,
    status: 'Active',
    startedAt: '2026-11-18T08:00:00Z',
    createdAt: '2026-11-18T08:00:00Z',
  },
  {
    id: 'inc-3',
    title: 'Kalu Ganga Water Surge & Ratnapura Flash Flood',
    description: 'Upper catchment rainfall causing rapid water level rise in Kalu Ganga river basin.',
    severity: 'Severe',
    location: 'Ratnapura & Kuruwita, Ratnapura District, Sabaragamuwa Province',
    latitude: 6.6828,
    longitude: 80.4034,
    radiusKm: 12,
    affectedCount: 1850,
    status: 'Active',
    startedAt: '2026-11-18T10:00:00Z',
    createdAt: '2026-11-18T10:00:00Z',
  },
  {
    id: 'inc-4',
    title: 'Gin Ganga Flood Alert & Baddegama Evacuations',
    description: 'Spill gates opened. Flood sirens sounded for downstream riverside communities.',
    severity: 'High',
    location: 'Baddegama & Nagoda, Galle District, Southern Province',
    latitude: 6.1856,
    longitude: 80.1983,
    radiusKm: 10,
    affectedCount: 920,
    status: 'Active',
    startedAt: '2026-11-18T12:00:00Z',
    createdAt: '2026-11-18T12:00:00Z',
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
    statusHistory: [],
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
    statusHistory: [],
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
    statusHistory: [],
    createdAt: '2026-11-19T08:00:00Z',
  },
];

const mockShelters: Shelter[] = [
  {
    id: 'sh-1',
    name: 'Kelaniya Maha Vidyalaya Safe Camp',
    address: 'Biyagama Rd, Kelaniya, Gampaha District',
    latitude: 6.958,
    longitude: 79.921,
    capacity: 600,
    totalCapacity: 600,
    currentOccupancy: 420,
    availableCapacity: 180,
    contactPerson: 'Capt. Gamini Silva',
    contactPhone: '+94 11 291 1234',
    status: 'Active',
    facilities: ['Clean Water', 'Medical Tent', 'Sanitation', 'Hot Meals'],
    accessibilityInfo: 'Ground floor wheelchair ramp available',
    createdAt: '2026-11-18T00:00:00Z',
  },
  {
    id: 'sh-2',
    name: 'Kaduwela Community Center',
    address: 'High Level Rd, Kaduwela, Colombo District',
    latitude: 6.935,
    longitude: 79.981,
    capacity: 400,
    totalCapacity: 400,
    currentOccupancy: 390,
    availableCapacity: 10,
    contactPerson: 'Mrs. H. Dissanayake',
    contactPhone: '+94 11 289 4455',
    status: 'Full',
    facilities: ['Dry Shelter', 'First Aid', 'Solar Power'],
    accessibilityInfo: 'Tactile paving and caregiver assistance available',
    createdAt: '2026-11-18T02:00:00Z',
  },
  {
    id: 'sh-3',
    name: 'Ratnapura Town Hall Relief Shelter',
    address: 'Main Street, Ratnapura, Ratnapura District, Sabaragamuwa Province',
    latitude: 6.6828,
    longitude: 80.4034,
    capacity: 550,
    totalCapacity: 550,
    currentOccupancy: 280,
    availableCapacity: 270,
    contactPerson: 'Mr. Sunil Jayasinghe',
    contactPhone: '+94 45 222 3411',
    status: 'Active',
    facilities: ['Clean Drinking Water', 'Medical Officer', 'Emergency Kitchen', 'Sanitary Packs'],
    accessibilityInfo: 'Special elder-care ward on ground level',
    createdAt: '2026-11-18T05:00:00Z',
  },
  {
    id: 'sh-4',
    name: 'Galle Vidyaloka Vidyalaya Evacuation Camp',
    address: 'Wakwella Road, Galle, Galle District, Southern Province',
    latitude: 6.0535,
    longitude: 80.221,
    capacity: 450,
    totalCapacity: 450,
    currentOccupancy: 310,
    availableCapacity: 140,
    contactPerson: 'Dr. Nishantha Kumara',
    contactPhone: '+94 91 223 5890',
    status: 'Active',
    facilities: ['Clean Water', 'Pediatric First Aid', 'Dry Bedding', 'Generator'],
    accessibilityInfo: 'Ramp access throughout auditorium',
    createdAt: '2026-11-18T06:00:00Z',
  },
  {
    id: 'sh-5',
    name: 'Kalutara Bodhi Grounds Relief Station',
    address: 'Riverside Road, Kalutara, Kalutara District, Western Province',
    latitude: 6.5854,
    longitude: 79.9607,
    capacity: 350,
    totalCapacity: 350,
    currentOccupancy: 120,
    availableCapacity: 230,
    contactPerson: 'Ven. Ananda Thero / Officer Perera',
    contactPhone: '+94 34 222 1980',
    status: 'Active',
    facilities: ['Purified Water Tank', 'Community Kitchen', 'Sanitation', 'Charging Station'],
    accessibilityInfo: 'Flat terrain suitable for wheelchairs',
    createdAt: '2026-11-18T07:30:00Z',
  },
];

const mockResources: Resource[] = [
  {
    id: 'res-1',
    name: 'Clean Water Purification Packs (5L)',
    category: 'DrinkingWater',
    quantity: 1250,
    totalQuantity: 1250,
    availableQuantity: 950,
    allocatedQuantity: 200,
    dispatchedQuantity: 100,
    lowStockThreshold: 300,
    unit: 'Packs',
    warehouseLocation: 'Depot A - Kelaniya, Gampaha District',
    storageLocation: 'Depot A - Kelaniya, Gampaha District',
    expiryDate: '2027-12-31',
    isActive: true,
    isLowStock: false,
    createdAt: '2026-11-18T00:00:00Z',
  },
  {
    id: 'res-2',
    name: 'Emergency High-Energy Biscuit Rations',
    category: 'Food',
    quantity: 4800,
    totalQuantity: 4800,
    availableQuantity: 3600,
    allocatedQuantity: 800,
    dispatchedQuantity: 400,
    lowStockThreshold: 1000,
    unit: 'Boxes',
    warehouseLocation: 'Depot B - Peliyagoda, Gampaha District',
    storageLocation: 'Depot B - Peliyagoda, Gampaha District',
    expiryDate: '2027-06-30',
    isActive: true,
    isLowStock: false,
    createdAt: '2026-11-18T01:00:00Z',
  },
  {
    id: 'res-3',
    name: 'Inflatable Life Rafts & Life Jackets',
    category: 'LogisticsEquipment',
    quantity: 65,
    totalQuantity: 65,
    availableQuantity: 15,
    allocatedQuantity: 30,
    dispatchedQuantity: 20,
    lowStockThreshold: 20,
    unit: 'Sets',
    warehouseLocation: 'Disaster Rapid Center Colombo, Western Province',
    storageLocation: 'Disaster Rapid Center Colombo, Western Province',
    isActive: true,
    isLowStock: true,
    createdAt: '2026-11-18T02:00:00Z',
  },
  {
    id: 'res-4',
    name: 'Emergency Trauma Medical Kits & Antiseptics',
    category: 'MedicalSupplies',
    quantity: 420,
    totalQuantity: 420,
    availableQuantity: 280,
    allocatedQuantity: 90,
    dispatchedQuantity: 50,
    lowStockThreshold: 100,
    unit: 'Kits',
    warehouseLocation: 'Ratnapura Central Relief Depot, Sabaragamuwa Province',
    storageLocation: 'Ratnapura Central Relief Depot, Sabaragamuwa Province',
    expiryDate: '2028-01-15',
    isActive: true,
    isLowStock: false,
    createdAt: '2026-11-18T03:30:00Z',
  },
  {
    id: 'res-5',
    name: 'Temporary Family Tents & Water-proof Tarpaulins',
    category: 'ShelterSupplies',
    quantity: 350,
    totalQuantity: 350,
    availableQuantity: 85,
    allocatedQuantity: 165,
    dispatchedQuantity: 100,
    lowStockThreshold: 100,
    unit: 'Units',
    warehouseLocation: 'Southern Command Logistics Base, Galle District',
    storageLocation: 'Southern Command Logistics Base, Galle District',
    isActive: true,
    isLowStock: true,
    createdAt: '2026-11-18T04:00:00Z',
  },
  {
    id: 'res-6',
    name: 'Family Hygiene & Sanitation Care Packs',
    category: 'Sanitation',
    quantity: 900,
    totalQuantity: 900,
    availableQuantity: 640,
    allocatedQuantity: 180,
    dispatchedQuantity: 80,
    lowStockThreshold: 200,
    unit: 'Packs',
    warehouseLocation: 'Kalutara Disaster Stockpile, Western Province',
    storageLocation: 'Kalutara Disaster Stockpile, Western Province',
    expiryDate: '2027-11-30',
    isActive: true,
    isLowStock: false,
    createdAt: '2026-11-18T05:00:00Z',
  },
  {
    id: 'res-7',
    name: 'Bottled Mineral Drinking Water (1L Bottles)',
    category: 'DrinkingWater',
    quantity: 2000,
    totalQuantity: 2000,
    availableQuantity: 0,
    allocatedQuantity: 1500,
    dispatchedQuantity: 500,
    lowStockThreshold: 400,
    unit: 'Bottles',
    warehouseLocation: 'Depot A - Kelaniya, Gampaha District',
    storageLocation: 'Depot A - Kelaniya, Gampaha District',
    expiryDate: '2027-04-30',
    isActive: true,
    isLowStock: true,
    createdAt: '2026-11-18T06:00:00Z',
  },
  {
    id: 'res-8',
    name: 'Heavy-Duty Motorized Rescue Zodiacs',
    category: 'LogisticsEquipment',
    quantity: 12,
    totalQuantity: 12,
    availableQuantity: 0,
    allocatedQuantity: 8,
    dispatchedQuantity: 4,
    lowStockThreshold: 3,
    unit: 'Boats',
    warehouseLocation: 'Disaster Rapid Center Colombo, Western Province',
    storageLocation: 'Disaster Rapid Center Colombo, Western Province',
    isActive: true,
    isLowStock: true,
    createdAt: '2026-11-18T07:00:00Z',
  },
];

const mockPartnerRequests: PartnerRequest[] = [
  {
    id: 'pr-101',
    partnerName: 'Sri Lanka Red Cross Society (SLRCS)',
    partnerType: 'Humanitarian NGO',
    resourceCategory: 'DrinkingWater',
    itemName: 'Emergency Packaged Drinking Water (20L Cans)',
    quantityRequested: 1000,
    unit: 'Cans',
    priority: 'Critical',
    deliveryLocation: 'Depot A - Kelaniya, Gampaha District',
    justification: 'Kelani river flood evacuation exceeded Kelaniya depot drinking water stock.',
    status: 'InTransit',
    requestedAt: '2026-11-21T08:30:00Z',
    etaHours: 3
  },
  {
    id: 'pr-102',
    partnerName: 'Sri Lanka Army Disaster Relief Wing',
    partnerType: 'Military / Civil Defence',
    resourceCategory: 'LogisticsEquipment',
    itemName: 'Aluminum Assault Boats with Outboard Motors',
    quantityRequested: 6,
    unit: 'Boats',
    priority: 'High',
    deliveryLocation: 'Disaster Rapid Center Colombo, Western Province',
    justification: 'Severe waterlogging in Biyagama industrial and residential basin.',
    status: 'Approved',
    requestedAt: '2026-11-21T10:15:00Z',
    etaHours: 6
  },
  {
    id: 'pr-103',
    partnerName: 'UN World Food Programme (WFP)',
    partnerType: 'UN Agency',
    resourceCategory: 'Food',
    itemName: 'High-Energy Micronutrient Fortified Biscuits (BP-5)',
    quantityRequested: 2500,
    unit: 'Boxes',
    priority: 'Medium',
    deliveryLocation: 'Ratnapura Central Relief Depot, Sabaragamuwa Province',
    justification: 'Sustained relief for 4 isolated landslide pockets in Kalawana.',
    status: 'Pending',
    requestedAt: '2026-11-21T12:00:00Z',
    etaHours: 14
  }
];

const mockCampaigns: DonationCampaign[] = [
  {
    id: 'camp-1',
    title: 'Western Province Flood Disaster Relief Fund 2026',
    description: 'Urgent crowdfunding to procure hot meals, infant nutrition, and clean water filtration kits for displaced families.',
    targetAmount: 2500000,
    raisedAmount: 1845000,
    progressPercentage: 74,
    startDate: '2026-11-15T00:00:00Z',
    endDate: '2026-12-31T00:00:00Z',
    status: 'Active',
    crisisEventId: 'inc-1',
  },
];

const mockVolunteers: VolunteerProfile[] = [
  {
    id: 'vol-1',
    userId: 'u-3',
    fullName: 'Kasun Wickramasinghe',
    skills: ['First Aid (Red Cross)', 'Offroad 4x4 Driving', 'Water Rescue'],
    isAvailable: true,
    serviceArea: 'Colombo & Gampaha',
    currentLatitude: 6.95,
    currentLongitude: 79.92,
    rating: 4.9,
    completedTasksCount: 28,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'vol-2',
    userId: 'u-vol-2',
    fullName: 'Dr. Priyantha Alwis',
    skills: ['Emergency Medicine', 'Pediatric Triage'],
    isAvailable: true,
    serviceArea: 'Western Province',
    currentLatitude: 6.93,
    currentLongitude: 79.98,
    rating: 5.0,
    completedTasksCount: 42,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

const mockVolunteerTasks: VolunteerTask[] = [
  {
    id: 'task-1',
    volunteerId: 'vol-1',
    assistanceRequestId: 'req-1',
    title: 'Flood Rescue & Evacuation Assistance',
    priority: 'Critical',
    description: 'Deploy inflatable boat to evacuate 14 trapped families from Sedawatta temple.',
    status: 'Assigned',
    assignedAt: new Date().toISOString(),
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

let mockNotificationsList: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Emergency Flood Alert - Kelani River Levee',
    message: 'Water levels exceeded Minor Flood threshold (7.2ft). Evacuation protocols active in Kolonnawa zone.',
    type: 'EmergencyAlert',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Safe Shelter Capacity Alert - Ratnapura',
    message: 'Ratnapura Central Vidyalaya shelter reached 85% capacity. Diverting incoming evacuees to Ferguson High School.',
    type: 'Warning',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'notif-3',
    title: 'New Aid Request Assigned',
    message: 'Sedawatta Temple critical aid request assigned to Kelaniya rapid response squad.',
    type: 'Info',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'notif-4',
    title: 'Relief Supplies Dispatched',
    message: '1,500 clean drinking water cans and dry rations dispatched from Matara Regional Depot.',
    type: 'Success',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

export const api = {
  // Auth
  async login(email: string, _password: string): Promise<AuthResponse> {
    const lowEmail = (email || '').toLowerCase().trim();
    let detectedRole: UserRole = 'Citizen';
    let fullName = 'Citizen User';

    // Explicit exact matching first, then fuzzy
    if (lowEmail === 'shelteradmin@sahaya.org' || lowEmail.startsWith('shelter')) {
      detectedRole = 'ShelterAdmin';
      fullName = 'Camp & Shelter Administrator';
    } else if (lowEmail === 'admin@sahaya.org' || lowEmail.startsWith('admin')) {
      detectedRole = 'Admin';
      fullName = 'Operational System Administrator';
    } else if (lowEmail.startsWith('coordinator')) {
      detectedRole = 'Coordinator';
      fullName = 'Chief Emergency Coordinator';
    } else if (lowEmail.startsWith('case')) {
      detectedRole = 'CaseManager';
      fullName = 'Senior Incident Case Manager';
    } else if (lowEmail.startsWith('logistics')) {
      detectedRole = 'LogisticsManager';
      fullName = 'Resource & Logistics Director';
    } else if (lowEmail.startsWith('volcoord') || lowEmail.startsWith('volunteercoord')) {
      detectedRole = 'VolunteerCoordinator';
      fullName = 'Volunteer Mobilization Lead';
    } else if (lowEmail.startsWith('donor')) {
      detectedRole = 'Donor';
      fullName = 'Aid Funding & Donor Officer';
    } else if (lowEmail.startsWith('partner')) {
      detectedRole = 'PartnerOfficer';
      fullName = 'UN / Red Cross Partner Officer';
    } else if (lowEmail.startsWith('volunteer')) {
      detectedRole = 'Volunteer';
      fullName = 'Field Response Volunteer';
    } else if (lowEmail.startsWith('citizen')) {
      detectedRole = 'Citizen';
      fullName = 'Affected Citizen';
    }

    return {
      token: 'mock-jwt-token-active-session',
      userId: `u-${detectedRole.toLowerCase()}-1`,
      email: email || mockUser.email,
      fullName: fullName,
      role: detectedRole,
      expiresIn: 86400,
    };
  },

  async register(data: any): Promise<AuthResponse> {
    const roleNum = Number(data.role);
    let resolvedRole: UserRole = 'Citizen';
    if (roleNum === 2) resolvedRole = 'Coordinator';
    else if (roleNum === 3) resolvedRole = 'Volunteer';
    else if (roleNum === 4) resolvedRole = 'Donor';
    else if (roleNum === 5) resolvedRole = 'Admin';
    else if (roleNum === 6) resolvedRole = 'CaseManager';
    else if (roleNum === 7) resolvedRole = 'LogisticsManager';
    else if (roleNum === 8) resolvedRole = 'ShelterAdmin';
    else if (roleNum === 9) resolvedRole = 'VolunteerCoordinator';
    else if (roleNum === 10) resolvedRole = 'PartnerOfficer';

    return {
      token: 'mock-jwt-token-new-reg',
      userId: `u-reg-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: resolvedRole,
      expiresIn: 86400,
    };
  },

  async getCurrentUser(): Promise<User> {
    try {
      const saved = localStorage.getItem('sahaya_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default
    }
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

  async getCrisisEvents(_activeOnly?: boolean): Promise<CrisisEvent[]> {
    return this.getIncidents();
  },

  async createCrisisEvent(data: any): Promise<CrisisEvent> {
    return this.createIncident(data);
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
      totalRequests: mockRequests.length,
      pendingRequests: mockRequests.filter((r) => r.status === 'Pending' || r.status === 'Submitted').length,
      pendingRequestsCount: mockRequests.filter((r) => r.status === 'Pending' || r.status === 'Submitted').length,
      approvedRequests: mockRequests.filter((r) => r.status === 'Approved').length,
      assignedRequestsCount: mockRequests.filter((r) => r.status === 'Assigned').length,
      inProgressRequestsCount: mockRequests.filter((r) => r.status === 'InProgress').length,
      resolvedRequestsCount: 142,
      criticalRequests: 18,
      criticalUrgencyCount: 18,
      activeIncidents: mockIncidents.length,
      totalShelters: mockShelters.length,
      availableCapacity: 850,
      totalVolunteers: 65,
      activeVolunteers: 42,
      lowStockResourcesCount: mockResources.filter((r) => r.isLowStock).length,
      recentRequests: mockRequests,
      activeEvents: mockIncidents,
      activeCrisisEvents: mockIncidents,
      topNeededResources: [
        { resourceName: 'Bottled Water', totalRequested: 2400, totalAvailable: 1250, shortage: 1150 },
        { resourceName: 'Dry Ration Packs', totalRequested: 1800, totalAvailable: 4800, shortage: 0 },
      ],
      aiTriageQueueCount: 5,
    };
  },

  // Shelters
  async getShelters(_activeOnly?: boolean): Promise<Shelter[]> {
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
    const res = mockResources.find((r) => r.id === data.resourceId);
    if (res) {
      const qty = Number(data.quantityAllocated || data.quantity || 0);
      res.availableQuantity = Math.max(0, res.availableQuantity - qty);
      res.allocatedQuantity = (res.allocatedQuantity || 0) + qty;
      res.isLowStock = res.availableQuantity <= res.lowStockThreshold;
    }
    return {
      id: `alloc-${Date.now()}`,
      resourceId: data.resourceId,
      assistanceRequestId: data.assistanceRequestId,
      quantityAllocated: data.quantityAllocated || data.quantity,
      allocatedAt: new Date().toISOString(),
      allocatedByEmail: 'coordinator@sahaya.lk',
      status: 'Dispatched',
    };
  },

  // Partner Assistance Requests (External Inter-Agency Requisitions)
  async getPartnerRequests(): Promise<PartnerRequest[]> {
    return mockPartnerRequests;
  },

  async createPartnerRequest(data: Omit<PartnerRequest, 'id' | 'status' | 'requestedAt'>): Promise<PartnerRequest> {
    const newReq: PartnerRequest = {
      ...data,
      id: `pr-${Date.now()}`,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
    };
    mockPartnerRequests.unshift(newReq);
    return newReq;
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
    return mockVolunteers;
  },

  async getVolunteerProfile(_id: string): Promise<VolunteerProfile> {
    return (await this.getVolunteers())[0];
  },

  async updateVolunteerAvailability(_isAvailable: boolean): Promise<void> {},

  async getVolunteerTasks(): Promise<VolunteerTask[]> {
    return mockVolunteerTasks;
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
    try {
      const res = await fetch('/api/v1/notifications');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch {
      // Fallback to local mock notifications
    }
    return [...mockNotificationsList];
  },

  async markNotificationRead(id: string): Promise<void> {
    try {
      await fetch(`/api/v1/notifications/${id}/read`, { method: 'POST' });
    } catch {
      // Fallback
    }
    const item = mockNotificationsList.find((n) => n.id === id);
    if (item) {
      item.isRead = true;
    }
  },

  async markAllNotificationsRead(): Promise<void> {
    try {
      await fetch('/api/v1/notifications/read-all', { method: 'POST' });
    } catch {
      // Fallback
    }
    mockNotificationsList.forEach((n) => {
      n.isRead = true;
    });
  },

  async broadcastAlert(data: any): Promise<void> {
    try {
      await fetch('/api/v1/notifications/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Fallback
    }
    mockNotificationsList.unshift({
      id: `notif-${Date.now()}`,
      title: data.title || 'Emergency Broadcast Alert',
      message: data.message || '',
      type: data.type || 'EmergencyAlert',
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  },

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
    return mockShelters.map((s) => {
      const cap = s.totalCapacity || s.capacity || 1;
      return {
        shelterId: s.id,
        shelterName: s.name,
        totalCapacity: cap,
        currentOccupancy: s.currentOccupancy,
        occupancyRate: Math.round((s.currentOccupancy / cap) * 100),
        status: s.status,
      };
    });
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

  // AI Chat Assistant
  async sendAIChat(
    message: string,
    language: string = 'en',
    requestContextId?: string
  ): Promise<{ reply: string; isFromFallback?: boolean; quickSuggestions?: string[] }> {
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language, requestContextId }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          reply: data.reply || data.message,
          isFromFallback: data.isFromFallback ?? false,
          quickSuggestions: data.quickSuggestions || [],
        };
      }
    } catch {
      // Backend unavailable; seamlessly switch to local intelligent Rule-Based NLP engine
    }

    const lower = message.toLowerCase();
    const isSi = language === 'si';

    if (
      lower.includes('shelter') ||
      lower.includes('stay') ||
      lower.includes('sleep') ||
      lower.includes('evacuat') ||
      lower.includes('කඳවුර') ||
      lower.includes('නවාතැන්') ||
      lower.includes('ඉන්න තැනක්')
    ) {
      return {
        reply: isSi
          ? 'SAHAYA පද්ධතිය සක්‍රීය සහන කඳවුරු, පානීය ජලය සහ වෛද්‍ය පහසුකම් පිළිබඳ තොරතුරු සජීවීව පවත්වාගෙන යයි. අපගේ Interactive Map එකෙන් හෝ "Submit Request" හරහා ආරක්ෂිත කඳවුරක් ඉල්ලා සිටිය හැක. ජීවිත අවදානමක් ඇත්නම් වහාම ආරක්ෂිත උස් ස්ථාන කරා යොමුවන්න.'
          : 'SAHAYA maintains real-time records of active emergency shelters with verified water, medical bays, and capacity. You can view all nearby shelters on our interactive map or request emergency shelter through the Submit Request portal. If in immediate danger, head to designated community refuge centers.',
        isFromFallback: true,
        quickSuggestions: isSi
          ? ['ළඟම තියෙන කඳවුර කොහෙද?', 'කඳවුරක් ඉල්ලන්නේ කොහොමද?', 'කඳවුරුවල කෑම තියෙනවද?']
          : ['Where is the nearest shelter?', 'How do I request shelter?', 'Is food provided at shelters?'],
      };
    }

    if (
      lower.includes('medic') ||
      lower.includes('injur') ||
      lower.includes('doctor') ||
      lower.includes('bleed') ||
      lower.includes('hospital') ||
      lower.includes('බෙහෙත්') ||
      lower.includes('තුවාල') ||
      lower.includes('දොස්තර') ||
      lower.includes('රෝහල')
    ) {
      return {
        reply: isSi
          ? 'ජීවිත අවදානම් සහිත හදිසි අවස්ථාවලදී කරුණාකර ජාතික හදිසි ගිලන්රථ සේවාව (1990 සුවසැරිය) හෝ පොලිස් හදිසි ඇමතුම් (119) වහාම අමතන්න. SAHAYA හරහා Critical මට්ටමේ "Medical Assistance" ඉල්ලීමක් යොමු කිරීමෙන් Coordinator කණ්ඩායම් ක්ෂණිකව ක්‍රියාත්මක වේ.'
          : 'For life-threatening medical emergencies, please call national emergency services immediately (119 / 1990). Within SAHAYA, submit a Medical Assistance request marked Critical to trigger immediate coordinator review and mobile clinic dispatch.',
        isFromFallback: true,
        quickSuggestions: isSi
          ? ['හදිසි වෛද්‍ය ආධාර ඉල්ලන්න', 'ළඟම වෛද්‍ය මධ්‍යස්ථානය', 'හදිසි දුරකථන අංක']
          : ['Request medical aid', 'Locate emergency clinic', 'Emergency hotline numbers'],
      };
    }

    if (
      lower.includes('food') ||
      lower.includes('water') ||
      lower.includes('ration') ||
      lower.includes('hungry') ||
      lower.includes('කෑම') ||
      lower.includes('ආහාර') ||
      lower.includes('වතුර') ||
      lower.includes('බීමට ජලය')
    ) {
      return {
        reply: isSi
          ? 'ආපදාවට ලක්වූ ප්‍රදේශ සඳහා හදිසි ආහාර සලාක සහ පිරිසිදු පානීය ජලය බෙදාහැරීම ක්‍රියාත්මක වේ. පුරවැසියන්ට තම පවුලේ සාමාජික ගණන ඇතුළත් කර සහන ඉල්ලීමක් ඉදිරිපත් කිරීමෙන් සලාක ලබාගැනීමේ ටෝකන් හෝ බෙදාහැරීම් ලබාගත හැක.'
          : 'Emergency food rations and clean drinking water containers are being coordinated across active disaster zones. Citizens can register their household and affected headcount to receive scheduled drop-offs or pick-up tokens from community distribution centers.',
        isFromFallback: true,
        quickSuggestions: isSi
          ? ['ආහාර සලාක ඉල්ලන්න', 'ජලය බෙදාහරින ස්ථාන', 'ඉල්ලීමේ තත්ත්වය පරීක්ෂා කරන්න']
          : ['Request food rations', 'Find water distribution point', 'Check request status'],
      };
    }

    if (
      lower.includes('volunteer') ||
      lower.includes('help') ||
      lower.includes('join') ||
      lower.includes('ස්වේච්ඡා') ||
      lower.includes('උදව් කරන්න')
    ) {
      return {
        reply: isSi
          ? 'උදව් කිරීමට ඉදිරිපත් වීම පිළිබඳව ස්තූතියි! ලියාපදිංචි ස්වේච්ඡා සේවකයන්ට ප්‍රථමාධාර, සෙවීම් සහ මුදාගැනීම් (Search & Rescue), ප්‍රවාහන ආදී ක්ෂේත්‍ර තෝරාගත හැක. අනුමත වූ පසු ඔබේ Dashboard එකට මෙහෙයුම් විස්තර ලැබෙනු ඇත.'
          : 'Thank you for your willingness to help! Registered volunteers can specify skills such as First Aid, Search & Rescue, Logistics, and Medical expertise. Once approved, coordinators dispatch mission tasks with geo-coordinates directly to your dashboard.',
        isFromFallback: true,
        quickSuggestions: isSi
          ? ['ස්වේච්ඡා සේවකයෙකු ලෙස ලියාපදිංචි වන්න', 'ක්‍රියාකාරී මෙහෙයුම් බලන්න']
          : ['Register as volunteer', 'View active tasks', 'Update availability'],
      };
    }

    if (
      lower.includes('donate') ||
      lower.includes('donation') ||
      lower.includes('money') ||
      lower.includes('fund') ||
      lower.includes('ආධාර') ||
      lower.includes('මුදල්')
    ) {
      return {
        reply: isSi
          ? 'දානපතියන්ට සහ ආයතන වලට නිශ්චිත ආපදා මෙහෙයුම් සඳහා මූල්‍යමය හෝ ද්‍රව්‍යමය (වියළි ආහාර, වතුර, බෙහෙත්) ආධාර ලබාදිය හැක. සෑම ආධාරයක්ම විනිවිදභාවයෙන් යුතුව ලුහුබැඳිය හැක.'
          : 'Donors can support specific crisis campaigns through monetary aid or in-kind supplies (clean water, medical packs, dry rations). Every allocation is logged and tracked transparently on SAHAYA.',
        isFromFallback: true,
        quickSuggestions: isSi
          ? ['සක්‍රීය ආධාර ව්‍යාපාර', 'මුදල් ආධාර කරන්න', 'ද්‍රව්‍ය ආධාර ලබාදෙන්න']
          : ['Active disaster campaigns', 'Record monetary donation', 'Donate supplies in-kind'],
      };
    }

    return {
      reply: isSi
        ? 'ආයුබෝවන්! මම SAHAYA AI සහායකයා වෙමි. සහන ඉල්ලීම් ඉදිරිපත් කිරීම, ආරක්ෂිත කඳවුරු සෙවීම, ආහාර/වතුර සහන ලබාගැනීම හෝ ස්වේච්ඡා සේවයට එක්වීම සඳහා මට ඔබට මඟපෙන්විය හැක. මට ඔබට උදව් කළ හැක්කේ කෙසේද?'
        : 'Hello! I am SAHAYA AI Assistant. I can help guide you through submitting assistance requests, finding verified shelters, checking distribution hubs, or connecting with emergency coordinators and volunteers. How can I assist you right now?',
      isFromFallback: true,
      quickSuggestions: isSi
        ? ['ළඟම කඳවුර කොහෙද?', 'හදිසි ආහාර සලාක ඉල්ලන්නේ කොහොමද?', 'හදිසි ඇමතුම් අංක', 'ස්වේච්ඡා සේවයට එක්වන්න']
        : ['Where is the nearest shelter?', 'How do I request emergency food rations?', 'Emergency hotline contacts', 'Register as a volunteer'],
    };
  },

  // AI Decision Review
  async reviewAIRecommendation(recommendationId: string, data: any): Promise<any> {
    const req = mockRequests.find((r) => r.latestRecommendation?.id === recommendationId);
    if (req && req.latestRecommendation) {
      req.latestRecommendation.reviewStatus =
        data.reviewStatus === 1 ? 'Accepted' : data.reviewStatus === 2 ? 'Overridden' : 'Rejected';
      if (data.overrideReason) req.latestRecommendation.overrideReason = data.overrideReason;
      if (data.notes) req.latestRecommendation.officerDecision = data.notes;
    }
    return { success: true };
  },

  // Donor shortcuts
  async getMyDonations(): Promise<Donation[]> {
    return this.getDonations();
  },

  // Requests
  async getRequestById(id: string): Promise<AssistanceRequest> {
    return this.getRequest(id);
  },

  async reviewRequest(id: string, data: any): Promise<any> {
    const req = mockRequests.find((r) => r.id === id);
    if (req) {
      req.status = data.status || req.status;
    }
    return { success: true, request: req };
  },

  async cancelRequest(id: string, _reason?: string): Promise<any> {
    const req = mockRequests.find((r) => r.id === id);
    if (req) {
      req.status = 'Cancelled';
    }
    return { success: true };
  },

  // Volunteers
  async getMyVolunteerProfile(): Promise<VolunteerProfile> {
    return mockVolunteers[0];
  },

  async getMyVolunteerTasks(): Promise<VolunteerTask[]> {
    return mockVolunteerTasks;
  },

  async getAvailableVolunteerTasks(): Promise<VolunteerTask[]> {
    return mockVolunteerTasks.filter((t: VolunteerTask) => t.status === 'Assigned');
  },

  async updateVolunteerTaskStatus(taskId: string, status: any, notes?: string): Promise<any> {
    const task = mockVolunteerTasks.find((t: VolunteerTask) => t.id === taskId);
    if (task) {
      task.status = status;
      if (notes) task.notes = notes;
    }
    return { success: true, task };
  },

  async acceptVolunteerTask(taskId: string): Promise<any> {
    return this.updateVolunteerTaskStatus(taskId, 'Accepted');
  },

  async assignVolunteerTask(dataOrTaskId: any, volunteerId?: string): Promise<any> {
    const taskId = typeof dataOrTaskId === 'string' ? dataOrTaskId : dataOrTaskId?.taskId || 'task-1';
    const vId = typeof dataOrTaskId === 'string' ? volunteerId : dataOrTaskId?.volunteerProfileId;
    const task = mockVolunteerTasks.find((t: VolunteerTask) => t.id === taskId);
    if (task && vId) {
      task.volunteerProfileId = vId;
      task.status = 'Assigned';
    }
    return { success: true, task };
  },
};
