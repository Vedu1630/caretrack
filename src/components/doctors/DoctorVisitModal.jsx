import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import { TODAY_STR } from '../../utils/initialData';
import { TempStatusBadge } from '../common/Badge';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  Info
} from 'lucide-react';

export const DoctorVisitModal = ({ isOpen, onClose, patient }) => {
  const { completeDoctorVisit, recommendDischarge, feverThreshold } = usePatients();
  const { can, currentUser } = useAuth();

  const [observation, setObservation] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [emergencyOverride, setEmergencyOverride] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [alsoRecommendDischarge, setAlsoRecommendDischarge] = useState(false);
  const [error, setError] = useState('');

  if (!patient) return null;

  const todayTempRecord = patient.temperatureHistory?.find((t) => t.date === TODAY_STR);
  const isTempMissing = !todayTempRecord;
  const streak = patient.feverFreeConsecutiveDays || 0;
  const isEligibleForDischarge = streak >= 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!observation.trim()) {
      setError('Clinical observation notes are required.');
      return;
    }
    if (!treatmentNotes.trim()) {
      setError('Treatment notes / plan are required.');
      return;
    }

    if (isTempMissing && !emergencyOverride) {
      setError("Today's temperature has not been recorded yet. Please ask the nurse to complete the measurement.");
      return;
    }

    if (isTempMissing && emergencyOverride && !overrideReason.trim()) {
      setError('Mandatory clinical justification is required for emergency override.');
      return;
    }

    const res = completeDoctorVisit({
      patientId: patient.id,
      observation,
      treatmentNotes,
      emergencyOverride: isTempMissing && emergencyOverride,
      overrideReason,
    });

    if (res.success) {
      if (alsoRecommendDischarge && isEligibleForDischarge) {
        recommendDischarge(patient.id, 'Recommended simultaneously during daily clinical visit round.');
      }
      onClose();
      setObservation('');
      setTreatmentNotes('');
      setEmergencyOverride(false);
      setOverrideReason('');
    } else {
      setError(res.message || 'Could not complete visit.');
    }
  };

  if (!can.completeDoctorVisit) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Restricted" maxWidth="max-w-md">
        <div className="flex items-start gap-3 p-4 bg-rose-50 text-rose-950 rounded-xl border border-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Physician Role Required</p>
            <p className="mt-1 text-slate-600">
              Only attending doctors and medical officers are authorized to complete daily rounds and enter clinical observations.
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily Doctor Round & Clinical Evaluation"
      subtitle={`Patient: ${patient.name} (${patient.id}) • Room ${patient.roomNumber}`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Today's Temperature Status Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today's Vitals Reading
            </span>
            <span className="text-xs text-slate-400">Date: {TODAY_STR}</span>
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div>
              {todayTempRecord ? (
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-900">
                    {todayTempRecord.temperature}°C
                  </span>
                  <TempStatusBadge status={todayTempRecord.status} temp={todayTempRecord.temperature} />
                  <span className="text-xs text-slate-500">
                    (Recorded at {todayTempRecord.time} by {todayTempRecord.recordedBy})
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-amber-600">
                    Pending Measurement
                  </span>
                  <span className="text-xs text-slate-500">
                    (No temperature reading recorded yet today)
                  </span>
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500">Fever-Free Streak:</span>{' '}
              <strong className={streak >= 3 ? 'text-emerald-600' : 'text-slate-800'}>
                {streak}/3 Days
              </strong>
            </div>
          </div>
        </div>

        {/* Temperature Missing Warning and Emergency Override */}
        {isTempMissing && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-amber-950">
                  Today's temperature has not been recorded yet. Please ask the nurse to complete the measurement.
                </h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Clinical safety protocols require reviewing the patient's daily temperature before completing routine rounds.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/80">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emergencyOverride}
                  onChange={(e) => setEmergencyOverride(e.target.value)}
                  className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span className="text-xs font-semibold text-amber-950">
                  Authorize Emergency Clinical Override
                </span>
              </label>

              {emergencyOverride && (
                <div className="mt-2.5 space-y-1.5 animate-in fade-in">
                  <label className="block text-xs font-semibold text-rose-900">
                    Mandatory Emergency Clinical Justification <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. Critical respiratory distress intervention; temperature measurement deferred by attending physician order."
                    className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-200 text-rose-950"
                  />
                  <p className="text-[11px] text-rose-700">
                    * This override will be flagged in red in the patient's permanent audit log and facility analytics.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clinical Observations */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Clinical Observations & Physical Examination <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Auscultation findings, respiratory pattern, mental state, cough severity..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Treatment Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Treatment Plan, Prescriptions & Directives <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={treatmentNotes}
            onChange={(e) => setTreatmentNotes(e.target.value)}
            placeholder="Prescribed bronchodilator, IV saline schedule, maintain isolation protocols..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Discharge Recommendation Checkbox if streak >= 3 */}
        {isEligibleForDischarge && patient.doctorRecommendation !== 'Recommended' && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-bold text-emerald-950 block">
                  Patient meets discharge criteria (≥ 3 consecutive fever-free days)
                </span>
                <span className="text-[11px] text-emerald-800">
                  You can submit your formal physician discharge recommendation right now.
                </span>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-emerald-300">
              <input
                type="checkbox"
                checked={alsoRecommendDischarge}
                onChange={(e) => setAlsoRecommendDischarge(e.target.checked)}
                className="rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span className="text-xs font-semibold text-emerald-900">Recommend Discharge</span>
            </label>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isTempMissing && !emergencyOverride}
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            Mark Visit Completed
          </button>
        </div>
      </form>
    </Modal>
  );
};
