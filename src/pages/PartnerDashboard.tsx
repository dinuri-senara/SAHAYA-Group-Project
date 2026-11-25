import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Package,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  Shield,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PartnerRequest } from '../types';

interface PartnerOrg {
  id: string;
  name: string;
  type: string;
  headquarters: string;
  contactPerson: string;
  phone: string;
  email: string;
  activeMissions: number;
  deployedSupplies: string;
  status: 'Verified' | 'Pending';
}

export const PartnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'requisitions'>('profile');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Partner Organization Profile
  const [orgProfile, setOrgProfile] = useState<PartnerOrg>(() => {
    const saved = localStorage.getItem('sahaya_partner_org');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      id: 'org-1',
      name: 'Sri Lanka Red Cross Society (SLRCS)',
      type: 'International Humanitarian NGO',
      headquarters: '106, Dharmapala Mawatha, Colombo 07',
      contactPerson: user?.fullName || 'Dr. Mahesh Gunasekara',
      phone: user?.phoneNumber || '+94 11 269 1095',
      email: user?.email || 'partner@sahaya.org',
      activeMissions: 4,
      deployedSupplies: '15,000L Water, 1,200 Family Ration Kits, 4 Mobile First-Aid Vans',
      status: 'Verified'
    };
  });

  // Requisition Modal
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqForm, setReqForm] = useState({
    partnerName: orgProfile.name,
    partnerType: orgProfile.type,
    resourceCategory: 'DrinkingWater',
    itemName: 'Bottled Mineral Drinking Water (5L Packs)',
    quantityRequested: 500,
    unit: 'Packs',
    priority: 'High' as 'Low' | 'Medium' | 'High' | 'Critical',
    deliveryLocation: 'Kelaniya Flood Evacuation Zone, Western Province',
    justification: 'External aid replenishment for flood displaced families in shelters.',
    etaHours: 4
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const reqs = await api.getPartnerRequests();
      setPartnerRequests(reqs);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sahaya_partner_org', JSON.stringify(orgProfile));
    setSuccessMsg('Partner Organization details successfully updated and verified with National Command!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSubmitRequisition = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createPartnerRequest({
        ...reqForm,
        partnerName: orgProfile.name,
        partnerType: orgProfile.type
      });
      setSuccessMsg('Inter-Agency Humanitarian Requisition submitted to National Command Depot!');
      setShowReqModal(false);
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Building2 className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Partner Organisation Operations Hub
            </h1>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Official agency registration, multi-agency joint relief operations, and inter-depot resource requisitions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReqModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Submit Aid Requisition
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Agency Profile & Credentials
        </button>
        <button
          onClick={() => setActiveTab('requisitions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'requisitions'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Inter-Agency Requisitions ({partnerRequests.length})
        </button>
      </div>

      {/* Tab 1: Agency Profile Management */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">
                {orgProfile.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {orgProfile.type}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{orgProfile.headquarters}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{orgProfile.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{orgProfile.email}</span>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified State Partner
              </span>
            </div>
          </div>

          {/* Form to edit Agency details */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4">
              Update Organization Roster & Relief Capabilities
            </h3>
            <form onSubmit={handleSaveOrg} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Legal Name
                  </label>
                  <input
                    type="text"
                    value={orgProfile.name}
                    onChange={(e) => setOrgProfile({ ...orgProfile, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Organization Type
                  </label>
                  <input
                    type="text"
                    value={orgProfile.type}
                    onChange={(e) => setOrgProfile({ ...orgProfile, type: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  National Headquarters Address
                </label>
                <input
                  type="text"
                  value={orgProfile.headquarters}
                  onChange={(e) => setOrgProfile({ ...orgProfile, headquarters: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Liaison Officer Name
                  </label>
                  <input
                    type="text"
                    value={orgProfile.contactPerson}
                    onChange={(e) => setOrgProfile({ ...orgProfile, contactPerson: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Emergency Hotline
                  </label>
                  <input
                    type="text"
                    value={orgProfile.phone}
                    onChange={(e) => setOrgProfile({ ...orgProfile, phone: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Pledged Humanitarian Inventory & Equipment in Field
                </label>
                <textarea
                  value={orgProfile.deployedSupplies}
                  onChange={(e) => setOrgProfile({ ...orgProfile, deployedSupplies: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
                >
                  Save Organization Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Requisitions List */}
      {activeTab === 'requisitions' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              Inter-Agency Relief Requisitions
            </h3>
            <span className="text-xs text-slate-500">
              Coordinated via Disaster Management Command
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Requisition ID</th>
                  <th className="p-3.5">Item Name & Category</th>
                  <th className="p-3.5">Quantity</th>
                  <th className="p-3.5">Delivery Sector</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {partnerRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3.5 font-bold text-blue-600">{req.id}</td>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">
                      {req.itemName}
                      <span className="block text-[10px] text-slate-400">{req.resourceCategory}</span>
                    </td>
                    <td className="p-3.5 font-bold">{req.quantityRequested} {req.unit}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">{req.deliveryLocation}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        req.priority === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Dispatched
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Requisition */}
      {showReqModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
              Submit Humanitarian Aid Requisition
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Request or dispatch emergency supplies through the National Disaster Relief Depot network.
            </p>

            <form onSubmit={handleSubmitRequisition} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Item Description
                </label>
                <input
                  type="text"
                  value={reqForm.itemName}
                  onChange={(e) => setReqForm({ ...reqForm, itemName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={reqForm.quantityRequested}
                    onChange={(e) => setReqForm({ ...reqForm, quantityRequested: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Unit (Packs, Liters, Boxes)
                  </label>
                  <input
                    type="text"
                    value={reqForm.unit}
                    onChange={(e) => setReqForm({ ...reqForm, unit: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Delivery / Deployment Sector
                </label>
                <input
                  type="text"
                  value={reqForm.deliveryLocation}
                  onChange={(e) => setReqForm({ ...reqForm, deliveryLocation: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Operational Justification
                </label>
                <textarea
                  value={reqForm.justification}
                  onChange={(e) => setReqForm({ ...reqForm, justification: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReqModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit to Command'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
