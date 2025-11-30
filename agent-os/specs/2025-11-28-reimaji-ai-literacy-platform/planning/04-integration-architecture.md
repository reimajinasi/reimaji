# Integration Architecture - Reimaji AI Literacy Platform

## Overview

The integration architecture defines how external services connect and interact with the Reimaji platform. Each integration is designed with security, reliability, and scalability in mind, following best practices for API integrations and third-party service management.

## 🔐 Environment Credentials & API Keys

**🚨 CRITICAL SECURITY NOTE:** All production credentials and API keys are centrally stored and documented in:
`/Users/eriksupit/Desktop/reimaji/knowledge-base/env.txt`

### Available Service Credentials

| Service | Purpose | Keys Available | Integration Document |
|---------|---------|----------------|----------------------|
| **Clerk** | Authentication | Publishable Key, Secret Key | Authentication Section |
| **Xendit** | Payment Gateway | Secret API Key, Public Key | Payment Processing Section |
| **Vercel** | Deployment | Deployment Token | Deployment Section |
| **Resend** | Email Service | API Key | Email Delivery Section |
| **GitHub** | Repository Management | Fine-grained Token, Classic Token | Development Setup Section |
| **Midtrans** | Alternative Payment | Merchant ID, Client Key, Server Key | Payment Alternative Section |

### Security Guidelines

1. **Never commit** real credentials to any git repository
2. **Use environment variables** in all configuration files
3. **Reference only** the documented location for actual values
4. **Rotate keys** regularly and update documentation accordingly
5. **Use different keys** for development, staging, and production environments

### Setup Instructions

```bash
# 1. Create local environment file
cp .env.example .env.local

# 2. Copy credentials from knowledge-base/env.txt
# NEVER commit .env.local to git

# 3. Validate environment setup
npm run env:validate

# 4. Test integrations before deployment
npm run test:integrations
```

### Environment Variable Validation

```typescript
// lib/env-validation.ts
import { z } from "zod"

const envSchema = z.object({
  // Clerk
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),

  // Xendit
  XENDIT_SECRET_KEY: z.string().min(1),
  XENDIT_PUBLIC_KEY: z.string().min(1),

  // Vercel
  VERCEL_TOKEN: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1),

  // Convex
  NEXT_PUBLIC_CONVEX_URL: z.string().url(),
  CONVEX_DEPLOYMENT: z.string().min(1),
})

export const env = envSchema.parse(process.env)
```

## Integration Ecosystem Map

```
┌─────────────────────────────────────────────────────────────┐
│                   Reimaji Platform                         │
├─────────────────────────────────────────────────────────────┤
│                                                         Frontend (Next.js)│
│                                                           │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Authentication│ │   Payment       │ │   AI Services  ││
│  │                 │ │                 │ │                 ││
│  │     Clerk       │ │     Xendit      │ │  Vercel AI SDK ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│           │                   │                   │        │
│           ▼                   ▼                   ▼        │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Email         │ │   Content       │ │   Analytics     ││
│  │                 │ │                 │ │                 ││
│  │    Resend       │ │   APIs & APIs   │ │   & Monitoring ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Convex)                        │
├─────────────────────────────────────────────────────────────┤
│ • User Management & Auth                                   │
│ • Payment Processing                                      │
│ • AI Model Interactions                                   │
│ • Email Delivery                                          │
│ • Webhook Processing                                      │
│ • Data Synchronization                                    │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Integration: Clerk

### 1. Authentication Flow Architecture

```
User Login Request
        │
        ▼
┌─────────────────┐
│   Frontend      │
│ (Next.js)       │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Clerk         │
│   Frontend API  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Session       │
│   Management    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   User Data     │
│   Sync to       │
│   Backend       │
└─────────────────┘
```

### 2. Clerk Configuration

```typescript
// lib/clerk.ts
import { ClerkProvider } from "@clerk/nextjs"
import { authMiddleware } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

// Clerk Provider Configuration
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
          card: "shadow-xl",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  )
}

// Middleware Configuration
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/news(.*)",
    "/research(.*)",
    "/api/webhooks(.*)",
    "/api/public(.*)",
  ],
  ignoredRoutes: [
    "/api/webhooks/xendit(.*)",
    "/api/webhooks/clerk(.*)",
  ],
})

// User Synchronization
export async function syncUserToBackend(clerkUser: {
  id: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
}) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

  try {
    await convex.mutation("users.createOrUpdate", {
      clerkUserId: clerkUser.id,
      email: clerkUser.email,
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      avatar: clerkUser.imageUrl,
    })
  } catch (error) {
    console.error("Error syncing user to backend:", error)
  }
}
```

### 3. Webhook Integration

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { syncUserToBackend } from "@/lib/clerk"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const payload = await req.text()
    const headerPayload = headers()
    const svixId = headerPayload.get("svix-id")
    const svixTimestamp = headerPayload.get("svix-timestamp")
    const svixSignature = headerPayload.get("svix-signature")

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new NextResponse("Error: Missing webhook headers", { status: 400 })
    }

    const wh = new Webhook(webhookSecret)
    const event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any

    switch (event.type) {
      case "user.created":
        await syncUserToBackend(event.data)
        break
      case "user.updated":
        await syncUserToBackend(event.data)
        break
      case "user.deleted":
        await handleUserDeletion(event.data.id)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return new NextResponse("Error processing webhook", { status: 500 })
  }
}

async function handleUserDeletion(clerkUserId: string) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
  await convex.mutation("users.deleteByClerkId", { clerkUserId })
}
```

### 4. Client-Side Integration

```typescript
// lib/hooks/useAuth.ts
"use client"

import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function useAuthenticatedUser() {
  const { isSignedIn, user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const syncUser = useMutation(api.users.createOrUpdate)
  const dbUser = useQuery(api.users.getByClerkId, {
    clerkUserId: user?.id || "",
  })

  useEffect(() => {
    if (isSignedIn && user) {
      syncUser({
        clerkUserId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        avatar: user.imageUrl,
      }).finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [isSignedIn, user, syncUser])

  return {
    isLoading,
    isAuthenticated: isSignedIn,
    user: dbUser,
  }
}
```

## Payment Integration: Xendit

### 1. Payment Flow Architecture

```
User Initiates Payment
        │
        ▼
┌─────────────────┐
│   Frontend      │
│   Payment Form  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Backend       │
│   (Convex)      │
│   Create Invoice│
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Xendit API    │
│   Invoice       │
│   Generation    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Payment URL   │
│   Redirect User │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   User Payment  │
│   Completion    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Xendit        │
│   Webhook       │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Backend       │
│   Process       │
│   Webhook       │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Update User   │
│   Subscription  │
└─────────────────┘
```

### 2. Xendit Configuration

```typescript
// lib/xendit.ts
import xendit from "xendit-node"
import crypto from "crypto"

const x = new xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
})

export interface CreateInvoiceParams {
  userId: string
  amount: number
  description: string
  plan: "pro_monthly" | "pro_yearly"
  customerEmail: string
  customerName?: string
}

export async function createInvoice(params: CreateInvoiceParams) {
  const externalId = `INV_${Date.now()}_${params.userId}`
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const { Invoice } = x
  const invoiceClient = new (Invoice as any)()
  const invoice = await invoiceClient.createInvoice({
    externalId,
    amount: params.amount,
    description: params.description,
    shouldSendEmail: true,
    customer: {
      given_names: params.customerName || params.customerEmail,
      email: params.customerEmail,
    },
    items: [
      {
        name: params.plan === "pro_monthly" ? "Pro Plan (Monthly)" : "Pro Plan (Yearly)",
        price: params.amount,
        quantity: 1,
      },
    ],
    successRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?invoice_id=${externalId}`,
    failureRedirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/billing/failed?invoice_id=${externalId}`,
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/xendit`,
    expiredAt: thirtyDaysFromNow.toISOString(),
    currency: "IDR",
  })

  return {
    invoiceId: invoice.id,
    externalId,
    paymentUrl: invoice.invoice_url,
    status: invoice.status,
    expiresAt: invoice.expiry_date,
  }
}

export async function verifyWebhookSignature(
  payload: string,
  signature: string
): Promise<boolean> {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.XENDIT_WEBHOOK_TOKEN!)
    .update(payload)
    .digest("hex")

  return signature === expectedSignature
}
```

### 3. Payment Webhook Handler

```typescript
// app/api/webhooks/xendit/route.ts
import { NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature } from "@/lib/xendit"
import { processXenditWebhook } from "@/lib/payment-webhooks"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text()
    // Use 'x-xendit-signature' for HMAC verification, or 'x-callback-token' for simple token
    const signature = req.headers.get("x-xendit-signature") || ""

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(payload, signature)
    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 401 })
    }

    const event = JSON.parse(payload)

    // Process the webhook event
    await processXenditWebhook(event)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Xendit webhook error:", error)
    return new NextResponse("Error processing webhook", { status: 500 })
  }
}
```

### 4. Payment Processing Logic

```typescript
// lib/payment-webhooks.ts
import { api } from "@/convex/_generated/api"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function processXenditWebhook(event: any) {
  try {
    switch (event.event) {
      case "invoice.paid":
        await handleInvoicePaid(event.data)
        break
      case "invoice.expired":
        await handleInvoiceExpired(event.data)
        break
      case "invoice.cancelled":
        await handleInvoiceCancelled(event.data)
        break
      default:
        console.log(`Unhandled webhook event: ${event.event}`)
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    throw error
  }
}

async function handleInvoicePaid(invoice: any) {
  // Update transaction status
  await convex.mutation("transactions.updateStatus", {
    xenditInvoiceId: invoice.id,
    status: "PAID",
    paidAt: new Date(invoice.paid_at).getTime(),
  })

  // Activate subscription
  await convex.mutation("subscriptions.createFromTransaction", {
    xenditInvoiceId: invoice.id,
  })

  // Update user role
  await convex.mutation("users.upgradeToPro", {
    externalId: invoice.external_id,
  })

  // Send confirmation email
  await convex.action("emails.sendPaymentConfirmation", {
    externalId: invoice.external_id,
    amount: invoice.amount,
    paymentUrl: invoice.invoice_url,
  })
}

async function handleInvoiceExpired(invoice: any) {
  await convex.mutation("transactions.updateStatus", {
    xenditInvoiceId: invoice.id,
    status: "EXPIRED",
  })
}

async function handleInvoiceCancelled(invoice: any) {
  await convex.mutation("transactions.updateStatus", {
    xenditInvoiceId: invoice.id,
    status: "FAILED",
  })
}
```

### 5. Frontend Payment Integration

```typescript
// components/features/billing/payment-form.tsx
"use client"

import { useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function PaymentForm() {
  const [isLoading, setIsLoading] = useState(false)
  const createInvoice = useMutation(api.transactions.createInvoice)
  const user = useQuery(api.users.getAuthenticatedUser)
  const router = useRouter()

  const handlePayment = async (plan: "pro_monthly" | "pro_yearly", amount: number) => {
    if (!user) return

    setIsLoading(true)
    try {
      const { paymentUrl } = await createInvoice({
        userId: user._id,
        amount,
        description: `Reimaji Pro - ${plan === "pro_monthly" ? "Monthly" : "Yearly"}`,
        clerkUserId: user.clerkUserId,
      })

      // Redirect to payment page
      window.location.href = paymentUrl
    } catch (error) {
      console.error("Payment error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pro Monthly</CardTitle>
          <CardDescription>Billed monthly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">Rp 149,000/month</div>
          <Button
            onClick={() => handlePayment("pro_monthly", 149000)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Subscribe Monthly"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pro Yearly</CardTitle>
          <CardDescription>Save 20% with yearly billing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">Rp 1,430,000/year</div>
          <Button
            onClick={() => handlePayment("pro_yearly", 1430000)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Processing..." : "Subscribe Yearly"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

## AI Integration: Vercel AI SDK

### 1. AI Service Architecture

```
User AI Request
        │
        ▼
┌─────────────────┐
│   Frontend      │
│   AI Playground │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Backend       │
│   (Convex)      │
│   Action         │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Vercel AI SDK │
│   Model Call    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   OpenAI API    │
│   Response      │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Process &    │
│   Store Result  │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Return to     │
│   Frontend      │
└─────────────────┘
```

### 2. AI Service Configuration

```typescript
// lib/ai.ts
import { openai } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"
import { ConvexHttpClient } from "convex/browser"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export interface AIModelConfig {
  model: string
  temperature?: number
  maxTokens?: number
}

export interface AIPrompt {
  content: string
  type: "summarize" | "explain" | "chat" | "generate"
}

export const AI_MODELS = {
  "gpt-4-turbo-preview": {
    model: openai("gpt-4-turbo-preview"),
    temperature: 0.7,
    maxTokens: 1000,
    costPerToken: 0.00003,
  },
  "gpt-3.5-turbo": {
    model: openai("gpt-3.5-turbo"),
    temperature: 0.7,
    maxTokens: 1000,
    costPerToken: 0.000001,
  },
} as const

export async function generateSummary(
  content: string,
  type: "news" | "research",
  clerkUserId: string
) {
  // Verify admin permissions
  const user = await convex.query(api.users.getByClerkId, { clerkUserId })
  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized")
  }

  const modelConfig = AI_MODELS["gpt-4-turbo-preview"]
  const prompt = type === "news"
    ? `Summarize the following news article in a clear, concise paragraph suitable for non-technical professionals. Focus on key implications and practical takeaways:\n\n${content}`
    : `Summarize the following research paper and provide 2-3 practical implications for business professionals:\n\n${content}`

  try {
    const { text, usage } = await generateText({
      model: modelConfig.model,
      prompt,
      temperature: 0.3,
      maxTokens: 300,
    })

    // Calculate cost
    const cost = calculateCost(usage.totalTokens, modelConfig.costPerToken)

    // Store in database
    await convex.mutation("ai.storeGeneration", {
      clerkUserId,
      type: "summary",
      input: content,
      output: text,
      tokensUsed: usage.totalTokens,
      cost,
    })

    return {
      summary: text,
      tokensUsed: usage.totalTokens,
      cost,
    }
  } catch (error) {
    console.error("AI generation error:", error)
    throw new Error("Failed to generate summary")
  }
}

export async function generateChatResponse(
  prompt: string,
  model: keyof typeof AI_MODELS,
  clerkUserId: string
) {
  // Verify user permissions
  const user = await convex.query(api.users.getByClerkId, { clerkUserId })
  if (!user) {
    throw new Error("User not found")
  }

  // Check usage limits
  if (user.role !== "pro") {
    const todayUsage = await convex.query(api.ai.getTodayUsage, { userId: user._id })
    if (todayUsage >= 5) {
      throw new Error("Daily limit reached. Upgrade to Pro for unlimited access.")
    }
  }

  const modelConfig = AI_MODELS[model]
  if (!modelConfig) {
    throw new Error("Invalid model")
  }

  try {
    const { text, usage } = await generateText({
      model: modelConfig.model,
      prompt,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    })

    // Calculate cost
    const cost = calculateCost(usage.totalTokens, modelConfig.costPerToken)

    // Store session
    const sessionId = await convex.mutation("ai.createSession", {
      userId: user._id,
      title: prompt.slice(0, 50) + "...",
      prompt,
      response: text,
      model,
      tokensUsed: usage.totalTokens,
      cost,
    })

    // Generate explanation if needed
    const explanation = await generateExplanation(prompt, text)

    return {
      response: text,
      explanation,
      sessionId,
      tokensUsed: usage.totalTokens,
      cost,
    }
  } catch (error) {
    console.error("Chat generation error:", error)
    throw new Error("Failed to generate response")
  }
}

async function generateExplanation(prompt: string, response: string): Promise<string> {
  const explanationPrompt = `Analyze the following AI interaction and provide a brief explanation of potential risks, limitations, and verification tips:\n\nUser: ${prompt}\n\nAI Response: ${response}`

  const { text } = await generateText({
    model: AI_MODELS["gpt-3.5-turbo"].model,
    prompt: explanationPrompt,
    temperature: 0.3,
    maxTokens: 200,
  })

  return text
}

function calculateCost(tokens: number, costPerToken: number): number {
  return tokens * costPerToken
}
```

### 3. AI Functions in Convex

```typescript
// convex/ai.ts
import { action, mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { generateSummary, generateChatResponse } from "@/lib/ai"

export const generateNewsSummary = action({
  args: {
    content: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { content, clerkUserId }) => {
    return await generateSummary(content, "news", clerkUserId)
  },
})

export const generateResearchSummary = action({
  args: {
    content: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { content, clerkUserId }) => {
    return await generateSummary(content, "research", clerkUserId)
  },
})

export const chatWithAI = action({
  args: {
    prompt: v.string(),
    model: v.string(),
    clerkUserId: v.string(),
  },
  handler: async (ctx, { prompt, model, clerkUserId }) => {
    return await generateChatResponse(prompt, model as keyof typeof AI_MODELS, clerkUserId)
  },
})

export const createSession = mutation({
  args: {
    userId: v.id("users"),
    title: v.string(),
    prompt: v.string(),
    response: v.string(),
    model: v.string(),
    tokensUsed: v.number(),
    cost: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("aiSessions", {
      userId: args.userId,
      title: args.title,
      prompt: args.prompt,
      response: args.response,
      model: args.model,
      tokensUsed: args.tokensUsed,
      cost: args.cost,
      isPublic: false,
      createdAt: Date.now(),
    })
  },
})

export const getTodayUsage = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) * (1000 * 60 * 60 * 24)

    const sessions = await ctx.db
      .query("aiSessions")
      .filter(q =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.gt(q.field("createdAt"), today)
        )
      )
      .collect()

    return sessions.length
  },
})
```

### 4. AI Playground Frontend Integration

```typescript
// components/features/playground/ai-chat.tsx
"use client"

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AI_MODELS } from "@/lib/ai"

export function AIChat() {
  const [prompt, setPrompt] = useState("")
  const [model, setModel] = useState<keyof typeof AI_MODELS>("gpt-4-turbo-preview")
  const [response, setResponse] = useState("")
  const [explanation, setExplanation] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const chatWithAI = useMutation(api.ai.chatWithAI)
  const { isAuthenticated, user } = useAuthenticatedUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim() || !isAuthenticated) return

    setIsLoading(true)
    try {
      const result = await chatWithAI({
        prompt: prompt.trim(),
        model,
        clerkUserId: user!.clerkUserId,
      })

      setResponse(result.response)
      setExplanation(result.explanation)
    } catch (error: any) {
      console.error("Chat error:", error)
      setResponse(error.message || "An error occurred while generating response.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>AI Playground</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as keyof typeof AI_MODELS)}
                  className="w-full p-2 border rounded"
                >
                  {Object.keys(AI_MODELS).map((modelName) => (
                    <option key={modelName} value={modelName}>
                      {modelName}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                rows={4}
                className="w-full"
              />

              <Button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full"
              >
                {isLoading ? "Generating..." : "Generate Response"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader>
              <CardTitle>AI Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {response}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        {explanation && (
          <Card>
            <CardHeader>
              <CardTitle>Risk & Limitations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div>{explanation}</div>
                <div className="p-3 bg-yellow-50 rounded">
                  <p className="font-medium">Tips:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>Verify important information from reliable sources</li>
                    <li>AI may generate inaccurate or outdated information</li>
                    <li>Use AI as a starting point, not final authority</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
```

## Email Integration: Resend

### 1. Email Service Architecture

```
Trigger Event
        │
        ▼
┌─────────────────┐
│   Backend       │
│   (Convex)      │
│   Action        │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Resend API    │
│   Send Email    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Email Delivery│
│   & Tracking    │
└─────────────────┘
        │
        ▼
┌─────────────────┐
│   Status Update │
│   & Analytics   │
└─────────────────┘
```

### 2. Email Service Configuration

```typescript
// lib/email.ts
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)
const fromEmail = process.env.RESEND_FROM_EMAIL!

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendWelcomeEmail(userEmail: string, userName?: string) {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Welcome to Reimaji AI Literacy Platform!</h1>
      <p>Hi ${userName || "there"},</p>
      <p>Thank you for joining Reimaji! We're excited to help you on your AI literacy journey.</p>

      <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>What's Next?</h2>
        <ul>
          <li>Explore our curated <a href="${process.env.NEXT_PUBLIC_APP_URL}/news">AI news</a></li>
          <li>Read our research <a href="${process.env.NEXT_PUBLIC_APP_URL}/research">summaries</a></li>
          <li>Start your learning journey with our <a href="${process.env.NEXT_PUBLIC_APP_URL}/lms">courses</a></li>
          <li>Try the <a href="${process.env.NEXT_PUBLIC_APP_URL}/playground">AI Playground</a></li>
        </ul>
      </div>

      <p>Need help? Reply to this email and we'll be happy to assist you.</p>

      <p>Best regards,<br>The Reimaji Team</p>
    </div>
  `

  return await resend.emails.send({
    from: fromEmail,
    to: [userEmail],
    subject: "Welcome to Reimaji AI Literacy Platform!",
    html: htmlTemplate,
    text: `Welcome to Reimaji AI Literacy Platform! Hi ${userName || "there"}, Thank you for joining Reimaji! Start exploring AI news, research summaries, courses, and the AI Playground.`,
  })
}

export async function sendPaymentConfirmationEmail(
  userEmail: string,
  amount: number,
  invoiceUrl: string,
  expiresAt: Date
) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount)

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #2563eb;">Payment Confirmation - Reimaji Pro</h1>
      <p>Hi there,</p>
      <p>Thank you for your payment! Your Reimaji Pro subscription is now active.</p>

      <div style="background: #f0fdf4; border: 2px solid #16a34a; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2 style="color: #16a34a; margin-top: 0;">Payment Details</h2>
        <p><strong>Amount:</strong> ${formattedAmount}</p>
        <p><strong>Invoice:</strong> <a href="${invoiceUrl}">View Invoice</a></p>
        <p><strong>Status:</strong> Paid</p>
      </div>

      <div style="background: #f3f4f6; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2>What You Get with Pro</h2>
        <ul>
          <li>✓ Access to all premium news content</li>
          <li>✓ Unlimited AI Playground usage</li>
          <li>✓ All research papers and implications</li>
          <li>✓ Complete course catalog access</li>
          <li>✓ Priority customer support</li>
        </ul>
      </div>

      <p>Start exploring your Pro features now!</p>

      <p>Best regards,<br>The Reimaji Team</p>
    </div>
  `

  return await resend.emails.send({
    from: fromEmail,
    to: [userEmail],
    subject: "Payment Confirmation - Reimaji Pro",
    html: htmlTemplate,
    text: `Payment confirmation for Reimaji Pro. Amount: ${formattedAmount}. Thank you for your payment!`,
  })
}

export async function sendSubscriptionExpiredEmail(userEmail: string, userName?: string) {
  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #dc2626;">Your Reimaji Pro Subscription Has Expired</h1>
      <p>Hi ${userName || "there"},</p>
      <p>Your Reimaji Pro subscription has expired. You can still access free content, but some features will be limited.</p>

      <div style="background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 8px;">
        <h2 style="color: #f59e0b; margin-top: 0;">Reactivate Your Subscription</h2>
        <p>Don't miss out on premium content! Reactivate your subscription to continue enjoying:</p>
        <ul>
          <li>Unlimited AI Playground access</li>
          <li>All premium news and research</li>
          <li>Complete course catalog</li>
        </ul>
        <div style="text-align: center; margin-top: 20px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Renew Subscription
          </a>
        </div>
      </div>

      <p>Thank you for being part of the Reimaji community!</p>

      <p>Best regards,<br>The Reimaji Team</p>
    </div>
  `

  return await resend.emails.send({
    from: fromEmail,
    to: [userEmail],
    subject: "Your Reimaji Pro Subscription Has Expired",
    html: htmlTemplate,
    text: `Your Reimaji Pro subscription has expired. Renew your subscription to continue enjoying premium features.`,
  })
}
```

### 3. Email Actions in Convex

```typescript
// convex/emails.ts
import { action } from "./_generated/server"
import { v } from "convex/values"
import { sendWelcomeEmail, sendPaymentConfirmationEmail, sendSubscriptionExpiredEmail } from "@/lib/email"

export const sendWelcomeEmail = action({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId })
    if (!user) {
      throw new Error("User not found")
    }

    try {
      await sendWelcomeEmail(user.email, user.name)
      return { success: true }
    } catch (error) {
      console.error("Error sending welcome email:", error)
      throw new Error("Failed to send welcome email")
    }
  },
})

export const sendPaymentConfirmation = action({
  args: {
    externalId: v.string(),
    amount: v.number(),
    invoiceUrl: v.string(),
  },
  handler: async (ctx, { externalId, amount, invoiceUrl }) => {
    // Extract userId from externalId
    const userId = externalId.split("_")[2] ?? ""
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId: userId })
    if (!user) {
      throw new Error("User not found")
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    try {
      await sendPaymentConfirmationEmail(user.email, amount, invoiceUrl, expiresAt)
      return { success: true }
    } catch (error) {
      console.error("Error sending payment confirmation email:", error)
      throw new Error("Failed to send payment confirmation email")
    }
  },
})

export const sendSubscriptionExpiredNotice = action({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.runQuery(api.users.getByClerkId, { clerkUserId })
    if (!user) {
      throw new Error("User not found")
    }

    try {
      await sendSubscriptionExpiredEmail(user.email, user.name)
      return { success: true }
    } catch (error) {
      console.error("Error sending subscription expired email:", error)
      throw new Error("Failed to send subscription expired email")
    }
  },
})
```

## Error Handling & Retry Logic

### 1. Generic Error Handler

```typescript
// lib/error-handling.ts
export class IntegrationError extends Error {
  constructor(
    message: string,
    public service: string,
    public originalError?: any,
    public retryable: boolean = true
  ) {
    super(message)
    this.name = "IntegrationError"
  }
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error

      if (error instanceof IntegrationError && !error.retryable) {
        throw error
      }

      if (attempt === maxRetries) {
        throw new IntegrationError(
          `Operation failed after ${maxRetries + 1} attempts: ${lastError.message}`,
          "unknown",
          lastError,
          false
        )
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(backoffMultiplier, attempt)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }

  throw lastError!
}
```

### 2. Circuit Breaker Pattern

```typescript
// lib/circuit-breaker.ts
export class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED"

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = "HALF_OPEN"
      } else {
        throw new IntegrationError("Circuit breaker is OPEN", "circuit-breaker")
      }
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failures = 0
    this.state = "CLOSED"
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()

    if (this.failures >= this.threshold) {
      this.state = "OPEN"
    }
  }
}
```

This integration architecture provides a comprehensive, secure, and reliable foundation for connecting external services with the Reimaji AI Literacy Platform, ensuring robust functionality and excellent user experience.
