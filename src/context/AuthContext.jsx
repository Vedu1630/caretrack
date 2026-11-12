import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../utils/initialData';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return getStoredItem(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[0]);
  });

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  const login = (email, password) => {
    const user = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'Invalid credentials. Please use one of the demo accounts.' };
    }

    if (password !== 'password123') {
      return { success: false, message: 'Invalid password. Demo password is password123.' };
    }

    setCurrentUser(user);
    return { success: true, user };
  };

  const loginAsRole = (role) => {
    const user = DEMO_USERS.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: `Role ${role} not found` };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // RBAC Permission checks
  const can = {
    registerPatient: currentUser?.role === 'admin',
    assignRoom: currentUser?.role === 'admin',
    confirmDischarge: currentUser?.role === 'admin',
    manageUsers: currentUser?.role === 'admin',
    recordTemperature: currentUser?.role === 'nurse' || currentUser?.role === 'admin',
    correctTemperature: currentUser?.role === 'nurse' || currentUser?.role === 'admin',
    recommendDischarge: currentUser?.role === 'doctor' || currentUser?.role === 'admin',
    completeDoctorVisit: currentUser?.role === 'doctor' || currentUser?.role === 'admin',
    viewAnalytics: true, // all can view, but admin & doctor see deeper clinical metrics
    viewAuditLog: currentUser?.role === 'admin' || currentUser?.role === 'doctor',
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginAsRole,
        logout,
        can,
        isAuthenticated: !!currentUser,
        role: currentUser?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
