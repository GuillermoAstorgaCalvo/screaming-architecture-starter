import {
	FORM_CONTROL_BASE_CLASSES,
	FORM_CONTROL_SIZE_CLASSES,
	INPUT_BASE_CLASSES,
	INPUT_SIZE_CLASSES,
	SELECT_BASE_CLASSES,
	SELECT_SIZE_CLASSES,
	TEXTAREA_BASE_CLASSES,
	TEXTAREA_SIZE_CLASSES,
} from '@core/constants/ui/forms';
import { FORM_ERROR_CLASSES, FORM_NORMAL_CLASSES } from '@core/constants/ui/shared';
import { describe, expect, it } from 'vitest';

const LOCKS_BASE_AND_SIZE_CLASSES = 'locks base and size classes';

describe('input constants', () => {
	it(LOCKS_BASE_AND_SIZE_CLASSES, () => {
		expect(INPUT_BASE_CLASSES).toBe(FORM_CONTROL_BASE_CLASSES);
		expect(INPUT_SIZE_CLASSES).toBe(FORM_CONTROL_SIZE_CLASSES);
	});
});

describe('textarea constants', () => {
	it(LOCKS_BASE_AND_SIZE_CLASSES, () => {
		expect(TEXTAREA_BASE_CLASSES).toBe(`${FORM_CONTROL_BASE_CLASSES} resize-y`);
		expect(TEXTAREA_SIZE_CLASSES).toEqual({
			sm: `${FORM_CONTROL_SIZE_CLASSES.sm} min-h-[calc(var(--spacing-4xl)+var(--spacing-2xl))]`,
			md: `${FORM_CONTROL_SIZE_CLASSES.md} min-h-[calc(var(--spacing-4xl)*1.5625)]`,
			lg: `${FORM_CONTROL_SIZE_CLASSES.lg} min-h-[calc(var(--spacing-4xl)*1.875)]`,
		});
	});
});

describe('select constants', () => {
	it(LOCKS_BASE_AND_SIZE_CLASSES, () => {
		expect(SELECT_BASE_CLASSES).toBe(
			'w-full rounded-md border bg-surface text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-surface-dark dark:text-text-primary-dark appearance-none cursor-pointer dark:border-border-dark'
		);
		expect(SELECT_SIZE_CLASSES).toEqual({
			sm: `${FORM_CONTROL_SIZE_CLASSES.sm} pr-8`,
			md: `${FORM_CONTROL_SIZE_CLASSES.md} pr-10`,
			lg: `${FORM_CONTROL_SIZE_CLASSES.lg} pr-12`,
		});
	});
});

describe('shared form state classes', () => {
	it('are exported via shared constants', () => {
		expect(FORM_ERROR_CLASSES).toBe(
			'border-destructive focus:border-destructive focus:ring-destructive dark:border-destructive-dark dark:focus:border-destructive-dark'
		);
		expect(FORM_NORMAL_CLASSES).toBe(
			'border-border focus:border-primary focus:ring-primary dark:border-border-dark dark:focus:border-primary'
		);
	});
});
