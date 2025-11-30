# Reimaji – Design System: Action Sheet

Sumber utama: Figma frame `Action Sheet` pada file `Design-System--Community-` (node `226:2616`).

Action Sheet adalah panel yang muncul dari bawah layar (umumnya di mobile) untuk menampilkan beberapa aksi terkait konteks saat ini.

---

## 1. Konsep & Prinsip

- Action sheet berada di antara pop-up dan menu:
  - Menutupi bagian bawah layar dengan daftar aksi.  
  - Tidak selalu full-screen seperti modal, tapi cukup menonjol.  
- Cocok untuk:
  - Aksi kontekstual pada item (share, duplicate, delete).  
  - Pilihan mode (sort, filter) pada mobile.

---

## 2. Struktur & Layout

- Overlay:
  - Menutupi seluruh layar dengan background semi-transparan.  
  - `bg-background/70` atau setara.

- Sheet:
  - Panel di bawah (`fixed bottom-0 left-0 right-0`).  
  - Background: `card`.  
  - Radius di atas: `rounded-t-xl`.  
  - Shadow: kuat (`shadow-600`/`shadow-700`).

- Isi:
  - Optional handle bar kecil di atas (indikator drag).  
  - Optional title/description.  
  - Daftar aksi (list items).

---

## 3. Actions & States

- Setiap action item:
  - Struktur: icon (optional) + label teks.  
  - Typography: `typo-body-1`.  
  - Warna:
    - Default: `foreground`.  
    - Destructive: `destructive`.  
    - Secondary: `muted-foreground`.

- States:
  - Hover (desktop simulasi): `bg-muted`.  
  - Active/pressed: `bg-muted` lebih kuat.

---

## 4. Mapping ke Komponen (React)

### 4.1 API Komponen ActionSheet

```ts
type ActionSheetAction = {
  key: string
  label: string
  icon?: React.ReactNode
  destructive?: boolean
  onSelect?: () => void
}

interface ActionSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  actions: ActionSheetAction[]
}
```

### 4.2 Base Classes

- Overlay:
  - `fixed inset-0 z-40 bg-background/70`.

- Sheet:
  - `fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-card shadow-700 border-t border-border`.
  - Inner: `p-4 flex flex-col gap-2`.

- Action item:
  - `flex items-center gap-3 rounded-md px-3 py-2 text-body-1 text-foreground hover:bg-muted`  
  - Destructive: `text-destructive`.

---

## 5. Aturan Penggunaan

- Gunakan action sheet:
  - Terutama di mobile saat perlu menawarkan beberapa aksi terkait item.  
  - Ketika menu biasa (context menu) terlalu kecil untuk interaksi jari.

- Jangan:
  - Memasukkan terlalu banyak aksi (ideal 3–7).  
  - Menggunakan action sheet untuk form panjang (gunakan modal biasa).

