import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/AppShell';
import { PageHeader } from './components/PageHeader';
import { StatCard } from './components/StatCard';
import { StatusBadge } from './components/StatusBadge';
import { DataTable } from './components/DataTable';
import { Layers, ShieldCheck, Cpu, GitBranch } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

interface RoadmapItem {
  id: string;
  name: string;
  lead: string;
  status: 'Approved' | 'Pending';
  progress: string;
}

const OverviewPage: React.FC = () => {
  const sampleModules: RoadmapItem[] = [
    { id: 'M1', name: 'Core Architecture & Layout Shell', lead: 'Member 1', status: 'Approved', progress: 'Completed' },
    { id: 'M2', name: 'Authentication & Citizen Portal', lead: 'Member 2', status: 'Pending', progress: 'Next Up' },
    { id: 'M3', name: 'Incident Registry & Coordinator Hub', lead: 'Member 3', status: 'Pending', progress: 'Pending' },
    { id: 'M4', name: 'Inventory Depot & Safe Shelters', lead: 'Member 4', status: 'Pending', progress: 'Pending' },
    { id: 'M5', name: 'Explainable AI Review & Notifications', lead: 'Member 5', status: 'Pending', progress: 'Pending' },
    { id: 'M6', name: 'GIS Command Map & Volunteers', lead: 'Member 6', status: 'Pending', progress: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="SAHAYA Operational Command Architecture"
        subtitle="Core design system, responsive navigation shell, and enterprise primitives developed by Member 1."
        portalBadge="Lead Architect (Member 1)"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Architecture Phase"
          value="Phase 1"
          subtitle="Core Foundations"
          icon={<Layers className="w-5 h-5" />}
          trend="100% Core Shell"
          variant="success"
        />
        <StatCard
          title="System Readiness"
          value="Online"
          subtitle="Enterprise SLA"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="UI Primitives"
          value="11 Ready"
          subtitle="Reusable Design System"
          icon={<Cpu className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Active Branch"
          value="feature/core"
          subtitle="feature/frontend-core-admin"
          icon={<GitBranch className="w-5 h-5" />}
          variant="default"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-slate-800">Six-Member Modular Architecture Roadmap</h2>
          <p className="text-xs text-slate-500">Track implementation milestones across the distributed engineering team.</p>
        </div>
        <DataTable<RoadmapItem>
          keyExtractor={(item) => item.id}
          columns={[
            { key: 'id', header: 'Module ID', render: (item) => <span className="font-mono font-bold text-teal-600">{item.id}</span> },
            { key: 'name', header: 'Technical Focus', render: (item) => <span className="font-medium text-slate-900">{item.name}</span> },
            { key: 'lead', header: 'Assigned Lead', render: (item) => <span className="text-slate-600">{item.lead}</span> },
            { key: 'status', header: 'Architecture Status', render: (item) => <StatusBadge status={item.status} /> },
            { key: 'progress', header: 'Delivery Stage', render: (item) => <span className="text-xs font-semibold text-slate-500">{item.progress}</span> },
          ]}
          data={sampleModules}
        />
      </div>
    </div>
  );
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/admin/dashboard" element={<OverviewPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
