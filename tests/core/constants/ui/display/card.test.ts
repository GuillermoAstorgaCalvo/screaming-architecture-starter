import {
	CARD_BASE_CLASSES,
	CARD_PADDING_CLASSES,
	CARD_VARIANT_CLASSES,
} from '@core/constants/ui/display/card';
import { describe, expect, it } from 'vitest';

describe('card constants', () => {
	it('locks base, variant, and padding classes', () => {
		expect(CARD_BASE_CLASSES).toBe(
			'rounded-lg border bg-surface transition-shadow dark:bg-surface-dark'
		);
		expect(CARD_VARIANT_CLASSES).toEqual({
			elevated: 'border-border shadow-md hover:shadow-lg dark:border-border-dark dark:shadow-lg',
			outlined: 'border-border dark:border-border-dark',
			flat: 'border-transparent shadow-sm dark:shadow-sm',
		});
		expect(CARD_PADDING_CLASSES).toEqual({
			sm: 'p-sm',
			md: 'p-md',
			lg: 'p-lg',
		});
	});
});
