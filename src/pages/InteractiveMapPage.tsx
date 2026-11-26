import React, { useState, useEffect } from 'react';
import {
  Map as MapIcon,
  Layers,
  AlertOctagon,
  Home,
  LifeBuoy,
  Filter,
  Eye,
  EyeOff,
  Navigation,
  Compass,
  Info
} from 'lucide-react';
import { CrisisEvent, Shelter, AssistanceRequest } from '../types';
import { api } from '../services/api';
import { MapComponent } from '../components/MapComponent';

export const InteractiveMapPage: React.FC = () => {
  const [incidents, setIncidents] = useState<CrisisEvent[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [requests, setRequests] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Layer toggles
  const [showIncidents, setShowIncidents] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showRequests, setShowRequests] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setLoading(true);
        const [inc, sh, req] = await Promise.all([
          api.getCrisisEvents(),
          api.getShelters(),
          api.getRequests()
        ]);
        setIncidents(inc);
        setShelters(sh);
        setRequests(req);
      } catch (err) {
        console.error('Failed to load map entities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Header with Layer Toggles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <Compass className="w-6 h-6" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Operational GIS Command Map
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time geospatial visualization of disaster zones, verified safe havens, and citizen rescue coordinates.
          </p>
        </div>

        {/* Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showIncidents
                ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Incidents ({incidents.length})
          </button>

          <button
            onClick={() => setShowShelters(!showShelters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showShelters
                ? 'bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            Shelters ({shelters.length})
          </button>

          <button
            onClick={() => setShowRequests(!showRequests)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              showRequests
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent opacity-60'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            Requests ({requests.length})
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative h-[720px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        {loading ? (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs z-10 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rendering Geographic Layers...</p>
          </div>
        ) : null}

        <MapComponent
          incidents={showIncidents ? incidents : []}
          shelters={showShelters ? shelters : []}
          requests={showRequests ? requests : []}
          center={[6.9271, 79.8612]}
          zoom={9}
        />

        {/* Floating Map Legend */}
        <div className="absolute bottom-6 left-6 z-10 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-xs space-y-2 max-w-xs">
          <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">Map Legend & Indicators</p>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">Crisis Incident / Hazard Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-teal-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">Safe Shelter / Evacuation Haven</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">Assistance Request Location</span>
          </div>
          <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
            OpenStreetMap contributors. Coordinates conform to EPSG:4326.
          </p>
        </div>
      </div>
    </div>
  );
};
