export interface Member {
  nik: string;
  nama: string;
  plafon: number | string;
  cicilan: number | string;
  tenor: number | string;
  paid: number | string;
  status_pembayaran: string;
  jumlah_jika_lunas: number | string;
  piutang: number | string;
  jumlah_yang_sudah_terbayar: number | string;
  tanggal_setoran_terbaru?: string;
  payment_history?: string[];
}

export interface CooperativeStats {
  totalMembers: number;
  totalReceivables: number;
  totalPaid: number;
  totalSettledProjection: number;
  totalLunasCount: number;
}

export type TabType = 'dashboard' | 'members' | 'loans' | 'analysis' | 'print';