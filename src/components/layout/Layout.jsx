import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getPageMeta = (pathname) => {
    switch (pathname) {
      case '/dashboard':
        return { title: 'Facility Overview & KPIs', breadcrumbs: ['Operations', 'Dashboard'] };
      case '/patients':
        return { title: 'Patient Census & Admissions', breadcrumbs: ['Clinical', 'Patients'] };
      case '/temperatures':
        return { title: 'Temperature Monitoring & Vitals', breadcrumbs: ['Nursing', 'Temperatures'] };
      case '/doctor-visits':
        return { title: 'Daily Doctor Rounds & Assessments', breadcrumbs: ['Clinical', 'Doctor Visits'] };
      case '/discharge':
        return { title: 'Discharge Eligibility & Clearances', breadcrumbs: ['Discharge', 'Protocol Management'] };
      case '/analytics':
        return { title: 'Epidemiological & Mortality Analytics', breadcrumbs: ['Reports', 'Analytics'] };
      case '/users':
        return { title: 'Facility Staff & Role Permissions', breadcrumbs: ['Administration', 'User Management'] };
      default:
        return { title: 'CareTrack Portal', breadcrumbs: ['Home'] };
    }
  };

  const { title, breadcrumbs } = getPageMeta(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Topbar
          pageTitle={title}
          breadcrumbs={breadcrumbs}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
