export type UserRole = 'Citizen' | 'Coordinator' | 'Volunteer' | 'Donor' | 'Admin';

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
  expiresAt: string;
}

export type RequestCategory = 
  | 'Food' 
  | 'DrinkingWater' 
  | 'MedicalAssistance' 
  | 'EmergencyShelter' 
  | 'RescueTransport' 
  | 'Clothing' 
  | 'Sanitation' 
  | 'Other';

export type RequestUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export type RequestStatus = 
  | 'Submitted' 
  | 'UnderReview' 
  | 'Approved' 
  | 'Assigned' 
  | 'InProgress' 
  | 'Resolved' 
  | 'Rejected' 
  | 'Cancelled';

export interface RequestStatusHistory {
  id: string;
  previousStatus: RequestStatus;
  newStatus: RequestStatus;
  changedByName: string;
  notes?: string;
  timestamp: string;
}

export interface AIRecommendation {
  id: string;
  assistanceRequestId: string;
  predictedCategory: RequestCategory;
  suggestedPriority: RequestUrgency;
  confidenceScore: number;
  explanation: string;
  suggestedResources: string[];
  providerMode: string;
  createdAt: string;
  reviewStatus: 'Pending' | 'Accepted' | 'Overridden' | 'Rejected';
  reviewingOfficerName?: string;
  officerDecision?: string;
  overrideReason?: string;
  reviewedAt?: string;
}

export interface AssistanceRequest {
  id: string;
  citizenId: string;
  citizenName: string;
  crisisEventId?: string;
  crisisEventTitle?: string;
  category: RequestCategory;
  title: string;
  description: string;
  urgency: RequestUrgency;
  affectedCount: number;
  specialNeeds?: string;
  address: string;
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
  disasterType: 'Flood' | 'Landslide' | 'Earthquake' | 'Storm' | 'Tsunami' | 'Drought' | 'Fire' | 'Industrial' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  location: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  totalRequests: number;
  pendingRequests: number;
  createdAt: string;
}

export interface CoordinatorDashboardData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  criticalRequests: number;
  activeIncidents: number;
  totalShelters: number;
  availableCapacity: number;
  totalVolunteers: number;
  activeVolunteers: number;
  lowStockResourcesCount: number;
  recentRequests: AssistanceRequest[];
  activeEvents: CrisisEvent[];
}

export interface Resource {
  id: string;
  name: string;
  category: 'Food' | 'DrinkingWater' | 'MedicalSupplies' | 'ShelterSupplies' | 'Sanitation' | 'Clothing' | 'LogisticsEquipment';
  unit: string;
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  dispatchedQuantity: number;
  lowStockThreshold: number;
  storageLocation: string;
  expiryDate?: string;
  isActive: boolean;
  isLowStock: boolean;
  createdAt: string;
}

export interface ResourceAllocation {
  id: string;
  resourceId: string;
  resourceName: string;
  assistanceRequestId: string;
  requestTitle: string;
  quantity: number;
  status: string;
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
  currentOccupancy: number;
  availableCapacity: number;
  facilities: string[];
  accessibilityInfo: string;
  contactPhone: string;
  status: 'Active' | 'Full' | 'Inactive';
  createdAt: string;
}

export interface ShelterAssignment {
  id: string;
  shelterId: string;
  shelterName: string;
  assistanceRequestId: string;
  requestTitle: string;
  citizenId: string;
  citizenName: string;
  numberOfPeople: number;
  assignedAt: string;
  status: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  skills: string[];
  availabilityStatus: 'Available' | 'Busy' | 'OffDuty';
  serviceArea: string;
  isVerified: boolean;
  completedTasksCount: number;
  createdAt: string;
}

export interface VolunteerTask {
  id: string;
  volunteerProfileId: string;
  volunteerName: string;
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
  startDate: string;
  endDate?: string;
  isActive: boolean;
  totalDonationsCount: number;
  createdAt: string;
}

export interface Donation {
  id: string;
  donorProfileId: string;
  donorName: string;
  campaignId?: string;
  campaignTitle?: string;
  donationType: 'Monetary' | 'InKind';
  amount: number;
  currency: string;
  paymentReference?: string;
  itemName?: string;
  itemCategory?: string;
  itemQuantity: number;
  itemUnit?: string;
  estimatedValue?: number;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
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
  shelterOccupancyPercentage: number;
  totalVolunteers: number;
  completedVolunteerTasks: number;
  totalDonationsRaised: number;
  totalInKindDonations: number;
  requestsByCategory: { category: string; count: number }[];
  requestsByStatus: { status: string; count: number }[];
  requestsByPriority: { priority: string; count: number }[];
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
  phoneNumber: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  associatedRequestsCount: number;
  completedMissionsCount: number;
}

export interface UserRoleCounts {
  totalUsers: number;
  citizens: number;
  coordinators: number;
  volunteers: number;
  donors: number;
  admins: number;
  citizenCount: number;
  coordinatorCount: number;
  volunteerCount: number;
  donorCount: number;
  adminCount: number;
  activeUsersCount: number;
  inactiveUsersCount: number;
}

export interface SystemHealthMetrics {
  status: string;
  databaseStatus: string;
  databaseConnected: boolean;
  databaseLatencyMs: number;
  processMemoryMb: number;
  processMemoryBytes: number;
  totalEntities: number;
  totalDatabaseEntities: number;
  dotNetVersion: string;
  serverUtcTime: string;
  systemUptime: string;
}

export interface VolunteerCheckIn {
  taskId?: string;
  latitude: number;
  longitude: number;
  locationName: string;
  notes?: string;
  statusNotes?: string;
}

