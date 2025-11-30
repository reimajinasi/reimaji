"use client"

import { useAuth } from '@clerk/nextjs'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Circle } from 'lucide-react'

export default function OnboardingPage() {
    const { userId, isLoaded } = useAuth()
    const router = useRouter()

    const status = useQuery(api.onboarding.getStatus, userId ? { clerkUserId: userId } : "skip")
    const updateStep = useMutation(api.onboarding.updateStep)
    const completeOnboarding = useMutation(api.onboarding.completeOnboarding)

    if (!isLoaded) return null

    const steps = [
        {
            id: 'news',
            title: 'Jelajahi Berita AI',
            description: 'Dapatkan update terbaru seputar tools, use cases, dan regulasi AI.',
            href: '/news',
            isCompleted: status?.steps?.news
        },
        {
            id: 'research',
            title: 'Pelajari Riset Terbaru',
            description: 'Pahami implikasi praktis dari paper riset AI terkini.',
            href: '/research',
            isCompleted: status?.steps?.research
        },
        {
            id: 'lms',
            title: 'Mulai Belajar di LMS',
            description: 'Ikuti kursus terstruktur untuk meningkatkan literasi AI Anda.',
            href: '/lms',
            isCompleted: status?.steps?.lms
        }
    ]

    const handleStepComplete = async (stepId: 'news' | 'research' | 'lms') => {
        if (!userId) return
        await updateStep({ clerkUserId: userId, step: stepId, completed: true })
    }

    const handleFinish = async () => {
        if (!userId) return
        await completeOnboarding({ clerkUserId: userId })
        router.push('/dashboard')
    }

    const allCompleted = steps.every(s => s.isCompleted)

    return (
        <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">Selamat Datang di Reimaji</h1>
                <p className="text-muted-foreground">Mari mulai perjalanan literasi AI Anda dengan 3 langkah mudah.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {steps.map((step) => (
                    <Card key={step.id} className={`relative ${step.isCompleted ? 'border-green-500/50 bg-green-500/5' : ''}`}>
                        <CardHeader>
                            <div className="flex items-center justify-between mb-2">
                                {step.isCompleted ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                    <Circle className="h-6 w-6 text-muted-foreground" />
                                )}
                            </div>
                            <CardTitle>{step.title}</CardTitle>
                            <CardDescription>{step.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button
                                variant={step.isCompleted ? "outline" : "default"}
                                className="w-full"
                                onClick={() => window.open(step.href, '_blank')}
                            >
                                Kunjungi Halaman
                            </Button>
                            {!step.isCompleted && (
                                <Button
                                    variant="ghost"
                                    className="w-full"
                                onClick={() => handleStepComplete(step.id as 'news' | 'research' | 'lms')}
                                >
                                    Tandai Selesai
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center pt-8">
                <Button
                    size="lg"
                    onClick={handleFinish}
                    className="min-w-[200px]"
                >
                    {allCompleted ? 'Selesai & Masuk Dashboard' : 'Lewati & Masuk Dashboard'}
                </Button>
            </div>
        </div>
    )
}
