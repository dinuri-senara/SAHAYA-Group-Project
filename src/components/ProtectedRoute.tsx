import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { AppShell } from './AppShell';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm text-slate-400 font-semibold">Authenticating SAHAYA Command Session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <AppShell>
        <div className="p-8 max-w-lg mx-auto text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md my-12">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black">!</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Access Denied</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Your user role (<strong>{user.role}</strong>) does not have authorization to view this operational module.
          </p>
          <div className="mt-6">
            <Navigate to={
              user.role === 'Citizen' ? '/citizen/dashboard' :
              user.role === 'Coordinator' ? '/coordinator/dashboard' :
              user.role === 'Volunteer' ? '/volunteer/dashboard' :
              user.role === 'Donor' ? '/donor/dashboard' : '/admin/dashboard'
            } />
          </div>
        </div>
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
};
