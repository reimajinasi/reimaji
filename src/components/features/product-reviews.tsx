import { Card } from '@/components/ui/card'

const products = [
  {
    name: 'Gemini 2.5 Flash',
    fungsi: 'Generative assistant cepat untuk teks & gambar',
    spesialisasi: 'Ringkasan, brainstorming, ideasi visual',
    kekuatan: 'Cepat, biaya efisien, integrasi luas',
    kelemahan: 'Akurasi turun pada tugas teknis berat',
    unggulan: true,
  },
  {
    name: 'OpenAI o4-mini',
    fungsi: 'Reasoning ringan untuk tugas analitis',
    spesialisasi: 'Analisis tabel, QA singkat',
    kekuatan: 'Reasoning lebih stabil',
    kelemahan: 'Lebih lambat dari model flash',
    unggulan: false,
  },
]

export function ProductReviews() {
  return (
    <div className='space-y-4'>
      {products.map(p => (
        <Card key={p.name} className='p-4 space-y-1'>
          <div className='flex items-center gap-2'>
            <div className='font-semibold'>{p.name}</div>
            {p.unggulan && <span className='text-xs text-primary'>Unggulan</span>}
          </div>
          <div className='text-sm'>Fungsi: {p.fungsi}</div>
          <div className='text-sm'>Spesialisasi: {p.spesialisasi}</div>
          <div className='text-sm'>Kekuatan: {p.kekuatan}</div>
          <div className='text-sm'>Kelemahan: {p.kelemahan}</div>
        </Card>
      ))}
    </div>
  )
}
