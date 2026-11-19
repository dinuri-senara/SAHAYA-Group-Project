import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  DollarSign,
  Package,
  TrendingUp,
  Plus,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Gift
} from 'lucide-react';
import { DonationCampaign, Donation } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DonationsPage: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modals
  const [showMonetaryModal, setShowMonetaryModal] = useState(false);
  const [showInKindModal, setShowInKindModal] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<DonationCampaign | null>(null);

  // Monetary form
  const [monetaryData, setMonetaryData] = useState({
    amount: 100,
    paymentReference: 'BANK-TRANSFER-REF-1092',
    notes: 'For emergency flood relief victims'
  });
  const [isSubmittingDonation, setIsSubmittingDonation] = useState(false);

  // In-Kind form
  const [inKindData, setInKindData] = useState({
    itemName: 'Emergency Drinking Water Cans (5L)',
    itemCategory: 'DrinkingWater',
    itemQuantity: 50,
    itemUnit: 'Units',
    estimatedValue: 250,
    notes: 'Delivered to depot warehouse'
  });

  // Create Campaign form
  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    targetAmount: 50000,
    endDate: ''
  });
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);

  const isCoordinatorOrAdmin = user?.role === 'Coordinator' || user?.role === 'Admin';

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cData, dData] = await Promise.all([
        api.getDonationCampaigns(),
        api.getDonations()
      ]);
      setCampaigns(cData);
      setDonations(dData);
    } catch (err: any) {
      setError(err.message || 'Failed to load donation campaigns.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openMonetaryModal = (c?: DonationCampaign) => {
    setSelectedCampaign(c || null);
    setShowMonetaryModal(true);
  };

  const openInKindModal = (c?: DonationCampaign) => {
    setSelectedCampaign(c || null);
    setShowInKindModal(true);
  };

  const handleMonetaryDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDonation(true);
    setError(null);
    try {
      await api.createDonation({
        campaignId: selectedCampaign?.id,
        donationType: 0, // Monetary
        amount: Number(monetaryData.amount),
        currency: 'USD',
        paymentReference: monetaryData.paymentReference,
        notes: monetaryData.notes
      });
      setSuccessMsg(`Thank you! Your donation of $${monetaryData.amount} has been logged and allocated.`);
      setShowMonetaryModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to record donation.');
    } finally {
      setIsSubmittingDonation(false);
    }
  };

  const handleInKindDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingDonation(true);
    setError(null);
    try {
      await api.createDonation({
        campaignId: selectedCampaign?.id,
        donationType: 1, // InKind
        itemName: inKindData.itemName,
        itemCategory: inKindData.itemCategory,
        itemQuantity: Number(inKindData.itemQuantity),
        itemUnit: inKindData.itemUnit,
        estimatedValue: Number(inKindData.estimatedValue),
        notes: inKindData.notes
      });
      setSuccessMsg(`Thank you! Your in-kind contribution of ${inKindData.itemQuantity} ${inKindData.itemUnit} has been recorded.`);
      setShowInKindModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to record in-kind donation.');
    } finally {
      setIsSubmittingDonation(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCampaign(true);
    setError(null);
    try {
      await api.createDonationCampaign({
        title: campaignData.title,
        description: campaignData.description,
        targetAmount: Number(campaignData.targetAmount),
        endDate: campaignData.endDate ? new Date(campaignData.endDate).toISOString() : undefined
      });
      setSuccessMsg(`Campaign "${campaignData.title}" launched successfully!`);
      setShowCreateCampaignModal(false);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign.');
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  const totalRaised = campaigns.reduce((acc, c) => acc + c.raisedAmount, 0);
  const totalTarget = campaigns.reduce((acc, c) => acc + c.targetAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <HeartHandshake className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Humanitarian Aid & Relief Campaigns
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Transparent aid tracking: monetary relief pledges and in-kind supplies directly tied to verified crisis zones.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => openMonetaryModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all shadow-teal-600/20"
          >
            <DollarSign className="w-4 h-4" />
            Pledge Monetary Aid
          </button>
          <button
            onClick={() => openInKindModal()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-all"
          >
            <Package className="w-4 h-4" />
            Donate In-Kind Supplies
          </button>
          {isCoordinatorOrAdmin && (
            <button
              onClick={() => setShowCreateCampaignModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Funds Mobilized</p>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">${totalRaised.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">Across all verified relief appeals</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Funding Target</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">${totalTarget.toLocaleString()}</p>
          <p className="text-[11px] text-slate-500 mt-1">{totalTarget ? Math.round((totalRaised / totalTarget) * 100) : 0}% goal attained</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Campaigns</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{campaigns.length}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Directly aiding frontline missions</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Donations</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{donations.length}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Monetary & material contributions</p>
        </div>
      </div>

      {/* Trust Notice */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0" />
        <p className="text-xs text-teal-800 dark:text-teal-300">
          <strong>Transparency Guarantee:</strong> SAHAYA records and audits all monetary and supply pledges directly in SQL Server. Credit card numbers are never stored in the database.
        </p>
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
            <AlertCircle className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-xs font-bold text-rose-700 hover:underline">Dismiss</button>
        </div>
      )}

      {/* Active Campaigns Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Urgent Relief Campaigns</h2>
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-slate-500">Loading humanitarian campaigns...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(camp => {
              const pct = Math.min(camp.progressPercentage, 100);

              return (
                <div
                  key={camp.id}
                  className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{camp.title}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                        Active
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                      {camp.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                        <span className="text-slate-600 dark:text-slate-400">Raised: ${camp.raisedAmount.toLocaleString()}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{camp.progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500 text-right">
                        Goal: ${camp.targetAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>{camp.totalDonationsCount} contributions</span>
                      {camp.endDate && (
                        <span>Closes: {new Date(camp.endDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                    <button
                      onClick={() => openMonetaryModal(camp)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Pledge Funds
                    </button>
                    <button
                      onClick={() => openInKindModal(camp)}
                      className="py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Gift className="w-3.5 h-3.5" />
                      Donate Items
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Donations Table */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Recorded Contributions</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-[11px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-4">Donor</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Details</th>
                <th className="px-5 py-4">Campaign Target</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {donations.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{d.donorName}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      d.donationType === 'Monetary'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20'
                    }`}>
                      {d.donationType}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {d.donationType === 'Monetary' ? (
                      <span className="font-bold text-slate-900 dark:text-white">${d.amount.toLocaleString()} {d.currency}</span>
                    ) : (
                      <span>{d.itemQuantity} {d.itemUnit} of {d.itemName} ({d.itemCategory})</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs">{d.campaignTitle || 'General Disaster Fund'}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {d.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Monetary Donation */}
      {showMonetaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Pledge Monetary Aid</h2>
            <p className="text-xs text-slate-500 mb-4">
              Campaign: <strong className="text-slate-900 dark:text-white">{selectedCampaign ? selectedCampaign.title : 'General Emergency Fund'}</strong>
            </p>

            <form onSubmit={handleMonetaryDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Contribution Amount ($ USD) *</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[25, 50, 100, 250].map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setMonetaryData({ ...monetaryData, amount: amt })}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        monetaryData.amount === amt
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  required
                  type="number"
                  min="5"
                  value={monetaryData.amount}
                  onChange={e => setMonetaryData({ ...monetaryData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Transfer Reference / Bank Txn ID</label>
                <input
                  type="text"
                  value={monetaryData.paymentReference}
                  onChange={e => setMonetaryData({ ...monetaryData, paymentReference: e.target.value })}
                  placeholder="e.g. WIRE-892144 or CHECK-4412"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Pledge Note</label>
                <input
                  type="text"
                  value={monetaryData.notes}
                  onChange={e => setMonetaryData({ ...monetaryData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMonetaryModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDonation}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  {isSubmittingDonation ? 'Logging...' : 'Confirm Pledge'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: In-Kind Supplies Donation */}
      {showInKindModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Donate In-Kind Supplies</h2>
            <p className="text-xs text-slate-500 mb-4">Record material relief supplies delivered to a regional depot.</p>

            <form onSubmit={handleInKindDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Item Description *</label>
                <input
                  required
                  type="text"
                  value={inKindData.itemName}
                  onChange={e => setInKindData({ ...inKindData, itemName: e.target.value })}
                  placeholder="e.g. Blankets, First Aid Kits, Canned Food"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={inKindData.itemCategory}
                    onChange={e => setInKindData({ ...inKindData, itemCategory: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Food">Food</option>
                    <option value="DrinkingWater">Drinking Water</option>
                    <option value="MedicalSupplies">Medical Supplies</option>
                    <option value="ShelterSupplies">Shelter Supplies</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Quantity *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={inKindData.itemQuantity}
                    onChange={e => setInKindData({ ...inKindData, itemQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Delivery / Storage Location</label>
                <input
                  type="text"
                  value={inKindData.notes}
                  onChange={e => setInKindData({ ...inKindData, notes: e.target.value })}
                  placeholder="e.g. Central Warehouse Depot Bay 2"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowInKindModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingDonation}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  {isSubmittingDonation ? 'Recording...' : 'Record In-Kind Aid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Campaign (Coordinator / Admin) */}
      {showCreateCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Launch Disaster Relief Campaign</h2>
            <p className="text-xs text-slate-500 mb-4">Create a targeted fundraising or supply drive for a specific crisis.</p>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Campaign Title *</label>
                <input
                  required
                  type="text"
                  value={campaignData.title}
                  onChange={e => setCampaignData({ ...campaignData, title: e.target.value })}
                  placeholder="e.g. 2026 Monsoon Flash Flood Relief Appeal"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Funding Amount ($ USD) *</label>
                <input
                  required
                  type="number"
                  min="1000"
                  value={campaignData.targetAmount}
                  onChange={e => setCampaignData({ ...campaignData, targetAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Campaign Description *</label>
                <textarea
                  required
                  rows={3}
                  value={campaignData.description}
                  onChange={e => setCampaignData({ ...campaignData, description: e.target.value })}
                  placeholder="Detail the affected regions, required supplies, and intended relief outcome..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target End Date</label>
                <input
                  type="date"
                  value={campaignData.endDate}
                  onChange={e => setCampaignData({ ...campaignData, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateCampaignModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCampaign}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  {isCreatingCampaign ? 'Launching...' : 'Publish Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
