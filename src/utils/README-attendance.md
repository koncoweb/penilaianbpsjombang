# Attendance Utils Documentation

Utility functions untuk perhitungan dan format skor absensi yang dapat digunakan di seluruh aplikasi.

## 📁 Files

- `src/utils/attendanceUtils.ts` - Core utility functions
- `src/components/ui/attendance-score.tsx` - Reusable UI components
- `src/hooks/useAttendanceUtils.ts` - React hooks untuk attendance calculations

## 🔧 Core Functions

### `calculateQuarterlyScore(absentDays, workingDays)`
Menghitung skor absensi untuk satu triwulan.

```typescript
const score = calculateQuarterlyScore(5, 92); // 5 hari absen dari 92 hari kerja
// Returns: 95 (95%)
```

### `calculateQuarterlyAttendance(data)`
Menghitung skor untuk semua triwulan dari data bulanan.

```typescript
const data = {
  apr: 1, mei: 2, jun: 0,
  jul: 0, agu: 1, sep: 0,
  okt: 2, nov: 1, des: 0,
  jan: 0, feb: 0, mar: 1
};

const result = calculateQuarterlyAttendance(data);
// Returns: { q1: { score: 97 }, q2: { score: 99 }, q3: { score: 96 }, q4: { score: 99 } }
```

### `calculateAnnualScore(data)`
Menghitung skor tahunan dari data bulanan.

```typescript
const annualScore = calculateAnnualScore(data); // Returns: 97
```

### `calculateQuarterlyStats(employeeData)`
Menghitung statistik min, max, range, dan rata-rata untuk setiap triwulan dari data pegawai.

```typescript
const stats = calculateQuarterlyStats(employeeData);
// Returns: { q1: { min: 85, max: 100, range: 15, avg: 93 }, ... }
```

## 🎨 UI Components

### `AttendanceScore`
Komponen untuk menampilkan skor dengan warna yang sesuai.

```tsx
import { AttendanceScore } from "@/components/ui/attendance-score";

<AttendanceScore score={95} />
<AttendanceScore score={85} showLabel={true} />
```

### `AttendanceScoreBadge`
Badge dengan ukuran yang dapat disesuaikan.

```tsx
<AttendanceScoreBadge score={90} size="lg" />
```

### `AttendanceTrend`
Menampilkan tren perbandingan dengan periode sebelumnya.

```tsx
<AttendanceTrend currentScore={95} previousScore={90} />
```

## 🪝 React Hooks

### `useAttendanceCalculations(data)`
Hook untuk menghitung semua metrik absensi.

```tsx
import { useAttendanceCalculations } from "@/hooks/useAttendanceUtils";

const { quarterly, annual, getScoreColor } = useAttendanceCalculations(data);
```

### `useAttendanceStats(rawData)`
Hook untuk statistik dari data mentah database.

```tsx
const stats = useAttendanceStats(attendanceData);
// Returns: { employeeStats, totalEmployees, averageAnnualScore, bestPerformer, worstPerformer }
```

### `useAttendanceData(rawData)`
Hook untuk mengkonversi data mentah ke format yang mudah digunakan.

```tsx
const attendanceData = useAttendanceData(rawData);
// Returns: Array of { employee_id, data, quarterly, annual }
```

## 🎯 Usage Examples

### Di Dashboard
```tsx
import { useAttendanceStats } from "@/hooks/useAttendanceUtils";
import { AttendanceScoreBadge } from "@/components/ui/attendance-score";

function Dashboard() {
  const { data: attendanceData } = useAbsenData();
  const stats = useAttendanceStats(attendanceData);
  
  return (
    <div>
      <h3>Rata-rata Kehadiran: {stats.averageAnnualScore}%</h3>
      {stats.bestPerformer && (
        <AttendanceScoreBadge score={stats.bestPerformer.annual} size="lg" />
      )}
    </div>
  );
}
```

### Di Laporan
```tsx
import { useAttendanceData } from "@/hooks/useAttendanceUtils";
import { AttendanceScore } from "@/components/ui/attendance-score";

function ReportPage() {
  const { data: rawData } = useAbsenData();
  const attendanceData = useAttendanceData(rawData);
  
  return (
    <table>
      {attendanceData.map(emp => (
        <tr key={emp.employee_id}>
          <td>{emp.employee_id}</td>
          <td><AttendanceScore score={emp.quarterly.q1.score} /></td>
          <td><AttendanceScore score={emp.annual} /></td>
        </tr>
      ))}
    </table>
  );
}
```

### Di Widget
```tsx
import { useAttendanceCalculations } from "@/hooks/useAttendanceUtils";
import { AttendanceTrend } from "@/components/ui/attendance-score";

function AttendanceWidget({ employeeData, previousData }) {
  const current = useAttendanceCalculations(employeeData);
  const previous = useAttendanceCalculations(previousData);
  
  return (
    <AttendanceTrend 
      currentScore={current.annual} 
      previousScore={previous.annual} 
    />
  );
}
```

### Di Dashboard dengan Quarterly Stats
```tsx
import { useAttendanceStats } from "@/hooks/useAttendanceUtils";
import { AttendanceScore } from "@/components/ui/attendance-score";

function DashboardWithStats() {
  const { data: attendanceData } = useAbsenData();
  const stats = useAttendanceStats(attendanceData);
  
  return (
    <div>
      <h3>Statistik Triwulan Q1</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>Min: <AttendanceScore score={stats.quarterlyStats.q1.min} /></div>
        <div>Max: <AttendanceScore score={stats.quarterlyStats.q1.max} /></div>
        <div>Range: {stats.quarterlyStats.q1.range}%</div>
        <div>Rata-rata: <AttendanceScore score={stats.quarterlyStats.q1.avg} /></div>
      </div>
    </div>
  );
}
```

## 📊 Color Coding

- **🟢 Hijau**: ≥90% (Sangat Baik)
- **🟡 Kuning**: 80-89% (Baik)  
- **🔴 Merah**: <80% (Kurang)

## 🔢 Working Days per Month

```typescript
const WORKING_DAYS_PER_MONTH = {
  jan: 31, feb: 28, mar: 31, apr: 30, mei: 31, jun: 30,
  jul: 31, agu: 31, sep: 30, okt: 31, nov: 30, des: 31
};
```

## 📝 Notes

- Semua perhitungan menggunakan `Math.round()` untuk hasil integer
- Formula: `((Hari kerja - Hari absen) / Hari kerja) × 100%`
- Tidak pernah absen = 100%
- Semua fungsi sudah di-optimize dengan `useMemo` untuk performance
