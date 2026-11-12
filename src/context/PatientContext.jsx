import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PATIENTS,
  ALL_ROOMS,
  FEVER_THRESHOLD,
  TOTAL_FACILITY_CAPACITY,
  INITIAL_AUDIT_LOGS,
  HISTORICAL_STATS,
  TODAY_STR,
} from '../utils/initialData';
import { getStoredItem, setStoredItem, STORAGE_KEYS, resetToDemoData } from '../utils/storage';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const PatientContext = createContext(null);

export const PatientProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const toast = useToast();

  const [patients, setPatients] = useState(() =>
    getStoredItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS)
  );
  const [feverThreshold, setFeverThresholdState] = useState(() =>
    getStoredItem(STORAGE_KEYS.FEVER_THRESHOLD, FEVER_THRESHOLD)
  );
  const [auditLogs, setAuditLogs] = useState(() =>
    getStoredItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
  );
  const [stats, setStats] = useState(() =>
    getStoredItem(STORAGE_KEYS.HISTORICAL_STATS, HISTORICAL_STATS)
  );

  // Sync to localStorage
  useEffect(() => {
    setStoredItem(STORAGE_KEYS.PATIENTS, patients);
  }, [patients]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.AUDIT_LOGS, auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.FEVER_THRESHOLD, feverThreshold);
  }, [feverThreshold]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.HISTORICAL_STATS, stats);
  }, [stats]);

  // Add audit log helper
  const logAction = (action, details, level = 'info') => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
      action,
      user: currentUser?.name || 'System Worker',
      role: currentUser?.role || 'system',
      details,
      level,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const setFeverThreshold = (newThreshold) => {
    const val = parseFloat(newThreshold);
    if (isNaN(val) || val < 35 || val > 42) {
      toast.error('Invalid threshold', 'Please enter a valid temperature threshold between 35°C and 42°C');
      return false;
    }
    setFeverThresholdState(val);
    logAction('SETTINGS_CHANGED', `Fever threshold updated to ${val}°C`);
    toast.success('Threshold Updated', `Fever cutoff set to ${val}°C`);
    return true;
  };

  // Helper: calculate consecutive fever-free days for a patient
  const calculateConsecutiveFeverFree = (temperatureHistory, currentThreshold = feverThreshold) => {
    if (!temperatureHistory || temperatureHistory.length === 0) return 0;

    // Group by unique date (take latest record per date)
    const recordsByDate = {};
    temperatureHistory.forEach((rec) => {
      recordsByDate[rec.date] = rec;
    });

    // Check consecutive days backwards starting from today or yesterday
    let consecutiveDays = 0;
    const testDate = new Date();

    // Check up to 14 days back
    for (let i = 0; i < 14; i++) {
      const d = new Date(testDate);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];

      const record = recordsByDate[dateStr];

      if (i === 0 && !record) {
        // Today hasn't been recorded yet; evaluate past days starting yesterday
        continue;
      }

      if (!record) {
        // Missing record breaks the streak! Prompt rule: "A missing daily temperature record must not count as a fever-free day."
        break;
      }

      if (record.temperature >= currentThreshold) {
        // Fever detected! Breaks consecutive streak
        break;
      } else {
        // Fever free
        consecutiveDays++;
      }
    }

    return consecutiveDays;
  };

  // Get available rooms from 74 total
  const getOccupiedRooms = () => {
    return patients
      .filter((p) => p.status !== 'Discharged')
      .map((p) => p.roomNumber)
      .filter(Boolean);
  };

  const getAvailableRooms = () => {
    const occupied = new Set(getOccupiedRooms());
    return ALL_ROOMS.filter((room) => !occupied.has(room));
  };

  // 1. Patient Registration (Admin only, max 74 capacity, unique ID, available room)
  const registerPatient = (patientData) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Permission Denied', 'Only administrators can register new patients.');
      return { success: false, message: 'Only administrators can register new patients.' };
    }

    const activePatientsCount = patients.filter((p) => p.status !== 'Discharged').length;
    if (activePatientsCount >= TOTAL_FACILITY_CAPACITY) {
      toast.error('Facility at Full Capacity', `Maximum capacity of ${TOTAL_FACILITY_CAPACITY} patients reached.`);
      return { success: false, message: 'Facility is at maximum capacity.' };
    }

    const existingId = patients.find((p) => p.id.toLowerCase() === patientData.id.trim().toLowerCase());
    if (existingId) {
      toast.error('Duplicate Patient ID', `Patient ID ${patientData.id} already exists.`);
      return { success: false, message: `Patient ID ${patientData.id} already exists.` };
    }

    const occupiedRooms = getOccupiedRooms();
    if (occupiedRooms.includes(patientData.roomNumber)) {
      toast.error('Room Occupied', `Room ${patientData.roomNumber} is already occupied by another patient.`);
      return { success: false, message: `Room ${patientData.roomNumber} is already occupied.` };
    }

    const newPatient = {
      id: patientData.id.trim().toUpperCase(),
      name: patientData.name.trim(),
      age: parseInt(patientData.age, 10),
      gender: patientData.gender,
      phone: patientData.phone.trim(),
      roomNumber: patientData.roomNumber,
      admissionDate: patientData.admissionDate || TODAY_STR,
      status: 'Admitted',
      severity: patientData.severity || 'Mild',
      assignedNurse: patientData.assignedNurse || 'Elena Rostova, RN',
      assignedDoctor: patientData.assignedDoctor || 'Dr. Marcus Vance, MD',
      feverFreeConsecutiveDays: 0,
      doctorRecommendation: 'Pending',
      dischargeStatus: 'Not Eligible',
      notes: patientData.notes || 'Newly admitted patient under quarantine monitoring.',
      temperatureHistory: [],
      doctorVisits: [],
    };

    setPatients((prev) => [newPatient, ...prev]);
    logAction(
      'PATIENT_REGISTERED',
      `Registered new patient ${newPatient.name} (${newPatient.id}) to Room ${newPatient.roomNumber}`
    );
    toast.success('Patient Registered', `${newPatient.name} assigned to Room ${newPatient.roomNumber}`);
    return { success: true, patient: newPatient };
  };

  // 2. Record Temperature (Nurse/Admin, 1 active record per day, prevent duplicate unless correction)
  const recordTemperature = ({ patientId, temperature, notes, nurseName, measurementDate = TODAY_STR, measurementTime }) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) {
      toast.error('Error', 'Patient not found');
      return { success: false, message: 'Patient not found' };
    }

    if (patient.status === 'Discharged') {
      toast.error('Patient Discharged', 'Routine temperature recording is disabled for discharged patients.');
      return { success: false, message: 'Patient is already discharged.' };
    }

    // Check duplicate for today
    const existingToday = patient.temperatureHistory.find((t) => t.date === measurementDate);
    if (existingToday) {
      toast.warning(
        'Entry Already Exists',
        `Today's temperature (${existingToday.temperature}°C) has already been recorded. Use "Correct Entry" to revise.`
      );
      return {
        success: false,
        isDuplicate: true,
        existingRecord: existingToday,
        message: "Today's temperature has already been recorded for this patient.",
      };
    }

    const tempVal = parseFloat(temperature);
    if (isNaN(tempVal) || tempVal < 30 || tempVal > 45) {
      toast.error('Invalid Temperature', 'Please enter a realistic temperature reading between 30°C and 45°C.');
      return { success: false, message: 'Invalid temperature value.' };
    }

    const isFever = tempVal >= feverThreshold;
    const timeFormatted = measurementTime || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newRecord = {
      id: `th-${patient.id}-${Date.now()}`,
      date: measurementDate,
      time: timeFormatted,
      temperature: tempVal,
      status: isFever ? 'Fever' : 'Normal',
      recordedBy: nurseName || currentUser?.name || 'Nurse On Duty',
      notes: notes || (isFever ? 'Fever detected above threshold' : 'Afebrile reading'),
    };

    const updatedHistory = [newRecord, ...patient.temperatureHistory];
    const newConsecutiveFeverFree = calculateConsecutiveFeverFree(updatedHistory, feverThreshold);

    // Update eligibility based on rule (3 consecutive complete days without fever)
    let newDischargeStatus = patient.dischargeStatus;
    if (newConsecutiveFeverFree >= 3) {
      if (patient.doctorRecommendation === 'Recommended') {
        newDischargeStatus = 'Pending Admin Approval';
      } else {
        newDischargeStatus = 'Eligible';
      }
    } else {
      newDischargeStatus = 'Not Eligible';
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            temperatureHistory: updatedHistory,
            feverFreeConsecutiveDays: newConsecutiveFeverFree,
            dischargeStatus: newDischargeStatus,
            status: isFever && p.status !== 'Critical' ? 'Isolated' : p.status,
          };
        }
        return p;
      })
    );

    if (isFever) {
      logAction(
        'FEVER_DETECTED',
        `ALERT: High temperature ${tempVal}°C recorded for ${patient.name} (${patient.id}, Room ${patient.roomNumber}). Fever streak reset to 0.`,
        'critical'
      );
      toast.error('Fever Detected!', `${patient.name} recorded ${tempVal}°C (≥ ${feverThreshold}°C). Consecutive days reset.`);
    } else {
      logAction(
        'TEMPERATURE_RECORDED',
        `Recorded temperature ${tempVal}°C for ${patient.name} (${patient.id}). Consecutive fever-free days: ${newConsecutiveFeverFree}.`
      );
      toast.success(
        'Temperature Recorded',
        `${patient.name}: ${tempVal}°C (${newConsecutiveFeverFree}/3 fever-free days)`
      );
    }

    return { success: true };
  };

  // 3. Correct Temperature (preserve original record in auditCorrections)
  const correctTemperature = ({ patientId, recordId, newTemp, reason, nurseName }) => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found' };

    const targetIndex = patient.temperatureHistory.findIndex((r) => r.id === recordId);
    if (targetIndex === -1) return { success: false, message: 'Record not found' };

    const originalRecord = patient.temperatureHistory[targetIndex];
    const tempVal = parseFloat(newTemp);
    if (isNaN(tempVal) || tempVal < 30 || tempVal > 45) {
      toast.error('Invalid Temperature', 'Please enter a valid temperature between 30°C and 45°C.');
      return { success: false, message: 'Invalid temperature' };
    }

    const isFever = tempVal >= feverThreshold;
    const correctionAudit = {
      correctedAt: new Date().toISOString(),
      correctedBy: nurseName || currentUser?.name || 'Staff Nurse',
      originalTemp: originalRecord.temperature,
      newTemp: tempVal,
      reason: reason || 'Nurse entry correction',
    };

    const updatedRecord = {
      ...originalRecord,
      temperature: tempVal,
      status: isFever ? 'Fever' : 'Normal',
      isCorrection: true,
      lastCorrected: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      auditCorrections: [...(originalRecord.auditCorrections || []), correctionAudit],
    };

    const updatedHistory = [...patient.temperatureHistory];
    updatedHistory[targetIndex] = updatedRecord;

    const newConsecutiveFeverFree = calculateConsecutiveFeverFree(updatedHistory, feverThreshold);

    let newDischargeStatus = patient.dischargeStatus;
    if (newConsecutiveFeverFree >= 3) {
      newDischargeStatus = patient.doctorRecommendation === 'Recommended' ? 'Pending Admin Approval' : 'Eligible';
    } else {
      newDischargeStatus = 'Not Eligible';
    }

    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? {
              ...p,
              temperatureHistory: updatedHistory,
              feverFreeConsecutiveDays: newConsecutiveFeverFree,
              dischargeStatus: newDischargeStatus,
            }
          : p
      )
    );

    logAction(
      'TEMPERATURE_CORRECTION',
      `Corrected temperature for ${patient.name} (${patient.id}) from ${originalRecord.temperature}°C to ${tempVal}°C. Reason: "${reason}"`
    );
    toast.success('Temperature Corrected', `Updated to ${tempVal}°C. Audit trail updated.`);
    return { success: true };
  };

  // 4. Doctor Visit (Checks today's temperature; warning if missing; allow emergency override)
  const completeDoctorVisit = ({ patientId, observation, treatmentNotes, emergencyOverride = false, overrideReason = '' }) => {
    if (currentUser?.role !== 'doctor' && currentUser?.role !== 'admin') {
      toast.error('Permission Denied', 'Only doctors can complete clinical visits.');
      return { success: false, message: 'Only doctors can complete clinical visits.' };
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found' };

    const todayTempRecord = patient.temperatureHistory.find((t) => t.date === TODAY_STR);

    if (!todayTempRecord && !emergencyOverride) {
      return {
        success: false,
        requiresOverride: true,
        message: "Today's temperature has not been recorded yet. Please ask the nurse to complete the measurement.",
      };
    }

    if (emergencyOverride && !overrideReason.trim()) {
      toast.error('Reason Required', 'Mandatory clinical justification is required for emergency override.');
      return { success: false, message: 'Mandatory justification required for emergency override.' };
    }

    const newVisit = {
      id: `dv-${patient.id}-${Date.now()}`,
      date: TODAY_STR,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      doctorName: currentUser?.name || 'Dr. Marcus Vance, MD',
      observation: observation.trim(),
      treatmentNotes: treatmentNotes.trim(),
      status: 'Completed',
      emergencyOverride,
      overrideReason: emergencyOverride ? overrideReason.trim() : null,
    };

    setPatients((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, doctorVisits: [newVisit, ...p.doctorVisits] } : p))
    );

    if (emergencyOverride) {
      logAction(
        'DOCTOR_VISIT_OVERRIDE',
        `EMERGENCY OVERRIDE: ${currentUser?.name} conducted visit for ${patient.name} (${patient.id}) without today's temperature. Reason: "${overrideReason}"`,
        'critical'
      );
      toast.warning('Emergency Override Recorded', 'Doctor visit logged with clinical audit record.');
    } else {
      logAction(
        'DOCTOR_VISIT_COMPLETED',
        `Doctor ${currentUser?.name} completed daily visit for ${patient.name} (${patient.id}). Observation: "${observation.substring(0, 40)}..."`
      );
      toast.success('Doctor Visit Completed', `Assessment logged for ${patient.name}`);
    }

    return { success: true };
  };

  // 5. Recommend Discharge (Doctor or Admin)
  const recommendDischarge = (patientId, recommendationNotes = '') => {
    if (currentUser?.role !== 'doctor' && currentUser?.role !== 'admin') {
      toast.error('Permission Denied', 'Only doctors can recommend a patient for discharge.');
      return { success: false, message: 'Only doctors can recommend discharge.' };
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found' };

    if (patient.feverFreeConsecutiveDays < 3) {
      toast.error(
        'Criteria Not Met',
        `Patient has only ${patient.feverFreeConsecutiveDays}/3 consecutive fever-free days. 3 complete days required.`
      );
      return { success: false, message: 'Discharge criteria not met (3 consecutive fever-free days required).' };
    }

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            doctorRecommendation: 'Recommended',
            dischargeStatus: 'Pending Admin Approval',
          };
        }
        return p;
      })
    );

    logAction(
      'DISCHARGE_RECOMMENDED',
      `Dr. ${currentUser?.name} formally recommended ${patient.name} (${patient.id}) for discharge. ${recommendationNotes ? `Notes: ${recommendationNotes}` : ''}`
    );
    toast.success('Discharge Recommended', `${patient.name} submitted to Administration for discharge clearance.`);
    return { success: true };
  };

  // 6. Confirm Administrative Discharge (Admin only! Frees room, marks Discharged, updates recovered stats)
  const confirmDischarge = (patientId) => {
    if (currentUser?.role !== 'admin') {
      toast.error('Permission Denied', 'Only administrators can confirm and process patient discharge.');
      return { success: false, message: 'Only administrators can confirm discharge.' };
    }

    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return { success: false, message: 'Patient not found' };

    const freedRoom = patient.roomNumber;

    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: 'Discharged',
            dischargeStatus: 'Discharged',
            dischargeDate: TODAY_STR,
            roomNumber: null, // Room freed!
            notes: `${p.notes} | Discharged on ${TODAY_STR} by ${currentUser?.name}.`,
          };
        }
        return p;
      })
    );

    // Update stats: +1 recovered
    setStats((prev) => ({
      ...prev,
      totalHistoricalRecovered: prev.totalHistoricalRecovered + 1,
    }));

    logAction(
      'DISCHARGE_CONFIRMED',
      `Administrator ${currentUser?.name} confirmed discharge for ${patient.name} (${patient.id}). Room ${freedRoom} is now AVAILABLE.`
    );
    toast.success('Patient Discharged Successfully', `Room ${freedRoom} is now freed and available for new admissions.`);
    return { success: true, freedRoom };
  };

  // Helper stats computation for Dashboard and Analytics
  const activePatients = patients.filter((p) => p.status !== 'Discharged');
  const occupiedBeds = activePatients.length;
  const availableBeds = TOTAL_FACILITY_CAPACITY - occupiedBeds;

  // Pending temperature checks today
  const pendingTempChecks = activePatients.filter(
    (p) => !p.temperatureHistory.some((t) => t.date === TODAY_STR)
  ).length;

  // Pending doctor visits today
  const pendingDoctorVisits = activePatients.filter(
    (p) => !p.doctorVisits.some((v) => v.date === TODAY_STR && v.status === 'Completed')
  ).length;

  // Discharge eligible patients (>= 3 consecutive days)
  const dischargeEligible = activePatients.filter(
    (p) => p.feverFreeConsecutiveDays >= 3 || p.dischargeStatus === 'Eligible' || p.dischargeStatus === 'Pending Admin Approval'
  ).length;

  // Total Recovered (historical + active discharged)
  const totalRecovered = stats.totalHistoricalRecovered;
  const totalDeaths = stats.totalHistoricalDeaths;

  // Total admissions = currently admitted + recovered + deaths
  const totalAdmissions = occupiedBeds + totalRecovered + totalDeaths;

  // Rate formulas strictly according to requirements:
  // Mortality Rate = (Total Deaths / Total Admissions) * 100
  // Success Rate = (Total Recovered / Total Admissions) * 100
  const mortalityRate = totalAdmissions > 0 ? ((totalDeaths / totalAdmissions) * 100).toFixed(1) : 0;
  const successRate = totalAdmissions > 0 ? ((totalRecovered / totalAdmissions) * 100).toFixed(1) : 0;
  const isMortalityExceeded = parseFloat(mortalityRate) > 15.0;

  const resetAllData = () => {
    const fresh = resetToDemoData();
    setPatients(fresh.patients);
    setAuditLogs(fresh.auditLogs);
    setStats(fresh.stats);
    setFeverThresholdState(fresh.feverThreshold);
    toast.info('Data Reset', 'Demo data has been restored to default state.');
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        activePatients,
        occupiedBeds,
        availableBeds,
        totalCapacity: TOTAL_FACILITY_CAPACITY,
        pendingTempChecks,
        pendingDoctorVisits,
        dischargeEligible,
        totalRecovered,
        totalDeaths,
        totalAdmissions,
        mortalityRate,
        successRate,
        isMortalityExceeded,
        feverThreshold,
        setFeverThreshold,
        auditLogs,
        stats,
        getAvailableRooms,
        registerPatient,
        recordTemperature,
        correctTemperature,
        completeDoctorVisit,
        recommendDischarge,
        confirmDischarge,
        resetAllData,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatients = () => {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('usePatients must be used within a PatientProvider');
  }
  return context;
};
