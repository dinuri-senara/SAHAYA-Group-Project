import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Search,
  Filter,
  Plus,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Shield,
  Briefcase
} from 'lucide-react';
import { VolunteerProfile, VolunteerTask, AssistanceRequest } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const VolunteersPage: React.FC = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('All');

  // Assign Task Modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerProfile | null>(null);
  const [pendingRequests, setPendingRequests] = useState<AssistanceRequest[]>([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: 2, // High
    assistanceRequestId: '',
    deadline: ''
  });
  const [isAssigning, setIsAssigning] = useState(false);

  const isCoordinatorOrAdmin = user?.role === 'Coordinator' || user?.role === 'Admin';

  const loadVolunteers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVolunteers();
      setVolunteers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load volunteers roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteers();
  }, []);

  const openTaskModal = async (v: VolunteerProfile) => {
    setSelectedVolunteer(v);
    setShowTaskModal(true);
    setTaskData({
      title: `Emergency Dispatch: Relief Support`,
      description: `Assist on-ground coordination in ${v.serviceArea}. Ensure safety protocols are upheld.`,
      priority: 2,
      assistanceRequestId: '',
      deadline: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0]
    });
    try {
      const reqs = await api.getRequests();
      const eligible = reqs.filter(r => r.status === 'Approved' || r.status === 'UnderReview' || r.status === 'Submitted');
      setPendingRequests(eligible);
      if (eligible.length > 0) {
        setTaskData(prev => ({ ...prev, assistanceRequestId: eligible[0].id }));
      }
    } catch {
      // Fallback
    }
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    setIsAssigning(true);
    setError(null);
    try {
      await api.assignVolunteerTask({
        volunteerProfileId: selectedVolunteer.id,
        assistanceRequestId: taskData.assistanceRequestId || undefined,
        title: taskData.title,
        description: taskData.description,
        priority: Number(taskData.priority),
        deadline: taskData.deadline ? new Date(taskData.deadline).toISOString() : undefined
      });
      setSuccessMsg(`Task assigned to ${selectedVolunteer.fullName} successfully!`);
      setShowTaskModal(false);
      loadVolunteers();
    } catch (err: any) {
      setError(err.message || 'Failed to assign volunteer task.');
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          v.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAvail = availabilityFilter === 'All' ? true : v.availabilityStatus === availabilityFilter;
    return matchesSearch && matchesAvail;
  });

  const availableCount = volunteers.filter(v => v.availabilityStatus === 'Available').length;
  const busyCount = volunteers.filter(v => v.availabilityStatus === 'Busy').length;
  const totalTasksCompleted = volunteers.reduce((acc, v) => acc + v.completedTasksCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Users className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Volunteer Force & Field Dispatch
            </h1>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Certified field volunteers, active mission readiness, and AI-assisted skills deployment.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Registered Volunteers</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{volunteers.length}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Verified community responders</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ready & Available</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{availableCount}</p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Standing by for immediate dispatch</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Active on Missions</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{busyCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Currently engaged in field tasks</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Completed Missions</p>
          <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mt-1">{totalTasksCompleted}</p>
          <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">Successful aid deliveries</p>
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
            <AlertCircle className="w-5 h-5 text-rose-600" />
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
            placeholder="Search volunteers by name, skill, or service area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {['All', 'Available', 'Busy', 'OffDuty'].map(status => (
            <button
              key={status}
              onClick={() => setAvailabilityFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                availabilityFilter === status
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Volunteer Cards Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading volunteer brigade...</p>
        </div>
      ) : filteredVolunteers.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No volunteers match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">Try modifying the search filter or availability toggle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolunteers.map(v => {
            const isAvail = v.availabilityStatus === 'Available';
            const isBusy = v.availabilityStatus === 'Busy';

            return (
              <div
                key={v.id}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-teal-500/50 transition-all duration-200"
              >
                <div>
                  {/* Top card header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs shadow-teal-500/20">
                        {v.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-slate-900 dark:text-white">{v.fullName}</h3>
                          {v.isVerified && (
                            <span title="Verified Background Check">
                              <Shield className="w-4 h-4 text-teal-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{v.serviceArea}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 ${
                        isAvail
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                          : isBusy
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                      }`}
                    >
                      {v.availabilityStatus}
                    </span>
                  </div>

                  {/* Skills badges */}
                  <div className="mt-4 space-y-1.5">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Certified Skills & Capabilities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {v.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact and history stats */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{v.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{v.completedTasksCount} missions completed</span>
                    </div>
                  </div>
                </div>

                {/* Coordinator dispatch button */}
                {isCoordinatorOrAdmin && (
                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => openTaskModal(v)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white shadow-xs shadow-teal-600/20 transition-all"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      Assign Field Mission
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Assign Task */}
      {showTaskModal && selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Dispatch Field Mission</h2>
            <p className="text-xs text-slate-500 mb-4">
              Assignee: <strong className="text-slate-900 dark:text-white">{selectedVolunteer.fullName}</strong> ({selectedVolunteer.serviceArea})
            </p>

            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mission Title *</label>
                <input
                  required
                  type="text"
                  value={taskData.title}
                  onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                  placeholder="e.g. Distribute First Aid and Clean Water"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link to Assistance Request (optional)</label>
                <select
                  value={taskData.assistanceRequestId}
                  onChange={e => setTaskData({ ...taskData, assistanceRequestId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="">-- General Field Assignment --</option>
                  {pendingRequests.map(req => (
                    <option key={req.id} value={req.id}>
                      {req.title} ({req.citizenName} - {req.category})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority Urgency *</label>
                  <select
                    value={taskData.priority}
                    onChange={e => setTaskData({ ...taskData, priority: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
                    <option value={3}>Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Completion Deadline</label>
                  <input
                    type="date"
                    value={taskData.deadline}
                    onChange={e => setTaskData({ ...taskData, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mission Instructions *</label>
                <textarea
                  required
                  rows={3}
                  value={taskData.description}
                  onChange={e => setTaskData({ ...taskData, description: e.target.value })}
                  placeholder="Detail exact delivery coordinates, safety procedures, contact persons..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                >
                  {isAssigning ? 'Dispatching...' : 'Confirm Dispatch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
