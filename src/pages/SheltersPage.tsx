import React, { useState, useEffect } from 'react';
import {
  Home,
  MapPin,
  Phone,
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  Check,
  Shield,
  Layers,
  Map as MapIcon,
  List,
  ExternalLink
} from 'lucide-react';
import { Shelter, AssistanceRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MapComponent } from '../components/MapComponent';
import { DistrictFilter } from '../components/DistrictFilter';
import { matchesLocationFilter } from '../data/sriLankaDistricts';

export const SheltersPage: React.FC = () => {
  const { user } = useAuth();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Full'>('All');
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);

  // Requests available for assignment
  const [pendingRequests, setPendingRequests] = useState<AssistanceRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [assignCount, setAssignCount] = useState<number>(1);
  const [isAssigning, setIsAssigning] = useState(false);

  // New shelter form
  const [newShelter, setNewShelter] = useState({
    name: '',
    address: '',
    latitude: 6.9271,
    longitude: 79.8612,
    totalCapacity: 50,
    facilities: 'Clean Drinking Water, First Aid, Medical Officer, Sanitized Bedding',
    accessibilityInfo: 'Wheelchair ramp available on ground floor',
    contactPhone: '+94 11 234 5678'
  });
  const [isCreating, setIsCreating] = useState(false);

  const isCoordinatorOrAdmin = user?.role === 'Coordinator' || user?.role === 'Admin' || user?.role === 'ShelterAdmin';
  // Strict Security Guard: Only authentic Shelter Administrators or System Admins can register shelters or assign persons
  const canManageShelters = user?.role === 'ShelterAdmin' || user?.role === 'Admin';

  const loadShelters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getShelters();
      setShelters(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load shelters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShelters();
  }, []);

  const openAssignModal = async (shelter: Shelter) => {
    setSelectedShelter(shelter);
    setShowAssignModal(true);
    try {
      const requests = await api.getRequests({ category: 'EmergencyShelter' });
      // Filter requests that are approved or under review and not yet resolved
      const eligible = requests.filter(r => r.status === 'Approved' || r.status === 'UnderReview' || r.status === 'Submitted');
      setPendingRequests(eligible);
      if (eligible.length > 0) {
        setSelectedRequestId(eligible[0].id);
        setAssignCount(eligible[0].affectedCount || 1);
      }
    } catch {
      // Fallback
    }
  };

  const handleCreateShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      const facilitiesList = newShelter.facilities.split(',').map(f => f.trim()).filter(Boolean);
      await api.createShelter({
        ...newShelter,
        totalCapacity: Number(newShelter.totalCapacity),
        facilities: facilitiesList
      });
      setSuccessMsg(`Shelter "${newShelter.name}" registered successfully!`);
      setShowCreateModal(false);
      loadShelters();
    } catch (err: any) {
      setError(err.message || 'Failed to create shelter.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAssignCitizen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShelter || !selectedRequestId) return;

    if (assignCount > selectedShelter.availableCapacity) {
      setError(`Cannot assign ${assignCount} people. Only ${selectedShelter.availableCapacity} spots available.`);
      return;
    }

    setIsAssigning(true);
    setError(null);
    try {
      await api.assignToShelter(selectedShelter.id, {
        assistanceRequestId: selectedRequestId,
        numberOfPeople: Number(assignCount)
      });
      setSuccessMsg(`Assigned ${assignCount} people to ${selectedShelter.name}. Capacity updated safely!`);
      setShowAssignModal(false);
      loadShelters();
    } catch (err: any) {
      setError(err.message || 'Failed to assign citizen to shelter.');
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredShelters = shelters.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.facilities.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' ? true : s.status === statusFilter;
    const matchesGeo = matchesLocationFilter(s.address, selectedProvince, selectedDistrict);
    return matchesSearch && matchesStatus && matchesGeo;
  });

  const totalCap = shelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalOcc = shelters.reduce((acc, s) => acc + s.currentOccupancy, 0);
  const totalAvail = shelters.reduce((acc, s) => acc + s.availableCapacity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Home className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Emergency Shelters & Safe Havens
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time verified safe zones, emergency shelters, and transactional capacity management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <List className="w-3.5 h-3.5" />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'map'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Map View
            </button>
          </div>

          {canManageShelters && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all shadow-teal-600/20"
            >
              <Plus className="w-4 h-4" />
              Register Shelter
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Shelters</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{shelters.length}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Verified safe structures</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Capacity</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalCap} beds</p>
          <p className="text-[11px] text-slate-500 mt-1">Maximum intake quota</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Current Occupancy</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{totalOcc} sheltered</p>
          <p className="text-[11px] text-slate-500 mt-1">{totalCap ? Math.round((totalOcc / totalCap) * 100) : 0}% aggregate occupancy</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Available Capacity</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{totalAvail} spots</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Ready for intake</p>
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

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by shelter name, address, or facility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {(['All', 'Active', 'Full'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === status
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* District / Province Filter */}
      <DistrictFilter
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        onProvinceChange={setSelectedProvince}
        onDistrictChange={setSelectedDistrict}
        resultCount={filteredShelters.length}
        totalCount={shelters.length}
        label="Shelter Regional Zone / දිස්ත්‍රික්කය අනුව ආරක්ෂිත කඳවුරු"
      />

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading emergency shelters...</p>
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[600px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs">
          <MapComponent
            shelters={filteredShelters}
            center={[6.9271, 79.8612]}
            zoom={10}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShelters.map((shelter) => {
            const occupancyPct = Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100);
            const isFull = shelter.availableCapacity <= 0 || shelter.status === 'Full';

            return (
              <div
                key={shelter.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all duration-200"
              >
                <div>
                  {/* Top card bar */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                        {shelter.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="line-clamp-1">{shelter.address}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${isFull
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : occupancyPct > 80
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        }`}
                    >
                      {isFull ? 'Full' : `${shelter.availableCapacity} spots left`}
                    </span>
                  </div>

                  {/* Occupancy bar */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                      <span className="text-slate-600 dark:text-slate-400">Capacity Load</span>
                      <span className="text-slate-900 dark:text-white">
                        {shelter.currentOccupancy} / {shelter.totalCapacity} ({occupancyPct}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isFull
                          ? 'bg-rose-500'
                          : occupancyPct > 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                          }`}
                        style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Facilities badges */}
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Available Facilities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {shelter.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Accessibility info */}
                  {shelter.accessibilityInfo && (
                    <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-teal-500" />
                      <span>{shelter.accessibilityInfo}</span>
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{shelter.contactPhone}</span>
                  </div>
                </div>

                {/* Shelter Administrator / Admin action button only */}
                {canManageShelters && (
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      disabled={isFull}
                      onClick={() => openAssignModal(shelter)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${isFull
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs shadow-teal-600/20'
                        }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      {isFull ? 'Capacity Reached' : 'Assign Citizen Request'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Register Shelter */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Register Safe Shelter</h2>
            <p className="text-xs text-slate-500 mb-4">Add a new verified emergency shelter safe zone to the national crisis registry.</p>

            <form onSubmit={handleCreateShelter} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Shelter Name *</label>
                <input
                  required
                  type="text"
                  value={newShelter.name}
                  onChange={e => setNewShelter({ ...newShelter, name: e.target.value })}
                  placeholder="e.g. St. Thomas Community Hall"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Address *</label>
                <input
                  required
                  type="text"
                  value={newShelter.address}
                  onChange={e => setNewShelter({ ...newShelter, address: e.target.value })}
                  placeholder="Full physical street address"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Capacity (Beds) *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newShelter.totalCapacity}
                    onChange={e => setNewShelter({ ...newShelter, totalCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone *</label>
                  <input
                    required
                    type="text"
                    value={newShelter.contactPhone}
                    onChange={e => setNewShelter({ ...newShelter, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newShelter.latitude}
                    onChange={e => setNewShelter({ ...newShelter, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={newShelter.longitude}
                    onChange={e => setNewShelter({ ...newShelter, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Facilities (comma-separated)</label>
                <input
                  type="text"
                  value={newShelter.facilities}
                  onChange={e => setNewShelter({ ...newShelter, facilities: e.target.value })}
                  placeholder="Medical, Clean Water, Warm Meals, Generator"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Accessibility Information</label>
                <input
                  type="text"
                  value={newShelter.accessibilityInfo}
                  onChange={e => setNewShelter({ ...newShelter, accessibilityInfo: e.target.value })}
                  placeholder="Wheelchair access, Special needs assistance..."
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
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  {isCreating ? 'Registering...' : 'Save Shelter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Assign Citizen to Shelter */}
      {showAssignModal && selectedShelter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Assign to Shelter</h2>
            <p className="text-xs text-slate-500 mb-4">
              Shelter: <strong className="text-slate-900 dark:text-white">{selectedShelter.name}</strong> ({selectedShelter.availableCapacity} spots available)
            </p>

            <form onSubmit={handleAssignCitizen} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Citizen Request</label>
                {pendingRequests.length === 0 ? (
                  <p className="text-xs text-amber-600 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                    No active emergency shelter requests currently pending in system.
                  </p>
                ) : (
                  <select
                    value={selectedRequestId}
                    onChange={e => {
                      setSelectedRequestId(e.target.value);
                      const req = pendingRequests.find(r => r.id === e.target.value);
                      if (req) setAssignCount(req.affectedCount || 1);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {pendingRequests.map(req => (
                      <option key={req.id} value={req.id}>
                        {req.title} ({req.citizenName} - {req.affectedCount} people)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Number of People to Admit</label>
                <input
                  type="number"
                  min="1"
                  max={selectedShelter.availableCapacity}
                  value={assignCount}
                  onChange={e => setAssignCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Server transaction checks capacity atomically to prevent over-allocation.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning || pendingRequests.length === 0}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs disabled:opacity-50"
                >
                  {isAssigning ? 'Admitting...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
