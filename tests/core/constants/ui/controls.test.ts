import {
	CHECKBOX_BASE_CLASSES,
	CHECKBOX_SIZE_CLASSES,
	RADIO_BASE_CLASSES,
	RADIO_SIZE_CLASSES,
	SWITCH_BASE_CLASSES,
	SWITCH_CHECKED_CLASSES,
	SWITCH_SIZE_CLASSES,
	SWITCH_THUMB_BASE_CLASSES,
	SWITCH_THUMB_CHECKED_CLASSES,
	SWITCH_THUMB_SIZE_CLASSES,
	SWITCH_THUMB_UNCHECKED_CLASSES,
	SWITCH_UNCHECKED_CLASSES,
} from '@core/constants/ui/controls';
import { describe, expect, it } from 'vitest';

describe('checkbox constants', () => {
	it('locks base and size classes', () => {
		expect(CHECKBOX_BASE_CLASSES).toBe(
			'h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors dark:border-border-dark dark:bg-surface-dark'
		);
		expect(CHECKBOX_SIZE_CLASSES).toEqual({
			sm: 'h-3 w-3',
			md: 'h-4 w-4',
			lg: 'h-5 w-5',
		});
	});
});

describe('switch constants', () => {
	it('locks base classes and state styles', () => {
		expect(SWITCH_BASE_CLASSES).toBe(
			'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
		);
		expect(SWITCH_CHECKED_CLASSES).toBe('bg-primary');
		expect(SWITCH_UNCHECKED_CLASSES).toBe('bg-muted dark:bg-muted-dark');
	});

	it('locks size classes', () => {
		expect(SWITCH_SIZE_CLASSES).toEqual({
			sm: 'h-5 w-9',
			md: 'h-6 w-11',
			lg: 'h-7 w-14',
		});
	});

	it('locks thumb classes', () => {
		expect(SWITCH_THUMB_BASE_CLASSES).toBe(
			'inline-block h-4 w-4 transform rounded-full bg-surface transition-transform'
		);
		expect(SWITCH_THUMB_SIZE_CLASSES).toEqual({
			sm: 'h-3 w-3',
			md: 'h-4 w-4',
			lg: 'h-5 w-5',
		});
		expect(SWITCH_THUMB_CHECKED_CLASSES).toEqual({
			sm: 'translate-x-5',
			md: 'translate-x-6',
			lg: 'translate-x-8',
		});
		expect(SWITCH_THUMB_UNCHECKED_CLASSES).toBe('translate-x-1');
	});
});

describe('radio constants', () => {
	it('locks base and size classes', () => {
		expect(RADIO_BASE_CLASSES).toBe(
			'h-4 w-4 rounded-full border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors dark:border-border-dark dark:bg-surface-dark'
		);
		expect(RADIO_SIZE_CLASSES).toEqual({
			sm: 'h-3 w-3',
			md: 'h-4 w-4',
			lg: 'h-5 w-5',
		});
	});
});
