import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PatientProvider } from './context/PatientContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Patients } from './pages/Patients';
import { TemperatureMonitoring } from './pages/TemperatureMonitoring';
import { DoctorVisits } from './pages/DoctorVisits';
import { DischargeManagement } from './pages/DischargeManagement';
import { Analytics } from './pages/Analytics';
import { UserManagement } from './pages/UserManagement';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <PatientProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Login Route */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Protected App Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="patients" element={<Patients />} />
                <Route path="temperatures" element={<TemperatureMonitoring />} />
                <Route path="doctor-visits" element={<DoctorVisits />} />
                <Route path="discharge" element={<DischargeManagement />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="users" element={<UserManagement />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </PatientProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
