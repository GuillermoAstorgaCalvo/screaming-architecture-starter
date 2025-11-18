import {
	ARIA_BUSY,
	ARIA_CHECKED,
	ARIA_EXPANDED,
	ARIA_HIDDEN,
	ARIA_INVALID,
	ARIA_LABELS,
	ARIA_LIVE,
	ARIA_ROLES,
	ARIA_SELECTED,
	createAriaLabel,
} from '@core/constants/aria';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { translationMap, tMock } = vi.hoisted(() => {
	const map = {
		'a11y.close': 'Close',
		'a11y.closeModal': 'Close modal',
		'a11y.closeDrawer': 'Close drawer',
		'a11y.closeSheet': 'Close sheet',
		'a11y.closeDialog': 'Close dialog',
		'a11y.openMenu': 'Open menu',
		'a11y.closeMenu': 'Close menu',
		'a11y.loading': 'Loading',
		'a11y.loadingContent': 'Loading content',
		'a11y.error': 'Error',
		'a11y.success': 'Success',
		'a11y.warning': 'Warning',
		'a11y.info': 'Info',
		'a11y.required': 'Required',
		'a11y.search': 'Search',
		'a11y.submit': 'Submit',
		'common.cancel': 'Cancel',
		'common.confirm': 'Confirm',
		'a11y.delete': 'Delete',
		'a11y.edit': 'Edit',
		'a11y.save': 'Save',
		'pagination.previous': 'Previous',
		'pagination.next': 'Next',
		'a11y.skipToContent': 'Skip to main content',
		'a11y.toggleTheme': 'Toggle theme',
		'a11y.menuButton': 'Menu button',
		'a11y.navigation': 'Navigation',
		'a11y.mainContent': 'Main content',
		'a11y.breadcrumb': 'Breadcrumb',
		'a11y.tabs': 'Tabs',
		'a11y.modalContent': 'Modal content',
		'a11y.pagination': 'Pagination',
		'a11y.carousel': 'Carousel',
		'a11y.rating': 'Rating',
		'a11y.marquee': 'Marquee',
	} as const;

	const mock = vi.fn((key: string) => map[key as keyof typeof map]);

	return { translationMap: map, tMock: mock };
});

vi.mock('@core/i18n/i18n', () => ({
	default: { t: tMock },
}));

function buildExpectedLabels() {
	return {
		CLOSE: translationMap['a11y.close'],
		CLOSE_MODAL: translationMap['a11y.closeModal'],
		CLOSE_DRAWER: translationMap['a11y.closeDrawer'],
		CLOSE_SHEET: translationMap['a11y.closeSheet'],
		CLOSE_DIALOG: translationMap['a11y.closeDialog'],
		OPEN_MENU: translationMap['a11y.openMenu'],
		CLOSE_MENU: translationMap['a11y.closeMenu'],
		LOADING: translationMap['a11y.loading'],
		LOADING_CONTENT: translationMap['a11y.loadingContent'],
		ERROR: translationMap['a11y.error'],
		SUCCESS: translationMap['a11y.success'],
		WARNING: translationMap['a11y.warning'],
		INFO: translationMap['a11y.info'],
		REQUIRED: translationMap['a11y.required'],
		SEARCH: translationMap['a11y.search'],
		SUBMIT: translationMap['a11y.submit'],
		CANCEL: translationMap['common.cancel'],
		CONFIRM: translationMap['common.confirm'],
		DELETE: translationMap['a11y.delete'],
		EDIT: translationMap['a11y.edit'],
		SAVE: translationMap['a11y.save'],
		PREVIOUS: translationMap['pagination.previous'],
		NEXT: translationMap['pagination.next'],
		SKIP_TO_CONTENT: translationMap['a11y.skipToContent'],
		TOGGLE_THEME: translationMap['a11y.toggleTheme'],
		MENU_BUTTON: translationMap['a11y.menuButton'],
		NAVIGATION: translationMap['a11y.navigation'],
		MAIN_CONTENT: translationMap['a11y.mainContent'],
		BREADCRUMB: translationMap['a11y.breadcrumb'],
		TABS: translationMap['a11y.tabs'],
		MODAL_CONTENT: translationMap['a11y.modalContent'],
		PAGINATION: translationMap['a11y.pagination'],
		CAROUSEL: translationMap['a11y.carousel'],
		RATING: translationMap['a11y.rating'],
		MARQUEE: translationMap['a11y.marquee'],
	} satisfies Record<keyof typeof ARIA_LABELS, string>;
}

function assertAllLabelsMatch(expectedLabels: ReturnType<typeof buildExpectedLabels>) {
	for (const [labelKey, translation] of Object.entries(expectedLabels)) {
		expect(ARIA_LABELS[labelKey as keyof typeof expectedLabels]).toBe(translation);
	}
}

function assertTranslationCalls(expectedCount: number) {
	expect(tMock).toHaveBeenCalledTimes(expectedCount);
}

describe('ARIA_ROLES', () => {
	beforeEach(() => {
		tMock.mockClear();
	});

	it('exposes standard ARIA roles', () => {
		expect(ARIA_ROLES).toStrictEqual({
			ALERT: 'alert',
			ALERTDIALOG: 'alertdialog',
			APPLICATION: 'application',
			ARTICLE: 'article',
			BANNER: 'banner',
			BUTTON: 'button',
			COMPLEMENTARY: 'complementary',
			CONTENTINFO: 'contentinfo',
			DIALOG: 'dialog',
			FORM: 'form',
			MAIN: 'main',
			NAVIGATION: 'navigation',
			REGION: 'region',
			SEARCH: 'search',
			STATUS: 'status',
			TAB: 'tab',
			TABLIST: 'tablist',
			TABPANEL: 'tabpanel',
		} as const);
	});
});

describe('ARIA state constants', () => {
	beforeEach(() => {
		tMock.mockClear();
	});

	it('exposes ARIA live region values', () => {
		expect(ARIA_LIVE).toStrictEqual({
			POLITE: 'polite',
			ASSERTIVE: 'assertive',
			OFF: 'off',
		} as const);
	});

	it('exposes ARIA busy states', () => {
		expect(ARIA_BUSY).toStrictEqual({
			TRUE: 'true',
			FALSE: 'false',
		} as const);
	});

	it('exposes ARIA expanded states', () => {
		expect(ARIA_EXPANDED).toStrictEqual({
			TRUE: 'true',
			FALSE: 'false',
			UNDEFINED: undefined,
		} as const);
	});

	it('exposes ARIA checked states', () => {
		expect(ARIA_CHECKED).toStrictEqual({
			TRUE: 'true',
			FALSE: 'false',
			MIXED: 'mixed',
			UNDEFINED: undefined,
		} as const);
	});

	it('exposes ARIA selected states', () => {
		expect(ARIA_SELECTED).toStrictEqual({
			TRUE: 'true',
			FALSE: 'false',
			UNDEFINED: undefined,
		} as const);
	});

	it('exposes ARIA hidden states', () => {
		expect(ARIA_HIDDEN).toStrictEqual({
			TRUE: 'true',
			FALSE: 'false',
		} as const);
	});

	it('exposes ARIA invalid states', () => {
		expect(ARIA_INVALID).toStrictEqual({
			TRUE: 'true',
			FALSE: 'false',
			GRAMMAR: 'grammar',
			SPELLING: 'spelling',
			UNDEFINED: undefined,
		} as const);
	});
});

describe('ARIA_LABELS', () => {
	beforeEach(() => {
		tMock.mockClear();
	});

	it('returns translated labels for every getter', () => {
		const expectedLabels = buildExpectedLabels();

		assertAllLabelsMatch(expectedLabels);
		assertTranslationCalls(Object.keys(expectedLabels).length);
	});
});

describe('createAriaLabel', () => {
	it('returns the base label when context is missing', () => {
		expect(createAriaLabel('Close')).toBe('Close');
	});

	it('appends the context when provided', () => {
		expect(createAriaLabel('Close', 'dialog')).toBe('Close dialog');
	});
});
