import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import { Thermometer, AlertCircle, History } from 'lucide-react';

export const TempCorrectionModal = ({ isOpen, onClose, patient, record }) => {
  const { correctTemperature, feverThreshold } = usePatients();
  const { currentUser } = useAuth();

  const [newTemp, setNewTemp] = useState(record?.temperature || '');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  if (!patient || !record) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('A clinical justification is required for correcting a recorded vitals entry.');
      return;
    }

    const res = correctTemperature({
      patientId: patient.id,
      recordId: record.id,
      newTemp,
      reason,
      nurseName: currentUser?.name || 'Elena Rostova, RN',
    });

    if (res.success) {
      onClose();
    }
  };

  const tempVal = parseFloat(newTemp);
  const isFever = !isNaN(tempVal) && tempVal >= feverThreshold;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Correct Temperature Record"
      subtitle={`Patient: ${patient.name} (${patient.id}) • Entry on ${record.date}`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Original record reference */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Original Recorded Entry</span>
            <span className="text-slate-900 font-bold text-sm">
              {record.temperature}°C ({record.status})
            </span>
            <span className="text-slate-500 block text-[11px]">
              Logged at {record.time} by {record.recordedBy}
            </span>
          </div>
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            <History className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* New temperature */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Revised Temperature (°C) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="32"
              max="44"
              required
              value={newTemp}
              onChange={(e) => setNewTemp(e.target.value)}
              className="w-full pl-9 pr-12 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <Thermometer className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
              °C
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Status with {feverThreshold}°C cutoff:{' '}
            <strong className={isFever ? 'text-rose-600' : 'text-emerald-600'}>
              {isFever ? 'Fever (Resets fever-free count)' : 'Normal / Afebrile'}
            </strong>
          </p>
        </div>

        {/* Mandatory reason */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Correction Justification / Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError('');
            }}
            placeholder="e.g. Device sensor recalibrated; patient re-tested 10 minutes post ingestion of hot beverage."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
          {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
          <p className="text-[10px] text-slate-400 mt-1">
            * The original reading and this justification will be preserved permanently in the hospital audit trail.
          </p>
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
            className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition"
          >
            Save Correction & Log Audit
          </button>
        </div>
      </form>
    </Modal>
  );
};
