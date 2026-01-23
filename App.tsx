import React, { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import SummaryCards from './components/SummaryCards';
import PCCForm from './components/PCCForm';
import PCCTable from './components/PCCTable';
import SettingsSection from './components/SettingsSection';
import { PCCRecord, DeliveryStatus, DashboardStats, BusinessProfile } from './types';
import { storageService } from './services/storage';

const generateSafeId = () => Date.now().toString(36) + Math.random().toString(36).substring(2);

const App: React.FC = () => {
  const [records, setRecords] = useState<PCCRecord[]>([]);
  const [lastSerial, setLastSerial] = useState<number>(0);
  const [profile, setProfile] = useState<BusinessProfile>(storageService.loadProfile());
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PCCRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'ALL' | 'DUE'>('ALL');
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    setRecords(storageService.loadRecords());
    setLastSerial(storageService.loadLastSerial());
    setProfile(storageService.loadProfile());
  }, []);

  useEffect(() => storageService.saveRecords(records), [records]);
  useEffect(() => storageService.saveLastSerial(lastSerial), [lastSerial]);
  useEffect(() => storageService.saveProfile(profile), [profile]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const stats: DashboardStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      totalRecords: records.length,
      totalPending: records.filter(r => r.status === DeliveryStatus.PENDING).length,
      totalDelivered: records.filter(r => r.status === DeliveryStatus.DELIVERED).length,
      totalDueAmount: records.reduce((acc, curr) => acc + (Number(curr.dueAmount) || 0), 0),
      todayEntries: records.filter(r => r.entryDate === today).length,
      todayDeliveries: records.filter(r => r.deliveryDate === today && r.status === DeliveryStatus.DELIVERED).length,
    };
  }, [records]);

  const handleAddOrUpdate = (formData: Partial<PCCRecord>) => {
    const total = Number(formData.totalAmount) || 0;
    const paid = Number(formData.paidAmount) || 0;

    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? { ...r, ...formData, totalAmount: total, paidAmount: paid, dueAmount: total - paid } as PCCRecord : r));
    } else {
      const newSerial = lastSerial + 1;
      const recordId = generateSafeId();
      const newRecord: PCCRecord = {
        ...formData, id: recordId, serialNo: newSerial.toString(),
        totalAmount: total, paidAmount: paid, dueAmount: total - paid,
        createdAt: new Date().toISOString()
      } as PCCRecord;
      
      setRecords([newRecord, ...records]);
      setLastSerial(newSerial);
    }
    setIsFormOpen(false);
    setEditingRecord(null);
    setActiveTab('records'); // Auto-switch to records to see the result
  };

  const handleUpdateStatus = (id: string, status: DeliveryStatus, clearDue: boolean, receivedBy: string, customDeliveryDate?: string) => {
    const today = new Date().toISOString().split('T')[0];
    const record = records.find(r => r.id === id);
    if (!record) return;

    const finalDate = customDeliveryDate || today;

    setRecords(records.map(r => r.id === id ? { 
      ...r, 
      status, 
      receivedBy: receivedBy || r.receivedBy,
      deliveryDate: status === DeliveryStatus.DELIVERED ? finalDate : undefined,
      // Update entryDate to match delivery date so it reflects the new date in the entry
      entryDate: status === DeliveryStatus.DELIVERED ? finalDate : r.entryDate,
      paidAmount: clearDue ? r.totalAmount : r.paidAmount,
      dueAmount: clearDue ? 0 : r.dueAmount
    } : r));
  };

  const handleDataRestore = (newRecords: PCCRecord[]) => {
    setRecords(newRecords);
    const maxSerial = newRecords.reduce((max, rec) => {
      const s = parseInt(rec.serialNo, 10);
      return !isNaN(s) && s > max ? s : max;
    }, 0);
    setLastSerial(maxSerial);
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={(t) => {
      if (t === 'settings') setIsSettingsOpen(true);
      else if (t === 'add') { setEditingRecord(null); setIsFormOpen(true); }
      else { setActiveTab(t); setIsSettingsOpen(false); }
    }} shopName={profile.shopName}>
      <div className="animate-slide-up space-y-8">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <SummaryCards stats={stats} onFilterClick={(f) => { setStatusFilter(f); setActiveTab('records'); }} />
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-4 mb-2">
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">PCC Records</h2>
              <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1"></div>
            </div>
            <PCCTable 
              records={records} profile={profile}
              onEdit={(r) => { setEditingRecord(r); setIsFormOpen(true); }} 
              onDelete={(id) => { if(confirm('Are you sure you want to delete this record?')) { setRecords(records.filter(r=>r.id!==id)); }} } 
              onAddNew={() => { setEditingRecord(null); setIsFormOpen(true); }}
              onStatusUpdate={handleUpdateStatus}
              searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            />
          </div>
        )}
      </div>

      <PCCForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingRecord(null); }} onSubmit={handleAddOrUpdate} editingRecord={editingRecord} nextSerialNo={lastSerial + 1} profile={profile} />
      
      <SettingsSection 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} 
        records={records} onDataRestore={handleDataRestore}
        profile={profile} onProfileUpdate={setProfile}
        isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
    </Layout>
  );
};

export default App;