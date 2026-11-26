import React, { useState, useEffect } from 'react';
import {
  Waves,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  TrendingUp,
  Activity,
  Droplets,
  ExternalLink,
  X
} from 'lucide-react';

export interface RiverStationAlert {
  id: string;
  riverName: string;
  riverNameSi: string;
  station: string;
  stationSi: string;
  waterLevel: string;
  status: 'Major Flood' | 'Minor Flood' | 'Alert' | 'Normal';
  statusSi: string;
  trend: 'Rising' | 'Falling' | 'Stable';
  trendSi: string;
  district: string;
  reportedTime: string;
}

const RIVER_ALERTS: RiverStationAlert[] = [
  {
    id: 'kelani-1',
    riverName: 'Kelani River',
    riverNameSi: 'කැළණි ගඟ',
    station: 'Nagalagam Street',
    stationSi: 'නාගලගම් වීදිය',
    waterLevel: '7.45 ft (Threshold: 7.00 ft)',
    status: 'Minor Flood',
    statusSi: 'සුළු ගංවතුර',
    trend: 'Rising',
    trendSi: 'ඉහළ යමින්',
    district: 'Colombo / Gampaha',
    reportedTime: '10 mins ago',
  },
  {
    id: 'kalu-1',
    riverName: 'Kalu Ganga',
    riverNameSi: 'කළු ගඟ',
    station: 'Ratnapura Town Gauge',
    stationSi: 'රත්නපුර නගරය',
    waterLevel: '19.80 m (Threshold: 18.00 m)',
    status: 'Major Flood',
    statusSi: 'මහා ගංවතුර අවදානම',
    trend: 'Rising',
    trendSi: 'වේගයෙන් ඉහළ යමින්',
    district: 'Ratnapura',
    reportedTime: '5 mins ago',
  },
  {
    id: 'gin-1',
    riverName: 'Gin Ganga',
    riverNameSi: 'ගිං ගඟ',
    station: 'Baddegama Station',
    stationSi: 'බද්දේගම ස්ථානය',
    waterLevel: '4.20 m (Threshold: 4.00 m)',
    status: 'Alert',
    statusSi: 'අවදානම් මට්ටම',
    trend: 'Rising',
    trendSi: 'ඉහළ යමින්',
    district: 'Galle',
    reportedTime: '15 mins ago',
  },
  {
    id: 'attanagalu-1',
    riverName: 'Attanagalu Oya',
    riverNameSi: 'අත්තනගලු ඔය',
    station: 'Dunamale Water Gauge',
    stationSi: 'දූනමලේ ස්ථානය',
    waterLevel: '4.75 m (Threshold: 4.40 m)',
    status: 'Alert',
    statusSi: 'අවදානම් මට්ටම',
    trend: 'Stable',
    trendSi: 'ස්ථායී',
    district: 'Gampaha',
    reportedTime: '20 mins ago',
  },
  {
    id: 'nilwala-1',
    riverName: 'Nilwala Ganga',
    riverNameSi: 'නිල්වලා ගඟ',
    station: 'Panadugama Station',
    stationSi: 'පනාදුගම ස්ථානය',
    waterLevel: '5.10 m (Threshold: 6.00 m)',
    status: 'Normal',
    statusSi: 'සාමාන්‍ය මට්ටම',
    trend: 'Falling',
    trendSi: 'පහළ බසිමින්',
    district: 'Matara',
    reportedTime: '25 mins ago',
  },
];

export const RiverAlertTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAllModal, setShowAllModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Auto-advance every 5 seconds if not paused
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % RIVER_ALERTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  if (!isVisible) return null;

  const current = RIVER_ALERTS[currentIndex];

  const getStatusColor = (status: RiverStationAlert['status']) => {
    switch (status) {
      case 'Major Flood':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30';
      case 'Minor Flood':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 ring-1 ring-amber-500/30';
      case 'Alert':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <>
      {/* Ticker Bar */}
      <aside
        aria-label="National Hydrological Telemetry & River Flood Alerts"
        className="w-full bg-[#0a1628]/95 dark:bg-[#060d19]/95 border-b border-[#1b2e4b] dark:border-white/10 text-slate-200 text-xs shadow-xs z-20 select-none transition-all backdrop-blur-md"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="w-full px-4 sm:px-8 py-2 flex items-center justify-between gap-3">
          {/* Left: National Hydrology Telemetry Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-extrabold uppercase tracking-wider text-[11px] text-teal-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">DMC / Irrigation Dept</span>
              <span className="sm:hidden">DMC Live</span>
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
          </div>

          {/* Center: Dynamic Rotating Alert */}
          <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden justify-start sm:justify-center">
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 ${getStatusColor(
                current.status
              )}`}
            >
              ⚠️ {current.status} ({current.statusSi})
            </span>

            <span className="font-bold text-white truncate text-[11px] sm:text-xs">
              {current.riverName} ({current.riverNameSi})
            </span>

            <span className="text-slate-400 hidden lg:inline">@ {current.station}:</span>

            <span className="text-amber-300 font-mono font-bold hidden sm:inline text-[11px] sm:text-xs">
              {current.waterLevel}
            </span>

            <span className="text-[10px] font-semibold text-rose-400 hidden xl:flex items-center gap-1 shrink-0">
              <TrendingUp className="w-3 h-3" />
              {current.trend} ({current.trendSi})
            </span>
          </div>

          {/* Right: Controls & All Basins button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setShowAllModal(true)}
              className="text-[11px] font-bold text-teal-400 hover:text-teal-300 hover:underline px-2 py-1 rounded-md transition cursor-pointer flex items-center gap-1"
              title="View all 5 river basin gauge levels"
            >
              <Waves className="w-3.5 h-3.5" />
              <span className="hidden md:inline">All Basins</span>
            </button>

            <div className="hidden sm:flex items-center bg-[#13233c] rounded-lg p-0.5 border border-[#213a60]">
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev - 1 + RIVER_ALERTS.length) % RIVER_ALERTS.length)
                }
                className="p-1 hover:text-white text-slate-400 hover:bg-[#1a3153] rounded transition cursor-pointer"
                aria-label="Previous alert"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 hover:text-white text-slate-400 hover:bg-[#1a3153] rounded transition cursor-pointer"
                aria-label={isPaused ? 'Resume auto-play' : 'Pause ticker'}
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-3 h-3 text-teal-400" /> : <Pause className="w-3 h-3" />}
              </button>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % RIVER_ALERTS.length)}
                className="p-1 hover:text-white text-slate-400 hover:bg-[#1a3153] rounded transition cursor-pointer"
                aria-label="Next alert"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-slate-500 hover:text-slate-300 transition cursor-pointer ml-1"
              title="Close Ticker"
              aria-label="Close river ticker"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Modal: All River Basins Overview */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="bg-[#0d1b32] border border-[#1e355b] text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#1b3154]">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                  <Waves className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    National River Basin Telemetry Gauges (ගංගා ජල මට්ටම් පද්ධතිය)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Hydrology & Disaster Early Warning Network • Updated Real-time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {RIVER_ALERTS.map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl bg-[#13233c] border border-[#213b63] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-teal-500/40 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {r.riverName} ({r.riverNameSi})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(
                          r.status
                        )}`}
                      >
                        {r.status} ({r.statusSi})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>
                        Station: <strong>{r.station} ({r.stationSi})</strong> • District: {r.district}
                      </span>
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <p className="font-mono font-black text-amber-300 text-sm">{r.waterLevel}</p>
                    <p className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 sm:justify-end">
                      <TrendingUp className="w-3 h-3" />
                      Trend: {r.trend} ({r.trendSi})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200 text-xs flex items-center justify-between">
              <span>Data source: Disaster Management Centre (DMC) & Irrigation Department of Sri Lanka</span>
              <button
                onClick={() => setShowAllModal(false)}
                className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold transition cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
