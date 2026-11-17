import React, { useState, useEffect } from 'react';
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
  Layers,
  ArrowRight
} from 'lucide-react';
import { CrisisEvent } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UrgencyBadge } from '../components/StatusBadge';
import { MapComponent } from '../components/MapComponent';

export const IncidentsPage: React.FC = () => {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<CrisisEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOnly, setActiveOnly] = useState<boolean>(true);
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

  const getDisasterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'flood':
        return <Waves className="w-5 h-5 text-blue-500" />;
      case 'landslide':
        return <Mountain className="w-5 h-5 text-amber-600" />;
      case 'fire':
        return <Flame className="w-5 h-5 text-rose-500" />;
      case 'storm':
        return <Wind className="w-5 h-5 text-cyan-500" />;
      default:
        return <AlertOctagon className="w-5 h-5 text-teal-500" />;
    }
  };

  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          inc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActive = activeOnly ? inc.isActive : true;
    return matchesSearch && matchesActive;
  });

  const activeCount = incidents.filter(i => i.isActive).length;
  const criticalCount = incidents.filter(i => i.severity === 'Critical').length;
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-sm transition-all shadow-rose-600/20"
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
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{criticalCount}</p>
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
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-bold text-rose-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search crisis events by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <button
          onClick={() => setActiveOnly(!activeOnly)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeOnly
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          {activeOnly ? 'Active Incidents Only' : 'Showing All Incidents'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Tracking active emergency events...</p>
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
          {filteredIncidents.map(inc => (
            <div
              key={inc.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-rose-500/50 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                      {getDisasterIcon(inc.disasterType)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{inc.title}</h3>
                      <p className="text-xs text-slate-500">{inc.disasterType}</p>
                    </div>
                  </div>
                  <UrgencyBadge urgency={inc.severity} />
                </div>

                <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                  {inc.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">{inc.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Declared: {new Date(inc.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  {inc.totalRequests} assistance requests linked
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  inc.isActive
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse'
                    : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                }`}>
                  {inc.isActive ? 'Active Theater' : 'Resolved'}
                </span>
              </div>
            </div>
          ))}
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
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
