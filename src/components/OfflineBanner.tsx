import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WifiOff, Wifi, AlertTriangle, RefreshCw, PhoneCall, X } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const prevOfflineRef = useRef(false);

  // Real Internet Probe (fails when Wi-Fi / WAN is off, even if Hyper-V or localhost is running)
  const probeRealInternet = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine) return false;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      // Real external ping that fails when Wi-Fi is disconnected
      await fetch('https://www.google.com/generate_204?t=' + Date.now(), {
        mode: 'no-cors',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateConnectivityStatus = useCallback(async () => {
    const hasInternet = await probeRealInternet();
    const nowOffline = !hasInternet;

    if (prevOfflineRef.current && !nowOffline) {
      // Transitioned from Offline to Online -> Show "Restored" banner
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 4500);
    }

    prevOfflineRef.current = nowOffline;
    setIsOffline(nowOffline);
  }, [probeRealInternet]);

  useEffect(() => {
    updateConnectivityStatus();

    // Check periodically every 4 seconds
    const interval = setInterval(updateConnectivityStatus, 4000);

    const handleWindowOffline = () => {
      setIsOffline(true);
      prevOfflineRef.current = true;
    };

    const handleWindowOnline = () => {
      updateConnectivityStatus();
    };

    window.addEventListener('offline', handleWindowOffline);
    window.addEventListener('online', handleWindowOnline);
    window.addEventListener('focus', updateConnectivityStatus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('offline', handleWindowOffline);
      window.removeEventListener('online', handleWindowOnline);
      window.removeEventListener('focus', updateConnectivityStatus);
    };
  }, [updateConnectivityStatus]);

  const handleManualCheck = async () => {
    setIsChecking(true);
    const hasInternet = await probeRealInternet();
    setIsOffline(!hasInternet);
    if (hasInternet) {
      setShowRestored(true);
      setTimeout(() => setShowRestored(false), 4000);
    }
    setIsChecking(false);
  };

  return (
    <>
      {/* 1. Connection Restored Notice (Green banner) */}
      {showRestored && !isOffline && (
        <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md animate-fade-in transition-all">
          <div className="w-full px-4 sm:px-8 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2.5">
              <span className="p-1 rounded-lg bg-white/20">
                <Wifi className="w-4 h-4 text-white" />
              </span>
              <span>
                <strong>Connection Restored (සම්බන්ධතාවය යථා තත්ත්වයට පත් විය):</strong> Disaster data synchronized with national command.
              </span>
            </div>
            <button
              onClick={() => setShowRestored(false)}
              className="p-1 rounded-md hover:bg-white/20 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Offline Disaster Warning Banner (Red/Amber) */}
      {isOffline && !isDismissed && (
        <div className="sticky top-0 z-30 w-full bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-xl border-b border-rose-700/60 animate-fade-in transition-all">
          <div className="w-full px-4 sm:px-8 py-2.5 sm:py-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
            {/* Left: Hazard Icon & Details */}
            <div className="flex items-start sm:items-center gap-2.5">
              <div className="relative p-1.5 rounded-xl bg-black/20 shrink-0 mt-0.5 sm:mt-0">
                <WifiOff className="w-4 h-4 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-200"></span>
                </span>
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-200" />
                    You are currently offline (අන්තර්ජාලය විසන්ධි වී ඇත)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 text-white uppercase tracking-wider">
                    Emergency Local Mode
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-rose-100 font-medium mt-0.5 leading-snug">
                  Emergency assistance requests, shelter assignments, and stock allocations will be preserved locally until connection recovers.
                </p>
              </div>
            </div>

            {/* Right: Hotline shortcut, Check Button & Dismiss */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-1 md:pt-0 border-t md:border-t-0 border-white/10">
              <a
                href="tel:117"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/25 hover:bg-black/35 text-white text-[11px] font-bold transition shadow-xs"
                title="Dial 117 for Disaster Management Centre"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-200" />
                <span>SOS: 117 / 1990</span>
              </a>

              <button
                onClick={handleManualCheck}
                disabled={isChecking}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold transition shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
              </button>

              <button
                onClick={() => setIsDismissed(true)}
                className="p-1.5 rounded-lg bg-black/15 hover:bg-black/25 text-white/90 transition cursor-pointer"
                aria-label="Dismiss banner"
                title="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Minimized Floating Button (if dismissed while offline) */}
      {isOffline && isDismissed && (
        <button
          onClick={() => setIsDismissed(false)}
          className="fixed bottom-4 left-4 z-50 flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition animate-bounce cursor-pointer"
          title="Internet disconnected - click to view warning"
        >
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode Active</span>
        </button>
      )}
    </>
  );
};
