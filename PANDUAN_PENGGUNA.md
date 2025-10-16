# 📖 PANDUAN PENGGUNA SISTEM PENILAIAN KINERJA PEGAWAI BPS JOMBANG

## 📋 **DISCLAIMER**

**APLIKASI INI MERUPAKAN APLIKASI SEDERHANA SEBAGAI HASIL PRAKTEK MAGANG, APABILA MASIH ADA KEKURANGAN ATAU KETIDAK TEPATAN HARAP DI MAKLUMI, MESKIPUN BEGITU APLIKASI INI SUDAH MEMENUHI FUNGSI DASAR PENILAIAN KINERJA PEGAWAI BPS JOMBANG**

## 🎯 **PENDAHULUAN**

Selamat datang di Sistem Penilaian Kinerja Pegawai BPS Jombang! Panduan ini akan membantu Anda menggunakan sistem dengan mudah dan efektif.

---

## 🚀 **CARA MENGAKSES SISTEM**

### **1. Buka Browser**
- Gunakan browser modern (Chrome, Firefox, Safari, Edge)
- Pastikan koneksi internet stabil

### **2. Masuk ke Sistem**
- **URL**: `https://penilaian-bpsjombang.vercel.app/`
- **Login**: Masukkan username : admin@gmail.com dan password : 12345678
- **Klik**: Tombol "Masuk"

---

## 🏠 **DASHBOARD UTAMA**

### **Tampilan Dashboard:**
```
┌─────────────────────────────────────────────────────────┐
│  📊 DASHBOARD ADMIN                                    │
├─────────────────────────────────────────────────────────┤
│  📈 Statistik Real-time                                │
│  ├─ Total Pegawai: 25                                  │
│  ├─ Rata-rata KIPAPP: 92.5%                           │
│  └─ Tingkat Kehadiran: 98.2%                          │
├─────────────────────────────────────────────────────────┤
│  🚀 Akses Cepat                                         │
│  ├─ 👥 Data Pegawai    ├─ 📊 KIPAPP                   │
│  ├─ 📅 Data Absen      ├─ 🎯 RENAK CAN                │
│  └─ 📋 Laporan Triwulan                               │
└─────────────────────────────────────────────────────────┘
```

### **Fitur Dashboard:**
- **Statistik Real-time**: Update otomatis setiap kali data berubah
- **Quick Access Cards**: Akses cepat ke semua menu
- **Widgets**: Informasi penting dan alert

---

## 👥 **MENGELOLA DATA PEGAWAI**

### **A. Menambah Pegawai Baru**

**Langkah-langkah:**
1. **Klik** menu "Data Pegawai"
2. **Klik** tombol "Tambah Pegawai"
3. **Isi form:**
   ```
   Nama Pegawai: [Masukkan nama lengkap]
   NIP: [Masukkan NIP]
   Jabatan: [Pilih jabatan]
   ```
4. **Klik** "Simpan"

**Tips:**
- Nama harus lengkap dan sesuai dengan data resmi
- NIP harus unik (tidak boleh duplikat)
- Jabatan dipilih dari dropdown yang tersedia

### **B. Mengedit Data Pegawai**

**Langkah-langkah:**
1. **Klik** menu "Data Pegawai"
2. **Cari** pegawai yang akan diedit
3. **Klik** tombol "Edit" (ikon pensil)
4. **Ubah** data yang diperlukan
5. **Klik** "Simpan"

### **C. Menghapus Data Pegawai**

**Langkah-langkah:**
1. **Klik** menu "Data Pegawai"
2. **Cari** pegawai yang akan dihapus
3. **Klik** tombol "Hapus" (ikon trash)
4. **Konfirmasi** penghapusan
5. **Klik** "Ya, Hapus"

**⚠️ Peringatan**: Hapus data pegawai akan menghapus semua data terkait (KIPAPP, Absensi, RENAK CAN)

---

## 📊 **MENGELOLA DATA KIPAPP**

### **A. Menambah Data KIPAPP**

**Langkah-langkah:**
1. **Klik** menu "Data KIPAPP"
2. **Klik** tombol "Tambah Data"
3. **Isi form:**
   ```
   Pegawai: [Pilih dari dropdown]
   Bulan: [Pilih bulan 1-12]
   Tahun: [Pilih tahun]
   Nilai KIPAPP: [Masukkan nilai 0-100]
   ```
4. **Klik** "Simpan"

**Contoh Input:**
```
Pegawai: Ika Feny Lestari STP
Bulan: April
Tahun: 2024
Nilai KIPAPP: 94.40
```

### **B. Melihat Data KIPAPP**

**Tampilan Tabel:**
```
┌─────┬─────────────────────┬───────┬──────┬─────────────┐
│ No  │ Nama Pegawai        │ Bulan │ Tahun│ Nilai KIPAPP│
├─────┼─────────────────────┼───────┼──────┼─────────────┤
│ 1   │ Ika Feny Lestari STP│ April │ 2024 │    94.40    │
│ 2   │ John Doe            │ April │ 2024 │    92.50    │
└─────┴─────────────────────┴───────┴──────┴─────────────┘
```

### **C. Filter dan Pencarian**

**Filter berdasarkan:**
- **Bulan**: Pilih bulan tertentu
- **Tahun**: Pilih tahun tertentu
- **Pegawai**: Cari nama pegawai

---

## 📅 **MENGELOLA DATA ABSENSI**

### **A. Menambah Data Absensi**

**Langkah-langkah:**
1. **Klik** menu "Data Absen"
2. **Klik** tombol "Tambah Data"
3. **Isi form:**
   ```
   Pegawai: [Pilih dari dropdown]
   Bulan: [Pilih bulan 1-12]
   Tahun: [Pilih tahun]
   Hari Tidak Masuk: [Masukkan jumlah hari absen]
   ```
4. **Klik** "Simpan"

**Contoh Input:**
```
Pegawai: Ika Feny Lestari STP
Bulan: April
Tahun: 2024
Hari Tidak Masuk: 0
```

### **B. Menghitung Persentase Kehadiran**

**Rumus Otomatis:**
```
Persentase = ((Hari Kerja - Hari Absen) ÷ Hari Kerja) × 100%
```

**Contoh:**
- Hari kerja: 22 hari
- Hari absen: 0 hari
- **Persentase**: ((22-0)÷22)×100% = 100%

---

## 🎯 **MENGELOLA DATA RENAK CAN**

### **A. Menambah Data RENAK CAN**

**Langkah-langkah:**
1. **Klik** menu "RENAK CAN"
2. **Klik** tombol "Input Realisasi"
3. **Isi form:**
   ```
   Pegawai: [Pilih dari dropdown]
   Bulan: [Pilih bulan 1-12]
   Tahun: [Pilih tahun]
   Target: [Masukkan target]
   Realisasi: [Masukkan realisasi]
   ```
4. **Klik** "Simpan"

**Contoh Input:**
```
Pegawai: Ika Feny Lestari STP
Bulan: April
Tahun: 2024
Target: 10
Realisasi: 5
```

### **B. Melihat Summary RENAK CAN**

**Tampilan Summary:**
```
┌─────────────────────┬────────┬──────────┬──────────┐
│ Nama Pegawai        │ Target │ Realisasi│ Pencapaian│
├─────────────────────┼────────┼──────────┼──────────┤
│ Ika Feny Lestari STP│   10   │    5     │   50%    │
│ John Doe            │   15   │   12     │   80%    │
└─────────────────────┴────────┴──────────┴──────────┘
```

---

## 📋 **GENERATE LAPORAN TRIWULAN**

### **A. Membuat Laporan Triwulan**

**Langkah-langkah:**
1. **Klik** menu "Laporan Triwulan"
2. **Pilih Tahun**: Gunakan dropdown tahun
3. **Pilih Triwulan**: 
   - Triwulan 1: Januari - Maret
   - Triwulan 2: April - Juni
   - Triwulan 3: Juli - September
   - Triwulan 4: Oktober - Desember
4. **Klik** "Generate Laporan"

### **B. Membaca Laporan Triwulan**

**Struktur Laporan:**
```
┌─────┬─────────────────────┬─────────┬─────────┬─────────┬─────────────┬─────────────────────┬─────────┬─────────┬─────────┬──────────┬─────────────┬─────────────┬─────────────┬─────────────────┬─────────────────────┬─────────┬──────────┐
│ No  │ Nama                │ Kipapp │ Kipapp │ Kipapp │ Rata Kipapp│ Rata2 Tertimbang   │ Absen  │ Absen  │ Absen  │ ABSENSI │ ABSEN RENAK│ ABSEN RENAK│ ABSEN RENAK│ TOTAL ABSEN RENAK│ Rata2 Tertimbang   │ Final   │ Peringkat│
│     │                     │ Apr    │ Mei    │ Jun    │            │ (Kipapp)           │ Apr    │ Mei    │ Jun    │        │ CAN APR   │ CAN MEI    │ CAN JUN    │                 │ (Renak Can)        │         │          │
├─────┼─────────────────────┼────────┼────────┼────────┼────────────┼────────────────────┼────────┼────────┼────────┼────────┼────────────┼────────────┼────────────┼─────────────────┼────────────────────┼─────────┼──────────┤
│ 1   │ Ika Feny Lestari STP│ 94.40  │ 94.70  │ 94.45  │   94.52    │      99.56         │   0    │   0    │   0    │ 100.00 │     5      │     5      │     9      │       19       │      100.00         │  99.82  │    1     │
└─────┴─────────────────────┴────────┴────────┴────────┴────────────┴────────────────────┴────────┴────────┴────────┴────────┴────────────┴────────────┴────────────┴─────────────────┴────────────────────┴─────────┴──────────┘
```

### **C. Ekspor Laporan Triwulan**

**Langkah-langkah:**
1. **Setelah** memilih tahun dan triwulan
2. **Klik** "Export PDF" untuk file PDF
3. **Klik** "Export Excel" untuk file Excel
4. **File** akan otomatis ter-download

**Fitur Export:**
- **PDF**: Format A4 landscape dengan semua 18 kolom
- **Excel**: File .xlsx dengan formatting professional
- **Judul**: "Laporan Triwulan Penilaian Kinerja BPS Jombang"
- **Subtitle**: Tahun dan triwulan yang dipilih
- **Format**: Angka dengan koma desimal (format Indonesia)

### **D. Statistik Laporan**

**Kartu Statistik:**
```
┌─────────────────┬─────────────────┬─────────────────┐
│ Rata Kipapp     │ ABSENSI        │ TOTAL ABSEN    │
│                 │                │ RENAK          │
├─────────────────┼─────────────────┼─────────────────┤
│ Min: 91.85      │ Min: 95.45%    │ Min: 7         │
│ Max: 94.58      │ Max: 100.00%   │ Max: 19        │
│ Range: 2.73     │ Range: 4.55%   │ Range: 12       │
└─────────────────┴─────────────────┴─────────────────┘
```

---

## 📱 **PENGGUNAAN DI MOBILE**

### **Tampilan Mobile:**
- **Layout**: Single column
- **Navigation**: Hamburger menu
- **Tables**: Horizontal scroll
- **Cards**: Stacked vertically

### **Tips Mobile:**
1. **Rotate**: Putar layar untuk tampilan landscape
2. **Scroll**: Geser horizontal untuk melihat tabel lengkap
3. **Touch**: Tap untuk navigasi dan input

---

## 🔧 **TROUBLESHOOTING**

### **Masalah Umum:**

**1. Data tidak muncul**
- ✅ Periksa filter tahun dan bulan
- ✅ Pastikan data sudah diinput
- ✅ Refresh halaman

**2. Perhitungan salah**
- ✅ Periksa input data
- ✅ Pastikan format angka benar
- ✅ Lihat dokumentasi rumus

**3. Layout rusak**
- ✅ Refresh browser
- ✅ Periksa koneksi internet
- ✅ Gunakan browser terbaru

**4. Login gagal**
- ✅ Periksa username/password
- ✅ Pastikan koneksi internet
- ✅ Hubungi admin

---

## 📞 **BANTUAN**

### **Kontak Dukungan:**
- **Email**: admin@bpsjombang.go.id
- **Telepon**: (0321) 123456
- **Jam Kerja**: Senin-Jumat, 08:00-16:00

### **FAQ (Frequently Asked Questions):**

**Q: Bagaimana cara reset password?**
A: Hubungi admin untuk reset password.

**Q: Data hilang setelah input, kenapa?**
A: Pastikan koneksi internet stabil saat menyimpan data.

**Q: Laporan triwulan kosong, kenapa?**
A: Pastikan data KIPAPP, Absensi, dan RENAK CAN sudah diinput untuk periode tersebut.

**Q: Bisa export laporan ke Excel?**
A: Ya, gunakan fitur export di halaman laporan triwulan.

---

## 🎯 **TIPS PENGGUNAAN**

### **1. Input Data Secara Berkala**
- Input data setiap bulan
- Jangan menumpuk data di akhir periode
- Validasi data sebelum menyimpan

### **2. Backup Data**
- Export data secara berkala
- Simpan backup di tempat aman
- Dokumentasikan perubahan penting

### **3. Monitoring Performa**
- Cek dashboard secara berkala
- Monitor statistik real-time
- Identifikasi trend performa

### **4. Kolaborasi Tim**
- Koordinasi dengan tim terkait
- Dokumentasikan proses
- Berbagi best practices

---

## 📚 **REFERENSI TAMBAHAN**

- **Dokumentasi Sistem**: `DOKUMENTASI_SISTEM.md`
- **Rumus Perhitungan**: `RUMUS_PERHITUNGAN.md`
- **Panduan Admin**: Hubungi tim IT

---

*Panduan ini dibuat untuk memudahkan pengguna dalam menggunakan sistem penilaian kinerja pegawai BPS Jombang dengan efektif dan efisien.*
