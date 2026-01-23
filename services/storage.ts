
import { PCCRecord, BusinessProfile } from '../types';

const STORAGE_KEY = 'pcc_tracker_records';
const SERIAL_KEY = 'pcc_tracker_last_serial';
const PROFILE_KEY = 'pcc_business_profile';

export const storageService = {
  saveRecords: (records: PCCRecord[]): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  },
  loadRecords: (): PCCRecord[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveLastSerial: (serial: number): void => {
    localStorage.setItem(SERIAL_KEY, serial.toString());
  },
  loadLastSerial: (): number => {
    const serial = localStorage.getItem(SERIAL_KEY);
    return serial ? parseInt(serial, 10) : 0;
  },
  saveProfile: (profile: BusinessProfile): void => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
  loadProfile: (): BusinessProfile => {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : {
      shopName: 'PCC Track Pro',
      address: 'Shop Address',
      phone: '01XXXXXXXXX'
    };
  }
};
