import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  AlertTriangle,
  MapPin,
  Clock,
  Users,
  Search,
  Radio,
  Droplets,
  Mountain,
  Wind,
  Flame,
  CheckCircle2,
  Info,
  Building
} from 'lucide-react';
import { CrisisEvent } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { SahayaLogo } from '../components/SahayaLogo';

export const PublicAlertsPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [alerts, setAlerts] = useState<CrisisEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Severe' | 'High' | 'Medium'>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getCrisisEvents(true);
        setAlerts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch live crisis alerts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const regions = [
    'All',
    'Western Province',
    'Sabaragamuwa Province',
    'Southern Province',
    'Central Province',
    'North Western Province',
    'Northern Province',
    'Eastern Province',
    'Uva Province',
    'North Central Province'
  ];

  const filteredAlerts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return alerts.filter((alert) => {
      // Severity filter
      if (severityFilter !== 'All') {
        const sev = (alert.severity || '').toLowerCase();
        if (severityFilter === 'Severe' && !sev.includes('severe') && !sev.includes('critical')) {
          return false;
        }
        if (severityFilter === 'High' && !sev.includes('high')) {
          return false;
        }
        if (severityFilter === 'Medium' && !sev.includes('medium') && !sev.includes('low')) {
          return false;
        }
      }

      // Region filter
      if (selectedRegion !== 'All') {
        const loc = (alert.location || '').toLowerCase();
        if (!loc.includes(selectedRegion.toLowerCase().replace(' province', ''))) {
          return false;
        }
      }

      if (!q) return true;

      const matchTitle = (alert.title || '').toLowerCase().includes(q);
      const matchDesc = (alert.description || '').toLowerCase().includes(q);
      const matchLoc = (alert.location || '').toLowerCase().includes(q);

      return matchTitle || matchDesc || matchLoc;
    });
  }, [alerts, searchQuery, severityFilter, selectedRegion]);

  const getDisasterIcon = (title: string, desc: string) => {
    const combined = `${title} ${desc}`.toLowerCase();
    if (combined.includes('flood') || combined.includes('river') || combined.includes('water')) {
      return <Droplets className="w-5 h-5 text-blue-500" />;
    }
    if (combined.includes('landslide') || combined.includes('earth') || combined.includes('slope')) {
      return <Mountain className="w-5 h-5 text-amber-600" />;
    }
    if (combined.includes('storm') || combined.includes('wind') || combined.includes('cyclone') || combined.includes('rain')) {
      return <Wind className="w-5 h-5 text-teal-500" />;
    }
    if (combined.includes('fire')) {
      return <Flame className="w-5 h-5 text-orange-500" />;
    }
    return <AlertTriangle className="w-5 h-5 text-rose-500" />;
  };

  const getSeverityBadge = (severity: string) => {
    const sev = (severity || '').toLowerCase();
    if (sev === 'severe' || sev === 'critical') {
      return {
        label: 'Level 4: Red Alert (Severe)',
        pillClass: 'bg-rose-100 text-rose-800 border-rose-300',
        dotClass: 'bg-rose-600 animate-ping',
        borderClass: 'border-l-4 border-l-rose-600'
      };
    }
    if (sev === 'high') {
      return {
        label: 'Level 3: Amber Alert (High Risk)',
        pillClass: 'bg-amber-100 text-amber-800 border-amber-300',
        dotClass: 'bg-amber-500',
        borderClass: 'border-l-4 border-l-amber-500'
      };
    }
    return {
      label: 'Level 2: Yellow Advisory (Watch)',
      pillClass: 'bg-blue-100 text-blue-800 border-blue-300',
      dotClass: 'bg-blue-500',
      borderClass: 'border-l-4 border-l-blue-500'
    };
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Active Now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-LK', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-rose-600 selection:text-white">
      {/* 1. TOP NAVBAR (Clean Public Header) */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <SahayaLogo size="md" light={false} showText={true} showTagline={true} />
          </Link>

          {/* Right Controls: Back to Home & Login */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 border border-slate-300 transition flex items-center gap-1.5 shadow-2xs"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Back to Home</span>
            </Link>

            <Link
              to="/login"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0d254c] hover:bg-[#153a75] shadow-md shadow-blue-950/20 transition hover:shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Breadcrumb */}
        <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Link to="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-slate-900 font-bold">Live Disaster Warnings &amp; Advisories</span>
        </div>

        {/* Hero Banner with Emergency Broadcast Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1e1b4b] via-[#0f172a] to-[#1e1b4b] text-white p-6 sm:p-10 shadow-xl border border-rose-900/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>
                {language === 'en'
                  ? 'Official Emergency Broadcast • DMC & Met Dept'
                  : 'නිල ආපදා විකාශය • ආපදා කළමනාකරණ මධ්‍යස්ථානය සහ කාලගුණ විද්‍යා දෙපාර්තමේන්තුව'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'en'
                ? 'Disaster Warnings & Public Advisories'
                : 'සජීවී ආපදා අනතුරු ඇඟවීම් සහ මහජන නිවේදන'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-medium">
              {language === 'en'
                ? 'Real-time hazard notifications, flash flood water levels, landslide evacuation orders, and national weather advisories issued across Sri Lanka.'
                : 'ගංවතුර, නායයෑම් අවදානම් සහ ආපදා තත්ත්වයන් පිළිබඳව ආපදා කළමනාකරණ මධ්‍යස්ථානය (DMC) විසින් නිකුත් කරනු ලබන සජීවී මහජන අනතුරු ඇඟවීම්.'}
            </p>

            {/* Search Input */}
            <div className="pt-2 max-w-xl">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    language === 'en'
                      ? 'Search alert by river basin, district, or keyword...'
                      : 'ගංගා නිම්න, දිස්ත්‍රික්ක හෝ ආපදා වර්ගය අනුව සොයන්න...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. FILTERS & STATUS TOOLBAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          {/* Severity Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Alert Level:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
              {(['All', 'Severe', 'High', 'Medium'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1.5 rounded-lg transition ${severityFilter === sev
                    ? 'bg-white text-rose-600 shadow-xs font-extrabold'
                    : 'hover:text-slate-900'
                    }`}
                >
                  {sev === 'All'
                    ? 'All Alerts'
                    : sev === 'Severe'
                      ? '🔴 Severe / Red'
                      : sev === 'High'
                        ? '🟠 High / Amber'
                        : '🟡 Advisory'}
                </button>
              ))}
            </div>
          </div>

          {/* Region / Province Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">Province:</span>
            <select
              aria-label="Province selection"
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r === 'All' ? 'All Provinces' : r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. ACTIVE ALERTS LIST */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Checking DMC live crisis feeds...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {error}
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No active alerts found for this filter</h3>
            <p className="text-xs text-slate-500">
              There are currently no matching disaster bulletins issued for the selected criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const badge = getSeverityBadge(alert.severity);
              const icon = getDisasterIcon(alert.title, alert.description);

              return (
                <div
                  key={alert.id}
                  className={`rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all overflow-hidden ${badge.borderClass}`}
                >
                  <div className="p-6 sm:p-7 space-y-4">
                    {/* Top Row: Severity & Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide border flex items-center gap-1.5 ${badge.pillClass}`}
                        >
                          <span className={`w-2 h-2 rounded-full ${badge.dotClass}`} />
                          {badge.label}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
                          {icon}
                          <span>Official DMC Notice</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Issued: {formatDate(alert.startedAt || alert.createdAt)}</span>
                      </div>
                    </div>

                    {/* Alert Title & Location */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        {alert.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 flex items-center gap-1.5 font-medium">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{alert.location}</span>
                        {alert.radiusKm && (
                          <span className="text-slate-400 text-xs">
                            (Estimated impact zone: ~{alert.radiusKm} km radius)
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Advisory Description */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-600" />
                        Public Safety Advisory:
                      </p>
                      {alert.description}
                    </div>

                    {/* Stats & Affected count */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-4 text-slate-500">
                        {alert.affectedCount ? (
                          <span className="flex items-center gap-1 font-semibold">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span>Estimated ~{alert.affectedCount.toLocaleString()} individuals in vicinity</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-semibold text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" />
                            Active monitoring by regional authorities
                          </span>
                        )}
                      </div>

                      {/* Direct Actions */}
                      <div className="flex items-center gap-2">
                        <Link
                          to="/public-shelters"
                          className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition flex items-center gap-1"
                        >
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>Nearby Shelters</span>
                        </Link>

                        <Link
                          to="/emergency/request"
                          className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Request Aid for this Area</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 7. CLEAN FOOTER */}
      <footer className="mt-auto bg-[#0d254c] text-slate-300 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 SAHAYA Disaster Management Platform. Official Public Crisis Broadcast.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/safety-guides" className="hover:text-white">Safety Guides</Link>
            <Link to="/public-shelters" className="hover:text-white">Safe Shelters</Link>
            <Link to="/emergency/request" className="hover:text-white">Emergency Aid</Link>
            <Link to="/login" className="hover:text-white">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
