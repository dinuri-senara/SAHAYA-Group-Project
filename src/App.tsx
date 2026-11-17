import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { AppShell } from './components/AppShell';

// Pages
import { ModernDashboard } from './pages/ModernDashboard';
import { CoordinatorAIReviewPage } from './pages/CoordinatorAIReviewPage';
import { CoordinatorDashboard } from './pages/CoordinatorDashboard';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CreateRequestPage } from './pages/CreateRequestPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { RequestDetailPage } from './pages/RequestDetailPage';
import { SafetyGuidePage } from './pages/SafetyGuidePage';
import { SafetyGuideDetailPage } from './pages/SafetyGuideDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

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
            <AppShell>
              <Routes>
                {/* Modern Command Dashboard */}
                <Route path="/" element={<ModernDashboard />} />
                <Route path="/dashboard" element={<ModernDashboard />} />

                {/* AI Decision Review & Notifications (Member 5) */}
                <Route path="/ai-review" element={<CoordinatorAIReviewPage />} />
                <Route path="/coordinator/ai-review" element={<CoordinatorAIReviewPage />} />

                {/* Coordinator Command Center (Member 3) */}
                <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/requests/:id" element={<RequestDetailPage />} />

                {/* Citizen Assistance Portal (Member 2) */}
                <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
                <Route path="/citizen/create-request" element={<CreateRequestPage />} />
                <Route path="/create-request" element={<CreateRequestPage />} />
                <Route path="/citizen/safety-guide" element={<SafetyGuidePage />} />
                <Route path="/safety-guide" element={<SafetyGuidePage />} />
                <Route path="/citizen/safety-guide/:id" element={<SafetyGuideDetailPage />} />

                {/* Authentication */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
