import React from 'react';

const KpiCard = ({ title, value, subtitle, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
          <Icon size={20} />
        </div>
        {subtitle && <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-semibold">{subtitle}</span>}
      </div>
      <div>
        <h3 className="text-2xl font-light text-zinc-900 mb-1 font-mono">{value}</h3>
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">{title}</p>
      </div>
    </div>
  );
};

export default KpiCard;
