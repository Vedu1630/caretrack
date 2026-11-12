import React, { useState, useMemo } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { TempStatusBadge, Badge } from '../components/common/Badge';
import { DoctorVisitModal } from '../components/doctors/DoctorVisitModal';
import { PatientDetailModal } from '../components/patients/PatientDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { TODAY_STR } from '../utils/initialData';
import {
  Stethoscope,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Eye,
  ShieldAlert
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const DoctorVisits = () => {
  const { activePatients, pendingDoctorVisits, pendingTempChecks } = usePatients();
  const { can, currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(searchParams.get('filter') || 'all'); // all, awaiting_temp, awaiting_doctor, completed
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filtered rows for doctor visits
  const tableData = useMemo(() => {
    return activePatients.filter((patient) => {
      const todayTemp = patient.temperatureHistory?.find((t) => t.date === TODAY_STR);
      const isTempRecorded = !!todayTemp;
      const todayVisit = patient.doctorVisits?.find((v) => v.date === TODAY_STR && v.status === 'Completed');
      const isVisitCompleted = !!todayVisit;

      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q) ||
        (patient.roomNumber && patient.roomNumber.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Filter
      if (filterType === 'awaiting_temp') return !isTempRecorded;
      if (filterType === 'awaiting_doctor') return isTempRecorded && !isVisitCompleted;
      if (filterType === 'completed') return isVisitCompleted;
      return true; // all
    });
  }, [activePatients, searchQuery, filterType]);

  const awaitingTempCount = activePatients.filter(
    (p) => !p.temperatureHistory?.some((t) => t.date === TODAY_STR)
  ).length;

  const awaitingDoctorCount = activePatients.filter((p) => {
    const hasTemp = p.temperatureHistory?.some((t) => t.date === TODAY_STR);
    const hasVisit = p.doctorVisits?.some((v) => v.date === TODAY_STR && v.status === 'Completed');
    return hasTemp && !hasVisit;
  }).length;

  const visitCompletedCount = activePatients.filter((p) =>
    p.doctorVisits?.some((v) => v.date === TODAY_STR && v.status === 'Completed')
  ).length;

  const handleStartVisit = (patient) => {
    setSelectedPatient(patient);
    setIsVisitModalOpen(true);
  };

  const handleOpenDetail = (patient) => {
    setSelectedPatient(patient);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-950 tracking-tight">
              Daily Doctor Rounds & Clinical Assessments
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Shift Today ({TODAY_STR})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Physicians review daily temperature vitals, enter diagnostic notes, and authorize treatment directives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600">
            Pending Rounds:{' '}
            <strong className="text-brand-600">{pendingDoctorVisits} Patients</strong>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Patients ({activePatients.length})
          </button>
          <button
            onClick={() => setFilterType('awaiting_temp')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'awaiting_temp'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Awaiting Temperature ({awaitingTempCount})</span>
          </button>
          <button
            onClick={() => setFilterType('awaiting_doctor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'awaiting_doctor'
                ? 'bg-white text-brand-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            <span>Awaiting Doctor ({awaitingDoctorCount})</span>
          </button>
          <button
            onClick={() => setFilterType('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'completed'
                ? 'bg-white text-emerald-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Visit Completed ({visitCompletedCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patient, ID, or room..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      {/* Doctor Visits Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Room No.</th>
                <th className="py-3 px-4">Today's Temperature</th>
                <th className="py-3 px-4">Temp Recording Status</th>
                <th className="py-3 px-4">Doctor Visit Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8">
                    <EmptyState
                      title="No patients match your selected filter"
                      description="Switch filters above or verify if all physician rounds for today have been logged."
                    />
                  </td>
                </tr>
              ) : (
                tableData.map((patient) => {
                  const todayTemp = patient.temperatureHistory?.find((t) => t.date === TODAY_STR);
                  const isTempRecorded = !!todayTemp;
                  const todayVisit = patient.doctorVisits?.find((v) => v.date === TODAY_STR && v.status === 'Completed');
                  const isVisitCompleted = !!todayVisit;

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
                        <span className="font-semibold text-slate-900 group-hover:text-brand-600 transition">
                          {patient.name}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {patient.age} yrs • {patient.gender}
                        </div>
                      </td>

                      {/* Room */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                          {patient.roomNumber}
                        </span>
                      </td>

                      {/* Today's Temperature */}
                      <td className="py-3 px-4">
                        {isTempRecorded ? (
                          <span className="text-sm font-bold text-slate-900">
                            {todayTemp.temperature}°C
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium italic">Not Recorded</span>
                        )}
                      </td>

                      {/* Temp Recording Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isTempRecorded ? (
                          <TempStatusBadge status={todayTemp.status} temp={todayTemp.temperature} />
                        ) : (
                          <Badge variant="warning">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Awaiting Nurse
                          </Badge>
                        )}
                      </td>

                      {/* Doctor Visit Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isVisitCompleted ? (
                          <div className="flex items-center gap-1.5">
                            <Badge variant="success">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Completed ({todayVisit.time})
                            </Badge>
                            {todayVisit.emergencyOverride && (
                              <Badge variant="danger" size="sm">
                                Override
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <Badge variant={isTempRecorded ? 'primary' : 'warning'}>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            {isTempRecorded ? 'Awaiting Doctor Visit' : 'Blocked by Missing Temp'}
                          </Badge>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(patient)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            title="View Patient Details & History"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {!isVisitCompleted ? (
                            <button
                              onClick={() => handleStartVisit(patient)}
                              disabled={!can.completeDoctorVisit}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                                !isTempRecorded
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                  : 'bg-brand-600 hover:bg-brand-700 text-white'
                              } disabled:opacity-50`}
                              title={
                                !isTempRecorded
                                  ? "Temperature missing: Emergency override required to complete visit"
                                  : "Start Doctor Visit"
                              }
                            >
                              <Stethoscope className="w-3.5 h-3.5" />
                              <span>{isTempRecorded ? 'Conduct Visit' : 'Override / Visit'}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartVisit(patient)}
                              disabled={!can.completeDoctorVisit}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs transition"
                              title="Update clinical observations"
                            >
                              Add Notes
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

        <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing <strong>{tableData.length}</strong> active patients</span>
          <span>Workflow: Temperature check required before routine doctor assessment</span>
        </div>
      </div>

      {/* Modals */}
      <DoctorVisitModal
        isOpen={isVisitModalOpen}
        onClose={() => setIsVisitModalOpen(false)}
        patient={selectedPatient}
      />

      <PatientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        patient={selectedPatient}
        onRecordTempClick={() => {}}
        onDoctorVisitClick={(p) => handleStartVisit(p)}
        onDischargeClick={() => {}}
      />
    </div>
  );
};
