
import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  shopName: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, shopName }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      {/* Executive Header */}
      <header className="sticky top-0 z-[100] w-full glass-effect px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 border border-white/30 transform transition-transform hover:scale-105 active:scale-95">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] leading-none mb-1.5">{getGreeting()}</p>
              <h1 className="text-xl font-black text-slate-800 dark:text-white leading-none tracking-tight truncate max-w-[180px]">{shopName}</h1>
            </div>
          </div>
          
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
            <p className="text-lg font-black text-slate-800 dark:text-white font-mono leading-none mt-0.5">{time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-8 pb-48">
        {children}
      </main>

      {/* Fixed Symmetrical Navigation Bar - 4 Slots */}
      <div className="fixed bottom-8 left-0 right-0 z-[150] px-4 flex justify-center animate-slide-up pointer-events-none">
        <nav className="glass-effect !bg-white/70 dark:!bg-slate-900/70 rounded-[2.5rem] p-2 grid grid-cols-4 items-center w-full max-w-lg shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-white/50 dark:border-white/10 pointer-events-auto">
          
          <MobileNavItem 
            active={activeTab === 'home'} 
            onClick={() => setActiveTab('home')} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>} 
            label="Home" 
          />

          {/* Central Entry Button */}
          <div className="relative flex flex-col items-center justify-center h-full">
            <button 
              onClick={() => setActiveTab('add')}
              className="absolute -top-10 w-14 h-14 rounded-[1.5rem] primary-gradient flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-900 transform transition-all duration-300 hover:scale-110 active:scale-90 group"
            >
              <svg className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </button>
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-8">Entry</span>
          </div>

          <MobileNavItem 
            active={activeTab === 'records'} 
            onClick={() => setActiveTab('records')} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} 
            label="Records" 
          />

          <MobileNavItem 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>} 
            label="Settings" 
          />
        </nav>
      </div>
    </div>
  );
};

const MobileNavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick} 
    className="flex flex-col items-center justify-center py-2 px-1 relative outline-none transition-all duration-300 w-full"
  >
    <div className={`
      flex flex-col items-center justify-center transition-all duration-500
      ${active ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-400 dark:text-slate-500 opacity-60 hover:opacity-100'}
    `}>
      <div className="mb-0.5">{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
      {active && (
        <div className="absolute -bottom-1 w-5 h-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
      )}
    </div>
  </button>
);

export default Layout;
