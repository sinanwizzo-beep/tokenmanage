import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { 
  Users, Play, CheckCircle2, XCircle, Clock, ChevronLeft, 
  Activity, UserCheck, Search, Bell, Pause, RefreshCw, BarChart3, List, MonitorPlay
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatusBadge from '../../components/StatusBadge';
import KpiCard from '../../components/KpiCard';
import ConfirmDialog from '../../components/ConfirmDialog';

// Mock Data for Recharts
const hourlyData = [
  { time: '09:00', tokens: 12 }, { time: '10:00', tokens: 19 },
  { time: '11:00', tokens: 25 }, { time: '12:00', tokens: 32 },
  { time: '13:00', tokens: 28 }, { time: '14:00', tokens: 15 },
  { time: '15:00', tokens: 22 }, { time: '16:00', tokens: 18 }
];

const reasonData = [
  { name: 'Viewing', value: 45, color: '#f59e0b' },
  { name: 'Renewal', value: 25, color: '#10b981' },
  { name: 'Payment', value: 20, color: '#3b82f6' },
  { name: 'Other', value: 10, color: '#64748b' }
];

const Admin = () => {
  const navigate = useNavigate();
  const { 
    queue, counters, 
    callNext, startConsultation, pauseConsultation, resumeConsultation, 
    completeConsultation, skipToken, markNoShow, recallToken 
  } = useQueue();

  const [activeTab, setActiveTab] = useState('queue'); // queue, reports, activity
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: null, counterId: null });

  // Timers trigger re-render every second to update active consultation timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const getCounterTimer = (counter) => {
    if (counter.status === 'Serving' && counter.lastStartedAt) {
      const currentSessionSecs = Math.floor((new Date() - counter.lastStartedAt) / 1000);
      return counter.timer + currentSessionSecs;
    }
    return counter.timer;
  };

  const waitingTokens = queue.filter(t => t.status === 'waiting');
  const completedTokens = queue.filter(t => t.status === 'completed');
  const noshowTokens = queue.filter(t => t.status === 'noshow');

  const handleDestructiveAction = (type, counterId) => {
    setConfirmDialog({ 
      isOpen: true, 
      type, 
      counterId,
      title: type === 'noshow' ? 'Mark as No Show?' : 'Skip Token?',
      message: `Are you sure you want to ${type === 'noshow' ? 'mark this customer as a No Show' : 'skip this token'}? This action will remove them from the active counter.`,
      confirmText: type === 'noshow' ? 'Mark No Show' : 'Skip'
    });
  };

  const executeConfirmAction = () => {
    if (confirmDialog.type === 'noshow') {
      markNoShow(confirmDialog.counterId);
    } else if (confirmDialog.type === 'skip') {
      skipToken(confirmDialog.counterId);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col overflow-hidden h-screen">
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={executeConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        destructive={true}
      />

      {/* Top Navbar */}
      <header className="bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-20 relative">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')}
            className="text-zinc-400 hover:text-amber-600 transition-colors"
            title="Back to Home"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-lg font-bold tracking-[0.15em] text-zinc-800 uppercase">
            Elysium <span className="text-amber-600 font-light">Estates</span>
            <span className="ml-4 text-[10px] font-semibold text-zinc-400 tracking-widest border-l border-zinc-200 pl-4 uppercase hidden sm:inline">Admin</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="hidden md:flex bg-zinc-100 p-1 rounded-lg border border-zinc-200">
           <button onClick={()=>setActiveTab('queue')} className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-md transition-all ${activeTab==='queue' ? 'bg-white shadow-sm text-amber-600' : 'text-zinc-500 hover:text-zinc-700'}`}>Counters</button>
           <button onClick={()=>setActiveTab('reports')} className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-md transition-all ${activeTab==='reports' ? 'bg-white shadow-sm text-amber-600' : 'text-zinc-500 hover:text-zinc-700'}`}>Reports</button>
           <button onClick={()=>setActiveTab('activity')} className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-widest rounded-md transition-all ${activeTab==='activity' ? 'bg-white shadow-sm text-amber-600' : 'text-zinc-500 hover:text-zinc-700'}`}>Activity</button>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-zinc-400 hover:text-amber-600 p-2 transition-colors relative">
            <Bell size={20}/>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-xs">A</div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 overflow-y-auto relative p-6 sm:p-8 bg-zinc-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-50 rounded-full mix-blend-multiply filter blur-[150px] opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 space-y-8 animate-fade-in">

          {activeTab === 'queue' && (
            <>
              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <KpiCard title="Waiting" value={waitingTokens.length} icon={Users} colorClass="bg-zinc-100 text-zinc-600" />
                <KpiCard title="In Service" value={counters.filter(c=>c.status==='Serving').length} icon={Activity} colorClass="bg-emerald-50 text-emerald-600" />
                <KpiCard title="Completed" value={completedTokens.length} icon={CheckCircle2} colorClass="bg-amber-50 text-amber-600" />
                <KpiCard title="No Shows" value={noshowTokens.length} icon={XCircle} colorClass="bg-rose-50 text-rose-600" />
                <KpiCard title="Avg. Time" value="04:15" icon={Clock} colorClass="bg-blue-50 text-blue-600" subtitle="Mins" />
              </div>

              {/* Counters */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {counters.map(counter => (
                  <div key={counter.id} className={`bg-white rounded-2xl border ${counter.status === 'Serving' ? 'border-amber-400 shadow-md' : 'border-zinc-200 shadow-sm'} p-6 flex flex-col transition-all relative overflow-hidden`}>
                    {counter.status === 'Serving' && <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>}
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-1">{counter.name}</h3>
                        <p className="text-sm font-semibold text-zinc-800">{counter.agentName}</p>
                      </div>
                      <StatusBadge status={counter.status} />
                    </div>

                    <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-5 mb-6 flex-1 flex flex-col justify-center min-h-[140px]">
                      {counter.currentToken ? (
                        <div className="text-center animate-scale-in">
                          <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">Current Token</p>
                          <p className="text-4xl font-bold font-mono text-zinc-900 mb-2">{counter.currentToken.id}</p>
                          <p className="text-xs uppercase tracking-widest text-amber-600 font-semibold mb-3">{counter.currentToken.reasonName}</p>
                          {['Serving', 'Paused'].includes(counter.status) && (
                            <div className="flex items-center justify-center gap-2 text-zinc-600 font-mono text-xl">
                              <Clock size={16} /> {formatTime(getCounterTimer(counter))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center opacity-40">
                          <MonitorPlay className="mx-auto mb-2" size={32} />
                          <p className="text-[10px] uppercase tracking-widest font-semibold">Counter Available</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      {counter.status === 'Idle' && (
                        <button onClick={()=>callNext(counter.id)} disabled={waitingTokens.length===0} className="col-span-2 bg-zinc-900 hover:bg-black disabled:bg-zinc-100 disabled:text-zinc-400 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">
                          Call Next Token
                        </button>
                      )}
                      
                      {counter.status === 'Called' && (
                        <>
                          <button onClick={()=>startConsultation(counter.id)} className="col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all mb-2 flex justify-center items-center gap-1">
                            <Play size={14}/> Start Session
                          </button>
                          <button onClick={()=>handleDestructiveAction('skip', counter.id)} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Skip</button>
                          <button onClick={()=>handleDestructiveAction('noshow', counter.id)} className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">No Show</button>
                        </>
                      )}

                      {counter.status === 'Serving' && (
                        <>
                          <button onClick={()=>completeConsultation(counter.id)} className="col-span-2 bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all mb-2 flex justify-center items-center gap-1">
                            <CheckCircle2 size={14}/> Complete
                          </button>
                          <button onClick={()=>pauseConsultation(counter.id)} className="col-span-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-1">
                            <Pause size={14}/> Pause
                          </button>
                        </>
                      )}

                      {counter.status === 'Paused' && (
                        <>
                           <button onClick={()=>resumeConsultation(counter.id)} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all mb-2 flex justify-center items-center gap-1">
                            <Play size={14}/> Resume
                          </button>
                          <button onClick={()=>completeConsultation(counter.id)} className="col-span-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex justify-center items-center gap-1">
                            <CheckCircle2 size={14}/> Complete Anyway
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Queue Table */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-2">
                    <List size={16}/> Live Queue Master
                  </h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-2 text-zinc-400" size={14} />
                    <input type="text" placeholder="Search tokens..." className="bg-white border border-zinc-200 rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 w-48" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 border-b border-zinc-100 text-[10px] uppercase tracking-widest text-zinc-500">
                        <th className="p-4 font-semibold">Token</th>
                        <th className="p-4 font-semibold">Service Type</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Generated</th>
                        <th className="p-4 font-semibold">Wait Time</th>
                        <th className="p-4 font-semibold">Counter</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {queue.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="p-8 text-center text-zinc-400 text-xs uppercase tracking-widest">No tokens generated yet</td>
                        </tr>
                      ) : (
                        [...queue].reverse().map(t => (
                          <tr key={t.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors">
                            <td className="p-4 font-mono font-bold text-zinc-900">{t.id}</td>
                            <td className="p-4 text-xs font-semibold text-amber-700 uppercase">{t.reasonName}</td>
                            <td className="p-4"><StatusBadge status={t.status} /></td>
                            <td className="p-4 text-zinc-500 text-xs font-mono">{t.createdAt.toLocaleTimeString()}</td>
                            <td className="p-4 text-zinc-500 text-xs font-mono">{t.status==='waiting' ? `${Math.floor((new Date() - t.createdAt)/60000)}m` : '-'}</td>
                            <td className="p-4 text-zinc-500 text-xs uppercase font-semibold">{t.counterId ? `C${t.counterId}` : '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-2">
                    <BarChart3 size={16}/> Hourly Footfall (Mock)
                  </h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#71717a'}} dx={-10} />
                        <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="tokens" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-2">
                    <BarChart3 size={16}/> Reason Distribution (Mock)
                  </h2>
                  <div className="h-64 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={reasonData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {reasonData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-light text-zinc-900">100</span>
                      <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-semibold">Total</span>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                    {reasonData.map(r => (
                      <div key={r.name} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-zinc-600">
                        <span className="w-2 h-2 rounded-full" style={{backgroundColor: r.color}}></span> {r.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                 <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-4 flex items-center gap-2">
                    <List size={16}/> Consultation Time Report (Mock)
                  </h2>
                  <p className="text-sm text-zinc-500 mb-4">Detailed analytics table would go here, showing average wait and handle times per agent and service type.</p>
                  <div className="skeleton w-full h-40"></div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
               <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-2">
                  <Activity size={16}/> Recent Activity Log
                </h2>
                <div className="space-y-4">
                  {queue.filter(t => t.status !== 'waiting').reverse().map(t => (
                    <div key={t.id} className="flex gap-4 items-start pb-4 border-b border-zinc-100 last:border-0">
                       <div className="w-2 h-2 mt-1.5 rounded-full bg-zinc-300"></div>
                       <div>
                         <p className="text-sm text-zinc-800"><span className="font-bold font-mono">{t.id}</span> ({t.reasonName}) was marked as <StatusBadge status={t.status} /></p>
                         <p className="text-xs text-zinc-500 font-mono mt-1">Updated at: {(t.completedAt || t.calledAt || t.createdAt).toLocaleTimeString()}</p>
                       </div>
                    </div>
                  ))}
                  {queue.filter(t => t.status !== 'waiting').length === 0 && (
                     <p className="text-sm text-zinc-500 text-center py-10">No recent activity.</p>
                  )}
                </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Admin;
