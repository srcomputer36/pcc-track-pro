import React from 'react';
import { DashboardStats, DeliveryStatus } from '../types';

interface SummaryCardsProps {
  stats: DashboardStats;
  onFilterClick: (filter: DeliveryStatus | 'ALL' | 'DUE') => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stats, onFilterClick }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 0 }).format(amount).replace('BDT', '৳');
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Today's Activity Summary - Side-by-Side & Compact */}
      <div className="relative glass-effect rounded-[2rem] p-4 sm:p-6 border border-white/20 shadow-xl overflow-hidden group">
        <div className="absolute top-0 right-0 -m-4 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full"></div>
        
        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            
            {/* New Today Card */}
            <div className="flex items-center gap-3 bg-emerald-500/5 dark:bg-emerald-500/10 px-4 py-3 rounded-2xl border border-emerald-500/10 transition-transform hover:scale-105 active:scale-95">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)] flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">New Today</p>
                <p className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 truncate">{stats.todayEntries} Files</p>
              </div>
            </div>
            
            {/* Delivered Today Card */}
            <div className="flex items-center gap-3 bg-blue-500/5 dark:bg-blue-500/10 px-4 py-3 rounded-2xl border border-blue-500/10 transition-transform hover:scale-105 active:scale-95">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] flex-shrink-0"></div>
              <div className="min-w-0">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Delivered</p>
                <p className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400 truncate">{stats.todayDeliveries} Completed</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        <StatTile 
          label="Total Entries" 
          value={stats.totalRecords.toLocaleString()} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          color="emerald"
          onClick={() => onFilterClick('ALL')}
        />
        <StatTile 
          label="Balance Due" 
          value={formatCurrency(stats.totalDueAmount)} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="rose"
          onClick={() => onFilterClick('DUE')}
          isCurrency
        />
        <StatTile 
          label="Pending Items" 
          value={stats.totalPending.toString()} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="orange"
          onClick={() => onFilterClick(DeliveryStatus.PENDING)}
        />
        <StatTile 
          label="Completed" 
          value={stats.totalDelivered.toString()} 
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          color="blue"
          onClick={() => onFilterClick(DeliveryStatus.DELIVERED)}
        />
      </div>

      <div className="flex items-center gap-4 py-2 px-2">
        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
        <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em]">System Integrity Secured</span>
        <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
      </div>
    </div>
  );
};

interface StatTileProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: 'emerald' | 'rose' | 'orange' | 'blue';
  onClick: () => void;
  isCurrency?: boolean;
}

const StatTile: React.FC<StatTileProps> = ({ label, value, icon, color, onClick, isCurrency }) => {
  const colorMap = {
    emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/5',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-orange-500/5',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5'
  };

  // Improved detection of zero balance for currency display
  const isZeroCurrency = isCurrency && (value.trim() === '৳0' || value.trim() === '৳ 0');

  return (
    <button 
      onClick={onClick}
      className={`relative glass-effect rounded-[1.5rem] p-4 flex flex-col justify-between text-left hover:scale-[1.02] active:scale-95 transition-all duration-300 border h-36 group overflow-hidden ${colorMap[color]}`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110 ${colorMap[color]} bg-white dark:bg-slate-900 border-none shadow-md`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <h3 className={`text-lg font-black tracking-tight dark:text-white truncate ${isCurrency ? (isZeroCurrency ? 'text-emerald-500' : 'text-rose-500') : 'text-slate-800'}`}>
          {value}
        </h3>
      </div>
      <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-5 group-hover:scale-150 transition-transform duration-700">
        {icon}
      </div>
    </button>
  );
};

export default SummaryCards;