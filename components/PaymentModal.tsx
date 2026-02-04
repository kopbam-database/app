
import React, { useState, useMemo } from 'react';
import { Member } from '../types';

interface PaymentModalProps {
  members: Member[];
  onClose: () => void;
  onConfirm: (selectedMembers: Member[]) => Promise<void>;
  type: 'single' | 'batch';
}

const PaymentModal: React.FC<PaymentModalProps> = ({ members, onClose, onConfirm, type }) => {
  const [processing, setProcessing] = useState(false);
  // Track selected members using their NIK as a unique identifier
  const [selectedNiks, setSelectedNiks] = useState<Set<string>>(
    new Set(members.map(m => m.nik))
  );

  const formatIDR = (val: number | string) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num || 0);
  };

  const selectedMembersList = useMemo(() => {
    return members.filter(m => selectedNiks.has(m.nik));
  }, [members, selectedNiks]);

  const totalAmount = selectedMembersList.reduce((acc, m) => acc + parseFloat(m.cicilan as string || '0'), 0);

  const toggleSelectAll = () => {
    if (selectedNiks.size === members.length) {
      setSelectedNiks(new Set());
    } else {
      setSelectedNiks(new Set(members.map(m => m.nik)));
    }
  };

  const toggleMember = (nik: string) => {
    const newSelection = new Set(selectedNiks);
    if (newSelection.has(nik)) {
      newSelection.delete(nik);
    } else {
      newSelection.add(nik);
    }
    setSelectedNiks(newSelection);
  };

  const handleConfirm = async () => {
    if (selectedMembersList.length === 0 || processing) return;
    
    setProcessing(true);
    try {
      // Execute the actual save logic passed from App.tsx
      await onConfirm(selectedMembersList);
    } catch (error) {
      console.error("Payment confirmation error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl animate-fade-in border border-blue-500/30">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Konfirmasi Pembayaran</h3>
              <p className="text-sm text-slate-400">
                {type === 'batch' 
                  ? `Payroll Angsuran: ${selectedNiks.size} dari ${members.length} terpilih` 
                  : 'Pembayaran Manual Angsuran'}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Total yang akan dibayar</p>
              <p className="text-3xl font-black text-emerald-400 tracking-tight">{formatIDR(totalAmount)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Rincian Anggota:</p>
                {type === 'batch' && (
                  <button 
                    onClick={toggleSelectAll}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-300 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <div className={`w-4 h-4 rounded border ${selectedNiks.size === members.length ? 'bg-blue-500 border-blue-400' : 'border-white/20'} flex items-center justify-center`}>
                      {selectedNiks.size === members.length && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    {selectedNiks.size === members.length ? 'Hapus Semua' : 'Pilih Semua'}
                  </button>
                )}
              </div>
              
              <div className="max-h-56 overflow-y-auto pr-2 custom-scroll space-y-1">
                {members.map((m) => (
                  <div 
                    key={m.nik} 
                    onClick={() => toggleMember(m.nik)}
                    className={`flex justify-between items-center p-3 rounded-xl border transition-all cursor-pointer ${selectedNiks.has(m.nik) ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-transparent hover:border-white/10 opacity-60'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedNiks.has(m.nik) ? 'bg-blue-500 border-blue-400' : 'border-white/20'}`}>
                        {selectedNiks.has(m.nik) && <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm font-semibold truncate max-w-[180px] ${selectedNiks.has(m.nik) ? 'text-white' : 'text-slate-400'}`}>
                        {m.nama}
                      </span>
                    </div>
                    <span className={`font-mono text-sm ${selectedNiks.has(m.nik) ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                      {formatIDR(m.cicilan)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              disabled={processing}
              onClick={onClose} 
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm text-white transition-all border border-white/10 disabled:opacity-50"
            >
              Batalkan
            </button>
            <button 
              disabled={processing || selectedNiks.size === 0}
              onClick={handleConfirm}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-bold text-sm text-white transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                'Proses Bayar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
