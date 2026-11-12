import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
    lg: 'text-sm px-3 py-1.5 rounded-full font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border transition-colors ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const PatientStatusBadge = ({ status }) => {
  switch (status) {
    case 'Admitted':
      return <Badge variant="primary"><span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>Admitted</Badge>;
    case 'Isolated':
      return <Badge variant="warning"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Isolated</Badge>;
    case 'Critical':
      return <Badge variant="danger"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>Critical</Badge>;
    case 'Recovered':
    case 'Discharged':
      return <Badge variant="success"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>{status}</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export const TempStatusBadge = ({ status, temp }) => {
  if (status === 'Fever' || (typeof temp === 'number' && temp >= 38.0)) {
    return (
      <Badge variant="danger">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
        Fever ({temp}°C)
      </Badge>
    );
  }
  if (status === 'Normal' || (typeof temp === 'number' && temp < 38.0)) {
    return (
      <Badge variant="success">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Normal ({temp}°C)
      </Badge>
    );
  }
  return (
    <Badge variant="warning">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
      Pending
    </Badge>
  );
};
