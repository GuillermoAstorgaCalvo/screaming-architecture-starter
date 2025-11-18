import {
	CODE_BASE_CLASSES,
	CODE_BLOCK_BASE_CLASSES,
	CODE_BLOCK_SIZE_CLASSES,
	CODE_SIZE_CLASSES,
	DESCRIPTION_DETAILS_BASE_CLASSES,
	DESCRIPTION_DETAILS_SIZE_CLASSES,
	DESCRIPTION_LIST_BASE_CLASSES,
	DESCRIPTION_LIST_ORIENTATION_CLASSES,
	DESCRIPTION_LIST_SIZE_CLASSES,
	DESCRIPTION_TERM_BASE_CLASSES,
	DESCRIPTION_TERM_SIZE_CLASSES,
	HEADING_SIZE_CLASSES,
	TEXT_TYPOGRAPHY_SIZE_CLASSES,
} from '@core/constants/ui/display/typography';
import { describe, expect, it } from 'vitest';

describe('typography constants', () => {
	it('locks heading and text size classes', () => {
		expect(HEADING_SIZE_CLASSES).toEqual({
			sm: 'text-lg font-semibold',
			md: 'text-xl font-semibold',
			lg: 'text-2xl font-bold',
		});
		expect(TEXT_TYPOGRAPHY_SIZE_CLASSES).toEqual({
			sm: 'text-sm leading-relaxed',
			md: 'text-base leading-relaxed',
			lg: 'text-lg leading-relaxed',
		});
	});

	it('locks code styles', () => {
		expect(CODE_BASE_CLASSES).toBe(
			'inline-block rounded bg-muted px-1.5 py-0.5 font-mono font-medium text-text-primary dark:bg-muted-dark dark:text-text-primary-dark'
		);
		expect(CODE_SIZE_CLASSES).toEqual({
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base',
		});
		expect(CODE_BLOCK_BASE_CLASSES).toBe(
			'overflow-x-auto rounded-lg border bg-muted dark:bg-muted-dark dark:border-border-dark'
		);
		expect(CODE_BLOCK_SIZE_CLASSES).toEqual({
			sm: 'p-sm text-xs',
			md: 'p-md text-sm',
			lg: 'p-lg text-base',
		});
	});

	it('locks description list styles', () => {
		expect(DESCRIPTION_LIST_BASE_CLASSES).toBe('');
		expect(DESCRIPTION_LIST_ORIENTATION_CLASSES).toEqual({
			horizontal: 'grid grid-cols-1 sm:grid-cols-[max-content_1fr] gap-x-md gap-y-sm',
			vertical: 'flex flex-col gap-y-sm',
		});
		expect(DESCRIPTION_LIST_SIZE_CLASSES).toEqual({
			sm: 'text-sm gap-y-xs gap-x-sm',
			md: 'text-base gap-y-sm gap-x-md',
			lg: 'text-lg gap-y-sm gap-x-lg',
		});
		expect(DESCRIPTION_TERM_BASE_CLASSES).toBe(
			'font-medium text-text-primary dark:text-text-primary-dark'
		);
		expect(DESCRIPTION_TERM_SIZE_CLASSES).toEqual({
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
		});
		expect(DESCRIPTION_DETAILS_BASE_CLASSES).toBe(
			'text-text-secondary dark:text-text-secondary-dark'
		);
		expect(DESCRIPTION_DETAILS_SIZE_CLASSES).toEqual({
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
		});
	});
});
