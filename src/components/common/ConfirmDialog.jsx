import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}) => {
  const iconMap = {
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    danger: <AlertTriangle className="w-6 h-6 text-rose-600" />,
    success: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
    info: <Info className="w-6 h-6 text-brand-600" />,
  };

  const bgMap = {
    warning: 'bg-amber-50',
    danger: 'bg-rose-50',
    success: 'bg-emerald-50',
    info: 'bg-brand-50',
  };

  const btnMap = {
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    info: 'bg-brand-600 hover:bg-brand-700 text-white',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-xl shrink-0 ${bgMap[type]}`}>
          {iconMap[type]}
        </div>
        <div>
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition ${btnMap[type]}`}
        >
          {isLoading ? 'Processing...' : confirmText}
        </button>
      </div>
    </Modal>
  );
};
