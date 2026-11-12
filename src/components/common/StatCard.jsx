import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeVariant = 'default',
  trend,
  trendLabel,
  alert = false,
  alertMessage,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-card hover:shadow-card-hover ${
        onClick ? 'cursor-pointer hover:border-brand-300' : 'border-slate-200/80'
      } ${alert ? 'ring-2 ring-rose-500/20 border-rose-300' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-brand-950">
          {value}
        </span>
        {subtitle && (
          <span className="text-xs font-medium text-slate-500">
            {subtitle}
          </span>
        )}
      </div>

      {(badgeText || trend || trendLabel) && (
        <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                badgeVariant === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : badgeVariant === 'warning'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : badgeVariant === 'danger'
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-brand-50 text-brand-700 border border-brand-200'
              }`}
            >
              {badgeText}
            </span>
          )}
          {trendLabel && <span className="text-slate-500">{trendLabel}</span>}
        </div>
      )}

      {alert && alertMessage && (
        <div className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          {alertMessage}
        </div>
      )}
    </div>
  );
};
