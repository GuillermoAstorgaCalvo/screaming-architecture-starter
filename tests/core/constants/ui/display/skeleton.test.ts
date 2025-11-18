import { SKELETON_BASE_CLASSES } from '@core/constants/ui/display/skeleton';
import { describe, expect, it } from 'vitest';

describe('skeleton constants', () => {
	it('locks base classes', () => {
		expect(SKELETON_BASE_CLASSES).toBe('animate-pulse rounded bg-muted dark:bg-muted-dark');
	});
});
