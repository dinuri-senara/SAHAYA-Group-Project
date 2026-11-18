import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  TrendingDown,
  Warehouse,
  Truck,
  RotateCcw,
  Check,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { Resource, AssistanceRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ResourcesPage: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
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

  const isCoordinatorOrAdmin = user?.role === 'Coordinator' || user?.role === 'Admin';

  const loadResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getResources();
      setResources(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

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
      loadResources();
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
      loadResources();
    } catch (err: any) {
      setError(err.message || 'Failed to allocate resource.');
    } finally {
      setIsAllocating(false);
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' ? true : r.category === categoryFilter;
    const matchesLowStock = lowStockOnly ? r.isLowStock : true;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const totalStockItems = resources.reduce((acc, r) => acc + r.totalQuantity, 0);
  const lowStockCount = resources.filter(r => r.isLowStock).length;
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
              Emergency Resources & Stock Inventory
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time supply depot tracking, low-stock early warnings, and concurrency-safe aid allocation.
          </p>
        </div>

        {isCoordinatorOrAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all shadow-teal-600/20"
          >
            <Plus className="w-4 h-4" />
            Register Stock Item
          </button>
        )}
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Resource SKU Types</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{resources.length}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Cataloged relief supplies</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Units in Depots</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalStockItems.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">Combined inventory count</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Allocated & In Transit</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{totalAllocated.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">Committed to active requests</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Low Stock Warnings</p>
          <p className={`text-2xl font-bold mt-1 ${lowStockCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600'}`}>
            {lowStockCount}
          </p>
          <p className="text-[11px] text-rose-500 mt-1">Items below safety threshold</p>
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
          {['All', 'Food', 'DrinkingWater', 'MedicalSupplies', 'ShelterSupplies', 'Sanitation'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${categoryFilter === cat
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
            >
              {cat === 'DrinkingWater' ? 'Water' : cat === 'MedicalSupplies' ? 'Medical' : cat === 'ShelterSupplies' ? 'Shelter' : cat}
            </button>
          ))}

          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${lowStockOnly
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
              }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Low Stock Only
          </button>
        </div>
      </div>

      {/* Resources Table / Grid */}
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
                <th className="px-5 py-4">Resource Item</th>
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

                return (
                  <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Item */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <Package className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{res.name}</p>
                          <p className="text-xs text-slate-500">Unit: {res.unit}</p>
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
                        <Warehouse className="w-3.5 h-3.5 text-slate-400" />
                        <span>{res.storageLocation}</span>
                      </div>
                      {res.expiryDate && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1">
                          <Clock className="w-3 h-3" />
                          <span>Exp: {new Date(res.expiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </td>

                    {/* Breakdown */}
                    <td className="px-5 py-4 min-w-[180px]">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Available:</span>
                          <span className="text-slate-900 dark:text-white font-bold">
                            {res.availableQuantity} / {res.totalQuantity} {res.unit}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${res.isLowStock ? 'bg-rose-500' : 'bg-teal-500'
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
                      {res.isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Low Stock ({res.availableQuantity} &lt; {res.lowStockThreshold})
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
                      {isCoordinatorOrAdmin && (
                        <button
                          disabled={res.availableQuantity <= 0}
                          onClick={() => openAllocateModal(res)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Allocate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create Stock Resource */}
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

      {/* Modal: Allocate Resource to Request */}
      {showAllocateModal && selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Allocate Supplies</h2>
            <p className="text-xs text-slate-500 mb-4">
              Item: <strong className="text-slate-900 dark:text-white">{selectedResource.name}</strong> ({selectedResource.availableQuantity} {selectedResource.unit} available)
            </p>

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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enforces server concurrency lock. Concurrently allocated items cannot exceed depot available balance.
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
                  disabled={isAllocating || pendingRequests.length === 0}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs disabled:opacity-50"
                >
                  {isAllocating ? 'Allocating...' : 'Confirm Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
