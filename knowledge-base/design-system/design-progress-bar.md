# Reimaji – Design System: Progress Bar

Sumber utama: Figma frame `Progress Bar` pada file `Design-System--Community-` (node `104:1747`).

Progress bar digunakan untuk menampilkan kemajuan suatu proses atau pencapaian, misalnya:
- Persentase penyelesaian course LMS.  
- Status loading tertentu yang memiliki progress diketahui.  
- Pencapaian goal (mis. 3/5 modul selesai).

---

## 1. Konsep & Prinsip

- Progress bar bersifat **linear** (horizontal).  
- Berisi:
  - Track (jalur) – background lama.  
  - Fill (bar) – bagian terisi yang menunjukkan progress.  
  - Label persentase/teks (opsional) di dalam atau di atas bar.
- Progress ditampilkan sebagai:
  - Nilai 0–100%.  
  - Atau nilai 0–1 yang dikonversi ke % di UI.

---

## 2. Variants

### 2.1 Size

Token size (tebal tinggi bar) mengikuti Figma; secara umum:

- `progress-sm`
  - Tinggi: tipis (mis. 4px).  
  - Digunakan untuk status kecil di dalam komponen lain (card, list).

- `progress-md`
  - Tinggi: sedang (mis. 6–8px).  
  - Digunakan untuk progress utama di halaman atau section.

- `progress-lg`
  - Tinggi: lebih besar (mis. 10–12px).  
  - Untuk area hero / progress utama (mis. course overview).

### 2.2 Color / Semantic

Gunakan warna dari `design-colors.md`:

- Default: `primary`.  
- Success (opsional): `success` (untuk progress goal tercapai).  
- Warning/Error (opsional): `warning` / `destructive` (untuk progress yang butuh perhatian).

---

## 3. Layout & Colors

### 3.1 Track

- Bentuk: rect dengan radius kecil (rounded).  
- Background: `muted` atau `border` dengan opacity.  
- Harus cukup kontras dengan fill agar progress terlihat jelas.

### 3.2 Fill (Bar)

- Warna:
  - Default: `primary`.  
  - Success/Warning/Error: warna semantik sesuai status.  
- Radius:
  - Ikuti track; ujung depan boleh full-rounded sesuai Figma.

### 3.3 Label

- Label teks (opsional):
  - Bisa menampilkan `XX%` atau teks seperti `"3/5 modul selesai"`.  
  - Typography: `typo-caption-1` atau `typo-body-1` kecil.  
  - Posisi:
    - Di atas bar (lebih umum, mudah dibaca).  
    - Atau di dalam bar jika kontras cukup.

---

## 4. Mapping ke Komponen (React)

### 4.1 API Komponen (usulan)

```ts
type ProgressSize = 'sm' | 'md' | 'lg'

interface ProgressBarProps {
  value: number // 0–100
  size?: ProgressSize
  variant?: 'default' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  labelFormatter?: (value: number) => string
}
```

### 4.2 Base Classes

Wrapper:
- `w-full flex flex-col gap-1`

Track:
- `relative w-full overflow-hidden rounded-full bg-muted`
- Tinggi berdasarkan `size`:
  - `sm`: `h-1` atau `h-1.5`  
  - `md`: `h-2`  
  - `lg`: `h-3`

Fill:
- `h-full rounded-full transition-all`  
- Warna:
  - Default: `bg-primary`.  
  - Success: `bg-success`.  
  - Warning: `bg-warning`.  
  - Error: `bg-destructive`.
- Lebar:
  - `style={{ width: \`\${clampedValue}%\` }}` dengan `clampedValue` 0–100.

Label:
- `text-caption-1 text-muted-foreground` (atau variant warna sesuai konteks).

---

## 5. Aturan Penggunaan

- Gunakan progress bar untuk:
  - Proses dengan akhir yang jelas (mis. progress course, upload).  
  - Menunjukkan pencapaian user terhadap target tertentu.

- Jangan:
  - Menggunakan progress bar ketika durasi tidak diketahui (pakai spinner/loader).  
  - Menampilkan lebih dari beberapa progress bar sekaligus tanpa konteks (bisa membingungkan).

- Konsistensi:
  - Typography label mengacu ke `design-typography.md`.  
  - Warna fill & track mengacu ke `design-colors.md`.  
  - Radius dan tinggi selaras dengan gaya umum card/button.

