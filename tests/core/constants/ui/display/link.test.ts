import {
	LINK_BASE_CLASSES,
	LINK_SIZE_CLASSES,
	LINK_VARIANT_CLASSES,
} from '@core/constants/ui/display/link';
import { describe, expect, it } from 'vitest';

describe('link constants', () => {
	it('locks base, variant, and size classes', () => {
		expect(LINK_BASE_CLASSES).toBe(
			'inline-flex items-center text-primary underline-offset-4 transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'
		);
		expect(LINK_VARIANT_CLASSES).toEqual({
			default: 'text-primary hover:text-primary/90 dark:text-primary dark:hover:text-primary/80',
			subtle:
				'text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark',
			muted:
				'text-text-muted hover:text-text-secondary dark:text-text-muted-dark dark:hover:text-text-secondary-dark',
		});
		expect(LINK_SIZE_CLASSES).toEqual({
			sm: 'text-sm',
			md: 'text-base',
			lg: 'text-lg',
		});
	});
});
