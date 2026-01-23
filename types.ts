
export enum DeliveryStatus {
  PENDING = 'Pending',
  DELIVERED = 'Delivered'
}

export enum ServiceType {
  NORMAL = 'Normal',
  URGENT = 'Urgent'
}

export interface BusinessProfile {
  shopName: string;
  address: string;
  phone: string;
  lastBackupDate?: string;
}

export interface PCCRecord {
  id: string;
  serialNo: string;
  pccNumber: string;
  customerName: string;
  pccHolderName: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: DeliveryStatus;
  serviceType: ServiceType;
  receivedBy?: string;
  entryDate: string;
  deliveryDate?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalRecords: number;
  totalPending: number;
  totalDelivered: number;
  totalDueAmount: number;
  todayEntries: number;
  todayDeliveries: number;
}
