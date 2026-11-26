import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  AlertOctagon,
  Boxes,
  ShieldAlert,
  Truck,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search,
  X,
  CheckSquare,
  CheckCircle2,
  ExternalLink,
  Info
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { api } from '../services/api';
import { CoordinatorDashboardData, Shelter, Resource, AssistanceRequest } from '../types';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge, UrgencyBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { MapComponent } from '../components/MapComponent';

type TriageFilter = 'All' | 'Pending' | 'Critical' | 'Approved' | 'InProgress';

const URGENCY_PRIORITY: Record<string, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export const CoordinatorDashboard: React.FC = () => {
  const [data, setData] = useState<CoordinatorDashboardData | null>(null);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Triage filter & search state
  const [triageFilter, setTriageFilter] = useState<TriageFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Refs for safe async lifecycle handling
  const isMountedRef = useRef<boolean>(true);
  const isFetchingRef = useRef<boolean>(false);

  // Primary data loader
  const loadData = useCallback(async (isBackground = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    if (isBackground) {
      setIsRefreshing(true);
      setRefreshError(null);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      const [dash, shlts, resrcs] = await Promise.all([
        api.getCoordinatorDashboard(),
        api.getShelters(),
        api.getResources(),
      ]);

      if (isMountedRef.current) {
        setData(dash);
        setShelters(shlts);
        setResources(resrcs);
        setLastUpdated(new Date());
        setError(null);
        setRefreshError(null);
      }
    } catch (err: any) {
      if (isMountedRef.current) {
        const errorMsg = err?.message || 'Failed to load coordinator operations data.';
        console.error('CoordinatorDashboard loadData error:', err);
        if (isBackground && data) {
          setRefreshError(errorMsg);
        } else {
          setError(errorMsg);
        }
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [data]);

  // Initial load and periodic auto-sync cleanup
  useEffect(() => {
    isMountedRef.current = true;
    loadData(false);

    // Periodic polling every 30 seconds
    const intervalId = window.setInterval(() => {
      if (isMountedRef.current) {
        loadData(true);
      }
    }, 30000);

    return () => {
      isMountedRef.current = false;
      window.clearInterval(intervalId);
    };
  }, []); // Run on mount

  // Low stock resources alert list
  const lowStockResources = useMemo(() => {
    return resources.filter(r => r.isLowStock);
  }, [resources]);

  // 1.2 & 3: Six verified, non-fabricated metrics
  const activeIncidentsCount = data?.activeIncidents ?? data?.activeEvents?.length ?? 0;
  const requestsAwaitingReview = data?.pendingRequests ?? 0;
  const highPriorityEmergencies = data?.criticalRequests ?? 0;
  const approvedAwaitingAllocation = data?.approvedRequests ?? 0;
  const availableResourcesCount = useMemo(() => {
    if (!resources || resources.length === 0) return 0;
    return resources.reduce((sum, r) => sum + (r.availableQuantity || 0), 0);
  }, [resources]);

  // Verified active distributions: count actual requests with InProgress status
  const activeDistributionsCount = useMemo(() => {
    if (!data?.recentRequests) return 'N/A';
    return data.recentRequests.filter(r => r.status === 'InProgress').length;
  }, [data]);

  // Task 1.3: Non-overlapping Status Chart Data
  const statusChartData = useMemo(() => {
    if (!data) return [];
    const list = data.recentRequests || [];

    const submitted = list.filter(r => r.status === 'Submitted' || r.status === 'UnderReview').length;
    const approved = list.filter(r => r.status === 'Approved').length;
    const inProgress = list.filter(r => r.status === 'InProgress').length;
    const resolved = list.filter(r => r.status === 'Resolved').length;

    // Use list counts if available, otherwise fallback to known API counter fields
    const pendingVal = list.length > 0 ? submitted : data.pendingRequests;
    const approvedVal = list.length > 0 ? approved : data.approvedRequests;
    const inProgressVal = inProgress;
    const resolvedVal = resolved;

    const items = [
      { name: 'Pending Review', value: pendingVal, color: '#F59E0B' },
      { name: 'Approved', value: approvedVal, color: '#0D9488' },
      { name: 'In Progress', value: inProgressVal, color: '#06B6D4' },
      { name: 'Resolved', value: resolvedVal, color: '#10B981' },
    ];

    return items.filter(i => i.value > 0);
  }, [data]);

  // Task 1.3: Non-overlapping Priority/Urgency Chart Data
  const priorityChartData = useMemo(() => {
    if (!data) return [];
    const list = data.recentRequests || [];

    const critical = list.filter(r => r.urgency === 'Critical').length;
    const high = list.filter(r => r.urgency === 'High').length;
    const medium = list.filter(r => r.urgency === 'Medium').length;
    const low = list.filter(r => r.urgency === 'Low').length;

    const criticalVal = list.length > 0 ? critical : data.criticalRequests;

    const items = [
      { name: 'Critical', value: criticalVal, color: '#EF4444' },
      { name: 'High', value: high, color: '#F97316' },
      { name: 'Medium', value: medium, color: '#EAB308' },
      { name: 'Low', value: low, color: '#22C55E' },
    ];

    return items.filter(i => i.value > 0);
  }, [data]);

  // Task 2: Filtered, Searched, and Sorted Triage Queue
  const processedRequests = useMemo(() => {
    if (!data?.recentRequests) return [];

    let list = [...data.recentRequests];

    // Status / Urgency Filter
    if (triageFilter === 'Pending') {
      list = list.filter(r => r.status === 'Submitted' || r.status === 'UnderReview');
    } else if (triageFilter === 'Critical') {
      list = list.filter(r => r.urgency === 'Critical');
    } else if (triageFilter === 'Approved') {
      list = list.filter(r => r.status === 'Approved');
    } else if (triageFilter === 'InProgress') {
      list = list.filter(r => r.status === 'InProgress');
    }

    // Search query filter (ID, Title, Citizen Name, Location)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(r =>
        (r.id && r.id.toLowerCase().includes(q)) ||
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.citizenName && r.citizenName.toLowerCase().includes(q)) ||
        (r.address && r.address.toLowerCase().includes(q))
      );
    }

    // Task 2 Sorting: Primary by Urgency (Critical -> High -> Medium -> Low),
    // Secondary by oldest submission first (earliest createdAt)
    list.sort((a, b) => {
      const weightA = URGENCY_PRIORITY[a.urgency] || 0;
      const weightB = URGENCY_PRIORITY[b.urgency] || 0;
      if (weightB !== weightA) {
        return weightB - weightA; // Higher urgency first
      }
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Oldest first
    });

    return list;
  }, [data?.recentRequests, triageFilter, searchQuery]);

  // Reset all filters
  const handleClearFilters = () => {
    setTriageFilter('All');
    setSearchQuery('');
  };

  // Task 1.1: Loading and Error States
  if (loading && !data) {
    return <LoadingState message="Loading Operations Command Center & Triage Queue..." count={4} />;
  }

  if (error && !data) {
    return <ErrorState message={error} onRetry={() => loadData(false)} />;
  }

  if (!data) {
    return (
      <EmptyState
        title="No Operational Data Available"
        description="Unable to load coordinator operations records at this time. Please verify backend service availability."
        actionText="Retry Loading"
        onAction={() => loadData(false)}
      />
    );
  }

  const isFiltersActive = triageFilter !== 'All' || searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header with Operations Title, Last Sync Timestamp, and Manual Refresh */}
      <PageHeader
        title="Operations Command Center"
        subtitle="Real-time crisis triage, inventory allocation, volunteer mission coordination, and geospatial situation overview."
        portalBadge="Coordinator Portal"
        breadcrumbs={[
          { label: 'Operations', path: '/coordinator/dashboard' },
          { label: 'Command Dashboard' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Live refresh & sync indicator */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              <span>
                {lastUpdated
                  ? `Updated: ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
                  : 'Syncing...'}
              </span>
              <button
                onClick={() => loadData(true)}
                disabled={isRefreshing || loading}
                title="Refresh dashboard data"
                aria-label="Refresh operational data"
                className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 transition disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600 dark:text-blue-400' : ''}`} />
              </button>
            </div>

            {/* Incident Declaration link */}
            <Link
              to="/coordinator/incidents"
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
              Incident Registry
            </Link>

            {/* AI Triage Link */}
            <Link
              to="/coordinator/ai-review"
              className="px-3.5 py-2 rounded-xl bg-blue-600 dark:bg-blue-600 hover:bg-blue-600 dark:bg-blue-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-100" />
              AI Decision Review
            </Link>
          </div>
        }
      />

      {/* Non-blocking background sync error banner */}
      {refreshError && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 text-xs shadow-2xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span><strong>Notice:</strong> Background update failed ({refreshError}). Displaying last verified data.</span>
          </div>
          <button
            onClick={() => setRefreshError(null)}
            className="p-1 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-lg cursor-pointer transition"
            aria-label="Dismiss sync error"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Critical Stock Alert Banner */}
      {lowStockResources.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-2xs backdrop-blur-md">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-amber-900 dark:text-amber-200">Inventory Low-Stock Threshold Warning</p>
            <p className="mt-0.5 text-amber-800 dark:text-amber-300">
              The following essential relief supplies are below safety margins:
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {lowStockResources.map(r => (
                <span
                  key={r.id}
                  className="px-2.5 py-1 rounded-lg bg-amber-100/90 dark:bg-amber-900/40 font-semibold text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 text-[11px] shadow-2xs"
                >
                  {r.name} ({r.availableQuantity} {r.unit} remaining, safety target: {r.lowStockThreshold})
                </span>
              ))}
            </div>
          </div>
          <Link
            to="/resources"
            className="text-xs font-bold text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 hover:underline shrink-0 flex items-center gap-1 transition"
          >
            Allocate Stock <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* 6 Required Dashboard Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Active Incidents"
          value={activeIncidentsCount}
          subtitle="Monitored disaster sectors"
          icon={<ShieldAlert className="w-5 h-5" />}
          variant={activeIncidentsCount > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Awaiting Review"
          value={requestsAwaitingReview}
          subtitle="Pending triage decisions"
          icon={<Clock className="w-5 h-5" />}
          variant={requestsAwaitingReview > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="High Emergencies"
          value={highPriorityEmergencies}
          subtitle="Requires immediate dispatch"
          icon={<AlertOctagon className="w-5 h-5" />}
          variant={highPriorityEmergencies > 0 ? 'critical' : 'default'}
        />
        <StatCard
          title="Awaiting Allocation"
          value={approvedAwaitingAllocation}
          subtitle="Approved requests needing stock"
          icon={<CheckSquare className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Available Stock"
          value={availableResourcesCount.toLocaleString()}
          subtitle="Units across warehouses"
          icon={<Boxes className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="Active Distributions"
          value={activeDistributionsCount}
          subtitle="Verified field dispatches"
          icon={<Truck className="w-5 h-5" />}
          variant="success"
        />
      </div>

      {/* Live Geospatial Situation Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Live Geospatial Situation Overview
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live spatial coordinates of registered crises, emergency requests, and certified shelters.
            </p>
          </div>
          <Link to="/map" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-300 flex items-center gap-1">
            Open Interactive Map <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200">
          <MapComponent
            incidents={data.activeEvents || []}
            shelters={shelters}
            requests={data.recentRequests || []}
            height="340px"
            center={[6.0535, 80.2210]}
            zoom={10}
          />
        </div>
      </div>

      {/* Two-Column Grid: Operations Triage Queue + Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operations Triage Queue */}
        <div id="triage-queue" className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Operations Triage Queue ({processedRequests.length})
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by urgency priority (Critical → Low) with oldest submissions prioritized.
              </p>
            </div>
            {isFiltersActive && (
              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-300 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear Filters
              </button>
            )}
          </div>

          {/* Search bar and Filters toolbar */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search triage queue by ID, request title, citizen name, or location..."
                aria-label="Search requests by ID, title, citizen, or location"
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:border-blue-500 dark:border-blue-400 focus:ring-1 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search input"
                  className="absolute right-2.5 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100">
              <button
                onClick={() => setTriageFilter('All')}
                aria-pressed={triageFilter === 'All'}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  triageFilter === 'All' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Requests ({data.recentRequests?.length || 0})
              </button>
              <button
                onClick={() => setTriageFilter('Pending')}
                aria-pressed={triageFilter === 'Pending'}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  triageFilter === 'Pending' ? 'bg-white text-amber-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending Review ({data.pendingRequests})
              </button>
              <button
                onClick={() => setTriageFilter('Critical')}
                aria-pressed={triageFilter === 'Critical'}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  triageFilter === 'Critical' ? 'bg-white text-red-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical Emergencies ({data.criticalRequests})
              </button>
              <button
                onClick={() => setTriageFilter('Approved')}
                aria-pressed={triageFilter === 'Approved'}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  triageFilter === 'Approved' ? 'bg-white text-blue-900 dark:text-blue-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approved ({data.approvedRequests})
              </button>
              <button
                onClick={() => setTriageFilter('InProgress')}
                aria-pressed={triageFilter === 'InProgress'}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  triageFilter === 'InProgress' ? 'bg-white text-cyan-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                In Progress ({activeDistributionsCount})
              </button>
            </div>
          </div>

          {/* Request Cards List */}
          {processedRequests.length === 0 ? (
            <EmptyState
              title="No Requests Match Filter"
              description="No assistance requests in the queue match your active filter criteria or search keyword."
              actionText={isFiltersActive ? 'Clear Active Filters' : undefined}
              onAction={isFiltersActive ? handleClearFilters : undefined}
            />
          ) : (
            <div className="space-y-3">
              {processedRequests.map((req: AssistanceRequest) => {
                const isCritical = req.urgency === 'Critical';

                return (
                  <div
                    key={req.id}
                    className={`p-4 rounded-2xl bg-white border transition shadow-xs ${
                      isCritical
                        ? 'border-red-300 border-l-4 border-l-red-500 bg-red-50/10'
                        : 'border-slate-200 hover:border-blue-500 dark:border-blue-400/40'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={req.status} size="sm" />
                          <UrgencyBadge urgency={req.urgency} size="sm" />
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {req.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            #{req.id.slice(0, 8)}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {req.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {req.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 mt-2 font-medium">
                          <span>Citizen: <strong className="text-slate-800">{req.citizenName}</strong></span>
                          <span>Affected: <strong className="text-slate-800">{req.affectedCount}</strong></span>
                          <span>Location: <strong className="text-slate-800 truncate max-w-[180px]">{req.address}</strong></span>
                          <span>Submitted: <strong className="text-slate-800">{new Date(req.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></span>
                        </div>

                        {/* AI Recommendation Snapshot */}
                        {req.latestRecommendation ? (
                          <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-teal-950">
                            <div className="flex items-center gap-1.5 font-bold text-[11px] text-blue-900 dark:text-blue-200 mb-0.5">
                              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                              <span>AI Decision-Support:</span>
                              <span className="font-extrabold uppercase">{req.latestRecommendation.suggestedPriority} Priority</span>
                              <span className="text-[10px] text-blue-700 dark:text-blue-300 font-medium">
                                ({Math.round(req.latestRecommendation.confidenceScore * 100)}% confidence score)
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-1">
                              {req.latestRecommendation.explanation}
                            </p>
                          </div>
                        ) : (
                          <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                            <Info className="w-3 h-3 text-slate-400" />
                            <span>AI triage recommendation pending officer assessment.</span>
                          </div>
                        )}
                      </div>

                      {/* Review Action Links */}
                      <div className="flex sm:flex-col gap-2 shrink-0">
                        <Link
                          to={`/requests/${req.id}`}
                          className="px-3.5 py-2 rounded-xl bg-blue-600 dark:bg-blue-600 hover:bg-blue-600 dark:bg-blue-500 text-white font-bold text-xs text-center transition shadow-xs flex items-center justify-center gap-1"
                        >
                          Review Request &rarr;
                        </Link>
                        <Link
                          to="/coordinator/ai-review"
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] text-center transition"
                        >
                          AI Oversight
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Separate Charts & Operational Actions */}
        <div className="space-y-6">
          {/* Chart 1: Request Status Breakdown */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Request Status Distribution</h3>
            <p className="text-[11px] text-slate-500 mb-3">Non-overlapping triage state lifecycle metrics</p>
            {statusChartData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-slate-400 italic">
                No active request status data recorded.
              </div>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`status-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [val, 'Requests']}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 mt-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending Review
                </span>
                <span className="font-bold text-slate-800">{data.pendingRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-600" /> Approved
                </span>
                <span className="font-bold text-slate-800">{data.approvedRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> In Progress
                </span>
                <span className="font-bold text-slate-800">{activeDistributionsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Resolved
                </span>
                <span className="font-bold text-slate-800">
                  {data.recentRequests ? data.recentRequests.filter(r => r.status === 'Resolved').length : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Chart 2: Emergency Priority Distribution */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Emergency Priority Distribution</h3>
            <p className="text-[11px] text-slate-500 mb-3">Severity triage classification across requests</p>
            {priorityChartData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-xs text-slate-400 italic">
                No emergency priority data recorded.
              </div>
            ) : (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={68}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`prio-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [val, 'Emergencies']}
                      contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600 mt-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical Priority
                </span>
                <span className="font-bold text-slate-800">{data.criticalRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High Priority
                </span>
                <span className="font-bold text-slate-800">
                  {data.recentRequests ? data.recentRequests.filter(r => r.urgency === 'High').length : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Medium Priority
                </span>
                <span className="font-bold text-slate-800">
                  {data.recentRequests ? data.recentRequests.filter(r => r.urgency === 'Medium').length : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Priority
                </span>
                <span className="font-bold text-slate-800">
                  {data.recentRequests ? data.recentRequests.filter(r => r.urgency === 'Low').length : 0}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Operations Links */}
          <div className="p-5 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 dark:text-blue-300">Coordinator Command Links</h3>
            <div className="space-y-2">
              <Link
                to="/coordinator/incidents"
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition border border-slate-800"
              >
                <span className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                  Incident Registry & Declaration
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
              </Link>
              <Link
                to="/resources"
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition border border-slate-800"
              >
                <span className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                  Stock Allocation & Inventory
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
              </Link>
              <Link
                to="/volunteers"
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition border border-slate-800"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                  Volunteer Mission Dispatch
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
              </Link>
              <Link
                to="/shelters"
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition border border-slate-800"
              >
                <span className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                  Safe Shelter Capacity
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
              </Link>
              <Link
                to="/map"
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-xs font-bold text-slate-200 hover:text-white flex items-center justify-between transition border border-slate-800"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 dark:text-blue-300" />
                  Interactive Geospatial Map
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
