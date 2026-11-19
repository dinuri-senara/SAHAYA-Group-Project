import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  Sparkles,
  Compass,
  ClipboardList,
  ShieldCheck,
  Send,
  Navigation,
  Activity,
  Layers,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { VolunteerProfile, VolunteerTask } from '../types';
import { StatCard } from '../components/StatCard';
import { PageHeader } from '../components/PageHeader';
import { UrgencyBadge, StatusBadge } from '../components/StatusBadge';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';

export const VolunteerDashboard: React.FC = () => {
  const [profile, setProfile] = useState<VolunteerProfile | null>(null);
  const [myTasks, setMyTasks] = useState<VolunteerTask[]>([]);
  const [availableTasks, setAvailableTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assigned' | 'available'>('assigned');

  // Check-in modal state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [checkInTaskId, setCheckInTaskId] = useState('');
  const [checkInLocation, setCheckInLocation] = useState('Galle Relief Sector 4');
  const [checkInLat, setCheckInLat] = useState<number>(6.0535);
  const [checkInLng, setCheckInLng] = useState<number>(80.2210);
  const [checkInNotes, setCheckInNotes] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [p, myT, availT] = await Promise.all([
        api.getMyVolunteerProfile().catch(() => null),
        api.getMyVolunteerTasks().catch(() => []),
        api.getAvailableVolunteerTasks().catch(() => []),
      ]);
      setProfile(p);
      setMyTasks(myT);
      setAvailableTasks(availT);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load volunteer dispatch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: number, notes?: string) => {
    setUpdatingTaskId(taskId);
    try {
      await api.updateVolunteerTaskStatus(taskId, { status: newStatus, notes });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update task status');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleAcceptMission = async (taskId: string) => {
    setUpdatingTaskId(taskId);
    try {
      await api.acceptVolunteerTask(taskId);
      alert('Mission accepted successfully! It is now listed under your Assigned Missions.');
      await loadData();
      setActiveTab('assigned');
    } catch (err: any) {
      alert(err.message || 'Failed to accept mission.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleCheckInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingIn(true);
    setCheckInSuccess(null);
    try {
      await api.recordVolunteerCheckIn({
        taskId: checkInTaskId || undefined,
        latitude: checkInLat,
        longitude: checkInLng,
        locationName: checkInLocation,
        statusNotes: checkInNotes,
      });
      setCheckInSuccess('Field GPS Check-in recorded and logged into audit logs!');
      setCheckInNotes('');
      setTimeout(() => {
        setShowCheckInModal(false);
        setCheckInSuccess(null);
      }, 1800);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to record check-in.');
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading Volunteer Missions & Dispatch Console..." count={3} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  // Calculate 5 specified widget KPIs:
  // 1. Available missions
  const availableCount = availableTasks.length;
  // 2. Assigned missions
  const assignedCount = myTasks.filter(t => t.status === 'Assigned' || t.status === 'Accepted').length;
  // 3. In-progress tasks
  const inProgressCount = myTasks.filter(t => t.status === 'InProgress').length;
  // 4. Completed missions
  const completedCount = myTasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Volunteer Dispatch & Response Hub"
        subtitle="Accept urgent field missions, execute aid delivery, and log GPS check-ins for coordinator tracking."
        portalBadge="Volunteer Portal"
        breadcrumbs={[
          { label: 'Volunteer Hub', path: '/volunteer/dashboard' },
          { label: 'Missions & Tasks' },
        ]}
        actions={
          <button
            onClick={() => {
              setCheckInTaskId(myTasks[0]?.id || '');
              setShowCheckInModal(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            Field GPS Check-in
          </button>
        }
      />

      {/* Top Banner & Field Readiness */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black text-white">
              {profile?.fullName || 'Field Volunteer'}
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Verified First Responder
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational Service Area: <strong className="text-white">{profile?.serviceArea || 'Southern Coastal Crisis Sector'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Field Readiness</p>
            <p className={`text-xs font-black ${profile?.availabilityStatus === 'Available' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {profile?.availabilityStatus || 'Available'}
            </p>
          </div>
          <span className={`w-3 h-3 rounded-full ${profile?.availabilityStatus === 'Available' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
        </div>
      </div>

      {/* Immediate Objective Focus Banner - Tells volunteer exactly what to do first */}
      {(() => {
        const activeTask = myTasks.find(t => t.status === 'InProgress' || t.status === 'Accepted' || t.status === 'Assigned');
        if (!activeTask) return null;

        return (
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-950/80 via-slate-900 to-slate-950 border border-teal-500/40 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Navigation className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Current Immediate Objective</span>
                  <h3 className="text-base font-extrabold text-white">{activeTask.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={activeTask.status} size="sm" />
                <UrgencyBadge urgency={activeTask.priority} size="sm" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeTask.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-slate-400">
                {activeTask.requestTitle && (
                  <span>Target: <strong className="text-slate-200">{activeTask.requestTitle}</strong></span>
                )}
                {activeTask.deadline && (
                  <span>Due by: <strong className="text-slate-200">{new Date(activeTask.deadline).toLocaleDateString()}</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeTask.status === 'Assigned' && (
                  <button
                    disabled={updatingTaskId === activeTask.id}
                    onClick={() => handleUpdateStatus(activeTask.id, 2, 'Volunteer accepted assignment')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-xs cursor-pointer"
                  >
                    Accept Assignment
                  </button>
                )}
                {activeTask.status === 'Accepted' && (
                  <button
                    disabled={updatingTaskId === activeTask.id}
                    onClick={() => handleUpdateStatus(activeTask.id, 3, 'En route to mission destination')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Start / En Route
                  </button>
                )}
                {activeTask.status === 'InProgress' && (
                  <button
                    disabled={updatingTaskId === activeTask.id}
                    onClick={() => handleUpdateStatus(activeTask.id, 4, 'Mission completed successfully on site')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setCheckInTaskId(activeTask.id);
                    setShowCheckInModal(true);
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                >
                  Log GPS Check-In
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5 Required Dashboard Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Available Missions"
          value={availableCount}
          subtitle="Open for acceptance"
          icon={<Compass className="w-5 h-5" />}
          variant={availableCount > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Assigned Missions"
          value={assignedCount}
          subtitle="Awaiting transit / kickoff"
          icon={<ClipboardList className="w-5 h-5" />}
          variant="default"
        />
        <StatCard
          title="In-Progress Tasks"
          value={inProgressCount}
          subtitle="Actively underway on site"
          icon={<Clock className="w-5 h-5" />}
          variant={inProgressCount > 0 ? 'warning' : 'default'}
        />
        <StatCard
          title="Completed Missions"
          value={completedCount}
          subtitle="Relief successfully delivered"
          icon={<CheckCircle2 className="w-5 h-5" />}
          variant="success"
        />
      </div>

      {/* Mission Tabs: Assigned Missions vs Available Missions */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'assigned'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ClipboardList className="w-4 h-4" />
              My Assigned Missions ({myTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'available'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Compass className="w-4 h-4" />
              Available Missions ({availableTasks.length})
            </button>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            {activeTab === 'assigned' ? 'Track your active field objectives' : 'Eligible tasks ready for voluntary dispatch'}
          </span>
        </div>

        {/* Tab 1: My Assigned Tasks */}
        {activeTab === 'assigned' && (
          <div>
            {myTasks.length === 0 ? (
              <EmptyState
                title="No Missions Currently Assigned"
                description="You do not currently have any active assignments. Switch to the 'Available Missions' tab to view and accept pending dispatches."
                icon={<ClipboardList className="w-8 h-8" />}
                actionText="Browse Available Missions"
                onAction={() => setActiveTab('available')}
              />
            ) : (
              <div className="space-y-4">
                {myTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 shadow-2xs hover:border-teal-500/40 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={task.status} size="sm" />
                          <UrgencyBadge urgency={task.priority} size="sm" />
                          {task.deadline && (
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              Deadline: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {task.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {task.description}
                        </p>

                        {task.requestTitle && (
                          <p className="text-xs text-teal-700 font-semibold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
                            Target Emergency: {task.requestTitle}
                          </p>
                        )}

                        {task.notes && (
                          <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200">
                            Coordinator Field Note: {task.notes}
                          </p>
                        )}
                      </div>

                      {/* Action buttons for task progression */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 md:pt-0">
                        {task.status === 'Assigned' && (
                          <>
                            <button
                              disabled={updatingTaskId === task.id}
                              onClick={() => handleUpdateStatus(task.id, 2, 'Volunteer accepted assignment')} // 2 = Accepted
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition cursor-pointer shadow-xs"
                            >
                              Accept Mission
                            </button>
                            <button
                              disabled={updatingTaskId === task.id}
                              onClick={() => handleUpdateStatus(task.id, 5, 'Volunteer declined due to location constraints')} // 5 = Declined
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
                            >
                              Decline
                            </button>
                          </>
                        )}

                        {task.status === 'Accepted' && (
                          <button
                            disabled={updatingTaskId === task.id}
                            onClick={() => handleUpdateStatus(task.id, 3, 'Departed to aid destination coordinates')} // 3 = InProgress
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                            Start / En Route
                          </button>
                        )}

                        {task.status === 'InProgress' && (
                          <button
                            disabled={updatingTaskId === task.id}
                            onClick={() => handleUpdateStatus(task.id, 4, 'Mission completed successfully on site')} // 4 = Completed
                            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark Completed
                          </button>
                        )}

                        {task.status === 'Completed' && (
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                            <CheckCircle2 className="w-4 h-4" /> Mission Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Available Missions (Open for acceptance) */}
        {activeTab === 'available' && (
          <div>
            {availableTasks.length === 0 ? (
              <EmptyState
                title="No Available Missions Awaiting Responders"
                description="There are currently no open unassigned tasks. All active relief requests are either staffed or pending coordinator triage."
                icon={<Compass className="w-8 h-8" />}
              />
            ) : (
              <div className="space-y-4">
                {availableTasks.map(task => (
                  <div
                    key={task.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-teal-500/50 transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                            Open for Acceptance
                          </span>
                          <UrgencyBadge urgency={task.priority} size="sm" />
                          {task.deadline && (
                            <span className="text-xs font-semibold text-slate-500">
                              Target Date: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-bold text-slate-900">
                          {task.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {task.description}
                        </p>

                        {task.requestTitle && (
                          <p className="text-xs text-teal-700 font-semibold">
                            Emergency Request: {task.requestTitle}
                          </p>
                        )}
                      </div>

                      <button
                        disabled={updatingTaskId === task.id}
                        onClick={() => handleAcceptMission(task.id)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition cursor-pointer shadow-md shrink-0 flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Accept This Mission
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Field Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Navigation className="w-5 h-5 text-teal-600" />
                <h3>Record Field GPS Check-In</h3>
              </div>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkInSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{checkInSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCheckInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Active Mission Reference
                </label>
                <select
                  value={checkInTaskId}
                  onChange={e => setCheckInTaskId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                >
                  <option value="">General Field Duty (No Specific Task)</option>
                  {myTasks.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Location Sector / Checkpoint
                </label>
                <input
                  type="text"
                  value={checkInLocation}
                  onChange={e => setCheckInLocation(e.target.value)}
                  placeholder="e.g. Matara Flood Barrier Hub #3"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={checkInLat}
                    onChange={e => setCheckInLat(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={checkInLng}
                    onChange={e => setCheckInLng(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Field Situation Notes
                </label>
                <textarea
                  value={checkInNotes}
                  onChange={e => setCheckInNotes(e.target.value)}
                  placeholder="e.g. Roads accessible by 4x4; 15 hygiene kits delivered to displaced family cluster."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                disabled={checkingIn}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-md"
              >
                {checkingIn ? 'Recording GPS Check-In...' : 'Confirm Field Check-In'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
