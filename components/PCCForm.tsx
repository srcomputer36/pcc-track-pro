
import React, { useState, useEffect } from 'react';
import { PCCRecord, DeliveryStatus, ServiceType, BusinessProfile } from '../types';

interface PCCFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (record: Partial<PCCRecord>) => void;
  editingRecord: PCCRecord | null;
  nextSerialNo: number;
  profile: BusinessProfile;
}

const PCCForm: React.FC<PCCFormProps> = ({ isOpen, onClose, onSubmit, editingRecord, nextSerialNo, profile }) => {
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    serialNo: '',
    pccNumber: '',
    customerName: '',
    pccHolderName: '',
    totalAmount: '' as string | number,
    paidAmount: '' as string | number,
    status: DeliveryStatus.PENDING,
    serviceType: ServiceType.NORMAL,
    entryDate: getTodayDate(),
    deliveryDate: '' as string,
    receivedBy: '' as string
  });

  useEffect(() => {
    if (editingRecord && isOpen) {
      setFormData({
        serialNo: editingRecord.serialNo,
        pccNumber: editingRecord.pccNumber,
        customerName: editingRecord.customerName,
        pccHolderName: editingRecord.pccHolderName,
        totalAmount: editingRecord.totalAmount,
        paidAmount: editingRecord.paidAmount,
        status: editingRecord.status,
        serviceType: editingRecord.serviceType,
        entryDate: editingRecord.entryDate,
        deliveryDate: editingRecord.deliveryDate || '',
        receivedBy: editingRecord.receivedBy || ''
      });
    } else if (isOpen) {
      setFormData({
        serialNo: nextSerialNo.toString(),
        pccNumber: '',
        customerName: '',
        pccHolderName: '',
        totalAmount: '', 
        paidAmount: '',
        status: DeliveryStatus.PENDING,
        serviceType: ServiceType.NORMAL,
        entryDate: getTodayDate(),
        deliveryDate: '',
        receivedBy: ''
      });
    }
  }, [editingRecord, isOpen, nextSerialNo]);

  const handlePickContact = async () => {
    try {
      // @ts-ignore
      if (!navigator.contacts || !navigator.contacts.select) {
        alert("Your phone or browser does not support the Contact Picker API.");
        return;
      }
      const props = ['name', 'tel'];
      const opts = { multiple: false };
      // @ts-ignore
      const contacts = await navigator.contacts.select(props, opts);
      if (contacts && contacts.length > 0) {
        const contact = contacts[0];
        const name = (contact.name && contact.name.length > 0) ? contact.name[0] : '';
        const phone = (contact.tel && contact.tel.length > 0) ? contact.tel[0] : '';
        const cleanPhone = phone.replace(/[\s-()]/g, '');
        setFormData(prev => ({ ...prev, customerName: `${name} ${cleanPhone}`.trim() }));
      }
    } catch (err) { console.error('Contact selection failed:', err); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/70 backdrop-blur-md transition-all duration-500">
      <div className="relative glass-effect rounded-t-[2.5rem] md:rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom md:zoom-in duration-300 max-h-[95vh] flex flex-col border border-white/20 dark:border-white/10">
        
        {/* Header Section */}
        <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-white/20 dark:bg-slate-900/60 backdrop-blur-3xl relative">
          <div className="absolute top-0 left-0 w-full h-1 primary-gradient"></div>
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl primary-gradient flex items-center justify-center text-white shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <div>
               <h2 className="text-lg font-black text-slate-800 dark:text-white leading-tight">
                 {editingRecord ? 'Update Entry' : 'New PCC Entry'}
               </h2>
               <p className="text-[8px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5">Registration v4.0</p>
             </div>
          </div>
          <button onClick={onClose} type="button" className="p-2 glass-effect text-slate-500 rounded-full border border-white/10 active:scale-90 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="p-7 md:p-10 overflow-y-auto space-y-6 no-scrollbar pb-36">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Service Class</label>
              <div className="flex p-1 bg-slate-100 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/5">
                <button type="button" onClick={() => setFormData({...formData, serviceType: ServiceType.NORMAL})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.serviceType === ServiceType.NORMAL ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-400 opacity-60'}`}>Normal</button>
                <button type="button" onClick={() => setFormData({...formData, serviceType: ServiceType.URGENT})} className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${formData.serviceType === ServiceType.URGENT ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-400 opacity-60'}`}>Urgent</button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Entry Date</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <input type="date" required className="input-luxury pl-12" value={formData.entryDate} onChange={(e) => setFormData({...formData, entryDate: e.target.value})} />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Passport Number</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                <input type="text" required className="input-luxury pl-12 uppercase font-mono" value={formData.pccNumber} onChange={(e) => setFormData({...formData, pccNumber: e.target.value})} placeholder="P12345678" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Full Name</label>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <input type="text" required className="input-luxury pl-12" value={formData.pccHolderName} onChange={(e) => setFormData({...formData, pccHolderName: e.target.value})} placeholder="Enter name" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Reference & Mobile</label>
              <button type="button" onClick={handlePickContact} className="text-[9px] font-black text-emerald-600 uppercase tracking-tight flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" strokeWidth="3"/></svg> Pick
              </button>
            </div>
            <div className="relative">
               <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
               <input type="text" className="input-luxury pl-12" value={formData.customerName} onChange={(e) => setFormData({...formData, customerName: e.target.value})} placeholder="Mobile/Reference" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-500/5 dark:bg-black/20 rounded-2xl border border-emerald-500/10">
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest px-1">Fee</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">৳</span>
                <input type="number" required className="input-luxury !bg-white/50 dark:!bg-slate-900/50 !pl-8" value={formData.totalAmount} onChange={(e) => setFormData({...formData, totalAmount: e.target.value})} placeholder="0" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest px-1">Paid</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs">৳</span>
                <input type="number" required className="input-luxury !bg-white/50 dark:!bg-slate-900/50 !pl-8" value={formData.paidAmount} onChange={(e) => setFormData({...formData, paidAmount: e.target.value})} placeholder="0" />
              </div>
            </div>
          </div>

          {/* Compact Save Button Positioned Higher */}
          <div className="fixed bottom-6 left-0 right-0 px-8 md:relative md:bottom-0 md:px-0">
            <button 
              type="submit" 
              className="w-full py-3.5 primary-gradient rounded-xl text-white font-black uppercase tracking-[0.15em] text-[11px] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7" /></svg>
              {editingRecord ? 'Update Now' : 'Save Information'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .input-luxury {
          width: 100%;
          padding: 0.9rem 1.25rem;
          border-radius: 1rem;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: rgba(0, 0, 0, 0.03);
          color: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          outline: none;
          transition: all 0.2s ease;
        }
        .dark .input-luxury {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.08);
        }
        .input-luxury:focus {
          background: white;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .dark .input-luxury:focus {
          background: #0f172a;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
        }
        .pl-12 { padding-left: 3.25rem !important; }
      `}</style>
    </div>
  );
};

export default PCCForm;
