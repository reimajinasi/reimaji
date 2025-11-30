# 🎨 Design System Quick Reference - Reimaji AI Literacy Platform

**🚨 IMPORTANT:** This is a quick reference for developers. For detailed specifications, always refer to:
`/Users/eriksupit/Desktop/reimaji/knowledge-base/design-system/`

---

## 📋 Table of Contents

- [Typography](#typography-quick-reference)
- [Colors](#colors-quick-reference)
- [Component Guidelines](#component-guidelines)
- [Common Patterns](#common-patterns)
- [Utility Classes](#utility-classes)
- [Accessibility](#accessibility-requirements)

---

## ✏️ Typography Quick Reference

### Font Family
```css
/* Always use Inter font family */
font-family: 'Inter', sans-serif;
```

### Heading Sizes (H1-H5)
| Class | Size | Line Height | Usage |
|--------|------|-------------|--------|
| `text-h1` | 48px | 58px | Hero titles, main page headers |
| `text-h2` | 40px | 48px | Section titles |
| `text-h3` | 32px | 38px | Subsection titles |
| `text-h4` | 28px | 34px | Card titles, course headers |
| `text-h5` | 24px | 28px | Medium titles, dashboard headings |

### Display/Button Font Sizes
| Class | Size | Line Height | Usage |
|--------|------|-------------|--------|
| `text-giant` | 18px | 24px | Large CTA, card headlines |
| `text-large` | 16px | 20px | Primary buttons, list items |
| `text-medium` | 14px | 16px | Labels, badges, tabs |
| `text-small` | 12px | 16px | Small labels, UI elements |
| `text-tiny` | 10px | 12px | Mini info, timestamps |

### Body Text
| Class | Size | Line Height | Usage |
|--------|------|-------------|--------|
| `text-body-1` | 16px | 24px | Main paragraphs, content |
| `text-caption-1` | 12px | 16px | Image captions, metadata |
| `text-caption-2` | 12px | 16px | Secondary captions |
| `text-caption-3` | 10px | 14px | Micro info, timestamps |
| `text-label` | 12px | 16px | Form labels, controls |

---

## 🎨 Colors Quick Reference

### Surface Colors
| Class | Usage | CSS Variable |
|--------|---------|--------------|
| `bg-background` `text-foreground` | Main background, body text | `--background`, `--foreground` |
| `bg-card` `text-card-foreground` | Card backgrounds, panels | `--card`, `--card-foreground` |
| `bg-muted` `text-muted-foreground` | Secondary content, placeholders | `--muted`, `--muted-foreground` |
| `bg-border` | Borders, dividers, input borders | `--border` |
| `bg-input` | Input field backgrounds | `--input` |

### Brand Colors
| Class | Usage | CSS Variable |
|--------|---------|--------------|
| `bg-primary` `text-primary-foreground` | Primary CTAs, main actions | `--primary`, `--primary-foreground` |
| `bg-accent` `text-accent-foreground` | Selected states, highlights | `--accent`, `--accent-foreground` |

### Semantic Colors
| Class | Usage | CSS Variable |
|--------|---------|--------------|
| `bg-success` `text-success-foreground` | Success states, completed actions | `--success`, `--success-foreground` |
| `bg-warning` `text-warning-foreground` | Warnings, attention needed | `--warning`, `--warning-foreground` |
| `bg-destructive` `text-destructive-foreground` | Delete actions, errors, danger | `--destructive`, `--destructive-foreground` |

### Usage Guidelines
- **Primary vs Accent**: Use `primary` for main CTAs, `accent` for interactive highlights
- **Card vs Muted**: Use `card` for main content containers, `muted` for secondary areas
- **Semantic Colors**: Use consistently across all components for the same meaning

---

## 🧩 Component Guidelines

### Button Component
```typescript
// ✅ CORRECT: Use design system tokens
import { cn } from "@/lib/utils"

export function Button({ variant = "primary", size = "md", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          // Size variants from design-button.md
          "h-8 px-3 text-small": size === "sm",
          "h-10 py-2 text-medium": size === "md",
          "h-12 px-6 text-large": size === "lg"
        },
        {
          // Color variants from design-button.md
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline"
        }
      )}
      {...props}
    />
  )
}

// ❌ WRONG: Custom styles
export function ButtonBad({ ...props }: ButtonProps) {
  return (
    <button
      style={{
        backgroundColor: "#3b82f6", // Hardcoded color
        padding: "8px 16px", // Fixed spacing
        borderRadius: "6px"   // Inconsistent radius
      }}
      {...props}
    />
  )
}
```

### Card Component
```typescript
// ✅ CORRECT: Follow design-card.md
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Header and content sections
export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Input Component
```typescript
// ✅ CORRECT: Follow design-input.md
export function Input({
  label,
  error,
  helperText,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      {helperText && !error && (
        <p className="text-xs text-muted-foreground mt-1">
          {helperText}
        </p>
      )}
      {error && (
        <p className="text-xs text-destructive-foreground mt-1">
          {error}
        </p>
      )}
    </div>
  )
}
```

---

## 🔄 Common Patterns

### News/Research Card
```typescript
export function ContentCard({
  title,
  summary,
  type,
  tags,
  isPremium,
  publishedAt
}: ContentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="text-h5 text-foreground font-semibold leading-tight">
            {title}
          </h3>
          {isPremium && (
            <Badge variant="secondary" className="text-xs">
              Pro
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <div className="px-6 pb-6">
        <p className="text-body-2 text-muted-foreground leading-relaxed">
          {summary}
        </p>
        <div className="flex items-center justify-between mt-4">
          <time className="text-caption-1 text-muted-foreground">
            {formatDate(publishedAt)}
          </time>
          <Button size="sm" variant="outline">
            Read More
          </Button>
        </div>
      </div>
    </Card>
  )
}
```

### LMS Lesson Progress
```typescript
export function LessonProgress({
  completed,
  total,
  currentLesson,
  title
}: LessonProgressProps) {
  const progress = (completed / total) * 100

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-h6 text-foreground font-medium">
            {title}
          </h4>
          <span className="text-caption-1 text-muted-foreground">
            {completed}/{total} lessons
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      <Button
        size="sm"
        variant={currentLesson ? "primary" : "secondary"}
        disabled={!currentLesson}
      >
        {currentLesson ? "Continue" : "Start"}
      </Button>
    </div>
  )
}
```

### Form Layout
```typescript
export function FormSection({ title, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {title && (
        <h2 className="text-h4 text-foreground font-semibold mb-4">
          {title}
        </h2>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn("flex items-center justify-end space-x-3 pt-4", className)}>
      {children}
    </div>
  )
}
```

---

## 🛠️ Utility Classes

### Spacing (Based on design system)
```css
/* Use these spacing values consistently */
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem    /* 48px */
```

### Border Radius
```css
/* Consistent border radius values */
--radius-sm: 0.125rem  /* 2px */
--radius-md: 0.375rem  /* 6px */
--radius-lg: 0.5rem    /* 8px */
--radius-xl: 0.75rem   /* 12px */
--radius-2xl: 1rem     /* 16px */
--radius-full: 9999px  /* Full circle */
```

### Shadows
```css
/* Based on design-shadows.md */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### Common Class Combinations
```css
/* Card backgrounds */
.card-base     { @apply bg-card text-card-foreground border border-border rounded-lg shadow-sm; }
.card-hover     { @apply hover:shadow-md transition-shadow; }
.card-interactive { @apply hover:bg-accent/50 cursor-pointer; }

/* Button states */
.button-primary { @apply bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-ring; }
.button-secondary { @apply bg-secondary text-secondary-foreground hover:bg-secondary/80; }

/* Input states */
.input-base { @apply border border-input bg-background text-foreground rounded-md px-3 py-2; }
.input-error { @apply border-destructive focus:ring-destructive; }
.input-focus { @apply focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2; }
```

---

## ♿ Accessibility Requirements

### Essential ARIA Patterns

#### Buttons
```typescript
// ✅ CORRECT: Include proper ARIA
export function IconButton({
  icon,
  label,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      className="inline-flex items-center justify-center rounded-md p-2 hover:bg-accent focus:ring-2 focus:ring-ring"
      {...props}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  )
}

// ❌ WRONG: Missing accessibility
export function IconButtonBad({ icon, ...props }: IconButtonProps) {
  return <button {...props}>{icon}</button>
}
```

#### Forms
```typescript
// ✅ CORRECT: Proper form labels
export function FormField({
  label,
  error,
  required = false,
  children,
  id
}: FormFieldProps) {
  const fieldId = id || useId()

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive-foreground ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          className="text-xs text-destructive-foreground mt-1"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Usage in Input
export function Input({ label, error, ...props }: InputProps) {
  const fieldId = useId()

  return (
    <FormField
      label={label}
      error={error}
      id={fieldId}
    >
      <input
        id={fieldId}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(inputClasses, error && inputErrorClasses)}
        {...props}
      />
    </FormField>
  )
}
```

#### Navigation
```typescript
// ✅ CORRECT: Semantic navigation
export function MainNavigation() {
  return (
    <nav aria-label="Main navigation" role="navigation">
      <ul className="flex space-x-6">
        <li>
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-current="page"
          >
            Dashboard
          </Link>
        </li>
        {/* ... other nav items */}
      </ul>
    </nav>
  )
}

// ✅ CORRECT: Breadcrumb navigation
export function Breadcrumbs({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb navigation">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-muted-foreground/60">/</span>
            )}
            {item.current ? (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-foreground focus:outline-none focus:ring-1 focus:ring-ring rounded px-1 py-0.5"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
```

### Focus Management
```css
/* Custom focus styles that match design system */
.focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

.focus-visible:focus {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

/* Skip to main content for screen readers */
.skip-link {
  @apply absolute -top-16 -left-full bg-primary text-primary-foreground px-4 py-2 rounded-md;
  transform: translateY(-100%);
}

.skip-link:focus {
  transform: translateY(0);
}
```

### Keyboard Navigation
```typescript
// ✅ CORRECT: Keyboard-accessible dropdown
export function KeyboardDropdown({ items, buttonLabel }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Handle keyboard navigation
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false)
      return
    }

    if (event.key === "ArrowDown" && !isOpen) {
      setIsOpen(true)
      return
    }

    if (isOpen && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault()
      // Handle item selection logic here
    }
  }

  return (
    <div
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="inline-flex items-center justify-between rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {buttonLabel}
      </button>
      {isOpen && (
        <ul
          role="menu"
          aria-orientation="vertical"
          className="absolute mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md z-50"
        >
          {items.map((item) => (
            <li key={item.value}>
              <button
                role="menuitem"
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

---

## 🚨 Design System Rules Summary

### MUST DO ✅
1. **Always reference design system documents** before creating components
2. **Use semantic color tokens** (`bg-primary`, `text-muted-foreground`)
3. **Use typography tokens** (`text-h1`, `text-body-1`, `text-caption-1`)
4. **Use consistent spacing** from design system scale
5. **Follow accessibility guidelines** for all interactive components
6. **Use proper semantic HTML** (`<nav>`, `<main>`, `<article>`, etc.)
7. **Include ARIA labels** where appropriate
8. **Test with screen readers** and keyboard navigation

### MUST NOT DO ❌
1. **Never hardcode colors** (`#3b82f6`, `#666666`)
2. **Never use inline styles** (`style={{}}`)
3. **Never use arbitrary values** (`text-[24px]`, `p-[10px]`)
4. **Never skip accessibility** attributes
5. **Never ignore semantic HTML** structure
6. **Never mix different design approaches** in the same component

### Quick Reference Checklist
For every component, verify:
- [ ] Typography uses design system tokens
- [ ] Colors use semantic tokens
- [ ] Spacing follows design system scale
- [ ] Border radius is consistent
- [ ] Shadows match design system specifications
- [ ] Accessibility attributes are included
- [ ] Component works with keyboard navigation
- [ ] Component works with screen readers
- [ ] Component follows semantic HTML structure

---

**📚 For complete specifications, always refer to:**
`/Users/eriksupit/Desktop/reimaji/knowledge-base/design-system/`

**⚡ Development Workflow:**
1. Check relevant design system document
2. Extract tokens and requirements
3. Plan component variants and states
4. Implement with proper TypeScript
5. Test accessibility and responsive behavior
6. Document component usage and props