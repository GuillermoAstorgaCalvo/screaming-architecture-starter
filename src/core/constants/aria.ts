/**
 * ARIA roles and attribute values
 * Central source of truth for consistent ARIA usage across the application
 * Supports accessibility standards and reduces duplication
 *
 * Use these constants instead of hardcoding ARIA values throughout the codebase
 */

/**
 * Common ARIA roles
 * Standard ARIA roles for common UI patterns
 */
export const ARIA_ROLES = {
	/** Alert role - for important messages that should be announced */
	ALERT: 'alert',
	/** Alertdialog role - for modal dialogs that require user response */
	ALERTDIALOG: 'alertdialog',
	/** Application role - for application-like content */
	APPLICATION: 'application',
	/** Article role - for standalone content */
	ARTICLE: 'article',
	/** Banner role - for site-wide headers */
	BANNER: 'banner',
	/** Button role - for interactive button elements */
	BUTTON: 'button',
	/** Complementary role - for supporting content */
	COMPLEMENTARY: 'complementary',
	/** Contentinfo role - for site-wide footers */
	CONTENTINFO: 'contentinfo',
	/** Dialog role - for modal dialogs */
	DIALOG: 'dialog',
	/** Form role - for form containers */
	FORM: 'form',
	/** Main role - for main content */
	MAIN: 'main',
	/** Navigation role - for navigation regions */
	NAVIGATION: 'navigation',
	/** Region role - for significant page regions */
	REGION: 'region',
	/** Search role - for search functionality */
	SEARCH: 'search',
	/** Status role - for status messages */
	STATUS: 'status',
	/** Tab role - for tab elements */
	TAB: 'tab',
	/** Tablist role - for tab containers */
	TABLIST: 'tablist',
	/** Tabpanel role - for tab panel content */
	TABPANEL: 'tabpanel',
} as const;

/**
 * ARIA live region values
 * Used for aria-live attribute to control how screen readers announce updates
 */
export const ARIA_LIVE = {
	/** Polite - screen reader announces when idle */
	POLITE: 'polite',
	/** Assertive - screen reader announces immediately */
	ASSERTIVE: 'assertive',
	/** Off - no live announcements */
	OFF: 'off',
} as const;

/**
 * ARIA busy state values
 * Used for aria-busy attribute to indicate loading states
 */
export const ARIA_BUSY = {
	/** True - element is busy/loading */
	TRUE: 'true',
	/** False - element is not busy */
	FALSE: 'false',
} as const;

/**
 * ARIA expanded state values
 * Used for aria-expanded attribute to indicate expandable/collapsible state
 */
export const ARIA_EXPANDED = {
	/** True - element is expanded */
	TRUE: 'true',
	/** False - element is collapsed */
	FALSE: 'false',
	/** Undefined - element is not expandable */
	UNDEFINED: undefined,
} as const;

/**
 * ARIA checked state values
 * Used for aria-checked attribute for checkboxes, radio buttons, etc.
 */
export const ARIA_CHECKED = {
	/** True - element is checked */
	TRUE: 'true',
	/** False - element is not checked */
	FALSE: 'false',
	/** Mixed - element has mixed/indeterminate state */
	MIXED: 'mixed',
	/** Undefined - element is not checkable */
	UNDEFINED: undefined,
} as const;

/**
 * ARIA selected state values
 * Used for aria-selected attribute for selectable items
 */
export const ARIA_SELECTED = {
	/** True - element is selected */
	TRUE: 'true',
	/** False - element is not selected */
	FALSE: 'false',
	/** Undefined - element is not selectable */
	UNDEFINED: undefined,
} as const;

/**
 * ARIA hidden values
 * Used for aria-hidden attribute to hide elements from screen readers
 */
export const ARIA_HIDDEN = {
	/** True - element is hidden from screen readers */
	TRUE: 'true',
	/** False - element is visible to screen readers */
	FALSE: 'false',
} as const;

/**
 * ARIA invalid values
 * Used for aria-invalid attribute to indicate validation errors
 */
export const ARIA_INVALID = {
	/** True - element has invalid input */
	TRUE: 'true',
	/** False - element input is valid */
	FALSE: 'false',
	/** Grammar - grammatical error */
	GRAMMAR: 'grammar',
	/** Spelling - spelling error */
	SPELLING: 'spelling',
	/** Undefined - no validation state */
	UNDEFINED: undefined,
} as const;

/**
 * Common ARIA label text
 * Standardized labels for common UI elements to ensure consistency
 */
export const ARIA_LABELS = {
	/** Close button label */
	CLOSE: 'Close',
	/** Close modal label */
	CLOSE_MODAL: 'Close modal',
	/** Close drawer label */
	CLOSE_DRAWER: 'Close drawer',
	/** Close sheet label */
	CLOSE_SHEET: 'Close sheet',
	/** Close dialog label */
	CLOSE_DIALOG: 'Close dialog',
	/** Open menu label */
	OPEN_MENU: 'Open menu',
	/** Close menu label */
	CLOSE_MENU: 'Close menu',
	/** Loading label */
	LOADING: 'Loading',
	/** Loading content label */
	LOADING_CONTENT: 'Loading content',
	/** Error message label */
	ERROR: 'Error',
	/** Success message label */
	SUCCESS: 'Success',
	/** Warning message label */
	WARNING: 'Warning',
	/** Info message label */
	INFO: 'Information',
	/** Required field indicator */
	REQUIRED: 'required',
	/** Search label */
	SEARCH: 'Search',
	/** Submit form label */
	SUBMIT: 'Submit form',
	/** Cancel action label */
	CANCEL: 'Cancel',
	/** Confirm action label */
	CONFIRM: 'Confirm',
	/** Delete action label */
	DELETE: 'Delete',
	/** Edit action label */
	EDIT: 'Edit',
	/** Save action label */
	SAVE: 'Save',
	/** Previous page label */
	PREVIOUS: 'Previous',
	/** Next page label */
	NEXT: 'Next',
	/** Skip to main content label */
	SKIP_TO_CONTENT: 'Skip to main content',
	/** Toggle theme label */
	TOGGLE_THEME: 'Toggle theme',
	/** Menu button label */
	MENU_BUTTON: 'Menu',
	/** Navigation label */
	NAVIGATION: 'Navigation',
	/** Main content label */
	MAIN_CONTENT: 'Main content',
	/** Breadcrumb navigation label */
	BREADCRUMB: 'Breadcrumb',
	/** Tabs navigation label */
	TABS: 'Tabs',
	/** Modal content label */
	MODAL_CONTENT: 'Modal content',
	/** Pagination label */
	PAGINATION: 'Pagination',
	/** Carousel label */
	CAROUSEL: 'Carousel',
	/** Rating label */
	RATING: 'Rating',
	/** Marquee/scrolling content label */
	MARQUEE: 'Scrolling content',
} as const;

/**
 * ARIA label helper function
 * Creates standardized ARIA labels with optional context
 *
 * @param baseLabel - Base label from ARIA_LABELS
 * @param context - Optional context to append (e.g., item name)
 * @returns Formatted ARIA label string
 *
 * @example
 * ```ts
 * const label = createAriaLabel(ARIA_LABELS.CLOSE, 'dialog');
 * // Returns: "Close dialog"
 * ```
 */
export function createAriaLabel(baseLabel: string, context?: string): string {
	if (!context) {
		return baseLabel;
	}
	return `${baseLabel} ${context}`;
}
