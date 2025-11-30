export const dynamic = 'force-dynamic'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchQuery } from 'convex/nextjs'
import { api } from '../../../../../convex/_generated/api'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import type { Id, Doc } from '../../../../../convex/_generated/dataModel'
import { ShareProgress } from '@/components/features/share-progress'

export default async function Page({ params }: { params: { course: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const course = await fetchQuery(api.courses.getBySlug, { slug: params.course })
  if (!course) redirect('/lms')
  const modules: Array<Doc<'modules'>> = await fetchQuery(api.modules.listByCourse, { courseId: course._id })
  const progress = await fetchQuery(api.progress.getCourseProgress, { clerkUserId: userId!, courseId: course._id })
  return (
    <div className="space-y-6">
      <PageHeader
        title={course.title}
        description={course.description}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'LMS', href: '/lms' }, { label: course.title }]}
        actions={<ShareProgress courseId={course._id as Id<'courses'>} courseTitle={course.title} />}
      />
      <Section>
        <ContentCard title="Navigasi Kursus" description={`Progres: ${progress.percent}% (${progress.completed}/${progress.total})`}>
          <div className="space-y-4">
            {modules.length === 0 ? (
              <div className="text-sm text-muted-foreground">Belum ada modul.</div>
            ) : (
              modules.map(m => (
                <div key={m._id} className="rounded border p-3">
                  <div className="font-medium">{m.title}</div>
                  <ModuleLessons moduleId={m._id as Id<'modules'>} courseSlug={params.course} />
                </div>
              ))
            )}
          </div>
        </ContentCard>
      </Section>
    </div>
  )
}

async function ModuleLessons({ moduleId, courseSlug }: { moduleId: Id<'modules'>; courseSlug: string }) {
  const lessons: Array<Doc<'lessons'>> = await fetchQuery(api.lessons.listByModule, { moduleId })
  return (
    <ul className="mt-2 space-y-2">
      {lessons.map(l => (
        <li key={l._id}>
          <a href={`/lms/${courseSlug}/${moduleId}/${l._id}`} className="text-sm hover:underline">
            {l.order}. {l.title}
          </a>
        </li>
      ))}
    </ul>
  )
}
