# 🛡️ Development Guidelines - Prevent Infinite Loops

## ⚠️ COMMON PITFALLS (WAJIB DIHINDARI!)

### 1. **useForm() Object in Dependencies**
```typescript
// ❌ SALAH - Infinite Loop!
const form = useForm();
useEffect(() => {
  form.reset(data);
}, [data, form]); // form berubah setiap render!

// ✅ BENAR
useEffect(() => {
  form.reset(data);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [data]); // Hanya depend on data
```

### 2. **Fetch Functions Tanpa Guard**
```typescript
// ❌ SALAH - Bisa fetch berkali-kali
useEffect(() => {
  fetchData();
}, []);

// ✅ BENAR - Pakai useRef guard
const hasFetched = useRef(false);
useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;
  fetchData();
}, []);
```

### 3. **Auth Dependencies**
```typescript
// ❌ SALAH - session/user object berubah reference
useEffect(() => {
  if (session && user) {
    fetchData();
  }
}, [session, user, fetchData]); // Objects berubah!

// ✅ BENAR - Check boolean dan use ref guard
const hasFetched = useRef(false);
useEffect(() => {
  if (authLoading) return;
  if (!session || !user) return;
  if (hasFetched.current) return;
  
  hasFetched.current = true;
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [authLoading]); // Hanya depend on loading state
```

### 4. **Console.log Berlebihan**
```typescript
// ❌ HINDARI - Buat debugging sulit
console.log("Component rendered");
console.log("Data:", data);
console.log("Loading:", loading);

// ✅ GUNAKAN hanya untuk error
console.error("[ComponentName] Error:", error);

// ✅ ATAU gunakan conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log("[Debug]", data);
}
```

---

## ✅ BEST PRACTICES

### Pattern 1: Fetch Data on Mount
```typescript
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const { session, user, loading: authLoading } = useAuth();
const hasFetched = useRef(false);

useEffect(() => {
  const loadData = async () => {
    // 1. Check auth loading
    if (authLoading) return;
    
    // 2. Check authentication
    if (!session || !user) {
      setIsLoading(false);
      return;
    }
    
    // 3. Guard against multiple fetches
    if (hasFetched.current) return;
    
    // 4. Fetch
    try {
      setIsLoading(true);
      hasFetched.current = true;
      const result = await fetchData();
      setData(result);
    } catch (error) {
      console.error("[ComponentName] Error:", error);
      hasFetched.current = false; // Reset on error
    } finally {
      setIsLoading(false);
    }
  };
  
  loadData();
  
  // 5. IMPORTANT: Cleanup on unmount
  return () => {
    hasFetched.current = false; // Reset so data refetches on remount
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [authLoading]); // Only depend on authLoading
```

### Pattern 2: Form Reset on Edit
```typescript
const [editingItem, setEditingItem] = useState(null);
const editForm = useForm();

useEffect(() => {
  if (editingItem) {
    editForm.reset(editingItem);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [editingItem]); // JANGAN include editForm!
```

### Pattern 3: Fetch with Button Click (No useEffect)
```typescript
// ✅ TIDAK perlu useEffect untuk button click
const handleLoadReport = async () => {
  setIsLoading(true);
  try {
    const data = await fetchReport(year, quarter);
    setReportData(data);
  } catch (error) {
    console.error("[Report] Error:", error);
  } finally {
    setIsLoading(false);
  }
};

// Di JSX
<Button onClick={handleLoadReport}>Load Report</Button>
```

---

## 🚨 DEBUGGING INFINITE LOOPS

### Step 1: Identify Loop
1. Buka Browser Console (F12)
2. Lihat apakah ada log yang berulang
3. Check React DevTools → Components → Highlight updates

### Step 2: Find Cause
```typescript
// Add di awal component
console.log('[ComponentName] Render count:', ++renderCount);

// Add di useEffect
useEffect(() => {
  console.log('[ComponentName] useEffect triggered');
  // ... rest of code
}, [dependencies]); // Check dependencies
```

### Step 3: Fix
- Remove unstable dependencies (objects, functions)
- Add useRef guard untuk fetch
- Add eslint-disable comment dengan alasan jelas

---

## 📋 CHECKLIST SEBELUM COMMIT

- [ ] Tidak ada console.log berlebihan (kecuali error)
- [ ] Semua fetch pakai useRef guard
- [ ] useForm() TIDAK di dependencies
- [ ] Semua useEffect punya empty deps atau stable deps only
- [ ] Test: Tidak ada infinite loop di console
- [ ] Test: Data load cepat (< 1 detik)

---

## 🔄 MIGRATION GUIDE (Untuk Fix Existing Code)

### Before:
```typescript
useEffect(() => {
  fetchData();
}, [fetchData, auth, toast]);
```

### After:
```typescript
const hasFetched = useRef(false);
useEffect(() => {
  if (hasFetched.current) return;
  hasFetched.current = true;
  fetchData();
  
  // Cleanup: reset on unmount
  return () => {
    hasFetched.current = false;
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

---

## 🎯 SUMMARY

**3 GOLDEN RULES:**
1. **useRef Guard** untuk semua fetch on mount
2. **JANGAN** include objects/functions di dependencies
3. **Test** di browser - pastikan tidak ada re-render berlebihan

**Saat menambah fitur baru:**
- Copy pattern dari file yang sudah ada (Kipapp.tsx, Absen.tsx)
- JANGAN add dependencies baru tanpa cek apakah stable
- Test immediately di browser setelah save

---

*Last Updated: 2025-10-14*
*By: AI Assistant - Fix Infinite Loop Issues*

