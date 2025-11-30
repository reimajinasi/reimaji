# Reimaji – Design System: Colors

Bagian ini mendeskripsikan token warna utama Reimaji. Nilai warna (hex/hsl) diambil dari Figma; dokumen ini fokus ke **nama token dan penggunaannya**, supaya mudah dipetakan ke Tailwind dan shadcn.

## 1. Prinsip Umum Colors

- Gunakan **palet terbatas** dan konsisten; hindari menambah warna ad-hoc.  
- Bedakan jelas:
  - Warna brand (primary).  
  - Warna struktur UI (background, surface, border).  
  - Warna semantik (success, warning, danger, info).  
- Warna teks harus selalu punya kontras yang cukup terhadap background (ikuti WCAG bila memungkinkan).

## 2. Token Warna Utama (Berbasis shadcn Tokens)

Token berikut disejajarkan dengan pola shadcn (background/card/primary/dsb) agar integrasi mudah.

Untuk setiap token, isi nilai dari Figma saat implementasi (misalnya di CSS variables):
- `--background`, `--foreground`  
- `--card`, `--card-foreground`  
- `--muted`, `--muted-foreground`  
- `--accent`, `--accent-foreground`  
- `--primary`, `--primary-foreground`  
- `--border`, `--input`, `--ring`  
- `--destructive`, `--destructive-foreground`  
- (opsional) `--success`, `--success-foreground`, `--warning`, `--warning-foreground`

### 2.1 Base & Surface

1. **`color-background`**
   - CSS var: `--background`  
   - Penggunaan:
     - Background utama aplikasi (body).  
   - Tailwind: `bg-background`, `text-foreground`.

2. **`color-foreground`**
   - CSS var: `--foreground`  
   - Penggunaan:
     - Teks utama di atas `background`.

3. **`color-card`**
   - CSS var: `--card`  
   - Penggunaan:
     - Background kartu (NewsCard, ResearchCard, Card di dashboard).  
   - Pasangan teks: `--card-foreground`.

4. **`color-muted`**
   - CSS var: `--muted`  
   - Penggunaan:
     - Background elemen sekunder: badge low-emphasis, chip, blok info sekunder.

5. **`color-border`**
   - CSS var: `--border`  
   - Penggunaan:
     - Border komponen (card, input, divider halus).

6. **`color-input`**
   - CSS var: `--input`  
   - Penggunaan:
     - Border input field (text field, textarea, select).

### 2.2 Brand / Primary

7. **`color-primary`**
   - CSS var: `--primary`  
   - Penggunaan:
     - Tombol utama (Primary Button).  
     - Link penting, highlight utama, CTA.

8. **`color-primary-foreground`**
   - CSS var: `--primary-foreground`  
   - Penggunaan:
     - Teks/icon di atas background `primary` (mis. label tombol).

9. **`color-accent`**
   - CSS var: `--accent`  
   - Penggunaan:
     - Hover state, chip, highlight ringan (contoh: tab aktif).  
   - Teks: `--accent-foreground`.

### 2.3 Semantic

10. **`color-destructive`**
    - CSS var: `--destructive`  
    - Penggunaan:
      - Aksi berbahaya (hapus, batalkan pembayaran, dsb).  
      - Error alert background.

11. **`color-destructive-foreground`**
    - CSS var: `--destructive-foreground`  
    - Penggunaan:
      - Teks di atas background destructive.

12. **`color-success`** (opsional namun direkomendasikan)
    - CSS var: `--success`  
    - Penggunaan:
      - Status berhasil: badge “Sukses”, indikator progress tuntas, dsb.

13. **`color-warning`**
    - CSS var: `--warning`  
    - Penggunaan:
      - Peringatan: notifikasi “butuh perhatian”, mis. subscription akan habis.

14. **`color-info`** (opsional)
    - CSS var: `--info`  
    - Penggunaan:
      - Informasi netral (bukan sukses/gagal).

## 3. Aturan Penggunaan Warna

- **Primary vs Accent**
  - `primary`: untuk aksi utama (primary CTA).  
  - `accent`: untuk penekanan ringan (hover, selected tab, pill).

- **Background vs Card vs Muted**
  - `background`: level paling bawah (body).  
  - `card`: kontainer konten utama (card, panel).  
  - `muted`: konten sekunder, placeholder, background info ringan.

- **Semantic**
  - Gunakan `destructive` hanya untuk tindakan/keadaan berbahaya.  
  - `success`, `warning`, `info` digunakan konsisten di seluruh app untuk status.

## 4. Panduan Tailwind Config untuk Colors

```ts
// tailwind.config.(ts|js)
theme: {
  extend: {
    colors: {
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      card: 'hsl(var(--card))',
      'card-foreground': 'hsl(var(--card-foreground))',
      muted: 'hsl(var(--muted))',
      'muted-foreground': 'hsl(var(--muted-foreground))',
      primary: 'hsl(var(--primary))',
      'primary-foreground': 'hsl(var(--primary-foreground))',
      accent: 'hsl(var(--accent))',
      'accent-foreground': 'hsl(var(--accent-foreground))',
      border: 'hsl(var(--border))',
      input: 'hsl(var(--input))',
      ring: 'hsl(var(--ring))',
      destructive: 'hsl(var(--destructive))',
      'destructive-foreground': 'hsl(var(--destructive-foreground))',
      success: 'hsl(var(--success))',
      warning: 'hsl(var(--warning))',
      info: 'hsl(var(--info))',
    },
  },
}
```

Di CSS (global, misalnya `globals.css`), isilah nilai actual dari Figma:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... dan seterusnya, diisi sesuai warna dari Figma Reimaji ... */
}
```

Setelah itu, komponen bisa menggunakan class seperti:
- `bg-background`, `text-foreground`, `bg-card`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-destructive`, dsb.

