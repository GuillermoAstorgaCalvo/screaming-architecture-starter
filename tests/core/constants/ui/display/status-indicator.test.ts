import { BADGE_SIZE_CLASSES } from '@core/constants/ui/display/badge';
import {
	STATUS_INDICATOR_BADGE_BASE_CLASSES,
	STATUS_INDICATOR_BADGE_SIZE_CLASSES,
	STATUS_INDICATOR_BADGE_STATUS_CLASSES,
	STATUS_INDICATOR_BASE_CLASSES,
	STATUS_INDICATOR_DOT_SIZE_CLASSES,
	STATUS_INDICATOR_STATUS_CLASSES,
} from '@core/constants/ui/display/status-indicator';
import { describe, expect, it } from 'vitest';

describe('status indicator constants', () => {
	it('locks base and state classes', () => {
		expect(STATUS_INDICATOR_BASE_CLASSES).toBe(
			'inline-flex items-center gap-1.5 transition-colors'
		);
		expect(STATUS_INDICATOR_STATUS_CLASSES).toEqual({
			online: 'bg-success dark:bg-success-dark',
			offline: 'bg-secondary dark:bg-secondary-dark',
			busy: 'bg-destructive dark:bg-destructive-dark',
			away: 'bg-warning dark:bg-warning-dark',
		});
		expect(STATUS_INDICATOR_DOT_SIZE_CLASSES).toEqual({
			sm: 'w-2 h-2',
			md: 'w-2.5 h-2.5',
			lg: 'w-3 h-3',
		});
	});

	it('locks badge variants', () => {
		expect(STATUS_INDICATOR_BADGE_BASE_CLASSES).toBe(
			'rounded-full font-medium inline-flex items-center gap-1.5'
		);
		expect(STATUS_INDICATOR_BADGE_SIZE_CLASSES).toBe(BADGE_SIZE_CLASSES);
		expect(STATUS_INDICATOR_BADGE_STATUS_CLASSES).toEqual({
			online: 'bg-success-light text-success-dark dark:bg-success-dark dark:text-success-light',
			offline: 'bg-muted text-text-primary dark:bg-muted-dark dark:text-text-primary-dark',
			busy: 'bg-destructive-light text-destructive-dark dark:bg-destructive-dark dark:text-destructive-light',
			away: 'bg-warning-light text-warning-dark dark:bg-warning-dark dark:text-warning-light',
		});
	});
});
