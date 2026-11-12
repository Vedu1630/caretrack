import React, { useState, useMemo } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { TempStatusBadge, Badge } from '../components/common/Badge';
import { RecordTempModal } from '../components/temperatures/RecordTempModal';
import { TempCorrectionModal } from '../components/temperatures/TempCorrectionModal';
import { PatientDetailModal } from '../components/patients/PatientDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import { TODAY_STR } from '../utils/initialData';
import {
  Thermometer,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Clock,
  Settings,
  History,
  Eye,
  Plus
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export const TemperatureMonitoring = () => {
  const {
    patients,
    activePatients,
    pendingTempChecks,
    feverThreshold,
    setFeverThreshold,
  } = usePatients();

  const { can, currentUser } = useAuth();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState(searchParams.get('filter') || 'all'); // all, pending, recorded, fever
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Config threshold drawer/input toggle
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [thresholdInput, setThresholdInput] = useState(feverThreshold.toString());

  // Filtered rows for temperature monitoring
  const tableData = useMemo(() => {
    return activePatients.filter((patient) => {
      const todayRecord = patient.temperatureHistory?.find((t) => t.date === TODAY_STR);
      const isRecorded = !!todayRecord;
      const isPending = !todayRecord;
      const isFever = todayRecord && (todayRecord.status === 'Fever' || todayRecord.temperature >= feverThreshold);

      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        patient.name.toLowerCase().includes(q) ||
        patient.id.toLowerCase().includes(q) ||
        (patient.roomNumber && patient.roomNumber.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // Filter
      if (filterType === 'pending') return isPending;
      if (filterType === 'recorded') return isRecorded;
      if (filterType === 'fever') return isFever;
      return true; // all
    });
  }, [activePatients, searchQuery, filterType, feverThreshold]);

  const feverCount = activePatients.filter((p) => {
    const today = p.temperatureHistory?.find((t) => t.date === TODAY_STR);
    return today && (today.status === 'Fever' || today.temperature >= feverThreshold);
  }).length;

  const recordedCount = activePatients.filter((p) =>
    p.temperatureHistory?.some((t) => t.date === TODAY_STR)
  ).length;

  const handleRecordClick = (patient = null) => {
    setSelectedPatient(patient);
    setIsRecordModalOpen(true);
  };

  const handleCorrectClick = (patient, record) => {
    setSelectedPatient(patient);
    setSelectedRecord(record);
    setIsCorrectionModalOpen(true);
  };

  const handleThresholdSave = (e) => {
    e.preventDefault();
    setFeverThreshold(thresholdInput);
    setShowThresholdConfig(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Prominent Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-950 tracking-tight">
              Daily Temperature Monitoring
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              Shift Today ({TODAY_STR})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Record, verify, and correct patient body temperatures. Fever threshold: ≥ {feverThreshold}°C
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Threshold config trigger */}
          <button
            onClick={() => setShowThresholdConfig(!showThresholdConfig)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-xl shadow-xs transition"
            title="Configure clinical fever cutoff threshold"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>Cutoff: {feverThreshold}°C</span>
          </button>

          {/* Prominent Record Temperature Button */}
          {can.recordTemperature ? (
            <button
              onClick={() => handleRecordClick(null)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-brand-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Record Temperature</span>
            </button>
          ) : (
            <button
              onClick={() => handleRecordClick(null)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-400 text-xs font-semibold rounded-xl cursor-not-allowed"
              title="Nurse or Admin access required to record temperatures"
            >
              <Thermometer className="w-4 h-4" />
              <span>Record Temperature (Nurse Only)</span>
            </button>
          )}
        </div>
      </div>

      {/* Threshold Config Drawer */}
      {showThresholdConfig && (
        <div className="p-4 bg-brand-50/50 border border-brand-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-brand-950">
                Configure Fever Detection Cutoff Threshold
              </h4>
              <p className="text-xs text-brand-800 mt-0.5">
                Current clinical standard is 38.0°C (100.4°F). Any measurement equal or higher triggers an immediate fever warning and resets consecutive fever-free days to 0.
              </p>
            </div>
          </div>

          <form onSubmit={handleThresholdSave} className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="35"
                max="42"
                value={thresholdInput}
                onChange={(e) => setThresholdInput(e.target.value)}
                className="w-24 px-3 py-1.5 bg-white border border-brand-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">°C</span>
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold transition"
            >
              Update Cutoff
            </button>
            <button
              type="button"
              onClick={() => setShowThresholdConfig(false)}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Quick Filter Tabs */}
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
            onClick={() => setFilterType('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'pending'
                ? 'bg-white text-amber-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Pending ({pendingTempChecks})</span>
          </button>
          <button
            onClick={() => setFilterType('recorded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'recorded'
                ? 'bg-white text-brand-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-brand-600" />
            <span>Recorded ({recordedCount})</span>
          </button>
          <button
            onClick={() => setFilterType('fever')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
              filterType === 'fever'
                ? 'bg-white text-rose-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Fever Detected ({feverCount})</span>
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

      {/* Temperature Monitoring Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Room No.</th>
                <th className="py-3 px-4">Today's Temperature</th>
                <th className="py-3 px-4">Last Recorded Time</th>
                <th className="py-3 px-4">Nurse Assigned</th>
                <th className="py-3 px-4">Temperature Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8">
                    <EmptyState
                      title="No temperature records match your filter"
                      description="Switch filters or use the 'Record Temperature' button above to log a new measurement."
                    />
                  </td>
                </tr>
              ) : (
                tableData.map((patient) => {
                  const todayRecord = patient.temperatureHistory?.find((t) => t.date === TODAY_STR);
                  const isRecorded = !!todayRecord;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/60 transition group cursor-pointer"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setIsDetailModalOpen(true);
                      }}
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
                        {isRecorded ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-slate-900">
                              {todayRecord.temperature}°C
                            </span>
                            {todayRecord.isCorrection && (
                              <span
                                title="This reading was revised with an audit record"
                                className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200"
                              >
                                Rev
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-amber-600 font-medium italic">Pending</span>
                        )}
                      </td>

                      {/* Last Recorded Time */}
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {isRecorded ? (
                          <div className="flex items-center gap-1 text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{todayRecord.time}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Nurse Assigned */}
                      <td className="py-3 px-4 text-slate-600">
                        {isRecorded ? todayRecord.recordedBy : patient.assignedNurse || 'Elena Rostova, RN'}
                      </td>

                      {/* Temperature Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        {isRecorded ? (
                          <TempStatusBadge status={todayRecord.status} temp={todayRecord.temperature} />
                        ) : (
                          <Badge variant="warning">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Pending Check
                          </Badge>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {!isRecorded ? (
                            <button
                              onClick={() => handleRecordClick(patient)}
                              disabled={!can.recordTemperature}
                              className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-lg text-xs transition"
                            >
                              Record
                            </button>
                          ) : (
                            <button
                              onClick={() => handleCorrectClick(patient, todayRecord)}
                              disabled={!can.correctTemperature}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-medium rounded-lg text-xs transition flex items-center gap-1"
                              title="Correct this entry with mandatory justification"
                            >
                              <Edit3 className="w-3 h-3 text-slate-500" />
                              <span>Correct</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedPatient(patient);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                            title="View History Timeline"
                          >
                            <History className="w-4 h-4" />
                          </button>
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
          <span>Rule: 1 active daily measurement per patient</span>
        </div>
      </div>

      {/* Modals */}
      <RecordTempModal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        preselectedPatient={selectedPatient}
        onSwitchToCorrection={(patient, record) => {
          setSelectedPatient(patient);
          setSelectedRecord(record);
          setIsCorrectionModalOpen(true);
        }}
      />

      <TempCorrectionModal
        isOpen={isCorrectionModalOpen}
        onClose={() => setIsCorrectionModalOpen(false)}
        patient={selectedPatient}
        record={selectedRecord}
      />

      <PatientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        patient={selectedPatient}
        onRecordTempClick={(p) => {
          setSelectedPatient(p);
          setIsRecordModalOpen(true);
        }}
        onDoctorVisitClick={() => {}}
        onDischargeClick={() => {}}
      />
    </div>
  );
};
