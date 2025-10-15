# 📊 DOKUMENTASI SISTEM PENILAIAN KINERJA PEGAWAI BPS JOMBANG

## 🎯 **PENDAHULUAN**

Sistem Penilaian Kinerja Pegawai BPS Jombang adalah aplikasi web yang digunakan untuk mengelola dan mengevaluasi kinerja pegawai berdasarkan tiga komponen utama:
1. **KIPAPP** (Kinerja Pegawai Aparatur Sipil Negara)
2. **ABSENSI** (Kehadiran Pegawai)
3. **RENAK CAN** (Realisasi Kegiatan dan Capaian)

---

## 📋 **ALUR KERJA SISTEM**

### **1. INPUT DATA PEGAWAI**
```
Admin → Data Pegawai → Tambah Pegawai
```
- **Nama Pegawai**: Nama lengkap pegawai
- **NIP**: Nomor Induk Pegawai
- **Jabatan**: Posisi/jabatan pegawai

### **2. INPUT DATA KIPAPP**
```
Admin → Data KIPAPP → Tambah Data
```
- **Pegawai**: Pilih pegawai dari dropdown
- **Bulan**: Pilih bulan (1-12)
- **Tahun**: Pilih tahun
- **Nilai KIPAPP**: Input nilai (0-100)

### **3. INPUT DATA ABSENSI**
```
Admin → Data Absen → Tambah Data
```
- **Pegawai**: Pilih pegawai dari dropdown
- **Bulan**: Pilih bulan (1-12)
- **Tahun**: Pilih tahun
- **Hari Tidak Masuk**: Input jumlah hari absen

### **4. INPUT DATA RENAK CAN**
```
Admin → RENAK CAN → Input Realisasi
```
- **Pegawai**: Pilih pegawai dari dropdown
- **Bulan**: Pilih bulan (1-12)
- **Tahun**: Pilih tahun
- **Target**: Set target untuk bulan tersebut
- **Realisasi**: Input realisasi yang dicapai

### **5. GENERATE LAPORAN TRIWULAN**
```
Admin → Laporan Triwulan → Pilih Tahun & Triwulan
```

---

## 🧮 **RUMUS PERHITUNGAN**

### **A. RATA-RATA KIPAPP**
**Formula**: `Rata Kipapp = (Kipapp Bulan 1 + Kipapp Bulan 2 + Kipapp Bulan 3) ÷ 3`

**Contoh**:
- Kipapp April: 94,40
- Kipapp Mei: 94,70
- Kipapp Juni: 94,45
- **Rata Kipapp** = (94,40 + 94,70 + 94,45) ÷ 3 = **94,52**

### **B. PERHITUNGAN ABSENSI**
**Formula**: `Absensi = ((Hari Kerja - Hari Absen) ÷ Hari Kerja) × 100%`

**Contoh**:
- Hari kerja dalam sebulan: 22 hari
- Hari absen: 0 hari
- **Absensi** = ((22 - 0) ÷ 22) × 100% = **100%**

### **C. TOTAL ABSEN RENAK CAN**
**Formula**: `Total Absen Renak Can = Renak Bulan 1 + Renak Bulan 2 + Renak Bulan 3`

**Contoh**:
- Renak April: 5
- Renak Mei: 5
- Renak Juni: 9
- **Total Absen Renak Can** = 5 + 5 + 9 = **19**

### **D. RATA-RATA TERTIMBANG KIPAPP**
**Formula Excel**: `K$39-(F$39-F2)*K$40/F$40`

**Penjelasan**:
- K$39 = 100 (Nilai maksimal absensi)
- F$39 = Nilai maksimal rata kipapp dari semua pegawai
- F2 = Rata kipapp pegawai tersebut
- K$40 = 20 (Range absensi)
- F$40 = Range rata kipapp dari semua pegawai

**Formula Lengkap**:
```
Rata2 Tertimbang Kipapp = 100 - ((Max Rata Kipapp - Rata Kipapp Pegawai) × 20 ÷ Range Rata Kipapp)
```

**Contoh Perhitungan**:
- Max Rata Kipapp: 94,58
- Rata Kipapp Pegawai: 94,52
- Range Rata Kipapp: 2,73
- **Rata2 Tertimbang Kipapp** = 100 - ((94,58 - 94,52) × 20 ÷ 2,73) = **99,56**

### **E. RATA-RATA TERTIMBANG RENAK CAN**
**Formula Excel**: `K$39-(O$39-O2)*K$40/O$40`

**Penjelasan**:
- K$39 = 100 (Nilai maksimal absensi)
- O$39 = Total maksimal absen renak dari semua pegawai
- O2 = Total absen renak pegawai tersebut
- K$40 = 20 (Range absensi)
- O$40 = Range total absen renak dari semua pegawai

**Formula Lengkap**:
```
Rata2 Tertimbang Renak Can = 100 - ((Max Total Renak - Total Renak Pegawai) × 20 ÷ Range Total Renak)
```

**Contoh Perhitungan**:
- Max Total Renak: 19
- Total Renak Pegawai: 19
- Range Total Renak: 12
- **Rata2 Tertimbang Renak Can** = 100 - ((19 - 19) × 20 ÷ 12) = **100,00**

### **F. NILAI FINAL**
**Formula Excel**: `(0,4×G2)+(0,4×K2)+(0,2×P2)`

**Penjelasan**:
- G2 = Rata2 Tertimbang Kipapp
- K2 = Absensi
- P2 = Rata2 Tertimbang Renak Can
- **Bobot**: 40% KIPAPP + 40% ABSENSI + 20% RENAK CAN

**Formula Lengkap**:
```
Nilai Final = (0,4 × Rata2 Tertimbang Kipapp) + (0,4 × Absensi) + (0,2 × Rata2 Tertimbang Renak Can)
```

**Contoh Perhitungan**:
- Rata2 Tertimbang Kipapp: 99,56
- Absensi: 100,00
- Rata2 Tertimbang Renak Can: 100,00
- **Nilai Final** = (0,4 × 99,56) + (0,4 × 100,00) + (0,2 × 100,00) = **99,82**

---

## 📊 **STRUKTUR LAPORAN TRIWULAN**

### **Kolom-kolom dalam Laporan:**

| No | Kolom | Deskripsi | Contoh |
|----|-------|-----------|---------|
| A | No | Nomor urut pegawai | 1, 2, 3, ... |
| B | Nama | Nama lengkap pegawai | Ika Feny Lestari STP |
| C | Kipapp Apr | Nilai KIPAPP April | 94,40 |
| D | Kipapp Mei | Nilai KIPAPP Mei | 94,70 |
| E | Kipapp Jun | Nilai KIPAPP Juni | 94,45 |
| F | Rata Kipapp | Rata-rata 3 bulan | 94,52 |
| G | Rata2 Tertimbang (Kipapp) | Nilai tertimbang KIPAPP | 99,56 |
| H | Absen Apr | Hari absen April | 0 |
| I | Absen Mei | Hari absen Mei | 0 |
| J | Absen Jun | Hari absen Juni | 0 |
| K | ABSENSI | Persentase kehadiran | 100,00 |
| L | ABSEN RENAK CAN APR | Realisasi April | 5 |
| M | ABSEN RENAK CAN MEI | Realisasi Mei | 5 |
| N | ABSEN RENAK CAN JUN | Realisasi Juni | 9 |
| O | TOTAL ABSEN RENAK | Total 3 bulan | 19 |
| P | Rata2 Tertimbang (Renak Can) | Nilai tertimbang RENAK | 100,00 |
| Q | Final | Nilai akhir | 99,82 |
| R | Peringkat | Ranking pegawai | 1, 2, 3, ... |

---

## 🎯 **PEMBAGIAN TRIWULAN**

### **Triwulan 1**: Januari - Maret
### **Triwulan 2**: April - Juni  
### **Triwulan 3**: Juli - September
### **Triwulan 4**: Oktober - Desember

---

## 📈 **STATISTIK YANG DITAMPILKAN**

### **1. Statistik Rata Kipapp**
- **Min**: Nilai terendah rata kipapp
- **Max**: Nilai tertinggi rata kipapp  
- **Range**: Selisih max - min

### **2. Statistik ABSENSI**
- **Min**: Persentase kehadiran terendah
- **Max**: Persentase kehadiran tertinggi
- **Range**: Selisih max - min

### **3. Statistik TOTAL ABSEN RENAK**
- **Min**: Total renak terendah
- **Max**: Total renak tertinggi
- **Range**: Selisih max - min

---

## 🏆 **SISTEM RANKING**

### **Peringkat Berdasarkan Nilai Final:**
1. **#1**: Nilai final tertinggi (Gold badge)
2. **Top 25%**: Badge hijau (Secondary)
3. **Middle 50%**: Badge abu-abu (Outline)
4. **Bottom 25%**: Badge merah (Destructive)

---

## 🔧 **FITUR SISTEM**

### **1. Dashboard Admin**
- **Statistik Real-time**: Total pegawai, rata-rata KIPAPP, tingkat kehadiran
- **Quick Access Cards**: Akses cepat ke semua menu
- **Widgets**: Top performers, attendance alerts

### **2. Manajemen Data**
- **CRUD Pegawai**: Create, Read, Update, Delete data pegawai
- **CRUD KIPAPP**: Kelola nilai kinerja pegawai
- **CRUD Absensi**: Kelola data kehadiran
- **CRUD RENAK CAN**: Kelola target dan realisasi

### **3. Laporan Triwulan**
- **Format Excel**: 18 kolom sesuai standar Excel
- **Perhitungan Otomatis**: Semua rumus dihitung otomatis
- **Ranking**: Peringkat otomatis berdasarkan nilai final
- **Export**: Dapat di-export ke PDF/Excel

### **4. Responsive Design**
- **Mobile**: Layout single column, horizontal scroll
- **Tablet**: Layout 2 kolom, sidebar collapsible
- **Desktop**: Layout penuh dengan sidebar tetap

---

## 🚀 **DEPLOYMENT**

### **Environment Variables yang Diperlukan:**
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Build Command:**
```bash
npm run build
```

### **Deployment ke Vercel:**
1. Connect repository ke Vercel
2. Set environment variables
3. Deploy otomatis

---

## 📱 **AKSES SISTEM**

### **URL Aplikasi:**
- **Development**: `http://localhost:8081`
- **Production**: `https://your-app.vercel.app`

### **Login:**
- **Admin**: Akses penuh ke semua fitur
- **User**: Akses terbatas sesuai role

---

## 🆘 **TROUBLESHOOTING**

### **Masalah Umum:**

1. **Data tidak muncul di laporan triwulan**
   - Pastikan data KIPAPP, Absensi, dan RENAK CAN sudah diinput
   - Periksa filter tahun dan triwulan

2. **Perhitungan tidak sesuai**
   - Pastikan data input sudah benar
   - Periksa formula di dokumentasi

3. **Layout tidak responsif**
   - Refresh halaman
   - Periksa ukuran browser

---

## 📞 **DUKUNGAN TEKNIS**

Untuk bantuan teknis atau pertanyaan tentang sistem, silakan hubungi:
- **Email**: admin@bpsjombang.go.id
- **Telepon**: (0321) 123456

---

## 📝 **VERSI DOKUMENTASI**

- **Versi**: 1.0
- **Tanggal**: Desember 2024
- **Pembuat**: Tim Pengembangan BPS Jombang

---

*Dokumentasi ini dibuat untuk memudahkan pengguna dalam memahami dan menggunakan sistem penilaian kinerja pegawai BPS Jombang.*
