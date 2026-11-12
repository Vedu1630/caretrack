import React, { useState } from 'react';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  AlertOctagon,
  Clock,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePatients } from '../../context/PatientContext';
import { useNavigate } from 'react-router-dom';

export const Topbar = ({ pageTitle, breadcrumbs = [], onMenuClick }) => {
  const { currentUser, logout, loginAsRole } = useAuth();
  const { auditLogs, resetAllData, feverThreshold } = usePatients();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // High priority alerts: filter audit logs for critical or fever items
  const recentAlerts = auditLogs
    .filter((log) => log.action.includes('FEVER') || log.action.includes('CRITICAL') || log.action.includes('OVERRIDE'))
    .slice(0, 5);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/patients?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>CareTrack</span>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-slate-300">/</span>
                  <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-slate-700' : ''}>
                    {crumb}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-lg font-bold text-brand-950 tracking-tight">{pageTitle}</h1>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search patients by name, ID or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </form>
        </div>

        {/* Right Actions: Notifications, Reset Demo Data, User Profile */}
        <div className="flex items-center gap-2">
          {/* Reset Demo Data button for evaluation comfort */}
          <button
            onClick={resetAllData}
            title="Reset to default demo data"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition"
              title="Clinical Alerts"
            >
              <Bell className="w-5 h-5" />
              {recentAlerts.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setShowNotifications(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-bold text-slate-900">Clinical Alerts & Events</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Cutoff: {feverThreshold}°C</span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {recentAlerts.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No active fever alerts recorded today.
                    </div>
                  ) : (
                    recentAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 hover:bg-slate-50 transition flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {alert.details}
                          </p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                            <Clock className="w-3 h-3" />
                            <span>{alert.timestamp}</span>
                            <span>•</span>
                            <span className="capitalize">{alert.user}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-semibold text-xs flex items-center justify-center shadow-xs">
                {currentUser?.avatar || 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-semibold text-brand-950 leading-tight">
                  {currentUser?.name?.split(' ')[0]}
                </span>
                <span className="block text-[10px] font-medium text-slate-500 capitalize leading-tight">
                  {currentUser?.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Menu Dropdown */}
            {showUserMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in"
                onClick={() => setShowUserMenu(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser?.email}</p>
                  <p className="text-[10px] font-semibold text-brand-600 uppercase mt-0.5">
                    {currentUser?.roleTitle}
                  </p>
                </div>

                <div className="p-2 border-b border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase tracking-wider block mb-1">
                    Switch Test Persona
                  </span>
                  <button
                    onClick={() => loginAsRole('admin')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                      currentUser?.role === 'admin' ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    👑 Administrator (Sarah Jenkins)
                  </button>
                  <button
                    onClick={() => loginAsRole('nurse')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                      currentUser?.role === 'nurse' ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    🩺 Nurse (Elena Rostova)
                  </button>
                  <button
                    onClick={() => loginAsRole('doctor')}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                      currentUser?.role === 'doctor' ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    👨‍⚕️ Doctor (Dr. Marcus Vance)
                  </button>
                </div>

                <div className="pt-1 px-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
