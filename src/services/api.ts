import {
  AuthResponse,
  User,
  AssistanceRequest,
  RequestStatusHistory,
  CrisisEvent,
  CoordinatorDashboardData,
  AIRecommendation,
  Resource,
  ResourceCategory,
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
  PartnerRequest,
  ShelterSupplyRequest
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

const loadStored = <T>(key: string, fallback: T[]): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { }
  return [...fallback];
};

const saveStored = <T>(key: string, data: T[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { }
};

const initialRequests: AssistanceRequest[] = [
  {
    id: 'req-1',
    citizenId: 'cit-1',
    citizenName: 'Kavinda Fernando',
    citizenPhone: '+94 71 889 2211',
    title: 'Clean Drinking Water & Rooftop Evacuation',
    category: 'DrinkingWater' as RequestCategory,
    urgency: 'Immediate' as RequestUrgency,
    description: 'Drinking water contamination. 14 families stranded on upper rooftop of temple.',
    location: 'Sedawatta, Wellampitiya',
    address: 'Sedawatta, Wellampitiya',
    latitude: 6.942,
    longitude: 79.887,
    peopleCount: 45,
    affectedCount: 45,
    status: 'Submitted' as RequestStatus,
    statusHistory: [],
    latestRecommendation: {
      id: 'ai-rec-req-1',
      assistanceRequestId: 'req-1',
      suggestedCategory: 'DrinkingWater',
      predictedCategory: 'DrinkingWater',
      suggestedUrgency: 'Critical',
      suggestedPriority: 'Critical',
      confidenceScore: 0.94,
      explanation: 'High-density stranded group (45 people) near Kelani flood surge with contaminated water supply.',
      suggestedResources: ['Clean Water Purification Packs (5L)', 'Inflatable Life Rafts & Life Jackets'],
      reviewStatus: 'Pending',
      status: 'Pending',
      createdAt: '2026-11-19T06:31:00Z',
    },
    createdAt: '2026-11-19T06:30:00Z',
  },
  {
    id: 'req-2',
    citizenId: 'cit-2',
    citizenName: 'Nimali Wickramasinghe',
    citizenPhone: '+94 77 452 9901',
    title: 'Emergency Shelter Placement - Family Displaced',
    category: 'EmergencyShelter' as RequestCategory,
    urgency: 'Critical' as RequestUrgency,
    description: 'Ground floor flooded to 4 feet. Family of 5 including 2 elders needs immediate safe camp placement.',
    location: 'Biyagama Rd, Kelaniya',
    address: 'Biyagama Rd, Kelaniya',
    latitude: 6.954,
    longitude: 79.918,
    peopleCount: 5,
    affectedCount: 5,
    status: 'Approved' as RequestStatus,
    statusHistory: [],
    latestRecommendation: {
      id: 'ai-rec-req-2',
      assistanceRequestId: 'req-2',
      suggestedCategory: 'EmergencyShelter',
      predictedCategory: 'EmergencyShelter',
      suggestedUrgency: 'Critical',
      suggestedPriority: 'Critical',
      confidenceScore: 0.91,
      explanation: 'Vulnerable elderly individuals displaced by rising floodwaters; immediate shelter bed allocation advised.',
      suggestedResources: ['Emergency Shelter Placement', 'Dry Bedding'],
      reviewStatus: 'Accepted',
      status: 'Accepted',
      createdAt: '2026-11-19T07:16:00Z',
    },
    createdAt: '2026-11-19T07:15:00Z',
  },
  {
    id: 'req-3',
    citizenId: 'cit-3',
    citizenName: 'Sunil Shantha',
    citizenPhone: '+94 75 112 3344',
    title: 'Dry Rations for Elderly Care Hall',
    category: 'Food' as RequestCategory,
    urgency: 'High' as RequestUrgency,
    description: 'Dry rations needed for elderly care home evacuated to community hall.',
    location: 'Biyagama Central',
    address: 'Biyagama Central',
    latitude: 6.948,
    longitude: 79.992,
    peopleCount: 30,
    affectedCount: 30,
    status: 'InProgress' as RequestStatus,
    statusHistory: [],
    latestRecommendation: {
      id: 'ai-rec-req-3',
      assistanceRequestId: 'req-3',
      suggestedCategory: 'Food',
      predictedCategory: 'Food',
      suggestedUrgency: 'High',
      suggestedPriority: 'High',
      confidenceScore: 0.88,
      explanation: '30 elderly evacuees require sustained dry food rations.',
      suggestedResources: ['Emergency High-Energy Biscuit Rations'],
      reviewStatus: 'Accepted',
      status: 'Accepted',
      createdAt: '2026-11-19T08:01:00Z',
    },
    createdAt: '2026-11-19T08:00:00Z',
  },
];

const mockRequests: AssistanceRequest[] = loadStored('sahaya_requests', initialRequests);

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
    waterStockLiters: 2400,
    foodRationBoxes: 800,
    medicalKitPacks: 25,
    lastStockAuditAt: '2026-11-25T18:00:00Z',
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
    waterStockLiters: 900,
    foodRationBoxes: 450,
    medicalKitPacks: 10,
    lastStockAuditAt: '2026-11-25T17:30:00Z',
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
    waterStockLiters: 3500,
    foodRationBoxes: 1200,
    medicalKitPacks: 40,
    lastStockAuditAt: '2026-11-25T16:00:00Z',
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
    waterStockLiters: 2800,
    foodRationBoxes: 950,
    medicalKitPacks: 30,
    lastStockAuditAt: '2026-11-25T15:00:00Z',
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
    waterStockLiters: 5500,
    foodRationBoxes: 2200,
    medicalKitPacks: 65,
    lastStockAuditAt: '2026-11-25T18:30:00Z',
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

const mockAllocations: ResourceAllocation[] = [
  {
    id: 'alloc-101',
    resourceId: 'res-1',
    resourceName: 'Clean Water Purification Packs (5L)',
    category: 'DrinkingWater',
    unit: 'Packs',
    assistanceRequestId: 'req-1',
    requestTitle: 'Clean Drinking Water & Rooftop Evacuation',
    recipientName: 'Kavinda Fernando',
    destinationLocation: 'Sedawatta, Wellampitiya',
    quantityAllocated: 50,
    quantity: 50,
    allocatedByEmail: 'logistics@sahaya.org',
    status: 'Delivered',
    allocatedAt: '2026-11-20T08:30:00Z',
    dispatchedAt: '2026-11-20T09:15:00Z',
    notes: 'Delivered via Navy rescue boat convoy. Handed over to Sedawatta temple relief center.'
  },
  {
    id: 'alloc-102',
    resourceId: 'res-2',
    resourceName: 'Emergency High-Energy Biscuit Rations',
    category: 'Food',
    unit: 'Boxes',
    assistanceRequestId: 'req-1',
    requestTitle: 'Clean Drinking Water & Rooftop Evacuation',
    recipientName: 'Kavinda Fernando',
    destinationLocation: 'Sedawatta, Wellampitiya',
    quantityAllocated: 100,
    quantity: 100,
    allocatedByEmail: 'logistics@sahaya.org',
    status: 'Delivered',
    allocatedAt: '2026-11-20T09:00:00Z',
    dispatchedAt: '2026-11-20T09:45:00Z',
    notes: 'High-energy biscuit distribution for 14 stranded families.'
  },
  {
    id: 'alloc-103',
    resourceId: 'res-3',
    resourceName: 'Inflatable Life Rafts & Life Jackets',
    category: 'LogisticsEquipment',
    unit: 'Sets',
    assistanceRequestId: 'req-2',
    requestTitle: 'Emergency Shelter Placement - Family Displaced',
    recipientName: 'Nimali Wickramasinghe',
    destinationLocation: 'Biyagama Rd, Kelaniya',
    quantityAllocated: 4,
    quantity: 4,
    allocatedByEmail: 'logistics@sahaya.org',
    status: 'Delivered',
    allocatedAt: '2026-11-21T06:00:00Z',
    dispatchedAt: '2026-11-21T06:30:00Z',
    notes: 'Field rescue dispatch to safely evacuate elderly flood victims.'
  },
  {
    id: 'alloc-104',
    resourceId: 'res-4',
    resourceName: 'Emergency Trauma Medical Kits & Antiseptics',
    category: 'MedicalSupplies',
    unit: 'Kits',
    assistanceRequestId: 'req-4',
    requestTitle: 'Emergency Insulin & Medical Aid for Elderly Mother',
    recipientName: 'Sunil Perera',
    destinationLocation: 'Kaduwela Junction, Colombo District',
    quantityAllocated: 15,
    quantity: 15,
    allocatedByEmail: 'logistics@sahaya.org',
    status: 'InTransit',
    allocatedAt: '2026-11-22T10:15:00Z',
    dispatchedAt: '2026-11-22T10:45:00Z',
    notes: 'Paramedic vehicle #WP-CAD-4029 en route to Kaduwela relief post.'
  },
  {
    id: 'alloc-105',
    resourceId: 'res-1',
    resourceName: 'Clean Water Purification Packs (5L)',
    category: 'DrinkingWater',
    unit: 'Packs',
    assistanceRequestId: 'req-5',
    requestTitle: 'Baby Food and Clean Drinking Water Needed',
    recipientName: 'Fathima Rizna',
    destinationLocation: 'Malwana, Gampaha District',
    quantityAllocated: 30,
    quantity: 30,
    allocatedByEmail: 'logistics@sahaya.org',
    status: 'Dispatched',
    allocatedAt: '2026-11-23T14:20:00Z',
    dispatchedAt: '2026-11-23T14:50:00Z',
    notes: 'Dispatched from Depot A via Army light transport truck.'
  },
  {
    id: 'alloc-106',
    resourceId: 'res-6',
    resourceName: 'Family Hygiene & Sanitation Emergency Packs',
    category: 'Sanitation',
    unit: 'Packs',
    assistanceRequestId: 'req-2',
    requestTitle: 'Emergency Shelter Placement - Family Displaced',
    recipientName: 'Nimali Wickramasinghe',
    destinationLocation: 'Kelaniya Maha Vidyalaya Safe Camp',
    quantityAllocated: 25,
    quantity: 25,
    allocatedByEmail: 'logistics@sahaya.org',
    status: 'Delivered',
    allocatedAt: '2026-11-24T08:00:00Z',
    dispatchedAt: '2026-11-24T08:30:00Z',
    notes: 'Distributed directly at safe camp intake counter.'
  }
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

const mockShelterSupplyRequests: ShelterSupplyRequest[] = [
  {
    id: 'ssr-1',
    shelterId: 'sh-1',
    shelterName: 'Kelaniya Maha Vidyalaya Safe Camp',
    category: 'DrinkingWater',
    itemName: 'Clean Water Purification Packs (5L)',
    quantityRequested: 150,
    unit: 'Packs',
    urgency: 'Critical',
    justification: 'Camp water main contaminated by Kelani surge. 420 displaced persons on site.',
    sourceDepot: 'Depot A - Kelaniya, Gampaha District',
    status: 'Dispatched',
    requestedAt: '2026-11-24T09:00:00Z',
    requestedBy: 'Shelter Lead Officer (Kelaniya)'
  },
  {
    id: 'ssr-2',
    shelterId: 'sh-2',
    shelterName: 'Ratnapura Town Hall Relief Centre',
    category: 'Food',
    itemName: 'Emergency High-Energy Biscuit Rations',
    quantityRequested: 400,
    unit: 'Boxes',
    urgency: 'High',
    justification: 'Shelter reached 85% capacity with newly evacuated landslide families.',
    sourceDepot: 'Ratnapura Central Relief Depot, Sabaragamuwa Province',
    status: 'Approved',
    requestedAt: '2026-11-24T14:30:00Z',
    requestedBy: 'Shelter Officer (Ratnapura)'
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

const initialDefaultUsers: UserSummary[] = [
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
  {
    id: 'u-pending-1',
    fullName: 'Ravi Sandaruwan',
    email: 'ravi.sandaruwan@slrcs.org',
    role: 'PartnerOfficer',
    isActive: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'u-pending-2',
    fullName: 'Dr. Tharaka Mendis',
    email: 't.mendis@health.gov.lk',
    role: 'ShelterAdmin',
    isActive: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 80).toISOString(),
  },
];

const initialDefaultNotifications: NotificationItem[] = [
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

const getStoredNotifications = (): NotificationItem[] => {
  try {
    const stored = localStorage.getItem('sahaya_notifications_v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch { }
  return [...initialDefaultNotifications];
};

const saveStoredNotifications = (notifications: NotificationItem[]) => {
  try {
    localStorage.setItem('sahaya_notifications_v1', JSON.stringify(notifications));
  } catch { }
};

let mockNotificationsList: NotificationItem[] = getStoredNotifications();

const getStoredUsers = (): UserSummary[] => {
  try {
    const stored = localStorage.getItem('sahaya_registered_users');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch { }
  return [...initialDefaultUsers];
};

const saveStoredUsers = (users: UserSummary[]) => {
  try {
    localStorage.setItem('sahaya_registered_users', JSON.stringify(users));
  } catch { }
};

export const api = {
  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const lowEmail = (email || '').toLowerCase().trim();
    const cleanPass = (password || '').trim();

    // Valid demo credentials for testing
    const demoCredentials: Record<string, { pass: string; role: UserRole; name: string }> = {
      'admin@sahaya.org': { pass: 'Admin@123', role: 'Admin', name: 'Operational System Administrator' },
      'admin@sahaya.lk': { pass: 'Admin@123', role: 'Admin', name: 'National Command Admin' },
      'coordinator@sahaya.org': { pass: 'Coordinator@123', role: 'Coordinator', name: 'Chief Emergency Coordinator' },
      'casemanager@sahaya.org': { pass: 'Case@123', role: 'CaseManager', name: 'Senior Incident Case Manager' },
      'logistics@sahaya.org': { pass: 'Logistics@123', role: 'LogisticsManager', name: 'Resource & Logistics Director' },
      'shelteradmin@sahaya.org': { pass: 'Shelter@123', role: 'ShelterAdmin', name: 'Camp & Shelter Administrator' },
      'volunteercoord@sahaya.org': { pass: 'VolCoord@123', role: 'VolunteerCoordinator', name: 'Volunteer Mobilization Lead' },
      'donor@sahaya.org': { pass: 'Donor@123', role: 'Donor', name: 'Aid Funding & Donor Officer' },
      'partner@sahaya.org': { pass: 'Partner@123', role: 'PartnerOfficer', name: 'UN / Red Cross Partner Officer' },
      'citizen@sahaya.org': { pass: 'Citizen@123', role: 'Citizen', name: 'Affected Citizen' },
      'volunteer@sahaya.org': { pass: 'Volunteer@123', role: 'Volunteer', name: 'Field Response Volunteer' },
    };

    // 1. Check registered users in storage
    const allUsers = getStoredUsers();
    const existing = allUsers.find((u) => u.email.toLowerCase() === lowEmail);
    if (existing) {
      // In simulated mock, if a password was provided, verify it isn't completely empty
      if (!cleanPass) {
        throw new Error('Please enter a valid password.');
      }
      return {
        token: 'mock-jwt-token-active-session',
        userId: existing.id,
        email: existing.email,
        fullName: existing.fullName,
        role: existing.role,
        expiresIn: 86400,
      };
    }

    // 2. Check official demo accounts
    const demo = demoCredentials[lowEmail];
    if (demo) {
      if (cleanPass !== demo.pass) {
        throw new Error('Invalid password for this official demo account.');
      }
      return {
        token: 'mock-jwt-token-active-session',
        userId: `u-demo-${demo.role.toLowerCase()}`,
        email: lowEmail,
        fullName: demo.name,
        role: demo.role,
        expiresIn: 86400,
      };
    }

    // 3. Reject any unregistered or fake accounts
    throw new Error('No registered account found with this email. Please check your credentials or create an account first.');
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

    // Official staff roles require Administrator verification
    const isPublicRole = resolvedRole === 'Citizen' || resolvedRole === 'Donor';
    const isActive = isPublicRole;

    const newUser: UserSummary = {
      id: `u-reg-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: resolvedRole,
      isActive: isActive,
      createdAt: new Date().toISOString(),
    };

    // Save to persisted stored users
    const allUsers = getStoredUsers();
    allUsers.unshift(newUser);
    saveStoredUsers(allUsers);

    return {
      token: 'mock-jwt-token-new-reg',
      userId: newUser.id,
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
          // Sync with stored users in case status was updated by admin
          const allUsers = getStoredUsers();
          const found = allUsers.find(
            (u) => u.email.toLowerCase() === parsed.email.toLowerCase() || u.id === parsed.id
          );
          if (found) {
            parsed.isActive = found.isActive;
            parsed.role = found.role;
            localStorage.setItem('sahaya_user', JSON.stringify(parsed));
          }
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
  async getRequests(filters?: any): Promise<AssistanceRequest[]> {
    const list = loadStored('sahaya_requests', mockRequests);
    if (filters?.category) {
      const targetCat = String(filters.category).toLowerCase();
      return list.filter((r) => {
        const cat = String(r.category).toLowerCase();
        if (targetCat === 'emergencyshelter' || targetCat === 'shelter') {
          return cat === 'emergencyshelter' || cat === 'shelter';
        }
        return cat === targetCat;
      });
    }
    return list;
  },

  async getRequest(id: string): Promise<AssistanceRequest> {
    const list = loadStored('sahaya_requests', mockRequests);
    return list.find((r) => r.id === id) || list[0];
  },

  async createRequest(data: any): Promise<AssistanceRequest> {
    const catMap: Record<number, RequestCategory> = {
      1: 'Food',
      2: 'DrinkingWater',
      3: 'MedicalAssistance',
      4: 'EmergencyShelter',
      5: 'RescueTransport',
      6: 'Clothing',
      7: 'Sanitation',
      8: 'Other',
    };
    const urgMap: Record<number, RequestUrgency> = {
      1: 'Low',
      2: 'Medium',
      3: 'High',
      4: 'Critical',
    };

    const resolvedCat: RequestCategory =
      typeof data.category === 'number' ? catMap[data.category] || 'Other' : data.category || 'Other';
    const resolvedUrg: RequestUrgency =
      typeof data.urgency === 'number' ? urgMap[data.urgency] || 'Medium' : data.urgency || 'Medium';

    let currentCitizen = mockUser;
    try {
      const saved = localStorage.getItem('sahaya_user');
      if (saved) currentCitizen = JSON.parse(saved);
    } catch { }

    const reqId = `req-${Date.now()}`;
    const newReq: AssistanceRequest = {
      id: reqId,
      citizenId: currentCitizen.id || mockUser.id,
      citizenName: currentCitizen.fullName || mockUser.fullName,
      citizenPhone: data.contactPhone || currentCitizen.phoneNumber || mockUser.phoneNumber,
      title: data.title || `${resolvedCat} Assistance Request`,
      description: data.description || '',
      category: resolvedCat,
      urgency: resolvedUrg,
      location: data.address || data.location || 'Sri Lanka',
      address: data.address || data.location || 'Sri Lanka',
      latitude: Number(data.latitude || 6.9271),
      longitude: Number(data.longitude || 79.8612),
      peopleCount: Number(data.affectedCount || data.peopleCount || 1),
      affectedCount: Number(data.affectedCount || data.peopleCount || 1),
      specialNeeds: data.specialNeeds,
      crisisEventId: data.crisisEventId,
      status: 'Submitted',
      statusHistory: [
        {
          id: `h-init-${Date.now()}`,
          assistanceRequestId: reqId,
          fromStatus: 'Submitted',
          toStatus: 'Submitted',
          changedByEmail: currentCitizen.email || 'citizen@sahaya.org',
          changedAt: new Date().toISOString(),
          notes: 'Request submitted by citizen and queued for AI triage & coordinator review.',
        },
      ],
      latestRecommendation: {
        id: `ai-rec-${reqId}`,
        assistanceRequestId: reqId,
        suggestedCategory: resolvedCat,
        predictedCategory: resolvedCat,
        suggestedUrgency: resolvedUrg,
        suggestedPriority: resolvedUrg,
        confidenceScore: resolvedUrg === 'Critical' ? 0.93 : 0.87,
        explanation: `Automated triage classified as ${resolvedUrg} priority ${resolvedCat} support for ${data.affectedCount || 1} person(s) at ${data.address || 'reported sector'}.`,
        suggestedResources:
          resolvedCat === 'EmergencyShelter'
            ? ['Emergency Shelter Bed Placement', 'Dry Bedding']
            : resolvedCat === 'DrinkingWater'
              ? ['Clean Water Purification Packs (5L)']
              : ['Emergency High-Energy Biscuit Rations'],
        reviewStatus: 'Pending',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    const list = loadStored('sahaya_requests', mockRequests);
    list.unshift(newReq);
    saveStored('sahaya_requests', list);
    mockRequests.unshift(newReq);
    return newReq;
  },

  async updateRequestStatus(id: string, status: RequestStatus, note?: string): Promise<AssistanceRequest> {
    const list = loadStored('sahaya_requests', mockRequests);
    const req = list.find((r) => r.id === id);
    if (req) {
      const prev = req.status;
      req.status = status;
      if (!req.statusHistory) req.statusHistory = [];
      req.statusHistory.unshift({
        id: `h-${Date.now()}`,
        assistanceRequestId: req.id,
        fromStatus: prev,
        toStatus: status,
        changedByEmail: 'coordinator@sahaya.lk',
        changedAt: new Date().toISOString(),
        notes: note || `Status updated from ${prev} to ${status}.`,
      });
      saveStored('sahaya_requests', list);
    }
    return req || list[0];
  },

  async getRequestHistory(id: string): Promise<RequestStatusHistory[]> {
    const list = loadStored('sahaya_requests', mockRequests);
    const req = list.find((r) => r.id === id);
    if (req && req.statusHistory && req.statusHistory.length > 0) {
      return req.statusHistory;
    }
    return [
      {
        id: 'h-1',
        assistanceRequestId: id,
        fromStatus: 'Submitted',
        toStatus: req?.status || 'Assigned',
        changedByEmail: 'coordinator@sahaya.lk',
        changedAt: new Date().toISOString(),
        notes: 'Logged in national disaster coordination ledger.',
      },
    ];
  },

  async getMyRequests(): Promise<AssistanceRequest[]> {
    return loadStored('sahaya_requests', mockRequests);
  },

  // Coordinator Dashboard
  async getCoordinatorDashboard(): Promise<CoordinatorDashboardData> {
    const reqs = loadStored('sahaya_requests', mockRequests);
    const shlts = loadStored('sahaya_shelters', mockShelters);
    const resrcs = loadStored('sahaya_resources', mockResources);
    const incs = loadStored('sahaya_incidents', mockIncidents);
    return {
      totalRequests: reqs.length,
      pendingRequests: reqs.filter((r) => r.status === 'Pending' || r.status === 'Submitted').length,
      pendingRequestsCount: reqs.filter((r) => r.status === 'Pending' || r.status === 'Submitted').length,
      approvedRequests: reqs.filter((r) => r.status === 'Approved').length,
      assignedRequestsCount: reqs.filter((r) => r.status === 'Assigned').length,
      inProgressRequestsCount: reqs.filter((r) => r.status === 'InProgress').length,
      resolvedRequestsCount: reqs.filter((r) => r.status === 'Resolved').length + 142,
      criticalRequests: reqs.filter((r) => r.urgency === 'Critical' || r.urgency === 'Immediate').length,
      criticalUrgencyCount: reqs.filter((r) => r.urgency === 'Critical' || r.urgency === 'Immediate').length,
      activeIncidents: incs.length,
      totalShelters: shlts.length,
      availableCapacity: shlts.reduce((acc, s) => acc + (s.availableCapacity || 0), 0),
      totalVolunteers: 65,
      activeVolunteers: 42,
      lowStockResourcesCount: resrcs.filter((r) => r.isLowStock).length,
      recentRequests: reqs,
      activeEvents: incs,
      activeCrisisEvents: incs,
      topNeededResources: [
        { resourceName: 'Bottled Water', totalRequested: 2400, totalAvailable: 1250, shortage: 1150 },
        { resourceName: 'Dry Ration Packs', totalRequested: 1800, totalAvailable: 4800, shortage: 0 },
      ],
      aiTriageQueueCount: reqs.filter((r) => r.latestRecommendation?.reviewStatus === 'Pending').length,
    };
  },

  // Shelters
  async getShelters(_activeOnly?: boolean): Promise<Shelter[]> {
    try {
      const url = _activeOnly ? '/api/v1/shelters?activeOnly=true' : '/api/v1/shelters';
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const items = json.data || json;
        if (Array.isArray(items) && items.length > 0) {
          const mapped: Shelter[] = items.map((dto: any) => {
            const cap = Number(dto.totalCapacity || dto.capacity || 100);
            const statusVal = dto.status === 1 || dto.status === 'Full' ? 'Full' 
              : dto.status === 2 || dto.status === 'Closed' || dto.status === 'Inactive' ? 'Inactive' 
              : 'Active';
            return {
              id: String(dto.id),
              name: dto.name || 'Emergency Safe Haven',
              address: dto.address || '',
              latitude: Number(dto.latitude) || 6.9271,
              longitude: Number(dto.longitude) || 79.8612,
              totalCapacity: cap,
              capacity: cap,
              currentOccupancy: Number(dto.currentOccupancy) || 0,
              availableCapacity: dto.availableCapacity !== undefined ? Number(dto.availableCapacity) : Math.max(0, cap - (Number(dto.currentOccupancy) || 0)),
              facilities: Array.isArray(dto.facilities) && dto.facilities.length > 0 ? dto.facilities : ['Clean Water', 'Sanitation', 'First Aid'],
              accessibilityInfo: dto.accessibilityInfo || 'Ramp and ground floor access available',
              contactPhone: dto.contactPhone || '+94 11 234 5678',
              contactPerson: dto.contactPerson || 'Camp Administrator',
              status: statusVal,
              createdAt: dto.createdAtUtc || dto.createdAt || new Date().toISOString(),
              waterStockLiters: dto.waterStockLiters !== undefined ? Number(dto.waterStockLiters) : 2500,
              foodRationBoxes: dto.foodRationBoxes !== undefined ? Number(dto.foodRationBoxes) : 350,
              medicalKitPacks: dto.medicalKitPacks !== undefined ? Number(dto.medicalKitPacks) : 20,
              lastStockAuditAt: dto.lastStockAuditAtUtc || dto.lastStockAuditAt || new Date().toISOString(),
            };
          });
          saveStored('sahaya_shelters', mapped);
          return mapped;
        }
      }
    } catch {
      // Fallback to local stored data
    }
    return loadStored('sahaya_shelters', mockShelters);
  },

  async getShelter(id: string): Promise<Shelter> {
    try {
      const res = await fetch(`/api/v1/shelters/${id}`);
      if (res.ok) {
        const json = await res.json();
        const dto = json.data || json;
        if (dto && dto.id) {
          const cap = Number(dto.totalCapacity || dto.capacity || 100);
          return {
            id: String(dto.id),
            name: dto.name,
            address: dto.address,
            latitude: Number(dto.latitude),
            longitude: Number(dto.longitude),
            totalCapacity: cap,
            capacity: cap,
            currentOccupancy: Number(dto.currentOccupancy) || 0,
            availableCapacity: dto.availableCapacity !== undefined ? Number(dto.availableCapacity) : Math.max(0, cap - (Number(dto.currentOccupancy) || 0)),
            facilities: Array.isArray(dto.facilities) ? dto.facilities : ['Clean Water', 'Sanitation'],
            accessibilityInfo: dto.accessibilityInfo || '',
            contactPhone: dto.contactPhone || '',
            contactPerson: dto.contactPerson || '',
            status: dto.status === 1 || dto.status === 'Full' ? 'Full' : 'Active',
            createdAt: dto.createdAtUtc || new Date().toISOString(),
            waterStockLiters: Number(dto.waterStockLiters) || 0,
            foodRationBoxes: Number(dto.foodRationBoxes) || 0,
            medicalKitPacks: Number(dto.medicalKitPacks) || 0,
            lastStockAuditAt: dto.lastStockAuditAtUtc || new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fallback
    }
    const list = loadStored('sahaya_shelters', mockShelters);
    return list.find((s) => s.id === id) || list[0];
  },

  async createShelter(data: any): Promise<Shelter> {
    try {
      const cap = Number(data.capacity || data.totalCapacity || 50);
      const res = await fetch('/api/v1/shelters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          district: data.district || 'Colombo',
          latitude: Number(data.latitude) || 6.9271,
          longitude: Number(data.longitude) || 79.8612,
          totalCapacity: cap,
          contactPerson: data.contactPerson || 'Camp Coordinator',
          contactPhone: data.contactPhone || '+94 77 123 4567',
          facilities: Array.isArray(data.facilities) ? data.facilities : ['Clean Water', 'Sanitation'],
          accessibilityInfo: data.accessibilityInfo || 'Ground-level ramp available',
          isWheelchairAccessible: data.isWheelchairAccessible !== false,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const created = json.data || json;
        if (created && created.id) {
          const s: Shelter = {
            id: String(created.id),
            name: created.name,
            address: created.address,
            latitude: Number(created.latitude),
            longitude: Number(created.longitude),
            totalCapacity: cap,
            capacity: cap,
            currentOccupancy: 0,
            availableCapacity: cap,
            facilities: created.facilities || [],
            accessibilityInfo: created.accessibilityInfo || '',
            contactPhone: created.contactPhone || '',
            contactPerson: created.contactPerson || '',
            status: 'Active',
            createdAt: created.createdAtUtc || new Date().toISOString(),
            waterStockLiters: Number(created.waterStockLiters) || Math.max(cap * 4, 400),
            foodRationBoxes: Number(created.foodRationBoxes) || Math.max(cap * 2, 200),
            medicalKitPacks: Number(created.medicalKitPacks) || 15,
            lastStockAuditAt: new Date().toISOString(),
          };
          const list = loadStored('sahaya_shelters', mockShelters);
          list.unshift(s);
          saveStored('sahaya_shelters', list);
          return s;
        }
      }
    } catch {
      // Fallback
    }
    const list = loadStored('sahaya_shelters', mockShelters);
    const cap = Number(data.capacity || data.totalCapacity || 50);
    const s: Shelter = {
      id: `sh-${Date.now()}`,
      ...data,
      currentOccupancy: 0,
      availableCapacity: cap,
      totalCapacity: cap,
      capacity: cap,
      status: 'Active',
      waterStockLiters: data.waterStockLiters || Math.max(cap * 4, 400),
      foodRationBoxes: data.foodRationBoxes || Math.max(cap * 2, 200),
      medicalKitPacks: data.medicalKitPacks || 15,
      lastStockAuditAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    list.unshift(s);
    saveStored('sahaya_shelters', list);
    return s;
  },

  async updateShelter(id: string, data: any): Promise<Shelter> {
    try {
      const res = await fetch(`/api/v1/shelters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        const updated = json.data || json;
        if (updated && updated.id) {
          const list = loadStored('sahaya_shelters', mockShelters);
          const idx = list.findIndex((item) => item.id === id);
          if (idx !== -1) {
            list[idx] = { ...list[idx], ...data };
            saveStored('sahaya_shelters', list);
            return list[idx];
          }
        }
      }
    } catch {
      // Fallback
    }
    const list = loadStored('sahaya_shelters', mockShelters);
    const s = list.find((item) => item.id === id);
    if (s) {
      Object.assign(s, data);
      saveStored('sahaya_shelters', list);
    }
    return s || list[0];
  },

  async transferShelterStock(
    fromShelterId: string,
    toShelterId: string,
    waterLiters: number,
    foodBoxes: number,
    _notes?: string
  ): Promise<{ from: Shelter; to: Shelter }> {
    try {
      const res = await fetch(`/api/v1/shelters/${fromShelterId}/transfer-supplies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceShelterId: fromShelterId,
          targetShelterId: toShelterId,
          waterLiters,
          foodBoxes,
          medicalPacks: 0,
          notes: _notes || 'Inter-camp surplus redistribution',
        }),
      });
      if (res.ok) {
        // Refresh local cache with latest data
        await this.getShelters();
      }
    } catch {
      // Fallback
    }
    const list = loadStored('sahaya_shelters', mockShelters);
    const source = list.find((s) => s.id === fromShelterId);
    const target = list.find((s) => s.id === toShelterId);
    if (source && target) {
      if (waterLiters > 0) {
        source.waterStockLiters = Math.max(0, (source.waterStockLiters || 0) - waterLiters);
        target.waterStockLiters = (target.waterStockLiters || 0) + waterLiters;
      }
      if (foodBoxes > 0) {
        source.foodRationBoxes = Math.max(0, (source.foodRationBoxes || 0) - foodBoxes);
        target.foodRationBoxes = (target.foodRationBoxes || 0) + foodBoxes;
      }
      source.lastStockAuditAt = new Date().toISOString();
      target.lastStockAuditAt = new Date().toISOString();
      saveStored('sahaya_shelters', list);
    }
    return { from: source || list[0], to: target || list[1] };
  },

  async assignShelter(data: any): Promise<ShelterAssignment> {
    const assignedCount = Number(data.numberOfPeople || 1);
    try {
      const res = await fetch(`/api/v1/shelters/${data.shelterId}/assign-evacuees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assistanceRequestId: data.assistanceRequestId,
          headOfFamilyName: data.citizenName || 'Evacuee Family',
          numberOfPeople: assignedCount,
        }),
      });
      if (res.ok) {
        await this.getShelters();
      }
    } catch {
      // Fallback
    }
    const shelters = loadStored('sahaya_shelters', mockShelters);
    const shelter = shelters.find((s) => s.id === data.shelterId);

    if (shelter) {
      shelter.currentOccupancy = (shelter.currentOccupancy || 0) + assignedCount;
      shelter.availableCapacity = Math.max(0, (shelter.totalCapacity || shelter.capacity || 100) - shelter.currentOccupancy);
      if (shelter.availableCapacity === 0) {
        shelter.status = 'Full';
      }
      saveStored('sahaya_shelters', shelters);
    }

    // Link and update citizen's assistance request status to InProgress / Assigned
    if (data.assistanceRequestId) {
      const reqs = loadStored('sahaya_requests', mockRequests);
      const req = reqs.find((r) => r.id === data.assistanceRequestId);
      if (req) {
        const prev = req.status;
        req.status = 'InProgress' as RequestStatus;
        if (!req.statusHistory) req.statusHistory = [];
        req.statusHistory.unshift({
          id: `h-sh-${Date.now()}`,
          assistanceRequestId: req.id,
          fromStatus: prev,
          toStatus: 'InProgress',
          changedByEmail: 'shelteradmin@sahaya.org',
          changedAt: new Date().toISOString(),
          notes: `Evacuee (${assignedCount} person/s) allocated to ${shelter ? shelter.name : 'Safe Camp'}. Bed spaces confirmed.`
        });
        saveStored('sahaya_requests', reqs);
      }
    }

    return {
      id: `sha-${Date.now()}`,
      shelterId: data.shelterId,
      citizenId: data.citizenId || 'cit-1',
      assistanceRequestId: data.assistanceRequestId,
      numberOfPeople: assignedCount,
      assignedAt: new Date().toISOString(),
      status: 'Occupied',
    };
  },

  // Resources
  async getResources(): Promise<Resource[]> {
    const catMap: Record<number | string, ResourceCategory> = {
      0: 'Food',
      'Food': 'Food',
      1: 'DrinkingWater',
      'DrinkingWater': 'DrinkingWater',
      2: 'MedicalSupplies',
      'MedicalSupplies': 'MedicalSupplies',
      3: 'ShelterSupplies',
      'ShelterSupplies': 'ShelterSupplies',
      4: 'LogisticsEquipment',
      'LogisticsEquipment': 'LogisticsEquipment',
      5: 'Sanitation',
      'Sanitation': 'Sanitation',
      6: 'LogisticsEquipment',
      'RescueEquipment': 'LogisticsEquipment',
      7: 'LogisticsEquipment',
      'PowerAndEnergy': 'LogisticsEquipment',
    };

    try {
      const res = await fetch('/api/v1/resources/inventory');
      if (res.ok) {
        const json = await res.json();
        const items = json.data || json;
        if (Array.isArray(items) && items.length > 0) {
          const mapped: Resource[] = items.map((dto: any) => {
            const tot = Number(dto.totalQuantity) || 0;
            const avail = Number(dto.availableQuantity) || 0;
            const alloc = Number(dto.allocatedQuantity) || 0;
            const low = Number(dto.lowStockThreshold) || 20;
            return {
              id: String(dto.id),
              name: dto.name || 'Emergency Relief Item',
              category: catMap[dto.category] || 'Food',
              unit: dto.unit || 'Units',
              totalQuantity: tot,
              quantity: tot,
              availableQuantity: avail,
              allocatedQuantity: alloc,
              dispatchedQuantity: alloc,
              lowStockThreshold: low,
              storageLocation: dto.warehouseLocation || 'Central Logistics Depot - Colombo',
              warehouseLocation: dto.warehouseLocation || 'Central Logistics Depot - Colombo',
              expiryDate: dto.expiryDate || undefined,
              isActive: dto.status !== 2,
              isLowStock: dto.isLowStock !== undefined ? Boolean(dto.isLowStock) : avail <= low,
              createdAt: dto.lastReplenishedAtUtc || new Date().toISOString(),
            };
          });
          saveStored('sahaya_resources', mapped);
          return mapped;
        }
      }
    } catch {
      // Fallback
    }
    return loadStored('sahaya_resources', mockResources);
  },

  async getResource(id: string): Promise<Resource> {
    try {
      const res = await fetch(`/api/v1/resources/${id}`);
      if (res.ok) {
        const json = await res.json();
        const dto = json.data || json;
        if (dto && dto.id) {
          const tot = Number(dto.totalQuantity) || 0;
          const avail = Number(dto.availableQuantity) || 0;
          return {
            id: String(dto.id),
            name: dto.name,
            category: dto.category || 'Food',
            unit: dto.unit || 'Units',
            totalQuantity: tot,
            quantity: tot,
            availableQuantity: avail,
            allocatedQuantity: Number(dto.allocatedQuantity) || 0,
            dispatchedQuantity: Number(dto.allocatedQuantity) || 0,
            lowStockThreshold: Number(dto.lowStockThreshold) || 20,
            storageLocation: dto.warehouseLocation || 'Central Logistics Depot - Colombo',
            warehouseLocation: dto.warehouseLocation || 'Central Logistics Depot - Colombo',
            isActive: true,
            isLowStock: Boolean(dto.isLowStock),
            createdAt: dto.lastReplenishedAtUtc || new Date().toISOString(),
          };
        }
      }
    } catch {
      // Fallback
    }
    const list = loadStored('sahaya_resources', mockResources);
    return list.find((r) => r.id === id) || list[0];
  },

  async createResource(data: any): Promise<Resource> {
    const catNameToIndex: Record<string, number> = {
      'Food': 0,
      'DrinkingWater': 1,
      'MedicalSupplies': 2,
      'ShelterSupplies': 3,
      'LogisticsEquipment': 4,
      'Sanitation': 5,
      'RescueEquipment': 6,
      'PowerAndEnergy': 7,
    };

    try {
      const payload = {
        name: data.name,
        category: typeof data.category === 'number' ? data.category : (catNameToIndex[data.category] ?? 0),
        totalQuantity: Number(data.totalQuantity || data.quantity || 100),
        lowStockThreshold: Number(data.lowStockThreshold || 20),
        unit: data.unit || 'Units',
        warehouseLocation: data.storageLocation || data.warehouseLocation || 'Central Logistics Depot - Colombo',
      };

      const res = await fetch('/api/v1/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const created = json.data || json;
        if (created && created.id) {
          const r: Resource = {
            id: String(created.id),
            name: created.name,
            category: data.category || 'Food',
            unit: created.unit || 'Units',
            totalQuantity: Number(created.totalQuantity) || payload.totalQuantity,
            availableQuantity: Number(created.availableQuantity) || payload.totalQuantity,
            allocatedQuantity: 0,
            dispatchedQuantity: 0,
            lowStockThreshold: Number(created.lowStockThreshold) || payload.lowStockThreshold,
            storageLocation: created.warehouseLocation || payload.warehouseLocation,
            warehouseLocation: created.warehouseLocation || payload.warehouseLocation,
            isActive: true,
            isLowStock: false,
            createdAt: new Date().toISOString(),
          };
          const list = loadStored('sahaya_resources', mockResources);
          list.unshift(r);
          saveStored('sahaya_resources', list);
          return r;
        }
      }
    } catch {
      // Fallback
    }

    const catMap: Record<number, string> = {
      0: 'Food',
      1: 'DrinkingWater',
      2: 'MedicalSupplies',
      3: 'ShelterSupplies',
      4: 'LogisticsEquipment',
      5: 'Sanitation',
    };
    const list = loadStored('sahaya_resources', mockResources);
    const total = Number(data.totalQuantity || 100);
    const threshold = Number(data.lowStockThreshold || 20);
    const r: Resource = {
      id: `res-${Date.now()}`,
      ...data,
      category: typeof data.category === 'number' ? catMap[data.category] || 'Food' : data.category,
      quantity: total,
      totalQuantity: total,
      availableQuantity: total,
      allocatedQuantity: 0,
      dispatchedQuantity: 0,
      warehouseLocation: data.storageLocation || 'Central Relief Depot',
      isActive: true,
      isLowStock: total <= threshold,
      createdAt: new Date().toISOString(),
    };
    list.unshift(r);
    saveStored('sahaya_resources', list);
    return r;
  },

  async updateResource(id: string, data: any): Promise<Resource> {
    const list = loadStored('sahaya_resources', mockResources);
    const r = list.find((item) => item.id === id);
    if (r) {
      Object.assign(r, data);
      saveStored('sahaya_resources', list);
    }
    return r || list[0];
  },

  async allocateResource(data: any): Promise<ResourceAllocation> {
    const qty = Number(data.quantityAllocated || data.quantity || 0);
    try {
      const res = await fetch('/api/v1/resources/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceItemId: data.resourceId,
          assistanceRequestId: data.assistanceRequestId && data.assistanceRequestId.startsWith('req-') ? null : data.assistanceRequestId,
          targetShelterId: data.targetShelterId || null,
          allocatedQuantity: qty,
          priorityLevel: Number(data.priorityLevel) || 2,
          destinationLocation: data.destinationLocation || 'Field Relief Area',
          dispatchNotes: data.notes || `Dispatched directly to citizen assistance request ${data.assistanceRequestId}`,
        }),
      });

      if (res.ok) {
        // Refresh live resources stock
        await this.getResources();
      }
    } catch {
      // Fallback
    }

    const resList = loadStored('sahaya_resources', mockResources);
    const res = resList.find((r) => r.id === data.resourceId);
    if (res) {
      res.availableQuantity = Math.max(0, res.availableQuantity - qty);
      res.allocatedQuantity = (res.allocatedQuantity || 0) + qty;
      res.dispatchedQuantity = (res.dispatchedQuantity || 0) + qty;
      res.isLowStock = res.availableQuantity <= res.lowStockThreshold;
      saveStored('sahaya_resources', resList);
    }

    let reqTitle = '';
    let citizen = '';
    let destination = '';

    // Link and update citizen's assistance request status to Dispatched/InProgress
    if (data.assistanceRequestId) {
      const reqs = loadStored('sahaya_requests', mockRequests);
      const req = reqs.find((r) => r.id === data.assistanceRequestId);
      if (req) {
        reqTitle = req.title || req.description?.slice(0, 50) || 'Citizen Relief Request';
        citizen = req.citizenName || 'Affected Citizen';
        destination = req.address || req.location || 'Relief Center';
        const prev = req.status;
        req.status = 'InProgress' as RequestStatus;
        if (!req.statusHistory) req.statusHistory = [];
        req.statusHistory.unshift({
          id: `h-res-${Date.now()}`,
          assistanceRequestId: req.id,
          fromStatus: prev,
          toStatus: 'InProgress',
          changedByEmail: data.allocatedByEmail || 'logistics@sahaya.org',
          changedAt: new Date().toISOString(),
          notes: `Dispatched ${qty} ${res ? res.unit : 'units'} of ${res ? res.name : 'supplies'} from depot.`
        });
        saveStored('sahaya_requests', reqs);
      }
    }

    const newAllocation: ResourceAllocation = {
      id: `alloc-${Date.now()}`,
      resourceId: data.resourceId,
      resourceName: res ? res.name : data.resourceName || 'Relief Supplies',
      category: res ? res.category : data.category || 'Other',
      unit: res ? res.unit : data.unit || 'Units',
      assistanceRequestId: data.assistanceRequestId,
      requestTitle: reqTitle || data.requestTitle || 'Disaster Assistance Request',
      recipientName: citizen || data.recipientName || 'Relief Recipient',
      destinationLocation: destination || data.destinationLocation || (res ? res.storageLocation : 'Field Distribution Area'),
      quantityAllocated: qty,
      quantity: qty,
      allocatedAt: new Date().toISOString(),
      dispatchedAt: new Date().toISOString(),
      allocatedByEmail: data.allocatedByEmail || 'logistics@sahaya.org',
      status: 'Dispatched',
      notes: data.notes || `Dispatched directly to citizen assistance request ${data.assistanceRequestId}`
    };

    const allocList = loadStored('sahaya_allocations', mockAllocations);
    allocList.unshift(newAllocation);
    saveStored('sahaya_allocations', allocList);

    return newAllocation;
  },

  async getAllocations(): Promise<ResourceAllocation[]> {
    return loadStored('sahaya_allocations', mockAllocations);
  },

  async updateAllocationStatus(id: string, status: string, notes?: string): Promise<ResourceAllocation> {
    const list = loadStored('sahaya_allocations', mockAllocations);
    const item = list.find((a) => a.id === id);
    if (item) {
      item.status = status;
      if (status === 'Delivered' && !item.dispatchedAt) {
        item.dispatchedAt = new Date().toISOString();
      }
      if (notes) item.notes = `${item.notes ? item.notes + ' | ' : ''}${notes}`;
      saveStored('sahaya_allocations', list);
    }
    return item || list[0];
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

  // Replenish Resource Inventory (Stock Inflow / Shipment Receipt)
  async replenishResource(resourceId: string, quantity: number, _notes?: string, _batchNumber?: string): Promise<Resource> {
    const res = mockResources.find((r) => r.id === resourceId);
    if (!res) throw new Error('Resource item not found in relief depot');
    const qty = Number(quantity);
    res.totalQuantity = (res.totalQuantity || 0) + qty;
    res.availableQuantity = (res.availableQuantity || 0) + qty;
    res.isLowStock = res.availableQuantity <= res.lowStockThreshold;
    return { ...res };
  },

  // Shelter Relief Supply Requisitions (Coursework Spec Page 4 - Section 1.1 F)
  async getShelterSupplyRequests(shelterId?: string): Promise<ShelterSupplyRequest[]> {
    if (shelterId) {
      return mockShelterSupplyRequests.filter((r) => r.shelterId === shelterId);
    }
    return mockShelterSupplyRequests;
  },

  async createShelterSupplyRequest(data: Omit<ShelterSupplyRequest, 'id' | 'status' | 'requestedAt' | 'requestedBy'> & { requestedBy?: string }): Promise<ShelterSupplyRequest> {
    const newReq: ShelterSupplyRequest = {
      requestedBy: 'Shelter Lead Administrator',
      ...data,
      id: `ssr-${Date.now()}`,
      status: 'Pending',
      requestedAt: new Date().toISOString(),
    };
    mockShelterSupplyRequests.unshift(newReq);
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

  async acceptAIRecommendation(_id: string): Promise<void> { },
  async overrideAIRecommendation(_id: string, _data: any): Promise<void> { },

  // Volunteers
  async getVolunteers(): Promise<VolunteerProfile[]> {
    return mockVolunteers;
  },

  async getVolunteerProfile(_id: string): Promise<VolunteerProfile> {
    return (await this.getVolunteers())[0];
  },

  async updateVolunteerAvailability(_isAvailable: boolean): Promise<void> { },

  async getVolunteerTasks(): Promise<VolunteerTask[]> {
    return mockVolunteerTasks;
  },

  async updateTaskStatus(_id: string, _status: string): Promise<void> { },
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

    mockNotificationsList = getStoredNotifications();
    const list: NotificationItem[] = [...mockNotificationsList];

    // Check for pending official accounts to notify Admin
    const pending = getStoredUsers().filter((u) => u.isActive === false);
    if (pending.length > 0 && !list.some((n) => n.id === 'notif-pending-accounts')) {
      list.unshift({
        id: 'notif-pending-accounts',
        title: `${pending.length} Staff Account Approval Pending`,
        message: `New official accounts (${pending.map((p) => `${p.fullName} - ${p.role}`).slice(0, 2).join(', ')}${pending.length > 2 ? '...' : ''}) awaiting administrator review in User Management.`,
        type: 'EmergencyAlert',
        isRead: false,
        createdAt: new Date().toISOString(),
      });
    }

    return list;
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
      saveStoredNotifications(mockNotificationsList);
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
    saveStoredNotifications(mockNotificationsList);
  },

  async clearNotification(id: string): Promise<void> {
    try {
      await fetch(`/api/v1/notifications/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    mockNotificationsList = mockNotificationsList.filter((n) => n.id !== id);
    saveStoredNotifications(mockNotificationsList);
  },

  async clearAllNotifications(): Promise<void> {
    try {
      await fetch('/api/v1/notifications', { method: 'DELETE' });
    } catch {
      // Fallback
    }
    mockNotificationsList = [];
    saveStoredNotifications([]);
  },

  async restoreDefaultNotifications(): Promise<NotificationItem[]> {
    mockNotificationsList = [...initialDefaultNotifications];
    saveStoredNotifications(mockNotificationsList);
    return [...mockNotificationsList];
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
    saveStoredNotifications(mockNotificationsList);
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
      totalRegisteredUsers: getStoredUsers().length + 475,
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
    let result = getStoredUsers();
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
    const allUsers = getStoredUsers();
    return allUsers.find((u) => u.id === id) || allUsers[0];
  },

  async updateUserRole(id: string, data: { newRole: number | UserRole; justification: string }): Promise<void> {
    const roles: UserRole[] = [
      'Citizen',
      'Coordinator',
      'Volunteer',
      'Donor',
      'Admin',
      'CaseManager',
      'LogisticsManager',
      'ShelterAdmin',
      'VolunteerCoordinator',
      'PartnerOfficer',
    ];
    const allUsers = getStoredUsers();
    const u = allUsers.find((item) => item.id === id);
    if (u) {
      u.role = typeof data.newRole === 'string' ? (data.newRole as UserRole) : roles[data.newRole] || 'Citizen';
      saveStoredUsers(allUsers);
    }
  },

  async toggleUserStatus(id: string, data: { isActive: boolean; justification: string }): Promise<void> {
    const allUsers = getStoredUsers();
    const u = allUsers.find((item) => item.id === id);
    if (u) {
      u.isActive = data.isActive;
      saveStoredUsers(allUsers);
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
    const reqs = loadStored('sahaya_requests', mockRequests);
    const req = reqs.find((r) => r.latestRecommendation?.id === recommendationId);
    if (req && req.latestRecommendation) {
      const decisionLabel =
        data.reviewStatus === 1 || data.reviewStatus === 2 && !data.overrideReason
          ? 'Accepted'
          : data.overrideReason || data.reviewStatus === 3 && data.overriddenPriority
            ? 'Overridden'
            : 'Rejected';
      req.latestRecommendation.reviewStatus = decisionLabel;
      req.latestRecommendation.status = decisionLabel;
      if (data.overrideReason) req.latestRecommendation.overrideReason = data.overrideReason;
      if (data.notes) req.latestRecommendation.officerDecision = data.notes;
      if (decisionLabel === 'Accepted' || decisionLabel === 'Overridden') {
        req.status = 'Approved';
      } else {
        req.status = 'Rejected';
      }
      if (!req.statusHistory) req.statusHistory = [];
      req.statusHistory.unshift({
        id: `h-ai-${Date.now()}`,
        assistanceRequestId: req.id,
        fromStatus: 'Submitted',
        toStatus: req.status,
        changedByEmail: 'coordinator@sahaya.org',
        changedAt: new Date().toISOString(),
        notes: data.notes || `AI Triage Recommendation ${decisionLabel}.`,
      });
      saveStored('sahaya_requests', reqs);
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
    const reqs = loadStored('sahaya_requests', mockRequests);
    const req = reqs.find((r) => r.id === id);
    if (req) {
      const prev = req.status;
      if (data.decision === 3) req.status = 'Approved';
      else if (data.decision === 7) req.status = 'Rejected';
      else if (data.status) req.status = data.status;

      if (!req.statusHistory) req.statusHistory = [];
      req.statusHistory.unshift({
        id: `h-rev-${Date.now()}`,
        assistanceRequestId: req.id,
        fromStatus: prev,
        toStatus: req.status,
        changedByEmail: 'coordinator@sahaya.org',
        changedAt: new Date().toISOString(),
        notes: data.notes || `Request status updated to ${req.status}.`,
      });
      saveStored('sahaya_requests', reqs);
    }
    return { success: true, request: req };
  },

  async cancelRequest(id: string, reason?: string): Promise<any> {
    const reqs = loadStored('sahaya_requests', mockRequests);
    const req = reqs.find((r) => r.id === id);
    if (req) {
      const prev = req.status;
      req.status = 'Cancelled';
      if (!req.statusHistory) req.statusHistory = [];
      req.statusHistory.unshift({
        id: `h-can-${Date.now()}`,
        assistanceRequestId: req.id,
        fromStatus: prev,
        toStatus: 'Cancelled',
        changedByEmail: 'citizen@sahaya.org',
        changedAt: new Date().toISOString(),
        notes: reason || 'Cancelled by requester.',
      });
      saveStored('sahaya_requests', reqs);
    }
    return { success: true };
  },

  // Volunteers
  async getMyVolunteerProfile(): Promise<VolunteerProfile> {
    return mockVolunteers[0];
  },

  async getMyVolunteerTasks(): Promise<VolunteerTask[]> {
    return loadStored('sahaya_volunteer_tasks', mockVolunteerTasks);
  },

  async getAvailableVolunteerTasks(): Promise<VolunteerTask[]> {
    const tasks = loadStored('sahaya_volunteer_tasks', mockVolunteerTasks);
    return tasks.filter((t: VolunteerTask) => t.status === 'Assigned');
  },

  async updateVolunteerTaskStatus(taskId: string, statusOrPayload: any, notes?: string): Promise<any> {
    const tasks = loadStored('sahaya_volunteer_tasks', mockVolunteerTasks);
    const task = tasks.find((t: VolunteerTask) => t.id === taskId);
    const rawStatus =
      typeof statusOrPayload === 'object' && statusOrPayload !== null ? statusOrPayload.status : statusOrPayload;
    const rawNotes =
      typeof statusOrPayload === 'object' && statusOrPayload !== null ? statusOrPayload.notes : notes;

    const statusMap: Record<number, VolunteerTask['status']> = {
      1: 'Accepted',
      2: 'InProgress',
      3: 'Completed',
      4: 'Declined',
    };
    const resolvedStatus: VolunteerTask['status'] =
      typeof rawStatus === 'number' ? statusMap[rawStatus] || 'InProgress' : rawStatus || 'InProgress';

    if (task) {
      task.status = resolvedStatus;
      if (rawNotes) task.notes = rawNotes;
      saveStored('sahaya_volunteer_tasks', tasks);

      if (resolvedStatus === 'Completed' && task.assistanceRequestId) {
        const reqs = loadStored('sahaya_requests', mockRequests);
        const req = reqs.find((r) => r.id === task.assistanceRequestId);
        if (req) {
          const prev = req.status;
          req.status = 'Resolved';
          if (!req.statusHistory) req.statusHistory = [];
          req.statusHistory.unshift({
            id: `h-done-${Date.now()}`,
            assistanceRequestId: req.id,
            fromStatus: prev,
            toStatus: 'Resolved',
            changedByEmail: 'volunteer@sahaya.org',
            changedAt: new Date().toISOString(),
            notes: rawNotes || `Field volunteer completed mission "${task.title}".`,
          });
          saveStored('sahaya_requests', reqs);
        }
      }
    }
    return { success: true, task };
  },

  async acceptVolunteerTask(taskId: string): Promise<any> {
    return this.updateVolunteerTaskStatus(taskId, 'Accepted');
  },

  async assignVolunteerTask(dataOrTaskId: any, volunteerId?: string): Promise<any> {
    const isPayloadObj = typeof dataOrTaskId === 'object' && dataOrTaskId !== null;
    const vId = isPayloadObj ? dataOrTaskId.volunteerProfileId || dataOrTaskId.volunteerId : volunteerId || 'vol-1';
    const reqId = isPayloadObj ? dataOrTaskId.assistanceRequestId : undefined;
    const title = isPayloadObj ? dataOrTaskId.title : 'Field Relief Mission';
    const description = isPayloadObj ? dataOrTaskId.description : 'Field assistance and evacuation support';

    const tasks = loadStored('sahaya_volunteer_tasks', mockVolunteerTasks);
    const newTask: VolunteerTask = {
      id: `task-${Date.now()}`,
      volunteerId: vId,
      volunteerProfileId: vId,
      assistanceRequestId: reqId,
      title: title,
      description: description,
      priority: 'High',
      status: 'Assigned',
      assignedAt: new Date().toISOString()
    };
    tasks.unshift(newTask);
    saveStored('sahaya_volunteer_tasks', tasks);

    // Link and update citizen's assistance request status to InProgress
    if (reqId) {
      const reqs = loadStored('sahaya_requests', mockRequests);
      const req = reqs.find((r) => r.id === reqId);
      if (req) {
        const prev = req.status;
        req.status = 'InProgress' as RequestStatus;
        if (!req.statusHistory) req.statusHistory = [];
        req.statusHistory.unshift({
          id: `h-vol-${Date.now()}`,
          assistanceRequestId: req.id,
          fromStatus: prev,
          toStatus: 'InProgress',
          changedByEmail: 'volcoord@sahaya.org',
          changedAt: new Date().toISOString(),
          notes: `Volunteer assigned to mission: "${title}". First responder unit en route.`
        });
        saveStored('sahaya_requests', reqs);
      }
    }

    return { success: true, task: newTask };
  },
};
