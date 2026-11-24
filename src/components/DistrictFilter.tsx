import React from 'react';
import { MapPin, RotateCcw, Compass, ChevronDown } from 'lucide-react';
import {
  SRI_LANKA_PROVINCES,
  SRI_LANKA_DISTRICTS,
  HIGH_ALERT_DISTRICTS,
} from '../data/sriLankaDistricts';

export interface DistrictFilterProps {
  selectedProvince: string;
  selectedDistrict: string;
  onProvinceChange: (province: string) => void;
  onDistrictChange: (district: string) => void;
  resultCount?: number;
  totalCount?: number;
  label?: string;
  className?: string;
  showQuickPills?: boolean;
}

export const DistrictFilter: React.FC<DistrictFilterProps> = ({
  selectedProvince,
  selectedDistrict,
  onProvinceChange,
  onDistrictChange,
  resultCount,
  totalCount,
  label = 'Geographic Disaster Zone / පළාත් හා දිස්ත්‍රික්ක පෙරහන',
  className = '',
  showQuickPills = true,
}) => {
  // If a province is selected, only show its districts
  const availableDistricts =
    selectedProvince === 'All'
      ? SRI_LANKA_DISTRICTS
      : SRI_LANKA_DISTRICTS.filter((d) => {
          const prov = SRI_LANKA_PROVINCES.find((p) => p.name === selectedProvince);
          return prov ? d.provinceId === prov.id : true;
        });

  const handleProvinceSelect = (provName: string) => {
    onProvinceChange(provName);
    // If the currently selected district is not in the newly selected province, reset district to 'All'
    if (provName !== 'All') {
      const prov = SRI_LANKA_PROVINCES.find((p) => p.name === provName);
      if (prov && selectedDistrict !== 'All') {
        const distBelongs = SRI_LANKA_DISTRICTS.some(
          (d) => d.provinceId === prov.id && d.name.toLowerCase() === selectedDistrict.toLowerCase()
        );
        if (!distBelongs) {
          onDistrictChange('All');
        }
      }
    }
  };

  const handleReset = () => {
    onProvinceChange('All');
    onDistrictChange('All');
  };

  const isFiltered = selectedProvince !== 'All' || selectedDistrict !== 'All';

  return (
    <div
      className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 ${className}`}
    >
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
            <Compass className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </span>
          {resultCount !== undefined && totalCount !== undefined && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {resultCount} of {totalCount} matching
            </span>
          )}
        </div>

        {isFiltered && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Location Filter (මුදාහරින්න)
          </button>
        )}
      </div>

      {/* Dropdown selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Province Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Province / පළාත
          </label>
          <div className="relative">
            <select
              value={selectedProvince}
              onChange={(e) => handleProvinceSelect(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">All 9 Provinces (සියලු පළාත්)</option>
              {SRI_LANKA_PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.name}>
                  {prov.name} ({prov.nameSi})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* District Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            District / දිස්ත්‍රික්කය
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="All">
                {selectedProvince === 'All'
                  ? 'All 25 Districts (සියලු දිස්ත්‍රික්ක)'
                  : `All Districts in ${selectedProvince}`}
              </option>
              {availableDistricts.map((dist) => (
                <option key={dist.id} value={dist.name}>
                  {dist.name} ({dist.nameSi})
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* High Alert Quick Picks */}
      {showQuickPills && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-medium text-slate-400 mr-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            Disaster Hotspots (අවදානම් කලාප):
          </span>
          {HIGH_ALERT_DISTRICTS.map((distName) => {
            const isActive = selectedDistrict.toLowerCase() === distName.toLowerCase();
            return (
              <button
                key={distName}
                type="button"
                onClick={() => {
                  if (isActive) {
                    onDistrictChange('All');
                  } else {
                    onDistrictChange(distName);
                    // auto set province if known
                    const distInfo = SRI_LANKA_DISTRICTS.find((d) => d.name === distName);
                    if (distInfo) {
                      const prov = SRI_LANKA_PROVINCES.find((p) => p.id === distInfo.provinceId);
                      if (prov) onProvinceChange(prov.name);
                    }
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {distName}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
