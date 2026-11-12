import React from 'react';
import { Search } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Search,
  title = 'No records found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  action,
}) => {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
