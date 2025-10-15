# 🧮 DOKUMENTASI RUMUS PERHITUNGAN SISTEM PENILAIAN KINERJA

## 📊 **RUMUS DASAR**

### **1. RATA-RATA KIPAPP**
```
Rata Kipapp = (Kipapp Bulan 1 + Kipapp Bulan 2 + Kipapp Bulan 3) ÷ 3
```

**Contoh Praktis:**
- Kipapp April: 94,40
- Kipapp Mei: 94,70  
- Kipapp Juni: 94,45
- **Hasil**: (94,40 + 94,70 + 94,45) ÷ 3 = **94,52**

---

### **2. PERSENTASE ABSENSI**
```
Absensi = ((Hari Kerja - Hari Absen) ÷ Hari Kerja) × 100%
```

**Contoh Praktis:**
- Hari kerja dalam sebulan: 22 hari
- Hari absen: 0 hari
- **Hasil**: ((22 - 0) ÷ 22) × 100% = **100%**

---

### **3. TOTAL ABSEN RENAK CAN**
```
Total Absen Renak Can = Renak Bulan 1 + Renak Bulan 2 + Renak Bulan 3
```

**Contoh Praktis:**
- Renak April: 5
- Renak Mei: 5
- Renak Juni: 9
- **Hasil**: 5 + 5 + 9 = **19**

---

## 🎯 **RUMUS TERTIMBANG**

### **A. RATA-RATA TERTIMBANG KIPAPP**

**Formula Excel**: `K$39-(F$39-F2)*K$40/F$40`

**Penjelasan Simbol:**
- `K$39` = 100 (Nilai maksimal absensi)
- `F$39` = Nilai maksimal rata kipapp dari semua pegawai
- `F2` = Rata kipapp pegawai tersebut
- `K$40` = 20 (Range absensi)
- `F$40` = Range rata kipapp dari semua pegawai

**Formula Lengkap:**
```
Rata2 Tertimbang Kipapp = 100 - ((Max Rata Kipapp - Rata Kipapp Pegawai) × 20 ÷ Range Rata Kipapp)
```

**Langkah Perhitungan:**

1. **Cari nilai maksimal rata kipapp** dari semua pegawai
2. **Cari range rata kipapp** (maksimal - minimal)
3. **Hitung selisih** antara maksimal dengan rata kipapp pegawai
4. **Kalikan dengan 20** (range absensi)
5. **Bagi dengan range rata kipapp**
6. **Kurangkan dari 100**

**Contoh Perhitungan Detail:**

**Data Statistik:**
- Max Rata Kipapp: 94,58
- Min Rata Kipapp: 91,85
- Range Rata Kipapp: 94,58 - 91,85 = 2,73

**Data Pegawai:**
- Rata Kipapp Pegawai: 94,52

**Perhitungan:**
1. Selisih: 94,58 - 94,52 = 0,06
2. Kali 20: 0,06 × 20 = 1,2
3. Bagi range: 1,2 ÷ 2,73 = 0,44
4. Kurang dari 100: 100 - 0,44 = **99,56**

---

### **B. RATA-RATA TERTIMBANG RENAK CAN**

**Formula Excel**: `K$39-(O$39-O2)*K$40/O$40`

**Penjelasan Simbol:**
- `K$39` = 100 (Nilai maksimal absensi)
- `O$39` = Total maksimal absen renak dari semua pegawai
- `O2` = Total absen renak pegawai tersebut
- `K$40` = 20 (Range absensi)
- `O$40` = Range total absen renak dari semua pegawai

**Formula Lengkap:**
```
Rata2 Tertimbang Renak Can = 100 - ((Max Total Renak - Total Renak Pegawai) × 20 ÷ Range Total Renak)
```

**Langkah Perhitungan:**

1. **Cari total maksimal renak** dari semua pegawai
2. **Cari range total renak** (maksimal - minimal)
3. **Hitung selisih** antara maksimal dengan total renak pegawai
4. **Kalikan dengan 20** (range absensi)
5. **Bagi dengan range total renak**
6. **Kurangkan dari 100**

**Contoh Perhitungan Detail:**

**Data Statistik:**
- Max Total Renak: 19
- Min Total Renak: 7
- Range Total Renak: 19 - 7 = 12

**Data Pegawai:**
- Total Renak Pegawai: 19

**Perhitungan:**
1. Selisih: 19 - 19 = 0
2. Kali 20: 0 × 20 = 0
3. Bagi range: 0 ÷ 12 = 0
4. Kurang dari 100: 100 - 0 = **100,00**

---

## 🏆 **RUMUS NILAI FINAL**

**Formula Excel**: `(0,4×G2)+(0,4×K2)+(0,2×P2)`

**Penjelasan Simbol:**
- `G2` = Rata2 Tertimbang Kipapp
- `K2` = Absensi
- `P2` = Rata2 Tertimbang Renak Can

**Formula Lengkap:**
```
Nilai Final = (0,4 × Rata2 Tertimbang Kipapp) + (0,4 × Absensi) + (0,2 × Rata2 Tertimbang Renak Can)
```

**Bobot Penilaian:**
- **40%** KIPAPP (Kinerja Pegawai)
- **40%** ABSENSI (Kehadiran)
- **20%** RENAK CAN (Realisasi Kegiatan)

**Contoh Perhitungan Lengkap:**

**Data Pegawai:**
- Rata2 Tertimbang Kipapp: 99,56
- Absensi: 100,00
- Rata2 Tertimbang Renak Can: 100,00

**Perhitungan:**
1. 0,4 × 99,56 = 39,82
2. 0,4 × 100,00 = 40,00
3. 0,2 × 100,00 = 20,00
4. **Total**: 39,82 + 40,00 + 20,00 = **99,82**

---

## 📊 **CONTOH PERHITUNGAN LENGKAP**

### **Data Input:**
```
Pegawai: Ika Feny Lestari STP

KIPAPP:
- April: 94,40
- Mei: 94,70
- Juni: 94,45

ABSENSI:
- April: 0 hari absen
- Mei: 0 hari absen
- Juni: 0 hari absen

RENAK CAN:
- April: 5
- Mei: 5
- Juni: 9
```

### **Langkah Perhitungan:**

**1. Rata Kipapp:**
```
(94,40 + 94,70 + 94,45) ÷ 3 = 94,52
```

**2. Absensi:**
```
April: ((22-0)÷22)×100% = 100%
Mei: ((22-0)÷22)×100% = 100%
Juni: ((22-0)÷22)×100% = 100%
Rata-rata: (100% + 100% + 100%) ÷ 3 = 100%
```

**3. Total Absen Renak Can:**
```
5 + 5 + 9 = 19
```

**4. Rata2 Tertimbang Kipapp:**
```
100 - ((94,58 - 94,52) × 20 ÷ 2,73) = 99,56
```

**5. Rata2 Tertimbang Renak Can:**
```
100 - ((19 - 19) × 20 ÷ 12) = 100,00
```

**6. Nilai Final:**
```
(0,4 × 99,56) + (0,4 × 100,00) + (0,2 × 100,00) = 99,82
```

---

## 🔍 **PENJELASAN KONSEP TERTIMBANG**

### **Mengapa Menggunakan Sistem Tertimbang?**

1. **Keadilan**: Pegawai dengan nilai tinggi mendapat reward lebih besar
2. **Motivasi**: Mendorong pegawai untuk meningkatkan kinerja
3. **Relatif**: Membandingkan dengan standar kelompok, bukan absolut

### **Cara Kerja Sistem Tertimbang:**

1. **Nilai Dasar**: 100 (nilai maksimal)
2. **Penalti**: Dikurangi berdasarkan selisih dengan nilai tertinggi
3. **Proporsi**: Penalti disesuaikan dengan range nilai kelompok

### **Contoh Sederhana:**

**Jika semua pegawai mendapat nilai 90:**
- Range = 0 (tidak ada perbedaan)
- Semua mendapat nilai tertimbang = 100

**Jika ada pegawai dengan nilai 95 dan 85:**
- Range = 10
- Pegawai 95: 100 - ((95-95)×20÷10) = 100
- Pegawai 85: 100 - ((95-85)×20÷10) = 80

---

## 📈 **INTERPRETASI HASIL**

### **Nilai Final:**
- **90-100**: Sangat Baik (A)
- **80-89**: Baik (B)
- **70-79**: Cukup (C)
- **60-69**: Kurang (D)
- **<60**: Sangat Kurang (E)

### **Ranking:**
- **#1**: Nilai tertinggi (Gold)
- **Top 25%**: Excellent (Green)
- **Middle 50%**: Good (Gray)
- **Bottom 25%**: Needs Improvement (Red)

---

## ⚠️ **CATATAN PENTING**

1. **Data Harus Lengkap**: Semua input (KIPAPP, Absensi, RENAK CAN) harus ada
2. **Konsistensi**: Gunakan format yang sama untuk semua data
3. **Validasi**: Sistem akan memvalidasi input sebelum perhitungan
4. **Backup**: Selalu backup data sebelum melakukan perubahan besar

---

*Dokumentasi rumus ini dibuat untuk memastikan transparansi dan keadilan dalam sistem penilaian kinerja pegawai.*
