import {
	AVATAR_BASE_CLASSES,
	AVATAR_SIZE_CLASSES,
	AVATAR_VARIANT_CLASSES,
	PAGINATION_BASE_CLASSES,
	PAGINATION_BUTTON_BASE_CLASSES,
	PAGINATION_BUTTON_SIZE_CLASSES,
	PAGINATION_BUTTON_VARIANT_CLASSES,
	TABLE_BASE_CLASSES,
	TABLE_CELL_BASE_CLASSES,
	TABLE_HEADER_BASE_CLASSES,
	TABLE_ROW_BASE_CLASSES,
	TABLE_ROW_HOVER_CLASSES,
	TABLE_ROW_STRIPED_CLASSES,
	TABLE_SIZE_CLASSES,
} from '@core/constants/ui/data';
import { describe, expect, it } from 'vitest';

describe('table constants', () => {
	it('locks structural classes', () => {
		expect(TABLE_BASE_CLASSES).toBe('w-full border-collapse');
		expect(TABLE_HEADER_BASE_CLASSES).toBe(
			'bg-muted font-semibold text-left text-text-primary dark:bg-muted-dark dark:text-text-primary-dark'
		);
		expect(TABLE_ROW_BASE_CLASSES).toBe(
			'border-b border-border transition-colors dark:border-border-dark'
		);
		expect(TABLE_ROW_STRIPED_CLASSES).toBe('even:bg-muted dark:even:bg-muted-dark/50');
		expect(TABLE_ROW_HOVER_CLASSES).toBe('hover:bg-muted dark:hover:bg-muted-dark/50');
		expect(TABLE_CELL_BASE_CLASSES).toBe('text-text-primary dark:text-text-primary-dark');
	});

	it('locks size classes', () => {
		expect(TABLE_SIZE_CLASSES).toEqual({
			sm: 'px-xs py-0.5 text-sm',
			md: 'px-md py-sm text-base',
			lg: 'px-xl py-md text-lg',
		});
	});
});

describe('pagination constants', () => {
	it('locks base, size, and variant classes', () => {
		expect(PAGINATION_BASE_CLASSES).toBe('flex items-center justify-center gap-1 flex-wrap');
		expect(PAGINATION_BUTTON_BASE_CLASSES).toBe(
			'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
		);
		expect(PAGINATION_BUTTON_SIZE_CLASSES).toEqual({
			sm: 'px-xs py-0.5 text-sm min-w-[calc(var(--spacing-lg)*2)]',
			md: 'px-sm py-xs text-base min-w-[calc(var(--spacing-lg)*2.5)]',
			lg: 'px-md py-sm text-lg min-w-[calc(var(--spacing-lg)*3)]',
		});
		expect(PAGINATION_BUTTON_VARIANT_CLASSES).toEqual({
			active:
				'bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90',
			inactive:
				'bg-surface text-text-secondary hover:bg-muted dark:bg-surface-dark dark:text-text-secondary-dark dark:hover:bg-muted-dark',
		});
	});
});

describe('avatar constants', () => {
	it('locks base, size, and variant classes', () => {
		expect(AVATAR_BASE_CLASSES).toBe(
			'inline-flex items-center justify-center font-medium text-text-on-primary bg-secondary overflow-hidden flex-shrink-0'
		);
		expect(AVATAR_SIZE_CLASSES).toEqual({
			xs: 'w-6 h-6 text-xs',
			sm: 'w-8 h-8 text-sm',
			md: 'w-10 h-10 text-base',
			lg: 'w-12 h-12 text-lg',
			xl: 'w-16 h-16 text-xl',
			'2xl': 'w-24 h-24 text-2xl',
		});
		expect(AVATAR_VARIANT_CLASSES).toEqual({
			circle: 'rounded-full',
			square: 'rounded-none',
			rounded: 'rounded-md',
		});
	});
});
