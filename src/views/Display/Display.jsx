import React, { useEffect, useState, useRef } from 'react';
import { useQueue } from '../../context/QueueContext';
import { Clock, MonitorPlay, ChevronLeft, Sparkles, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const playChime = () => {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // High note (G5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, audioCtx.currentTime); 
    gain1.gain.setValueAtTime(0, audioCtx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start();
    osc1.stop(audioCtx.currentTime + 1.2);

    // Low note (C5)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(523.25, audioCtx.currentTime + 0.25); 
    gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.25);
    gain2.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.3);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.0);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(audioCtx.currentTime + 0.25);
    osc2.stop(audioCtx.currentTime + 2.0);
  } catch (e) {
    console.warn("Audio playback prevented by browser policy.");
  }
};

const Display = () => {
  const { queue, counters } = useQueue();
  const [time, setTime] = useState(new Date());
  const navigate = useNavigate();
  const previousCalledState = useRef({});

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Chime Logic
  useEffect(() => {
    let played = false;
    counters.forEach(counter => {
      const wasCalled = previousCalledState.current[counter.id];
      const isCalled = counter.status === 'Called';
      
      if (isCalled && !wasCalled) {
        if (!played) {
          playChime();
          played = true; // Only play once if multiple happen simultaneously
        }
      }
      previousCalledState.current[counter.id] = isCalled;
    });
  }, [counters]);

  const waitingTokens = queue.filter(t => t.status === 'waiting')
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, 5); // Next 5

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col overflow-hidden relative selection:bg-amber-500/30">
      
      {/* Premium Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] bg-amber-600/10 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse-slow"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[120px] opacity-30"></div>
        <div className="absolute top-[20%] left-[40%] w-[40%] h-[40%] bg-emerald-600/5 rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-amber-400 transition-colors uppercase tracking-widest text-[10px] font-bold px-4 py-2 z-50 animate-fade-in group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span>Exit Display</span>
      </button>

      {/* Header */}
      <header className="p-8 px-16 flex items-center justify-between z-10 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="flex items-center gap-6 pl-24">
          <div className="relative">
             <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20"></div>
             <MonitorPlay size={44} className="text-amber-400 relative z-10" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.25em] uppercase text-white drop-shadow-md">
              Elysium <span className="text-amber-400 font-light">Estates</span>
            </h1>
            <p className="text-zinc-400 text-[10px] tracking-[0.2em] uppercase mt-1.5 flex items-center gap-2">
              <Sparkles size={12} className="text-amber-500/70" /> Please wait for your token to be called
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-4xl font-light tracking-[0.1em] font-mono text-white drop-shadow-lg">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-amber-400/80 text-[10px] tracking-[0.2em] uppercase mt-1.5 font-semibold">
            {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex p-10 xl:p-14 gap-10 xl:gap-14 z-10">
        
        {/* Active Counters (Left 2/3) */}
        <div className="flex-[2] flex flex-col gap-6">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-500 mb-2 pl-2">Currently Serving</h2>
          <div className="grid grid-cols-1 gap-6 flex-1">
            {counters.map(counter => {
              const isActive = counter.currentToken && (counter.status === 'Called' || counter.status === 'Serving');
              const isJustCalled = counter.status === 'Called';
              
              return (
                <div key={counter.id} className={`flex-1 rounded-[2rem] border flex items-center justify-between p-10 xl:p-12 transition-all duration-700 relative overflow-hidden group ${isActive ? (isJustCalled ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_80px_rgba(245,158,11,0.15)] scale-[1.02]' : 'bg-white/5 border-white/10 backdrop-blur-xl shadow-2xl') : 'bg-white/[0.02] border-white/5 opacity-60 backdrop-blur-sm'}`}>
                  
                  {isActive && isJustCalled && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-50 animate-pulse"></div>}

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className={`text-xs uppercase tracking-[0.4em] font-bold ${isActive && isJustCalled ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-400 transition-colors'}`}>{counter.name}</h3>
                      {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse"></span>}
                    </div>
                    {isActive ? (
                      <div>
                        <p className={`text-7xl xl:text-8xl font-black tracking-tight font-mono mb-2 drop-shadow-2xl ${isJustCalled ? 'text-white' : 'text-zinc-100'}`}>
                          {counter.currentToken.id}
                        </p>
                        <p className={`text-sm uppercase tracking-[0.2em] font-semibold ${isJustCalled ? 'text-amber-400' : 'text-amber-500/80'}`}>
                          {counter.currentToken.reasonName}
                        </p>
                      </div>
                    ) : (
                      <p className="text-4xl font-extralight text-zinc-700 tracking-widest mt-4">Available</p>
                    )}
                  </div>

                  {isActive && isJustCalled && (
                    <div className="relative z-10 flex flex-col items-center justify-center bg-amber-500 text-zinc-950 rounded-full w-40 h-40 xl:w-48 xl:h-48 animate-bounce shadow-[0_20px_50px_rgba(245,158,11,0.4)] border-4 border-amber-300">
                      <span className="text-[10px] xl:text-xs font-bold tracking-[0.2em] uppercase mb-1 opacity-80">Proceed To</span>
                      <span className="text-5xl xl:text-6xl font-black tracking-tighter">{counter.id}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Up Next (Right 1/3) */}
        <div className="flex-[1] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 xl:p-10 flex flex-col shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-[80px]"></div>

          <div className="flex items-center justify-between mb-10 relative z-10">
             <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
              Up Next
             </h2>
             <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full">
               <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
               <span className="text-amber-400 text-[10px] font-bold tracking-widest uppercase">{queue.filter(t=>t.status === 'waiting').length} Waiting</span>
             </div>
          </div>
          
          <div className="flex-1 flex flex-col gap-4 relative z-10">
            {waitingTokens.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                <Clock size={64} strokeWidth={1} className="text-zinc-600 mb-6" />
                <p className="text-zinc-500 tracking-[0.2em] uppercase text-xs font-semibold">No Waiting Tokens</p>
              </div>
            ) : (
              waitingTokens.map((token, idx) => (
                <div key={token.id} className="bg-black/20 border border-white/5 rounded-3xl p-6 xl:p-8 flex justify-between items-center hover:bg-white/5 hover:border-white/10 transition-all duration-300 group">
                  <div>
                    <p className="text-3xl xl:text-4xl font-bold font-mono text-zinc-200 mb-2 group-hover:text-white transition-colors">{token.id}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500/70 font-semibold group-hover:text-amber-400 transition-colors">{token.reasonName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 mb-1 font-semibold">Wait</p>
                    <p className="text-zinc-300 font-mono text-base xl:text-lg">{Math.floor((new Date() - token.createdAt)/60000)}m</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

    </div>
  );
};

export default Display;
