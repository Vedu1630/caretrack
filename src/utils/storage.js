import { INITIAL_PATIENTS, DEMO_USERS, INITIAL_AUDIT_LOGS, HISTORICAL_STATS, FEVER_THRESHOLD } from './initialData';

const STORAGE_KEYS = {
  PATIENTS: 'caretrack_patients_v1',
  USERS: 'caretrack_users_v1',
  CURRENT_USER: 'caretrack_current_user_v1',
  AUDIT_LOGS: 'caretrack_audit_logs_v1',
  HISTORICAL_STATS: 'caretrack_stats_v1',
  FEVER_THRESHOLD: 'caretrack_fever_threshold_v1',
};

export const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

export const loadInitialData = () => {
  return {
    patients: getStoredItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS),
    users: getStoredItem(STORAGE_KEYS.USERS, DEMO_USERS),
    currentUser: getStoredItem(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]), // default to Admin
    auditLogs: getStoredItem(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS),
    stats: getStoredItem(STORAGE_KEYS.HISTORICAL_STATS, HISTORICAL_STATS),
    feverThreshold: getStoredItem(STORAGE_KEYS.FEVER_THRESHOLD, FEVER_THRESHOLD),
  };
};

export const resetToDemoData = () => {
  localStorage.removeItem(STORAGE_KEYS.PATIENTS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  localStorage.removeItem(STORAGE_KEYS.HISTORICAL_STATS);
  localStorage.removeItem(STORAGE_KEYS.FEVER_THRESHOLD);
  return loadInitialData();
};

export { STORAGE_KEYS };
