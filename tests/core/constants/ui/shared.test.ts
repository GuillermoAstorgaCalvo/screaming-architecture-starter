import {
	FORM_ERROR_CLASSES,
	FORM_NORMAL_CLASSES,
	ICON_SIZE_CLASSES,
	TEXT_SIZE_CLASSES,
} from '@core/constants/ui/shared';
import { describe, expect, it } from 'vitest';

describe('shared text and icon sizes', () => {
	it('locks standardized size classes', () => {
		expect(TEXT_SIZE_CLASSES).toEqual({
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base',
		});
		expect(ICON_SIZE_CLASSES).toEqual({
			sm: 'w-4 h-4',
			md: 'w-5 h-5',
			lg: 'w-6 h-6',
		});
	});
});

describe('shared form state classes', () => {
	it('locks error and normal states', () => {
		expect(FORM_ERROR_CLASSES).toBe(
			'border-destructive focus:border-destructive focus:ring-destructive dark:border-destructive-dark dark:focus:border-destructive-dark'
		);
		expect(FORM_NORMAL_CLASSES).toBe(
			'border-border focus:border-primary focus:ring-primary dark:border-border-dark dark:focus:border-primary'
		);
	});
});
