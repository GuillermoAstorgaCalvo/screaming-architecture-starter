import { isHorizontal } from '@core/ui/utilities/resizable/helpers/useResizable.helpers';
import { describe, expect, it } from 'vitest';

describe('useResizable.helpers - isHorizontal', () => {
	it('returns true for horizontal direction', () => {
		expect(isHorizontal('horizontal')).toBe(true);
	});

	it('returns true for both direction', () => {
		expect(isHorizontal('both')).toBe(true);
	});

	it('returns false for vertical direction', () => {
		expect(isHorizontal('vertical')).toBe(false);
	});
});
