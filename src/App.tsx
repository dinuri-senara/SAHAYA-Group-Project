import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppShell } from './components/AppShell';
import { ScrollToTop } from './components/ScrollToTop';

// Public Landing Page
import { LandingPage } from './pages/LandingPage';

// Main Executive Command Overview (Member 1 Modern Design)
import { ModernDashboard } from './pages/ModernDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { UsersPage } from './pages/UsersPage';

// Member 2: Authentication & Citizen Portal
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CreateRequestPage } from './pages/CreateRequestPage';
import { SafetyGuidePage } from './pages/SafetyGuidePage';
import { SafetyGuideDetailPage } from './pages/SafetyGuideDetailPage';

// Member 3: Crisis Management & Coordinator Command Hub
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import { IncidentsPage } from './pages/IncidentsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';

// Member 4: Logistics, Inventory Depot & Safe Shelters
import { SheltersPage } from './pages/SheltersPage';
import { ResourcesPage } from './pages/ResourcesPage';

// Member 5: AI Decision Intelligence & Explainable Review
import { CoordinatorAIReviewPage } from './pages/CoordinatorAIReviewPage';

// Member 6: GIS Command Map, Field Volunteers & Relief Crowdfunding
import { InteractiveMapPage } from './pages/InteractiveMapPage';
import { VolunteersPage } from './pages/VolunteersPage';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { DonationsPage } from './pages/DonationsPage';
import { DonorDashboard } from './pages/DonorDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Authentication Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Main Executive Command Overview (Member 1 Modern Design) */}
              <Route
                path="/dashboard"
                element={
                  <AppShell>
                    <ModernDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/admin/overview"
                element={
                  <AppShell>
                    <ModernDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/reports"
                element={
                  <AppShell>
                    <ModernDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AppShell>
                    <AdminDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AppShell>
                    <UsersPage />
                  </AppShell>
                }
              />

              {/* Member 2: Citizen Portal Routes */}
              <Route
                path="/citizen/dashboard"
                element={
                  <AppShell>
                    <CitizenDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/citizen/requests"
                element={
                  <AppShell>
                    <CitizenDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/citizen/create-request"
                element={
                  <AppShell>
                    <CreateRequestPage />
                  </AppShell>
                }
              />
              <Route
                path="/request/new"
                element={
                  <AppShell>
                    <CreateRequestPage />
                  </AppShell>
                }
              />
              <Route
                path="/citizen/safety-guide"
                element={
                  <AppShell>
                    <SafetyGuidePage />
                  </AppShell>
                }
              />
              <Route
                path="/citizen/safety-guide/:id"
                element={
                  <AppShell>
                    <SafetyGuideDetailPage />
                  </AppShell>
                }
              />

              {/* Member 3: Crisis Coordination & Incidents Routes */}
              <Route
                path="/coordinator/dashboard"
                element={
                  <AppShell>
                    <CoordinatorDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/coordinator/incidents"
                element={
                  <AppShell>
                    <IncidentsPage />
                  </AppShell>
                }
              />
              <Route
                path="/requests/:id"
                element={
                  <AppShell>
                    <RequestDetailPage />
                  </AppShell>
                }
              />
              <Route
                path="/coordinator/requests/:id"
                element={
                  <AppShell>
                    <RequestDetailPage />
                  </AppShell>
                }
              />

              {/* Member 4: Logistics, Shelters & Resources Routes */}
              <Route
                path="/shelters"
                element={
                  <AppShell>
                    <SheltersPage />
                  </AppShell>
                }
              />
              <Route
                path="/resources"
                element={
                  <AppShell>
                    <ResourcesPage />
                  </AppShell>
                }
              />

              {/* Member 5: Explainable AI Decision Review */}
              <Route
                path="/coordinator/ai-review"
                element={
                  <AppShell>
                    <CoordinatorAIReviewPage />
                  </AppShell>
                }
              />

              {/* Member 6: GIS Map, Volunteers & Donations Routes */}
              <Route
                path="/map"
                element={
                  <AppShell>
                    <InteractiveMapPage />
                  </AppShell>
                }
              />
              <Route
                path="/volunteers"
                element={
                  <AppShell>
                    <VolunteersPage />
                  </AppShell>
                }
              />
              <Route
                path="/volunteer/dashboard"
                element={
                  <AppShell>
                    <VolunteerDashboard />
                  </AppShell>
                }
              />
              <Route
                path="/donations"
                element={
                  <AppShell>
                    <DonationsPage />
                  </AppShell>
                }
              />
              <Route
                path="/donor/dashboard"
                element={
                  <AppShell>
                    <DonorDashboard />
                  </AppShell>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
