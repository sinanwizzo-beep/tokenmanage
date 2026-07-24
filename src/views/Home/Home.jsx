import React from 'react';
import { Link } from 'react-router-dom';
import { MonitorSmartphone, LayoutDashboard, MonitorPlay } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-white">
      {/* Premium Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity grayscale-[30%]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop')" }}
      ></div>
      {/* Light gradient overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-zinc-50/95 z-0"></div>

      {/* Premium ambient glow */}
      <div className="absolute top-[-25%] left-[-15%] w-[800px] h-[800px] bg-amber-200/40 rounded-full mix-blend-multiply filter blur-[150px] pointer-events-none z-0"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 z-10">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-16 animate-slide-up">
            <div className="text-xl font-bold tracking-[0.2em] text-zinc-900 uppercase mb-4">
              AVISON <span className="text-amber-600 font-light">YOUNG</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-light text-zinc-800 mb-4 tracking-tight drop-shadow-sm">Client Queue Portal</h1>
            <p className="text-zinc-500 text-lg font-light tracking-wide">Interactive Premium Prototype</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>

            <Link to="/kiosk" className="group flex flex-col items-center p-10 bg-white/80 backdrop-blur-sm shadow-sm border border-zinc-200/60 rounded-2xl hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-6 text-zinc-400 group-hover:text-amber-600 transition-colors duration-500 transform group-hover:scale-110">
                <MonitorSmartphone size={42} strokeWidth={1.5} />
              </div>
              <h2 className="text-base uppercase tracking-widest font-semibold text-zinc-800 mb-3 group-hover:text-amber-600 transition-colors">Customer</h2>
              <p className="text-zinc-500 text-center text-xs font-medium leading-relaxed">Self-service tablet interface for walk-in customers to register and receive a token.</p>
            </Link>

            <Link to="/display" className="group flex flex-col items-center p-10 bg-white/80 backdrop-blur-sm shadow-sm border border-zinc-200/60 rounded-2xl hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-6 text-zinc-400 group-hover:text-amber-600 transition-colors duration-500 transform group-hover:scale-110">
                <MonitorPlay size={42} strokeWidth={1.5} />
              </div>
              <h2 className="text-base uppercase tracking-widest font-semibold text-zinc-800 mb-3 group-hover:text-amber-600 transition-colors">Waiting Area Display</h2>
              <p className="text-zinc-500 text-center text-xs font-medium leading-relaxed">Large screen TV view to show customers which tokens are being served.</p>
            </Link>

            <Link to="/admin" className="group flex flex-col items-center p-10 bg-white/80 backdrop-blur-sm shadow-sm border border-zinc-200/60 rounded-2xl hover:shadow-xl hover:border-amber-400/50 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-6 text-zinc-400 group-hover:text-amber-600 transition-colors duration-500 transform group-hover:scale-110">
                <LayoutDashboard size={42} strokeWidth={1.5} />
              </div>
              <h2 className="text-base uppercase tracking-widest font-semibold text-zinc-800 mb-3 group-hover:text-amber-600 transition-colors">Agent Dashboard</h2>
              <p className="text-zinc-500 text-center text-xs font-medium leading-relaxed">Desktop control center for staff to manage the queue and track consultation times.</p>
            </Link>

          </div>
        </div>
      </div>

      <footer className="py-6 text-center z-10 border-t border-zinc-200/60 bg-white/50 backdrop-blur-sm">
        <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
          Avison Young v2.0 &bull; Client Demo
        </p>
      </footer>
    </div>
  );
};

export default Home;
