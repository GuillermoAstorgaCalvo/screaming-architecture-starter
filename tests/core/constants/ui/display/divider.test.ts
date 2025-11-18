import {
	DIVIDER_BASE_CLASSES,
	DIVIDER_ORIENTATION_CLASSES,
	SEPARATOR_BASE_CLASSES,
	SEPARATOR_ORIENTATION_CLASSES,
} from '@core/constants/ui/display/divider';
import { describe, expect, it } from 'vitest';

describe('divider constants', () => {
	it('locks base and orientation classes', () => {
		expect(DIVIDER_BASE_CLASSES).toBe('border-border dark:border-border-dark');
		expect(DIVIDER_ORIENTATION_CLASSES).toEqual({
			horizontal: 'w-full border-t',
			vertical: 'h-full border-l',
		});
	});
});

describe('separator constants', () => {
	it('locks base and orientation classes', () => {
		expect(SEPARATOR_BASE_CLASSES).toBe('border-border dark:border-border-dark');
		expect(SEPARATOR_ORIENTATION_CLASSES).toEqual({
			horizontal: 'w-full border-t',
			vertical: 'h-full border-l',
		});
	});
});
