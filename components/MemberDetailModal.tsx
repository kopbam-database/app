
import React from 'react';
import { Member } from '../types';

interface MemberDetailModalProps {
  member: Member;
  onClose: () => void;
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({ member, onClose }) => {
  const formatIDR = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const plafon = parseFloat(member.plafon as string || '0');
  const cicilan = parseFloat(member.cicilan as string || '0');
  const terbayar = parseFloat(member.jumlah_yang_sudah_terbayar as string || '0');
  const tenor = parseInt(member.tenor as string || '0');
  const piutang = parseFloat(member.piutang as string || '0');
  
  const bulanLunas = cicilan > 0 ? Math.floor(terbayar / cicilan) : 0;
  const percentage = tenor > 0 ? Math.min(Math.round((bulanLunas / tenor) * 100), 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl">
              {member.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{member.nama}</h3>
              <p className="text-sm text-blue-300/70">NIK: {member.nik}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-100px)] grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">Plafon</p>
                <p className="text-xl font-bold text-white">{formatIDR(plafon)}</p>
              </div>
              <div className="glass-card bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">Tenor</p>
                <p className="text-xl font-bold text-white">{tenor} Bulan</p>
              </div>
              <div className="glass-card bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">Cicilan</p>
                <p className="text-xl font-bold text-white">{formatIDR(cicilan)}</p>
              </div>
              <div className="glass-card bg-white/5 rounded-2xl p-5 border border-white/10">
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-1">Status</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${member.status_pembayaran.toLowerCase() === 'lunas' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {member.status_pembayaran.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="glass-card bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Progress Pembayaran</h4>
                  <p className="text-xs text-blue-300/60 mt-1">{bulanLunas} dari {tenor} bulan lunas</p>
                </div>
                <p className="text-2xl font-black text-blue-400">{percentage}%</p>
              </div>
              <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-blue-400 to-cyan-400 transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-blue-300/60 mb-1">Sisa Piutang</p>
                  <p className="text-lg font-bold text-orange-400">{formatIDR(piutang)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-300/60 mb-1">Total Terbayar</p>
                  <p className="text-lg font-bold text-emerald-400">{formatIDR(terbayar)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                Log Pembayaran Estimasi
             </h4>
             <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
               {Array.from({ length: tenor }).map((_, i) => (
                 <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${i < bulanLunas ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10 opacity-50'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${i < bulanLunas ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                        {i + 1}
                      </div>
                      <span className="text-sm font-medium text-white">Cicilan Ke-{i + 1}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{formatIDR(cicilan)}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetailModal;
