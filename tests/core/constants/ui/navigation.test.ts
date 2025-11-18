import {
	ACCORDION_BASE_CLASSES,
	ACCORDION_CONTENT_BASE_CLASSES,
	ACCORDION_CONTENT_SIZE_CLASSES,
	ACCORDION_HEADER_BASE_CLASSES,
	ACCORDION_HEADER_SIZE_CLASSES,
	ACCORDION_ITEM_BASE_CLASSES,
	ACCORDION_VARIANT_CLASSES,
	BREADCRUMBS_BASE_CLASSES,
	BREADCRUMBS_ITEM_CLASSES,
	BREADCRUMBS_SEPARATOR_CLASSES,
	DRAWER_BASE_CLASSES,
	DRAWER_OVERLAY_BASE_CLASSES,
	DRAWER_POSITION_CLASSES,
	DRAWER_SIZE_CLASSES,
	SEGMENTED_CONTROL_BASE_CLASSES,
	SEGMENTED_CONTROL_ITEM_BASE_CLASSES,
	SEGMENTED_CONTROL_ITEM_SIZE_CLASSES,
	SEGMENTED_CONTROL_ITEM_VARIANT_CLASSES,
	SEGMENTED_CONTROL_VARIANT_CLASSES,
	SHEET_BASE_CLASSES,
	SHEET_OVERLAY_BASE_CLASSES,
	SHEET_POSITION_CLASSES,
	SHEET_SIZE_CLASSES,
	SIDEBAR_BASE_CLASSES,
	SIDEBAR_COLLAPSED_WIDTH,
	SIDEBAR_DEFAULT_WIDTH,
	SIDEBAR_POSITION_CLASSES,
	TAB_BUTTON_BASE_CLASSES,
	TAB_BUTTON_SIZE_CLASSES,
	TAB_BUTTON_VARIANT_CLASSES,
	TABS_BASE_CLASSES,
	TABS_VARIANT_CLASSES,
	TREE_VIEW_BASE_CLASSES,
	TREE_VIEW_CHILDREN_COLLAPSED_CLASSES,
	TREE_VIEW_CHILDREN_CONTAINER_CLASSES,
	TREE_VIEW_CHILDREN_EXPANDED_CLASSES,
	TREE_VIEW_CHILDREN_EXPANDED_STYLE,
	TREE_VIEW_EXPAND_ICON_CLASSES,
	TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES,
	TREE_VIEW_NODE_BASE_CLASSES,
	TREE_VIEW_NODE_CONTENT_CLASSES,
	TREE_VIEW_NODE_HOVER_CLASSES,
	TREE_VIEW_NODE_ICON_CLASSES,
	TREE_VIEW_NODE_SELECTED_CLASSES,
	TREE_VIEW_NODE_SIZE_CLASSES,
} from '@core/constants/ui/navigation';
import { describe, expect, it } from 'vitest';

const TAB_BUTTON_INACTIVE_EXPECTATION =
	'text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark';
const SEGMENTED_ITEM_INACTIVE_EXPECTATION = TAB_BUTTON_INACTIVE_EXPECTATION;
const SIZE_MD_CLASSES = 'px-sm py-xs text-base';
const SIZE_LG_CLASSES = 'px-md py-sm text-lg';
const TAB_BUTTON_SIZE_EXPECTATION = {
	sm: 'px-xs py-0.5 text-sm',
	md: SIZE_MD_CLASSES,
	lg: SIZE_LG_CLASSES,
} as const;
const SEGMENTED_ITEM_SIZE_EXPECTATION = {
	sm: 'px-sm py-0.5 text-sm',
	md: SIZE_MD_CLASSES,
	lg: SIZE_LG_CLASSES,
} as const;

describe('breadcrumbs constants', () => {
	it('locks base, item, and separator classes', () => {
		expect(BREADCRUMBS_BASE_CLASSES).toBe(
			'flex items-center space-x-sm text-sm text-text-secondary dark:text-text-secondary-dark'
		);
		expect(BREADCRUMBS_ITEM_CLASSES).toBe(
			'inline-flex items-center transition-colors hover:text-text-primary dark:hover:text-text-primary-dark'
		);
		expect(BREADCRUMBS_SEPARATOR_CLASSES).toBe(
			'text-text-muted dark:text-text-muted-dark select-none'
		);
	});
});

describe('drawer and sheet constants', () => {
	it('locks drawer classes', () => {
		expect(DRAWER_BASE_CLASSES).toBe(
			'fixed z-50 bg-surface shadow-xl transition-transform duration-slower ease-in-out dark:bg-surface-dark'
		);
		expect(DRAWER_SIZE_CLASSES).toEqual({
			sm: 'w-[calc(var(--spacing-4xl)*4)] h-[calc(var(--spacing-4xl)*4)]',
			md: 'w-[calc(var(--spacing-4xl)*5)] h-[calc(var(--spacing-4xl)*6)]',
			lg: 'w-[calc(var(--spacing-4xl)*6)] h-[calc(var(--spacing-4xl)*8)]',
			xl: 'w-[calc(var(--spacing-4xl)*7)] h-[calc(var(--spacing-4xl)*10)]',
			full: 'w-full h-full',
		});
		expect(DRAWER_POSITION_CLASSES).toEqual({
			left: 'top-0 left-0 h-full',
			right: 'top-0 right-0 h-full',
			top: 'top-0 left-0 w-full',
			bottom: 'bottom-0 left-0 w-full',
		});
		expect(DRAWER_OVERLAY_BASE_CLASSES).toBe(
			'fixed inset-0 z-40 bg-overlay transition-opacity duration-slower ease-in-out'
		);
	});

	it('locks sheet classes', () => {
		expect(SHEET_BASE_CLASSES).toBe(
			'fixed z-50 bg-surface shadow-2xl transition-transform duration-slower ease-in-out dark:bg-surface-dark'
		);
		expect(SHEET_SIZE_CLASSES).toEqual({
			sm: 'w-[calc(var(--spacing-4xl)*4)] h-[calc(var(--spacing-4xl)*4)]',
			md: 'w-[calc(var(--spacing-4xl)*5)] h-[calc(var(--spacing-4xl)*6)]',
			lg: 'w-[calc(var(--spacing-4xl)*6)] h-[calc(var(--spacing-4xl)*8)]',
			xl: 'w-[calc(var(--spacing-4xl)*7)] h-[calc(var(--spacing-4xl)*10)]',
			full: 'w-full h-full',
		});
		expect(SHEET_POSITION_CLASSES).toEqual({
			left: 'top-0 left-0 h-full',
			right: 'top-0 right-0 h-full',
			top: 'top-0 left-0 w-full',
			bottom: 'bottom-0 left-0 w-full',
		});
		expect(SHEET_OVERLAY_BASE_CLASSES).toBe(
			'fixed inset-0 z-40 bg-overlay-dark transition-opacity duration-slower ease-in-out'
		);
	});
});

describe('sidebar constants', () => {
	it('locks layout classes', () => {
		expect(SIDEBAR_BASE_CLASSES).toBe(
			'flex flex-col h-full bg-surface transition-all duration-slower ease-in-out dark:bg-surface-dark'
		);
		expect(SIDEBAR_POSITION_CLASSES).toEqual({
			left: 'border-r',
			right: 'border-l',
		});
		expect(SIDEBAR_COLLAPSED_WIDTH).toBe('var(--spacing-4xl)');
		expect(SIDEBAR_DEFAULT_WIDTH).toBe('calc(var(--spacing-4xl)*4)');
	});
});

describe('tabs constants', () => {
	it('locks container variants', () => {
		expect(TABS_BASE_CLASSES).toBe('flex space-x-1');
		expect(TABS_VARIANT_CLASSES).toEqual({
			default: '',
			pills: 'bg-muted rounded-lg p-xs dark:bg-muted-dark',
			underline: 'border-b border-border dark:border-border-dark',
		});
	});

	it('locks tab button styles', () => {
		expect(TAB_BUTTON_BASE_CLASSES).toBe(
			'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
		);
		expect(TAB_BUTTON_SIZE_CLASSES).toEqual(TAB_BUTTON_SIZE_EXPECTATION);
		expect(TAB_BUTTON_VARIANT_CLASSES).toEqual({
			default: {
				active: 'text-primary border-b-2 border-primary',
				inactive: TAB_BUTTON_INACTIVE_EXPECTATION,
			},
			pills: {
				active: 'bg-surface text-primary shadow-sm dark:bg-muted-dark dark:text-primary',
				inactive: TAB_BUTTON_INACTIVE_EXPECTATION,
			},
			underline: {
				active: 'text-primary border-b-2 border-primary -mb-px',
				inactive: TAB_BUTTON_INACTIVE_EXPECTATION,
			},
		});
	});
});

describe('segmented control constants', () => {
	it('locks base and variant classes', () => {
		expect(SEGMENTED_CONTROL_BASE_CLASSES).toBe(
			'inline-flex items-center rounded-md bg-muted p-xs dark:bg-muted-dark'
		);
		expect(SEGMENTED_CONTROL_VARIANT_CLASSES).toEqual({
			default: 'bg-muted dark:bg-muted-dark',
			pills: 'bg-muted dark:bg-muted-dark',
			outline: 'bg-transparent border border-border dark:border-border-dark',
		});
	});

	it('locks item styles', () => {
		expect(SEGMENTED_CONTROL_ITEM_BASE_CLASSES).toBe(
			'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
		);
		expect(SEGMENTED_CONTROL_ITEM_SIZE_CLASSES).toEqual(SEGMENTED_ITEM_SIZE_EXPECTATION);
		expect(SEGMENTED_CONTROL_ITEM_VARIANT_CLASSES).toEqual({
			default: {
				active:
					'bg-surface text-text-primary shadow-sm rounded-md dark:bg-muted-dark dark:text-text-primary-dark',
				inactive: SEGMENTED_ITEM_INACTIVE_EXPECTATION,
			},
			pills: {
				active: 'bg-surface text-primary shadow-sm rounded-md dark:bg-muted-dark dark:text-primary',
				inactive: SEGMENTED_ITEM_INACTIVE_EXPECTATION,
			},
			outline: {
				active:
					'bg-primary text-primary-foreground border border-primary rounded-md dark:bg-primary dark:text-primary-foreground',
				inactive: `${SEGMENTED_ITEM_INACTIVE_EXPECTATION} border border-transparent`,
			},
		});
	});
});

describe('accordion constants', () => {
	it('locks accordion classes', () => {
		expect(ACCORDION_BASE_CLASSES).toBe('space-y-1');
		expect(ACCORDION_VARIANT_CLASSES).toEqual({
			default: '',
			bordered: 'border border-border rounded-lg dark:border-border-dark',
			separated: 'space-y-sm',
		});
		expect(ACCORDION_ITEM_BASE_CLASSES).toBe(
			'overflow-hidden transition-all duration-normal ease-in-out'
		);
		expect(ACCORDION_HEADER_BASE_CLASSES).toBe(
			'flex items-center justify-between w-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
		);
		expect(ACCORDION_HEADER_SIZE_CLASSES).toEqual({
			sm: 'px-sm py-sm text-sm',
			md: 'px-md py-md text-base',
			lg: 'px-lg py-lg text-lg',
		});
		expect(ACCORDION_CONTENT_BASE_CLASSES).toBe(
			'overflow-hidden transition-all duration-normal ease-in-out'
		);
		expect(ACCORDION_CONTENT_SIZE_CLASSES).toEqual({
			sm: 'px-sm py-sm',
			md: 'px-md py-md',
			lg: 'px-lg py-lg',
		});
	});
});

describe('tree view constants', () => {
	it('locks base, node, and state classes', () => {
		expect(TREE_VIEW_BASE_CLASSES).toBe('w-full outline-none');
		expect(TREE_VIEW_NODE_BASE_CLASSES).toBe(
			'flex items-center w-full text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
		);
		expect(TREE_VIEW_NODE_SIZE_CLASSES).toEqual({
			sm: 'px-xs py-0.5 text-sm',
			md: SIZE_MD_CLASSES,
			lg: SIZE_LG_CLASSES,
		});
		expect(TREE_VIEW_NODE_SELECTED_CLASSES).toBe(
			'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary'
		);
		expect(TREE_VIEW_NODE_HOVER_CLASSES).toBe('hover:bg-muted dark:hover:bg-muted-dark');
		expect(TREE_VIEW_NODE_CONTENT_CLASSES).toBe('flex items-center flex-1 min-w-0');
		expect(TREE_VIEW_NODE_ICON_CLASSES).toBe('flex-shrink-0 mr-2');
		expect(TREE_VIEW_EXPAND_ICON_CLASSES).toBe(
			'flex-shrink-0 mr-1 text-muted-foreground transition-transform duration-normal'
		);
		expect(TREE_VIEW_EXPAND_ICON_EXPANDED_CLASSES).toBe('rotate-90');
		expect(TREE_VIEW_CHILDREN_CONTAINER_CLASSES).toBe(
			'ml-4 overflow-hidden transition-all duration-normal ease-in-out'
		);
		expect(TREE_VIEW_CHILDREN_EXPANDED_CLASSES).toBe('opacity-100');
		expect(TREE_VIEW_CHILDREN_EXPANDED_STYLE).toEqual({
			maxHeight: 'var(--animation-max-height-tree-view, 10000px)',
		});
		expect(TREE_VIEW_CHILDREN_COLLAPSED_CLASSES).toBe('max-h-0 opacity-0');
	});
});
