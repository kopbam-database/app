import React, { useState } from 'react';

interface AddMemberModalProps {
  onClose: () => void;
  onConfirm: (member: any) => Promise<void>;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    plafon: '',
    cicilan: '',
    tenor: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border border-blue-500/30">
        <div className="p-10">
          <div className="flex items-center gap-5 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight">Registrasi Anggota</h3>
              <p className="text-sm text-blue-300/60 font-medium">Data akan otomatis dikonfigurasi oleh sistem</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">NIK (KTP)</label>
                <input 
                  required
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  placeholder="Masukkan 16 digit NIK"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">Nama Lengkap</label>
                <input 
                  required
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Sesuai identitas resmi"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">Plafon Pinjaman</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-slate-500 text-sm font-bold">Rp</span>
                    <input 
                      required
                      type="number"
                      name="plafon"
                      value={formData.plafon}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">Tenor (Bulan)</label>
                  <input 
                    required
                    type="number"
                    name="tenor"
                    value={formData.tenor}
                    onChange={handleChange}
                    placeholder="Contoh: 12"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">Angsuran Per Bulan</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-slate-500 text-sm font-bold">Rp</span>
                  <input 
                    required
                    type="number"
                    name="cicilan"
                    value={formData.cicilan}
                    onChange={handleChange}
                    placeholder="0"
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 flex items-center gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-sm text-slate-300 transition-all border border-white/10"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-2xl font-bold text-sm text-white transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sinkronisasi...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <span>Daftarkan Anggota</span>
                  </>
                )}
              </button>
            </div>
            
            <p className="text-[9px] text-center text-slate-500 font-bold uppercase tracking-widest animate-pulse">
              Sistem akan otomatis menyuntikkan rumus keuangan ke Spreadsheet
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;