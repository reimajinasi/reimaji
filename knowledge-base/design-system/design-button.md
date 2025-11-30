# Reimaji – Design System: Button

Sumber: Figma frame `Button` – node `32:2` pada file `Design-System--Community-`.

Button di Reimaji mengikuti skala size (Giant–Tiny), style (Filled, Outline, Clear), content (Icons + Text, Only Icons), dan state (Default, Hover, Focus, Press, Disabled).

Dokumen ini mendefinisikan aturan desain yang akan dipetakan ke komponen `Button` (berbasis shadcn/ui) di kode.

---

## 1. Struktur Variants

### 1.1 Variant Dimension

- **Size**  
  - `giant`  
  - `large`  
  - `medium`  
  - `small`  
  - `tiny`

- **Style / Appearance**  
  - `filled` – tombol utama ber-background solid.  
  - `outline` – border jelas, background transparan/lighter.  
  - `clear` – hampir tanpa background/border, fokus pada teks/icon (ghost/tertiary).

- **Content**  
  - `icons-text` – icon + label text.  
  - `icon-only` – hanya icon (bulat/persegi sesuai size).

- **State**  
  - `default`  
  - `hover`  
  - `focus`  
  - `press`  
  - `disabled`

Implementasi di kode (usulan):
- Component `Button` menerima props:
  - `size: "giant" | "large" | "medium" | "small" | "tiny"`  
  - `variant: "filled" | "outline" | "clear"`  
  - `iconOnly?: boolean` (true ⇒ icon-only)  
  - `disabled?: boolean`
- State `hover`, `focus`, `press` diatur via CSS/pseudo-classes, bukan sebagai props manual.

---

## 2. Size & Layout

Berikut mapping umum size dari Figma (berdasarkan ukuran frame di metadata; padding detail bisa diambil langsung dari Figma saat implementasi):

### 2.1 Filled – Icons + Text

(Width bervariasi tergantung text; height mengikuti size.)

- **Giant**
  - Tinggi: ~56px  
  - Contoh Figma: `Size=Giant, State=Default, Content=Icons + Text, Style=Filled` (symbol `34:1085`).  
  - Teks: `typo-giant`.  
  - Penggunaan: CTA utama besar (mis. di hero).

- **Large**
  - Tinggi: ~48px  
  - Contoh: symbol `34:1241`.  
  - Teks: `typo-large`.  
  - Penggunaan: tombol utama standar di halaman.

- **Medium**
  - Tinggi: ~40px  
  - Contoh: symbol `34:1255`.  
  - Teks: `typo-medium`.  
  - Penggunaan: tombol di area padat (card, toolbar).

- **Small**
  - Tinggi: ~32px  
  - Contoh: symbol `34:1269`.  
  - Teks: `typo-small`.  
  - Penggunaan: tombol kecil (filter, tag action).

- **Tiny**
  - Tinggi: ~24px  
  - Contoh: symbol `34:1283`.  
  - Teks: `typo-tiny` atau `typo-small`.  
  - Penggunaan: pill/button sangat kecil (secondary).

### 2.2 Icon-Only

Untuk setiap size terdapat varian icon-only (frame persegi):

- Giant: 56×56  
- Large: 48×48  
- Medium: 40×40  
- Small: 32×32  
- Tiny: 24×24

Aturan:
- Icon di-center; gunakan ukuran icon proporsional (mis. 20–24px untuk giant/large).  
- Tetap menggunakan style yang sama (filled/outline/clear) untuk background/border.

---

## 3. Style (Filled, Outline, Clear)

### 3.1 Filled

- Background: `color-primary`.  
- Text/icon: `color-primary-foreground`.  
- Border: bisa `transparent` atau `color-primary` (sesuai Figma).  
- Shadow: biasanya `shadow-200` (atau level yang ditentukan Figma) untuk tombol utama penting.

Penggunaan:
- CTA utama di halaman, tombol aksi penting di dashboard/LMS.

### 3.2 Outline

- Background: `transparent` atau `color-card` sangat tipis.  
- Border: `color-primary`.  
- Text/icon: `color-primary`.  
- Shadow: minimal atau none.

Penggunaan:
- Aksi sekunder di samping tombol utama.  
- Dipakai ketika perlu penekanan tetapi tidak sekuat filled.

### 3.3 Clear (Ghost)

- Background: `transparent` (mengikuti background sekitar).  
- Border: none atau border sangat halus (`color-border`).  
- Text/icon: `color-foreground` atau `color-primary` (sesuai Figma).  
- Shadow: none.

Penggunaan:
- Aksi tertiary (mis. “Learn more”, “Cancel”).  
- Icon-only button yang tidak ingin terlalu dominan (mis. more/options).

---

## 4. States (Default, Hover, Focus, Press, Disabled)

### 4.1 Default

- Warna sesuai style (Filled/Outline/Clear) dan size.  
- Border-radius, padding, dan typography mengikuti token design system.

### 4.2 Hover

Dari Figma: setiap size dan style punya state `Hover` terpisah.

- Prinsip umum:
  - Filled: background sedikit lebih gelap/terang dari default (tint/shade).  
  - Outline: border atau background memiliki sedikit perubahan (fill tipis).  
  - Clear: background bisa mendapat `color-muted` tipis.
- Implementasi:
  - Gunakan `:hover` dengan perubahan warna yang konsisten dengan tokens warna (mis. gunakan varian `primary-hover` jika didefinisikan, jika tidak: gunakan opacity/brightness).

### 4.3 Focus

State `Focus` tersedia di Figma untuk tiap style/size.

- Prinsip:
  - Tetap pada warna `default`/`hover` tapi dengan ring fokus.  
  - Ring: gunakan `--ring` atau `color-primary` via Tailwind `ring` utilities.
- Implementasi:
  - Tambahkan kelas: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.

### 4.4 Press (Active)

State `Press` (active) tersedia di Figma.

- Prinsip:
  - Satu tingkat lebih gelap dari `hover` (untuk Filled).  
  - Outline/Clear: background sedikit lebih solid dibanding hover.
- Implementasi:
  - Gunakan `:active` untuk mengubah background/border sesuai pola Figma.

### 4.5 Disabled

State `Disabled` tersedia untuk Filled, Outline, Clear.

- Prinsip:
  - Kontras menurun: warna mendekati `muted`.  
  - Cursor: `not-allowed`.  
  - Tidak ada efek hover/focus/press.
- Implementasi:
  - CSS: 
    - `opacity` diturunkan (mis. 0.5) atau gunakan warna `muted`.  
    - Nonaktifkan pointer events jika perlu untuk icon-only.

---

## 5. Mapping ke Komponen Button (shadcn/ui)

Target: satu komponen `Button` reusable di `components/ui/button.tsx` dengan API yang sederhana namun bisa mengekspresikan desain Figma.

### 5.1 API Komponen (usulan)

```ts
type ButtonSize = 'giant' | 'large' | 'medium' | 'small' | 'tiny'
type ButtonVariant = 'filled' | 'outline' | 'clear'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  iconOnly?: boolean
}
```

Default:
- `size = "medium"`  
- `variant = "filled"`  
- `iconOnly = false`

### 5.2 Mapping Size → Tailwind Classes

Contoh (nilai padding/width perlu disesuaikan dari Figma saat implementasi):

- `giant`
  - Height: `h-14` (~56px)  
  - Padding X: `px-6`–`px-7`  
  - Text: `text-giant`

- `large`
  - Height: `h-12` (~48px)  
  - Padding X: `px-5`  
  - Text: `text-large`

- `medium`
  - Height: `h-10` (~40px)  
  - Padding X: `px-4`  
  - Text: `text-medium`

- `small`
  - Height: `h-8` (~32px)  
  - Padding X: `px-3`  
  - Text: `text-small`

- `tiny`
  - Height: `h-6` (~24px)  
  - Padding X: `px-2.5`  
  - Text: `text-tiny`

Icon-only:
- Width = Height (mis. `w-10 h-10` untuk medium).  
- Center content (`flex items-center justify-center`).

### 5.3 Mapping Variant → Classes

Filled:
- `bg-primary text-primary-foreground`  
- `hover:bg-primary/90` (atau token khusus)  
- `disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed`

Outline:
- `border border-primary text-primary bg-transparent`  
- `hover:bg-primary/5`  
- `disabled:border-muted disabled:text-muted-foreground`

Clear:
- `bg-transparent text-foreground` atau `text-primary` (sesuai Figma)  
- `hover:bg-muted`  
- `disabled:text-muted-foreground`

Ring/focus:
- Tambahkan ke semua variant:  
  `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`

---

## 6. Catatan Implementasi

- Ikuti `design-typography.md` untuk pemilihan text style (Giant–Tiny).  
- Ikuti `design-colors.md` untuk warna background/border/text.  
- Ikuti `design-shadows.md` jika button memerlukan depth (mis. CTA utama).
- Jika nanti di Figma muncul variant baru (mis. Destructive, Success button):
  - Tambahkan `variant` baru di komponen dan dokumentasikan pola warna baru di dokumen terpisah atau di file ini.

