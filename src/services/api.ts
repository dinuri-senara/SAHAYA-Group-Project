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

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('sahaya_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem('sahaya_token');
      localStorage.removeItem('sahaya_user');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    let errorMsg = 'An unexpected error occurred.';
    try {
      const rawText = await res.text();
      if (rawText) {
        try {
          const errJson = JSON.parse(rawText);
          errorMsg = errJson.message || errJson.error || errJson.title || (typeof errJson === 'string' ? errJson : JSON.stringify(errJson));
        } catch {
          errorMsg = rawText;
        }
      } else {
        errorMsg = res.statusText || 'An unexpected error occurred.';
      }
    } catch {
      errorMsg = res.statusText || 'An unexpected error occurred.';
    }

    if (res.status === 502 || res.status === 503 || res.status === 504 || (typeof errorMsg === 'string' && errorMsg.includes('ECONNREFUSED'))) {
      errorMsg = 'Backend server is not responding. Please ensure the backend is running on port 5000.';
    }

    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async register(data: { email: string; password: string; fullName: string; phoneNumber: string; role: number }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<AuthResponse>(res);
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<User>(res);
  },

  async updateProfile(data: { fullName: string; phoneNumber: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<User>(res);
  },

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Requests
  async getRequests(params?: { status?: string; category?: string; urgency?: string; search?: string }): Promise<AssistanceRequest[]> {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.category) query.append('category', params.category);
    if (params?.urgency) query.append('urgency', params.urgency);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`${API_BASE}/requests?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<AssistanceRequest[]>(res);
  },

  async getRequestById(id: string): Promise<AssistanceRequest> {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<AssistanceRequest>(res);
  },

  async createRequest(data: {
    crisisEventId?: string;
    category: number;
    title: string;
    description: string;
    urgency: number;
    affectedCount: number;
    specialNeeds?: string;
    address: string;
    latitude: number;
    longitude: number;
    contactPhone?: string;
  }): Promise<AssistanceRequest> {
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<AssistanceRequest>(res);
  },

  async updateRequest(id: string, data: Partial<AssistanceRequest>): Promise<AssistanceRequest> {
    const res = await fetch(`${API_BASE}/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<AssistanceRequest>(res);
  },

  async cancelRequest(id: string, reason?: string): Promise<AssistanceRequest> {
    const res = await fetch(`${API_BASE}/requests/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(reason || 'Cancelled by citizen'),
    });
    return handleResponse<AssistanceRequest>(res);
  },

  async reviewRequest(id: string, data: { decision: number; notes?: string; modifiedUrgency?: number; modifiedCategory?: number }): Promise<AssistanceRequest> {
    const res = await fetch(`${API_BASE}/requests/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<AssistanceRequest>(res);
  },

  async getRequestHistory(id: string): Promise<RequestStatusHistory[]> {
    const res = await fetch(`${API_BASE}/requests/${id}/history`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<RequestStatusHistory[]>(res);
  },

  // Crisis Events & Coordinator
  async getCrisisEvents(activeOnly: boolean = false): Promise<CrisisEvent[]> {
    const res = await fetch(`${API_BASE}/crisis-events?activeOnly=${activeOnly}`);
    return handleResponse<CrisisEvent[]>(res);
  },

  async getCrisisEventById(id: string): Promise<CrisisEvent> {
    const res = await fetch(`${API_BASE}/crisis-events/${id}`);
    return handleResponse<CrisisEvent>(res);
  },

  async createCrisisEvent(data: {
    title: string;
    description: string;
    disasterType: number;
    severity: number;
    location: string;
    latitude: number;
    longitude: number;
    startDate: string;
    endDate?: string;
  }): Promise<CrisisEvent> {
    const res = await fetch(`${API_BASE}/crisis-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<CrisisEvent>(res);
  },

  async getCoordinatorDashboard(): Promise<CoordinatorDashboardData> {
    const res = await fetch(`${API_BASE}/coordinator/dashboard`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<CoordinatorDashboardData>(res);
  },

  // AI
  async generateAIRecommendation(requestId: string): Promise<AIRecommendation> {
    const res = await fetch(`${API_BASE}/ai/recommendations/${requestId}/generate`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<AIRecommendation>(res);
  },

  async reviewAIRecommendation(recommendationId: string, data: {
    reviewStatus: number;
    overriddenCategory?: number;
    overriddenPriority?: number;
    overrideReason?: string;
    notes?: string;
  }): Promise<AIRecommendation> {
    const res = await fetch(`${API_BASE}/ai/recommendations/${recommendationId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<AIRecommendation>(res);
  },

  async sendAIChat(message: string, language: string = 'en', requestContextId?: string): Promise<{ reply: string; quickSuggestions: string[]; isFromFallback: boolean }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language, requestContextId }),
    });
    return handleResponse<{ reply: string; quickSuggestions: string[]; isFromFallback: boolean }>(res);
  },

  async recommendShelters(requestId: string): Promise<Shelter[]> {
    const res = await fetch(`${API_BASE}/ai/recommendations/shelters/${requestId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Shelter[]>(res);
  },

  async recommendVolunteers(requestId: string): Promise<VolunteerProfile[]> {
    const res = await fetch(`${API_BASE}/ai/recommendations/volunteers/${requestId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<VolunteerProfile[]>(res);
  },

  async getDuplicateMatches(): Promise<DuplicateMatch[]> {
    const res = await fetch(`${API_BASE}/ai/duplicates`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<DuplicateMatch[]>(res);
  },

  async reviewDuplicate(id: string, decision: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/ai/duplicates/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(decision),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Resources
  async getResources(): Promise<Resource[]> {
    const res = await fetch(`${API_BASE}/resources`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Resource[]>(res);
  },

  async createResource(data: {
    name: string;
    category: number;
    unit: string;
    totalQuantity: number;
    lowStockThreshold: number;
    storageLocation: string;
    expiryDate?: string;
  }): Promise<Resource> {
    const res = await fetch(`${API_BASE}/resources`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Resource>(res);
  },

  async allocateResource(data: { resourceId: string; assistanceRequestId: string; quantity: number; notes?: string }): Promise<ResourceAllocation> {
    const res = await fetch(`${API_BASE}/resources/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ResourceAllocation>(res);
  },

  async dispatchResource(allocationId: string, notes?: string): Promise<ResourceAllocation> {
    const res = await fetch(`${API_BASE}/resources/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ allocationId, notes }),
    });
    return handleResponse<ResourceAllocation>(res);
  },

  async getRequestAllocations(requestId: string): Promise<ResourceAllocation[]> {
    const res = await fetch(`${API_BASE}/resources/allocations/request/${requestId}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<ResourceAllocation[]>(res);
  },

  // Shelters
  async getShelters(availableOnly: boolean = false): Promise<Shelter[]> {
    const res = await fetch(`${API_BASE}/shelters?availableOnly=${availableOnly}`);
    return handleResponse<Shelter[]>(res);
  },

  async createShelter(data: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    totalCapacity: number;
    facilities: string[];
    accessibilityInfo: string;
    contactPhone: string;
  }): Promise<Shelter> {
    const res = await fetch(`${API_BASE}/shelters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Shelter>(res);
  },

  async assignShelter(data: { shelterId: string; assistanceRequestId: string; citizenId: string; numberOfPeople: number }): Promise<ShelterAssignment> {
    const res = await fetch(`${API_BASE}/shelters/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ShelterAssignment>(res);
  },

  // Volunteers
  async getVolunteers(): Promise<VolunteerProfile[]> {
    const res = await fetch(`${API_BASE}/volunteers`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<VolunteerProfile[]>(res);
  },

  async getMyVolunteerProfile(): Promise<VolunteerProfile> {
    const res = await fetch(`${API_BASE}/volunteers/profile`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<VolunteerProfile>(res);
  },

  async registerVolunteerProfile(data: { skills: string[]; serviceArea: string; phone: string }): Promise<VolunteerProfile> {
    const res = await fetch(`${API_BASE}/volunteers/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<VolunteerProfile>(res);
  },

  async assignVolunteerTask(data: {
    volunteerProfileId: string;
    assistanceRequestId?: string;
    title: string;
    description: string;
    priority: number;
    deadline?: string;
  }): Promise<VolunteerTask> {
    const res = await fetch(`${API_BASE}/volunteers/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<VolunteerTask>(res);
  },

  async getMyVolunteerTasks(): Promise<VolunteerTask[]> {
    const res = await fetch(`${API_BASE}/volunteers/my-tasks`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<VolunteerTask[]>(res);
  },

  async updateVolunteerTaskStatus(taskId: string, data: { status: number; notes?: string }): Promise<VolunteerTask> {
    const res = await fetch(`${API_BASE}/volunteers/tasks/${taskId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<VolunteerTask>(res);
  },

  // Donations
  async getCampaigns(): Promise<DonationCampaign[]> {
    const res = await fetch(`${API_BASE}/donations/campaigns`);
    return handleResponse<DonationCampaign[]>(res);
  },

  async createCampaign(data: { title: string; description: string; targetAmount: number; endDate?: string }): Promise<DonationCampaign> {
    const res = await fetch(`${API_BASE}/donations/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<DonationCampaign>(res);
  },

  async recordMonetaryDonation(data: { campaignId?: string; amount: number; currency: string; paymentReference?: string; notes?: string }): Promise<Donation> {
    const res = await fetch(`${API_BASE}/donations/monetary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Donation>(res);
  },

  async recordInKindDonation(data: { campaignId?: string; itemName: string; itemCategory: string; itemQuantity: number; itemUnit: string; estimatedValue?: number; notes?: string }): Promise<Donation> {
    const res = await fetch(`${API_BASE}/donations/in-kind`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<Donation>(res);
  },

  async getMyDonations(): Promise<Donation[]> {
    const res = await fetch(`${API_BASE}/donations/my-donations`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Donation[]>(res);
  },

  async getAllDonations(): Promise<Donation[]> {
    const res = await fetch(`${API_BASE}/donations`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<Donation[]>(res);
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<NotificationItem[]>(res);
  },

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  },

  async markAllNotificationsRead(): Promise<void> {
    await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
  },

  async broadcastAlert(data: { title: string; message: string; crisisEventId?: string }): Promise<void> {
    await fetch(`${API_BASE}/notifications/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
  },

  // Reports
  async getSystemOverview(): Promise<SystemOverviewReport> {
    const res = await fetch(`${API_BASE}/reports/overview`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<SystemOverviewReport>(res);
  },

  async getShelterReport(): Promise<{ shelterId: string; shelterName: string; totalCapacity: number; currentOccupancy: number; occupancyRate: number; status: string }[]> {
    const res = await fetch(`${API_BASE}/reports/shelters`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<any[]>(res);
  },

  async getAuditLogs(count: number = 100): Promise<AuditLogItem[]> {
    const res = await fetch(`${API_BASE}/reports/audit-logs?count=${count}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<AuditLogItem[]>(res);
  },

  // Aliases and helpers
  async getOverviewReport(): Promise<SystemOverviewReport> {
    return this.getSystemOverview();
  },

  async getDonationCampaigns(): Promise<DonationCampaign[]> {
    return this.getCampaigns();
  },

  async createDonationCampaign(data: { title: string; description: string; targetAmount: number; endDate?: string }): Promise<DonationCampaign> {
    return this.createCampaign(data);
  },

  async getDonations(): Promise<Donation[]> {
    return this.getAllDonations();
  },

  async createDonation(data: any): Promise<Donation> {
    if (data.donationType === 0 || data.donationType === 'Monetary') {
      return this.recordMonetaryDonation(data);
    } else {
      return this.recordInKindDonation(data);
    }
  },

  async assignToShelter(shelterId: string, data: { assistanceRequestId: string; numberOfPeople: number }): Promise<ShelterAssignment> {
    return this.assignShelter({
      shelterId,
      assistanceRequestId: data.assistanceRequestId,
      citizenId: '',
      numberOfPeople: data.numberOfPeople
    });
  },

  async detectDuplicates(_requestId?: string): Promise<DuplicateMatch[]> {
    return this.getDuplicateMatches();
  },

  // User Management (Admin)
  async getUsers(role?: string, search?: string): Promise<UserSummary[]> {
    const query = new URLSearchParams();
    if (role) query.append('role', role);
    if (search) query.append('search', search);
    const res = await fetch(`${API_BASE}/users?${query.toString()}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<UserSummary[]>(res);
  },

  async getUserById(id: string): Promise<UserSummary> {
    const res = await fetch(`${API_BASE}/users/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<UserSummary>(res);
  },

  async updateUserRole(id: string, payload: number | { newRole: number; justification?: string }): Promise<UserSummary> {
    const newRole = typeof payload === 'number' ? payload : payload.newRole;
    const justification = typeof payload === 'object' ? payload.justification : undefined;
    const res = await fetch(`${API_BASE}/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ newRole, justification }),
    });
    return handleResponse<UserSummary>(res);
  },

  async toggleUserStatus(id: string, payload: boolean | { isActive: boolean; justification?: string }, reason?: string): Promise<UserSummary> {
    const isActive = typeof payload === 'boolean' ? payload : payload.isActive;
    const actualReason = typeof payload === 'object' ? payload.justification : reason;
    const res = await fetch(`${API_BASE}/users/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ isActive, justification: actualReason, reason: actualReason }),
    });
    return handleResponse<UserSummary>(res);
  },

  async getUserCountsByRole(): Promise<UserRoleCounts> {
    const res = await fetch(`${API_BASE}/users/counts-by-role`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<UserRoleCounts>(res);
  },

  async getSystemHealthMetrics(): Promise<SystemHealthMetrics> {
    const res = await fetch(`${API_BASE}/users/system-health`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<SystemHealthMetrics>(res);
  },

  // Volunteer Mission Operations
  async getAvailableVolunteerTasks(): Promise<VolunteerTask[]> {
    const res = await fetch(`${API_BASE}/volunteers/available-tasks`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse<VolunteerTask[]>(res);
  },

  async acceptVolunteerTask(id: string): Promise<VolunteerTask> {
    const res = await fetch(`${API_BASE}/volunteers/tasks/${id}/accept`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse<VolunteerTask>(res);
  },

  async recordVolunteerCheckIn(data: VolunteerCheckIn): Promise<{ message: string; timestamp: string }> {
    const res = await fetch(`${API_BASE}/volunteers/check-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<{ message: string; timestamp: string }>(res);
  },
};

