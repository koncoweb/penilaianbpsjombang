# 📊 Sistem Penilaian Kinerja Pegawai BPS Jombang

Sistem penilaian kinerja pegawai yang komprehensif untuk Badan Pusat Statistik (BPS) Jombang dengan fitur dashboard real-time, laporan triwulan Excel-like, dan perhitungan otomatis.

## 🎯 **Fitur Utama**

- **🏠 Dashboard Admin**: Statistik real-time dan quick access
- **👥 Manajemen Pegawai**: CRUD data pegawai lengkap
- **📊 KIPAPP**: Kelola nilai kinerja pegawai
- **📅 Absensi**: Tracking kehadiran pegawai
- **🎯 RENAK CAN**: Target dan realisasi kegiatan
- **📋 Laporan Triwulan**: Format Excel dengan 18 kolom
- **📱 Responsive Design**: Mobile, tablet, dan desktop
- **🚀 Vercel Ready**: Deployment otomatis

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+
- npm atau pnpm
- Supabase account

### **Installation**
```bash
# Clone repository
git clone https://github.com/koncoweb/penilaianbpsjombang.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan Supabase credentials

# Run development server
npm run dev
```

### **Environment Variables**
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 **Dokumentasi Lengkap**

### **📖 [Panduan Pengguna](PANDUAN_PENGGUNA.md)**
Panduan step-by-step untuk menggunakan sistem:
- Cara login dan navigasi
- Input data pegawai, KIPAPP, absensi, RENAK CAN
- Generate laporan triwulan
- Troubleshooting umum

### **🧮 [Rumus Perhitungan](RUMUS_PERHITUNGAN.md)**
Dokumentasi lengkap rumus matematika:
- Rata-rata KIPAPP
- Persentase absensi
- Rata-rata tertimbang
- Nilai final dengan bobot 40-40-20
- Contoh perhitungan detail

### **📊 [Dokumentasi Sistem](DOKUMENTASI_SISTEM.md)**
Dokumentasi teknis dan alur kerja:
- Arsitektur sistem
- Alur input hingga laporan
- Struktur database
- API endpoints

## 🏗️ **Struktur Proyek**

```
src/
├── components/          # Komponen UI
│   ├── dashboard/       # Widget dashboard
│   ├── layouts/         # Layout aplikasi
│   └── ui/              # Komponen UI dasar
├── entities/            # Data layer
│   ├── absen/           # Entity absensi
│   ├── employees/       # Entity pegawai
│   ├── kipapp/          # Entity KIPAPP
│   ├── renakcan/        # Entity RENAK CAN
│   └── stats/           # Entity statistik
├── hooks/               # Custom hooks
├── integrations/        # Integrasi eksternal
│   └── supabase/        # Supabase client
├── pages/               # Halaman aplikasi
│   ├── admin/           # Halaman admin
│   └── Index.tsx        # Dashboard utama
├── utils/               # Utility functions
└── contexts/            # React contexts
```

## 🧮 **Sistem Perhitungan**

### **Rumus Dasar**
- **Rata KIPAPP**: `(Bulan1 + Bulan2 + Bulan3) ÷ 3`
- **Absensi**: `((Hari Kerja - Absen) ÷ Hari Kerja) × 100%`
- **Total RENAK**: `Renak1 + Renak2 + Renak3`

### **Rumus Tertimbang**
- **KIPAPP Tertimbang**: `100 - ((Max - Nilai) × 20 ÷ Range)`
- **RENAK Tertimbang**: `100 - ((Max - Total) × 20 ÷ Range)`

### **Nilai Final**
```
Final = (0,4 × KIPAPP Tertimbang) + (0,4 × Absensi) + (0,2 × RENAK Tertimbang)
```

## 📊 **Laporan Triwulan**

### **18 Kolom Excel-like:**
1. No
2. Nama
3. Kipapp Bulan 1
4. Kipapp Bulan 2
5. Kipapp Bulan 3
6. Rata Kipapp
7. Rata2 Tertimbang (Kipapp)
8. Absen Bulan 1
9. Absen Bulan 2
10. Absen Bulan 3
11. ABSENSI
12. ABSEN RENAK CAN Bulan 1
13. ABSEN RENAK CAN Bulan 2
14. ABSEN RENAK CAN Bulan 3
15. TOTAL ABSEN RENAK
16. Rata2 Tertimbang (Renak Can)
17. Final
18. Peringkat

## 🎨 **UI/UX Features**

### **Dashboard**
- Statistik real-time
- Quick access cards
- Performance widgets
- Recent activity

### **Responsive Design**
- **Mobile**: Single column, horizontal scroll
- **Tablet**: 2-column layout
- **Desktop**: Full layout dengan sidebar

### **Components**
- Shadcn UI components
- Custom attendance score
- Interactive charts
- Loading states

## 🚀 **Deployment**

### **Vercel (Recommended)**
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### **Manual Build**
```bash
npm run build
# Deploy dist/ folder to your hosting
```

## 🔧 **Development**

### **Tech Stack**
- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI**: Shadcn UI + Radix UI
- **State**: React Query (TanStack Query)
- **Database**: Supabase (PostgreSQL)
- **Build**: Vite
- **Deploy**: Vercel

### **Scripts**
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # ESLint check
```

## 📱 **Mobile Support**

- **Responsive tables** dengan horizontal scroll
- **Touch-friendly** interface
- **Optimized** untuk mobile performance
- **PWA ready** (Progressive Web App)

## 🔒 **Security**

- **Authentication**: Supabase Auth
- **Authorization**: Role-based access
- **Data validation**: Client & server side
- **Environment variables**: Secure config

## 📈 **Performance**

- **Code splitting**: Automatic dengan Vite
- **Lazy loading**: Route-based
- **Caching**: React Query untuk data
- **Optimized images**: WebP format
- **Bundle size**: < 500KB gzipped

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Data tidak muncul**: Periksa filter dan koneksi
2. **Perhitungan salah**: Validasi input data
3. **Layout rusak**: Refresh browser
4. **Login gagal**: Periksa credentials

### **Debug Mode**
```bash
# Enable debug logging
DEBUG=true npm run dev
```

## 🤝 **Contributing**

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 **License**

MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 📞 **Support**

- **Email**: admin@bpsjombang.go.id
- **Telepon**: (0321) 123456
- **GitHub Issues**: [Create issue](https://github.com/koncoweb/penilaianbpsjombang/issues)

## 🎯 **Roadmap**

- [ ] Export laporan ke PDF
- [ ] Notifikasi real-time
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Multi-tenant support

---

## 📊 **Screenshots**

### **Dashboard**
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+Admin)

### **Laporan Triwulan**
![Laporan](https://via.placeholder.com/800x400/059669/FFFFFF?text=Laporan+Triwulan)

### **Mobile View**
![Mobile](https://via.placeholder.com/400x800/DC2626/FFFFFF?text=Mobile+View)

---

**Dibuat dengan ❤️ untuk BPS Jombang**

*Sistem penilaian kinerja pegawai yang modern, efisien, dan user-friendly.*