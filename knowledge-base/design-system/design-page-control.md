# Reimaji – Design System: Page Control (Dots)

Sumber utama: Figma frame `Page Control` pada file `Design-System--Community-` (node `245:6578`).

Page control digunakan untuk menampilkan posisi user di antara beberapa halaman/slide dalam konteks kompak (mis. carousel, onboarding slider), biasanya menggunakan DOT.

---

## 1. Konsep & Prinsip

- Representasi halaman/slide sebagai titik (dot) berderet.  
- Satu dot aktif (halaman saat ini); lainnya pasif.  
- Cocok untuk:
  - Carousel konten.  
  - Onboarding multi-screen.

---

## 2. Layout & Size

- Container:
  - `flex items-center justify-center gap-2`.  
  - Biasanya ditempatkan di bawah carousel/slider.

- Dot:
  - Bentuk: lingkaran atau pil kecil (sesuai Figma).  
  - Ukuran:
    - Pasif: diameter kecil (mis. 6–8px).  
    - Aktif: bisa lebih besar atau berbeda bentuk (pil).

---

## 3. Colors & States

Gunakan token dari `design-colors.md`:

- Pasif:
  - Background: `muted` atau `muted-foreground` dengan opacity.  

- Aktif:
  - Background: `primary`.  
  - Border (jika ada): `primary`.

- Hover (desktop):
  - Boleh menonjol sedikit (lebih terang) namun jangan mengalahkan dot aktif.

---

## 4. Mapping ke Komponen (React)

### 4.1 API (usulan)

```ts
interface PageControlProps {
  count: number
  currentIndex: number // 0-based
  onChange?: (index: number) => void
}
```

### 4.2 Base Classes

- Wrapper:
  - `flex items-center justify-center gap-2`

- Dot:
  - Base: `h-2 w-2 rounded-full bg-muted`  
  - Active: `data-[active=true]:h-2 data-[active=true]:w-4 data-[active=true]:rounded-full data-[active=true]:bg-primary`.

---

## 5. Aturan Penggunaan

- Gunakan page control:
  - Jika jumlah halaman/slide relatif kecil (3–7).  
  - UI bersifat visual dan tidak memerlukan label halaman.

- Pastikan:
  - Indikasi aktif jelas.  
  - Kontrol navigasi (arrow kiri/kanan, swipe) tetap tersedia; page control bersifat pendukung, bukan satu-satunya cara navigasi.

