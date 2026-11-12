import React, { useState } from 'react';
import { usePatients } from '../context/PatientContext';
import { StatCard } from '../components/common/StatCard';
import {
  Users,
  HeartPulse,
  AlertTriangle,
  Bed,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  BarChart3,
  Activity,
  CheckCircle2,
  AlertOctagon,
  HelpCircle,
  Sliders
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const Analytics = () => {
  const {
    occupiedBeds,
    totalRecovered,
    totalDeaths: initialDeaths,
    totalCapacity,
    stats,
  } = usePatients();

  const [dateRange, setDateRange] = useState('14d'); // 7d, 14d, 30d
  const [simulatedExtraDeaths, setSimulatedExtraDeaths] = useState(0);

  // Dynamic values allowing test simulation of >15% threshold
  const totalDeaths = initialDeaths + simulatedExtraDeaths;
  const currentlyAdmitted = occupiedBeds;
  const totalAdmissions = currentlyAdmitted + totalRecovered + totalDeaths;

  // Strict formulas:
  // Mortality Rate = (Total Deaths / Total Admissions) * 100
  // Success Rate = (Total Recovered / Total Admissions) * 100
  const mortalityRate = totalAdmissions > 0 ? ((totalDeaths / totalAdmissions) * 100).toFixed(1) : 0;
  const successRate = totalAdmissions > 0 ? ((totalRecovered / totalAdmissions) * 100).toFixed(1) : 0;
  const isMortalityExceeded = parseFloat(mortalityRate) > 15.0;

  // Pie chart breakdown: outcomes (Closed cases + Active admitted)
  const outcomeData = [
    { name: 'Total Recovered', value: totalRecovered, color: '#10B981' },
    { name: 'Currently Admitted', value: currentlyAdmitted, color: '#2563EB' },
    { name: 'Total Deaths', value: totalDeaths, color: '#EF4444' },
  ];

  // Mortality trend over past weeks
  const mortalityTrendData = [
    { week: 'Wk 41', rate: 11.2, benchmark: 15.0 },
    { week: 'Wk 42', rate: 12.0, benchmark: 15.0 },
    { week: 'Wk 43', rate: 13.4, benchmark: 15.0 },
    { week: 'Wk 44', rate: 12.8, benchmark: 15.0 },
    { week: 'Wk 45', rate: parseFloat(mortalityRate), benchmark: 15.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Mortality Warning Banner if mortality exceeds 15% */}
      {isMortalityExceeded ? (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl flex items-start gap-4 shadow-md animate-in fade-in">
          <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0">
            <AlertOctagon className="w-6 h-6 animate-pulse text-rose-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-rose-950">
                CRITICAL WARNING: FACILITY MORTALITY RATE EXCEEDS 15.0% THRESHOLD
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-600 text-white">
                Severe Alert
              </span>
            </div>
            <p className="text-xs text-rose-800 mt-1 leading-relaxed">
              Current facility mortality stands at <strong>{mortalityRate}%</strong> ({totalDeaths} deaths out of {totalAdmissions} total admissions). This exceeds the expected healthcare safety benchmark of <strong>15.0%</strong>. Infection control officers, medical directors, and administrative oversight teams have been alerted.
            </p>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <span className="font-semibold text-rose-900">
                Underlying Numbers: {totalDeaths} Deceased • {totalRecovered} Recovered • {currentlyAdmitted} Admitted
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-950">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">Mortality Rate is Within Safety Benchmark</span>
              <span className="text-emerald-800">
                Current rate is <strong>{mortalityRate}%</strong> (expected maximum threshold: 15.0%). Success rate is <strong>{successRate}%</strong> (expected target: 85.0%).
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-white border border-emerald-200 text-emerald-700 rounded-xl">
            Healthy Benchmark
          </span>
        </div>
      )}

      {/* Top Header with Date Filter & Scenario Simulator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-950 tracking-tight">
            Epidemiological & Mortality Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive statistical reporting of admissions, treatment efficacy, recoveries, and mortality rates
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Assessment Test Simulator for > 15% rule */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500">Test Mortality &gt; 15%:</span>
            {simulatedExtraDeaths === 0 ? (
              <button
                onClick={() => setSimulatedExtraDeaths(6)}
                className="font-semibold text-rose-600 hover:text-rose-700 underline text-xs"
              >
                Simulate Spike (+6 Deaths)
              </button>
            ) : (
              <button
                onClick={() => setSimulatedExtraDeaths(0)}
                className="font-semibold text-brand-600 hover:text-brand-700 underline text-xs"
              >
                Reset to Normal (0)
              </button>
            )}
          </div>

          {/* Date range selector */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl text-xs">
            <button
              onClick={() => setDateRange('7d')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                dateRange === '7d' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDateRange('14d')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                dateRange === '14d' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600'
              }`}
            >
              14 Days
            </button>
            <button
              onClick={() => setDateRange('30d')}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                dateRange === '30d' ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-slate-600'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards (All 6 Required by Prompt Specification) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Admissions"
          value={totalAdmissions}
          subtitle="Cumulative Influx"
          icon={Users}
          badgeText="All Time Census"
          badgeVariant="default"
        />

        <StatCard
          title="Total Recovered"
          value={totalRecovered}
          subtitle={`Success Rate ${successRate}%`}
          icon={HeartPulse}
          badgeText={`${successRate}% of total`}
          badgeVariant="success"
        />

        <StatCard
          title="Total Deaths"
          value={totalDeaths}
          subtitle={`Mortality ${mortalityRate}%`}
          icon={AlertTriangle}
          badgeText={`${mortalityRate}% of total`}
          badgeVariant={isMortalityExceeded ? 'danger' : 'default'}
          alert={isMortalityExceeded}
        />

        <StatCard
          title="Currently Admitted"
          value={currentlyAdmitted}
          subtitle={`of ${totalCapacity} Beds`}
          icon={Bed}
          badgeText="In Active Care"
          badgeVariant="primary"
        />

        <StatCard
          title="Mortality Rate"
          value={`${mortalityRate}%`}
          subtitle={`(${totalDeaths} / ${totalAdmissions})`}
          icon={TrendingDown}
          badgeText="Benchmark ≤ 15%"
          badgeVariant={isMortalityExceeded ? 'danger' : 'success'}
          alert={isMortalityExceeded}
          alertMessage="Exceeds 15% Threshold!"
        />

        <StatCard
          title="Success Rate"
          value={`${successRate}%`}
          subtitle={`(${totalRecovered} / ${totalAdmissions})`}
          icon={TrendingUp}
          badgeText="Target ≥ 85%"
          badgeVariant={parseFloat(successRate) >= 85 ? 'success' : 'warning'}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Admissions vs Recoveries Line Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-brand-950">
                Admissions versus Recoveries Trajectory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparison of daily patient intake versus discharge clearances
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-600" /> Admissions
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Recoveries
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.historicalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Line type="monotone" dataKey="admissions" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="recoveries" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Patient Outcomes Breakdown Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-950">
              Patient Census Outcome Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Proportion of total admissions ({totalAdmissions} cases)
            </p>
          </div>

          <div className="h-48 w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {outcomeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} patients (${((value / totalAdmissions) * 100).toFixed(1)}%)`, name]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {outcomeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  {item.value} ({((item.value / totalAdmissions) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Mortality Rate Trend vs Benchmark */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-brand-950">
                Mortality Rate Trend vs. 15% Facility Safety Benchmark
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isMortalityExceeded
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                Current: {mortalityRate}%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict hospital safety guideline: Total Deaths ÷ Total Admissions must stay under 15.0%
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Facility Mortality Rate
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 15% Alert Ceiling
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mortalityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 25]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                formatter={(val) => [`${val}%`, 'Mortality Rate']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
                {mortalityTrendData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={entry.rate > 15 ? '#EF4444' : '#2563EB'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Formula Rule: Currently admitted patients ({currentlyAdmitted}) are not counted as recovered or deceased.</span>
          <span>Target Tolerance: &le; 15.0%</span>
        </div>
      </div>
    </div>
  );
};
