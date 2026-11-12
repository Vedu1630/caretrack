import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  Activity,
  Shield,
  Stethoscope,
  HeartPulse,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('admin@caretrack.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { login, loginAsRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(email, password);
    if (res.success) {
      toast.success('Welcome Back', `Logged in as ${res.user.name} (${res.user.role})`);
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemoLogin = (role) => {
    const res = loginAsRole(role);
    if (res.success) {
      toast.success('Demo Login Success', `Authenticated as ${res.user.roleTitle} (${res.user.role})`);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/25 mb-4">
          <Activity className="w-8 h-8 stroke-[2.5]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-950 tracking-tight">
          CareTrack
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Smarter Patient Monitoring. Better Care.
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          Quarantine & Viral Treatment Facility Portal
        </div>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-card border border-slate-200/80">
          <div className="mb-6">
            <h3 className="text-base font-bold text-slate-900">Welcome Back</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your clinical credentials or use 1-click role login below.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hospital Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@caretrack.com"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Demo: password123</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* 1-Click Role Login for Demonstration Assessment */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                1-Click Demo Personas
              </span>
              <span className="text-[10px] text-brand-600 font-medium">FactWise Assessment</span>
            </div>

            <div className="space-y-2">
              {/* Admin */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs border border-purple-200">
                    AD
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-brand-900">
                        Sarah Jenkins, MHA
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        Admin
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">admin@caretrack.com</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
              </button>

              {/* Nurse */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('nurse')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                    RN
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-brand-900">
                        Elena Rostova, RN
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Nurse
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">nurse@caretrack.com</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
              </button>

              {/* Doctor */}
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doctor')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs border border-brand-200">
                    MD
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-brand-900">
                        Dr. Marcus Vance, MD
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                        Doctor
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 block">doctor@caretrack.com</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition" />
              </button>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <p className="mt-6 text-center text-xs text-slate-400">
          FactWise Technical Product Manager Demo • Clean light theme healthcare SaaS
        </p>
      </div>
    </div>
  );
};
