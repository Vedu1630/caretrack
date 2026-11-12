import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PatientStatusBadge, TempStatusBadge, Badge } from '../common/Badge';
import { useAuth } from '../../context/AuthContext';
import { usePatients } from '../../context/PatientContext';
import {
  Thermometer,
  Stethoscope,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Bed,
  FileText,
  AlertTriangle,
  History,
  ShieldCheck
} from 'lucide-react';

export const PatientDetailModal = ({
  isOpen,
  onClose,
  patient,
  onRecordTempClick,
  onDoctorVisitClick,
  onDischargeClick,
}) => {
  const { can, currentUser } = useAuth();
  const { feverThreshold, recommendDischarge } = usePatients();
  const [activeTab, setActiveTab] = useState('vitals'); // vitals, visits, info

  if (!patient) return null;

  const todayRecord = patient.temperatureHistory?.find(
    (t) => t.date === new Date().toISOString().split('T')[0]
  );

  const streak = patient.feverFreeConsecutiveDays || 0;
  const isEligible = streak >= 3;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${patient.name} (${patient.id})`}
      subtitle={`Room ${patient.roomNumber || 'Discharged'} • Admitted on ${patient.admissionDate}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Top Profile Summary Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-bold text-lg flex items-center justify-center border border-brand-200">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-brand-950">{patient.name}</h4>
                <PatientStatusBadge status={patient.status} />
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>{patient.age} yrs • {patient.gender}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Bed className="w-3.5 h-3.5 text-brand-600" />
                  Room {patient.roomNumber || 'None (Freed)'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {patient.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Discharge Eligibility Pill */}
          <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 flex flex-col items-end">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Fever-Free Streak
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-base font-bold ${isEligible ? 'text-emerald-600' : 'text-slate-800'}`}>
                {streak} / 3 Days
              </span>
              {isEligible ? (
                <Badge variant="success" size="sm">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Discharge Ready
                </Badge>
              ) : (
                <Badge variant="warning" size="sm">
                  In Progress
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-slate-100">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'vitals'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Temperature Logs ({patient.temperatureHistory?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'visits'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Doctor Assessments ({patient.doctorVisits?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'info'
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Clinical Details & Staff
          </button>
        </div>

        {/* Tab 1: Temperature Vitals History */}
        {activeTab === 'vitals' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Threshold: ≥ {feverThreshold}°C triggers fever reset</span>
              {can.recordTemperature && patient.status !== 'Discharged' && (
                <button
                  onClick={() => {
                    onClose();
                    onRecordTempClick(patient);
                  }}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg text-xs transition"
                >
                  Record New Reading
                </button>
              )}
            </div>

            {(!patient.temperatureHistory || patient.temperatureHistory.length === 0) ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No temperature readings recorded yet.
              </div>
            ) : (
              <div className="border border-slate-200/80 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4">Date & Time</th>
                      <th className="py-2.5 px-4">Temperature</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4">Recorded By</th>
                      <th className="py-2.5 px-4">Observations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {patient.temperatureHistory.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-2.5 px-4 font-medium text-slate-700">
                          {rec.date} <span className="text-slate-400 text-[11px] font-normal">at {rec.time}</span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {rec.temperature}°C
                          {rec.isCorrection && (
                            <span className="ml-1 text-[10px] font-medium text-amber-600 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                              Corrected
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4">
                          <TempStatusBadge status={rec.status} temp={rec.temperature} />
                        </td>
                        <td className="py-2.5 px-4 text-slate-600">{rec.recordedBy}</td>
                        <td className="py-2.5 px-4 text-slate-500 truncate max-w-xs">{rec.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Doctor Visits History */}
        {activeTab === 'visits' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Daily physician rounds & clinical treatment progress</span>
              {can.completeDoctorVisit && patient.status !== 'Discharged' && (
                <button
                  onClick={() => {
                    onClose();
                    onDoctorVisitClick(patient);
                  }}
                  className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg text-xs transition"
                >
                  Conduct Today's Visit
                </button>
              )}
            </div>

            {(!patient.doctorVisits || patient.doctorVisits.length === 0) ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                No doctor visits completed yet for this patient.
              </div>
            ) : (
              <div className="space-y-3">
                {patient.doctorVisits.map((visit) => (
                  <div
                    key={visit.id}
                    className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-brand-600" />
                        <span className="text-xs font-bold text-slate-900">{visit.doctorName}</span>
                        {visit.emergencyOverride && (
                          <Badge variant="danger" size="sm">
                            Emergency Override
                          </Badge>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {visit.date} at {visit.time}
                      </span>
                    </div>

                    {visit.overrideReason && (
                      <div className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900">
                        <strong>Override Justification:</strong> {visit.overrideReason}
                      </div>
                    )}

                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Clinical Observation:
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">{visit.observation}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Treatment & Protocol Notes:
                      </p>
                      <p className="text-xs text-slate-700 mt-0.5">{visit.treatmentNotes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Clinical Details & Staff */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-900 block">Assigned Staff</span>
              <p className="text-slate-600">
                <strong>Attending Physician:</strong> {patient.assignedDoctor || 'Dr. Marcus Vance, MD'}
              </p>
              <p className="text-slate-600">
                <strong>Dedicated Nurse:</strong> {patient.assignedNurse || 'Elena Rostova, RN'}
              </p>
              <p className="text-slate-600">
                <strong>Quarantine Protocol:</strong> Viral Isolation Level 2
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-semibold text-slate-900 block">Discharge Protocol Status</span>
              <p className="text-slate-600">
                <strong>Consecutive Fever-Free Days:</strong> {patient.feverFreeConsecutiveDays} / 3 complete days
              </p>
              <p className="text-slate-600">
                <strong>Doctor Recommendation:</strong>{' '}
                <span className={patient.doctorRecommendation === 'Recommended' ? 'text-emerald-600 font-semibold' : 'text-amber-600'}>
                  {patient.doctorRecommendation || 'Pending'}
                </span>
              </p>
              <p className="text-slate-600">
                <strong>Discharge Status:</strong> {patient.dischargeStatus || 'Not Eligible'}
              </p>
            </div>

            <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Clinical Intake Case Notes</span>
              <p className="text-slate-600 leading-relaxed">{patient.notes || 'No intake notes.'}</p>
            </div>
          </div>
        )}

        {/* Modal Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {/* Recommend Discharge button (Doctor) */}
            {can.recommendDischarge && isEligible && patient.doctorRecommendation !== 'Recommended' && patient.status !== 'Discharged' && (
              <button
                onClick={() => {
                  recommendDischarge(patient.id);
                  onClose();
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Recommend Discharge
              </button>
            )}

            {/* Confirm Discharge button (Admin) */}
            {can.confirmDischarge && patient.doctorRecommendation === 'Recommended' && patient.status !== 'Discharged' && (
              <button
                onClick={() => {
                  onClose();
                  onDischargeClick(patient);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Confirm Administrative Discharge
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
