import React, { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { PatientStatusBadge, TempStatusBadge, Badge } from '../components/common/Badge';
import { PatientFormModal } from '../components/patients/PatientFormModal';
import { RecordTempModal } from '../components/temperatures/RecordTempModal';
import { PatientDetailModal } from '../components/patients/PatientDetailModal';
import { DoctorVisitModal } from '../components/doctors/DoctorVisitModal';
import {
  Users,
  Bed,
  Thermometer,
  Stethoscope,
  CheckCircle2,
  HeartPulse,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  UserPlus,
  ShieldAlert,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const {
    patients,
    activePatients,
    occupiedBeds,
    availableBeds,
    totalCapacity,
    pendingTempChecks,
    pendingDoctorVisits,
    dischargeEligible,
    totalRecovered,
    totalDeaths,
    totalAdmissions,
    mortalityRate,
    successRate,
    isMortalityExceeded,
    auditLogs,
    stats,
  } = usePatients();

  const { currentUser, can } = useAuth();
  const navigate = useNavigate();

  // Modals state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRecordTempOpen, setIsRecordTempOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDoctorVisitOpen, setIsDoctorVisitOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const occupancyRate = ((occupiedBeds / totalCapacity) * 100).toFixed(0);
  const tempCompletionRate = activePatients.length > 0
    ? (((activePatients.length - pendingTempChecks) / activePatients.length) * 100).toFixed(0)
    : 100;

  // Pie chart data for vitals completion
  const tempChartData = [
    { name: 'Completed', value: activePatients.length - pendingTempChecks, color: '#2563EB' },
    { name: 'Pending', value: pendingTempChecks, color: '#F59E0B' },
  ];

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Mortality Warning Banner if exceeded 15% */}
      {isMortalityExceeded && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 shadow-xs animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-rose-950">
              Epidemiological Warning: Mortality Rate Above Threshold
            </h4>
            <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
              Current facility mortality rate is <strong>{mortalityRate}%</strong> ({totalDeaths} deaths out of {totalAdmissions} total admissions), exceeding the acceptable 15.0% threshold. Immediate clinical triage review required.
            </p>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-semibold px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition shrink-0"
          >
            Investigate Analytics
          </button>
        </div>
      )}

      {/* Greeting & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-950 tracking-tight">
              Clinical Command Center
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Active Shift
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as <strong>{currentUser?.name}</strong> ({currentUser?.roleTitle}) • Ready for patient monitoring and rounds.
          </p>
        </div>

        {/* Quick action buttons depending on logged-in role */}
        <div className="flex flex-wrap items-center gap-2.5">
          {can.registerPatient && (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
          )}

          {can.recordTemperature && (
            <button
              onClick={() => setIsRecordTempOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-semibold rounded-xl transition"
            >
              <Thermometer className="w-4 h-4 text-brand-600" />
              <span>Record Temperature</span>
            </button>
          )}

          {can.completeDoctorVisit && (
            <button
              onClick={() => navigate('/doctor-visits')}
              className="flex items-center gap-2 px-3.5 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-semibold rounded-xl transition"
            >
              <Stethoscope className="w-4 h-4 text-brand-600" />
              <span>Conduct Rounds</span>
            </button>
          )}

          {can.confirmDischarge && (
            <button
              onClick={() => navigate('/discharge')}
              className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-xl transition"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Process Discharge ({dischargeEligible})</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards (All 6 Primary KPIs Required by Spec) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Patients"
          value={totalCapacity}
          subtitle={`Capacity Max`}
          icon={Users}
          badgeText="Facility Benchmark"
          badgeVariant="default"
          onClick={() => navigate('/patients')}
        />

        <StatCard
          title="Occupied Beds"
          value={occupiedBeds}
          subtitle={`of ${totalCapacity} Beds`}
          icon={Bed}
          badgeText={`${occupancyRate}% Full`}
          badgeVariant={occupiedBeds >= totalCapacity ? 'danger' : 'primary'}
          onClick={() => navigate('/patients')}
        />

        <StatCard
          title="Pending Temp Checks"
          value={pendingTempChecks}
          subtitle="Today's Vitals"
          icon={Thermometer}
          badgeText={pendingTempChecks > 0 ? 'Action Required' : 'All Complete'}
          badgeVariant={pendingTempChecks > 0 ? 'warning' : 'success'}
          onClick={() => navigate('/temperatures')}
        />

        <StatCard
          title="Pending Doctor Visits"
          value={pendingDoctorVisits}
          subtitle="Clinical Rounds"
          icon={Stethoscope}
          badgeText={pendingDoctorVisits > 0 ? 'Rounds Pending' : 'Up to Date'}
          badgeVariant={pendingDoctorVisits > 0 ? 'warning' : 'success'}
          onClick={() => navigate('/doctor-visits')}
        />

        <StatCard
          title="Discharge Eligible"
          value={dischargeEligible}
          subtitle="≥ 3 Fever-Free Days"
          icon={CheckCircle2}
          badgeText="Ready to Clear"
          badgeVariant="success"
          onClick={() => navigate('/discharge')}
        />

        <StatCard
          title="Total Recovered"
          value={totalRecovered}
          subtitle={`Success Rate ${successRate}%`}
          icon={HeartPulse}
          badgeText={`${successRate}% Rate`}
          badgeVariant="success"
          onClick={() => navigate('/analytics')}
        />
      </div>

      {/* Middle Section: Facility Progress Bar & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Occupancy & Temperature Completion Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Facility Occupancy Progress
              </span>
              <span className="text-xs font-bold text-brand-950">
                {occupiedBeds} / {totalCapacity} Beds ({occupancyRate}%)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mt-2 overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  occupiedBeds >= totalCapacity
                    ? 'bg-rose-500'
                    : occupiedBeds > 60
                    ? 'bg-amber-500'
                    : 'bg-brand-600'
                }`}
                style={{ width: `${Math.min(100, (occupiedBeds / totalCapacity) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
              <span>{availableBeds} available isolation rooms</span>
              <span>74 max capacity limit</span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Today's Temperature Completion
              </span>
              <span className="text-xs font-bold text-brand-600">{tempCompletionRate}%</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 h-24 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tempChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {tempChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-brand-600" />
                  <span className="text-slate-600">
                    Recorded: <strong>{activePatients.length - pendingTempChecks}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-amber-500" />
                  <span className="text-slate-600">
                    Pending: <strong>{pendingTempChecks}</strong>
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  1 entry required per patient per day.
                </p>
              </div>
            </div>
          </div>

          {/* Mortality rate indicator widget */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mortality Rate Indicator
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isMortalityExceeded
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {mortalityRate}% (Target &le; 15%)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Formula: ({totalDeaths} Deaths ÷ {totalAdmissions} Total Admissions) × 100.
            </p>
          </div>
        </div>

        {/* Right: Admissions vs Recoveries Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-brand-950">
                Patient Admissions vs. Recoveries Trajectory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily clinical influx and cumulative recovery trends over recent monitoring cycles
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                <span className="text-slate-600 font-medium">Admissions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">Recoveries</span>
              </div>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.historicalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRecoveries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="admissions" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAdmissions)" />
                <Area type="monotone" dataKey="recoveries" stroke="#10B981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRecoveries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section: Pending Tasks & Recent Patient Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-brand-950">Pending Clinical Tasks</h3>
            </div>
            <span className="text-xs text-slate-400">Action Queue</span>
          </div>

          <div className="divide-y divide-slate-100 mt-2">
            {/* Pending Temp Task */}
            {pendingTempChecks > 0 ? (
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">
                    {pendingTempChecks} Patients Awaiting Daily Temperature Check
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Nurses must complete today's vitals measurement before physician rounds.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/temperatures?filter=pending')}
                  className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition"
                >
                  View Tasks
                </button>
              </div>
            ) : null}

            {/* Pending Doctor Visit Task */}
            {pendingDoctorVisits > 0 ? (
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">
                    {pendingDoctorVisits} Patients Awaiting Physician Rounds
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Doctors review recorded vitals and record treatment observations.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/doctor-visits?filter=awaiting_doctor')}
                  className="text-xs font-semibold px-3 py-1.5 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-100 transition"
                >
                  Start Rounds
                </button>
              </div>
            ) : null}

            {/* Discharge Eligible Task */}
            {dischargeEligible > 0 ? (
              <div className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-emerald-950">
                    {dischargeEligible} Patients Eligible for Discharge (3 Days Afebrile)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Requires Doctor recommendation & Administrator discharge confirmation.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/discharge')}
                  className="text-xs font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition"
                >
                  Review Clearances
                </button>
              </div>
            ) : null}

            {pendingTempChecks === 0 && pendingDoctorVisits === 0 && dischargeEligible === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                All daily clinical tasks are completed!
              </div>
            )}
          </div>
        </div>

        {/* Recent Patient Activity / Audit Trail */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-brand-950">Recent Facility Activity & Audit</h3>
            </div>
            <span className="text-xs text-slate-400">Live Feed</span>
          </div>

          <div className="divide-y divide-slate-100 mt-2 max-h-60 overflow-y-auto">
            {auditLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.action.includes('FEVER') || log.action.includes('CRITICAL')
                      ? 'bg-rose-500'
                      : log.action.includes('DISCHARGE')
                      ? 'bg-emerald-500'
                      : 'bg-brand-500'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-800 font-medium leading-relaxed">
                    {log.details}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{log.timestamp}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-600">{log.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <PatientFormModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <RecordTempModal
        isOpen={isRecordTempOpen}
        onClose={() => setIsRecordTempOpen(false)}
      />

      <PatientDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        patient={selectedPatient}
        onRecordTempClick={(p) => {
          setSelectedPatient(p);
          setIsRecordTempOpen(true);
        }}
        onDoctorVisitClick={(p) => {
          setSelectedPatient(p);
          setIsDoctorVisitOpen(true);
        }}
        onDischargeClick={() => navigate('/discharge')}
      />

      <DoctorVisitModal
        isOpen={isDoctorVisitOpen}
        onClose={() => setIsDoctorVisitOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
};
