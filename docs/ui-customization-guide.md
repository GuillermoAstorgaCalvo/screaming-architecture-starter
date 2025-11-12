# UI Design System Customization Guide

This guide walks you through adapting the UI design system to work with different design systems across multiple projects. Whether you're implementing "Design X" or "Design Z", this guide provides step-by-step instructions.

## Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [Quick Start: Adapting to a New Design System](#quick-start-adapting-to-a-new-design-system)
3. [Customization Methods](#customization-methods)
4. [Step-by-Step: Complete Theme Migration](#step-by-step-complete-theme-migration)
5. [Project-Specific Customization](#project-specific-customization)
6. [Runtime vs Build-Time Customization](#runtime-vs-build-time-customization)
7. [Component Customization](#component-customization)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Understanding the Architecture

The design system is built on three layers:

### 1. Design Tokens (`src/core/constants/designTokens.ts`)

- **Single source of truth** for all design values
- TypeScript constants that define colors, spacing, typography, etc.
- Used at build time to generate CSS variables

### 2. CSS Variables (`src/styles/globals.css`)

- Runtime-accessible design tokens
- All tokens exposed as CSS custom properties (e.g., `--color-primary`)
- Can be overridden without rebuilding

### 3. Tailwind Integration (`tailwind.config.ts`)

- Maps design tokens to Tailwind utility classes
- Uses CSS variables for runtime theming
- Enables semantic class names like `bg-primary`, `text-text-primary`

### Component Layer

- Components use semantic tokens (not hardcoded values)
- Automatically adapt to theme changes
- Accept `className` and `style` props for overrides

---

## Quick Start: Adapting to a New Design System

### Scenario: Adapting to "Design X"

Let's say Design X has:

- Primary color: `#6366f1` (Indigo)
- Secondary color: `#8b5cf6` (Purple)
- Border radius: `0.5rem` (medium)
- Spacing scale: 4, 8, 16, 24, 32, 48, 64

### Method 1: Runtime Customization (Recommended for Multi-Project)

```ts
// In your app initialization (e.g., src/app/main.tsx or App.tsx)
import { customizeTheme } from '@core/utils/themeCustomization';

// Apply Design X theme
customizeTheme({
	cssVariables: {
		// Brand colors
		'color-primary': '#6366f1',
		'color-primary-foreground': '#ffffff',
		'color-secondary': '#8b5cf6',
		'color-secondary-foreground': '#ffffff',

		// Spacing
		'spacing-xs': '4px',
		'spacing-sm': '8px',
		'spacing-md': '16px',
		'spacing-lg': '24px',
		'spacing-xl': '32px',
		'spacing-2xl': '48px',
		'spacing-3xl': '64px',

		// Border radius
		'radius-md': '0.5rem',
		'radius-lg': '0.75rem',
	},
	persist: true,
	storageKey: 'design-x-theme',
});
```

### Method 2: Build-Time Customization (For Fixed Themes)

```ts
// src/core/constants/designTokens.ts
import { mergeDesignTokens } from '@core/constants/designTokens';

// Create Design X tokens
export const designXTokens = mergeDesignTokens({
	color: {
		primary: {
			DEFAULT: '#6366f1',
			foreground: '#ffffff',
		},
		secondary: {
			DEFAULT: '#8b5cf6',
			foreground: '#ffffff',
		},
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		lg: 24,
		xl: 32,
		'2xl': 48,
		'3xl': 64,
	},
	radius: {
		md: '0.5rem',
		lg: '0.75rem',
	},
});

// Then update tailwind.config.ts to use designXTokens
```

---

## Customization Methods

### Method 1: CSS Variable Overrides (Runtime)

**Best for:** Multi-tenant apps, user themes, A/B testing, runtime switching

**Pros:**

- No rebuild required
- Can be changed dynamically
- Supports persistence
- Works across all components

**Cons:**

- Slightly more runtime overhead
- Requires CSS variable support

**Example:**

```ts
import { applyCSSVariableOverrides } from '@core/utils/themeCustomization';

// Single override
applyCSSVariableOverrides({
	'color-primary': '#ff0000',
});

// Multiple overrides
applyCSSVariableOverrides({
	'color-primary': '#6366f1',
	'spacing-md': '16px',
	'radius-lg': '0.75rem',
});
```

### Method 2: Design Token Merging (Build-Time)

**Best for:** Fixed brand themes, project-specific builds, design system forks

**Pros:**

- Type-safe
- No runtime overhead
- Can add new tokens
- Full TypeScript support

**Cons:**

- Requires rebuild
- Not dynamic

**Example:**

```ts
import { mergeDesignTokens } from '@core/constants/designTokens';

const customTokens = mergeDesignTokens({
	color: {
		primary: { DEFAULT: '#6366f1', foreground: '#ffffff' },
	},
	spacing: { md: 16 },
});

// Update tailwind.config.ts:
import { customTokens as designTokens } from './path/to/customTokens';
```

### Method 3: Direct CSS Override

**Best for:** Quick prototypes, one-off changes, testing

**Example:**

```css
/* In your custom CSS file */
:root {
	--color-primary: #6366f1;
	--spacing-md: 16px;
}
```

### Method 4: Component-Level Override

**Best for:** Individual component exceptions, special cases

**Example:**

```tsx
<Button variant="primary" className="bg-purple-600 hover:bg-purple-700">
	Custom Button
</Button>
```

---

## Step-by-Step: Complete Theme Migration

### Step 1: Audit Your Design System

Create a mapping document:

```ts
// design-system-mapping.ts
export const designSystemMapping = {
	// Colors
	primary: '#6366f1',
	primaryForeground: '#ffffff',
	secondary: '#8b5cf6',
	// ... map all colors

	// Spacing
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		// ... map all spacing
	},

	// Typography
	fontFamily: {
		sans: ['Inter', 'sans-serif'],
		mono: ['Fira Code', 'monospace'],
	},

	// ... map all design tokens
};
```

### Step 2: Choose Your Customization Method

- **Runtime**: Use `customizeTheme()` for dynamic themes
- **Build-time**: Use `mergeDesignTokens()` for fixed themes

### Step 3: Apply Customizations

#### For Runtime Customization:

```ts
// src/app/providers/ThemeProvider.tsx (or create new)
import { customizeTheme, loadPersistedTheme } from '@core/utils/themeCustomization';
import { useEffect } from 'react';

export function DesignXThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Load persisted theme or apply default
    const saved = loadPersistedTheme('design-x-theme');
    if (saved) {
      customizeTheme({ cssVariables: saved, persist: true });
    } else {
      customizeTheme({
        cssVariables: {
          'color-primary': '#6366f1',
          'color-secondary': '#8b5cf6',
          // ... all your design tokens
        },
        persist: true,
        storageKey: 'design-x-theme',
      });
    }
  }, []);

  return <>{children}</>;
}
```

#### For Build-Time Customization:

```ts
// src/core/constants/designTokens.custom.ts
import { mergeDesignTokens } from '@core/constants/designTokens';

export const customDesignTokens = mergeDesignTokens({
	color: {
		primary: { DEFAULT: '#6366f1', foreground: '#ffffff' },
		secondary: { DEFAULT: '#8b5cf6', foreground: '#ffffff' },
		// ... all your colors
	},
	spacing: {
		xs: 4,
		sm: 8,
		md: 16,
		// ... all your spacing
	},
	// ... all other tokens
});
```

Then update `tailwind.config.ts`:

```ts
// tailwind.config.ts
import { customDesignTokens as designTokens } from '@core/constants/designTokens.custom';

export default {
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: 'var(--color-primary)',
					foreground: 'var(--color-primary-foreground)',
				},
				// ... rest of config using designTokens
			},
		},
	},
};
```

### Step 4: Update CSS Variables

If using build-time customization, update `src/styles/globals.css`:

```css
:root {
	--color-primary: #6366f1;
	--color-primary-foreground: #ffffff;
	/* ... update all CSS variables to match your design tokens */
}
```

### Step 5: Test Components

Verify components adapt correctly:

```tsx
// Test that components use semantic tokens
<Button variant="primary">Should use your primary color</Button>
<Card variant="elevated">Should use your spacing and radius</Card>
```

### Step 6: Handle Dark Mode

Ensure dark mode variants are defined:

```ts
customizeTheme({
	cssVariables: {
		// Light mode
		'color-primary': '#6366f1',
		'color-surface': '#ffffff',

		// Dark mode (handled via .dark class in globals.css)
		'color-surface-dark': '#0f172a',
		// ... dark mode tokens
	},
});
```

---

## Project-Specific Customization

### Scenario: Multiple Projects with Different Designs

#### Option A: Runtime Theme Switching

Create a theme configuration system:

```ts
// src/core/config/themes.ts
export const themes = {
	'design-x': {
		'color-primary': '#6366f1',
		'color-secondary': '#8b5cf6',
		// ... Design X tokens
	},
	'design-z': {
		'color-primary': '#10b981',
		'color-secondary': '#3b82f6',
		// ... Design Z tokens
	},
};

export function applyTheme(themeName: keyof typeof themes) {
	const theme = themes[themeName];
	if (theme) {
		customizeTheme({
			cssVariables: theme,
			persist: true,
			storageKey: 'app-theme',
		});
	}
}
```

#### Option B: Environment-Based Themes

```ts
// src/core/config/themes.ts
import { customizeTheme } from '@core/utils/themeCustomization';

const themeConfig = {
	development: {
		'color-primary': '#6366f1', // Design X
	},
	production: {
		'color-primary': '#10b981', // Design Z
	},
};

export function initializeTheme() {
	const env = import.meta.env.MODE;
	const theme = themeConfig[env as keyof typeof themeConfig] || themeConfig.development;

	customizeTheme({
		cssVariables: theme,
		persist: false,
	});
}
```

#### Option C: Build-Time Fork

For completely separate projects:

1. Create a branch/fork for each design system
2. Use `mergeDesignTokens()` to customize
3. Update `tailwind.config.ts` and `globals.css`
4. Build separate artifacts

---

## Runtime vs Build-Time Customization

### When to Use Runtime Customization

✅ **Use when:**

- Multiple themes in one app
- User-selectable themes
- A/B testing different designs
- Multi-tenant applications
- Themes change frequently

❌ **Avoid when:**

- Single fixed brand theme
- Performance is critical (minimal overhead, but exists)
- You need to add new token categories

### When to Use Build-Time Customization

✅ **Use when:**

- Fixed brand theme
- Project-specific design system
- Need to add new tokens
- Maximum performance required
- Type safety is critical

❌ **Avoid when:**

- Themes need to change dynamically
- Multiple themes in one app
- User customization required

---

## Component Customization

### Overriding Individual Components

All components accept `className` and `style` props:

```tsx
// Override with Tailwind classes
<Button
  variant="primary"
  className="rounded-full shadow-xl"
>
  Custom Button
</Button>

// Override with inline styles
<Card
  variant="elevated"
  style={{
    backgroundColor: '#custom-color',
    borderRadius: '1rem'
  }}
>
  Custom Card
</Button>
```

### Creating Component Variants

For project-specific variants:

```tsx
// src/components/ProjectSpecificButton.tsx
import Button from '@core/ui/button/Button';
import { getButtonVariantClasses } from '@core/ui/variants/button';

export function ProjectSpecificButton(props: ButtonProps) {
	return (
		<Button
			{...props}
			className={twMerge(
				getButtonVariantClasses({ variant: props.variant, size: props.size }),
				'custom-project-class', // Your custom styling
				props.className
			)}
		/>
	);
}
```

### Extending Design Tokens

To add new tokens:

```ts
// For build-time
const customTokens = mergeDesignTokens({
	color: {
		brand: {
			DEFAULT: '#custom-color',
			light: '#custom-light',
			dark: '#custom-dark',
		},
	},
});

// For runtime
applyCSSVariableOverrides({
	'color-brand': '#custom-color',
	'color-brand-light': '#custom-light',
	'color-brand-dark': '#custom-dark',
});
```

Then update `tailwind.config.ts`:

```ts
colors: {
  brand: {
    DEFAULT: 'var(--color-brand)',
    light: 'var(--color-brand-light)',
    dark: 'var(--color-brand-dark)',
  },
}
```

---

## Troubleshooting

### Components Not Updating

**Problem:** Components still show old colors after theme change.

**Solution:**

1. Ensure components use semantic tokens (`bg-primary` not `bg-blue-500`)
2. Check that CSS variables are properly set:
   ```ts
   console.log(getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
   ```
3. Verify Tailwind config uses CSS variables:
   ```ts
   // In tailwind.config.ts
   primary: {
     DEFAULT: 'var(--color-primary)', // ✅ Correct
     // DEFAULT: '#2563eb', // ❌ Wrong - hardcoded
   }
   ```

### Dark Mode Not Working

**Problem:** Dark mode styles not applying.

**Solution:**

1. Ensure `darkMode: 'class'` in `tailwind.config.ts`
2. Verify `.dark` class is applied to `html` element
3. Check that dark mode CSS variables are defined in `globals.css`

### TypeScript Errors

**Problem:** Type errors when using custom tokens.

**Solution:**

1. Use `PartialDesignTokens` type for partial overrides
2. Ensure `mergeDesignTokens()` returns full `DesignTokens` type
3. Update type definitions if adding new token categories

### Performance Issues

**Problem:** Runtime theme switching is slow.

**Solution:**

1. Batch CSS variable updates:

   ```ts
   // ✅ Good - single update
   customizeTheme({
   	cssVariables: {
   		/* all vars */
   	},
   });

   // ❌ Bad - multiple updates
   applyCSSVariableOverrides({ 'color-primary': '...' });
   applyCSSVariableOverrides({ 'color-secondary': '...' });
   ```

2. Use build-time customization for fixed themes
3. Debounce rapid theme changes

---

## Best Practices

### 1. Use Semantic Naming

```ts
// ✅ Good - semantic
'color-primary': '#6366f1'

// ❌ Bad - descriptive
'color-indigo-500': '#6366f1'
```

### 2. Maintain Token Hierarchy

```ts
// ✅ Good - hierarchical
color: {
  primary: { DEFAULT: '#6366f1', foreground: '#ffffff' },
  secondary: { DEFAULT: '#8b5cf6', foreground: '#ffffff' },
}

// ❌ Bad - flat
'color-primary': '#6366f1',
'color-primary-foreground': '#ffffff',
```

### 3. Document Custom Tokens

```ts
/**
 * Design X Theme Tokens
 *
 * Primary: Indigo (#6366f1) - Main brand color
 * Secondary: Purple (#8b5cf6) - Supporting actions
 *
 * Spacing: 4px base scale (xs: 4, sm: 8, md: 16, ...)
 * Radius: 0.5rem medium (md), 0.75rem large (lg)
 */
export const designXTokens = mergeDesignTokens({
	// ...
});
```

### 4. Test Across Components

After customization, test:

- ✅ All button variants
- ✅ Cards and surfaces
- ✅ Text and typography
- ✅ Forms and inputs
- ✅ Dark mode
- ✅ Responsive breakpoints

### 5. Version Control Themes

For multi-project setups:

```ts
// themes/v1/design-x.ts
export const designXThemeV1 = {
	/* ... */
};

// themes/v2/design-x.ts
export const designXThemeV2 = {
	/* ... */
};
```

### 6. Accessibility

Always verify:

- ✅ Color contrast ratios (WCAG AA minimum)
- ✅ Focus states are visible
- ✅ Text remains readable in dark mode
- ✅ Interactive elements have sufficient touch targets

### 7. Performance

- ✅ Batch CSS variable updates
- ✅ Use build-time customization for fixed themes
- ✅ Avoid excessive inline styles
- ✅ Leverage CSS variables for runtime changes

---

## Example: Complete Migration

Here's a complete example migrating to a new design system:

```ts
// 1. Define your design system
const myDesignSystem = {
	colors: {
		primary: '#6366f1',
		secondary: '#8b5cf6',
		success: '#10b981',
		// ...
	},
	spacing: [4, 8, 16, 24, 32, 48, 64],
	radius: {
		sm: '0.25rem',
		md: '0.5rem',
		lg: '0.75rem',
	},
};

// 2. Create theme configuration
import { customizeTheme } from '@core/utils/themeCustomization';

export function initializeMyDesignSystem() {
	customizeTheme({
		cssVariables: {
			'color-primary': myDesignSystem.colors.primary,
			'color-secondary': myDesignSystem.colors.secondary,
			'color-success': myDesignSystem.colors.success,
			'spacing-xs': `${myDesignSystem.spacing[0]}px`,
			'spacing-sm': `${myDesignSystem.spacing[1]}px`,
			'spacing-md': `${myDesignSystem.spacing[2]}px`,
			'radius-sm': myDesignSystem.radius.sm,
			'radius-md': myDesignSystem.radius.md,
			'radius-lg': myDesignSystem.radius.lg,
		},
		persist: true,
		storageKey: 'my-design-system',
	});
}

// 3. Initialize in your app
// src/app/main.tsx or App.tsx
import { initializeMyDesignSystem } from './config/themes';

initializeMyDesignSystem();
```

---

## Additional Resources

- **Technical Reference**: See `src/core/constants/CUSTOMIZATION.md`
- **Design Tokens**: `src/core/constants/designTokens.ts`
- **Theme Utilities**: `src/core/utils/themeCustomization.ts`
- **Architecture Rules**: `.cursor/rules/ux/theming-tokens.mdc`

---

## Summary

The UI design system is **fully customizable** and can be adapted to work with any design system:

1. ✅ **Runtime customization** via CSS variables (no rebuild needed)
2. ✅ **Build-time customization** via design token merging (type-safe)
3. ✅ **Component-level overrides** via className/style props
4. ✅ **Semantic token system** ensures components adapt automatically
5. ✅ **Multi-project support** through theme configuration

Choose the method that best fits your use case:

- **Runtime**: Dynamic themes, multi-tenant, user customization
- **Build-time**: Fixed themes, maximum performance, type safety
- **Component-level**: Exceptions and special cases

For questions or issues, refer to the troubleshooting section or check the technical documentation.
