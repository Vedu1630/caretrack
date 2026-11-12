import React, { useState, useMemo } from 'react';
import { usePatients } from '../context/PatientContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { PatientDetailModal } from '../components/patients/PatientDetailModal';
import { EmptyState } from '../components/common/EmptyState';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Bed,
  History,
  Info,
  Sparkles
} from 'lucide-react';

export const DischargeManagement = () => {
  const {
    patients,
    activePatients,
    dischargeEligible,
    availableBeds,
    totalCapacity,
    recommendDischarge,
    confirmDischarge,
    feverThreshold,
  } = usePatients();

  const { can, currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('active'); // active, history
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEligibility, setFilterEligibility] = useState('all'); // all, eligible, recommended, pending
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Active patients table data
  const activeTableData = useMemo(() => {
    return activePatients.filter((p) => {
      const streak = p.feverFreeConsecutiveDays || 0;
      const isEligible = streak >= 3;
      const isRecommended = p.doctorRecommendation === 'Recommended';

      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.roomNumber && p.roomNumber.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filterEligibility === 'eligible') return isEligible;
      if (filterEligibility === 'recommended') return isRecommended;
      if (filterEligibility === 'in_progress') return !isEligible;
      return true;
    });
  }, [activePatients, searchQuery, filterEligibility]);

  // Discharged historical records
  const dischargedPatients = useMemo(() => {
    return patients.filter((p) => p.status === 'Discharged');
  }, [patients]);

  const handleRecommendClick = (patient) => {
    recommendDischarge(patient.id);
  };

  const handleConfirmDischargeClick = (patient) => {
    setSelectedPatient(patient);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmExecute = () => {
    if (!selectedPatient) return;
    setIsProcessing(true);
    const res = confirmDischarge(selectedPatient.id);
    setIsProcessing(false);
    setIsConfirmDialogOpen(false);
    setSelectedPatient(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-950 tracking-tight">
              Discharge Eligibility & Protocol Management
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              {dischargeEligible} Ready for Clearance
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Clearance rule: 3 consecutive complete days without fever (&lt; {feverThreshold}°C). Fever resets streak to 0.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center gap-2">
            <Bed className="w-4 h-4 text-emerald-600" />
            <span>
              Available Beds:{' '}
              <strong className="text-emerald-700">{availableBeds}</strong> of {totalCapacity}
            </span>
          </div>
        </div>
      </div>

      {/* Core Protocol Explanation Card */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-card">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-brand-950">
              Quarantine Discharge Workflow & Three-Day Rule
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2 text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-0.5">1. Clinical Rule</span>
                <span>A patient is considered eligible for discharge strictly after <strong>three consecutive complete days without fever</strong>. Missing measurements break the streak.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-0.5">2. Physician Review</span>
                <span>Attending doctors review the 3-day history and formally mark <strong>"Recommend Discharge"</strong>.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-0.5">3. Administrative Clearance</span>
                <span>Administrators execute <strong>"Confirm Discharge"</strong>, which frees the room and updates bed count.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Patients ({activePatients.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Discharge History ({dischargedPatients.length})</span>
            </button>
          </div>

          {activeTab === 'active' && (
            <select
              value={filterEligibility}
              onChange={(e) => setFilterEligibility(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Eligibility</option>
              <option value="eligible">Eligible (≥ 3 Days)</option>
              <option value="recommended">Doctor Recommended</option>
              <option value="in_progress">In Progress (&lt; 3 Days)</option>
            </select>
          )}
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

      {/* Main Table */}
      {activeTab === 'active' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Patient ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Room No.</th>
                  <th className="py-3 px-4">Consecutive Fever-Free Days</th>
                  <th className="py-3 px-4">Doctor Recommendation</th>
                  <th className="py-3 px-4">Discharge Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeTableData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8">
                      <EmptyState
                        title="No patients found"
                        description="Try resetting your eligibility filter or search query."
                      />
                    </td>
                  </tr>
                ) : (
                  activeTableData.map((patient) => {
                    const streak = patient.feverFreeConsecutiveDays || 0;
                    const isEligible = streak >= 3;
                    const isRecommended = patient.doctorRecommendation === 'Recommended';

                    return (
                      <tr
                        key={patient.id}
                        className="hover:bg-slate-50/60 transition group cursor-pointer"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        {/* ID */}
                        <td className="py-3 px-4 font-mono font-semibold text-brand-700">
                          {patient.id}
                        </td>

                        {/* Name */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-900 group-hover:text-brand-600 transition">
                            {patient.name}
                          </span>
                          <div className="text-[11px] text-slate-400">
                            Admitted {patient.admissionDate}
                          </div>
                        </td>

                        {/* Room */}
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                            {patient.roomNumber}
                          </span>
                        </td>

                        {/* Consecutive Fever-Free Days with visual step indicator */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {/* Visual 3-day dots */}
                            <div className="flex items-center gap-1">
                              {[1, 2, 3].map((step) => (
                                <span
                                  key={step}
                                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                                    streak >= step
                                      ? 'bg-emerald-500 ring-2 ring-emerald-200'
                                      : 'bg-slate-200'
                                  }`}
                                  title={`Day ${step} afebrile ${streak >= step ? 'completed' : 'pending'}`}
                                />
                              ))}
                            </div>

                            <span className={`font-bold ${isEligible ? 'text-emerald-600' : 'text-slate-700'}`}>
                              {streak} / 3 Days
                            </span>

                            {isEligible && (
                              <Badge variant="success" size="sm">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Eligible
                              </Badge>
                            )}
                          </div>
                        </td>

                        {/* Doctor Recommendation */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {isRecommended ? (
                            <Badge variant="success">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Recommended
                            </Badge>
                          ) : isEligible ? (
                            <Badge variant="warning">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              Awaiting Recommendation
                            </Badge>
                          ) : (
                            <span className="text-slate-400 italic">Criteria Not Met</span>
                          )}
                        </td>

                        {/* Discharge Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {patient.dischargeStatus === 'Pending Admin Approval' ? (
                            <Badge variant="purple">
                              Pending Admin Release
                            </Badge>
                          ) : isEligible ? (
                            <Badge variant="primary">
                              Eligible for Discharge
                            </Badge>
                          ) : (
                            <Badge variant="default">
                              Under Observation
                            </Badge>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedPatient(patient);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
                              title="View Patient Dossier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Doctor action: Recommend Discharge */}
                            {can.recommendDischarge && isEligible && !isRecommended && (
                              <button
                                onClick={() => handleRecommendClick(patient)}
                                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Recommend</span>
                              </button>
                            )}

                            {/* Admin action: Confirm Discharge */}
                            {can.confirmDischarge && isRecommended && (
                              <button
                                onClick={() => handleConfirmDischargeClick(patient)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Confirm Discharge</span>
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
            <span>Showing <strong>{activeTableData.length}</strong> active patients</span>
            <span>Requirement: 3 consecutive fever-free days for eligibility</span>
          </div>
        </div>
      ) : (
        /* Discharged History Table */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Patient ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Demographics</th>
                  <th className="py-3 px-4">Admission Date</th>
                  <th className="py-3 px-4">Discharge Date</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4 text-right">Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dischargedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8">
                      <EmptyState
                        title="No discharged patient records yet"
                        description="Patients discharged by administrators will be archived here permanently."
                      />
                    </td>
                  </tr>
                ) : (
                  dischargedPatients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-semibold text-brand-700">{p.id}</td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-slate-600">{p.age} yrs • {p.gender}</td>
                      <td className="py-3 px-4 text-slate-600">{p.admissionDate}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">{p.dischargeDate || 'Today'}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success">Fully Recovered & Afebrile</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPatient(p);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-slate-600 hover:text-brand-600 bg-slate-100 rounded-lg text-xs font-medium"
                        >
                          View Archived File
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Administrative Discharge */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmExecute}
        title="Confirm Administrative Patient Discharge"
        message={`Are you sure you want to finalize the discharge of ${selectedPatient?.name} (${selectedPatient?.id})? This will mark the patient as Recovered, immediately free Room ${selectedPatient?.roomNumber} for new incoming patients, and prevent further routine temperature logging.`}
        confirmText="Confirm Discharge & Free Room"
        type="success"
        isLoading={isProcessing}
      />

      {/* Patient Detail Modal */}
      <PatientDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        patient={selectedPatient}
        onRecordTempClick={() => {}}
        onDoctorVisitClick={() => {}}
        onDischargeClick={(p) => handleConfirmDischargeClick(p)}
      />
    </div>
  );
};
