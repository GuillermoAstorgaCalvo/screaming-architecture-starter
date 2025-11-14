# UI Customization Guide

This guide explains how to fully customize the UI design system through multiple approaches.

> **📖 For a comprehensive step-by-step guide on adapting the design system to different projects, see [UI Customization Guide](../../../docs/ui-customization-guide.md)**

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [CSS Variable Overrides](#css-variable-overrides)
3. [Runtime Customization](#runtime-customization)
4. [Component-Level Customization](#component-level-customization)
5. [Token Override System](#token-override-system)

## Design Tokens

Design tokens are the single source of truth for all design values. They're defined in `src/core/constants/designTokens.ts`.

### Available Token Categories

- **Colors**: Primary, secondary, accent, muted, destructive, success, warning, info, surface, border, text
- **Spacing**: xs, sm, md, lg, xl, 2xl, 3xl, 4xl
- **Radius**: none, sm, md, lg, xl, 2xl, full
- **Shadows**: none, sm, md, lg, xl, 2xl, inner (with dark mode variants)
- **Typography**: Font families, sizes, weights, letter spacing
- **Z-Index**: base, dropdown, sticky, fixed, modalBackdrop, modal, popover, tooltip
- **Transitions**: Duration (fast, normal, slow, slower) and timing functions
- **Animations**: Duration (fast, normal, slow, slower) for animation-specific use cases

## CSS Variable Overrides

All design tokens are exposed as CSS variables, allowing runtime customization without rebuilding.

### Available CSS Variables

All variables are prefixed with their category:

```css
/* Colors */
--color-primary
--color-primary-foreground
--color-secondary
--color-text-primary
--color-border
/* ... and many more */

/* Spacing */
--spacing-xs
--spacing-sm
--spacing-md
/* ... */

/* Radius */
--radius-sm
--radius-md
--radius-lg
/* ... */

/* Shadows */
--shadow-sm
--shadow-md
--shadow-lg
/* ... */

/* Z-Index */
--z-index-modal
--z-index-tooltip
/* ... */

/* Transitions */
--transition-duration-fast
--transition-timing-ease
/* ... */

/* Animations */
--animation-duration-fast
--animation-duration-normal
/* ... */
```

### Override via CSS

You can override any CSS variable in your own CSS:

```css
:root {
	--color-primary: #ff0000;
	--spacing-md: 20px;
	--radius-lg: 1rem;
}
```

### Override via Inline Styles

```tsx
<div style={{ '--color-primary': '#ff0000' } as React.CSSProperties}>Content</div>
```

## Runtime Customization

Use the theme customization utilities for programmatic customization:

```ts
import {
	applyCSSVariableOverrides,
	customizeTheme,
	loadPersistedTheme,
	resetTheme,
} from '@core/utils/themeCustomization';

// Apply single override
applyCSSVariableOverrides({
	'color-primary': '#ff0000',
});

// Apply multiple overrides with persistence
customizeTheme({
	cssVariables: {
		'color-primary': '#ff0000',
		'spacing-md': '20px',
		'radius-lg': '1rem',
	},
	persist: true,
	storageKey: 'my-custom-theme',
});

// Load persisted theme
const savedTheme = loadPersistedTheme('my-custom-theme');
if (savedTheme) {
	applyCSSVariableOverrides(savedTheme);
}

// Reset to defaults
resetTheme();
```

## Component-Level Customization

All components accept `className` and `style` props for per-component customization:

```tsx
import Button from '@core/ui/button/Button';

// Override with className
<Button className="bg-red-500 hover:bg-red-600">
  Custom Button
</Button>

// Override with style
<Button style={{ backgroundColor: '#ff0000' }}>
  Custom Button
</Button>

// Combine with variants
<Button variant="primary" className="rounded-full">
  Rounded Primary Button
</Button>
```

### Using Tailwind Utilities

Since all tokens are available as Tailwind classes, you can use them directly:

```tsx
// Use semantic color tokens
<div className="bg-primary text-primary-foreground">
  Primary colored content
</div>

<div className="bg-muted text-text-primary">
  Muted background
</div>

<div className="border border-border rounded-lg">
  Bordered container
</div>

// Use spacing tokens
<div className="p-md m-lg">
  Custom spacing
</div>

// Use shadow tokens
<div className="shadow-lg">
  Elevated content
</div>
```

## Token Override System

For build-time customization, you can override design tokens:

```ts
import { mergeDesignTokens } from '@core/constants/designTokens';

// Create custom tokens
const customTokens = mergeDesignTokens({
	color: {
		primary: {
			DEFAULT: '#ff0000',
			foreground: '#ffffff',
		},
	},
	spacing: {
		md: 20,
	},
	radius: {
		lg: '1rem',
	},
});

// Use custom tokens in your Tailwind config
// (You'll need to update tailwind.config.ts to use customTokens instead of designTokens)
```

## Best Practices

1. **Use CSS Variables for Runtime Customization**: Prefer CSS variable overrides for themes that change at runtime.

2. **Use Design Tokens for Build-Time Customization**: Use `mergeDesignTokens` for themes that are fixed at build time.

3. **Use className for Component-Level Overrides**: Use `className` prop for one-off customizations that don't need to be part of the design system.

4. **Maintain Semantic Naming**: When adding custom tokens, use semantic names (e.g., `primary`, `secondary`) rather than descriptive names (e.g., `blue-500`).

5. **Test Dark Mode**: Always test customizations in both light and dark modes.

## Examples

### Complete Theme Override

```ts
// Apply a complete custom theme
customizeTheme({
	cssVariables: {
		// Brand colors
		'color-primary': '#6366f1',
		'color-secondary': '#8b5cf6',
		'color-accent': '#ec4899',

		// Spacing
		'spacing-md': '16px',
		'spacing-lg': '24px',

		// Radius
		'radius-md': '0.5rem',
		'radius-lg': '0.75rem',

		// Shadows
		'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
	},
	persist: true,
});
```

### Component-Specific Customization

```tsx
// Custom button with unique styling
<Button
  variant="primary"
  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
>
  Gradient Button
</Button>

// Custom card with elevated shadow
<Card className="shadow-2xl border-2 border-primary">
  Elevated Card
</Card>
```

### Responsive Customization

```tsx
// Responsive spacing using tokens
<div className="p-sm md:p-md lg:p-lg">
  Responsive padding
</div>

// Responsive colors
<div className="bg-muted md:bg-surface">
  Responsive background
</div>
```

## Migration from Hardcoded Values

If you have components using hardcoded values (e.g., `bg-gray-500`), migrate them to semantic tokens:

```tsx
// Before
<div className="bg-gray-500 text-gray-900">
  Content
</div>

// After
<div className="bg-secondary text-text-primary">
  Content
</div>
```

This ensures your components automatically adapt to theme changes.
