export const seedNews = Array.from({ length: 20 }).map((_, i) => ({
  title: `Berita AI #${i + 1}`,
  summary: 'Inti kabar 1 paragraf ala X dengan tautan More.',
  content: 'Konten lengkap berita yang ringkas.',
  type: i % 3 === 0 ? 'tool' : i % 3 === 1 ? 'use_case' : 'regulation',
  tags: ['ai'],
  isPremium: false,
  isPublished: true,
}))

export const seedResearch = Array.from({ length: 15 }).map((_, i) => ({
  title: `Riset AI #${i + 1}`,
  summary: 'Ringkasan paper 1 paragraf.',
  implication: 'Prediksi masa depan terkait temuan riset.',
  content: 'Konten riset yang mudah dipahami.',
  tags: ['research'],
  isPremium: false,
  isPublished: true,
}))

export const seedCourse = {
  title: 'Fundamental Generative AI',
  slug: 'fundamental-generative-ai',
  description: 'Dasar-dasar Generative AI untuk pekerja non-teknis.',
  tags: ['course', 'ai'],
  isPublished: true,
}

export const seedModules = [
  { title: 'Pengantar Generative AI', order: 1, description: 'Overview dan istilah' },
  { title: 'Prompting Dasar', order: 2, description: 'Cara menyusun prompt' },
  { title: 'Penggunaan di Kerja', order: 3, description: 'Studi kasus' },
  { title: 'Etika & Risiko', order: 4, description: 'Mitigasi risiko' },
]

export const seedLessons = [
  { title: 'Apa itu Generative AI?', order: 1, content: 'Materi pengantar', isPublished: true },
  { title: 'Teknik Prompting 101', order: 2, content: 'Materi prompting', isPublished: true },
]
