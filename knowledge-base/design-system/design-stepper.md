# Reimaji – Design System: Stepper

Sumber utama: Figma frame `Stepper` pada file `Design-System--Community-` (node `245:7558`).

Stepper digunakan untuk menampilkan dan mengontrol langkah-langkah dalam proses multi-step (wizard, form bertahap, progress flow).

---

## 1. Konsep & Prinsip

- Menampilkan urutan step:
  - Langkah-langkah diberi nomor atau icon (1, 2, 3, …).  
  - Step saat ini disorot.  
  - Step selesai/berhasil diberi tanda (check).  
- Cocok untuk:
  - Onboarding multi-step.  
  - Form panjang yang dipecah menjadi beberapa langkah.

---

## 2. States per Step

- `completed` – step sudah selesai:
  - Icon: check.  
  - Warna: `success` / `primary`.

- `current` – step aktif saat ini:
  - Di-highlight (warna lebih kuat, border atau background).  
  - Label teks lebih menonjol.

- `upcoming` – step yang belum dijalankan:
  - Warna: `muted-foreground`.  
  - Icon: nomor step.

---

## 3. Layout & Orientation

- Horizontal stepper:
  - Step disusun sejajar (row).  
  - Garis penghubung di antara step (line) menunjukkan hubungan urutan.

- Vertical stepper (opsional):
  - Step disusun kolom, garis vertikal menghubungkan.

Layout step:
- Icon/number dalam lingkaran/pil.  
- Label (judul step) di bawah/samping icon.  
- Optional description di bawah label.

---

## 4. Colors & Typography

Gunakan `design-colors.md` dan `design-typography.md`:

- Completed:
  - Icon background: `success` atau `primary`.  
  - Icon (check): `primary-foreground` / `background`.  
  - Label: `foreground`.

- Current:
  - Border atau background menonjol (`primary`/`accent`).  
  - Label: `foreground` semi-bold.

- Upcoming:
  - Icon border: `border` / `muted-foreground`.  
  - Label: `muted-foreground`.

Typography:
- Label step: `typo-caption-2` atau `typo-body-2`.  
- Description: `typo-caption-1` dengan `text-muted-foreground`.

---

## 5. Mapping ke Komponen (React)

### 5.1 API (usulan)

```ts
type StepStatus = 'completed' | 'current' | 'upcoming'

type Step = {
  key: string
  label: string
  description?: string
}

interface StepperProps {
  steps: Step[]
  currentIndex: number // 0-based
  onStepClick?: (index: number) => void
}
```

### 5.2 Base Classes

- Wrapper (horizontal):
  - `flex items-center justify-between gap-4`

- Step item:
  - Icon wrapper: `flex flex-col items-center gap-1`  
  - Icon circle:
    - Base: `h-6 w-6 flex items-center justify-center rounded-full border text-caption-2`.  
    - Completed: `bg-primary text-primary-foreground border-primary`.  
    - Current: `border-primary text-primary`.  
    - Upcoming: `border-muted text-muted-foreground`.

- Connector line:
  - `h-[2px] flex-1 bg-border`  
  - Completed: `bg-primary`.

---

## 6. Aturan Penggunaan

- Gunakan stepper:
  - Jika proses memiliki 3–7 langkah yang jelas.  
  - Jika user perlu melihat posisi dan langkah tersisa.

- Jangan:
  - Menggunakan stepper untuk proses sangat panjang (>10 step).  
  - Membingungkan label step dengan label tab (stepper adalah alur, bukan kategori bebas).

