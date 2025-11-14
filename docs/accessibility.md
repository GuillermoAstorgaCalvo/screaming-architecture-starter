# Accessibility Guide

This guide covers accessibility best practices, utilities, testing, and keyboard navigation patterns for the Screaming Architecture Starter.

## Table of Contents

- [Using A11y Utilities](#using-a11y-utilities)
- [Testing Accessibility](#testing-accessibility)
- [WCAG Compliance](#wcag-compliance)
- [Keyboard Navigation Patterns](#keyboard-navigation-patterns)

---

## Using A11y Utilities

The project provides framework-agnostic accessibility utilities in `src/core/a11y` for focus management and keyboard navigation.

### Focus Management

The `@core/a11y/focus/focus` module provides utilities for managing focus in accessible components like modals, dialogs, and interactive containers.

#### Getting Focusable Elements

```typescript
import { getFocusableElements } from '@core/a11y/focus/focus';

const modal = document.getElementById('modal');
const focusableElements = getFocusableElements(modal);
// Returns array of focusable HTMLElements, sorted by tabindex
```

**What it excludes:**

- Elements with `tabindex="-1"` (programmatically focusable but not in tab order)
- Disabled form elements
- Elements with `aria-disabled="true"`
- Elements with `aria-hidden="true"`
- Elements inside closed `<details>` elements

**Tab order:**

- Elements with `tabindex > 0` are sorted numerically (1, 2, 3...)
- Elements with `tabindex = 0` or no tabindex maintain DOM order

#### Checking if an Element is Focusable

```typescript
import { isFocusable } from '@core/a11y/focus/focus';

const button = document.querySelector('button');
if (isFocusable(button)) {
	button.focus();
}
```

This performs comprehensive checks including:

- Tab index validation
- Disabled state (form elements and `aria-disabled`)
- ARIA hidden state
- CSS visibility (`display: none`, `visibility: hidden`)
- Closed details elements

#### Focusing Elements

```typescript
import { focusFirstElement, focusLastElement } from '@core/a11y/focus/focus';

// Focus the first focusable element in a container
const modal = document.getElementById('modal');
focusFirstElement(modal);

// Focus the last focusable element (useful for reverse tab navigation)
focusLastElement(modal);
```

#### Focus Trapping

For modals and dialogs, you need to trap focus within the container:

```typescript
import { handleTabNavigation } from '@core/a11y/focus/focus';

function handleKeyDown(event: KeyboardEvent) {
	if (event.key === 'Tab') {
		handleTabNavigation(modalElement, event);
	}
}
```

**How it works:**

- **Tab**: Moves focus from last element to first element (wraps)
- **Shift+Tab**: Moves focus from first element to last element (wraps)

#### Saving and Restoring Focus

When opening modals, save the previously focused element to restore it when closing:

```typescript
import { saveActiveElement } from '@core/a11y/focus/focus';

// Before opening modal
const previousFocus = saveActiveElement();

// Open modal and move focus
modal.showModal();
focusFirstElement(modal);

// When closing modal
modal.close();
previousFocus?.focus(); // Restore previous focus
```

### Skip to Content

The `SkipToContent` component provides a keyboard-accessible skip link that allows users to bypass repetitive navigation.

```tsx
import SkipToContent from '@core/a11y/skipToContent';

// In your app layout
<SkipToContent targetId="main-content" />
<nav>...</nav>
<main id="main-content">...</main>

// With custom label
<SkipToContent
  targetId="main-content"
  label="Skip to page content"
/>
```

**Features:**

- Visible on focus (hidden until keyboard user tabs to it)
- Semantic HTML with proper link semantics
- Scrolls to target element (respects `prefers-reduced-motion`)
- Focus management after skip

**Placement:**

- Place at the very beginning of your page/app layout
- Ensure your main content element has the matching ID

### Using FocusTrap Component

For React components, use the `FocusTrap` component:

```tsx
import FocusTrap from '@core/ui/utilities/focus-trap/FocusTrap';

// Basic usage
<FocusTrap>
  <div>
    <button>First</button>
    <button>Second</button>
    <button>Last</button>
  </div>
</FocusTrap>

// Conditional focus trapping
<FocusTrap enabled={isOpen}>
  <ModalContent />
</FocusTrap>
```

---

## Testing Accessibility

The project provides accessibility testing utilities for both unit tests (Vitest) and E2E tests (Playwright).

### Unit Tests with Vitest

Use `vitest-axe` for component-level accessibility testing:

```typescript
import { renderWithProviders } from '@tests/utils/testUtils';
import { expectA11y } from '@tests/utils/a11y';

test('component is accessible', async () => {
  const { container } = renderWithProviders(<MyComponent />);
  await expectA11y(container);
});
```

#### Custom Assertions

For more control over assertions:

```typescript
import { getA11yViolations } from '@tests/utils/a11y';

test('component has no critical violations', async () => {
  const { container } = renderWithProviders(<MyComponent />);
  const results = await getA11yViolations(container);

  const criticalViolations = results.violations.filter(
    v => v.impact === 'critical'
  );
  expect(criticalViolations).toHaveLength(0);
});
```

#### Custom Axe Configuration

```typescript
import { expectA11y, defaultAxeConfig } from '@tests/utils/a11y';

test('component is accessible with custom config', async () => {
  const { container } = renderWithProviders(<MyComponent />);
  await expectA11y(container, {
    ...defaultAxeConfig,
    rules: {
      ...defaultAxeConfig.rules,
      'color-contrast': { enabled: true }, // Enable color contrast checks
    },
  });
});
```

**Default configuration:**

- `color-contrast`: Disabled (design tokens handle this)
- `page-has-heading-one`: Disabled (may not apply to component tests)

### E2E Tests with Playwright

Use `@axe-core/playwright` for page-level accessibility testing:

```typescript
import { expectA11y } from '@e2e/utils/a11y';

test('home page is accessible', async ({ page }) => {
	await page.goto('/');
	await expectA11y(page);
});
```

#### Testing Specific Elements

```typescript
import { expectA11yElement } from '@e2e/utils/a11y';

test('form is accessible', async ({ page }) => {
	await page.goto('/contact');
	await expectA11yElement(page, 'form');
});
```

#### Custom Axe Configuration

```typescript
import { getA11yViolations, defaultAxeConfig } from '@e2e/utils/a11y';

test('page has no violations', async ({ page }) => {
	await page.goto('/');
	const results = await getA11yViolations(page, {
		...defaultAxeConfig,
		rules: {
			...defaultAxeConfig.rules,
			'color-contrast': { enabled: true },
		},
	});
	expect(results.violations).toHaveLength(0);
});
```

### Testing Best Practices

1. **Test critical components**: Include axe checks for all critical components and pages
2. **Test variants**: Test all component variants (disabled, error states, etc.)
3. **Test keyboard navigation**: Manually verify keyboard-only navigation works
4. **Test with screen readers**: Perform smoke tests with NVDA (Windows) or VoiceOver (macOS)
5. **Test focus management**: Verify focus is managed correctly in modals, dialogs, and dynamic content

### Common Test Patterns

#### Testing Modal Accessibility

```typescript
test('modal is accessible', async () => {
  const { container } = renderWithProviders(
    <Modal open={true}>
      <ModalContent />
    </Modal>
  );

  // Check for accessibility violations
  await expectA11y(container);

  // Verify focus is trapped
  const focusableElements = getFocusableElements(container);
  expect(focusableElements.length).toBeGreaterThan(0);
});
```

#### Testing Form Accessibility

```typescript
test('form is accessible', async () => {
  const { container } = renderWithProviders(<ContactForm />);

  await expectA11y(container);

  // Verify all inputs have labels
  const inputs = container.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const label = container.querySelector(`label[for="${id}"]`);
    expect(label).toBeTruthy();
  });
});
```

---

## WCAG Compliance

The project aims to meet **WCAG 2.2 Level AA** for all new work, with AAA where low effort and high value.

### WCAG 2.2 Level AA Requirements

#### Perceivable

1. **Text Alternatives**
   - Provide alt text for images (avoid redundant alt for decorative images)
   - Use `aria-label` or `aria-labelledby` for icons without text

2. **Color Contrast**
   - Minimum contrast ratio of 4.5:1 for normal text
   - Minimum contrast ratio of 3:1 for large text (18pt+ or 14pt+ bold)
   - Use design tokens to ensure consistent contrast

3. **Text Resizing**
   - Text can be resized up to 200% without loss of functionality
   - Use relative units (rem, em) instead of fixed pixels

4. **Audio Control**
   - Provide controls to pause, stop, or adjust volume for auto-playing audio

#### Operable

1. **Keyboard Accessible**
   - All functionality available via keyboard
   - No keyboard traps
   - Visible focus indicators

2. **Enough Time**
   - Provide sufficient time to read and use content
   - Allow users to extend or disable time limits

3. **Seizures and Physical Reactions**
   - No content flashes more than 3 times per second
   - Respect `prefers-reduced-motion`

4. **Navigation**
   - Provide skip links (use `SkipToContent` component)
   - Use proper heading hierarchy (`h1` → `h2` → `h3`...)
   - Use landmark regions (`header`, `nav`, `main`, `aside`, `footer`)

5. **Input Modalities**
   - Interactive targets are at least 44x44 CSS pixels
   - Provide alternative input methods where applicable

#### Understandable

1. **Readable**
   - Set language attribute (`lang`) on HTML element
   - Use clear, concise language

2. **Predictable**
   - Consistent navigation and functionality
   - No unexpected context changes (e.g., focus changes)

3. **Input Assistance**
   - Provide error identification and suggestions
   - Use proper form labels and error messages

#### Robust

1. **Compatible**
   - Use semantic HTML
   - Provide proper ARIA attributes when semantics are insufficient
   - Ensure valid HTML markup

### Implementation Checklist

- [ ] All images have appropriate alt text
- [ ] Color contrast meets AA standards (use design tokens)
- [ ] All interactive elements are keyboard accessible
- [ ] Visible focus indicators on all focusable elements
- [ ] Proper heading hierarchy (h1 → h2 → h3...)
- [ ] Landmark regions used for page structure
- [ ] Skip link provided (use `SkipToContent` component)
- [ ] Form inputs have associated labels
- [ ] Error messages are clearly associated with inputs
- [ ] Language attribute set on HTML element
- [ ] `prefers-reduced-motion` respected for animations
- [ ] Interactive targets are at least 44x44 CSS pixels
- [ ] No keyboard traps
- [ ] Focus management in modals/dialogs
- [ ] ARIA attributes used appropriately (only when semantics insufficient)

### Common WCAG Violations to Avoid

1. **Missing alt text**: Always provide alt text for images (use empty alt for decorative images)
2. **Low color contrast**: Use design tokens, verify with axe
3. **Missing labels**: All form inputs must have labels
4. **Keyboard traps**: Ensure all functionality is keyboard accessible
5. **Missing focus indicators**: All focusable elements must have visible focus states
6. **Improper heading hierarchy**: Don't skip heading levels (h1 → h3)
7. **Missing skip links**: Provide skip links for repetitive navigation
8. **Insufficient target size**: Interactive elements must be at least 44x44px

---

## Keyboard Navigation Patterns

This section covers common keyboard navigation patterns and how to implement them using the project's utilities.

### Basic Keyboard Navigation

#### Tab Navigation

Standard tab order follows DOM order. Use semantic HTML and proper `tabindex` values:

```tsx
// Good: Natural tab order
<button>First</button>
<input type="text" />
<button>Second</button>

// Avoid: Using tabindex > 0 unless necessary
<button tabIndex={2}>First</button> // ❌ Avoid
<button tabIndex={1}>Second</button> // ❌ Avoid
```

#### Focus Indicators

All focusable elements must have visible focus indicators:

```tsx
// Use Tailwind focus utilities
<button className="focus:outline-none focus:ring-2 focus:ring-primary-500">Click me</button>
```

### Modal and Dialog Patterns

Modals require focus trapping and proper focus management:

```tsx
import { useRef, useEffect } from 'react';
import { focusFirstElement, saveActiveElement, handleTabNavigation } from '@core/a11y/focus/focus';

function Modal({ isOpen, onClose, children }) {
	const modalRef = useRef<HTMLDialogElement>(null);
	const previousFocusRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (isOpen) {
			// Save previous focus
			previousFocusRef.current = saveActiveElement();

			// Focus first element in modal
			if (modalRef.current) {
				focusFirstElement(modalRef.current);
			}
		} else {
			// Restore previous focus
			previousFocusRef.current?.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !modalRef.current) return;

		const handler = (event: KeyboardEvent) => {
			if (event.key === 'Tab') {
				handleTabNavigation(modalRef.current, event);
			} else if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<dialog ref={modalRef} role="dialog" aria-modal="true">
			{children}
		</dialog>
	);
}
```

**Key points:**

- Trap focus within modal (Tab/Shift+Tab wrap)
- Save and restore focus when opening/closing
- Close on Escape key
- Focus first element when opening

### Tabs Pattern

Tabs use arrow keys for navigation:

```tsx
// See src/core/ui/navigation/tabs for full implementation
// Key patterns:
// - ArrowLeft/ArrowRight: Navigate between tabs
// - Home: Move to first tab
// - End: Move to last tab
```

**ARIA attributes:**

- `role="tablist"` on container
- `role="tab"` on each tab button
- `role="tabpanel"` on content panel
- `aria-selected` on active tab
- `aria-controls` linking tab to panel

### Menu and Navigation Patterns

#### Dropdown Menus

```tsx
function DropdownMenu({ isOpen, onClose, items }) {
	const menuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen || !menuRef.current) return;

		const handler = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'Escape':
					onClose();
					break;
				case 'ArrowDown':
					// Move to next item
					event.preventDefault();
					// ... navigation logic
					break;
				case 'ArrowUp':
					// Move to previous item
					event.preventDefault();
					// ... navigation logic
					break;
				case 'Enter':
				case ' ':
					// Activate item
					event.preventDefault();
					// ... activation logic
					break;
			}
		};

		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [isOpen, onClose]);

	// ... render menu
}
```

**Key patterns:**

- **Escape**: Close menu
- **ArrowDown/ArrowUp**: Navigate items
- **Enter/Space**: Activate item
- **Home/End**: First/last item

#### Command Palette

See `src/core/ui/overlays/command-palette` for full implementation:

```tsx
// Key patterns:
// - Escape: Close palette
// - ArrowDown/ArrowUp: Navigate options
// - Enter: Select option
// - Home/End: First/last option
```

### Tree View Pattern

Tree views use arrow keys for navigation:

```tsx
// See src/core/ui/data-display/tree-view for full implementation
// Key patterns:
// - ArrowRight: Expand node or move to first child
// - ArrowLeft: Collapse node or move to parent
// - ArrowDown/ArrowUp: Navigate siblings
// - Enter/Space: Activate node
// - Home/End: First/last node
```

### Autocomplete Pattern

Autocomplete combines input and list navigation:

```tsx
function Autocomplete({ options, onSelect }) {
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const listRef = useRef<HTMLUListElement>(null);

	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				setSelectedIndex(prev => (prev < options.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				event.preventDefault();
				setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				if (selectedIndex >= 0) {
					event.preventDefault();
					onSelect(options[selectedIndex]);
				}
				break;
			case 'Escape':
				// Close dropdown
				break;
		}
	};

	// ... render
}
```

**Key patterns:**

- **ArrowDown/ArrowUp**: Navigate options
- **Enter**: Select highlighted option
- **Escape**: Close dropdown
- **Type**: Filter options

### Common Keyboard Shortcuts

#### Standard Patterns

| Key               | Action                                     |
| ----------------- | ------------------------------------------ |
| `Tab`             | Move to next focusable element             |
| `Shift+Tab`       | Move to previous focusable element         |
| `Enter`           | Activate button/link                       |
| `Space`           | Activate button, toggle checkbox           |
| `Escape`          | Close modal/dialog/menu                    |
| `ArrowLeft/Right` | Navigate horizontal items (tabs, carousel) |
| `ArrowUp/Down`    | Navigate vertical items (menu, list)       |
| `Home`            | Move to first item                         |
| `End`             | Move to last item                          |

#### ARIA Keyboard Patterns

Follow [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) for component-specific patterns:

- **Tabs**: Arrow keys for navigation
- **Menus**: Arrow keys, Enter, Escape
- **Dialogs**: Tab trapping, Escape to close
- **Tree views**: Arrow keys for expand/collapse/navigation
- **Combobox**: Arrow keys, Enter, Escape

### Testing Keyboard Navigation

#### Manual Testing

1. **Disable mouse**: Unplug mouse or use keyboard-only
2. **Tab through page**: Verify all interactive elements are reachable
3. **Test focus indicators**: Verify visible focus on all elements
4. **Test shortcuts**: Verify component-specific keyboard shortcuts work
5. **Test focus traps**: Verify modals trap focus correctly
6. **Test focus restoration**: Verify focus returns after closing modals

#### Automated Testing

```typescript
import { fireEvent } from '@testing-library/react';

test('keyboard navigation works', () => {
  const { container } = renderWithProviders(<MyComponent />);
  const firstButton = container.querySelector('button');

  // Focus first button
  firstButton?.focus();
  expect(document.activeElement).toBe(firstButton);

  // Tab to next element
  fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
  // ... verify focus moved
});
```

### Best Practices

1. **Use semantic HTML**: Prefer `<button>` over `<div onClick>`
2. **Maintain tab order**: Use natural DOM order, avoid `tabindex > 0`
3. **Provide focus indicators**: All focusable elements need visible focus
4. **Trap focus in modals**: Use `handleTabNavigation` or `FocusTrap` component
5. **Restore focus**: Save and restore focus when opening/closing modals
6. **Follow ARIA patterns**: Implement standard keyboard patterns for components
7. **Test with keyboard**: Always test keyboard-only navigation
8. **Document shortcuts**: Document any custom keyboard shortcuts

---

## Additional Resources

- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [axe DevTools](https://www.deque.com/axe/devtools/)
