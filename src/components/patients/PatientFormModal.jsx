import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { usePatients } from '../../context/PatientContext';
import { useAuth } from '../../context/AuthContext';
import { TODAY_STR } from '../../utils/initialData';
import { Bed, UserCheck, ShieldAlert, AlertCircle } from 'lucide-react';

export const PatientFormModal = ({ isOpen, onClose }) => {
  const { registerPatient, getAvailableRooms, totalCapacity, occupiedBeds, patients } = usePatients();
  const { can, currentUser } = useAuth();

  const availableRooms = getAvailableRooms();

  // Generate next default ID based on existing patients
  const nextNumber = 1000 + patients.length + 1;
  const defaultId = `PT-${nextNumber}`;

  const [formData, setFormData] = useState({
    id: defaultId,
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    roomNumber: availableRooms[0] || '',
    admissionDate: TODAY_STR,
    severity: 'Mild',
    assignedNurse: 'Elena Rostova, RN',
    assignedDoctor: 'Dr. Marcus Vance, MD',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.id.trim()) newErrors.id = 'Patient ID is required';
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.age || isNaN(formData.age) || Number(formData.age) < 1 || Number(formData.age) > 120) {
      newErrors.age = 'Valid age between 1-120 is required';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
    if (!formData.roomNumber) newErrors.roomNumber = 'Room assignment is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const res = registerPatient(formData);
    setSubmitting(false);

    if (res.success) {
      onClose();
      // Reset form
      setFormData({
        id: `PT-${1000 + patients.length + 2}`,
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        roomNumber: availableRooms[1] || '',
        admissionDate: TODAY_STR,
        severity: 'Mild',
        assignedNurse: 'Elena Rostova, RN',
        assignedDoctor: 'Dr. Marcus Vance, MD',
        notes: '',
      });
    }
  };

  if (!can.registerPatient) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Restricted" maxWidth="max-w-md">
        <div className="flex items-start gap-3 p-4 bg-rose-50 text-rose-950 rounded-xl border border-rose-200">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-semibold">Administrator Role Required</p>
            <p className="mt-1 text-slate-600">
              Only hospital administrators can admit and register new patients or assign facility rooms. You are currently logged in as <span className="font-semibold capitalize">{currentUser?.role}</span>.
            </p>
          </div>
        </div>
      </Modal>
    );
  }

  const wingA = availableRooms.filter((r) => r.startsWith('A-'));
  const wingB = availableRooms.filter((r) => r.startsWith('B-'));
  const wingC = availableRooms.filter((r) => r.startsWith('C-'));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register New Patient"
      subtitle={`Quarantine Facility Census (${occupiedBeds}/${totalCapacity} Beds Occupied)`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Capacity banner */}
        <div className="p-3 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-between text-xs text-brand-900">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-brand-600" />
            <span>
              <strong>{availableRooms.length}</strong> rooms currently available out of{' '}
              <strong>{totalCapacity}</strong> total beds.
            </span>
          </div>
          <span className="font-semibold text-brand-700">Capacity: 74 Max</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Patient ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
              placeholder="e.g. PT-1021"
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 ${
                errors.id ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            />
            {errors.id && <p className="text-[11px] text-rose-500 mt-1">{errors.id}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Legal Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Jonathan Lee"
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 ${
                errors.name ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Age <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              placeholder="e.g. 45"
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 ${
                errors.age ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            />
            {errors.age && <p className="text-[11px] text-rose-500 mt-1">{errors.age}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone <span className="text-rose-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 (555) 000-0000"
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs focus:outline-none focus:ring-2 ${
                errors.phone ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Room Assignment <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className={`w-full px-3 py-2 bg-white border rounded-xl text-xs font-medium focus:outline-none focus:ring-2 ${
                errors.roomNumber ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-brand-500/20 focus:border-brand-500'
              }`}
            >
              <option value="">Select available quarantine room...</option>
              {wingA.length > 0 && (
                <optgroup label={`Wing A (Isolation Units - ${wingA.length} free)`}>
                  {wingA.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
              )}
              {wingB.length > 0 && (
                <optgroup label={`Wing B (Moderate Care - ${wingB.length} free)`}>
                  {wingB.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
              )}
              {wingC.length > 0 && (
                <optgroup label={`Wing C (Step-Down Recovery - ${wingC.length} free)`}>
                  {wingC.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
              )}
            </select>
            {errors.roomNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.roomNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Admission Date</label>
            <input
              type="date"
              value={formData.admissionDate}
              onChange={(e) => setFormData({ ...formData, admissionDate: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Nurse</label>
            <select
              value={formData.assignedNurse}
              onChange={(e) => setFormData({ ...formData, assignedNurse: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="Elena Rostova, RN">Elena Rostova, RN</option>
              <option value="Marcus Sterling, BSN">Marcus Sterling, BSN</option>
              <option value="Tanya Vance, LPN">Tanya Vance, LPN</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Attending Physician</label>
            <select
              value={formData.assignedDoctor}
              onChange={(e) => setFormData({ ...formData, assignedDoctor: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="Dr. Marcus Vance, MD">Dr. Marcus Vance, MD (Infectious Disease)</option>
              <option value="Dr. Sarah Al-Sayed, MD">Dr. Sarah Al-Sayed, MD (Pulmonology)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Intake Notes</label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Symptoms at intake, quarantine cluster, pre-existing conditions..."
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

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
            disabled={submitting || availableRooms.length === 0}
            className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Registering...' : 'Complete Registration'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
