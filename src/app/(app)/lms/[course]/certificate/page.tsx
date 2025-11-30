"use client"
import { useEffect } from 'react'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'

export default function Page({ params }: { params: { course: string } }) {
  useEffect(() => {
    // noop
  }, [])
  return (
    <div className="space-y-6 print:p-0">
      <PageHeader
        title="Certificate"
        description="Sertifikat penyelesaian"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'LMS', href: '/lms' }, { label: 'Certificate' }]}
        actions={<button onClick={() => window.print()} className="rounded bg-primary px-3 py-2 text-primary-foreground">Cetak PDF</button>}
      />
      <Section>
        <ContentCard title="Sertifikat" description="Cetak halaman ini sebagai PDF">
          <div className="mx-auto max-w-xl border p-8 text-center">
            <div className="text-2xl font-bold">SERTIFIKAT PENYELESAIAN</div>
            <div className="mt-4 text-sm">Diberikan kepada</div>
            <div className="mt-1 text-xl font-semibold">Nama Pengguna</div>
            <div className="mt-4 text-sm">Atas penyelesaian kursus</div>
            <div className="mt-1 text-lg font-semibold">{params.course}</div>
            <div className="mt-6 text-xs text-muted-foreground">Tanda tangan digital • Reimaji</div>
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}
