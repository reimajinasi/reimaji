export type NewsTemplate = {
  title: string
  summary: string
  content: string
  type: 'tool' | 'use_case' | 'regulation'
  tags: string[]
  sourceUrl?: string
  imageUrl?: string
  isPremium: boolean
  isPublished: boolean
}

export type ResearchTemplate = {
  title: string
  summary: string
  implication: string
  content: string
  tags: string[]
  paperUrl?: string
  imageUrl?: string
  isPremium: boolean
  isPublished: boolean
}

export function createNewsTemplate(partial: Partial<NewsTemplate>): NewsTemplate {
  return {
    title: 'Judul Berita',
    summary: 'Ringkasan 1 paragraf yang padat dan jelas.',
    content: 'Konten lengkap berita.',
    type: 'tool',
    tags: [],
    isPremium: false,
    isPublished: false,
    ...partial,
  }
}

export function createResearchTemplate(partial: Partial<ResearchTemplate>): ResearchTemplate {
  return {
    title: 'Judul Riset',
    summary: 'Ringkasan paper 1 paragraf.',
    implication: 'Prediksi/implikasi praktis ke depan.',
    content: 'Konten ringkas riset yang mudah dipahami.',
    tags: [],
    isPremium: false,
    isPublished: false,
    ...partial,
  }
}
