// Next.js 16: middleware.ts diganti menjadi proxy.ts untuk proteksi rute global
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth()
  if (!isPublicRoute(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url })
  }
})

export const config = {
  matcher: ['/protected(.*)', '/app(.*)', '/admin(.*)', '/((?!_next|.*\..*|favicon.ico).*)'],
}
