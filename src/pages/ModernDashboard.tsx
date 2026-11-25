import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  Users,
  Home,
  Package,
  HeartHandshake,
  Clock,
  MapPin,
  TrendingUp,
  ArrowRight,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Bot,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { DataTable } from '../components/DataTable';
import { api } from '../services/api';
import { SystemOverviewReport } from '../types';

const chartData = [
  { time: '00:00', requests: 180 },
  { time: '04:00', requests: 220 },
  { time: '08:00', requests: 460 },
  { time: '12:00', requests: 890 },
  { time: '16:00', requests: 1120 },
  { time: '20:00', requests: 1248 },
];

interface OperationalZoneSummary {
  id: string;
  name: string;
  province: string;
  activeRequests: number;
  criticalTriage: number;
  sheltersOpen: number;
  depotStatus: 'Adequate' | 'Warning' | 'Critical';
}

export const ModernDashboard: React.FC = () => {
  const [overview, setOverview] = useState<SystemOverviewReport>({
    activeIncidents: 6,
    totalRequests: 1420,
    pendingRequests: 42,
    resolvedRequests: 1378,
    totalShelters: 18,
    totalShelterCapacity: 5000,
    shelterOccupancyPercentage: 74,
    totalDonationsRaised: 1845000,
    totalInKindDonations: 320,
    activeVolunteers: 65,
    totalRegisteredUsers: 480,
  });

  useEffect(() => {
    api.getSystemOverview()
      .then((data) => {
        if (data) setOverview(data);
      })
      .catch((err) => console.warn('Using baseline overview stats:', err));
  }, []);

  const crisisZones: OperationalZoneSummary[] = [
    { id: 'ZN-GALLE', name: 'Galle & Nilwala Basin', province: 'Southern Province', activeRequests: 142, criticalTriage: 18, sheltersOpen: 6, depotStatus: 'Warning' },
    { id: 'ZN-GAMPAHA', name: 'Kelani River - Gampaha & Ja-Ela', province: 'Western Province', activeRequests: 284, criticalTriage: 31, sheltersOpen: 8, depotStatus: 'Critical' },
    { id: 'ZN-RATNAPURA', name: 'Kalu Ganga - Ratnapura Flood Plain', province: 'Sabaragamuwa', activeRequests: 118, criticalTriage: 9, sheltersOpen: 4, depotStatus: 'Adequate' },
    { id: 'ZN-KALUTARA', name: 'Kalutara & Millaniya Lowlands', province: 'Western Province', activeRequests: 95, criticalTriage: 7, sheltersOpen: 3, depotStatus: 'Adequate' },
    { id: 'ZN-MATARA', name: 'Matara & Akuressa Sector', province: 'Southern Province', activeRequests: 160, criticalTriage: 14, sheltersOpen: 5, depotStatus: 'Warning' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER USING SRI LANKAN FLOOD RESCUE ASSET */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[220px] sm:min-h-[260px] flex flex-col justify-center p-6 sm:p-10 border border-white/40">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('/images/hero-flood-rescue.png')`,
            backgroundPosition: 'center 40%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b32]/95 via-[#0d1b32]/80 to-transparent sm:w-7/12" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b32]/90 via-transparent to-transparent h-32 bottom-0" />

        {/* Hero Branding Text */}
        <div className="relative z-10 max-w-xl space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
            <span>🇱🇰 Sri Lanka Disaster Management Command</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            SAHAYA Crisis Management Platform
          </h1>
          <p className="text-base sm:text-xl font-bold text-teal-400 tracking-wide">
            Coordinate. Prioritise. Assist.
          </p>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md leading-relaxed">
            National executive command overview: multi-agency relief operations, emergency request triage, depot allocations, and shelter safe zones.
          </p>
        </div>
      </div>

      {/* 2. OPERATIONAL HUMANITARIAN STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Crisis Incidents"
          value={overview.activeIncidents}
          subtitle="Monitored flood sectors"
          icon={<ShieldAlert className="w-5 h-5" />}
          trend="High Alert"
          variant="default"
        />
        <StatCard
          title="Total Aid Requests"
          value={overview.totalRequests.toLocaleString()}
          subtitle={`${overview.pendingRequests} awaiting dispatch`}
          icon={<Activity className="w-5 h-5" />}
          trend={`${overview.resolvedRequests} resolved`}
          variant="default"
        />
        <StatCard
          title="Safe Shelter Capacity"
          value={`${overview.shelterOccupancyPercentage || 0}%`}
          subtitle={`${overview.totalShelters || 0} active evacuation camps`}
          icon={<Home className="w-5 h-5" />}
          trend={`${(overview.totalShelterCapacity || 0).toLocaleString()} max capacity`}
          variant="default"
        />
        <StatCard
          title="Mobilized Aid Funds"
          value={`$${overview.totalDonationsRaised.toLocaleString()}`}
          subtitle={`${overview.totalInKindDonations} in-kind shipments`}
          icon={<HeartHandshake className="w-5 h-5" />}
          trend={`${overview.activeVolunteers} active volunteers`}
          variant="success"
        />
      </div>

      {/* 3. MAIN ANALYTICS & CRISIS MONITORING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: System Overview + Recent Activity + Crisis Zones */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* System Overview Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 rounded-full bg-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Real-Time Request Influx</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-lg px-3 py-1.5">
                Last 24 Hours
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                <span className="text-[11px] font-bold text-blue-600 uppercase">Total Requests</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{overview.totalRequests.toLocaleString()}</p>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" /> Influx Active
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Resolved</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{overview.resolvedRequests.toLocaleString()}</p>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <CheckCircle2 className="w-3 h-3" /> Complete
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                <span className="text-[11px] font-bold text-amber-600 uppercase">Pending Triage</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{overview.pendingRequests}</p>
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 mt-1">
                  Queue Priority
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                <span className="text-[11px] font-bold text-purple-600 uppercase">Avg Response</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">4.5h</p>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  Target SLA: 6h
                </span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none'
                    }}
                  />
                  <Line
                    type="natural"
                    dataKey="requests"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ fill: '#2563eb', r: 4, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Operational Activities Timeline */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-700" />
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Recent Crisis Dispatch Activities</h3>
              </div>
              <Link to="/coordinator/incidents" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                <span>View All Incidents</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Emergency Request #AR-1024</h4>
                    <span className="text-[11px] text-slate-400 font-medium">2m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">New high-priority medical & water request – Galle District</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">AI Triage Recommendation Confirmed</h4>
                    <span className="text-[11px] text-slate-400 font-medium">5m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Human coordinator approved: 50 ration packs dispatched</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Shelter Safe Zone Re-allocated</h4>
                    <span className="text-[11px] text-slate-400 font-medium">8m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Displaced family accommodated at Sunanda Temple Camp</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Inter-Agency Partner Delivery</h4>
                    <span className="text-[11px] text-slate-400 font-medium">12m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Sri Lanka Red Cross Society replenished Ja-Ela central medical depot</p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. OPERATIONAL CRISIS ZONES TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-800">Operational Crisis Sectors & Resource Depots</h2>
                <p className="text-xs text-slate-500">Active disaster zones requiring emergency resource dispatch.</p>
              </div>
              <Link to="/resources" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                Depot Inventory &rarr;
              </Link>
            </div>
            <DataTable<OperationalZoneSummary>
              keyExtractor={(item) => item.id}
              columns={[
                { key: 'id', header: 'Sector ID', render: (item) => <span className="font-mono font-bold text-blue-600">{item.id}</span> },
                { key: 'name', header: 'Crisis Zone & River Basin', render: (item) => <span className="font-medium text-slate-900">{item.name}</span> },
                { key: 'province', header: 'Province', render: (item) => <span className="text-slate-600 font-medium">{item.province}</span> },
                { key: 'activeRequests', header: 'Active Requests', render: (item) => <span className="font-bold text-slate-800">{item.activeRequests}</span> },
                {
                  key: 'criticalTriage',
                  header: 'Critical Urgency',
                  render: (item) => (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {item.criticalTriage} urgent
                    </span>
                  )
                },
                {
                  key: 'depotStatus',
                  header: 'Depot Stock',
                  render: (item) => {
                    const color = item.depotStatus === 'Adequate'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.depotStatus === 'Warning'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200';
                    return (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${color}`}>
                        {item.depotStatus}
                      </span>
                    );
                  }
                },
              ]}
              data={crisisZones}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Live Crisis Alert Card & Administrative Governance Panel */}
        <div className="space-y-6">
          {/* Live Crisis Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-extrabold border border-rose-200/60">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Priority Disaster Incident
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> Updated: 2 min ago
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Flood Emergency – Galle District</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Heavy monsoon rains have caused severe flooding in Galle and Nilwala basin, displacing coastal communities.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Galle, Southern Province, Sri Lanka</span>
            </div>

            <div className="rounded-2xl bg-red-50/80 border border-red-200/70 p-3.5 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-red-800 leading-tight">
                  Urgent: Drinking Water, Dry Rations & Tarpaulins
                </p>
                <p className="text-[11px] text-red-600 mt-0.5">High-vulnerability families awaiting rescue boats</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">Sector Tally</span>
                <Link to="/coordinator/incidents" className="text-xs font-bold text-blue-600 hover:underline">View Incident Details →</Link>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-black text-slate-900">12,450</p>
                  <span className="text-[10px] text-slate-500 font-medium">Displaced</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Home className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-sm font-black text-slate-900">24</p>
                  <span className="text-[10px] text-slate-500 font-medium">Safe Shelters</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-4 h-4 text-amber-600 mx-auto mb-1 font-bold text-xs">📦</div>
                  <p className="text-sm font-black text-slate-900">8.5K</p>
                  <span className="text-[10px] text-slate-500 font-medium">Aid Packs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Administrative Control Hub Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-teal-400" />
                <h3 className="text-sm font-extrabold">System Administration</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Governance Active
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Access the immutable compliance audit logs, runtime telemetry, and manage role-based permissions across platform accounts.
            </p>

            <div className="space-y-2 pt-2">
              <Link
                to="/admin/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Telemetry & Audit Logs</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/admin/users"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  <span>User Management (RBAC)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                to="/coordinator/ai-review"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>AI Decision Review & Governance</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
