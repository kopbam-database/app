
import { GoogleGenAI } from "@google/genai";
import { Member } from "../types";

export const analyzeCooperativeData = async (members: Member[]): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const summary = members.map(m => ({
    name: m.nama,
    loan: m.plafon,
    paid: m.jumlah_yang_sudah_terbayar,
    remaining: m.piutang,
    status: m.status_pembayaran
  }));

  const prompt = `
    Anda adalah konsultan keuangan senior untuk Koperasi KOPBAM. 
    Analisis data berikut dan berikan ringkasan eksekutif, analisis risiko, dan rekomendasi strategis dalam Bahasa Indonesia yang profesional.
    Data: ${JSON.stringify(summary.slice(0, 50))} (analisis 50 data teratas).
    Fokus pada:
    1. Kesehatan likuiditas koperasi.
    2. Identifikasi potensi risiko kredit macet.
    3. Rekomendasi untuk meningkatkan setoran anggota.
    4. Gunakan format markdown yang rapi.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Gagal menghasilkan analisis.";
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
};
