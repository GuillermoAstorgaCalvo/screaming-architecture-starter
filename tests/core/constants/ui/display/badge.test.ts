import {
	BADGE_BASE_CLASSES,
	BADGE_SIZE_CLASSES,
	BADGE_VARIANT_CLASSES,
	CHIP_BASE_CLASSES,
	CHIP_SIZE_CLASSES,
	CHIP_VARIANT_CLASSES,
} from '@core/constants/ui/display/badge';
import { describe, expect, it } from 'vitest';

describe('badge constants', () => {
	it('locks base, size, and variant classes', () => {
		expect(BADGE_BASE_CLASSES).toBe(
			'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
		);
		expect(BADGE_SIZE_CLASSES).toEqual({
			sm: 'px-xs py-xs text-xs',
			md: 'px-sm py-xs text-sm',
			lg: 'px-md py-sm text-base',
		});
		expect(BADGE_VARIANT_CLASSES).toEqual({
			default:
				'bg-muted text-text-primary focus:ring-border dark:bg-muted-dark dark:text-text-primary-dark',
			primary:
				'bg-primary text-primary-foreground focus:ring-primary dark:bg-primary dark:text-primary-foreground',
			success:
				'bg-success-light text-success-dark focus:ring-success dark:bg-success-dark dark:text-success-light',
			warning:
				'bg-warning-light text-warning-dark focus:ring-warning dark:bg-warning-dark dark:text-warning-light',
			error:
				'bg-destructive-light text-destructive-dark focus:ring-destructive dark:bg-destructive-dark dark:text-destructive-light',
			info: 'bg-info-light text-info-dark focus:ring-info dark:bg-info-dark dark:text-info-light',
		});
	});
});

describe('chip constants', () => {
	it('reuse badge classes', () => {
		expect(CHIP_BASE_CLASSES).toBe(
			'inline-flex items-center gap-xs rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'
		);
		expect(CHIP_SIZE_CLASSES).toBe(BADGE_SIZE_CLASSES);
		expect(CHIP_VARIANT_CLASSES).toBe(BADGE_VARIANT_CLASSES);
	});
});
