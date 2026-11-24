import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Home,
  MapPin,
  Users,
  Search,
  AlertTriangle,
  Building,
  PhoneCall
} from 'lucide-react';
import { Shelter } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { SahayaLogo } from '../components/SahayaLogo';

export const PublicSheltersPage: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Full'>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');

  useEffect(() => {
    const fetchShelters = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getShelters();
        setShelters(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load evacuation shelters.');
      } finally {
        setLoading(false);
      }
    };
    fetchShelters();
  }, []);

  // Districts for Sri Lanka disaster zones
  const districts = [
    'All',
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Ratnapura',
    'Galle',
    'Matara',
    'Kandy',
    'Badulla',
    'Kegalle',
    'Kurunegala'
  ];

  const filteredShelters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return shelters.filter((s) => {
      // Status filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'Active' && s.status === 'Full') return false;
        if (statusFilter === 'Full' && s.status !== 'Full') return false;
      }

      // District filter
      if (selectedDistrict !== 'All') {
        const addr = (s.address || '').toLowerCase();
        const name = (s.name || '').toLowerCase();
        if (!addr.includes(selectedDistrict.toLowerCase()) && !name.includes(selectedDistrict.toLowerCase())) {
          return false;
        }
      }

      if (!q) return true;

      const matchName = (s.name || '').toLowerCase().includes(q);
      const matchAddr = (s.address || '').toLowerCase().includes(q);
      const matchFacilities = Array.isArray(s.facilities) && s.facilities.some(f => f.toLowerCase().includes(q));

      return matchName || matchAddr || matchFacilities;
    });
  }, [shelters, searchQuery, statusFilter, selectedDistrict]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
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
          <span className="text-slate-900 font-bold">Safe Evacuation Shelters</span>
        </div>

        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d254c] via-[#103163] to-[#0a1e3f] text-white p-6 sm:p-10 shadow-xl border border-blue-900/40">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-400/30 backdrop-blur-md">
              <Building className="w-4 h-4 text-teal-400" />
              <span>
                {language === 'en'
                  ? 'Official National Disaster Evacuation Camps'
                  : 'නිල ජාතික ආපදා ආරක්ෂිත සහන කඳවුරු'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {language === 'en'
                ? 'Find Safe Disaster Shelters'
                : 'ආරක්ෂිත නවාතැන් සහ සහන කඳවුරු'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl font-medium">
              {language === 'en'
                ? 'Verified safe evacuation centres, temples, and community schools operated under the Disaster Management Centre (DMC) with free meals, clean water, and medical care.'
                : 'ආපදා කළමනාකරණ මධ්‍යස්ථානය (DMC) මගින් මෙහෙයවනු ලබන නොමිලේ ආහාර, ජලය සහ සෞඛ්‍ය පහසුකම් සහිත දිවයිනේ නිල ආරක්ෂිත නවාතැන්.'}
            </p>

            {/* Search Input inside Banner */}
            <div className="pt-2 max-w-xl">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={
                    language === 'en'
                      ? 'Search shelter by name, town, or facilities...'
                      : 'නවාතැනේ නම, නගරය හෝ පහසුකම් අනුව සොයන්න...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-md"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. FILTERS BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
              {(['All', 'Active', 'Full'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    statusFilter === st
                      ? 'bg-white text-blue-700 shadow-xs font-extrabold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {st === 'All' ? 'All Shelters' : st === 'Active' ? 'Open & Accepting' : 'At Capacity'}
                </button>
              ))}
            </div>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-500">District:</span>
            <select
              aria-label="District selection"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Districts' : d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 4. SHELTER CARDS GRID */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500">Loading verified evacuation centres...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium text-center">
            {error}
          </div>
        ) : filteredShelters.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No shelters found matching your criteria</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or selecting "All Districts".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShelters.map((s) => {
              const capacity = s.totalCapacity || s.capacity || 100;
              const occupancy = s.currentOccupancy || 0;
              const available = Math.max(0, capacity - occupancy);
              const percentage = Math.min(100, Math.round((occupancy / capacity) * 100));
              const isFull = s.status === 'Full' || available === 0;

              return (
                <div
                  key={s.id}
                  className="rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-6 space-y-4">
                    {/* Top Row: Status badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                          isFull
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isFull ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'
                          }`}
                        />
                        {isFull ? 'At Full Capacity' : 'Open & Accepting Displaced'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{capacity} Cap</span>
                      </span>
                    </div>

                    {/* Shelter Name & Address */}
                    <div>
                      <h3 className="text-base font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                        {s.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{s.address}</span>
                      </p>
                    </div>

                    {/* Occupancy Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-slate-600">Space Availability</span>
                        <span className={isFull ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
                          {available} spaces open ({percentage}% full)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFull
                              ? 'bg-amber-500'
                              : percentage > 80
                              ? 'bg-blue-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Facilities Badges */}
                    {Array.isArray(s.facilities) && s.facilities.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                          Verified Camp Facilities:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {s.facilities.map((f, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200"
                            >
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Contact & Action */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">Camp In-Charge</span>
                      <span className="text-xs font-bold text-slate-800">
                        {s.contactPerson || 'Disaster Relief Officer'}
                      </span>
                    </div>

                    {s.contactPhone ? (
                      <a
                        href={`tel:${s.contactPhone.replace(/\s+/g, '')}`}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Camp</span>
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-blue-600">DMC Hotline: 117</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 6. CLEAN FOOTER */}
      <footer className="mt-auto bg-[#0d254c] text-slate-300 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 SAHAYA Disaster Management Platform. Official Emergency Shelters Directory.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/safety-guides" className="hover:text-white">Safety Guides</Link>
            <Link to="/emergency/request" className="hover:text-white">Emergency Aid</Link>
            <Link to="/login" className="hover:text-white">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
