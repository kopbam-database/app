/**
 * KOPBAM DIGITAL - BACKEND SCRIPT V14
 * LOGIKA: INSERT AT ROW 2 (ALWAYS NEWEST TOP)
 * STRUKTUR: A(NIK), B(NAMA), C(PLAFON), D(CICILAN), E(TENOR), F(PAID), G(STATUS), H(TOTAL), I(PIUTANG), J(TERBAYAR), K(TANGGAL)
 */

const SHEET_NAME = "Sheet1";

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["NIK", "NAMA", "PLAFON", "CICILAN", "TENOR", "PAID", "STATUS PEMBAYARAN", "JUMLAH JIKA LUNAS", "PIUTANG", "JUMLAH YANG SUDAH TERBAYAR", "TANGGAL SETORAN"]);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = data.slice(1).map(row => {
    let obj = {};
    headers.forEach((header, i) => {
      const key = header.toString().toLowerCase().trim().replace(/\s+/g, '_');
      obj[key] = row[i];
    });
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify({data: result}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const params = e.parameter;

  try {
    // 1. LOGIKA BAYAR ANGSURAN
    if (params.nama && !params.nik) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (data[i][1].toString().trim() === params.nama.trim()) {
          const currentPaid = parseInt(data[i][5] || 0);
          sheet.getRange(i + 1, 6).setValue(currentPaid + 1); // Tambah PAID di kolom F
          sheet.getRange(i + 1, 11).setValue(new Date()); // Update Tanggal di kolom K
          return createJson({status: "sukses"});
        }
      }
      return createJson({status: "error", message: "Nama tidak ditemukan"});
    }

    // 2. LOGIKA TAMBAH ANGGOTA (INSERT DI BARIS 2)
    if (params.nik && params.nama) {
      // Masukkan baris kosong di baris ke-2 (di bawah header)
      sheet.insertRowBefore(2);

      // Isi Data Manual ke Baris 2 (Kolom A - F)
      sheet.getRange(2, 1).setValue(params.nik);             // A: NIK
      sheet.getRange(2, 2).setValue(params.nama);            // B: NAMA
      sheet.getRange(2, 3).setValue(Number(params.plafon));  // C: PLAFON
      sheet.getRange(2, 4).setValue(Number(params.cicilan)); // D: CICILAN
      sheet.getRange(2, 5).setValue(Number(params.tenor));   // E: TENOR
      sheet.getRange(2, 6).setValue(0);                      // F: PAID (Awal 0)

      // Masukkan Rumus Eksak merujuk ke baris 2 (Kolom G - J)
      // G: STATUS PEMBAYARAN
      sheet.getRange(2, 7).setFormula('=IF(OR(E2="",F2=""),"EMPTY",IF(ABS(ROUND(F2,0)-ROUND(E2,0))=0,"LUNAS","PROSES"))');
      
      // H: JUMLAH JIKA LUNAS (=E2*D2)
      sheet.getRange(2, 8).setFormula('=E2*D2');
      
      // I: PIUTANG (=H2-(F2*D2))
      sheet.getRange(2, 9).setFormula('=H2-(F2*D2)');
      
      // J: JUMLAH YANG SUDAH TERBAYAR (=H2-I2)
      sheet.getRange(2, 10).setFormula('=H2-I2');

      // K: TANGGAL
      sheet.getRange(2, 11).setValue(new Date());

      // Format IDR untuk kolom C, D, H, I, J
      [3, 4, 8, 9, 10].forEach(col => {
        sheet.getRange(2, col).setNumberFormat('#,##0');
      });

      SpreadsheetApp.flush();
      return createJson({status: "sukses"});
    }
  } catch (err) {
    return createJson({status: "error", message: err.toString()});
  }
}

function createJson(response) {
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}