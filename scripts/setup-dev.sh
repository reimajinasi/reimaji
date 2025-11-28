#!/bin/bash

# Reimaji AI Literacy Platform - Development Setup Script
# This script sets up the complete development environment

set -e  # Exit on any error

echo "🚀 Setting up Reimaji AI Literacy Platform Development Environment"
echo "=================================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

log_info() {
    echo -e "ℹ️ $1"
}

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is required but not installed. Please install Node.js 20.x or later."
        exit 1
    fi

    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_NODE_VERSION="20"
    if ! node -e "process.exit(Number(process.version.replace('v','').split('.')[0]) >= $REQUIRED_NODE_VERSION)"; then
        log_error "Node.js version $NODE_VERSION is too old. Please install Node.js $REQUIRED_NODE_VERSION.x or later."
        exit 1
    fi
    log_success "Node.js $NODE_VERSION found"

    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is required but not installed."
        exit 1
    fi

    NPM_VERSION=$(npm --version)
    log_success "npm $NPM_VERSION found"

    # Check Git
    if ! command -v git &> /dev/null; then
        log_error "Git is required but not installed."
        exit 1
    fi

    GIT_VERSION=$(git --version)
    log_success "$GIT_VERSION found"

    echo ""
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."

    # Clean install to ensure no conflicts
    rm -rf node_modules
    rm -f package-lock.json

    # Install dependencies
    npm ci

    log_success "Dependencies installed"
    echo ""
}

# Setup environment variables
setup_environment() {
    echo "⚙️ Setting up environment variables..."

    if [ ! -f .env.local ]; then
        if [ -f .env.example ]; then
            cp .env.example .env.local
            log_success "Created .env.local from .env.example"
            log_warning "Please edit .env.local with your actual API keys and configuration"
        else
            log_error ".env.example not found. Please create .env.local manually"
            exit 1
        fi
    else
        log_warning ".env.local already exists. Skipping environment setup."
    fi
    echo ""
}

# Setup Convex
setup_convex() {
    echo "🔧 Setting up Convex backend..."

    # Check if Convex is installed
    if ! npx convex --version &> /dev/null; then
        log_error "Convex CLI not found. Installing..."
        npm install -D convex
    fi

    # Generate Convex types
    log_info "Generating Convex types and schemas..."
    npx convex dev --dry-run

    log_success "Convex backend ready"
    echo ""
}

# Setup development tools
setup_dev_tools() {
    echo "🛠️ Setting up development tools..."

    # Setup Git hooks (if husky is configured)
    if [ -f package.json ] && grep -q "husky" package.json; then
        npx husky install
        log_success "Git hooks configured with Husky"
    fi

    # Create VS Code settings if not exists
    if [ ! -f .vscode/settings.json ]; then
        mkdir -p .vscode
        cat > .vscode/settings.json << EOF
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
EOF
        log_success "Created VS Code settings"
    fi

    echo ""
}

# Validate setup
validate_setup() {
    echo "🔍 Validating setup..."

    # Check if we can run basic commands
    log_info "Running type check..."
    npm run type-check

    log_info "Running linter..."
    npm run lint

    # Check if environment variables are properly formatted
    if [ -f .env.local ]; then
        log_info "Checking environment variables..."

        # Check for required placeholder variables
        REQUIRED_VARS=(
            "NEXT_PUBLIC_APP_URL"
            "NEXT_PUBLIC_CONVEX_URL"
            "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"
            "CONVEX_DEPLOYMENT"
            "CLERK_SECRET_KEY"
            "XENDIT_SECRET_KEY"
            "RESEND_API_KEY"
            "RESEND_FROM_EMAIL"
            "OPENAI_API_KEY"
        )

        for var in "${REQUIRED_VARS[@]}"; do
            if grep -q "${var}=placeholder" .env.local; then
                log_warning "$var is still set to placeholder value"
            elif ! grep -q "$var=" .env.local; then
                log_warning "$var is missing from .env.local"
            else
                log_success "$var is configured"
            fi
        done
    fi

    echo ""
}

# Display next steps
display_next_steps() {
    echo "🎉 Setup complete! Your Reimaji development environment is ready."
    echo ""
    echo "📋 Next Steps:"
    echo "1. Configure your environment variables in .env.local:"
    echo "   - Clerk authentication keys"
    echo "   - Convex deployment URL"
    echo "   - Xendit payment keys"
    echo "   - Resend email configuration"
    echo "   - OpenAI API key"
    echo ""
    echo "2. Update your Clerk configuration in the Clerk dashboard"
    echo "3. Create your Convex deployment at https://dashboard.convex.dev"
    echo "4. Start the development servers:"
    echo "   - Terminal 1: npm run dev          (Next.js frontend)"
    echo "   - Terminal 2: npx convex dev      (Convex backend)"
    echo ""
    echo "📚 Resources:"
    echo "   - Documentation: /docs/development/"
    echo "   - API Reference: /docs/api/"
    echo "   - Deployment Guide: /docs/deployment/"
    echo ""
    echo "💡 Pro tip: Run 'npm run dev:setup' to start both servers automatically"
    echo ""
}

# Main execution
main() {
    echo ""
    log_info "This script will set up your complete Reimaji development environment"
    echo ""

    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi

    echo ""

    check_prerequisites
    install_dependencies
    setup_environment
    setup_convex
    setup_dev_tools
    validate_setup
    display_next_steps
}

# Run the main function
main "$@"