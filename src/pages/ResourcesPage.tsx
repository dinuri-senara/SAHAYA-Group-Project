import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Warehouse,
  Truck,
  RotateCcw,
  ShieldAlert,
  Clock,
  Sparkles,
  Building2,
  Send,
  ExternalLink,
  Layers,
  TrendingUp,
  PackagePlus,
  X
} from 'lucide-react';
import { Resource, AssistanceRequest, PartnerRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { DistrictFilter } from '../components/DistrictFilter';
import { matchesLocationFilter } from '../data/sriLankaDistricts';

export const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'inventory' | 'partner-requests'>('inventory');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  // Allocation state
  const [pendingRequests, setPendingRequests] = useState<AssistanceRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [allocateQuantity, setAllocateQuantity] = useState<number>(10);
  const [allocationNotes, setAllocationNotes] = useState<string>('');
  const [isAllocating, setIsAllocating] = useState(false);

  // Create Resource form
  const [newResource, setNewResource] = useState({
    name: '',
    category: 0, // Food
    unit: 'Units',
    totalQuantity: 100,
    lowStockThreshold: 20,
    storageLocation: 'Central Disaster Relief Depot A',
    expiryDate: ''
  });
  const [isCreating, setIsCreating] = useState(false);

  // Partner Assistance Requisition form
  const [partnerForm, setPartnerForm] = useState({
    partnerName: 'Sri Lanka Red Cross Society (SLRCS)',
    partnerType: 'Humanitarian NGO',
    resourceCategory: 'DrinkingWater',
    itemName: 'Bottled Mineral Drinking Water (1L Bottles)',
    quantityRequested: 1000,
    unit: 'Bottles',
    priority: 'High' as 'Low' | 'Medium' | 'High' | 'Critical',
    deliveryLocation: 'Depot A - Kelaniya, Gampaha District',
    justification: 'Depot stock depleted due to intense localized flooding. External requisition required to support displaced families.',
    etaHours: 3
  });
  const [isSubmittingPartnerReq, setIsSubmittingPartnerReq] = useState(false);

  // Authorization check (Coordinators, Admins, and Logistics Managers can manage depot inventory)
  const isCoordinatorOrAdmin = user?.role === 'Coordinator' || user?.role === 'Admin' || user?.role === 'LogisticsManager';

  // Restock / Replenishment State (Coursework Spec Page 4 - Section 1.1 E: "Track quantities, availability, allocation, dispatch, utilisation, and replenishment.")
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedRestockResource, setSelectedRestockResource] = useState<Resource | null>(null);
  const [restockQty, setRestockQty] = useState<number>(100);
  const [restockBatch, setRestockBatch] = useState<string>('CONSIGNMENT-2026-A');
  const [restockSource, setRestockSource] = useState<string>('National Emergency Relief Buffer Reserve');
  const [restockNotes, setRestockNotes] = useState<string>('');
  const [isRestocking, setIsRestocking] = useState(false);

  const openRestockModal = (res: Resource) => {
    setSelectedRestockResource(res);
    setRestockQty(Math.max(res.lowStockThreshold || 50, 100));
    setRestockBatch(`BATCH-${Date.now().toString().slice(-6)}`);
    setRestockNotes('Inbound shipment verified by depot receiver');
    setShowRestockModal(true);
  };

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestockResource || restockQty <= 0) return;
    setIsRestocking(true);
    setError(null);
    try {
      const updated = await api.replenishResource(
        selectedRestockResource.id,
        restockQty,
        restockNotes,
        restockBatch
      );
      setResources(prev => prev.map(r => r.id === updated.id ? updated : r));
      setSuccessMsg(`Successfully replenished +${restockQty} ${selectedRestockResource.unit} of ${selectedRestockResource.name}! Available stock updated to ${updated.availableQuantity} ${selectedRestockResource.unit}.`);
      setShowRestockModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to replenish stock.');
    } finally {
      setIsRestocking(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [resData, partnerData] = await Promise.all([
        api.getResources(),
        api.getPartnerRequests()
      ]);
      setResources(resData);
      setPartnerRequests(partnerData);
    } catch (err: any) {
      setError(err.message || 'Failed to load depot data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper: Intelligent Alternative Resource Recommendation
  // Coursework Specification Page 4 & 10: "Provide alternative allocation recommendations when the preferred resource is unavailable."
  const getAlternativeRecommendation = (item: Resource, allItems: Resource[]): Resource | null => {
    if (item.availableQuantity > item.lowStockThreshold && item.availableQuantity > 0) {
      return null;
    }

    // 1. Same category with available stock
    const sameCatAlts = allItems.filter(
      r => r.id !== item.id && r.category === item.category && r.availableQuantity > 0
    );
    if (sameCatAlts.length > 0) {
      return [...sameCatAlts].sort((a, b) => b.availableQuantity - a.availableQuantity)[0];
    }

    // 2. Cross-category sensible fallbacks
    const crossCategoryFallbacks: Record<string, string[]> = {
      DrinkingWater: ['Sanitation', 'Food'],
      ShelterSupplies: ['LogisticsEquipment'],
      LogisticsEquipment: ['ShelterSupplies'],
      Food: ['DrinkingWater'],
      MedicalSupplies: ['Sanitation']
    };

    const fallbackCats = crossCategoryFallbacks[item.category] || [];
    const fallbackAlts = allItems.filter(
      r => r.id !== item.id && fallbackCats.includes(r.category) && r.availableQuantity > 0
    );
    if (fallbackAlts.length > 0) {
      return [...fallbackAlts].sort((a, b) => b.availableQuantity - a.availableQuantity)[0];
    }

    return null;
  };

  const openAllocateModal = async (res: Resource) => {
    setSelectedResource(res);
    setShowAllocateModal(true);
    setAllocateQuantity(Math.min(res.availableQuantity, 10));
    try {
      const reqs = await api.getRequests();
      const eligible = reqs.filter(r => r.status === 'Approved' || r.status === 'UnderReview' || r.status === 'Submitted');
      setPendingRequests(eligible);
      if (eligible.length > 0) {
        setSelectedRequestId(eligible[0].id);
      }
    } catch {
      // Fallback
    }
  };

  // Open Partner Requisition Modal pre-filled with resource shortage details
  // Coursework Specification Page 4 & 11: "Request assistance from partner organisations when capacity or supplies are insufficient."
  const openPartnerModalForResource = (res?: Resource) => {
    if (res) {
      const suggestedPartner =
        res.category === 'DrinkingWater'
          ? { name: 'Sri Lanka Red Cross Society (SLRCS)', type: 'Humanitarian NGO', eta: 3 }
          : res.category === 'Food'
          ? { name: 'UN World Food Programme (WFP)', type: 'UN Agency', eta: 12 }
          : res.category === 'LogisticsEquipment'
          ? { name: 'Sri Lanka Army Disaster Relief Wing', type: 'Military / Civil Defence', eta: 2 }
          : res.category === 'MedicalSupplies'
          ? { name: 'WHO Sri Lanka Emergency Mission', type: 'UN Agency', eta: 6 }
          : { name: 'Disaster Management Centre (DMC) National Stockpile', type: 'Government Agency', eta: 4 };

      setPartnerForm({
        partnerName: suggestedPartner.name,
        partnerType: suggestedPartner.type,
        resourceCategory: res.category,
        itemName: res.name,
        quantityRequested: Math.max(res.lowStockThreshold * 2, 100),
        unit: res.unit,
        priority: res.availableQuantity === 0 ? 'Critical' : 'High',
        deliveryLocation: res.storageLocation,
        justification: `Depot stock is severely depleted (${res.availableQuantity} ${res.unit} remaining vs safety threshold of ${res.lowStockThreshold}). Urgent partner requisition needed to sustain continuous emergency response.`,
        etaHours: suggestedPartner.eta
      });
    } else {
      setPartnerForm({
        partnerName: 'Sri Lanka Red Cross Society (SLRCS)',
        partnerType: 'Humanitarian NGO',
        resourceCategory: 'DrinkingWater',
        itemName: 'Bottled Mineral Drinking Water (1L Bottles)',
        quantityRequested: 1000,
        unit: 'Bottles',
        priority: 'High',
        deliveryLocation: 'Depot A - Kelaniya, Gampaha District',
        justification: 'Relief depot capacity insufficient to cover displaced evacuation centres.',
        etaHours: 3
      });
    }
    setShowPartnerModal(true);
  };

  const handlePartnerSelectChange = (partnerName: string) => {
    let type = 'Humanitarian NGO';
    let eta = 4;
    if (partnerName.includes('Army')) {
      type = 'Military / Civil Defence';
      eta = 2;
    } else if (partnerName.includes('UN') || partnerName.includes('WHO') || partnerName.includes('UNICEF')) {
      type = 'UN Agency';
      eta = partnerName.includes('WHO') ? 6 : 12;
    } else if (partnerName.includes('Disaster Management Centre') || partnerName.includes('DMC')) {
      type = 'Government Agency';
      eta = 4;
    }

    setPartnerForm(prev => ({
      ...prev,
      partnerName,
      partnerType: type,
      etaHours: eta
    }));
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      await api.createResource({
        ...newResource,
        category: Number(newResource.category),
        totalQuantity: Number(newResource.totalQuantity),
        lowStockThreshold: Number(newResource.lowStockThreshold),
        expiryDate: newResource.expiryDate ? new Date(newResource.expiryDate).toISOString() : undefined
      });
      setSuccessMsg(`Resource "${newResource.name}" added to stock successfully!`);
      setShowCreateModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to add resource.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResource || !selectedRequestId) return;

    if (allocateQuantity > selectedResource.availableQuantity) {
      setError(`Cannot allocate ${allocateQuantity} ${selectedResource.unit}. Only ${selectedResource.availableQuantity} available in stock.`);
      return;
    }

    setIsAllocating(true);
    setError(null);
    try {
      await api.allocateResource({
        resourceId: selectedResource.id,
        assistanceRequestId: selectedRequestId,
        quantity: Number(allocateQuantity),
        notes: allocationNotes || 'Allocated via SAHAYA Inventory Dispatcher'
      });
      setSuccessMsg(`Allocated ${allocateQuantity} ${selectedResource.unit} of ${selectedResource.name} successfully!`);
      setShowAllocateModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to allocate resource.');
    } finally {
      setIsAllocating(false);
    }
  };

  const handlePartnerRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPartnerReq(true);
    setError(null);
    try {
      const created = await api.createPartnerRequest(partnerForm);
      setPartnerRequests(prev => [created, ...prev]);
      setSuccessMsg(`Requisition submitted to ${partnerForm.partnerName} for ${partnerForm.quantityRequested} ${partnerForm.unit} of ${partnerForm.itemName} (Estimated ETA: ${partnerForm.etaHours} hrs)!`);
      setShowPartnerModal(false);
    } catch (err: any) {
      setError(err.message || 'Failed to submit partner requisition.');
    } finally {
      setIsSubmittingPartnerReq(false);
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' ? true : r.category === categoryFilter;
    const matchesLowStock = lowStockOnly ? r.isLowStock || r.availableQuantity === 0 : true;
    const matchesGeo = matchesLocationFilter(r.storageLocation, selectedProvince, selectedDistrict);
    return matchesSearch && matchesCategory && matchesLowStock && matchesGeo;
  });

  const totalStockItems = resources.reduce((acc, r) => acc + r.totalQuantity, 0);
  const lowStockCount = resources.filter(r => r.isLowStock || r.availableQuantity === 0).length;
  const outOfStockCount = resources.filter(r => r.availableQuantity === 0).length;
  const totalAllocated = resources.reduce((acc, r) => acc + r.allocatedQuantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Boxes className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Emergency Resources & Stock Depot
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time supply depot tracking, AI alternative recommendations on shortage, and inter-agency partner requisitioning.
          </p>
        </div>

        {isCoordinatorOrAdmin && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => openPartnerModalForResource()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm transition-all shadow-amber-600/20"
            >
              <Building2 className="w-4 h-4" />
              Request Partner Aid
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all shadow-teal-600/20"
            >
              <Plus className="w-4 h-4" />
              Register Stock Item
            </button>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Cataloged SKUs</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{resources.length}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Active relief inventory items</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Units in Depots</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalStockItems.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">Combined physical inventory</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Shortage & Low Stock</p>
          <p className={`text-2xl font-bold mt-1 ${lowStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
            {lowStockCount} <span className="text-xs font-normal text-slate-500">({outOfStockCount} zero stock)</span>
          </p>
          <p className="text-[11px] text-rose-500 mt-1">Triggering AI alternative recommendation</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Partner Requisitions</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{partnerRequests.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">External inter-agency aid requests</p>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'inventory'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Layers className="w-4 h-4" />
          Internal Depot Inventory ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('partner-requests')}
          className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'partner-requests'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Inter-Agency Partner Requisitions ({partnerRequests.length})
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-xs font-bold text-emerald-700 hover:underline">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-bold text-rose-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* ================= TAB 1: INTERNAL DEPOT INVENTORY ================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Filters and search */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources or storage depot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-medium text-slate-500">Category:</span>
              {['All', 'Food', 'DrinkingWater', 'MedicalSupplies', 'ShelterSupplies', 'LogisticsEquipment', 'Sanitation'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'DrinkingWater' ? 'Water' : cat === 'MedicalSupplies' ? 'Medical' : cat === 'ShelterSupplies' ? 'Shelter' : cat === 'LogisticsEquipment' ? 'Logistics' : cat}
                </button>
              ))}

              <button
                onClick={() => setLowStockOnly(!lowStockOnly)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  lowStockOnly
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Shortage / Low Stock ({lowStockCount})
              </button>
            </div>
          </div>

          {/* District / Province Filter */}
          <DistrictFilter
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            onProvinceChange={setSelectedProvince}
            onDistrictChange={setSelectedDistrict}
            resultCount={filteredResources.length}
            totalCount={resources.length}
            label="Relief Depot Geographic Zone / ගබඩා පිහිටි පළාත හා දිස්ත්‍රික්කය"
          />

          {/* Resources Table */}
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">Loading resources catalog...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Package className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No resources matched your criteria</h3>
              <p className="text-xs text-slate-500 mt-1">Try relaxing filters or search terms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-4">Resource Item & Recommendation</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Storage Depot</th>
                    <th className="px-5 py-4">Stock Breakdown</th>
                    <th className="px-5 py-4">Stock Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredResources.map((res) => {
                    const availabilityPct = Math.round((res.availableQuantity / res.totalQuantity) * 100);
                    const isOutOfStock = res.availableQuantity === 0;
                    const altRecommendation = getAlternativeRecommendation(res, resources);

                    return (
                      <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        {/* Item + Recommendation banner if depleted */}
                        <td className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <div className={`p-2.5 rounded-xl shrink-0 ${
                              isOutOfStock
                                ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                                : 'bg-slate-100 dark:bg-slate-800 text-teal-600 dark:text-teal-400'
                            }`}>
                              <Package className="w-5 h-5" />
                            </div>
                            <div className="space-y-1.5">
                              <div>
                                <p className="font-bold text-slate-900 dark:text-white">{res.name}</p>
                                <p className="text-xs text-slate-500">Unit: {res.unit}</p>
                              </div>

                              {/* Coursework Requirement: Alternative Recommendation on Shortage */}
                              {(isOutOfStock || res.isLowStock) && altRecommendation && (
                                <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 text-xs text-teal-900 dark:text-teal-200 flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 font-bold text-teal-800 dark:text-teal-300">
                                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                                    <span>AI Alternative Available:</span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                                    <strong>{altRecommendation.name}</strong> ({altRecommendation.availableQuantity} {altRecommendation.unit} ready at {altRecommendation.storageLocation})
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {res.category}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                            <Warehouse className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{res.storageLocation}</span>
                          </div>
                          {res.expiryDate && (
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              <span>Exp: {new Date(res.expiryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </td>

                        {/* Breakdown */}
                        <td className="px-5 py-4 min-w-[180px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-500">Available:</span>
                              <span className={`font-bold ${isOutOfStock ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
                                {res.availableQuantity} / {res.totalQuantity} {res.unit}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isOutOfStock
                                    ? 'bg-rose-600'
                                    : res.isLowStock
                                    ? 'bg-amber-500'
                                    : 'bg-teal-500'
                                }`}
                                style={{ width: `${Math.min(availabilityPct, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Allocated: {res.allocatedQuantity}</span>
                              <span>Dispatched: {res.dispatchedQuantity}</span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              Depleted (0 Available)
                            </span>
                          ) : res.isLowStock ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Low Stock (&lt; {res.lowStockThreshold})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              Sufficient Stock
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                            {isCoordinatorOrAdmin && (
                              <>
                                {isOutOfStock ? (
                                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => openRestockModal(res)}
                                      title="Restock this depleted inventory item"
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs"
                                    >
                                      <PackagePlus className="w-3 h-3" />
                                      Restock
                                    </button>
                                    {altRecommendation && (
                                      <button
                                        onClick={() => openAllocateModal(altRecommendation)}
                                        title={`Switch to alternative: ${altRecommendation.name}`}
                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                        Allocate Alternative
                                      </button>
                                    )}
                                    <button
                                      onClick={() => openPartnerModalForResource(res)}
                                      title="Request from external partner organisations"
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-xs"
                                    >
                                      <Building2 className="w-3 h-3" />
                                      Request Aid
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => openRestockModal(res)}
                                      title="Add new shipment batch to inventory"
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all"
                                    >
                                      <PackagePlus className="w-3 h-3" />
                                      Restock
                                    </button>
                                    {res.isLowStock && (
                                      <button
                                        onClick={() => openPartnerModalForResource(res)}
                                        title="Low stock: Requisition partner supplies"
                                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 transition-all"
                                      >
                                        Request Aid
                                      </button>
                                    )}
                                    <button
                                      onClick={() => openAllocateModal(res)}
                                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs"
                                    >
                                      Allocate
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: INTER-AGENCY PARTNER REQUISITIONS ================= */}
      {/* Coursework Requirement Page 4 & 11: "Request assistance from partner organisations when capacity or supplies are insufficient." */}
      {activeTab === 'partner-requests' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Inter-Agency Mutual Aid & External Requisitions
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Direct logistics requisitions dispatched to Red Cross, UN agencies, Military disaster wings, and government reserves.
                </p>
              </div>
            </div>

            {isCoordinatorOrAdmin && (
              <button
                onClick={() => openPartnerModalForResource()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs self-start sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                Submit New Requisition
              </button>
            )}
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-4">Requisition ID & Partner</th>
                  <th className="px-5 py-4">Requested Item & Category</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Destination Depot</th>
                  <th className="px-5 py-4">Status & ETA</th>
                  <th className="px-5 py-4 text-right">Requested At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {partnerRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">{req.id}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {req.partnerType}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1">{req.partnerName}</p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-900 dark:text-white">{req.itemName}</p>
                      <p className="text-xs text-slate-500">Category: {req.resourceCategory}</p>
                      {req.justification && (
                        <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-1" title={req.justification}>
                          "{req.justification}"
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">
                      {req.quantityRequested.toLocaleString()} {req.unit}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        req.priority === 'Critical'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                          : req.priority === 'High'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                      }`}>
                        {req.priority}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Warehouse className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{req.deliveryLocation}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          req.status === 'InTransit'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                            : req.status === 'Approved'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : req.status === 'Delivered'
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {req.status === 'InTransit' && <Truck className="w-3 h-3" />}
                          {req.status === 'Approved' && <CheckCircle2 className="w-3 h-3" />}
                          {req.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {req.status}
                        </span>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>ETA: ~{req.etaHours} hrs</span>
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right text-xs text-slate-500 font-mono">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= MODAL: REGISTER STOCK ITEM ================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Register Inventory Item</h2>
            <p className="text-xs text-slate-500 mb-4">Add humanitarian relief inventory supplies to the emergency stock register.</p>

            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Name *</label>
                <input
                  required
                  type="text"
                  value={newResource.name}
                  onChange={e => setNewResource({ ...newResource, name: e.target.value })}
                  placeholder="e.g. High-Calorie Ready-to-Eat Meal Packs"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={newResource.category}
                    onChange={e => setNewResource({ ...newResource, category: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value={0}>Food</option>
                    <option value={1}>DrinkingWater</option>
                    <option value={2}>MedicalSupplies</option>
                    <option value={3}>ShelterSupplies</option>
                    <option value={4}>Sanitation</option>
                    <option value={5}>Clothing</option>
                    <option value={6}>LogisticsEquipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit of Measure *</label>
                  <input
                    required
                    type="text"
                    value={newResource.unit}
                    onChange={e => setNewResource({ ...newResource, unit: e.target.value })}
                    placeholder="e.g. Boxes, Liters, Kits"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Total Quantity *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newResource.totalQuantity}
                    onChange={e => setNewResource({ ...newResource, totalQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Low-Stock Alert Level *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={newResource.lowStockThreshold}
                    onChange={e => setNewResource({ ...newResource, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Storage Location Depot *</label>
                <input
                  required
                  type="text"
                  value={newResource.storageLocation}
                  onChange={e => setNewResource({ ...newResource, storageLocation: e.target.value })}
                  placeholder="e.g. Central Warehouse, Colombo Sector 3"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={newResource.expiryDate}
                  onChange={e => setNewResource({ ...newResource, expiryDate: e.target.value })}
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
                  {isCreating ? 'Saving...' : 'Add to Depot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ALLOCATE RESOURCE WITH ALTERNATIVE SWITCH ================= */}
      {/* Coursework Requirement Page 4 & 10: "Provide alternative allocation recommendations when the preferred resource is unavailable." */}
      {showAllocateModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Allocate Relief Supplies</h2>
            <p className="text-xs text-slate-500 mb-4">
              Item: <strong className="text-slate-900 dark:text-white">{selectedResource.name}</strong> ({selectedResource.availableQuantity} {selectedResource.unit} available in depot)
            </p>

            {/* Alternative Allocation Recommendation Box */}
            {(() => {
              const alt = getAlternativeRecommendation(selectedResource, resources);
              if (selectedResource.availableQuantity <= selectedResource.lowStockThreshold && alt) {
                return (
                  <div className="mb-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200">
                    <div className="flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div className="flex-1 text-xs">
                        <p className="font-bold text-amber-900 dark:text-amber-100">
                          {selectedResource.availableQuantity === 0
                            ? 'Stock Depleted — Switch to Alternative Recommendation'
                            : 'Stock Running Low — Alternative Resource Recommendation'}
                        </p>
                        <p className="mt-1 text-amber-800 dark:text-amber-300">
                          Primary item <strong>{selectedResource.name}</strong> has {selectedResource.availableQuantity} units left.
                          Recommended substitute: <strong>{alt.name}</strong> ({alt.availableQuantity} {alt.unit} available at {alt.storageLocation}).
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedResource(alt);
                            setAllocateQuantity(Math.min(alt.availableQuantity, 10));
                          }}
                          className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Switch & Allocate Alternative: {alt.name}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <form onSubmit={handleAllocate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Assign to Assistance Request *</label>
                {pendingRequests.length === 0 ? (
                  <p className="text-xs text-amber-600 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200">
                    No active eligible assistance requests found.
                  </p>
                ) : (
                  <select
                    value={selectedRequestId}
                    onChange={e => setSelectedRequestId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {pendingRequests.map(req => (
                      <option key={req.id} value={req.id}>
                        {req.title} ({req.citizenName} - {req.category})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity to Dispatch ({selectedResource.unit}) *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedResource.availableQuantity}
                  value={allocateQuantity}
                  onChange={e => setAllocateQuantity(Number(e.target.value))}
                  disabled={selectedResource.availableQuantity === 0}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white disabled:opacity-50"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enforces server concurrency lock. Concurrently allocated items cannot exceed depot balance.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dispatch Instructions / Notes</label>
                <input
                  type="text"
                  value={allocationNotes}
                  onChange={e => setAllocationNotes(e.target.value)}
                  placeholder="e.g. Priority dispatch via Convoy 4"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAllocateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAllocating || pendingRequests.length === 0 || selectedResource.availableQuantity === 0}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs disabled:opacity-50"
                >
                  {isAllocating ? 'Allocating...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: REQUEST ASSISTANCE FROM PARTNER ORGANISATIONS ================= */}
      {/* Coursework Requirement Page 4 & 11: "Request assistance from partner organisations when capacity or supplies are insufficient." */}
      {showPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Building2 className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Request Partner Organisation Aid</h2>
                <p className="text-xs text-slate-500">Requisition mutual emergency relief supplies from external agency stockpiles.</p>
              </div>
            </div>

            <form onSubmit={handlePartnerRequestSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Partner Organisation *
                </label>
                <select
                  value={partnerForm.partnerName}
                  onChange={e => handlePartnerSelectChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-medium"
                >
                  <option value="Sri Lanka Red Cross Society (SLRCS)">Sri Lanka Red Cross Society (SLRCS) [First Aid & Water]</option>
                  <option value="UN World Food Programme (WFP)">UN World Food Programme (WFP) [Food Rations & Nutrition]</option>
                  <option value="Sri Lanka Army Disaster Relief Wing">Sri Lanka Army Disaster Relief Wing [Heavy Logistics & Boats]</option>
                  <option value="Disaster Management Centre (DMC) National Stockpile">Disaster Management Centre (DMC) National Stockpile [Emergency Tarps & Kits]</option>
                  <option value="WHO Sri Lanka Emergency Mission">WHO Sri Lanka Emergency Mission [Trauma Kits & Pharmaceuticals]</option>
                  <option value="Sarvodaya Shramadana Movement">Sarvodaya Shramadana Movement [Community Dry Rations & Care]</option>
                  <option value="UNICEF Sri Lanka Emergency Response">UNICEF Sri Lanka Emergency Response [Infant Nutrition & Hygiene]</option>
                </select>
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Type: <strong className="text-slate-700 dark:text-slate-300">{partnerForm.partnerType}</strong></span>
                  <span className="text-amber-600 font-semibold">Estimated SLA/ETA: ~{partnerForm.etaHours} hours</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Resource Category *</label>
                  <select
                    value={partnerForm.resourceCategory}
                    onChange={e => setPartnerForm({ ...partnerForm, resourceCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="DrinkingWater">Drinking Water</option>
                    <option value="Food">Food Rations</option>
                    <option value="MedicalSupplies">Medical Supplies</option>
                    <option value="ShelterSupplies">Shelter Supplies</option>
                    <option value="LogisticsEquipment">Logistics Equipment</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority / Urgency *</label>
                  <select
                    value={partnerForm.priority}
                    onChange={e => setPartnerForm({ ...partnerForm, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold"
                  >
                    <option value="Critical">Critical (Immediate Evacuation / Lifesaving)</option>
                    <option value="High">High (Impending Stockout)</option>
                    <option value="Medium">Medium (Replenishment)</option>
                    <option value="Low">Low (Buffer Stock Reserve)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Item Description / Specification *</label>
                <input
                  required
                  type="text"
                  value={partnerForm.itemName}
                  onChange={e => setPartnerForm({ ...partnerForm, itemName: e.target.value })}
                  placeholder="e.g. Bottled Water 1L, Rescue Boats, Trauma Kits"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity Requested *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={partnerForm.quantityRequested}
                    onChange={e => setPartnerForm({ ...partnerForm, quantityRequested: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Unit of Measure *</label>
                  <input
                    required
                    type="text"
                    value={partnerForm.unit}
                    onChange={e => setPartnerForm({ ...partnerForm, unit: e.target.value })}
                    placeholder="e.g. Bottles, Boxes, Kits, Boats"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Delivery Destination Relief Depot *</label>
                <input
                  required
                  type="text"
                  value={partnerForm.deliveryLocation}
                  onChange={e => setPartnerForm({ ...partnerForm, deliveryLocation: e.target.value })}
                  placeholder="e.g. Depot A - Kelaniya, Gampaha District"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Crisis Justification / Urgency Context *</label>
                <textarea
                  required
                  rows={2}
                  value={partnerForm.justification}
                  onChange={e => setPartnerForm({ ...partnerForm, justification: e.target.value })}
                  placeholder="Explain why local inventory is depleted and partner aid is necessary..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPartnerReq}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmittingPartnerReq ? 'Submitting Requisition...' : 'Submit Partner Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restock / Replenish Modal */}
      {showRestockModal && selectedRestockResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    Replenish Depot Inventory
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add verified shipment or relief consignment to existing stock
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRestockModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target Item</p>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{selectedRestockResource.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Depot: {selectedRestockResource.storageLocation}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400">Current Balance</p>
                <p className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedRestockResource.totalQuantity} <span className="text-xs font-normal text-slate-500">{selectedRestockResource.unit}</span>
                </p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400 font-medium">
                  {selectedRestockResource.availableQuantity} available
                </p>
              </div>
            </div>

            <form onSubmit={handleRestock} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Restock Quantity *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={restockQty}
                    onChange={e => setRestockQty(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-medium"
                    placeholder="e.g. 500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Batch / Consignment No.
                  </label>
                  <input
                    type="text"
                    value={restockBatch}
                    onChange={e => setRestockBatch(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                    placeholder="e.g. BATCH-2026-04"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Supplier / Donating Agency
                </label>
                <input
                  type="text"
                  value={restockSource}
                  onChange={e => setRestockSource(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  placeholder="e.g. Ministry of Health, UNICEF, National Water Board"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Logistics & Inspection Notes
                </label>
                <textarea
                  rows={2}
                  value={restockNotes}
                  onChange={e => setRestockNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  placeholder="e.g. Goods verified at depot gate, quality inspected, seals intact."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRestocking}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  <PackagePlus className="w-3.5 h-3.5" />
                  {isRestocking ? 'Updating Stock...' : `Restock (+${restockQty} ${selectedRestockResource.unit})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
