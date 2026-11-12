import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import { TODAY_STR } from '../../utils/initialData';
import { Thermometer, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const RecordTempModal = ({ isOpen, onClose, preselectedPatient, onSwitchToCorrection }) => {
  const { patients, recordTemperature, feverThreshold } = usePatients();
  const { can, currentUser } = useAuth();

  const activePatients = patients.filter((p) => p.status !== 'Discharged');

  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatient?.id || '');
  const [temperature, setTemperature] = useState('');
  const [measurementDate, setMeasurementDate] = useState(TODAY_STR);
  const [measurementTime, setMeasurementTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  );
  const [notes, setNotes] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [existingRecord, setExistingRecord] = useState(null);

  useEffect(() => {
    if (preselectedPatient) {
      setSelectedPatientId(preselectedPatient.id);
    } else if (activePatients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(activePatients[0].id);
    }
  }, [preselectedPatient, activePatients]);

  // Check if selected patient already has a record today
  useEffect(() => {
    if (!selectedPatientId) return;
    const target = patients.find((p) => p.id === selectedPatientId);
    if (!target) return;

    const todayEntry = target.temperatureHistory?.find((t) => t.date === measurementDate);
    if (todayEntry) {
      setExistingRecord(todayEntry);
      setWarningMessage(
        `Warning: A reading of ${todayEntry.temperature}°C was already recorded today at ${todayEntry.time} by ${todayEntry.recordedBy}. Duplicate daily entries are restricted. Use correction if necessary.`
      );
    } else {
      setExistingRecord(null);
      setWarningMessage('');
    }
  }, [selectedPatientId, measurementDate, patients]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const tempNum = parseFloat(temperature);
  const isFever = !isNaN(tempNum) && tempNum >= feverThreshold;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    const res = recordTemperature({
      patientId: selectedPatientId,
      temperature,
      notes,
      nurseName: currentUser?.name || 'Elena Rostova, RN',
      measurementDate,
      measurementTime,
    });

    if (res.success) {
      onClose();
      setTemperature('');
      setNotes('');
    }
  };

  if (!can.recordTemperature) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Restricted" maxWidth="max-w-md">
        <div className="flex items-start gap-3 p-4 bg-rose-50 text-rose-950 rounded-xl border border-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Nurse or Administrator Role Required</p>
            <p className="mt-1 text-slate-600">
              Only triage and ward nurses (or administrators) are authorized to log routine daily patient temperatures. You are currently logged in as <span className="font-semibold capitalize">{currentUser?.role}</span>.
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
      title="Record Daily Patient Temperature"
      subtitle={`Threshold: ≥ ${feverThreshold}°C is classified as Fever`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Quarantine Patient <span className="text-rose-500">*</span>
          </label>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {activePatients.map((p) => {
              const hasToday = p.temperatureHistory?.some((t) => t.date === measurementDate);
              return (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) - Room {p.roomNumber} {hasToday ? '✓ Recorded' : '⚠ Pending'}
                </option>
              );
            })}
          </select>
        </div>

        {/* Duplicate warning banner */}
        {warningMessage && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-amber-950">Duplicate Entry Detected</p>
              <p className="mt-0.5 leading-relaxed text-amber-800">{warningMessage}</p>
              {onSwitchToCorrection && existingRecord && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToCorrection(selectedPatient, existingRecord);
                  }}
                  className="mt-2 text-xs font-semibold text-brand-700 hover:text-brand-800 underline block"
                >
                  Click here to correct/update today's recorded entry instead →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Temperature Input with live feedback */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Body Temperature (°C) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="32"
                max="44"
                required
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 36.8"
                className={`w-full pl-9 pr-12 py-2 bg-white border rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 ${
                  isFever
                    ? 'border-rose-300 text-rose-900 focus:ring-rose-200'
                    : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
                }`}
              />
              <Thermometer
                className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                  isFever ? 'text-rose-600' : 'text-slate-400'
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                °C
              </span>
            </div>

            {/* Live classification feedback */}
            {!isNaN(tempNum) && tempNum > 30 && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold">
                {isFever ? (
                  <span className="text-rose-600 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Fever Detected (≥ {feverThreshold}°C). Resets fever-free streak to 0!
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Normal / Afebrile (&lt; {feverThreshold}°C). Counts toward discharge streak!
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Measurement Date & Time
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={measurementDate}
                onChange={(e) => setMeasurementDate(e.target.value)}
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              <input
                type="text"
                value={measurementTime}
                onChange={(e) => setMeasurementTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>
        </div>

        {/* Nurse and Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Clinical Notes & Observations (Optional)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Chills reported, shivering, paracetamol administered, patient resting..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        {/* Buttons */}
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
            disabled={!temperature || !!existingRecord}
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            Submit Reading
          </button>
        </div>
      </form>
    </Modal>
  );
};
