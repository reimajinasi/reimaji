# Reimaji Project Specification

## Overview
This folder contains all planning documents and specifications for the Reimaji AI Literacy Platform project.

## Folder Structure

### `/planning/`
- **RAW_IDEA.md** - Original project concept and vision
- **visuals/** - Mockups, wireframes, and design materials
- **documents/** - Structured documentation (PRD, system design, technical specs)
- **requirements/** - (Future) Detailed requirements breakdown
- **user-stories/** - (Future) User story documentation

### `/implementation/`
- Implementation documentation and progress tracking
- Technical implementation reports
- Integration notes and updates

## 🔐 Environment Variables & Credentials

**🚨 IMPORTANT SECURITY NOTE:** All production credentials and API keys are stored in:
`/Users/eriksupit/Desktop/reimaji/knowledge-base/env.txt`

### Available Service Credentials:
- **Vercel** - Deployment token for production deployment
- **Resend** - Email service API key for transactional emails
- **Xendit** - Payment gateway (secret & public keys) for subscriptions
- **Clerk** - Authentication service (publishable & secret keys)
- **GitHub** - Repository access tokens (fine-grained & classic)
- **Midtrans** - Alternative payment gateway (merchant, client, server keys)

### Setup Instructions:
1. **Never commit** real credentials to git repository
2. Copy credentials from `knowledge-base/env.txt` to local `.env.local`
3. Use environment variable validation in development setup
4. Refer to integration guides in `/planning/04-integration-architecture.md` for proper API configuration
5. Update environment variables in production deployment settings

## Current Status
- ✅ Project concept defined
- ✅ Spec folder initialized
- ✅ Environment credentials documented and secured
- ✅ PRD restructured and organized
- ✅ System design integrated
- ✅ Technical specs consolidated
- ✅ Strategic task list created (98 actionable tasks)
- ✅ Development guides and setup scripts ready
- ✅ Ready for implementation phase

## Next Steps
1. **Development Setup** - Configure local environment with documented credentials
2. **Task Execution** - Begin with Phase 0 tasks from the strategic task list
3. **Integration Configuration** - Set up external services using provided credentials
4. **Repository Creation** - Initialize git repository and connect to GitHub using provided tokens
5. **Implementation** - Follow comprehensive development guide for systematic development

## Documents Successfully Organized
- ✅ `../knowledge-base/reimaji-prd.md` → Integrated into `/planning/spec.md`
- ✅ `../knowledge-base/system-design.md` → Organized into architecture documents
- ✅ `../knowledge-base/SPECS.md` → Consolidated into development guides

## 📁 Documentation Structure

```
agent-os/specs/2025-11-28-reimaji-ai-literacy-platform/
├── planning/
│   ├── RAW_IDEA.md           # Original project concept
│   ├── README.md             # This file - project overview
│   ├── spec.md               # Core product specifications
│   ├── tasks.md              # Strategic development roadmap
│   ├── 01-system-overview.md              # Complete system architecture
│   ├── 02-frontend-architecture.md         # Next.js architecture
│   ├── 03-backend-architecture.md          # Convex backend design
│   ├── 04-integration-architecture.md      # External services + credentials
│   └── 05-development-architecture.md     # Development standards + setup
├── scripts/
│   └── setup-dev.sh         # Automated development setup
├── .env.example             # Environment variable template
├── CREDENTIALS-SETUP.md    # Complete credentials setup guide
├── DESIGN-SYSTEM-QUICK-REFERENCE.md # 🎨 Design system quick reference
└── README-DEVELOPMENT.md    # Quick start development guide
```

Each document serves specific purposes:
- **Planning/** - Business requirements and architecture
- **Docs/development** (root project) - Technical implementation guides
- **Scripts/** - Automation and setup utilities
- **Credentials/** - Security and API key management

## 🔐 Security & Credentials Management

### Key Security Documents:
- **`CREDENTIALS-SETUP.md`** - Complete credentials setup and security guide
- **`.env.example`** - Environment variable template
- **`planning/04-integration-architecture.md`** - Integration credentials overview
- **`planning/05-development-architecture.md`** - Development environment security

### Credential Source:
**All production credentials are stored in:**
`/Users/eriksupit/Desktop/reimaji/knowledge-base/env.txt`

### Security Practices:
- ✅ **Never commit** credentials to git
- ✅ **Use environment variables** for all configuration
- ✅ **Regular validation** of all API keys
- ✅ **Separate environments** for development/staging/production
- ✅ **Automated setup** with security validation

## Project Timeline
Target launch within 6-12 months with goal of 50 paid users.
