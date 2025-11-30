// Next.js 16: middleware.ts diganti menjadi proxy.ts untuk proteksi rute global
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export const proxy = clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()
  if (!isPublicRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }
})

export const config = {
  matcher: [
    '/((?!.+\\..+|_next).*)',
    '/',
    '/(api|trpc)(.*)',
    '/dashboard(.*)',
  ],
}
