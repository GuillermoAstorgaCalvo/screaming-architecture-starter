import { THEMES } from '@core/constants/theme';
import { describe, expect, it } from 'vitest';

describe('theme constants', () => {
	it('lists supported themes in priority order', () => {
		expect(THEMES).toEqual(['light', 'dark', 'system']);
	});
});
