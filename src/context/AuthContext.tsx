import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<AuthResponse>;
  register: (data: { email: string; password: string; fullName: string; phoneNumber: string; role: number }) => Promise<AuthResponse>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeRole = (roleVal: any): UserRole => {
  if (typeof roleVal === 'string') {
    if (roleVal === '1' || roleVal === 'Citizen') return 'Citizen';
    if (roleVal === '2' || roleVal === 'Coordinator') return 'Coordinator';
    if (roleVal === '3' || roleVal === 'Volunteer') return 'Volunteer';
    if (roleVal === '4' || roleVal === 'Donor') return 'Donor';
    if (roleVal === '5' || roleVal === 'Admin') return 'Admin';
    if (roleVal === '6' || roleVal === 'CaseManager') return 'CaseManager';
    if (roleVal === '7' || roleVal === 'LogisticsManager') return 'LogisticsManager';
    if (roleVal === '8' || roleVal === 'ShelterAdmin') return 'ShelterAdmin';
    if (roleVal === '9' || roleVal === 'VolunteerCoordinator') return 'VolunteerCoordinator';
    if (roleVal === '10' || roleVal === 'PartnerOfficer') return 'PartnerOfficer';
    return roleVal as UserRole;
  }
  switch (Number(roleVal)) {
    case 1: return 'Citizen';
    case 2: return 'Coordinator';
    case 3: return 'Volunteer';
    case 4: return 'Donor';
    case 5: return 'Admin';
    case 6: return 'CaseManager';
    case 7: return 'LogisticsManager';
    case 8: return 'ShelterAdmin';
    case 9: return 'VolunteerCoordinator';
    case 10: return 'PartnerOfficer';
    default: return 'Citizen';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sahaya_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (parsed) {
        parsed.role = normalizeRole(parsed.role);
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sahaya_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const u = await api.getCurrentUser();
      u.role = normalizeRole(u.role);
      setUser(u);
      localStorage.setItem('sahaya_user', JSON.stringify(u));
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('sahaya_token', res.token);
    setToken(res.token);

    const mappedRole = normalizeRole(res.role);
    const fullUser: User = {
      id: res.userId,
      email: res.email,
      fullName: res.fullName,
      phoneNumber: '',
      role: mappedRole,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUser(fullUser);
    localStorage.setItem('sahaya_user', JSON.stringify(fullUser));

    return { ...res, role: mappedRole };
  };

  const register = async (data: { email: string; password: string; fullName: string; phoneNumber: string; role: number }) => {
    const res = await api.register(data);
    localStorage.setItem('sahaya_token', res.token);
    setToken(res.token);

    const mappedRole = normalizeRole(res.role);
    const isPublicRole = mappedRole === 'Citizen' || mappedRole === 'Donor';
    const isActive = isPublicRole;

    const fullUser: User = {
      id: res.userId,
      email: res.email,
      fullName: res.fullName,
      phoneNumber: data.phoneNumber,
      role: mappedRole,
      isActive: isActive,
      createdAt: new Date().toISOString(),
    };
    setUser(fullUser);
    localStorage.setItem('sahaya_user', JSON.stringify(fullUser));

    return { ...res, role: mappedRole };
  };

  const logout = () => {
    localStorage.removeItem('sahaya_token');
    localStorage.removeItem('sahaya_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
