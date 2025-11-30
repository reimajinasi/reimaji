# Reimaji – Design System: Context Menu

Sumber utama: Figma frame `Context Menu` pada file `Design-System--Community-` (node `234:5540`).

Context menu digunakan untuk menampilkan opsi tambahan ketika user melakukan klik kanan/long-press pada elemen tertentu.

---

## 1. Konsep & Prinsip

- Context menu bersifat kontekstual:
  - Berisi aksi yang relevan hanya untuk objek yang dipilih.  
  - Tidak muncul terus; hanya pada interaksi tertentu (right-click, kebab/menu).
- Biasanya ringan dan kecil, dengan daftar opsi vertikal.

---

## 2. Struktur & Layout

- Menu container:
  - Background: `card`.  
  - Border: `border`.  
  - Shadow: `shadow-400`/`shadow-500`.  
  - Radius: `rounded-md`.

- Item:
  - `flex items-center gap-2 px-3 py-1.5`.  
  - Icon optional di kiri, label teks di kanan.

- Divider:
  - Garis tipis `border` untuk memisahkan kelompok aksi.

---

## 3. Colors & States

- Item default:
  - Text: `foreground`.  
  - Icon: `muted-foreground`.

- Hover:
  - Background: `muted`.  
  - Text: `foreground`.

- Destructive:
  - Text: `destructive`.  
  - Hover: background `destructive` yang lebih lembut atau tetap `muted` (mengikuti Figma).

---

## 4. Mapping ke Komponen (React / shadcn)

Gunakan pola `ContextMenu` dari shadcn (atau kombinasi `DropdownMenu`) dan sesuaikan.

### 4.1 API Komponen (usulan)

```ts
type ContextMenuItem = {
  key: string
  label: string
  icon?: React.ReactNode
  destructive?: boolean
  disabled?: boolean
  onSelect?: () => void
}

interface ContextMenuProps {
  items: (ContextMenuItem | { type: 'divider'; key: string })[]
  children: React.ReactNode // trigger/target
}
```

### 4.2 Base Classes

- Menu:
  - `min-w-[160px] rounded-md border bg-card p-1 shadow-400`.

- Item:
  - `flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-foreground hover:bg-muted`  
  - Disabled: `opacity-50 cursor-not-allowed hover:bg-transparent`.

- Divider:
  - `my-1 h-px bg-border`.

---

## 5. Aturan Penggunaan

- Gunakan context menu:
  - Untuk aksi lanjutan pada item list, kartu, atau area tertentu.  
  - Ketika tidak ingin memenuhi UI dengan tombol aksi di layar utama.

- Pastikan:
  - Menu muncul dekat dengan posisi click/long-press.  
  - Perilaku fallback untuk perangkat tanpa klik kanan (mis. tombol “more”).

