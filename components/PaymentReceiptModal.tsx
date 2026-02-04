
import React from 'react';
import { Member } from '../types';
import html2canvas from 'html2canvas';

interface PaymentReceiptModalProps {
  data: {
    members: Member[];
    total: number;
  };
  onClose: () => void;
}

const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({ data, onClose }) => {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleDownload = async () => {
    const element = document.getElementById('receipt-download-area');
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#020617',
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.download = `STRUK_KOPBAM_${new Date().getTime()}.jpg`;
      link.click();
    } catch (err) {
      alert("Gagal mengunduh struk.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl py-10 relative">
        {/* Controls Overlay */}
        <div className="flex justify-center gap-6 mb-10 sticky top-0 z-20">
             <button 
                onClick={handleDownload} 
                className="group px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-[2rem] text-sm font-black uppercase tracking-widest text-white shadow-3xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-4 border border-emerald-400/20"
             >
                <svg className="w-6 h-6 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download Laporan (JPG)
             </button>
             <button 
                onClick={onClose} 
                className="px-10 py-5 bg-white/10 hover:bg-white/20 rounded-[2rem] text-sm font-black uppercase tracking-widest text-white transition-all border border-white/10 backdrop-blur-md"
             >
                Selesai & Dashboard
             </button>
        </div>

        {/* Receipt Visual Body */}
        <div id="receipt-download-area" className="bg-slate-950 p-14 rounded-[4rem] border border-white/5 relative shadow-5xl overflow-hidden font-sans text-slate-300 mx-auto max-w-lg">
           {/* Design Flourish */}
           <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"></div>
           <div className="absolute top-10 right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl"></div>

           {/* Header Struk */}
           <div className="text-center mb-12 border-b border-dashed border-white/10 pb-12 relative">
             <div className="w-20 h-20 bg-white rounded-3xl mx-auto mb-6 p-3 shadow-2xl">
                <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M15 20 V80 M15 50 H30 L50 20 M30 50 L50 80" stroke="black" strokeWidth="8" fill="none" strokeLinecap="round" /><path d="M45 25 C65 15, 85 40, 70 50 C85 60, 65 85, 45 75 Z" fill="#0ea5e9" opacity="0.9" /><path d="M60 40 L75 40 M60 60 L75 60" stroke="white" strokeWidth="4" /><path d="M75 30 V70 L90 50 Z" fill="#3b82f6" /></svg>
             </div>
             <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">KOPBAM</h1>
             <p className="text-[11px] text-blue-400 font-black tracking-[0.4em] uppercase mt-2">Koperasi Banua Mamase</p>
             <div className="mt-8">
                <span className="text-[10px] font-black bg-blue-500 text-white px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                   Transaction Verified
                </span>
             </div>
           </div>

           {/* Metadata Section */}
           <div className="grid grid-cols-1 gap-5 mb-12 text-[13px]">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                 <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Waktu Sistem</span>
                 <span className="font-black text-white">{new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                 <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Tipe Transaksi</span>
                 <span className="font-black text-blue-400 uppercase italic">Digital Settlement</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                 <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">ID Ref</span>
                 <span className="font-black text-white font-mono">TX-{Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
           </div>

           {/* Itemized List */}
           <div className="mb-12 relative">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 ml-2">Detail Angsuran</h4>
              <div className="space-y-3 bg-white/5 rounded-[2rem] p-8 border border-white/5">
                 {data.members.map((m, i) => (
                    <div key={i} className="flex justify-between items-center group">
                       <div className="flex items-center gap-3">
                          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          <span className="text-white font-bold uppercase text-xs">{m.nama}</span>
                       </div>
                       <span className="font-black text-xs text-emerald-400">{formatIDR(parseFloat(m.cicilan as string || '0'))}</span>
                    </div>
                 ))}
              </div>
           </div>

           {/* GRAND TOTAL */}
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[2.5rem] shadow-3xl shadow-blue-600/20 mb-12 flex flex-col items-center">
              <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.4em] mb-2">Total Dana Diterima</span>
              <span className="text-4xl font-black text-white tracking-tighter">{formatIDR(data.total)}</span>
           </div>

           {/* Receipt Footer */}
           <div className="text-center">
              <div className="flex flex-col items-center gap-6 mb-10">
                <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-xl border-4 border-slate-900">
                   <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KOPBAM-PAYROLL-VERIFIED-${new Date().getTime()}`} 
                      alt="QR AUTH" 
                      className="w-full h-full object-contain"
                   />
                </div>
                <div>
                   <p className="text-[11px] font-black text-white uppercase tracking-widest leading-none mb-1">E-SIGNATURE AUTHORIZED</p>
                   <p className="text-[9px] text-slate-500 italic max-w-[280px] mx-auto leading-relaxed">
                      Bukti ini dihasilkan secara otomatis dan sah sebagai laporan setoran koperasi Banua Mamase.
                   </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 text-slate-800 opacity-20 font-black italic text-[10px]">
                 <span>KOPBAM ECOSYSTEM</span>
                 <div className="w-1 h-1 bg-slate-800 rounded-full"></div>
                 <span>BY ANGGARA PRADANA</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceiptModal;
