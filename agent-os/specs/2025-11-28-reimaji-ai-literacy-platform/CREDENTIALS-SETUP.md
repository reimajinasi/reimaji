# 🔐 Credentials Setup Guide - Reimaji AI Literacy Platform

## 🚨 CRITICAL SECURITY INFORMATION

**All production credentials and API keys are centrally stored and documented in:**
```
/Users/eriksupit/Desktop/reimaji/knowledge-base/env.txt
```

⚠️ **NEVER COMMIT** any credential files to version control!
⚠️ **NEVER SHARE** credentials outside the development team!
⚠️ **ALWAYS USE** environment variables for configuration!

## 📋 Available Service Credentials

| Service | Purpose | Environment Variables | Status |
|---------|---------|---------------------|---------|
| **Clerk** | User Authentication | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | ✅ Available |
| **Xendit** | Payment Gateway | `XENDIT_SECRET_KEY`, `XENDIT_PUBLIC_KEY` | ✅ Available |
| **Vercel** | Deployment | `VERCEL_TOKEN` | ✅ Available |
| **Resend** | Email Service | `RESEND_API_KEY` | ✅ Available |
| **GitHub** | Repository Management | `GITHUB_FINE_GRAINED_TOKEN`, `GITHUB_CLASSIC_TOKEN` | ✅ Available |
| **Midtrans** | Alternative Payment | `MERCHANT_ID`, `CLIENT_KEY`, `SERVER_KEY` | ✅ Available |

## 🚀 Quick Setup Instructions

### 1. Copy Credential Template
```bash
# From project root
cp .env.example .env.local
```

### 2. Fill in Actual Values
```bash
# Open the credentials file (READ-ONLY)
open /Users/eriksupit/Desktop/reimaji/knowledge-base/env.txt

# Copy values to your .env.local (NEVER COMMIT)
nano .env.local
```

### 3. Validate Configuration
```bash
# Run environment validation
npm run env:validate

# Or use the validation script
chmod +x scripts/validate-env.sh
./scripts/validate-env.sh
```

### 4. Test Integrations
```bash
# Test all external integrations
npm run test:integrations

# Test individual services
npm run test:clerk
npm run test:xendit
npm run test:resend
```

## 🔧 Service-Specific Setup

### Authentication (Clerk)
```typescript
// lib/clerk.ts - Example configuration
import { ClerkProvider } from "@clerk/nextjs"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      {children}
    </ClerkProvider>
  )
}
```

### Payment Processing (Xendit)
```typescript
// lib/xendit.ts - Example configuration
import xendit from 'xendit-node'

const x = new xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
})

export const { Invoice } = x
```

### Email Service (Resend)
```typescript
// lib/resend.ts - Example configuration
import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY!)
```

## 🔒 Security Best Practices

### 1. Environment File Management
```bash
# .gitignore - ALWAYS include these
.env.local
.env.development
.env.production
*.key
*.pem
credentials/
```

### 2. Development vs Production
- **Development**: Use test/sandbox keys from env.txt
- **Staging**: Use staging keys when available
- **Production**: Only after thorough testing

### 3. Key Rotation Schedule
- **Monthly**: Review all credential usage
- **Quarterly**: Rotate sensitive keys
- **Immediately**: If any compromise suspected

### 4. Access Control
- **Development Team**: Only necessary credentials
- **Production**: Separate production credentials
- **CI/CD**: Limited, service-specific credentials

## 🛠️ Development Environment Validation

### Automated Validation Script
```bash
#!/bin/bash
# scripts/validate-credentials.sh

echo "🔍 Validating all service credentials..."

# Source environment variables
source .env.local

# Test Clerk Authentication
echo "Testing Clerk authentication..."
if curl -s "https://api.clerk.dev/v1/me" -H "Authorization: Bearer $CLERK_SECRET_KEY" > /dev/null; then
    echo "✅ Clerk credentials valid"
else
    echo "❌ Clerk credentials invalid"
    exit 1
fi

# Test Xendit API
echo "Testing Xendit API..."
if curl -s "https://api.xendit.co/v2/balance" -H "Authorization: Basic $(echo -n $XENDIT_SECRET_KEY | base64)" > /dev/null; then
    echo "✅ Xendit credentials valid"
else
    echo "❌ Xendit credentials invalid"
    exit 1
fi

# Test Resend API
echo "Testing Resend API..."
if curl -s "https://api.resend.com/domains" -H "Authorization: Bearer $RESEND_API_KEY" > /dev/null; then
    echo "✅ Resend credentials valid"
else
    echo "❌ Resend credentials invalid"
    exit 1
fi

echo "🎉 All credentials validated successfully!"
```

## 🚨 Emergency Procedures

### If Credentials Are Compromised
1. **Immediate Action**: Revoke all exposed keys
2. **Damage Assessment**: Check access logs and usage
3. **Credential Rotation**: Generate new keys from service dashboards
4. **Update Documentation**: Update knowledge-base/env.txt
5. **Team Notification**: Alert all team members
6. **Monitor**: Watch for suspicious activity

### If Service APIs Change
1. **Documentation Update**: Update integration documentation
2. **Code Review**: Check for breaking changes
3. **Testing**: Thoroughly test updated integrations
4. **Deployment**: Deploy updates with proper validation

## 📞 Support & Contacts

For credential-related issues:
- **Primary**: reimajinasi@gmail.com
- **GitHub**: https://github.com/reimajinasi/reimaji
- **Documentation**: Check integration architecture docs

**Remember: Security is everyone's responsibility!** 🛡️