import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', destructive = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl border border-zinc-200 w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${destructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
              <AlertTriangle size={20} />
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
              <X size={20} />
            </button>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500">{message}</p>
        </div>
        <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-200 bg-zinc-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${destructive ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
