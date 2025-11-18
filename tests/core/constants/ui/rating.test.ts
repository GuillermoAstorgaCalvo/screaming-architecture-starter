import {
	RATING_BASE_CLASSES,
	RATING_SIZE_CLASSES,
	RATING_STAR_DISABLED_CLASSES,
	RATING_STAR_EMPTY_CLASSES,
	RATING_STAR_FILLED_CLASSES,
	RATING_STAR_INTERACTIVE_CLASSES,
} from '@core/constants/ui/rating';
import { describe, expect, it } from 'vitest';

describe('rating constants', () => {
	it('locks base and size classes', () => {
		expect(RATING_BASE_CLASSES).toBe('inline-flex items-center gap-1');
		expect(RATING_SIZE_CLASSES).toEqual({
			sm: 'h-4 w-4',
			md: 'h-5 w-5',
			lg: 'h-6 w-6',
		});
	});

	it('locks star state classes', () => {
		expect(RATING_STAR_FILLED_CLASSES).toBe(
			'text-warning dark:text-warning-dark transition-colors'
		);
		expect(RATING_STAR_EMPTY_CLASSES).toBe('text-muted dark:text-muted-dark transition-colors');
		expect(RATING_STAR_INTERACTIVE_CLASSES).toBe(
			'cursor-pointer hover:text-warning dark:hover:text-warning-dark'
		);
		expect(RATING_STAR_DISABLED_CLASSES).toBe('cursor-not-allowed opacity-50');
	});
});
