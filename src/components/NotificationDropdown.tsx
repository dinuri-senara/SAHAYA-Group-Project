import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  CheckCheck, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Siren, 
  Trash2, 
  X, 
  RotateCcw, 
  BellOff 
} from 'lucide-react';
import { api } from '../services/api';
import { NotificationItem } from '../types';

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch {
      // Ignored if unauthenticated
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // 30s poll
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearSingle = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    await api.clearNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = async () => {
    await api.clearAllNotifications();
    setNotifications([]);
  };

  const handleRestoreDefaults = async () => {
    const data = await api.restoreDefaultNotifications();
    setNotifications(data);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'EmergencyAlert': return <Siren className="w-4 h-4 text-rose-500" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    return true;
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shadow-xs border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer"
      >
        <Bell className="w-4.5 h-4.5 text-slate-700 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-84 sm:w-[410px] rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden text-slate-800 dark:text-slate-200 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-teal-500/10 text-teal-400">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold tracking-tight">Crisis Alerts & Center</span>
              {unreadCount > 0 && (
                <span className="text-[11px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>

            {/* Header Global Actions */}
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="text-xs text-teal-300 hover:text-teal-200 flex items-center gap-1 font-medium cursor-pointer transition px-1.5 py-0.5 rounded hover:bg-slate-800"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  title="Clear all alerts"
                  className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 font-medium cursor-pointer transition px-1.5 py-0.5 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Sub-Header Bar */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    filter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                    filter === 'unread'
                      ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              <span className="text-[10px] text-slate-400 font-medium">
                Live 30s Polling
              </span>
            </div>
          )}

          {/* Notification List Container */}
          <div className="max-h-88 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                  <BellOff className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {filter === 'unread' 
                    ? 'No unread notifications' 
                    : 'No active notifications right now.'}
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  {filter === 'unread'
                    ? 'All alerts have been marked as read.'
                    : 'You have cleared all alerts or there are no new crisis dispatches.'}
                </p>

                {filter === 'unread' && notifications.length > 0 && (
                  <button
                    onClick={() => setFilter('all')}
                    className="mt-2 text-xs font-medium text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    View all notifications ({notifications.length})
                  </button>
                )}

                {notifications.length === 0 && (
                  <button
                    onClick={handleRestoreDefaults}
                    className="mt-3 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-teal-500" />
                    Restore Sample Alerts
                  </button>
                )}
              </div>
            ) : (
              filteredNotifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleMarkAsRead(n.id)}
                  className={`group relative p-3.5 flex items-start gap-3 transition cursor-pointer ${
                    n.isRead 
                      ? 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 opacity-80' 
                      : 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
                  }`}
                >
                  {/* Category Type Icon */}
                  <div className="mt-0.5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200/60 dark:border-slate-700 group-hover:scale-105 transition-transform">
                    {getIcon(n.type)}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-bold truncate ${n.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {n.message}
                    </p>
                  </div>

                  {/* Right Actions: Read Indicator & Clear Single Button */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {/* Clear / Dismiss Button */}
                    <button
                      onClick={(e) => handleClearSingle(e, n.id)}
                      title="Clear this notification"
                      aria-label="Dismiss notification"
                      className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 transition cursor-pointer opacity-70 hover:opacity-100"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>

                    {/* Unread dot */}
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-200 dark:ring-rose-950" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{notifications.length} total alerts</span>
              <button
                onClick={handleRestoreDefaults}
                className="text-[11px] text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset demo data
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
