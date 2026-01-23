import React, { useState, useMemo } from 'react';
import { PCCRecord, DeliveryStatus, BusinessProfile } from '../types';
import { printInvoice, printMultipleInvoices } from '../services/export';

interface PCCTableProps {
  records: PCCRecord[];
  profile: BusinessProfile;
  onEdit: (record: PCCRecord) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onStatusUpdate: (id: string, status: DeliveryStatus, clearDue: boolean, receivedBy: string, deliveryDate?: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  statusFilter: DeliveryStatus | 'ALL' | 'DUE';
  setStatusFilter: (filter: DeliveryStatus | 'ALL' | 'DUE') => void;
}

const PCCTable: React.FC<PCCTableProps> = ({ 
  records, profile, onEdit, onDelete, onAddNew, onStatusUpdate, searchTerm, setSearchTerm, statusFilter, setStatusFilter 
}) => {
  const [deliveryModalRecord, setDeliveryModalRecord] = useState<PCCRecord | null>(null);
  const [receiverName, setReceiverName] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDuePaid, setIsDuePaid] = useState(true);
  const [dateType, setDateType] = useState<'ENTRY' | 'DELIVERY'>('ENTRY');
  const [dateValue, setDateValue] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredRecords = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    return records.filter(record => {
      // Security Patch: Added optional chaining and fallback to empty string to prevent crashes
      const matchesSearch = !search || (
        (record.pccNumber?.toLowerCase() || "").includes(search) ||
        (record.customerName?.toLowerCase() || "").includes(search) ||
        (record.pccHolderName?.toLowerCase() || "").includes(search) ||
        (record.serialNo?.toString() || "").includes(search)
      );
      
      const matchesStatus = (statusFilter === 'ALL' || statusFilter === 'DUE') ? true : record.status === statusFilter;
      const matchesDue = statusFilter === 'DUE' ? record.dueAmount > 0 : true;
      
      let matchesDate = true;
      if (dateValue) {
        if (dateType === 'ENTRY') {
          matchesDate = record.entryDate === dateValue;
        } else {
          matchesDate = record.deliveryDate === dateValue;
        }
      }

      return matchesSearch && matchesStatus && matchesDue && matchesDate;
    });
  }, [records, searchTerm, statusFilter, dateType, dateValue]);

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (filteredRecords.length === 0) return;
    const allFilteredSelected = filteredRecords.every(r => selectedIds.has(r.id));
    const newSelected = new Set(selectedIds);
    if (allFilteredSelected) {
      filteredRecords.forEach(r => newSelected.delete(r.id));
    } else {
      filteredRecords.forEach(r => newSelected.add(r.id));
    }
    setSelectedIds(newSelected);
  };

  const handleBulkPrint = () => {
    const selectedRecords = records.filter(r => selectedIds.has(r.id));
    if (selectedRecords.length === 0) return;
    printMultipleInvoices(selectedRecords);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-GB');
    } catch {
      return dateStr;
    }
  };

  const isAllSelected = filteredRecords.length > 0 && filteredRecords.every(r => selectedIds.has(r.id));

  return (
    <div className="space-y-3 pb-24">
      {/* Selection Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-[94%] max-w-sm animate-in slide-in-from-top-5">
          <div className="bg-slate-900/95 dark:bg-emerald-900/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center justify-between shadow-2xl border border-white/10 ring-1 ring-emerald-500/20">
            <div className="flex items-center gap-3 pl-2">
              <button onClick={() => setSelectedIds(new Set())} className="text-white/40 hover:text-white transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg></button>
              <div>
                <p className="text-white font-black text-[9px] uppercase tracking-widest leading-none">{selectedIds.size} Selected</p>
                <p className="text-emerald-400 font-bold text-[7px] uppercase mt-0.5">Print Batch Report</p>
              </div>
            </div>
            <button onClick={handleBulkPrint} className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-lg active:scale-95 transition-all">PDF Report</button>
          </div>
        </div>
      )}

      {/* Smaller New PCC Entry Button */}
      <button 
        onClick={onAddNew}
        className="w-full py-2.5 px-4 glass-effect rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all shadow-sm flex items-center justify-between group active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 primary-gradient rounded-lg flex items-center justify-center text-white shadow-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </div>
          <span className="text-xs font-black text-slate-800 dark:text-white tracking-tight">New PCC Entry</span>
        </div>
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1 bg-slate-100/50 dark:bg-white/5 p-2 rounded-xl">
          <button 
            onClick={toggleSelectAll}
            className="flex items-center gap-2 group transition-all"
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isAllSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-white/20 bg-white/5'}`}>
              {isAllSelected && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Select All ({filteredRecords.length})</span>
          </button>
          
          <div className="flex items-center gap-1.5 bg-white/50 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-white/5">
            <button onClick={() => setDateType('ENTRY')} className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase transition-all ${dateType === 'ENTRY' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400'}`}>Entry</button>
            <button onClick={() => setDateType('DELIVERY')} className={`px-2 py-0.5 rounded-md text-[7px] font-black uppercase transition-all ${dateType === 'DELIVERY' ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-400'}`}>Deli</button>
            <input type="date" className="bg-transparent border-none text-[8px] font-bold outline-none px-1 dark:text-white" value={dateValue} onChange={e => setDateValue(e.target.value)} />
          </div>
        </div>
        
        <div className="relative">
          <input type="text" className="w-full glass-effect rounded-xl py-2 pl-9 pr-4 text-[11px] font-bold outline-none dark:text-white transition-all shadow-inner" placeholder="Search (Name, Passport or Serial)..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 px-1">
        {filteredRecords.map((record) => (
          <div key={record.id} className={`glass-effect rounded-2xl p-3 border transition-all relative shadow-sm ${selectedIds.has(record.id) ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0" onClick={() => toggleSelect(record.id)}>
                <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center transition-all border-2 ${selectedIds.has(record.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-white/10 bg-white/5'}`}>
                  {selectedIds.has(record.id) && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">#{record.serialNo}</span>
                    <h3 className="text-[12px] font-black text-slate-800 dark:text-slate-100 truncate">{record.pccHolderName}</h3>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold text-slate-400 font-mono tracking-tight">{record.pccNumber}</span>
                      <span className={`text-[8px] font-black uppercase flex items-center gap-1 ${record.status === DeliveryStatus.DELIVERED ? 'text-blue-500' : 'text-orange-500'}`}>
                        {record.status}
                      </span>
                    </div>
                    {record.status === DeliveryStatus.DELIVERED && (
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        {record.receivedBy && (
                          <div className="flex items-center gap-1.5">
                            <div className="h-3 w-px bg-slate-200 dark:bg-white/10 ml-0.5"></div>
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Receiver:</span>
                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">{record.receivedBy}</span>
                          </div>
                        )}
                        {record.deliveryDate && (
                          <div className="flex items-center gap-1.5">
                            <div className="h-3 w-px bg-slate-200 dark:bg-white/10 ml-0.5"></div>
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Deli Date:</span>
                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md">{formatDate(record.deliveryDate)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={(e) => { e.stopPropagation(); printInvoice(record); }} className="w-7 h-7 flex items-center justify-center glass-effect text-emerald-600 rounded-lg shadow-sm">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M7.5 11.25L12 15.75m0 0l4.5-4.5M12 15.75V3" /></svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); onEdit(record); }} className="w-7 h-7 flex items-center justify-center glass-effect text-slate-500 rounded-lg"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg></button>
                <button onClick={(e) => { e.stopPropagation(); onDelete(record.id); }} className="w-7 h-7 flex items-center justify-center glass-effect text-rose-500 rounded-lg"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <div className="flex gap-4">
                <div className="min-w-0">
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Reference</p>
                  <p className="text-[9px] font-bold text-slate-600 dark:text-slate-400 truncate w-24">{record.customerName || '—'}</p>
                </div>
                <div>
                  <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Balance Due</p>
                  <p className={`text-[10px] font-black ${record.dueAmount > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>৳{record.dueAmount.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-right flex flex-col items-end">
                   <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Date</p>
                   <p className="text-[9px] font-bold text-slate-700 dark:text-slate-300">{formatDate(record.status === DeliveryStatus.DELIVERED ? record.deliveryDate : record.entryDate)}</p>
                </div>
                {record.status === DeliveryStatus.PENDING && (
                  <button onClick={(e) => { e.stopPropagation(); setDeliveryModalRecord(record); setDeliveryDate(new Date().toISOString().split('T')[0]); }} className="h-7 px-3 bg-emerald-500 text-white rounded-lg font-black text-[8px] uppercase shadow-sm">Deliver</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {deliveryModalRecord && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm">
           <div className="glass-effect rounded-3xl w-full max-w-[280px] p-5 space-y-4 animate-in zoom-in-95 border border-white/10">
                 <div className="text-center">
                   <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tighter">Delivery Complete</h2>
                   <p className="text-[9px] font-bold text-emerald-500 truncate mt-0.5">{deliveryModalRecord.pccHolderName}</p>
                 </div>
                 <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Delivery Date</label>
                      <input type="date" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold outline-none" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">Receiver Name</label>
                      <input type="text" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-bold outline-none" value={receiverName} onChange={e => setReceiverName(e.target.value)} placeholder="e.g. Customer Name" />
                    </div>
                    {deliveryModalRecord.dueAmount > 0 && (
                      <button onClick={() => setIsDuePaid(!isDuePaid)} className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${isDuePaid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-100 border-slate-200 opacity-60'}`}>
                        <div className="text-left">
                          <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-1">Confirm Payment</p>
                          <span className="text-[10px] font-black">৳{deliveryModalRecord.dueAmount.toLocaleString()} Settled</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isDuePaid ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                          {isDuePaid && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="5"><path d="M5 13l4 4L19 7" /></svg>}
                        </div>
                      </button>
                    )}
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setDeliveryModalRecord(null)} className="py-3 rounded-xl glass-effect text-[9px] font-black uppercase text-slate-500">Cancel</button>
                    <button onClick={() => { onStatusUpdate(deliveryModalRecord.id, DeliveryStatus.DELIVERED, isDuePaid, receiverName, deliveryDate); setDeliveryModalRecord(null); }} className="py-3 rounded-xl bg-emerald-500 text-white text-[9px] font-black uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Confirm</button>
                 </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PCCTable;