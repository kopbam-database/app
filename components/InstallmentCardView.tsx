import React, { useState } from 'react';
import { Member } from '../types';
import html2canvas from 'html2canvas';
// Import Icons from constants to fix the "Cannot find name 'Icons'" error
import { Icons } from '../constants';

interface InstallmentCardViewProps {
  members: Member[];
}

const InstallmentCardView: React.FC<InstallmentCardViewProps> = ({ members }) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const formatIDR = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const handleDownload = async () => {
    const cardElement = document.getElementById('installment-card-print');
    if (!cardElement) return;

    try {
      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#0f172a',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const image = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement('a');
      link.href = image;
      link.download = `KARTU_ANGSURAN_${selectedMember?.nama.replace(/\s+/g, '_')}.jpg`;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
      alert("Gagal mengunduh gambar. Silakan coba lagi.");
    }
  };

  const renderCard = (member: Member) => {
    const tenor = parseInt(member.tenor as string || '0');
    const paidCount = parseInt(member.paid as string || '0');
    // History timestamps (reversed because newest is first in sheet)
    const history = [...(member.payment_history || [])].reverse();

    return (
      <div id="installment-card-print" className="w-[800px] bg-slate-900 p-12 rounded-[3rem] border-4 border-blue-500/20 relative overflow-hidden text-white font-sans">
        {/* Abstract Background Decoration */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px]" />
        
        {/* Header */}
        <div className="flex justify-between items-start mb-12 relative z-10">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center p-3 shadow-2xl">
                <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M15 20 V80 M15 50 H30 L50 20 M30 50 L50 80" stroke="black" strokeWidth="8" fill="none" strokeLinecap="round" /><path d="M45 25 C65 15, 85 40, 70 50 C85 60, 65 85, 45 75 Z" fill="#0ea5e9" opacity="0.9" /><path d="M60 40 L75 40 M60 60 L75 60" stroke="white" strokeWidth="4" /><path d="M75 30 V70 L90 50 Z" fill="#3b82f6" /></svg>
             </div>
             <div>
                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">KOPBAM</h1>
                <p className="text-blue-400 font-bold tracking-[0.25em] text-[11px] uppercase mt-2">Koperasi Banua Mamase</p>
                <div className="h-1 w-24 bg-blue-600 mt-3 rounded-full"></div>
             </div>
          </div>
          <div className="text-right">
             <h2 className="text-2xl font-black tracking-tighter text-blue-100/50 uppercase italic">Kartu Kontrol Angsuran</h2>
             <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1">Official Payment Document</p>
          </div>
        </div>

        {/* Member Info Bar */}
        <div className="grid grid-cols-3 gap-8 bg-white/5 backdrop-blur-md rounded-[2rem] p-8 border border-white/5 mb-12 relative z-10">
           <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 opacity-60">Nama Anggota</p>
              <p className="text-xl font-bold text-white uppercase">{member.nama}</p>
           </div>
           <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 opacity-60">Nomor Induk (NIK)</p>
              <p className="text-xl font-bold text-white tracking-widest">{member.nik}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 opacity-60">Plafon Pinjaman</p>
              <p className="text-xl font-bold text-emerald-400">{formatIDR(member.plafon)}</p>
           </div>
        </div>

        {/* Coupon Grid */}
        <div className="grid grid-cols-4 gap-6 mb-12 relative z-10">
           {Array.from({ length: tenor }).map((_, i) => {
              const isPaid = i < paidCount;
              const payDate = history[i];

              return (
                <div key={i} className={`relative group transition-all ${isPaid ? 'opacity-100' : 'opacity-40'}`}>
                   {/* Ticket Body */}
                   <div className={`h-36 rounded-2xl border-2 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-all duration-500 ${isPaid ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/40 border-white/10 border-dashed'}`}>
                      {/* Torn Markings (Circles at top/bottom) */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-500/30" />
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-900 border-2 border-emerald-500/30" />
                      
                      {isPaid ? (
                        <div className="flex flex-col items-center animate-fade-in">
                          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Angsuran Ke</span>
                          <span className="text-3xl font-black text-white">{i + 1}</span>
                          <div className="mt-2 text-center">
                             <p className="text-[8px] font-bold text-emerald-400/80 uppercase tracking-wider">Terbayar Pada:</p>
                             <p className="text-[9px] font-black text-white/80 mt-0.5">{payDate ? new Date(payDate).toLocaleDateString('id-ID') : '-'}</p>
                          </div>
                          {/* Stamp Effect */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                             <div className="stamp-effect text-emerald-400 text-sm font-black border-4 border-emerald-400 p-1 rounded uppercase">PAID</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Angsuran Ke</span>
                          <span className="text-3xl font-black text-slate-600">{i + 1}</span>
                          <p className="text-[10px] font-bold text-slate-600 mt-2 italic">Belum Setor</p>
                        </div>
                      )}
                   </div>
                </div>
              );
           })}
        </div>

        {/* Footer with Authenticity */}
        <div className="flex justify-between items-end border-t border-white/5 pt-10 relative z-10">
           <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-xl border-4 border-blue-600/20">
                 <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KOPBAM-AUTH-${member.nik}-${member.paid}`} 
                    alt="QR Code" 
                    className="w-full h-full object-contain"
                 />
              </div>
              <div className="max-w-[300px]">
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Catatan Penting</p>
                 <p className="text-[9px] leading-relaxed text-slate-400 font-medium italic">
                    Kartu ini adalah dokumen digital resmi Koperasi Banua Mamase. Simpan kartu ini sebagai bukti pembayaran angsuran Anda. QR Code diatas memuat identitas digital unik Anda untuk proses verifikasi.
                 </p>
              </div>
           </div>
           
           <div className="text-center relative pb-4">
              {/* Digital Stamp Overlay */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-60">
                 <div className="w-28 h-28 border-4 border-blue-500 rounded-full flex items-center justify-center p-2 transform -rotate-12">
                    <div className="w-full h-full border-2 border-blue-500 rounded-full border-dashed flex flex-col items-center justify-center">
                       <p className="text-[8px] font-black text-blue-500 uppercase">OFFICIAL</p>
                       <p className="text-[6px] font-black text-blue-500 uppercase">KOPBAM</p>
                       <p className="text-[8px] font-black text-blue-500 uppercase">STAMP</p>
                    </div>
                 </div>
              </div>
              
              <div className="relative z-10">
                 <p className="text-[10px] font-bold text-slate-500 mb-12 uppercase tracking-widest">Ketua KOPBAM</p>
                 <div className="h-px w-48 bg-white/20 mb-2"></div>
                 <p className="text-sm font-black text-white uppercase tracking-tighter">BENDAHARA KOPERASI</p>
                 <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">E-SIGNATURE VERIFIED</p>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-fade-in">
      <div className="glass-card rounded-[2.5rem] p-10 border border-white/5">
        <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
          <span className="w-3 h-10 bg-blue-600 rounded-full"></span>
          Pilih Anggota Untuk Dicetak
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m, i) => (
            <button 
              key={i} 
              onClick={() => setSelectedMember(m)}
              className={`p-6 rounded-[2rem] border transition-all text-left flex items-center gap-5 group active:scale-95 ${selectedMember?.nik === m.nik ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-600/40' : 'bg-slate-900/50 border-white/5 hover:border-white/20'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl transition-colors ${selectedMember?.nik === m.nik ? 'bg-white text-blue-600' : 'bg-blue-600/10 text-blue-400'}`}>
                {m.nama.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={`font-black text-base truncate max-w-[150px] ${selectedMember?.nik === m.nik ? 'text-white' : 'text-slate-200'}`}>{m.nama}</p>
                <p className={`text-xs font-bold ${selectedMember?.nik === m.nik ? 'text-blue-200' : 'text-slate-500'}`}>NIK: {m.nik}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className="mb-10 flex gap-5">
             <button 
                onClick={handleDownload}
                className="px-10 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-2xl transition-all active:scale-95 flex items-center gap-4"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Unduh Kartu (JPG)
             </button>
             <button 
                onClick={() => setSelectedMember(null)}
                className="px-10 py-5 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all border border-white/10"
             >
                Selesai
             </button>
          </div>
          
          {/* Card Wrapper for Scroll/View */}
          <div className="w-full overflow-x-auto pb-20 custom-scroll flex justify-center">
             <div className="scale-90 md:scale-100 origin-top shadow-5xl">
               {renderCard(selectedMember)}
             </div>
          </div>
        </div>
      )}

      {!selectedMember && members.length > 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
           <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/20 flex items-center justify-center mb-6">
              <Icons.Payment />
           </div>
           <p className="text-xl font-bold text-slate-400 tracking-tighter">Pilih anggota untuk melihat pratinjau kartu</p>
        </div>
      )}
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .shadow-5xl {
           box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default InstallmentCardView;