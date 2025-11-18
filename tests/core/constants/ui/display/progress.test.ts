import {
	METER_BAR_BASE_CLASSES,
	METER_BASE_CLASSES,
	METER_SIZE_CLASSES,
	METER_VARIANT_CLASSES,
	PROGRESS_BAR_BASE_CLASSES,
	PROGRESS_BASE_CLASSES,
	PROGRESS_SIZE_CLASSES,
} from '@core/constants/ui/display/progress';
import { describe, expect, it } from 'vitest';

describe('progress constants', () => {
	it('locks base, bar, and size classes', () => {
		expect(PROGRESS_BASE_CLASSES).toBe(
			'w-full overflow-hidden rounded-full bg-muted dark:bg-muted-dark'
		);
		expect(PROGRESS_BAR_BASE_CLASSES).toBe(
			'h-full transition-all duration-slower ease-in-out bg-primary'
		);
		expect(PROGRESS_SIZE_CLASSES).toEqual({
			sm: 'h-1',
			md: 'h-2',
			lg: 'h-3',
		});
	});
});

describe('meter constants', () => {
	it('locks base, bar, size, and variant classes', () => {
		expect(METER_BASE_CLASSES).toBe(
			'w-full overflow-hidden rounded-full bg-muted dark:bg-muted-dark appearance-none [&::-webkit-meter-bar]:appearance-none [&::-webkit-meter-optimum-value]:appearance-none [&::-webkit-meter-suboptimum-value]:appearance-none [&::-webkit-meter-even-less-good-value]:appearance-none'
		);
		expect(METER_BAR_BASE_CLASSES).toBe('h-full transition-all duration-slower ease-in-out');
		expect(METER_SIZE_CLASSES).toEqual({
			sm: 'h-1',
			md: 'h-2',
			lg: 'h-3',
		});
		expect(METER_VARIANT_CLASSES).toEqual({
			default: 'bg-primary',
			success: 'bg-success dark:bg-success-dark',
			warning: 'bg-warning dark:bg-warning-dark',
			error: 'bg-destructive dark:bg-destructive-dark',
		});
	});
});
