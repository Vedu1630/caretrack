import React, { useState, useMemo } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { PatientStatusBadge, TempStatusBadge, Badge } from '../components/common/Badge';
import { PatientFormModal } from '../components/patients/PatientFormModal';
import { PatientDetailModal } from '../components/patients/PatientDetailModal';
import { RecordTempModal } from '../components/temperatures/RecordTempModal';
import { DoctorVisitModal } from '../components/doctors/DoctorVisitModal';
import { EmptyState } from '../components/common/EmptyState';
import { TODAY_STR } from '../utils/initialData';
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  Thermometer,
  Bed,
  CheckCircle2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const Patients = () => {
  const { patients, totalCapacity, occupiedBeds, availableBeds } = usePatients();
  const { can, currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [wingFilter, setWingFilter] = useState('All');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isRecordTempOpen, setIsRecordTempOpen] = useState(false);
  const [isDoctorVisitOpen, setIsDoctorVisitOpen] = useState(false);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q) ||
        (patient.roomNumber && patient.roomNumber.toLowerCase().includes(q)) ||
        (patient.phone && patient.phone.includes(q));

      // Status filter
      const matchesStatus =
        statusFilter === 'All' ||
        patient.status.toLowerCase() === statusFilter.toLowerCase();

      // Wing filter
      const matchesWing =
        wingFilter === 'All' ||
        (patient.roomNumber && patient.roomNumber.startsWith(wingFilter));

      return matchesSearch && matchesStatus && matchesWing;
    });
  }, [patients, searchQuery, statusFilter, wingFilter]);

  const handleOpenDetail = (patient) => {
    setSelectedPatient(patient);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-950 tracking-tight">
            Patient Census & Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time directory of admitted quarantine patients, room assignments, and clinical status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
            <Bed className="w-4 h-4 text-brand-600" />
            <span>
              <strong>{occupiedBeds}</strong> / {totalCapacity} Beds Occupied (
              <strong className="text-brand-600">{availableBeds}</strong> Available)
            </span>
          </div>

          {can.registerPatient ? (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient</span>
            </button>
          ) : (
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed"
              title="Admin access required to register patients"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Patient (Admin Only)</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by patient name, ID, phone or room..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">All Statuses</option>
            <option value="Admitted">Admitted</option>
            <option value="Isolated">Isolated</option>
            <option value="Critical">Critical</option>
            <option value="Recovered">Recovered</option>
            <option value="Discharged">Discharged</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <span>Wing:</span>
          </div>
          <select
            value={wingFilter}
            onChange={(e) => setWingFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="All">All Wings</option>
            <option value="A-">Wing A (Rooms A-101 to A-125)</option>
            <option value="B-">Wing B (Rooms B-201 to B-225)</option>
            <option value="C-">Wing C (Rooms C-301 to C-324)</option>
          </select>

          {(searchQuery || statusFilter !== 'All' || wingFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setWingFilter('All');
              }}
              className="text-xs font-semibold text-brand-600 hover:text-brand-800 px-2 py-1 transition"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Demographics</th>
                <th className="py-3 px-4">Room No.</th>
                <th className="py-3 px-4">Admission Date</th>
                <th className="py-3 px-4">Today's Temp</th>
                <th className="py-3 px-4">Patient Status</th>
                <th className="py-3 px-4">Discharge Eligibility</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8">
                    <EmptyState
                      title="No patients matched your criteria"
                      description="Try searching for a different ID, name, or resetting your status/wing filters."
                    />
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const todayRecord = patient.temperatureHistory?.find((t) => t.date === TODAY_STR);
                  const streak = patient.feverFreeConsecutiveDays || 0;
                  const isEligible = streak >= 3;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/60 transition group cursor-pointer"
                      onClick={() => handleOpenDetail(patient)}
                    >
                      {/* Patient ID */}
                      <td className="py-3 px-4 font-mono font-semibold text-brand-700">
                        {patient.id}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{patient.phone}</div>
                      </td>

                      {/* Age & Gender */}
                      <td className="py-3 px-4 text-slate-600">
                        {patient.age} yrs • {patient.gender}
                      </td>

                      {/* Room */}
                      <td className="py-3 px-4">
                        {patient.roomNumber ? (
                          <span className="font-semibold text-slate-800 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                            {patient.roomNumber}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Freed (Discharged)</span>
                        )}
                      </td>

                      {/* Admission Date */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {patient.admissionDate}
                      </td>

                      {/* Today's Temperature */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {todayRecord ? (
                          <TempStatusBadge status={todayRecord.status} temp={todayRecord.temperature} />
                        ) : (
                          <Badge variant="warning">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Pending Check
                          </Badge>
                        )}
                      </td>

                      {/* Patient Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <PatientStatusBadge status={patient.status} />
                      </td>

                      {/* Discharge Eligibility */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {patient.status === 'Discharged' ? (
                          <Badge variant="default" size="sm">Discharged</Badge>
                        ) : isEligible ? (
                          <Badge variant="success" size="sm">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Eligible ({streak}/3 Days)
                          </Badge>
                        ) : (
                          <Badge variant="default" size="sm">
                            {streak} / 3 Days
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(patient)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                            title="View Full Patient Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {can.recordTemperature && patient.status !== 'Discharged' && (
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setIsRecordTempOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition"
                              title="Record Temperature"
                            >
                              <Thermometer className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer with counts */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{filteredPatients.length}</strong> of <strong>{patients.length}</strong> total patients</span>
          <span>Facility Capacity: <strong>74 Max</strong></span>
        </div>
      </div>

      {/* Modals */}
      <PatientFormModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
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
        onDischargeClick={() => {}}
      />

      <RecordTempModal
        isOpen={isRecordTempOpen}
        onClose={() => setIsRecordTempOpen(false)}
        preselectedPatient={selectedPatient}
      />

      <DoctorVisitModal
        isOpen={isDoctorVisitOpen}
        onClose={() => setIsDoctorVisitOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
};
