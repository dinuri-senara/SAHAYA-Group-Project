import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CrisisEvent, Shelter, AssistanceRequest } from '../types';

// Fix default leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin creators
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const incidentIcon = createCustomIcon('#DC2626'); // Red
const shelterIcon = createCustomIcon('#0D9488');  // Teal
const requestIcon = createCustomIcon('#D97706');  // Amber
const pickedIcon = createCustomIcon('#2563EB');   // Blue

interface MapProps {
  center?: [number, number];
  zoom?: number;
  incidents?: CrisisEvent[];
  shelters?: Shelter[];
  requests?: AssistanceRequest[];
  selectedLocation?: [number, number] | null;
  onLocationSelect?: (lat: number, lon: number) => void;
  height?: string;
}

function LocationPicker({ onSelect }: { onSelect?: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      if (onSelect) {
        onSelect(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
      }
    },
  });
  return null;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const MapComponent: React.FC<MapProps> = ({
  center = [6.0535, 80.2210],
  zoom = 11,
  incidents = [],
  shelters = [],
  requests = [],
  selectedLocation,
  onLocationSelect,
  height = '450px',
}) => {
  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative z-0 isolate">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {onLocationSelect && <LocationPicker onSelect={onLocationSelect} />}

        {/* Selected Location Marker */}
        {selectedLocation && (
          <Marker position={selectedLocation} icon={pickedIcon}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-xs text-blue-600">Selected Coordinate</p>
                <p className="text-[11px] text-slate-600">
                  Lat: {selectedLocation[0]}, Lon: {selectedLocation[1]}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Crisis Incidents */}
        {incidents.map(inc => (
          <Marker key={inc.id} position={[inc.latitude, inc.longitude]} icon={incidentIcon}>
            <Popup>
              <div className="p-1 max-w-xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-700">
                    {inc.disasterType}
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-600 text-white uppercase">
                    {inc.severity}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{inc.title}</h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{inc.description}</p>
                <p className="text-[10px] text-slate-400 mt-1">Location: {inc.location}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Shelters */}
        {shelters.map(s => (
          <Marker key={s.id} position={[s.latitude, s.longitude]} icon={shelterIcon}>
            <Popup>
              <div className="p-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-teal-100 text-teal-800">
                    Shelter
                  </span>
                  <span className={`text-[10px] font-bold ${s.availableCapacity > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {s.currentOccupancy} / {s.totalCapacity} ({s.availableCapacity} available)
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{s.name}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{s.address}</p>
                <p className="text-[10px] text-teal-700 mt-1 font-semibold">Contact: {s.contactPhone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Assistance Requests */}
        {requests.map(r => (
          <Marker key={r.id} position={[r.latitude, r.longitude]} icon={requestIcon}>
            <Popup>
              <div className="p-1 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                    {r.category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700">
                    {r.urgency}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900">{r.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{r.description}</p>
                <p className="text-[10px] text-slate-500 mt-1">{r.affectedCount} affected people</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Floating Banner */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3 text-[11px] font-semibold text-slate-700">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Incidents
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-600" /> Shelters
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Requests
        </span>
      </div>
    </div>
  );
};
