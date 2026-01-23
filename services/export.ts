import { PCCRecord, DeliveryStatus, BusinessProfile, ServiceType } from '../types';
import { storageService } from './storage';

const generateSafeId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const getCommonStyles = () => `
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@600;700;800;900&display=swap');
    
    * { 
      box-sizing: border-box; 
      -webkit-print-color-adjust: exact; 
      print-color-adjust: exact; 
    }
    
    body { 
      margin: 0; 
      padding: 0; 
      font-family: 'Plus Jakarta Sans', sans-serif; 
      background: #ffffff; 
    }
    
    #invoice-render-box { 
      width: 210mm; 
      background: white; 
      padding: 15mm 15mm 20mm 15mm; 
      color: #0f172a;
      position: relative;
      margin: 0 auto;
      display: block;
      min-height: 297mm;
    }

    .bg-pattern {
      position: absolute;
      top: 0; 
      left: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(#e2e8f0 0.8px, transparent 0.8px);
      background-size: 24px 24px;
      opacity: 0.05;
      pointer-events: none;
      z-index: 0;
    }

    .header-luxury {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px; 
      position: relative;
      z-index: 10;
      border-bottom: 2px solid #059669;
      padding-bottom: 8px;
    }

    .shop-identity h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 900;
      color: #059669;
      margin: 0;
      letter-spacing: -0.5px;
      text-transform: uppercase;
    }

    .shop-identity p {
      font-size: 8px;
      font-weight: 700;
      color: #64748b;
      margin-top: 2px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .report-type {
      text-align: right;
    }

    .report-type h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 900;
      color: #0f172a;
      margin: 0;
      text-transform: uppercase;
    }

    .report-date {
      font-size: 8px;
      font-weight: 800;
      color: #94a3b8;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 20px;
      position: relative;
      z-index: 10;
    }

    .dash-card {
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .dash-label {
      font-size: 6px;
      font-weight: 900;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 2px;
    }

    .dash-value {
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 800;
      color: #1e293b;
    }

    .executive-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      position: relative;
      z-index: 10;
    }

    .executive-table th {
      text-align: left;
      font-size: 8px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      padding: 8px 10px;
      background: #f1f5f9;
      border-bottom: 2px solid #e2e8f0;
    }

    .executive-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 10px;
      vertical-align: middle;
    }

    .status-badge {
      font-size: 7px;
      font-weight: 900;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      display: inline-block;
    }

    .summary-box-premium {
      background: #0f172a;
      padding: 15px 20px;
      border-radius: 10px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 10;
      margin-top: 10px;
      page-break-inside: avoid;
    }

    .footer-metadata {
      margin-top: 15px;
      text-align: center;
      font-size: 8px;
      font-weight: 900;
      color: #94a3b8;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    tr { page-break-inside: avoid; }
    .executive-table { page-break-inside: auto; }
  </style>
`;

const getInvoiceHTML = (record: PCCRecord, profile: BusinessProfile) => {
  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return d;
    }
  };
  const balanceColor = record.dueAmount > 0 ? '#be123c' : '#059669';

  return `
    <div id="invoice-render-box">
      <div class="bg-pattern"></div>
      
      <div class="header-luxury">
        <div class="shop-identity">
          <h1>${profile.shopName}</h1>
          <p>Official Tracking & Logistics Specialist</p>
        </div>
        <div class="report-type">
          <h2>OFFICIAL INVOICE</h2>
          <div class="report-date">SERIAL: #${record.serialNo}</div>
        </div>
      </div>

      <div class="dashboard-grid" style="grid-template-columns: 1fr 1fr;">
        <div class="dash-card">
          <span class="dash-label">CLIENT INFORMATION</span>
          <div class="dash-value" style="font-size: 16px;">${record.pccHolderName}</div>
          <div style="margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div>
              <p style="font-size: 7px; color: #94a3b8; font-weight: 900; margin-bottom: 2px;">PASSPORT ID</p>
              <p style="font-size: 12px; font-weight: 800; font-family: monospace; color: #059669;">${record.pccNumber}</p>
            </div>
            <div>
              <p style="font-size: 7px; color: #94a3b8; font-weight: 900; margin-bottom: 2px;">ENTRY DATE</p>
              <p style="font-size: 11px; font-weight: 700;">${formatDate(record.entryDate)}</p>
            </div>
            <div style="grid-column: span 2; border-top: 1px solid #f1f5f9; padding-top: 6px; margin-top: 4px;">
              <p style="font-size: 7px; color: #94a3b8; font-weight: 900; margin-bottom: 2px;">REFERENCE</p>
              <p style="font-size: 11px; font-weight: 700; color: #1e293b;">${record.customerName || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div class="dash-card" style="background: #0f172a; border: none; color: white;">
          <span class="dash-label" style="color: #38bdf8;">DELIVERY STATUS</span>
          <div class="dash-value" style="color: white; font-size: 16px;">${record.status.toUpperCase()}</div>
          <div style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
             <div>
               <p style="font-size: 7px; color: #94a3b8; text-transform: uppercase; font-weight: 800;">SERVICE CLASS</p>
               <p style="font-size: 11px; font-weight: 700; color: #38bdf8; margin-top: 2px;">${record.serviceType}</p>
             </div>
             <div>
               <p style="font-size: 7px; color: #94a3b8; text-transform: uppercase; font-weight: 800;">RECEIVED BY</p>
               <p style="font-size: 11px; font-weight: 700; color: #ffffff; margin-top: 2px;">${record.receivedBy || 'PENDING'}</p>
             </div>
          </div>
        </div>
      </div>

      <table class="executive-table">
        <thead>
          <tr>
            <th style="width: 75%;">SERVICE DESCRIPTION</th>
            <th style="text-align: right;">TOTAL PAYABLE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <p style="font-size: 12px; font-weight: 800; color: #1e293b; margin: 0;">PCC Processing & Official Verification</p>
              <p style="font-size: 9px; color: #64748b; margin-top: 4px;">Standard handling and delivery of Police Clearance Certificate</p>
            </td>
            <td style="text-align: right; font-size: 14px; font-weight: 900; color: #0f172a;">
              TK ${record.totalAmount.toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>

      <div style="margin-left: auto; width: 260px; position: relative; z-index: 10; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 11px; font-weight: 600; color: #64748b;">
          <span>Sub-Total Fee</span>
          <span style="color: #0f172a; font-weight: 800;">TK ${record.totalAmount.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 11px; font-weight: 600; color: #059669; border-bottom: 2px solid #f1f5f9; margin-bottom: 10px;">
          <span>Advance Paid (-)</span>
          <span style="font-weight: 800;">TK ${record.paidAmount.toLocaleString()}</span>
        </div>
        
        <div class="summary-box-premium" style="padding: 10px 15px; background: ${balanceColor};">
          <div>
            <span style="font-size: 8px; font-weight: 800; color: rgba(255,255,255,0.8); text-transform: uppercase;">Final Balance</span>
            <div style="font-family: 'Outfit', sans-serif; font-size: 20px; font-weight: 900; color: white;">TK ${record.dueAmount.toLocaleString()}</div>
          </div>
          <div style="background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; font-size: 8px; font-weight: 900; color: white;">
            ${record.dueAmount === 0 ? 'PAID' : 'DUE'}
          </div>
        </div>
      </div>

      <div class="footer-metadata" style="margin-top: 40px;">
        OFFICIAL DOCUMENT • SYSTEM VERIFIED • ${profile.phone}
      </div>
    </div>
  `;
};

const executePrint = async (html: string, filename: string) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.innerHTML = getCommonStyles() + html;
  document.body.appendChild(container);

  await new Promise(resolve => setTimeout(resolve, 1500));

  // @ts-ignore
  const html2pdf = window.html2pdf;
  const element = document.getElementById('invoice-render-box');

  if (!element || !html2pdf) {
    alert("PDF library loading failed. Please check internet connection.");
    document.body.removeChild(container);
    return;
  }

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true, 
      letterRendering: true,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (err) {
    console.error("Export Error:", err);
    alert("Export failed. Please try again.");
  } finally {
    document.body.removeChild(container);
  }
};

export const printInvoice = (record: PCCRecord) => {
  const profile = storageService.loadProfile();
  const html = getInvoiceHTML(record, profile);
  executePrint(html, `Invoice_${record.serialNo}.pdf`);
};

export const printMultipleInvoices = (records: PCCRecord[]) => {
  if (records.length === 0) return;
  const profile = storageService.loadProfile();
  const totalDue = records.reduce((a, b) => a + b.dueAmount, 0);
  const totalBilled = records.reduce((a, b) => a + b.totalAmount, 0);
  const deliveredCount = records.filter(r => r.status === DeliveryStatus.DELIVERED).length;
  
  const rows = records.map((r) => `
    <tr>
      <td style="font-weight: 800; color: #64748b; text-align: center;">#${r.serialNo}</td>
      <td>
        <div style="font-weight: 800; color: #0f172a; font-size: 11px;">${r.pccHolderName}</div>
        <div style="font-size: 9px; font-weight: 700; color: #64748b; font-family: monospace;">${r.pccNumber}</div>
      </td>
      <td>
        <div style="font-weight: 700; color: #475569; font-size: 10px;">${r.customerName || 'N/A'}</div>
        <div style="font-size: 8px; color: #94a3b8; text-transform: uppercase;">${r.entryDate}</div>
      </td>
      <td style="text-align: center;">
        <span class="status-badge" style="${r.status === DeliveryStatus.DELIVERED ? 'background: #059669; color: white;' : 'background: #f59e0b; color: white;'}">
          ${r.status === DeliveryStatus.DELIVERED ? 'COLLECTED' : 'PENDING'}
        </span>
      </td>
      <td style="text-align: right; font-weight: 900; color: ${r.dueAmount > 0 ? '#e11d48' : '#059669'}; font-family: 'Outfit', sans-serif; font-size: 11px;">
        TK ${r.dueAmount.toLocaleString()}
      </td>
    </tr>
  `).join('');

  const html = `
    <div id="invoice-render-box">
      <div class="bg-pattern"></div>
      
      <div class="header-luxury">
        <div class="shop-identity">
          <h1>${profile.shopName}</h1>
          <p>Comprehensive Settlement & Portfolio Audit</p>
        </div>
        <div class="report-type">
          <h2>STATEMENT</h2>
          <div class="report-date">DATE: ${new Date().toLocaleDateString('en-GB')}</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dash-card">
          <span class="dash-label">Total Files</span>
          <div class="dash-value">${records.length}</div>
        </div>
        <div class="dash-card">
          <span class="dash-label">Completed</span>
          <div class="dash-value">${deliveredCount}</div>
        </div>
        <div class="dash-card">
          <span class="dash-label">Total Billed</span>
          <div class="dash-value">TK ${totalBilled.toLocaleString()}</div>
        </div>
        <div class="dash-card" style="border-color: #be123c; background: #fff1f2;">
          <span class="dash-label" style="color: #be123c;">Total Due</span>
          <div class="dash-value" style="color: #be123c;">TK ${totalDue.toLocaleString()}</div>
        </div>
      </div>
      
      <div style="position: relative; z-index: 10;">
        <table class="executive-table">
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">SL</th>
              <th>CLIENT DETAILS</th>
              <th>REFERENCE</th>
              <th style="text-align: center;">STATUS</th>
              <th style="text-align: right;">BALANCE</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>

      <div class="summary-box-premium" style="background: ${totalDue > 0 ? '#be123c' : '#059669'}">
        <div>
          <span style="color: rgba(255,255,255,0.8); font-size: 8px; font-weight: 900; text-transform: uppercase;">Aggregate Balance Due</span>
          <div style="font-family: 'Outfit', sans-serif; font-size: 24px; font-weight: 900; color: white;">TK ${totalDue.toLocaleString()}</div>
        </div>
        <div style="text-align: right;">
          <div style="background: rgba(255, 255, 255, 0.15); color: white; padding: 4px 10px; border-radius: 6px; font-size: 9px; font-weight: 900; border: 1px solid rgba(255,255,255,0.2);">
            AUDITED SETTLEMENT
          </div>
        </div>
      </div>

      <div class="footer-metadata">
        SYSTEM GENERATED AUDIT REPORT • ${profile.phone}
      </div>
    </div>
  `;
  executePrint(html, `Statement_${Date.now()}.pdf`);
};

export const exportToExcel = async (records: PCCRecord[]) => {
  try {
    // @ts-ignore
    const XLSX = window.XLSX;
    if (!XLSX) return alert("Excel library not found. Check internet.");
    const profile = storageService.loadProfile();
    const dateStr = new Date().toISOString().split('T')[0];
    const data = records.map(r => ({
      'SL': r.serialNo, 'Passport': r.pccNumber, 'Name': r.pccHolderName, 'Reference': r.customerName,
      'Total': r.totalAmount, 'Paid': r.paidAmount, 'Due': r.dueAmount, 'Status': r.status, 'Date': r.entryDate, 'Receiver': r.receivedBy || 'N/A'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Records");
    XLSX.writeFile(wb, `${profile.shopName}_Statement_${dateStr}.xlsx`);
  } catch (e) { alert("Excel export failed."); }
};

export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        // @ts-ignore
        const XLSX = window.XLSX;
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        // CRITICAL: cellDates: true ensures Excel date serials are converted to JS Dates
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);

        const cleanNumber = (val: any) => {
          if (typeof val === 'number') return val;
          if (!val) return 0;
          // Aggressive cleaning for currency symbols and commas
          const cleaned = String(val).replace(/[^0-9.]/g, '');
          const num = parseFloat(cleaned);
          return isNaN(num) ? 0 : num;
        };

        const getValByPossibleKeys = (row: any, keys: string[]) => {
          const rowKeys = Object.keys(row);
          for (const key of keys) {
            const foundKey = rowKeys.find(k => k.toLowerCase().trim() === key.toLowerCase());
            if (foundKey) return row[foundKey];
          }
          return null;
        };

        const formatDateValue = (val: any) => {
          if (val instanceof Date) return val.toISOString().split('T')[0];
          if (!val) return new Date().toISOString().split('T')[0];
          return String(val).trim();
        };

        const normalized = json.map((row: any) => {
          const total = cleanNumber(getValByPossibleKeys(row, ['total', 'fee', 'amount', 'totalamount']));
          const paid = cleanNumber(getValByPossibleKeys(row, ['paid', 'paid amount', 'advance', 'paidamount']));
          const pccNum = String(getValByPossibleKeys(row, ['passport', 'pcc number', 'passport number', 'pccnumber']) || '').trim();
          const statusText = String(getValByPossibleKeys(row, ['status', 'delivery status']) || '').toUpperCase();
          const isDelivered = statusText.includes('DELIVERED') || statusText.includes('সম্পন্ন') || statusText.includes('DONE');
          
          return {
            id: generateSafeId(),
            serialNo: String(getValByPossibleKeys(row, ['sl', 'serial', 'id', 'serialno']) || '').trim(),
            pccNumber: pccNum.toUpperCase(),
            pccHolderName: String(getValByPossibleKeys(row, ['name', 'holder name', 'client name', 'pccholdername']) || '').trim(),
            customerName: String(getValByPossibleKeys(row, ['reference', 'customer', 'mobile', 'customername']) || '').trim(),
            totalAmount: total,
            paidAmount: paid,
            dueAmount: total - paid,
            serviceType: ServiceType.NORMAL,
            status: isDelivered ? DeliveryStatus.DELIVERED : DeliveryStatus.PENDING,
            receivedBy: String(getValByPossibleKeys(row, ['receiver', 'received by', 'receivedby']) || '').trim(),
            entryDate: formatDateValue(getValByPossibleKeys(row, ['date', 'entry date', 'entrydate'])),
            createdAt: new Date().toISOString()
          };
        }).filter(r => r.pccNumber);
        resolve(normalized);
      } catch (err) { reject(err); }
    };
    reader.readAsArrayBuffer(file);
  });
};