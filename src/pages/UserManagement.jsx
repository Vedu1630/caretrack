import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_USERS } from '../utils/initialData';
import { Badge } from '../components/common/Badge';
import {
  UserCog,
  Shield,
  Stethoscope,
  HeartPulse,
  Key,
  Check,
  X,
  Mail,
  Phone,
  Building,
  UserCheck
} from 'lucide-react';

export const UserManagement = () => {
  const { currentUser, loginAsRole, can } = useAuth();
  const [users, setUsers] = useState(DEMO_USERS);

  const permissionsMatrix = [
    { capability: 'Register Patients & Assign Rooms', admin: true, nurse: false, doctor: false },
    { capability: 'Record & Correct Daily Temperatures', admin: true, nurse: true, doctor: false },
    { capability: 'Conduct Clinical Rounds & Enter Observations', admin: true, nurse: false, doctor: true },
    { capability: 'Authorize Emergency Rounds Override', admin: true, nurse: false, doctor: true },
    { capability: 'Recommend Discharge (≥ 3 Days Afebrile)', admin: true, nurse: false, doctor: true },
    { capability: 'Confirm Administrative Discharge & Free Bed', admin: true, nurse: false, doctor: false },
    { capability: 'Manage Facility Users & Security Settings', admin: true, nurse: false, doctor: false },
    { capability: 'View Epidemiological & Mortality Analytics', admin: true, nurse: true, doctor: true },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-brand-950 tracking-tight">
              Hospital Staff & Role-Based Access Control
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              RBAC Matrix v2.4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quarantine ward clinical credentialing, duty assignments, and system permission governance
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
          <Key className="w-3.5 h-3.5 text-brand-600" />
          <span>Active Role: <strong className="capitalize text-slate-900">{currentUser?.role}</strong></span>
        </div>
      </div>

      {/* Staff Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {users.map((user) => {
          const isCurrent = currentUser?.id === user.id;
          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl p-5 border shadow-card transition-all flex flex-col justify-between ${
                isCurrent ? 'ring-2 ring-brand-500/20 border-brand-300' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : user.role === 'nurse'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : 'bg-brand-100 text-brand-700 border border-brand-200'
                      }`}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-950">{user.name}</h4>
                      <p className="text-xs font-semibold text-brand-600 uppercase tracking-tight">
                        {user.roleTitle}
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <Badge variant="primary" size="sm">
                      Current User
                    </Badge>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{user.department}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => loginAsRole(user.role)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition ${
                    isCurrent
                      ? 'bg-slate-100 text-slate-500 cursor-default'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200'
                  }`}
                >
                  {isCurrent ? 'Currently Active Persona' : `Switch to ${user.roleTitle}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Role-Based Permissions Governance Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-brand-950">
              Role-Based Access Control (RBAC) Enforcement Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict client and business logic enforcement for administrative, nursing, and medical operations
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">System Operation / Action</th>
                <th className="py-3 px-4 text-center">Administrator</th>
                <th className="py-3 px-4 text-center">Staff Nurse</th>
                <th className="py-3 px-4 text-center">Attending Physician</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {item.capability}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.admin ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.nurse ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {item.doctor ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-600">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 text-rose-500">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
