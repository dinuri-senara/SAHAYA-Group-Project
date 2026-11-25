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
  ExternalLink,
  PackagePlus,
  Truck,
  Send,
  Clock,
  X,
  Edit3
} from 'lucide-react';
import { Shelter, AssistanceRequest, ShelterSupplyRequest, ResourceCategory } from '../types';
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

  // Tabs: 'shelters' | 'supply-requisitions'
  const [activeShelterTab, setActiveShelterTab] = useState<'shelters' | 'supply-requisitions'>('shelters');

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

  // Supply Requisitions State (Coursework Spec Page 4 - Section 1.1 F)
  const [supplyRequests, setSupplyRequests] = useState<ShelterSupplyRequest[]>([]);
  const [loadingSupplies, setLoadingSupplies] = useState(false);
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [selectedSupplyShelter, setSelectedSupplyShelter] = useState<Shelter | null>(null);
  const [isSubmittingSupply, setIsSubmittingSupply] = useState(false);
  const [supplyForm, setSupplyForm] = useState({
    category: 'DrinkingWater' as ResourceCategory,
    itemName: 'Clean Bottled Drinking Water (5L)',
    quantityRequested: 150,
    unit: 'Bottles',
    urgency: 'Critical' as 'Low' | 'Medium' | 'High' | 'Critical',
    justification: '',
    sourceDepot: 'Central Logistics Depot - Colombo'
  });

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

  const isCoordinatorOrAdmin = user?.role === 'Coordinator' || user?.role === 'Admin' || user?.role === 'ShelterAdmin' || user?.role === 'LogisticsManager';
  // Shelter Administrators, Logistics Managers, Coordinators, and Admins can manage shelters and requisition relief supplies
  const canManageShelters = user?.role === 'ShelterAdmin' || user?.role === 'Admin' || user?.role === 'LogisticsManager' || user?.role === 'Coordinator';

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

  const loadSupplyRequests = async () => {
    try {
      setLoadingSupplies(true);
      const data = await api.getShelterSupplyRequests();
      setSupplyRequests(data);
    } catch (err: any) {
      console.error('Failed to load shelter supply requests:', err);
    } finally {
      setLoadingSupplies(false);
    }
  };

  useEffect(() => {
    loadShelters();
    loadSupplyRequests();
  }, []);

  const openSupplyModal = (shelter: Shelter) => {
    setSelectedSupplyShelter(shelter);
    setSupplyForm({
      category: 'DrinkingWater',
      itemName: 'Clean Bottled Drinking Water (5L)',
      quantityRequested: 150,
      unit: 'Bottles',
      urgency: shelter.availableCapacity <= 10 ? 'Critical' : 'High',
      justification: `Shelter "${shelter.name}" is sheltering ${shelter.currentOccupancy} evacuees (${shelter.availableCapacity} beds remaining). Immediate relief supplies required.`,
      sourceDepot: 'Central Logistics Depot - Colombo'
    });
    setShowSupplyModal(true);
  };

  const handleCreateSupplyRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplyShelter) return;
    setIsSubmittingSupply(true);
    setError(null);
    try {
      await api.createShelterSupplyRequest({
        shelterId: selectedSupplyShelter.id,
        shelterName: selectedSupplyShelter.name,
        category: supplyForm.category,
        itemName: supplyForm.itemName,
        quantityRequested: Number(supplyForm.quantityRequested),
        unit: supplyForm.unit,
        urgency: supplyForm.urgency,
        justification: supplyForm.justification,
        sourceDepot: supplyForm.sourceDepot,
        requestedBy: user?.fullName || user?.email || 'Shelter Administrator'
      });
      setSuccessMsg(`Relief supply requisition submitted for "${selectedSupplyShelter.name}"! Central Logistics Depot notified.`);
      setShowSupplyModal(false);
      loadSupplyRequests();
    } catch (err: any) {
      setError(err.message || 'Failed to submit supply requisition.');
    } finally {
      setIsSubmittingSupply(false);
    }
  };

  const openEditModal = (shelter: Shelter) => {
    setSelectedShelter(shelter);
    setEditForm({
      totalCapacity: shelter.totalCapacity || shelter.capacity || 50,
      currentOccupancy: shelter.currentOccupancy || 0,
      status: (shelter.status as 'Active' | 'Full' | 'Closed') || 'Active',
      facilities: (shelter.facilities || []).join(', '),
      accessibilityInfo: shelter.accessibilityInfo || '',
      contactPhone: shelter.contactPhone || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateShelter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShelter) return;
    setIsUpdating(true);
    setError(null);
    try {
      const cap = Math.max(1, Number(editForm.totalCapacity));
      const occ = Math.min(cap, Math.max(0, Number(editForm.currentOccupancy)));
      const avail = Math.max(0, cap - occ);
      const facilitiesList = editForm.facilities.split(',').map(f => f.trim()).filter(Boolean);
      const computedStatus = editForm.status === 'Closed' ? 'Closed' : avail === 0 ? 'Full' : 'Active';

      await api.updateShelter(selectedShelter.id, {
        totalCapacity: cap,
        capacity: cap,
        currentOccupancy: occ,
        availableCapacity: avail,
        status: computedStatus,
        facilities: facilitiesList,
        accessibilityInfo: editForm.accessibilityInfo,
        contactPhone: editForm.contactPhone
      });
      setSuccessMsg(`Shelter "${selectedShelter.name}" updated successfully!`);
      setShowEditModal(false);
      loadShelters();
    } catch (err: any) {
      setError(err.message || 'Failed to update shelter.');
    } finally {
      setIsUpdating(false);
    }
  };

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

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          onClick={() => setActiveShelterTab('shelters')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all ${activeShelterTab === 'shelters'
            ? 'border-teal-500 text-teal-600 dark:text-teal-400'
            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          <Home className="w-4 h-4" />
          Safe Shelters & Camps ({shelters.length})
        </button>
        <button
          onClick={() => setActiveShelterTab('supply-requisitions')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all ${activeShelterTab === 'supply-requisitions'
            ? 'border-amber-500 text-amber-600 dark:text-amber-400'
            : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          <Truck className="w-4 h-4" />
          Camp Supply Requisitions ({supplyRequests.length})
        </button>
      </div>

      {/* ================= TAB 1: SHELTERS DIRECTORY & MAP ================= */}
      {activeShelterTab === 'shelters' && (
        <div className="space-y-6">
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

                    {/* Shelter Administrator / Admin / Logistics action buttons OR Citizen request placement button */}
                    {canManageShelters ? (
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                        <button
                          onClick={() => openSupplyModal(shelter)}
                          title="Requisition relief supplies from logistics depots"
                          className="py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-all shadow-xs"
                        >
                          <PackagePlus className="w-3.5 h-3.5 text-amber-600" />
                          <span>Request Aid</span>
                        </button>
                        <button
                          disabled={isFull}
                          onClick={() => openAssignModal(shelter)}
                          className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${isFull
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs shadow-teal-600/20'
                            }`}
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{isFull ? 'Camp Full' : 'Assign'}</span>
                        </button>
                        <button
                          onClick={() => openEditModal(shelter)}
                          title="Manage Capacity, Facilities & Status"
                          className="py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Manage</span>
                        </button>
                      </div>
                    ) : user?.role === 'Citizen' && !isFull && (
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link
                          to={`/citizen/create-request?category=4&shelterName=${encodeURIComponent(shelter.name)}`}
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all"
                        >
                          <Home className="w-3.5 h-3.5" />
                          Request Shelter Placement
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SHELTER RELIEF SUPPLY REQUISITIONS ================= */}
      {/* Coursework Requirement Page 4 & 11: "Request additional resources when capacity or supplies are insufficient." */}
      {activeShelterTab === 'supply-requisitions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Truck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Shelter Safe Haven Relief Supply Requisitions
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Coursework Mandate (Page 4 - 1.1 F): Safe haven camp administrators request emergency rations, clean water, medical kits, and blankets directly from central logistics depots when camp capacity or supplies are strained.
                </p>
              </div>
            </div>

            {canManageShelters && shelters.length > 0 && (
              <button
                onClick={() => openSupplyModal(shelters[0])}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs shrink-0 self-start sm:self-auto"
              >
                <PackagePlus className="w-4 h-4" />
                New Requisition
              </button>
            )}
          </div>

          {loadingSupplies ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading shelter relief supply requisitions...</p>
            </div>
          ) : supplyRequests.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Truck className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 dark:text-white">No Active Shelter Supply Requisitions</h3>
              <p className="text-xs text-slate-500 mt-1">
                All safe haven emergency shelters currently report sufficient inventories.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                      <th className="px-5 py-3.5">Shelter Safe Haven</th>
                      <th className="px-5 py-3.5">Requested Relief Supply</th>
                      <th className="px-5 py-3.5">Quantity</th>
                      <th className="px-5 py-3.5">Source Logistics Depot</th>
                      <th className="px-5 py-3.5">Urgency</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5">Requested By & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {supplyRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{req.shelterName}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">ID: {req.shelterId}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900 dark:text-white">{req.itemName}</p>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {req.category}
                          </span>
                          <p className="text-[11px] text-slate-500 mt-1 italic max-w-xs line-clamp-1" title={req.justification}>
                            "{req.justification}"
                          </p>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-900 dark:text-white">
                          {req.quantityRequested.toLocaleString()} <span className="text-[11px] font-sans font-normal text-slate-500">{req.unit}</span>
                        </td>
                        <td className="px-5 py-4 text-slate-700 dark:text-slate-300 text-xs">
                          {req.sourceDepot}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${req.urgency === 'Critical'
                              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 animate-pulse'
                              : req.urgency === 'High'
                                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                                : 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20'
                              }`}
                          >
                            <AlertTriangle className="w-3 h-3" />
                            {req.urgency}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${req.status === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                              : req.status === 'Dispatched'
                                ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20'
                                : req.status === 'Approved'
                                  ? 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20'
                                  : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                              }`}
                          >
                            {req.status === 'Delivered' ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ) : req.status === 'Dispatched' ? (
                              <Truck className="w-3 h-3 text-blue-600" />
                            ) : (
                              <Clock className="w-3 h-3 text-amber-600" />
                            )}
                            {req.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs">
                          <p className="font-medium text-slate-700 dark:text-slate-300">{req.requestedBy}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{new Date(req.requestedAt).toLocaleString()}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
      {/* Modal: Shelter Supply Requisition */}
      {showSupplyModal && selectedSupplyShelter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Requisition Shelter Relief Supplies
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Request additional stock from Logistics Depots when supplies are insufficient
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSupplyModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target Shelter Safe Haven</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedSupplyShelter.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedSupplyShelter.address}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Occupancy Load</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">
                  {selectedSupplyShelter.currentOccupancy} / {selectedSupplyShelter.totalCapacity}
                </p>
                <p className="text-[11px] text-amber-600 font-medium">
                  {selectedSupplyShelter.availableCapacity} beds remaining
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateSupplyRequest} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Change Target Shelter (Optional)
                </label>
                <select
                  value={selectedSupplyShelter.id}
                  onChange={e => {
                    const found = shelters.find(s => s.id === e.target.value);
                    if (found) setSelectedSupplyShelter(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {shelters.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.availableCapacity} spots free)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Supply Category *
                  </label>
                  <select
                    value={supplyForm.category}
                    onChange={e => {
                      const cat = e.target.value as ResourceCategory;
                      let defaultItem = 'Clean Bottled Drinking Water (5L)';
                      let defaultUnit = 'Bottles';
                      if (cat === 'Food') { defaultItem = 'Ready-to-Eat Dry Meal Packs (Family)'; defaultUnit = 'Packs'; }
                      else if (cat === 'MedicalSupplies') { defaultItem = 'First Aid & Trauma Dressing Kits'; defaultUnit = 'Kits'; }
                      else if (cat === 'ShelterSupplies') { defaultItem = 'Thermal Fleece Blankets & Mattresses'; defaultUnit = 'Units'; }
                      else if (cat === 'Sanitation') { defaultItem = 'Sanitation & Hygiene Care Kits'; defaultUnit = 'Kits'; }
                      else if (cat === 'LogisticsEquipment') { defaultItem = 'Emergency LED Lanterns & Generator Fuel'; defaultUnit = 'Units'; }
                      setSupplyForm({ ...supplyForm, category: cat, itemName: defaultItem, unit: defaultUnit });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="DrinkingWater">Drinking Water</option>
                    <option value="Food">Food Rations</option>
                    <option value="MedicalSupplies">Medical Supplies</option>
                    <option value="ShelterSupplies">Shelter Supplies</option>
                    <option value="Sanitation">Sanitation & Hygiene</option>
                    <option value="LogisticsEquipment">Logistics Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Urgency Priority *
                  </label>
                  <select
                    value={supplyForm.urgency}
                    onChange={e => setSupplyForm({ ...supplyForm, urgency: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Critical">Critical (Immediate Depletion)</option>
                    <option value="High">High (Needed within 12h)</option>
                    <option value="Medium">Medium (Needed within 24h)</option>
                    <option value="Low">Low (Buffer Stock)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Item Description *
                </label>
                <input
                  required
                  type="text"
                  value={supplyForm.itemName}
                  onChange={e => setSupplyForm({ ...supplyForm, itemName: e.target.value })}
                  placeholder="e.g. Bottled Water 5L, Dry Rations, Blankets"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity Needed *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={supplyForm.quantityRequested}
                    onChange={e => setSupplyForm({ ...supplyForm, quantityRequested: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit of Measure *
                  </label>
                  <input
                    required
                    type="text"
                    value={supplyForm.unit}
                    onChange={e => setSupplyForm({ ...supplyForm, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dispatching Logistics Depot *
                </label>
                <select
                  value={supplyForm.sourceDepot}
                  onChange={e => setSupplyForm({ ...supplyForm, sourceDepot: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Central Logistics Depot - Colombo">Central Logistics Depot - Colombo</option>
                  <option value="Regional Relief Depot - Kandy">Regional Relief Depot - Kandy</option>
                  <option value="Southern Disaster Relief Hub - Galle">Southern Disaster Relief Hub - Galle</option>
                  <option value="Northern Disaster Depot - Jaffna">Northern Disaster Depot - Jaffna</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Crisis Justification / Capacity Context *
                </label>
                <textarea
                  required
                  rows={2}
                  value={supplyForm.justification}
                  onChange={e => setSupplyForm({ ...supplyForm, justification: e.target.value })}
                  placeholder="Explain why current shelter supplies or capacity are insufficient..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSupplyModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingSupply}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmittingSupply ? 'Submitting Requisition...' : 'Submit Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage / Update Shelter */}
      {showEditModal && selectedShelter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Manage Shelter & Facilities</h2>
            <p className="text-xs text-slate-500 mb-4">
              Update capacity, walk-in occupancy, facilities, and operational status for <strong className="text-slate-900 dark:text-white">{selectedShelter.name}</strong>.
            </p>

            <form onSubmit={handleUpdateShelter} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Capacity *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={editForm.totalCapacity}
                    onChange={e => setEditForm({ ...editForm, totalCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Operational Status</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Active">Active (Open)</option>
                    <option value="Full">Full (At Capacity)</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editForm.contactPhone}
                    onChange={e => setEditForm({ ...editForm, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Facilities (comma-separated)</label>
                <input
                  type="text"
                  value={editForm.facilities}
                  onChange={e => setEditForm({ ...editForm, facilities: e.target.value })}
                  placeholder="Clean Water, Medical Tent, Sanitation, Hot Meals"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Accessibility Information</label>
                <input
                  type="text"
                  value={editForm.accessibilityInfo}
                  onChange={e => setEditForm({ ...editForm, accessibilityInfo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
