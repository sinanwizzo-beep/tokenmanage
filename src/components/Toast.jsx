import React, { useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useQueue();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, toast.duration || 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={20} />;
      case 'error': return <AlertCircle className="text-rose-500" size={20} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={20} />;
      default: return <Info className="text-blue-500" size={20} />;
    }
  };

  return (
    <div className="bg-white border border-zinc-200 shadow-lg rounded-xl p-4 flex items-center gap-3 min-w-[300px] animate-slide-up pointer-events-auto">
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium text-zinc-800">{toast.title}</p>
        {toast.message && <p className="text-xs text-zinc-500">{toast.message}</p>}
      </div>
      <button onClick={onDismiss} className="text-zinc-400 hover:text-zinc-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};
