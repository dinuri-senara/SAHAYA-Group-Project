import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Edit2,
  Lock,
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { UserSummary, UserRole } from '../types';
import { PageHeader } from '../components/PageHeader';
import { LoadingState, ErrorState, EmptyState } from '../components/StateViews';
import { useAuth } from '../context/AuthContext';

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'All';

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>(roleParam);

  // Role Edit Modal
  const [editUser, setEditUser] = useState<UserSummary | null>(null);
  const [newRole, setNewRole] = useState<number>(0);
  const [roleJustification, setRoleJustification] = useState('');
  const [savingRole, setSavingRole] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Status Toggle Modal
  const [statusUser, setStatusUser] = useState<UserSummary | null>(null);
  const [statusJustification, setStatusJustification] = useState('');
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Create Staff / Admin Account Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    fullName: '',
    email: '',
    role: 'Admin' as UserRole,
    password: '',
    department: 'National Emergency Operations Center'
  });
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const roleQuery = selectedRoleFilter !== 'All' ? selectedRoleFilter : undefined;
      const data = await api.getUsers(roleQuery);
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [selectedRoleFilter]);

  const handleRoleFilterChange = (role: string) => {
    setSelectedRoleFilter(role);
    if (role === 'All') {
      searchParams.delete('role');
    } else {
      searchParams.set('role', role);
    }
    setSearchParams(searchParams);
  };

  const getRoleNumber = (role: UserRole): number => {
    switch (role) {
      case 'Citizen': return 0;
      case 'Coordinator': return 1;
      case 'Volunteer': return 2;
      case 'Donor': return 3;
      case 'Admin': return 4;
      default: return 0;
    }
  };

  const openRoleModal = (u: UserSummary) => {
    setEditUser(u);
    setNewRole(getRoleNumber(u.role));
    setRoleJustification('');
    setActionError(null);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setSavingRole(true);
    setActionError(null);
    try {
      await api.updateUserRole(editUser.id, {
        newRole,
        justification: roleJustification || `Role updated to ${newRole} by admin`,
      });
      setEditUser(null);
      await loadUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update user role.');
    } finally {
      setSavingRole(false);
    }
  };

  const handleToggleStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusUser) return;
    setTogglingStatus(true);
    setActionError(null);
    try {
      await api.toggleUserStatus(statusUser.id, {
        isActive: !statusUser.isActive,
        justification: statusJustification || `Account ${statusUser.isActive ? 'deactivated' : 'activated'} by admin`,
      });
      setStatusUser(null);
      await loadUsers();
    } catch (err: any) {
      setActionError(err.message || 'Failed to change user status.');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAccount(true);
    setActionError(null);
    try {
      await api.createOfficialUser({
        fullName: newAccount.fullName,
        email: newAccount.email,
        role: newAccount.role,
        password: newAccount.password || 'Admin@123',
      });
      setSuccessBanner(`Official credential for ${newAccount.fullName} (${newAccount.role}) created successfully in Neon database!`);
      setShowCreateModal(false);
      setNewAccount({
        fullName: '',
        email: '',
        role: 'Admin',
        password: '',
        department: 'National Emergency Operations Center'
      });
      await loadUsers();
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to create official account.');
    } finally {
      setCreatingAccount(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'All' | 'Pending'>('All');

  const pendingRequests = (users || []).filter(u => u.isActive === false);

  const handleApprovePending = async (userToApprove: UserSummary) => {
    try {
      await api.toggleUserStatus(userToApprove.id, {
        isActive: true,
        justification: `Approved official ${userToApprove.role} account by administrator`,
      });
      setSuccessBanner(`Approved & activated official access for ${userToApprove.fullName} (${userToApprove.role})!`);
      await loadUsers();
      setTimeout(() => setSuccessBanner(null), 5000);
    } catch (err: any) {
      setActionError(err.message || 'Failed to approve account.');
    }
  };

  const filteredUsers = (users || []).filter(u => {
    if (!u) return false;
    if (activeTab === 'Pending' && u.isActive !== false) return false;
    return (
      (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="User & Access Governance"
        subtitle="Review platform accounts, configure role permissions with server-side validation, and audit credential activation status."
        portalBadge="Admin Control"
        breadcrumbs={[
          { label: 'Admin Console', path: '/admin/dashboard' },
          { label: 'User Governance' },
        ]}
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            Create Official Account
          </button>
        }
      />

      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Pending Official Account Requests Alert Banner */}
      {pendingRequests.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-amber-950">
                  {pendingRequests.length} Official Account Registration Request{pendingRequests.length > 1 ? 's' : ''} Awaiting Review
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  Action Required
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Staff roles requesting access to operational sectors (Coordinators, Logistics Managers, Shelter Admins) require explicit administrator approval before permissions are unlocked.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab(activeTab === 'Pending' ? 'All' : 'Pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                activeTab === 'Pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-amber-900 border border-amber-300 hover:bg-amber-50'
              }`}
            >
              {activeTab === 'Pending' ? 'Show All Users' : `Review Pending Requests (${pendingRequests.length})`}
            </button>
          </div>
        </div>
      )}

      {/* Security Best Practice Notice */}
      <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 text-purple-900 flex items-start gap-3 shadow-2xs">
        <Shield className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold">Least-Privilege Enforcement & Self-Demotion Protection</p>
          <p className="mt-0.5 text-purple-800 leading-relaxed">
            All role modifications are guarded on the ASP.NET Core server. Administrators cannot demote or deactivate their own active session account. Every assignment change is permanently logged to immutable audit records.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Citizen', 'Coordinator', 'CaseManager', 'LogisticsManager', 'ShelterAdmin', 'VolunteerCoordinator', 'Volunteer', 'Donor', 'PartnerOfficer', 'Admin'].map(r => (
            <button
              key={r}
              onClick={() => handleRoleFilterChange(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedRoleFilter === r
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, role..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingState message="Loading platform accounts & roles..." count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadUsers} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          title="No Users Match Query"
          description="Try broadening your search term or clearing the selected role filter."
          icon={<Users className="w-8 h-8" />}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">User Details</th>
                  <th className="px-4 py-3.5">Assigned Role</th>
                  <th className="px-4 py-3.5">Account Status</th>
                  <th className="px-4 py-3.5">Registered</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                            {u.fullName.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{u.fullName}</span>
                              {isSelf && (
                                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                                  You
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                          {u.role}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5" />
                            Suspended
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-2">
                        {!u.isActive && (
                          <button
                            onClick={() => handleApprovePending(u)}
                            className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition cursor-pointer"
                            title="Approve and activate official access"
                          >
                            Approve Access
                          </button>
                        )}
                        <button
                          disabled={isSelf}
                          onClick={() => openRoleModal(u)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                          title={isSelf ? 'Cannot modify your own administrative role' : 'Change User Role'}
                        >
                          Change Role
                        </button>
                        <button
                          disabled={isSelf}
                          onClick={() => {
                            setStatusUser(u);
                            setStatusJustification('');
                            setActionError(null);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                            u.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                          title={isSelf ? 'Cannot deactivate your own account' : u.isActive ? 'Suspend Account' : 'Reactivate Account'}
                        >
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">Assign Platform Role</h3>
              <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRole} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">User</label>
                <input
                  type="text"
                  disabled
                  value={`${editUser.fullName} (${editUser.email})`}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select New Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(Number(e.target.value))}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value={0}>Citizen (Relief Request Submission)</option>
                  <option value={1}>Coordinator (Triage & Resource Allocation)</option>
                  <option value={2}>Volunteer (Field Missions & First Responder)</option>
                  <option value={3}>Donor (Campaign Backer & Transparency)</option>
                  <option value={4}>Admin (Full Platform Governance & Audit)</option>
                  <option value={5}>CaseManager (Incident & Case Lifecycle)</option>
                  <option value={6}>LogisticsManager (Inventory Depot & Supplies)</option>
                  <option value={7}>ShelterAdmin (Safe Shelters & Evacuees)</option>
                  <option value={8}>VolunteerCoordinator (Volunteer Mobilization)</option>
                  <option value={9}>PartnerOfficer (Red Cross / UN / NGO Partner)</option>
                </select>

                <div className="mt-2 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/80 text-[11px] text-purple-900 leading-relaxed">
                  <span className="font-bold">Granted Capabilities: </span>
                  {newRole === 0 && 'Citizens can submit emergency aid requests, locate nearby safe shelters, and monitor relief delivery progress.'}
                  {newRole === 1 && 'Coordinators can triage citizen requests, accept or override explainable AI recommendations, allocate depot stock, and assign shelter beds.'}
                  {newRole === 2 && 'Volunteers can browse available field missions, accept emergency dispatches, and record GPS field check-ins.'}
                  {newRole === 3 && 'Donors can browse active disaster campaigns, pledge monetary support, and track verifiable aid outcomes.'}
                  {newRole === 4 && 'Administrators have complete platform governance, audit trail inspection, user account lifecycle management, and system telemetry.'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Audit Justification</label>
                <textarea
                  value={roleJustification}
                  onChange={e => setRoleJustification(e.target.value)}
                  placeholder="e.g. Promoted to Operations Coordinator after vetting credentials"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  rows={2}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRole}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {savingRole ? 'Saving...' : 'Confirm Role Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Status Toggle Modal */}
      {statusUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900">
                {statusUser.isActive ? 'Suspend User Account' : 'Reactivate User Account'}
              </h3>
              <button onClick={() => setStatusUser(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to {statusUser.isActive ? 'suspend' : 'reactivate'} the account for{' '}
              <strong className="text-slate-900">{statusUser.fullName}</strong> ({statusUser.email})?
            </p>

            <form onSubmit={handleToggleStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Reason / Justification</label>
                <textarea
                  value={statusJustification}
                  onChange={e => setStatusJustification(e.target.value)}
                  placeholder="e.g. Account suspended pending identity confirmation"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300"
                  rows={2}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={togglingStatus}
                  className={`px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition cursor-pointer ${
                    statusUser.isActive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {togglingStatus ? 'Processing...' : statusUser.isActive ? 'Confirm Suspension' : 'Confirm Reactivation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Official Account (Admin only) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">
              Issue Official Platform Credential
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Create an administrative, coordinator, or manager credential with specific RBAC permissions.
            </p>

            <form onSubmit={handleCreateAccount} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commander Asela Wickrama"
                  value={newAccount.fullName}
                  onChange={e => setNewAccount({ ...newAccount, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="officer@sahaya.org"
                    value={newAccount.email}
                    onChange={e => setNewAccount({ ...newAccount, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Operational Role *
                  </label>
                  <select
                    value={newAccount.role}
                    onChange={e => setNewAccount({ ...newAccount, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="Admin">System Administrator</option>
                    <option value="Coordinator">Emergency Coordinator</option>
                    <option value="CaseManager">Incident / Case Manager</option>
                    <option value="LogisticsManager">Resource & Logistics Manager</option>
                    <option value="ShelterAdmin">Shelter Administrator</option>
                    <option value="VolunteerCoordinator">Volunteer Coordinator</option>
                    <option value="Volunteer">Field Volunteer</option>
                    <option value="PartnerOfficer">Partner Organisation Officer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Command Sector
                </label>
                <input
                  type="text"
                  placeholder="Disaster Management Centre / Ministry of Defence"
                  value={newAccount.department}
                  onChange={e => setNewAccount({ ...newAccount, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Temporary Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newAccount.password}
                  onChange={e => setNewAccount({ ...newAccount, password: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingAccount}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                >
                  {creatingAccount ? 'Issuing...' : 'Create Official Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
