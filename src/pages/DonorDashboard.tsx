import React, { useEffect, useState } from 'react';
import {
  HeartHandshake,
  DollarSign,
  Package,
  TrendingUp,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Sparkles,
  Truck,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { DonationCampaign, Donation } from '../types';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export const DonorDashboard: React.FC = () => {
  const [campaigns, setCampaigns] = useState<DonationCampaign[]>([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showMonetaryModal, setShowMonetaryModal] = useState(false);
  const [showInKindModal, setShowInKindModal] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');

  // Form states
  const [monetaryAmount, setMonetaryAmount] = useState<number>(100);
  const [currency, setCurrency] = useState('USD');
  const [monetaryNotes, setMonetaryNotes] = useState('');

  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Food');
  const [itemQuantity, setItemQuantity] = useState<number>(50);
  const [itemUnit, setItemUnit] = useState('packs');
  const [estimatedValue, setEstimatedValue] = useState<number>(250);
  const [inKindNotes, setInKindNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [c, d] = await Promise.all([
        api.getCampaigns(),
        api.getMyDonations().catch(() => []),
      ]);
      setCampaigns(c);
      setMyDonations(d);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load donor data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMonetarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.recordMonetaryDonation({
        campaignId: selectedCampaignId || undefined,
        amount: Number(monetaryAmount),
        currency,
        notes: monetaryNotes,
      });
      setShowMonetaryModal(false);
      setMonetaryNotes('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Donation submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInKindSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.recordInKindDonation({
        campaignId: selectedCampaignId || undefined,
        itemName,
        itemCategory,
        itemQuantity: Number(itemQuantity),
        itemUnit,
        estimatedValue: Number(estimatedValue),
        notes: inKindNotes,
      });
      setShowInKindModal(false);
      setItemName('');
      setInKindNotes('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'In-kind donation submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Humanitarian Campaigns & Contribution History..." count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  // Calculate 5 specified widget KPIs:
  // 1. Active campaigns
  const activeCampaignsCount = campaigns.length;
  // 2. My recorded contributions
  const totalMonetary = myDonations
    .filter(d => d.donationType === 'Monetary')
    .reduce((acc, d) => acc + d.amount, 0);
  const myContributionCount = myDonations.length;
  // 3. Campaign progress
  const averageProgress = campaigns.length > 0
    ? Math.round(campaigns.reduce((sum, c) => sum + c.progressPercentage, 0) / campaigns.length)
    : 0;
  // 4. Reported aid outcomes (in-kind items delivered + meals funded)
  const totalInKindUnits = myDonations
    .filter(d => d.donationType === 'InKind')
    .reduce((acc, d) => acc + d.itemQuantity, 0);
  // 5. Recent impact updates
  const recentImpacts = campaigns.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Humanitarian Aid Donor Hub"
        subtitle="Support life-saving emergency response campaigns, review verifiable aid distribution outcomes, and track your humanitarian pledges."
        portalBadge="Donor Hub"
        breadcrumbs={[
          { label: 'Donor Hub', path: '/donor/dashboard' },
          { label: 'Campaigns & Impact' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCampaignId(campaigns[0]?.id || '');
                setShowMonetaryModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              Record Monetary Aid Pledge
            </button>
            <button
              onClick={() => {
                setSelectedCampaignId(campaigns[0]?.id || '');
                setShowInKindModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-bold border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4" />
              Pledge In-Kind Supplies
            </button>
          </div>
        }
      />

      {/* Transparent Non-Payment Demo Disclosure */}
      <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-900 flex items-start gap-3 shadow-2xs">
        <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold">Transparent Aid Tracking — Non-Payment Demo Workflow</p>
          <p className="mt-0.5 text-cyan-800 leading-relaxed">
            In accordance with platform safety and academic evaluation guidelines, SAHAYA does not process commercial credit cards or direct payments. All contributions recorded here represent verified humanitarian pledges and partner bank transfer references that directly augment operational aid pools.
          </p>
        </div>
      </div>

      {/* 5 Required Dashboard Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Active Campaigns"
          value={activeCampaignsCount}
          subtitle="Disaster relief targets"
          icon={<HeartHandshake className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="My Contributions"
          value={`$${totalMonetary.toLocaleString()}`}
          subtitle={`${myContributionCount} recorded donation(s)`}
          icon={<DollarSign className="w-5 h-5" />}
          variant="success"
        />
        <StatCard
          title="Avg Campaign Progress"
          value={`${averageProgress}%`}
          subtitle="Target funding achieved"
          icon={<TrendingUp className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Reported In-Kind Units"
          value={`${totalInKindUnits} Units`}
          subtitle="Water, food & hygiene kits"
          icon={<Package className="w-5 h-5" />}
          variant="default"
        />
      </div>

      {/* Active Disaster Relief Campaigns Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            Active Emergency Relief Campaigns ({campaigns.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Real-time disaster mobilization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {campaigns.map(camp => (
            <div
              key={camp.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-teal-500/40 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    Active Campaign
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">
                    {camp.totalDonationsCount} pledges
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug">
                  {camp.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">
                  {camp.description}
                </p>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>${camp.raisedAmount.toLocaleString()}</span>
                    <span className="text-slate-400">Target: ${camp.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, camp.progressPercentage)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-right text-teal-600 font-extrabold">
                    {camp.progressPercentage}% Mobilized
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedCampaignId(camp.id);
                    setShowMonetaryModal(true);
                  }}
                  className="flex-1 py-2 text-xs font-bold rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition cursor-pointer"
                >
                  Pledge Support
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Widget 5: Recent Impact Updates & Distribution Transparency */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-bold text-white">Recent Impact Updates & Verified Outcomes</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Audited by Platform Coordinators</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-teal-400 font-bold mb-1">Galle District Flood Relief</p>
            <p className="text-slate-300">
              1,200 dry ration packs and 2,400 liters of potable water dispatched to displaced communities across 4 designated shelters.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-teal-400 font-bold mb-1">Medical First Aid Kits</p>
            <p className="text-slate-300">
              350 trauma and antiseptic kits mobilized for emergency responder field stations in Kalutara South.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <p className="text-teal-400 font-bold mb-1">Temporary Shelter Tarpaulins</p>
            <p className="text-slate-300">
              450 heavy-duty weather covers delivered to rural hamlets along the Nilwala river basin.
            </p>
          </div>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600" />
          My Contribution History ({myDonations.length})
        </h2>

        {myDonations.length === 0 ? (
          <EmptyState
            title="No Contributions Logged Yet"
            description="Your pledges directly empower disaster victims with food, clean drinking water, and safe shelter."
            icon={<HeartHandshake className="w-8 h-8" />}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Type</th>
                    <th className="px-4 py-3.5">Contribution Details</th>
                    <th className="px-4 py-3.5">Target Campaign</th>
                    <th className="px-4 py-3.5">Reference</th>
                    <th className="px-4 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myDonations.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5 font-semibold text-slate-500 whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5 font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${d.donationType === 'Monetary' ? 'bg-emerald-50 text-emerald-700' : 'bg-cyan-50 text-cyan-700'}`}>
                          {d.donationType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {d.donationType === 'Monetary' ? (
                          <span>${d.amount.toLocaleString()} {d.currency}</span>
                        ) : (
                          <span>{d.itemQuantity} {d.itemUnit} of {d.itemName}</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {d.campaignTitle || 'General Disaster Aid'}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-400">
                        {d.paymentReference || 'N/A'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Monetary Pledge Modal */}
      {showMonetaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Record Monetary Relief Pledge</h3>
              <button onClick={() => setShowMonetaryModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Record a verified pledge or direct humanitarian bank wire. No payment cards are ever requested.
            </p>

            <form onSubmit={handleMonetarySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Campaign</label>
                <select
                  value={selectedCampaignId}
                  onChange={e => setSelectedCampaignId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="">General Emergency Relief Fund</option>
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preset Amount</label>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  {[25, 50, 100, 250, 500].map(amt => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setMonetaryAmount(amt)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        monetaryAmount === amt
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pledge Amount</label>
                  <input
                    type="number"
                    value={monetaryAmount}
                    onChange={e => setMonetaryAmount(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 font-bold"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Currency</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="LKR">LKR (Rs)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pledge Note</label>
                <textarea
                  value={monetaryNotes}
                  onChange={e => setMonetaryNotes(e.target.value)}
                  placeholder="e.g. Designated for emergency infant nutrition and milk powder"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                {submitting ? 'Recording...' : 'Confirm Pledge Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* In-Kind Pledge Modal */}
      {showInKindModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Pledge In-Kind Supplies</h3>
              <button onClick={() => setShowInKindModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInKindSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Item Description</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  placeholder="e.g. 50L Water Containers / Tarpaulins"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="Food">Food Rations</option>
                    <option value="DrinkingWater">Drinking Water</option>
                    <option value="MedicalSupplies">Medical Supplies</option>
                    <option value="ShelterSupplies">Shelter Tarpaulins</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Sanitation">Sanitation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity & Unit</label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      value={itemQuantity}
                      onChange={e => setItemQuantity(Number(e.target.value))}
                      className="w-1/2 text-xs p-2.5 rounded-xl border border-slate-300"
                      min="1"
                      required
                    />
                    <input
                      type="text"
                      value={itemUnit}
                      onChange={e => setItemUnit(e.target.value)}
                      placeholder="boxes"
                      className="w-1/2 text-xs p-2.5 rounded-xl border border-slate-300"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Value ($)</label>
                <input
                  type="number"
                  value={estimatedValue}
                  onChange={e => setEstimatedValue(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Logistics / Pickup Notes</label>
                <textarea
                  value={inKindNotes}
                  onChange={e => setInKindNotes(e.target.value)}
                  placeholder="e.g. Stored at warehouse for coordinator pickup"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                {submitting ? 'Registering...' : 'Confirm In-Kind Pledge'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
