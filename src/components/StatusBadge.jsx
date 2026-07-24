import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'waiting':
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
      case 'called':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'serving':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'paused':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-zinc-800 text-zinc-100 border-zinc-700';
      case 'noshow':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'skipped':
        return 'bg-zinc-100 text-zinc-400 border-zinc-200 line-through';
      default:
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest border ${getStyles()}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
