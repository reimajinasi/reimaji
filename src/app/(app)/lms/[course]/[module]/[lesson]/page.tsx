export const dynamic = 'force-dynamic'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { fetchQuery, fetchMutation } from 'convex/nextjs'
import { api } from '../../../../../../../convex/_generated/api'
import { LessonTracker } from '@/components/features/lesson-tracker'
import { PageHeader } from '@/components/layout/page-header'
import { Section } from '@/components/layout/section'
import { ContentCard } from '@/components/layout/content-card'
import type { Id, Doc } from '../../../../../../../convex/_generated/dataModel'

export default async function Page({
  params,
}: {
  params: { course: string; module: string; lesson: string }
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId!)
  const course = await fetchQuery(api.courses.getBySlug, { slug: params.course })
  if (!course) redirect('/lms')
  const lesson = await fetchQuery(api.lessons.getById, { id: params.lesson as Id<'lessons'> })
  if (!lesson || !lesson.isPublished) redirect(`/lms/${params.course}`)

  const courseId = course._id
  async function markComplete() {
    'use server'
    await fetchMutation(api.progress.markLessonComplete, {
      clerkUserId: clerkUser.id,
      courseId,
      lessonId: params.lesson as Id<'lessons'>,
    })
  }

  const questions: Array<Doc<'quizzes'>> = await fetchQuery(api.quizzes.listByLesson, {
    lessonId: params.lesson as Id<'lessons'>,
  })

  return (
    <div className='space-y-6'>
      <LessonTracker
        courseId={params.course}
        moduleId={params.module}
        lessonId={params.lesson}
        title={lesson.title}
      />
      <PageHeader
        title={lesson.title}
        description='Player pelajaran dan materi'
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'LMS', href: '/lms' },
          { label: course.title, href: `/lms/${params.course}` },
          { label: lesson.title },
        ]}
      />
      <Section>
        <ContentCard title='Player' description='Video dan materi'>
          {lesson.videoUrl ? (
            <video src={lesson.videoUrl} controls className='w-full rounded' />
          ) : (
            <div className='rounded border p-4 text-sm'>Belum ada video. Baca materi di bawah.</div>
          )}
          <div
            className='prose prose-sm max-w-none mt-4'
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
          <form action={markComplete} className='mt-4'>
            <button type='submit' className='rounded bg-primary px-3 py-2 text-primary-foreground'>
              Tandai selesai
            </button>
          </form>
        </ContentCard>
      </Section>
      {questions.length > 0 && (
        <Section>
          <ContentCard title='Quiz' description='Jawab untuk menilai pemahaman'>
            <QuizForm lessonId={params.lesson} />
          </ContentCard>
        </Section>
      )}
    </div>
  )
}

async function QuizForm({ lessonId }: { lessonId: string }) {
  const questions: Array<Doc<'quizzes'>> = await fetchQuery(api.quizzes.listByLesson, {
    lessonId: lessonId as Id<'lessons'>,
  })
  async function submit(formData: FormData) {
    'use server'
    const { userId } = await auth()
    if (!userId) return
    const answers: number[] = questions.map((_q: Doc<'quizzes'>, i: number) =>
      Number(formData.get(`q${i}`))
    )
    await fetchMutation(api.quizzes.submit, {
      clerkUserId: userId!,
      lessonId: lessonId as Id<'lessons'>,
      answers,
    })
  }
  return (
    <form action={submit} className='space-y-4'>
      {questions.map((q: Doc<'quizzes'>, i: number) => (
        <div key={q._id} className='space-y-2'>
          <div className='font-medium'>
            {i + 1}. {q.question}
          </div>
          <div className='space-y-1'>
            {q.options.map((opt: string, oi: number) => (
              <label key={oi} className='flex items-center gap-2 text-sm'>
                <input type='radio' name={`q${i}`} value={oi} required /> {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button type='submit' className='rounded bg-primary px-3 py-2 text-primary-foreground'>
        Kirim Jawaban
      </button>
    </form>
  )
}
