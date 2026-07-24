import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueue } from '../../context/QueueContext';
import { RefreshCcw, UserPlus, Home as HomeIcon, Wrench, CreditCard, FileText, HelpCircle, ChevronLeft } from 'lucide-react';
import TokenPrintModal from '../../components/TokenPrintModal';
import SmsPromptModal from '../../components/SmsPromptModal';

const REASONS = [
  { id: 'renewal', code: 'RN', name: 'Renewal', icon: RefreshCcw },
  { id: 'new_enquiry', code: 'NE', name: 'New Enquiry', icon: UserPlus },
  { id: 'property_viewing', code: 'PV', name: 'Property Viewing', icon: HomeIcon },
  { id: 'maintenance', code: 'MT', name: 'Maintenance', icon: Wrench },
  { id: 'payment', code: 'PY', name: 'Payment / Account', icon: CreditCard },
  { id: 'document', code: 'DC', name: 'Document Collection', icon: FileText },
  { id: 'other', code: 'OT', name: 'Other Query', icon: HelpCircle },
];

const Kiosk = () => {
  const navigate = useNavigate();
  const { generateToken, queue } = useQueue();
  const [pendingToken, setPendingToken] = useState(null);
  const [showSmsPrompt, setShowSmsPrompt] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const waitingCount = queue.filter(t => t.status === 'waiting').length;

  const handleSelectReason = (reason) => {
    const token = generateToken(reason.code, reason.name);
    setPendingToken(token);
    setShowSmsPrompt(true);
  };

  const handleSmsComplete = () => {
    setShowSmsPrompt(false);
    setShowReceipt(true);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setPendingToken(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col relative overflow-hidden font-sans">
      {/* Premium ambient glow */}
      <div className="absolute top-[-25%] left-[-15%] w-[800px] h-[800px] bg-amber-100 rounded-full mix-blend-multiply filter blur-[150px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-sky-50 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 pointer-events-none"></div>

      {/* Header */}
      <header className="p-8 flex items-center justify-between z-10 animate-fade-in">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-zinc-400 hover:text-amber-600 transition-colors uppercase tracking-widest text-[10px] font-bold px-4 py-2"
        >
          <ChevronLeft size={16} />
          <span>Exit Kiosk</span>
        </button>
        <div className="text-xl font-bold tracking-[0.2em] text-zinc-800 uppercase flex items-center gap-4">
          <span>AVISON <span className="text-amber-600 font-light">YOUNG</span></span>
          <div className="h-4 w-px bg-zinc-300"></div>
          <span className="text-[10px] text-zinc-400 font-semibold tracking-widest">{waitingCount} Waiting</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16 animate-slide-up">
          <h1 className="text-4xl sm:text-6xl font-light mb-6 tracking-tight text-zinc-900 drop-shadow-sm">
            Welcome to the Gallery
          </h1>
          <p className="text-lg sm:text-xl text-zinc-500 font-light tracking-wide max-w-2xl mx-auto">
            Please select the nature of your visit, and an associate will attend to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-4 sm:px-0">
          {REASONS.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <button
                key={reason.id}
                onClick={() => handleSelectReason(reason)}
                className="group relative flex flex-col items-center p-10 bg-white/80 backdrop-blur-md shadow-sm border border-zinc-200/80 rounded-2xl hover:bg-white hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-6 text-zinc-400 group-hover:text-amber-600 transition-colors duration-500 group-hover:scale-110 transform relative z-10">
                  <Icon size={38} strokeWidth={1.5} />
                </div>
                <h3 className="text-[13px] uppercase tracking-widest font-semibold text-zinc-600 group-hover:text-amber-700 transition-colors duration-500 text-center relative z-10">
                  {reason.name}
                </h3>
              </button>
            )
          })}
        </div>
      </main>

      {showSmsPrompt && (
        <SmsPromptModal onComplete={handleSmsComplete} />
      )}

      {showReceipt && pendingToken && (
        <TokenPrintModal token={pendingToken} onClose={handleCloseReceipt} />
      )}
    </div>
  );
};

export default Kiosk;
