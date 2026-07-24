import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, ChevronLeft, Loader2 } from 'lucide-react';
import { useQueue } from '../../context/QueueContext';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useQueue();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay for demo purposes
    setTimeout(() => {
      addToast('Authentication Successful', 'Welcome back to the Agent Dashboard.', 'success');
      navigate('/admin');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-25%] left-[-15%] w-[800px] h-[800px] bg-amber-100 rounded-full mix-blend-multiply filter blur-[150px] opacity-60 pointer-events-none"></div>
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-400 hover:text-amber-600 transition-colors uppercase tracking-widest text-[10px] font-bold px-4 py-2 z-10 animate-fade-in"
      >
        <ChevronLeft size={16} />
        <span>Back to Home</span>
      </button>

      <div className="w-full max-w-md z-10 animate-slide-up">
        <div className="text-center mb-10">
          <div className="text-2xl font-bold tracking-[0.2em] uppercase text-zinc-900 drop-shadow-sm mb-6 flex justify-center w-full">
            AVISON <span className="text-amber-600 font-light">YOUNG</span>
          </div>
          <h1 className="text-3xl font-light text-zinc-800 mb-2 tracking-tight drop-shadow-sm">Agent Portal</h1>
          <p className="text-zinc-500 font-light tracking-wide text-sm">Sign in to manage the token queue.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-sm border border-zinc-200/80">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                <input 
                  type="email" 
                  defaultValue="agent@avisonyoung.com"
                  required
                  className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                 <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Password</label>
                 <a href="#" className="text-[10px] text-amber-600 hover:text-amber-700 font-semibold uppercase tracking-widest" onClick={(e)=>e.preventDefault()}>Forgot?</a>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 text-zinc-400" size={18} />
                <input 
                  type="password" 
                  defaultValue="••••••••"
                  required
                  className="w-full bg-zinc-50/50 border border-zinc-200 text-zinc-900 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium font-mono tracking-widest text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-zinc-300 text-amber-600 focus:ring-amber-500 focus:ring-2 accent-amber-600" defaultChecked />
              <label htmlFor="remember" className="text-xs text-zinc-500 font-medium cursor-pointer">Remember me on this device</label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-zinc-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:active:scale-100 mt-2"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={16} /> Authenticating...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
