import React, { useEffect, useState } from 'react';
import { CheckCircle2, Printer } from 'lucide-react';
import { useQueue } from '../context/QueueContext';

const TokenPrintModal = ({ token, onClose }) => {
  const [isPrinting, setIsPrinting] = useState(true);
  const [countdown, setCountdown] = useState(8);
  const { queue } = useQueue();

  const waitingTokens = queue.filter(t => t.status === 'waiting');
  const index = waitingTokens.findIndex(t => t.id === token.id);
  const queuePosition = index !== -1 ? index + 1 : waitingTokens.length;
  const estWaitMins = Math.max((queuePosition - 1) * 5, 2);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPrinting(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let int;
    if (!isPrinting) {
      int = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(int);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(int);
  }, [isPrinting, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative flex flex-col items-center mt-[-100px]">
        {/* Printer slot effect */}
        <div className="w-80 h-10 bg-zinc-800 rounded-t-xl z-20 receipt-slot flex items-center justify-center border-x-4 border-t-4 border-zinc-900 shadow-xl">
          <div className="w-16 h-1 bg-amber-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
        </div>

        {/* Receipt (slides down) */}
        <div className={`bg-white shadow-2xl w-[320px] overflow-hidden -mt-2 z-10 transition-all duration-1000 origin-top rounded-b-xl border-x border-b border-zinc-300 ${isPrinting ? 'h-0 opacity-0' : 'h-[500px] opacity-100'}`}>
          <div className="bg-zinc-50 p-5 text-center border-b border-zinc-200">
            <div className="text-zinc-800 font-bold tracking-[0.2em] text-xs uppercase">
              Elysium <span className="text-amber-600 font-light">Estates</span>
            </div>
          </div>

          <div className="p-8 text-center flex flex-col items-center">
            <div className="mb-4">
              <CheckCircle2 size={42} strokeWidth={1.5} className="text-emerald-500 mx-auto drop-shadow-sm" />
            </div>
            <p className="text-zinc-500 mb-2 uppercase tracking-[0.15em] text-[10px] font-semibold">Your Token</p>
            <h2 className="text-5xl font-bold text-zinc-900 mb-2 font-mono tracking-tight">{token.id}</h2>
            <p className="text-[10px] text-amber-700 font-bold mb-6 tracking-widest uppercase bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">{token.reasonName}</p>

            {/* Mock Barcode */}
            <div className="w-full flex justify-center mb-6 opacity-60">
              <div className="w-4/5 h-10 flex gap-1 justify-center items-end">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className={`bg-zinc-800 ${i % 3 === 0 ? 'w-2 h-10' : i % 2 === 0 ? 'w-[3px] h-8' : 'w-[2px] h-9'}`}></div>
                ))}
              </div>
            </div>

            <div className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-4 mb-6 shadow-inner">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Queue Position</span>
                <span className="text-sm font-bold text-zinc-900">#{queuePosition}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Est. Wait Time</span>
                <span className="text-sm font-bold text-zinc-900">~{estWaitMins} mins</span>
              </div>
            </div>

            <div className="w-full border-t border-dashed border-zinc-300 pt-5 mb-6 flex justify-between px-2">
              <div className="text-left">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1 font-semibold">Date</p>
                <p className="text-[11px] text-zinc-800 font-bold font-mono">{token.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1 font-semibold">Time</p>
                <p className="text-[11px] text-zinc-800 font-bold font-mono">{token.createdAt.toLocaleTimeString()}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white uppercase tracking-widest text-[10px] font-semibold py-3.5 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              Take Receipt <span className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center font-mono">{countdown}</span>
            </button>
          </div>
        </div>

        {/* Loading overlay if printing */}
        {isPrinting && (
          <div className="absolute top-24 flex flex-col items-center">
            <Printer className="text-white/80 mb-4 animate-bounce" size={48} strokeWidth={1} />
            <p className="text-white/90 font-semibold tracking-[0.2em] text-sm uppercase animate-pulse">Printing...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenPrintModal;
