import {
	STAT_CARD_BASE_CLASSES,
	STAT_CARD_ICON_SIZE_CLASSES,
	STAT_CARD_LABEL_SIZE_CLASSES,
	STAT_CARD_TREND_SIZE_CLASSES,
	STAT_CARD_VALUE_SIZE_CLASSES,
} from '@core/constants/ui/display/stat-card';
import { describe, expect, it } from 'vitest';

describe('stat card constants', () => {
	it('locks base and size classes', () => {
		expect(STAT_CARD_BASE_CLASSES).toBe('flex flex-col gap-sm');
		expect(STAT_CARD_VALUE_SIZE_CLASSES).toEqual({
			sm: 'text-2xl font-bold',
			md: 'text-3xl font-bold',
			lg: 'text-4xl font-bold',
		});
		expect(STAT_CARD_LABEL_SIZE_CLASSES).toEqual({
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base',
		});
		expect(STAT_CARD_TREND_SIZE_CLASSES).toEqual({
			sm: 'text-xs',
			md: 'text-sm',
			lg: 'text-base',
		});
		expect(STAT_CARD_ICON_SIZE_CLASSES).toEqual({
			sm: 'w-8 h-8',
			md: 'w-10 h-10',
			lg: 'w-12 h-12',
		});
	});
});
