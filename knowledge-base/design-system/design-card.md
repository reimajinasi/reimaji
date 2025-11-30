# Reimaji – Design System: Card

Sumber utama: Figma frame `Card` pada file `Design-System--Community-` (node `270:9889`).

Card adalah kontainer visual untuk mengelompokkan informasi dan aksi yang saling terkait, misalnya:
- Ringkasan berita/research.  
- Informasi course/lesson.  
- Panel status atau metrik.

---

## 1. Konsep & Prinsip

- Card memberikan:
  - Background berbeda dari halaman utama.  
  - Padding dan radius yang konsisten.  
  - Opsional: shadow untuk depth.
- Satu card = satu unit informasi/aksi yang logis.

---

## 2. Variants

### 2.1 Visual

- `card-default`
  - Background: `card`.  
  - Border: `border`.  
  - Shadow: ringan (`shadow-100`/`shadow-200`) atau none.

- `card-elevated`
  - Background: `card`.  
  - Shadow: lebih kuat (`shadow-300`/`shadow-400`).  
  - Border optional.

- `card-outline`
  - Background: `background`.  
  - Border: `border` lebih jelas.  
  - Tanpa shadow.

### 2.2 Content Layout (pattern)

- Card dengan:
  - Header (title + meta).  
  - Body (content utama).  
  - Footer (actions, link).

---

## 3. Layout & Spacing

- Padding:
  - Umum: `p-4` (mobile) dan `p-6` (desktop) – sesuaikan Figma.  
- Radius:
  - `rounded-lg` atau `rounded-xl` sesuai design system global.

- Header:
  - Title: `typo-h5`/`typo-giant` kecil.  
  - Meta: `typo-caption-1` `text-muted-foreground` (timestamp, author).

- Footer:
  - Actions (button/link) ditempatkan di bawah, sejajar kanan atau space-between dengan info lain.

---

## 4. Colors

- Background:
  - `card` untuk card utama.  
  - Bisa gunakan varian semantic (success/warning) untuk card status khusus.

- Text:
  - Title: `foreground`.  
  - Body: `body-1` `text-foreground`.  
  - Meta: `muted-foreground`.

---

## 5. Mapping ke Komponen (React)

Pola mirip `Card` di shadcn, disesuaikan:

```ts
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline'
}
```

Base classes:
- `rounded-lg border bg-card text-foreground shadow-100`  
- Variants:
  - `elevated`: `shadow-300`.  
  - `outline`: `bg-background shadow-none`.

Sub-komponen:
- `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

---

## 6. Aturan Penggunaan

- Gunakan card untuk:
  - Mengelompokkan konten yang dapat berdiri sendiri (feed item, panel).  
  - Menyusun grid/list UI yang konsisten.

- Hindari:
  - Card di dalam card terlalu dalam (nesting berat).  
  - Card tanpa cukup padding/kontras yang menyebabkan tampak menyatu dengan background.

