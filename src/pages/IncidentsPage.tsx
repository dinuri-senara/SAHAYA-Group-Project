import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Plus,
  MapPin,
  Calendar,
  Flame,
  Waves,
  Mountain,
  Wind,
  Search,
  Filter,
  CheckCircle2,
  X,
  RotateCcw,
  Activity,
  Layers,
  Inbox
} from 'lucide-react';
import { CrisisEvent } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UrgencyBadge } from '../components/StatusBadge';
import { MapComponent } from '../components/MapComponent';
import { DistrictFilter } from '../components/DistrictFilter';
import { matchesLocationFilter } from '../data/sriLankaDistricts';

const DISASTER_TYPES = [
  'Flood',
  'Landslide',
  'Earthquake',
  'Storm',
  'Tsunami',
  'Drought',
  'Fire',
  'Industrial',
  'Other'
] as const;

const SEVERITY_LEVELS = [
  'Critical',
  'High',
  'Medium',
  'Low'
] as const;

const SEVERITY_ORDER: Record<string, number> = {
  Critical: 4,
  Severe: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export const IncidentsPage: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<CrisisEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Resolved'>('All');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Create Incident Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newIncident, setNewIncident] = useState({
    title: '',
    description: '',
    disasterType: 0, // Flood
    severity: 2, // High
    location: '',
    latitude: 6.9271,
    longitude: 79.8612,
    startDate: new Date().toISOString().split('T')[0]
  });
  const [isCreating, setIsCreating] = useState(false);

  const isCoordinatorOrAdmin = user?.role === 'Coordinator' || user?.role === 'Admin';

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCrisisEvents();
      setIncidents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load crisis incidents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      await api.createCrisisEvent({
        ...newIncident,
        disasterType: Number(newIncident.disasterType),
        severity: Number(newIncident.severity),
        latitude: Number(newIncident.latitude),
        longitude: Number(newIncident.longitude),
        startDate: new Date(newIncident.startDate).toISOString()
      });
      setSuccessMsg(`Crisis incident "${newIncident.title}" activated on emergency radar!`);
      setShowCreateModal(false);
      loadIncidents();
    } catch (err: any) {
      setError(err.message || 'Failed to register crisis event.');
    } finally {
      setIsCreating(false);
    }
  };

  const getDisasterIcon = (type?: string) => {
    switch ((type || '').toLowerCase()) {
      case 'flood':
        return <Waves className="w-5 h-5 text-blue-500" />;
      case 'landslide':
        return <Mountain className="w-5 h-5 text-amber-600" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'storm':
        return <Wind className="w-5 h-5 text-cyan-500" />;
      case 'earthquake':
        return <Activity className="w-5 h-5 text-orange-500" />;
      case 'tsunami':
        return <Waves className="w-5 h-5 text-teal-500" />;
      case 'drought':
        return <Flame className="w-5 h-5 text-yellow-600" />;
      case 'industrial':
        return <AlertTriangle className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertOctagon className="w-5 h-5 text-teal-500" />;
    }
  };

  // Task 2: Simple Severity Badge (Critical: Red, High: Orange, Medium: Yellow, Low: Green)
  const renderSeverityBadge = (severity: string) => {
    const norm = severity === 'Severe' ? 'Critical' : severity;
    if (norm === 'Low') {
      return (
        <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-md border bg-emerald-50 text-emerald-700 border-emerald-300 px-2.5 py-1 text-xs">
          Low
        </span>
      );
    }
    return <UrgencyBadge urgency={norm} />;
  };

  // Safe date parser for sorting and display
  const getIncidentTimestamp = (inc: CrisisEvent): number => {
    const rawDate = inc.startDate || inc.startedAt || inc.createdAt;
    if (!rawDate) return 0;
    const parsed = new Date(rawDate).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatDeclaredDate = (inc: CrisisEvent): string => {
    const rawDate = inc.startDate || inc.startedAt || inc.createdAt;
    if (!rawDate) return 'Date unspecified';
    const parsed = new Date(rawDate);
    return isNaN(parsed.getTime()) ? 'Date unspecified' : parsed.toLocaleDateString();
  };

  // Clear all search and filter controls
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('All');
    setSelectedSeverity('All');
    setStatusFilter('All');
    setSelectedProvince('All');
    setSelectedDistrict('All');
  };

  const isFiltered =
    searchTerm.trim().length > 0 ||
    selectedType !== 'All' ||
    selectedSeverity !== 'All' ||
    statusFilter !== 'All' ||
    selectedProvince !== 'All' ||
    selectedDistrict !== 'All';

  // Task 1 Filtering and Automatic Sorting
  const filteredIncidents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    // 1. Filter without mutating original array
    const filtered = incidents.filter(inc => {
      // 1. Search by Incident ID, Title, Description, Location
      const matchesSearch = !query || (
        (inc.id && inc.id.toLowerCase().includes(query)) ||
        (inc.title && inc.title.toLowerCase().includes(query)) ||
        (inc.description && inc.description.toLowerCase().includes(query)) ||
        (inc.location && inc.location.toLowerCase().includes(query))
      );

      // 2. Disaster Type Filter
      const matchesType = selectedType === 'All' || inc.disasterType === selectedType;

      // 3. Severity Filter
      const matchesSeverity = selectedSeverity === 'All' ||
        inc.severity === selectedSeverity ||
        (selectedSeverity === 'Critical' && inc.severity === 'Severe');

      // 4. Status Filter (Active / Resolved)
      const isIncActive = inc.isActive !== undefined ? inc.isActive : inc.status === 'Active';
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Active' && isIncActive) ||
        (statusFilter === 'Resolved' && !isIncActive);

      // 5. Province and District Geographic Filters
      const matchesGeo = matchesLocationFilter(inc.location, selectedProvince, selectedDistrict);

      return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesGeo;
    });

    // 6. Automatic Sorting: Critical -> High -> Medium -> Low, oldest active first
    return [...filtered].sort((a, b) => {
      const weightA = SEVERITY_ORDER[a.severity] || 0;
      const weightB = SEVERITY_ORDER[b.severity] || 0;

      // Primary sort: Severity descending
      if (weightB !== weightA) {
        return weightB - weightA;
      }

      // Secondary sort: Active incidents prioritized, then oldest first
      const isAActive = a.isActive !== undefined ? a.isActive : a.status === 'Active';
      const isBActive = b.isActive !== undefined ? b.isActive : b.status === 'Active';

      if (isAActive && !isBActive) return -1;
      if (!isAActive && isBActive) return 1;

      // Oldest incident first (ascending timestamp)
      const dateA = getIncidentTimestamp(a);
      const dateB = getIncidentTimestamp(b);
      return dateA - dateB;
    });
  }, [incidents, searchTerm, selectedType, selectedSeverity, statusFilter, selectedProvince, selectedDistrict]);

  // Overall KPI statistics
  const activeCount = incidents.filter(i => i.isActive || i.status === 'Active').length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical' || i.severity === 'Severe').length;
  const totalImpactedRequests = incidents.reduce((acc, i) => acc + (i.totalRequests || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <AlertOctagon className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Crisis Incidents & Disaster Operations
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Active disaster theaters, geographic impact zones, and emergency resource coordination.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Map View
            </button>
          </div>

          {isCoordinatorOrAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-sm transition-all shadow-rose-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Declare Crisis Event
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Crisis Theaters</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{incidents.length}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Logged disaster records</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Disaster Operations</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{activeCount}</p>
          <p className="text-[11px] text-rose-500 mt-1">Under ongoing relief command</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Critical Severity Events</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{criticalCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Highest priority emergencies</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Associated Citizen Requests</p>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">{totalImpactedRequests}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Aid appeals registered</p>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-bold text-rose-700 hover:underline cursor-pointer">Dismiss</button>
        </div>
      )}

      {/* Search and Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Row 1: Search & Clear Button */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search incidents by ID, title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {isFiltered && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 rounded-xl transition cursor-pointer shrink-0 self-end sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        {/* Row 2: Disaster Type, Severity, and Status Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
          {/* Disaster Type Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Disaster Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            >
              <option value="All">All Disaster Types ({incidents.length})</option>
              {DISASTER_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Severity Level
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            >
              <option value="All">All Severities</option>
              {SEVERITY_LEVELS.map(sev => (
                <option key={sev} value={sev}>
                  {sev} Severity
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Operational Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'All' | 'Active' | 'Resolved')}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            >
              <option value="All">All Incidents</option>
              <option value="Active">Active Incidents Only</option>
              <option value="Resolved">Resolved Incidents</option>
            </select>
          </div>
        </div>
      </div>

      {/* District / Province Filter */}
      <DistrictFilter
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        onProvinceChange={setSelectedProvince}
        onDistrictChange={setSelectedDistrict}
        resultCount={filteredIncidents.length}
        totalCount={incidents.length}
        label="Disaster Incident Zone / ආපදා සිදුවීම් කලාපය"
      />

      {/* Content Rendering */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Tracking active emergency events...</p>
        </div>
      ) : incidents.length === 0 ? (
        /* Empty state: No incidents exist in system at all */
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/70 dark:bg-slate-900/70">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3.5">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Crisis Incidents Recorded</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
            There are currently no disaster operational theaters registered in the platform database.
          </p>
          {isCoordinatorOrAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Declare First Crisis Event
            </button>
          )}
        </div>
      ) : filteredIncidents.length === 0 ? (
        /* Empty state: Filters produced no matches */
        <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/70 dark:bg-slate-900/70">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3.5">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No Incidents Found</h3>
          <p className="text-xs text-slate-500 max-w-md mt-1 leading-relaxed">
            No crisis events match your active search keyword, disaster type, severity, or location filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Active Filters
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
          <MapComponent
            incidents={filteredIncidents}
            center={[6.9271, 79.8612]}
            zoom={8}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIncidents.map(inc => {
            const isIncActive = inc.isActive !== undefined ? inc.isActive : inc.status === 'Active';
            const urgencyDisplay = inc.severity === 'Severe' ? 'Critical' : inc.severity;
            const isCriticalActive = isIncActive && urgencyDisplay === 'Critical';

            return (
              <div
                key={inc.id}
                className={`flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-xs transition-all duration-200 border ${
                  isCriticalActive
                    ? 'border-red-400 dark:border-red-500/80'
                    : 'border-slate-200 dark:border-slate-800 hover:border-rose-500/50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {getDisasterIcon(inc.disasterType)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{inc.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{inc.disasterType || 'Disaster Event'}</span>
                          <span className="text-[10px] font-mono text-slate-400">#{inc.id}</span>
                        </div>
                      </div>
                    </div>
                    {renderSeverityBadge(inc.severity)}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {inc.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{inc.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Declared: {formatDeclaredDate(inc)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    {inc.totalRequests ?? 0} assistance requests linked
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isIncActive
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                  }`}>
                    {isIncActive ? 'Active Theater' : 'Resolved'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Create Incident */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Declare Emergency Incident</h2>
            <p className="text-xs text-slate-500 mb-4">Activate a new disaster operational theater for humanitarian coordination.</p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Incident Title *</label>
                <input
                  required
                  type="text"
                  value={newIncident.title}
                  onChange={e => setNewIncident({ ...newIncident, title: e.target.value })}
                  placeholder="e.g. Kelani River Severe Flash Flooding"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Disaster Type *</label>
                  <select
                    value={newIncident.disasterType}
                    onChange={e => setNewIncident({ ...newIncident, disasterType: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value={0}>Flood</option>
                    <option value={1}>Landslide</option>
                    <option value={2}>Earthquake</option>
                    <option value={3}>Storm</option>
                    <option value={4}>Tsunami</option>
                    <option value={5}>Drought</option>
                    <option value={6}>Fire</option>
                    <option value={7}>Industrial</option>
                    <option value={8}>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Severity Level *</label>
                  <select
                    value={newIncident.severity}
                    onChange={e => setNewIncident({ ...newIncident, severity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
                    <option value={3}>Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Affected Location / Sector *</label>
                <input
                  required
                  type="text"
                  value={newIncident.location}
                  onChange={e => setNewIncident({ ...newIncident, location: e.target.value })}
                  placeholder="e.g. Kolonnawa & Wellampitiya Divisions"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Epicenter Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newIncident.latitude}
                    onChange={e => setNewIncident({ ...newIncident, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Epicenter Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newIncident.longitude}
                    onChange={e => setNewIncident({ ...newIncident, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Crisis Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newIncident.description}
                  onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
                  placeholder="Detail the hazard type, rainfall levels, population at risk, evacuation routes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? 'Declaring...' : 'Declare Incident'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
