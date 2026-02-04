/**
 * KOPBAM DIGITAL - PERFECTION SCRIPT V18
 * LOGIKA: DYNAMIC HISTORY CAPTURING
 */

const NAMA_SHEET = "Sheet1";

function doGet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(NAMA_SHEET);
  
  if (!sheet) {
    sheet = ss.insertSheet(NAMA_SHEET);
    sheet.appendRow([
      "NIK", "NAMA", "PLAFON", "CICILAN", "TENOR", "PAID", 
      "STATUS PEMBAYARAN", "JUMLAH JIKA LUNAS", "PIUTANG", 
      "JUMLAH YANG SUDAH TERBAYAR", "TANGGAL SETORAN TERBARU"
    ]);
  }
  
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const result = data.slice(1).map(row => {
    let obj = {};
    let history = [];
    headers.forEach((header, i) => {
      const key = header.toString().toLowerCase().trim().replace(/\s+/g, '_');
      // Kolom 0-9 (A-J) adalah data inti
      if (i < 10) {
        obj[key] = row[i];
      } 
      // Kolom 10 (K) ke kanan adalah riwayat tanggal (Timestamp Shifting)
      else if (row[i]) {
        // Simpan semua tanggal yang ada sebagai history
        history.push(row[i]);
      }
    });
    obj['payment_history'] = history;
    // Kolom K (index 10) tetap dianggap tanggal terbaru untuk kompatibilitas UI lama
    obj['tanggal_setoran_terbaru'] = row[10] || ""; 
    return obj;
  });
  
  return ContentService.createTextOutput(JSON.stringify({data: result}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(NAMA_SHEET);
  const params = e.parameter;

  try {
    if (params.action === "pay" || (params.nama && !params.nik)) {
      const data = sheet.getDataRange().getValues();
      const targetNama = params.nama.toString().trim().toLowerCase();
      
      for (let i = 1; i < data.length; i++) {
        if (data[i][1].toString().trim().toLowerCase() === targetNama) {
          const rowNum = i + 1;
          const currentPaid = parseInt(data[i][5] || 0);
          sheet.getRange(rowNum, 6).setValue(currentPaid + 1); 
          
          const cellK = sheet.getRange(rowNum, 11);
          cellK.insertCells(SpreadsheetApp.Dimension.COLUMNS);
          SpreadsheetApp.flush();
          
          const now = new Date();
          sheet.getRange(rowNum, 11)
               .setValue(now)
               .setNumberFormat('dd/mm/yyyy HH:mm:ss');
          
          sheet.getRange(rowNum, 11).setBackground('#f0f9ff');
          sheet.getRange(rowNum, 12).setBackground(null); 
          
          SpreadsheetApp.flush();
          return createJsonResponse({status: "sukses", message: "Pembayaran diproses dan tanggal digeser."});
        }
      }
      return createJsonResponse({status: "error", message: "Nama tidak ditemukan"});
    }

    if (params.nik && params.nama) {
      sheet.insertRowBefore(2);
      sheet.getRange(2, 1).setValue("'" + params.nik);       
      sheet.getRange(2, 2).setValue(params.nama.toUpperCase().trim()); 
      sheet.getRange(2, 3).setValue(Number(params.plafon));  
      sheet.getRange(2, 4).setValue(Number(params.cicilan)); 
      sheet.getRange(2, 5).setValue(Number(params.tenor));   
      sheet.getRange(2, 6).setValue(0);                      
      sheet.getRange(2, 7).setFormula('=IF(OR(E2="",F2=""),"EMPTY",IF(ABS(ROUND(F2,0)-ROUND(E2,0))=0,"LUNAS","PROSES"))');
      sheet.getRange(2, 8).setFormula('=E2*D2');
      sheet.getRange(2, 9).setFormula('=H2-(F2*D2)');
      sheet.getRange(2, 10).setFormula('=H2-I2');
      sheet.getRange(2, 11).setValue(new Date()).setNumberFormat('dd/mm/yyyy HH:mm:ss');
      sheet.getRange("C2:D2").setNumberFormat('#,##0');
      sheet.getRange("H2:J2").setNumberFormat('#,##0');
      SpreadsheetApp.flush();
      return createJsonResponse({status: "sukses", message: "Anggota baru berhasil ditambahkan."});
    }
    return createJsonResponse({status: "error", message: "Parameter tidak lengkap."});
  } catch (err) {
    return createJsonResponse({status: "error", message: err.toString()});
  }
}

function createJsonResponse(response) {
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}