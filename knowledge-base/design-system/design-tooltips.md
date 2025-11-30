# Reimaji – Design System: Tooltips

Sumber utama: Figma frame `Tooltip` pada file `Design-System--Community-` (node `104:1491`).

Tooltip digunakan untuk menampilkan informasi tambahan singkat ketika user melakukan hover/focus/tap-and-hold pada elemen tertentu (ikon, tombol, label, dll).

---

## 1. Konsep & Prinsip

- Tooltip bersifat **sekunder**: hanya melengkapi, bukan menggantikan teks utama.  
- Muncul:
  - Di hover/focus (desktop).  
  - Di tap-and-hold atau interaksi khusus (mobile, jika relevan).  
- Konten tooltip:
  - Singkat (1–2 baris).  
  - Tidak berisi aksi (button/link) kecuali pola khusus di desain Figma.

---

## 2. Layout & Typography

- Bentuk:
  - Kontainer kecil dengan background solid dan radius kecil.  
  - Optional arrow kecil yang mengarah ke elemen pemicu.

- Typography:
  - Gunakan `typo-caption-1` atau `typo-caption-2`.  
  - Warna teks: `primary-foreground` / `foreground` tergantung background tooltip.

- Padding:
  - Horizontal: `px-2`–`px-3`.  
  - Vertical: `py-1` (cukup untuk keterbacaan).

---

## 3. Colors & Elevation

Gunakan token dari `design-colors.md` dan `design-shadows.md`.

- Background:
  - Biasanya `foreground` gelap (mis. hitam/abu tua) atau warna khusus tooltip — pastikan kontras tinggi.  
- Text:
  - `primary-foreground` / `background` (putih) ketika background gelap.  
- Border:
  - Boleh tanpa border (hanya background + shadow).

- Shadow:
  - Gunakan `shadow-300` atau `shadow-400` untuk memberi depth di atas konten lain.

---

## 4. Positioning

- Posisi default:
  - Di atas elemen pemicu (top), dengan offset kecil.  
- Posisi alternatif:
  - `bottom` / `left` / `right` jika ruang di atas tidak cukup.  
- Tooltip tidak boleh terpotong oleh viewport; gunakan logika reposition di kode.

---

## 5. Mapping ke Komponen (React / shadcn)

Target: gunakan pola `Tooltip` dari shadcn dan sesuaikan styling ke tokens Reimaji.

### 5.1 API Komponen (usulan)

```ts
interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode // trigger
  side?: 'top' | 'bottom' | 'left' | 'right'
}
```

### 5.2 Base Classes

- Content:
  - `rounded-md bg-foreground px-2 py-1 text-caption-2 text-primary-foreground shadow-300`  
  - Transition untuk muncul/hilang (fade + translate kecil).

- Arrow (opsional):
  - Kecil, warna sama dengan background tooltip.

---

## 6. Aturan Penggunaan

- Gunakan tooltip untuk:
  - Menjelaskan icon yang kurang jelas tanpa label.  
  - Menyediakan detail singkat tanpa mengganggu layout.

- Jangan:
  - Menaruh informasi penting hanya di tooltip (aksesibilitas).  
  - Mengisi tooltip dengan teks panjang atau aksi kompleks.

- Aksesibilitas:
  - Pastikan tooltip muncul pada `focus` (keyboard), bukan hanya `hover`.  
  - Gunakan atribut ARIA (mis. `aria-describedby`) di trigger untuk menghubungkan ke tooltip.

