export type UserRole = 
  | 'Citizen' 
  | 'Coordinator' 
  | 'CaseManager' 
  | 'LogisticsManager' 
  | 'ShelterAdmin' 
  | 'VolunteerCoordinator' 
  | 'Donor' 
  | 'PartnerOfficer' 
  | 'Admin'
  | 'Volunteer'; // Keep Volunteer for backward compatibility with field mobile profile

export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  token: string;
  expiresAt?: string;
  expiresIn?: number;
}

export type RequestCategory = 
  | 'Food' 
  | 'DrinkingWater' 
  | 'MedicalAssistance' 
  | 'EmergencyShelter' 
  | 'RescueTransport' 
  | 'Clothing' 
  | 'Sanitation' 
  | 'Other'
  | 'Water'
  | 'Medical';

export type RequestUrgency = 'Low' | 'Medium' | 'High' | 'Critical' | 'Immediate';

export type RequestStatus = 
  | 'Submitted' 
  | 'UnderReview' 
  | 'Approved' 
  | 'Assigned' 
  | 'InProgress' 
  | 'Resolved' 
  | 'Rejected' 
  | 'Cancelled'
  | 'Pending';

export interface RequestStatusHistory {
  id: string;
  assistanceRequestId?: string;
  fromStatus?: RequestStatus;
  toStatus?: RequestStatus;
  previousStatus?: RequestStatus;
  newStatus?: RequestStatus;
  changedByName?: string;
  changedByEmail?: string;
  changedAt?: string;
  notes?: string;
  timestamp?: string;
}

export interface AIRecommendation {
  id: string;
  assistanceRequestId: string;
  predictedCategory?: RequestCategory;
  suggestedCategory?: RequestCategory;
  suggestedPriority?: RequestUrgency;
  suggestedUrgency?: RequestUrgency;
  suggestedShelterId?: string;
  suggestedShelterName?: string;
  confidenceScore: number;
  explanation: string;
  suggestedResources?: string[];
  providerMode?: string;
  createdAt: string;
  status?: string;
  reviewStatus?: 'Pending' | 'Accepted' | 'Overridden' | 'Rejected';
  reviewingOfficerName?: string;
  officerDecision?: string;
  overrideReason?: string;
  reviewedAt?: string;
}

export interface AssistanceRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenPhone?: string;
  location?: string;
  peopleCount?: number;
  crisisEventId?: string;
  crisisEventTitle?: string;
  category: RequestCategory;
  title?: string;
  description: string;
  urgency: RequestUrgency;
  affectedCount?: number;
  specialNeeds?: string;
  address?: string;
  latitude: number;
  longitude: number;
  contactPhone?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt?: string;
  statusHistory: RequestStatusHistory[];
  latestRecommendation?: AIRecommendation;
}

export interface CrisisEvent {
  id: string;
  title: string;
  description: string;
  disasterType?: 'Flood' | 'Landslide' | 'Earthquake' | 'Storm' | 'Tsunami' | 'Drought' | 'Fire' | 'Industrial' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical' | 'Severe';
  location: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
  affectedCount?: number;
  status?: string;
  startedAt?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  totalRequests?: number;
  pendingRequests?: number;
  createdAt: string;
}

export interface CoordinatorDashboardData {
  totalRequests: number;
  pendingRequests: number;
  pendingRequestsCount?: number;
  approvedRequests: number;
  assignedRequestsCount?: number;
  inProgressRequestsCount?: number;
  resolvedRequestsCount?: number;
  criticalRequests: number;
  criticalUrgencyCount?: number;
  activeIncidents: number;
  totalShelters: number;
  availableCapacity: number;
  totalVolunteers: number;
  activeVolunteers: number;
  lowStockResourcesCount: number;
  topNeededResources?: { resourceName: string; totalRequested: number; totalAvailable: number; shortage: number }[];
  aiTriageQueueCount?: number;
  recentRequests: AssistanceRequest[];
  activeEvents: CrisisEvent[];
  activeCrisisEvents?: CrisisEvent[];
}

export type ResourceCategory = 'Food' | 'DrinkingWater' | 'MedicalSupplies' | 'ShelterSupplies' | 'Sanitation' | 'Clothing' | 'LogisticsEquipment';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  unit: string;
  totalQuantity: number;
  quantity?: number;
  availableQuantity: number;
  allocatedQuantity: number;
  dispatchedQuantity: number;
  lowStockThreshold: number;
  storageLocation: string;
  warehouseLocation?: string;
  expiryDate?: string;
  isActive: boolean;
  isLowStock: boolean;
  createdAt: string;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  resourceName?: string;
  category?: ResourceCategory;
  unit?: string;
  assistanceRequestId: string;
  requestTitle?: string;
  recipientName?: string;
  destinationLocation?: string;
  quantity?: number;
  quantityAllocated?: number;
  allocatedByEmail?: string;
  status: 'Allocated' | 'Dispatched' | 'Delivered' | 'InTransit' | string;
  allocatedAt: string;
  dispatchedAt?: string;
  notes?: string;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  totalCapacity: number;
  capacity?: number;
  currentOccupancy: number;
  availableCapacity: number;
  facilities: string[];
  accessibilityInfo: string;
  contactPhone: string;
  contactPerson?: string;
  status: 'Active' | 'Full' | 'Inactive';
  createdAt: string;
  waterStockLiters?: number;
  foodRationBoxes?: number;
  medicalKitPacks?: number;
  lastStockAuditAt?: string;
}

export interface ShelterAssignment {
  id: string;
  shelterId: string;
  shelterName?: string;
  assistanceRequestId: string;
  requestTitle?: string;
  citizenId: string;
  citizenName?: string;
  numberOfPeople: number;
  assignedAt: string;
  status: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  fullName: string;
  email?: string;
  phone?: string;
  skills: string[];
  availabilityStatus?: 'Available' | 'Busy' | 'OffDuty';
  isAvailable?: boolean;
  serviceArea: string;
  isVerified?: boolean;
  rating?: number;
  currentLatitude?: number;
  currentLongitude?: number;
  completedTasksCount: number;
  createdAt: string;
}

export interface VolunteerTask {
  id: string;
  volunteerProfileId?: string;
  volunteerId?: string;
  volunteerName?: string;
  assistanceRequestId?: string;
  requestTitle?: string;
  title: string;
  description: string;
  priority: RequestUrgency;
  status: 'Assigned' | 'Accepted' | 'InProgress' | 'Completed' | 'Declined';
  deadline?: string;
  assignedAt: string;
  completedAt?: string;
  notes?: string;
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  progressPercentage: number;
  status?: string;
  crisisEventId?: string;
  startDate: string;
  endDate?: string;
  isActive?: boolean;
  totalDonationsCount?: number;
  createdAt?: string;
}

export interface Donation {
  id: string;
  donorProfileId?: string;
  donorName: string;
  donorEmail?: string;
  campaignId?: string;
  campaignTitle?: string;
  donationType: 'Monetary' | 'InKind';
  amount: number;
  currency?: string;
  paymentReference?: string;
  itemName?: string;
  itemDescription?: string;
  itemCategory?: string;
  itemQuantity?: number;
  quantity?: number;
  itemUnit?: string;
  estimatedValue?: number;
  status?: string;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'Info' | 'Success' | 'Warning' | 'EmergencyAlert';
  isRead: boolean;
  linkUrl?: string;
  createdAt: string;
}

export interface DuplicateMatch {
  id: string;
  sourceRequestId: string;
  matchedRequestId: string;
  matchedTitle: string;
  matchedCategory: string;
  matchedCitizenName: string;
  similarityScore: number;
  proximityKm: number;
  reason: string;
  status: string;
}

export interface SystemOverviewReport {
  totalRequests: number;
  resolvedRequests: number;
  pendingRequests: number;
  activeIncidents: number;
  totalShelters: number;
  totalShelterCapacity?: number;
  shelterOccupancyPercentage: number;
  totalVolunteers?: number;
  activeVolunteers?: number;
  completedVolunteerTasks?: number;
  totalDonationsRaised: number;
  totalInKindDonations: number;
  totalRegisteredUsers?: number;
  requestsByCategory?: { category: string; count: number }[];
  requestsByStatus?: { status: string; count: number }[];
  requestsByPriority?: { priority: string; count: number }[];
}

export interface AuditLogItem {
  id: string;
  userId?: string;
  userEmail?: string;
  action: string;
  entityName: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  associatedRequestsCount?: number;
  completedMissionsCount?: number;
}

export interface UserRoleCounts {
  totalUsers: number;
  citizens: number;
  coordinators: number;
  volunteers: number;
  donors: number;
  admins: number;
  citizenCount?: number;
  coordinatorCount?: number;
  volunteerCount?: number;
  donorCount?: number;
  adminCount?: number;
  activeUsersCount?: number;
  inactiveUsersCount?: number;
}

export interface SystemHealthMetrics {
  status: string;
  databaseStatus?: string;
  databaseConnected: boolean;
  databaseLatencyMs: number;
  processMemoryMb: number;
  processMemoryBytes?: number;
  totalEntities: number;
  totalDatabaseEntities?: number;
  dotNetVersion?: string;
  serverUtcTime?: string;
  systemUptime?: string;
}

export interface VolunteerCheckIn {
  id?: string;
  taskId?: string;
  volunteerId?: string;
  latitude: number;
  longitude: number;
  locationName?: string;
  batteryLevel?: number;
  isEmergency?: boolean;
  timestamp?: string;
  notes?: string;
  statusNotes?: string;
}

export interface PartnerRequest {
  id: string;
  partnerName: string;
  partnerType: string;
  resourceCategory: string;
  itemName: string;
  quantityRequested: number;
  unit: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  deliveryLocation: string;
  justification: string;
  status: 'Pending' | 'Approved' | 'InTransit' | 'Delivered';
  requestedAt: string;
  etaHours: number;
}

export interface ShelterSupplyRequest {
  id: string;
  shelterId: string;
  shelterName: string;
  category: ResourceCategory;
  itemName: string;
  quantityRequested: number;
  unit: string;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  justification: string;
  sourceDepot?: string;
  status: 'Pending' | 'Approved' | 'Dispatched' | 'Delivered';
  requestedAt: string;
  requestedBy: string;
}

// ---------------------------------------------------------------------------
// Citizen Household & Vulnerability Profile Interfaces (Member 2)
// ---------------------------------------------------------------------------
export type HouseholdProfileType = 'Individual' | 'Family';

export type SriLankanDistrict =
  | 'Ampara' | 'Anuradhapura' | 'Badulla' | 'Batticaloa' | 'Colombo'
  | 'Galle' | 'Gampaha' | 'Hambantota' | 'Jaffna' | 'Kalutara'
  | 'Kandy' | 'Kegalle' | 'Kilinochchi' | 'Kurunegala' | 'Mannar'
  | 'Matale' | 'Matara' | 'Monaragala' | 'Mullaitivu' | 'Nuwara Eliya'
  | 'Polonnaruwa' | 'Puttalam' | 'Ratnapura' | 'Trincomalee' | 'Vavuniya';

export interface HouseholdComposition {
  infants: number;      // under 1 year
  children: number;     // 1-17 years
  adults: number;       // 18-59 years
  elderly: number;      // 60 years and above
  totalMembers: number; // auto-calculated sum
}

export type VulnerabilityCategory =
  | 'pregnantWomen'
  | 'personsWithDisabilities'
  | 'chronicMedicalConditions'
  | 'regularMedicationRequired'
  | 'mobilityAssistanceRequired'
  | 'otherSpecialNeeds';

export interface EmergencyContact {
  name: string;
  relationship: 'Parent' | 'Spouse' | 'Sibling' | 'Relative' | 'Friend' | 'Neighbour' | 'Other' | '';
  phoneNumber: string;
}

export type HouseholdProfileStatus = 'NotCreated' | 'Incomplete' | 'Completed';

export interface HouseholdProfile {
  id?: string;
  userId: string;
  fullName: string;
  mobileNumber: string;
  profileType: HouseholdProfileType;
  residentialAddress: string;
  district: SriLankanDistrict | '';
  city: string;
  composition: HouseholdComposition;
  noSpecialNeeds: boolean;
  preferNotToDisclose: boolean;
  vulnerabilities: Record<VulnerabilityCategory, { selected: boolean; affectedCount: number }>;
  additionalNotes?: string;
  emergencyContact?: EmergencyContact;
  status: HouseholdProfileStatus;
  updatedAt?: string;
  createdAt?: string;
}



