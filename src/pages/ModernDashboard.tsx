import React from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  Home,
  Users,
  AlertTriangle,
  Clock,
  MapPin,
  TrendingUp,
  Heart,
  ChevronRight,
  ArrowRight,
  Layers,
  ShieldCheck,
  Cpu,
  GitBranch
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

const chartData = [
  { time: '00:00', requests: 180 },
  { time: '04:00', requests: 220 },
  { time: '08:00', requests: 460 },
  { time: '12:00', requests: 890 },
  { time: '16:00', requests: 1120 },
  { time: '20:00', requests: 1248 },
];

interface RoadmapItem {
  id: string;
  name: string;
  lead: string;
  status: 'Approved' | 'Pending';
  progress: string;
}

export const ModernDashboard: React.FC = () => {
  const sampleModules: RoadmapItem[] = [
    { id: 'MOD-01', name: 'Core Architecture & Layout Shell', lead: 'Lead Architect', status: 'Approved', progress: 'Completed' },
    { id: 'MOD-02', name: 'Authentication & Citizen Portal', lead: 'Security & Citizen Lead', status: 'Approved', progress: 'Completed' },
    { id: 'MOD-03', name: 'Incident Registry & Coordinator Hub', lead: 'Crisis Coordinator', status: 'Pending', progress: 'In Progress' },
    { id: 'MOD-04', name: 'Inventory Depot & Safe Shelters', lead: 'Logistics Lead', status: 'Pending', progress: 'Pending' },
    { id: 'MOD-05', name: 'Explainable AI Review & Notifications', lead: 'AI Engineer', status: 'Pending', progress: 'Pending' },
    { id: 'MOD-06', name: 'GIS Command Map & Volunteers', lead: 'GIS & Field Lead', status: 'Pending', progress: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER USING SRI LANKAN FLOOD RESCUE ASSET */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[380px] flex flex-col justify-between p-6 sm:p-10 border border-white/40">
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
            Unifying citizens affected by disasters, emergency coordinators, volunteers, donors, and shelters into one synchronized operational command system.
          </p>
        </div>

        {/* 2. FOUR VIBRANT QUICK ACTION BUTTON CARDS (Fully Clickable Router Links) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          
          {/* Action 1: Blue - Incidents */}
          <Link
            to="/coordinator/incidents"
            className="group rounded-2xl bg-[#2563eb] text-white p-5 shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm leading-snug">View Crisis<br />Alerts</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Action 2: Red - Citizen Aid Request Wizard */}
          <Link
            to="/citizen/create-request"
            className="group rounded-2xl bg-[#ef4444] text-white p-5 shadow-lg shadow-red-600/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm leading-snug">Submit Aid<br />Request</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Action 3: Green - Find Shelters */}
          <Link
            to="/shelters"
            className="group rounded-2xl bg-[#10b981] text-white p-5 shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Home className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm leading-snug">Find Safe<br />Shelters</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Action 4: Purple - Volunteer Mobilization */}
          <Link
            to="/volunteers"
            className="group rounded-2xl bg-[#8b5cf6] text-white p-5 shadow-lg shadow-purple-600/30 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer flex flex-col justify-between min-h-[110px]"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm leading-snug">Volunteer<br />Mobilize</span>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. CORE ARCHITECTURE STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Architecture Phase"
          value="Phase 1 & 2"
          subtitle="Core Foundations & Citizen"
          icon={<Layers className="w-5 h-5" />}
          trend="100% Operational"
          variant="success"
        />
        <StatCard
          title="System Readiness"
          value="Online"
          subtitle="National SLA 99.9%"
          icon={<ShieldCheck className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="UI Design System"
          value="12 Ready"
          subtitle="Reusable Design System"
          icon={<Cpu className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Active Mode"
          value="Operations"
          subtitle="Command Center"
          icon={<GitBranch className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* 4. MAIN ANALYTICS & CRISIS MONITORING GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLUMNS: System Overview + Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* System Overview Chart */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-5 rounded-full bg-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">System Overview</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-lg px-3 py-1.5">
                Last 24 Hours
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                <span className="text-[11px] font-bold text-blue-600 uppercase">Total Requests</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">1,248</p>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" /> ↑ 12%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-600 uppercase">Resolved</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">892</p>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3 h-3" /> ↑ 8%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100">
                <span className="text-[11px] font-bold text-amber-600 uppercase">Pending</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">356</p>
                <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5 mt-1">
                  ↑ 5%
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100">
                <span className="text-[11px] font-bold text-purple-600 uppercase">Avg Response</span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">4.5h</p>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                  Fast SLA
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
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Recent System Activities</h3>
              </div>
              <Link to="/citizen/dashboard" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Assistance request #AR-1024</h4>
                    <span className="text-[11px] text-slate-400 font-medium">2m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">New request for emergency medical kit – Galle District</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">AI Triage Recommendation</h4>
                    <span className="text-[11px] text-slate-400 font-medium">5m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">High Priority Emergency (Confidence: 92%)</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Shelter Safe Zone Allocated</h4>
                    <span className="text-[11px] text-slate-400 font-medium">8m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Family of 5 assigned to Sunanda Shelter</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">Relief Donation Received</h4>
                    <span className="text-[11px] text-slate-400 font-medium">12m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Rs. 100,000 pledged from Global Care Relief Fund</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. ROADMAP DATA TABLE */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-800">Operational System Architecture Modules</h2>
              <p className="text-xs text-slate-500">Real-time status of integrated humanitarian services.</p>
            </div>
            <DataTable<RoadmapItem>
              keyExtractor={(item) => item.id}
              columns={[
                { key: 'id', header: 'Module ID', render: (item) => <span className="font-mono font-bold text-blue-600">{item.id}</span> },
                { key: 'name', header: 'Technical Focus', render: (item) => <span className="font-medium text-slate-900">{item.name}</span> },
                { key: 'lead', header: 'Lead Role', render: (item) => <span className="text-slate-600 font-medium">{item.lead}</span> },
                { key: 'status', header: 'Operational Status', render: (item) => <StatusBadge status={item.status} /> },
                { key: 'progress', header: 'Delivery Stage', render: (item) => <span className="text-xs font-semibold text-slate-500">{item.progress}</span> },
              ]}
              data={sampleModules}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Live Crisis Alert Card & Donation Campaign */}
        <div className="space-y-6">
          {/* Live Crisis Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-extrabold border border-rose-200/60">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Live Crisis Alert
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <Clock className="w-3 h-3" /> Updated: 2 min ago
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">Flood Emergency – Galle District</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Heavy monsoon rains have caused severe flooding in Galle and surrounding coastal areas.
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
                  Urgent: Food, Medicine and Shelter Needed
                </p>
                <p className="text-[11px] text-red-600 mt-0.5">High vulnerability population evacuated</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">Quick Stats</span>
                <Link to="/coordinator/incidents" className="text-xs font-bold text-blue-600 hover:underline">View Details →</Link>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-black text-slate-900">12,450</p>
                  <span className="text-[10px] text-slate-500 font-medium">Affected</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <Home className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <p className="text-sm font-black text-slate-900">24</p>
                  <span className="text-[10px] text-slate-500 font-medium">Shelters</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-4 h-4 text-amber-600 mx-auto mb-1 font-bold text-xs">📦</div>
                  <p className="text-sm font-black text-slate-900">8.5K</p>
                  <span className="text-[10px] text-slate-500 font-medium">Resources</span>
                </div>
              </div>
            </div>
          </div>

          {/* Relief Campaign Card */}
          <div className="relative rounded-3xl overflow-hidden shadow-md text-white p-6 min-h-[220px] flex flex-col justify-between group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800')`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

            <div className="relative z-10">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-black tracking-tight leading-tight">Stronger Together</h3>
              <p className="text-xs text-slate-200 mt-1 max-w-xs leading-relaxed">
                Your support helps us reach more citizens in need across flood-affected zones in Sri Lanka.
              </p>
            </div>

            <div className="relative z-10 pt-4">
              <Link
                to="/donations"
                className="w-full py-2.5 px-4 rounded-xl bg-[#2563eb] hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
              >
                <span>Donate Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
