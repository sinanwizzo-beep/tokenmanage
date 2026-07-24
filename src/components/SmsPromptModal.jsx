import React, { useState } from 'react';
import { Smartphone, ArrowRight, X } from 'lucide-react';

const SmsPromptModal = ({ onComplete }) => {
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-[400px] overflow-hidden animate-scale-in relative border border-zinc-200">
        
        {/* Skip Button */}
        {!success && (
          <button onClick={onComplete} className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-widest text-[10px] font-bold flex items-center gap-1 z-10">
            Skip <X size={14} />
          </button>
        )}

        <div className="p-10 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${success ? 'bg-emerald-100 text-emerald-600 scale-110' : 'bg-amber-100 text-amber-600'}`}>
            <Smartphone size={32} />
          </div>
          
          {success ? (
             <div className="animate-slide-up">
               <h3 className="text-2xl font-light text-zinc-900 mb-2">Number Confirmed</h3>
               <p className="text-zinc-500 text-sm font-medium">We'll text you when it's your turn.</p>
             </div>
          ) : (
             <div className="w-full">
               <h3 className="text-2xl font-light text-zinc-900 mb-2">Want a text alert?</h3>
               <p className="text-zinc-500 text-sm font-medium mb-8">Enter your number to receive an SMS when your counter is ready.</p>
               
               <form onSubmit={handleSubmit} className="w-full space-y-4">
                 <input 
                   type="tel"
                   required
                   placeholder="+1 (555) 000-0000"
                   value={phone}
                   onChange={e => setPhone(e.target.value)}
                   className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-4 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-zinc-900"
                 />
                 <button 
                   type="submit"
                   disabled={isSubmitting || phone.length < 5}
                   className="w-full bg-zinc-900 hover:bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:active:scale-100 active:scale-95"
                 >
                   {isSubmitting ? 'Confirming...' : 'Notify Me'} <ArrowRight size={16} />
                 </button>
               </form>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmsPromptModal;
