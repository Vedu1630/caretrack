import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Thermometer,
  Stethoscope,
  LogOut,
  BarChart3,
  UserCog,
  CheckCircle2,
  Activity,
  Shield,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usePatients } from '../../context/PatientContext';

export const Sidebar = ({ mobileOpen, setMobileOpen }) => {
  const { currentUser, logout, loginAsRole } = useAuth();
  const { pendingTempChecks, pendingDoctorVisits, dischargeEligible } = usePatients();

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Patients',
      path: '/patients',
      icon: Users,
    },
    {
      name: 'Temperature Monitoring',
      path: '/temperatures',
      icon: Thermometer,
      badge: pendingTempChecks > 0 ? pendingTempChecks : null,
      badgeVariant: 'warning',
    },
    {
      name: 'Doctor Visits',
      path: '/doctor-visits',
      icon: Stethoscope,
      badge: pendingDoctorVisits > 0 ? pendingDoctorVisits : null,
      badgeVariant: 'brand',
    },
    {
      name: 'Discharge Management',
      path: '/discharge',
      icon: CheckCircle2,
      badge: dischargeEligible > 0 ? dischargeEligible : null,
      badgeVariant: 'success',
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'User Management',
      path: '/users',
      icon: UserCog,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <Activity className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-brand-950 tracking-tight">CareTrack</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                Quarantine & Treatment Facility
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Clinical Operations
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : item.badgeVariant === 'success'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-brand-100 text-brand-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Demo Role Switcher Quick Pill (for ease of TPM evaluation) */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <span>Demo Role Switcher</span>
            <Shield className="w-3.5 h-3.5 text-brand-600" />
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => loginAsRole('admin')}
              className={`px-1.5 py-1 text-xs rounded-lg font-medium transition ${
                currentUser?.role === 'admin'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => loginAsRole('nurse')}
              className={`px-1.5 py-1 text-xs rounded-lg font-medium transition ${
                currentUser?.role === 'nurse'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Nurse
            </button>
            <button
              onClick={() => loginAsRole('doctor')}
              className={`px-1.5 py-1 text-xs rounded-lg font-medium transition ${
                currentUser?.role === 'doctor'
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Doctor
            </button>
          </div>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0 text-xs border border-brand-200">
                {currentUser?.avatar || 'CT'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-brand-950 truncate">
                  {currentUser?.name || 'Staff Member'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      currentUser?.role === 'admin'
                        ? 'bg-purple-500'
                        : currentUser?.role === 'doctor'
                        ? 'bg-brand-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span className="text-[11px] font-medium capitalize text-slate-500 truncate">
                    {currentUser?.roleTitle || currentUser?.role}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
