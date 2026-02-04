import React, { useState, useEffect, useMemo } from 'react';
import { Member, TabType, CooperativeStats } from './types';
import { API_URL, Icons } from './constants';
import StatCard from './components/StatCard';
import MemberDetailModal from './components/MemberDetailModal';
import PaymentModal from './components/PaymentModal';
import PaymentReceiptModal from './components/PaymentReceiptModal';
import AddMemberModal from './components/AddMemberModal';
import InstallmentCardView from './components/InstallmentCardView';
import { analyzeCooperativeData } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

// Login View Component
const LoginView: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hardcoded permanent credentials as requested
    setTimeout(() => {
      if (username === 'KOPBAM' && password === 'ANGGA2026') {
        localStorage.setItem('kopbam_auth', 'true');
        onLogin();
      } else {
        setError('Kredensial salah. Silakan periksa kembali.');
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center gradient-bg p-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="glass-card w-full max-w-md p-12 rounded-[3rem] border border-white/10 relative z-10 shadow-5xl animate-fade-in">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-white rounded-3xl mb-6 p-3 shadow-2xl animate-bounce-slow">
            <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M15 20 V80 M15 50 H30 L50 20 M30 50 L50 80" stroke="black" strokeWidth="8" fill="none" strokeLinecap="round" /><path d="M45 25 C65 15, 85 40, 70 50 C85 60, 65 85, 45 75 Z" fill="#0ea5e9" opacity="0.9" /><path d="M60 40 L75 40 M60 60 L75 60" stroke="white" strokeWidth="4" /><path d="M75 30 V70 L90 50 Z" fill="#3b82f6" /></svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">KOPBAM DIGITAL</h1>
          <p className="text-blue-400 font-bold text-[10px] tracking-[0.4em] uppercase text-center">Security Gateway v2.0</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              placeholder="Masukkan ID Anda"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-3 px-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-3xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center gap-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Akses Dashboard'
            )}
          </button>
        </form>

        <div className="mt-12 text-center opacity-20">
          <p className="text-[8px] font-black tracking-[0.5em] text-white">© 2026 KOPBAM SYSTEM MANAGEMENT</p>
        </div>
      </div>
      
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState<{ members: Member[], total: number } | null>(null);
  const [paymentModal, setPaymentModal] = useState<{ show: boolean, members: Member[], type: 'single' | 'batch' }>({
    show: false,
    members: [],
    type: 'single'
  });

  // Check login on mount
  useEffect(() => {
    const auth = localStorage.getItem('kopbam_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(API_URL + cacheBuster);
      if (!response.ok) throw new Error('Gagal mengambil data dari Google Sheets.');
      const result = await response.json();
      const members = result.data || result;
      setData(Array.isArray(members) ? members : []);
    } catch (err: any) {
      setError(err.message || 'Error loading data');
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const stats: CooperativeStats = useMemo(() => {
    let piutang = 0;
    let terbayar = 0;
    let lunasCount = 0;

    data.forEach(m => {
      piutang += parseFloat(m.piutang as string || '0');
      terbayar += parseFloat(m.jumlah_yang_sudah_terbayar as string || '0');
      if (m.status_pembayaran?.toLowerCase() === 'lunas') lunasCount++;
    });

    return {
      totalMembers: data.length,
      totalReceivables: piutang,
      totalPaid: terbayar,
      totalSettledProjection: piutang + terbayar,
      totalLunasCount: lunasCount
    };
  }, [data]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(m => 
      m.nama?.toLowerCase().includes(query) || 
      m.nik?.toString().includes(query)
    );
  }, [data, searchQuery]);

  const chartData = useMemo(() => {
    return [
      { name: 'Aktif', value: stats.totalReceivables, color: '#3b82f6' },
      { name: 'Terbayar', value: stats.totalPaid, color: '#10b981' }
    ];
  }, [stats]);

  const handleAiAnalysis = async () => {
    setAnalyzing(true);
    setActiveTab('analysis');
    const result = await analyzeCooperativeData(data);
    setAiAnalysis(result);
    setAnalyzing(false);
  };

  const handleBatchPaymentTrigger = () => {
    const unpaidMembers = data.filter(m => m.status_pembayaran?.toLowerCase() !== 'lunas');
    if (unpaidMembers.length === 0) {
      alert("Semua anggota sudah lunas.");
      return;
    }
    setPaymentModal({ show: true, members: unpaidMembers, type: 'batch' });
  };

  const handleSinglePayment = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    setPaymentModal({ show: true, members: [member], type: 'single' });
  };

  const savePaymentToSheet = async (selectedMembers: Member[]) => {
    try {
      const successfulPayments: Member[] = [];
      let totalPaidAmount = 0;

      for (const member of selectedMembers) {
        const params = new URLSearchParams();
        params.append("action", "pay");
        params.append("nama", member.nama);
        
        const response = await fetch(API_URL, { 
          method: "POST", 
          body: params,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          redirect: 'follow' 
        });

        if (response.ok) {
          successfulPayments.push(member);
          totalPaidAmount += parseFloat(member.cicilan as string || '0');
        }
      }
      
      setPaymentModal(prev => ({ ...prev, show: false }));
      
      setPaymentReceipt({
        members: successfulPayments,
        total: totalPaidAmount
      });

      setTimeout(() => fetchData(), 2000);
    } catch (err) {
      alert("Gagal memproses pembayaran. Periksa koneksi internet.");
    }
  };

  const handleCloseReceipt = () => {
    setPaymentReceipt(null);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('kopbam_auth');
    setIsAuthenticated(false);
  };

  const handleAddMember = async (newMember: any) => {
    try {
      const params = new URLSearchParams();
      params.append("nik", newMember.nik);
      params.append("nama", newMember.nama);
      params.append("plafon", newMember.plafon);
      params.append("cicilan", newMember.cicilan);
      params.append("tenor", newMember.tenor);

      const response = await fetch(API_URL, { 
        method: "POST", 
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        redirect: 'follow' 
      });
      
      const result = await response.json();
      
      if (result.status === 'sukses') {
        setIsAddMemberModalOpen(false);
        alert(`BERHASIL: Anggota "${newMember.nama.toUpperCase()}" telah ditambahkan.`);
        setTimeout(() => fetchData(), 2500);
      } else {
        throw new Error(result.message || "Kesalahan server.");
      }
    } catch (err: any) {
      alert("Koneksi gagal atau error: " + err.message);
    }
  };

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  if (!isAuthenticated) {
    return <LoginView onLogin={() => setIsAuthenticated(true)} />;
  }

  if (loading && data.length === 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gradient-bg text-white">
        <div className="w-20 h-20 relative mb-8">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-blue-300 font-bold tracking-widest uppercase text-xs animate-pulse">Menghubungkan Core KOPBAM...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden text-slate-100 gradient-bg">
      <aside className={`${isSidebarCollapsed ? 'w-24' : 'w-80'} flex-shrink-0 flex flex-col border-r border-white/5 bg-slate-900/40 backdrop-blur-3xl transition-all duration-500 relative`}>
        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-3 top-12 w-7 h-7 rounded-xl bg-blue-600 border border-white/20 flex items-center justify-center text-white z-50 hover:bg-blue-500 transition-all shadow-xl active:scale-90">
          {isSidebarCollapsed ? <Icons.ChevronRight /> : <Icons.ChevronLeft />}
        </button>
        <div className={`p-10 ${isSidebarCollapsed ? 'px-6 flex justify-center' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 flex-shrink-0 rounded-2xl bg-white flex items-center justify-center p-2.5">
               <svg viewBox="0 0 100 100" className="w-full h-full"><path d="M15 20 V80 M15 50 H30 L50 20 M30 50 L50 80" stroke="black" strokeWidth="8" fill="none" strokeLinecap="round" /><path d="M45 25 C65 15, 85 40, 70 50 C85 60, 65 85, 45 75 Z" fill="#0ea5e9" opacity="0.9" /><path d="M60 40 L75 40 M60 60 L75 60" stroke="white" strokeWidth="4" /><path d="M75 30 V70 L90 50 Z" fill="#3b82f6" /></svg>
            </div>
            {!isSidebarCollapsed && <div className="animate-fade-in"><h1 className="text-2xl font-black tracking-tighter text-white">KOPBAM</h1><p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Koperasi Banua Mamase</p></div>}
          </div>
        </div>
        <nav className="flex-1 px-5 space-y-2">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-white/5 text-slate-400'}`}><Icons.Dashboard />{!isSidebarCollapsed && <span className="font-bold text-sm">Dashboard</span>}</button>
          <button onClick={() => setActiveTab('members')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'members' ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-white/5 text-slate-400'}`}><Icons.Members />{!isSidebarCollapsed && <span className="font-bold text-sm">Anggota</span>}</button>
          <button onClick={() => setActiveTab('loans')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'loans' ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-white/5 text-slate-400'}`}><Icons.Loans />{!isSidebarCollapsed && <span className="font-bold text-sm">Monitoring</span>}</button>
          <button onClick={() => setActiveTab('print')} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'print' ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-white/5 text-slate-400'}`}><Icons.Payment />{!isSidebarCollapsed && <span className="font-bold text-sm">Cetak Kartu</span>}</button>
          <button onClick={handleAiAnalysis} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === 'analysis' ? 'bg-indigo-600 text-white shadow-xl' : 'hover:bg-indigo-500/10 text-indigo-400'}`}><Icons.AI />{!isSidebarCollapsed && <span className="font-bold text-sm">AI Insights</span>}</button>
        </nav>
        <div className={`p-8 border-t border-white/5 space-y-3 ${isSidebarCollapsed ? 'px-6' : ''}`}>
          <button onClick={fetchData} className={`w-full flex items-center justify-center gap-3 px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-bold transition-all border border-white/10 active:scale-95`}><Icons.Refresh />{!isSidebarCollapsed && "Refresh Database"}</button>
          <button onClick={handleLogout} className={`w-full flex items-center justify-center gap-3 px-5 py-3 bg-red-500/10 hover:bg-red-500/20 rounded-2xl text-[10px] text-red-400 font-black uppercase tracking-widest transition-all border border-red-500/10 active:scale-95`}><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>{!isSidebarCollapsed && "Logout"}</button>
          {!isSidebarCollapsed && (
            <p className="mt-4 text-[10px] text-center text-white/20 font-medium tracking-wider italic">
              Crafted by Anggara Pradana
            </p>
          )}
        </div>
      </aside>
      <main className="flex-1 overflow-auto bg-slate-950/20 relative">
        <header className="px-12 py-10 sticky top-0 z-30 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between">
          <div><h2 className="text-3xl font-black text-white tracking-tighter">
            {activeTab === 'dashboard' ? 'Financial Intelligence' : 
             activeTab === 'members' ? 'Member Directory' : 
             activeTab === 'loans' ? 'Loan Analytics' : 
             activeTab === 'print' ? 'Installment Cards' :
             'Gemini AI Insights'}
          </h2><p className="text-xs text-blue-400/80 font-bold uppercase tracking-[0.2em] mt-1">Management Ecosystem</p></div>
          <div className="flex items-center gap-5">
            <button onClick={() => setIsAddMemberModalOpen(true)} className="group flex items-center gap-3 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-xl active:scale-95"><Icons.Members />Tambah Anggota</button>
            <div className="relative group"><div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500"><Icons.Search /></div><input type="text" placeholder="Cari..." className="pl-12 pr-6 py-3.5 bg-slate-900/80 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none w-56 lg:w-72 text-sm transition-all focus:w-96 placeholder:text-slate-600" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
          </div>
        </header>
        <div className="p-12 pb-24 max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-12 animate-fade-in">
              <div className="glass-card p-1 p-1 overflow-hidden rounded-[2.5rem] border border-blue-500/30 shadow-2xl shadow-blue-500/10">
                <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 p-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-2xl">
                      <Icons.Payment />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">Bayar Angsuran Payroll</h3>
                      <p className="text-blue-300 font-medium mt-1">Proses pembayaran kolektif untuk semua anggota aktif.</p>
                      <div className="flex items-center gap-4 mt-4">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                          {data.filter(m => m.status_pembayaran?.toLowerCase() !== 'lunas').length} Anggota Belum Bayar
                        </span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={handleBatchPaymentTrigger}
                    className="w-full lg:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-3xl transition-all active:scale-95 flex items-center justify-center gap-4"
                  >
                    Mulai Payroll Sekarang
                    <Icons.ChevronRight />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard label="Database" value={stats.totalMembers} sublabel="Anggota terverifikasi" icon={<Icons.Members />} gradient="from-blue-600 to-indigo-600" delay="0s" />
                <StatCard label="Receivables" value={formatIDR(stats.totalReceivables)} sublabel="Pinjaman beredar" icon={<Icons.Loans />} gradient="from-blue-400 to-cyan-500" delay="0.1s" />
                <StatCard label="Cash Inflow" value={formatIDR(stats.totalPaid)} sublabel="Setoran terakumulasi" icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} gradient="from-emerald-500 to-teal-600" delay="0.2s" />
                <StatCard label="Asset Goal" value={formatIDR(stats.totalSettledProjection)} sublabel="Target neraca penuh" icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>} gradient="from-amber-500 to-orange-600" delay="0.3s" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 glass-card p-10 rounded-[2.5rem] border border-white/5 transition-all">
                  <h3 className="text-xl font-black mb-10 flex items-center gap-4"><span className="w-2.5 h-8 bg-blue-500 rounded-full"></span>Financial Rotation Analytics</h3>
                  <div className="h-[350px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} /><XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} /><YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000000}M`} /><Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }} formatter={(value: any) => formatIDR(value)} /><Bar dataKey="value" radius={[12, 12, 4, 4]} barSize={70}>{chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Bar></BarChart></ResponsiveContainer></div>
                </div>
                <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center transition-all">
                   <h3 className="text-xl font-black mb-6 self-start tracking-tight">Debt Collection Ratio</h3>
                   <div className="h-[280px] w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={15} dataKey="value">{chartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px' }} formatter={(value: any) => formatIDR(value)} /></PieChart></ResponsiveContainer></div>
                   <div className="space-y-5 w-full mt-6"><div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"><div className="flex items-center gap-3"><div className="w-3.5 h-3.5 rounded-full bg-blue-500"></div><span className="text-xs font-bold text-slate-400">Piutang Berjalan</span></div><span className="text-sm font-black text-white">{stats.totalSettledProjection > 0 ? Math.round((stats.totalReceivables / stats.totalSettledProjection) * 100) : 0}%</span></div><div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl"><div className="flex items-center gap-3"><div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div><span className="text-xs font-bold text-slate-400">Pengembalian</span></div><span className="text-sm font-black text-white">{stats.totalSettledProjection > 0 ? Math.round((stats.totalPaid / stats.totalSettledProjection) * 100) : 0}%</span></div></div>
                </div>
              </div>
            </div>
          )}
          {(activeTab === 'members' || activeTab === 'loans') && (
            <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden animate-fade-in shadow-3xl">
              <table className="w-full text-left">
                <thead><tr className="bg-slate-900/50 border-b border-white/5"><th className="px-10 py-7 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{activeTab === 'members' ? 'Anggota Koperasi' : 'Account Holder'}</th><th className="px-10 py-7 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{activeTab === 'members' ? 'NIK' : 'Plafon'}</th><th className="px-10 py-7 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{activeTab === 'members' ? 'Tenor' : 'Remaining Debt'}</th><th className="px-10 py-7 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">{activeTab === 'members' ? 'System Status' : 'Paid Out'}</th><th className="px-10 py-7 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">{activeTab === 'members' ? 'Manajemen' : 'Settlement %'}</th></tr></thead>
                <tbody className="divide-y divide-white/5">{filteredData.map((m, i) => {
                  const t = parseFloat(m.jumlah_yang_sudah_terbayar as string || '0');
                  const p = parseFloat(m.plafon as string || '0');
                  const pct = p > 0 ? Math.min(Math.round((t / p) * 100), 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedMember(m)}>
                      <td className="px-10 py-7"><div className="flex items-center gap-5"><div className="w-12 h-12 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 font-black">{m.nama?.charAt(0).toUpperCase()}</div><span className="font-bold text-base text-white">{m.nama}</span></div></td>
                      <td className="px-10 py-7 text-sm font-bold text-slate-500 tracking-wider">{activeTab === 'members' ? m.nik : formatIDR(p)}</td>
                      <td className="px-10 py-7 text-sm font-black text-slate-400">{activeTab === 'members' ? `${m.tenor} Bln` : formatIDR(parseFloat(m.piutang as string || '0'))}</td>
                      <td className="px-10 py-7">{activeTab === 'members' ? <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black tracking-[0.2em] shadow-lg ${m.status_pembayaran?.toLowerCase() === 'lunas' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>{m.status_pembayaran?.toUpperCase() || 'PROSES'}</span> : formatIDR(t)}</td>
                      <td className="px-10 py-7 text-right">{activeTab === 'members' ? <div className="flex items-center justify-end gap-5"><button className="text-blue-400 hover:text-white font-black text-[10px] uppercase tracking-[0.2em]">View Detail</button>{m.status_pembayaran?.toLowerCase() !== 'lunas' && <button onClick={(e) => { e.stopPropagation(); handleSinglePayment(e, m); }} className="px-5 py-2.5 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95">Bayar</button>}</div> : <div className="flex items-center justify-end gap-5"><div className="flex-1 h-3 bg-slate-900/50 rounded-full overflow-hidden w-32"><div className="h-full bg-blue-500 transition-all" style={{ width: `${pct}%` }} /></div><span className="text-xs font-black text-slate-400 w-10">{pct}%</span></div>}</td>
                    </tr>
                  )
                })}</tbody>
              </table>
            </div>
          )}
          {activeTab === 'print' && (
            <InstallmentCardView members={filteredData} />
          )}
          {activeTab === 'analysis' && (
            <div className="glass-card p-14 rounded-[3rem] border border-white/5 animate-fade-in max-w-5xl mx-auto shadow-4xl relative overflow-hidden">
              {analyzing ? <div className="flex flex-col items-center justify-center py-24"><div className="w-24 h-24 relative mb-10"><div className="absolute inset-0 border-[6px] border-indigo-500/10 rounded-full" /><div className="absolute inset-0 border-[6px] border-indigo-500 border-t-transparent rounded-full animate-spin" /></div><h3 className="text-2xl font-black text-white mb-3 tracking-tighter">AI Core Analyzing...</h3></div> : aiAnalysis ? <div className="prose prose-invert max-w-none"><h3 className="text-3xl font-black text-white mb-8 tracking-tighter">Executive Intelligence</h3><div className="bg-slate-900/60 p-10 rounded-[2.5rem] border border-white/5 whitespace-pre-wrap leading-relaxed text-slate-300 font-medium">{aiAnalysis}</div><button onClick={handleAiAnalysis} className="mt-8 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase trackingest text-white shadow-2xl active:scale-95">Regenerate</button></div> : <div className="text-center py-24"><h3 className="text-3xl font-black text-white mb-4 tracking-tighter">AI Analysis</h3><p className="text-slate-400 mb-12 max-w-md mx-auto leading-relaxed">Dapatkan analisis mendalam nasabah secara otomatis.</p><button onClick={handleAiAnalysis} className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 rounded-[2rem] font-black text-lg text-white shadow-2xl active:scale-95">Mulai Analysis</button></div>}
            </div>
          )}
        </div>
      </main>
      {selectedMember && <MemberDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />}
      {paymentModal.show && <PaymentModal members={paymentModal.members} type={paymentModal.type} onClose={() => setPaymentModal({ ...paymentModal, show: false })} onConfirm={savePaymentToSheet} />}
      {paymentReceipt && <PaymentReceiptModal data={paymentReceipt} onClose={handleCloseReceipt} />}
      {isAddMemberModalOpen && <AddMemberModal onClose={() => setIsAddMemberModalOpen(false)} onConfirm={handleAddMember} />}
    </div>
  );
};

export default App;