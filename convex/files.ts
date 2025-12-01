import { v } from 'convex/values'
import { mutation } from './_generated/server'

export const generateUploadUrl = mutation({
  args: {
    // We can add validation here if needed, e.g., file type
  },
  handler: async (ctx) => {
    // Ensure user is authenticated
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) {
      throw new Error('Unauthenticated')
    }

    // In a real app, we might want to check for admin role here too
    // depending on who is allowed to upload.
    // For now, we'll allow authenticated users (or restrict to admin if strict)

    return await ctx.storage.generateUploadUrl()
  },
})
