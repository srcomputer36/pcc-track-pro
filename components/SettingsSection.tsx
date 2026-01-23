
import React, { useRef, useState } from 'react';
import { PCCRecord, BusinessProfile } from '../types';
import { exportToExcel, parseExcelFile } from '../services/export';

interface SettingsSectionProps {
  isOpen: boolean;
  onClose: () => void;
  records: PCCRecord[];
  onDataRestore: (records: PCCRecord[]) => void;
  profile: BusinessProfile;
  onProfileUpdate: (profile: BusinessProfile) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  isOpen, onClose, records, onDataRestore, profile, onProfileUpdate, isDarkMode, toggleDarkMode 
}) => {
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);
  const excelInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <div className="relative glass-effect rounded-[3rem] w-full max-w-sm p-8 overflow-hidden animate-slide-up border border-white/20 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
          <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Settings</h2>
          <button onClick={onClose} className="p-2 glass-effect rounded-full text-slate-400 hover:text-rose-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>

        <div className="space-y-5 overflow-y-auto no-scrollbar pb-6 flex-1">
          <div className="p-5 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 flex items-center justify-between shadow-inner">
            <div className="min-w-0 pr-4">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Business Profile</p>
              <p className="font-bold dark:text-white truncate text-lg">{profile.shopName}</p>
              <p className="text-[10px] text-slate-500 truncate font-mono">{profile.phone}</p>
            </div>
            <button onClick={() => setShowProfileEdit(true)} className="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0 active:scale-90 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="3" /></svg></button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button onClick={() => exportToExcel(records)} className="p-4 bg-indigo-600 text-white rounded-[1.5rem] text-center shadow-lg active:scale-95 transition-all"><p className="text-[10px] font-black uppercase tracking-widest">Backup (Excel)</p></button>
             <button onClick={() => excelInputRef.current?.click()} className="p-4 bg-slate-800 text-white rounded-[1.5rem] text-center shadow-lg active:scale-95 transition-all"><p className="text-[10px] font-black uppercase tracking-widest">Restore Data</p></button>
          </div>

          <button onClick={toggleDarkMode} className="w-full p-4 glass-effect border border-white/10 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest text-slate-500 flex items-center justify-center gap-2">
            {isDarkMode ? <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" /></svg>Light Mode</> : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>Dark Mode</>}
          </button>

          <div className="relative mt-8 group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 blur-2xl rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative p-8 bg-white/5 dark:bg-slate-900/60 border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl ring-1 ring-inset ring-white/10">
              <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-[shimmer_3s_infinite] transition-transform"></div>
              <div className="relative z-10">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center border-2 border-white/10">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2 drop-shadow-sm">Crafted By</p>
                  <div className="flex items-center gap-2 mb-6">
                    <h4 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">AHMED SHAMIM</h4>
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                      <svg fill="currentColor" viewBox="0 0 20 20" className="w-3 h-3"><path d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-center gap-6 pt-5 border-t border-white/5">
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Build</p>
                      <p className="text-[10px] font-bold text-slate-800 dark:text-slate-200">v3.5.2-PRO</p>
                    </div>
                    <div className="w-px h-6 bg-white/10"></div>
                    <div className="text-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Security</p>
                      <p className="text-[10px] font-bold text-emerald-500 uppercase">Verified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <input type="file" ref={excelInputRef} className="hidden" accept=".xlsx" onChange={async e => {
          const file = e.target.files?.[0];
          if(file) {
            const data = await parseExcelFile(file);
            if(confirm(`Found ${data.length} records. Import now?`)) onDataRestore([...data, ...records]);
          }
        }} />

        {showProfileEdit && (
          <div className="absolute inset-0 bg-white dark:bg-slate-900 z-50 p-8 flex flex-col justify-center animate-in slide-in-from-right">
            <h3 className="text-xl font-black uppercase mb-8 text-center tracking-tighter">Edit Profile</h3>
            <div className="space-y-4">
              <input className="w-full p-4 bg-slate-100 dark:bg-black/40 border-none rounded-2xl font-bold outline-none" value={tempProfile.shopName} onChange={e => setTempProfile({...tempProfile, shopName: e.target.value})} placeholder="Shop Name" />
              <input className="w-full p-4 bg-slate-100 dark:bg-black/40 border-none rounded-2xl font-bold outline-none" value={tempProfile.phone} onChange={e => setTempProfile({...tempProfile, phone: e.target.value})} placeholder="Phone Number" />
              <div className="flex gap-3 pt-8">
                <button onClick={() => setShowProfileEdit(false)} className="flex-1 p-5 glass-effect rounded-2xl font-black text-[11px] uppercase">Cancel</button>
                <button onClick={() => { onProfileUpdate(tempProfile); setShowProfileEdit(false); }} className="flex-1 p-5 bg-emerald-500 text-white rounded-2xl font-black text-[11px] uppercase shadow-xl">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SettingsSection;
