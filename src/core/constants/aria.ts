/**
 * ARIA roles and attribute values
 * Central source of truth for consistent ARIA usage across the application
 * Supports accessibility standards and reduces duplication
 *
 * Use these constants instead of hardcoding ARIA values throughout the codebase
 *
 * Note: ARIA_LABELS uses i18n for translations to support internationalization
 */

import i18n from '@core/i18n/i18n';

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
 * Uses i18n for translations to support internationalization
 */
export const ARIA_LABELS = {
	/** Close button label */
	get CLOSE() {
		return i18n.t('a11y.close', { ns: 'common' });
	},
	/** Close modal label */
	get CLOSE_MODAL() {
		return i18n.t('a11y.closeModal', { ns: 'common' });
	},
	/** Close drawer label */
	get CLOSE_DRAWER() {
		return i18n.t('a11y.closeDrawer', { ns: 'common' });
	},
	/** Close sheet label */
	get CLOSE_SHEET() {
		return i18n.t('a11y.closeSheet', { ns: 'common' });
	},
	/** Close dialog label */
	get CLOSE_DIALOG() {
		return i18n.t('a11y.closeDialog', { ns: 'common' });
	},
	/** Open menu label */
	get OPEN_MENU() {
		return i18n.t('a11y.openMenu', { ns: 'common' });
	},
	/** Close menu label */
	get CLOSE_MENU() {
		return i18n.t('a11y.closeMenu', { ns: 'common' });
	},
	/** Loading label */
	get LOADING() {
		return i18n.t('a11y.loading', { ns: 'common' });
	},
	/** Loading content label */
	get LOADING_CONTENT() {
		return i18n.t('a11y.loadingContent', { ns: 'common' });
	},
	/** Error message label */
	get ERROR() {
		return i18n.t('a11y.error', { ns: 'common' });
	},
	/** Success message label */
	get SUCCESS() {
		return i18n.t('a11y.success', { ns: 'common' });
	},
	/** Warning message label */
	get WARNING() {
		return i18n.t('a11y.warning', { ns: 'common' });
	},
	/** Info message label */
	get INFO() {
		return i18n.t('a11y.info', { ns: 'common' });
	},
	/** Required field indicator */
	get REQUIRED() {
		return i18n.t('a11y.required', { ns: 'common' });
	},
	/** Search label */
	get SEARCH() {
		return i18n.t('a11y.search', { ns: 'common' });
	},
	/** Submit form label */
	get SUBMIT() {
		return i18n.t('a11y.submit', { ns: 'common' });
	},
	/** Cancel action label */
	get CANCEL() {
		return i18n.t('common.cancel', { ns: 'common' });
	},
	/** Confirm action label */
	get CONFIRM() {
		return i18n.t('common.confirm', { ns: 'common' });
	},
	/** Delete action label */
	get DELETE() {
		return i18n.t('a11y.delete', { ns: 'common' });
	},
	/** Edit action label */
	get EDIT() {
		return i18n.t('a11y.edit', { ns: 'common' });
	},
	/** Save action label */
	get SAVE() {
		return i18n.t('a11y.save', { ns: 'common' });
	},
	/** Previous page label */
	get PREVIOUS() {
		return i18n.t('pagination.previous', { ns: 'common' });
	},
	/** Next page label */
	get NEXT() {
		return i18n.t('pagination.next', { ns: 'common' });
	},
	/** Skip to main content label */
	get SKIP_TO_CONTENT() {
		return i18n.t('a11y.skipToContent', { ns: 'common' });
	},
	/** Toggle theme label */
	get TOGGLE_THEME() {
		return i18n.t('a11y.toggleTheme', { ns: 'common' });
	},
	/** Menu button label */
	get MENU_BUTTON() {
		return i18n.t('a11y.menuButton', { ns: 'common' });
	},
	/** Navigation label */
	get NAVIGATION() {
		return i18n.t('a11y.navigation', { ns: 'common' });
	},
	/** Main content label */
	get MAIN_CONTENT() {
		return i18n.t('a11y.mainContent', { ns: 'common' });
	},
	/** Breadcrumb navigation label */
	get BREADCRUMB() {
		return i18n.t('a11y.breadcrumb', { ns: 'common' });
	},
	/** Tabs navigation label */
	get TABS() {
		return i18n.t('a11y.tabs', { ns: 'common' });
	},
	/** Modal content label */
	get MODAL_CONTENT() {
		return i18n.t('a11y.modalContent', { ns: 'common' });
	},
	/** Pagination label */
	get PAGINATION() {
		return i18n.t('a11y.pagination', { ns: 'common' });
	},
	/** Carousel label */
	get CAROUSEL() {
		return i18n.t('a11y.carousel', { ns: 'common' });
	},
	/** Rating label */
	get RATING() {
		return i18n.t('a11y.rating', { ns: 'common' });
	},
	/** Marquee/scrolling content label */
	get MARQUEE() {
		return i18n.t('a11y.marquee', { ns: 'common' });
	},
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
