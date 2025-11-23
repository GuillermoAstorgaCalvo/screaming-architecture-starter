/**
 * Tests for calculatePositionState helper function
 */

import { calculatePositionState } from '@core/ui/affix/helpers/useAffix.helpers';
import { beforeEach, describe, expect, it } from 'vitest';

import { createMockRect, setupWindowViewport } from './useAffix.helpers.test-utils';

const DEFAULT_RECT = createMockRect(0, 0, 100, 100);
const DEFAULT_INITIAL_POSITION = 100;
const DEFAULT_THRESHOLD = 0;
const POSITION_TOP = 'top' as const;
const DESCRIBE_BASIC_THRESHOLD = 'basic threshold detection';

describe('useAffix.helpers - calculatePositionState - top position', () => {
	beforeEach(() => {
		setupWindowViewport();
	});

	describe(DESCRIBE_BASIC_THRESHOLD, () => {
		it('returns true when scroll position reaches threshold', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 100,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});

		it('returns true when scroll position exceeds threshold', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 150,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});

		it('returns false when scroll position is below threshold', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 50,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(false);
		});

		it('respects threshold when calculating stick position', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 90,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: 20,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true); // 90 >= 100 - 20 = 80
		});

		it('returns false when scroll position is below threshold-adjusted position', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 70,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: 20,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(false); // 70 < 100 - 20 = 80
		});
	});
});

describe('useAffix.helpers - calculatePositionState - left position', () => {
	beforeEach(() => {
		setupWindowViewport();
	});

	describe(DESCRIBE_BASIC_THRESHOLD, () => {
		it('returns true when scroll position reaches threshold', () => {
			const result = calculatePositionState({
				position: 'left',
				scrollPosition: 100,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});

		it('returns true when scroll position exceeds threshold', () => {
			const result = calculatePositionState({
				position: 'left',
				scrollPosition: 150,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});

		it('returns false when scroll position is below threshold', () => {
			const result = calculatePositionState({
				position: 'left',
				scrollPosition: 50,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(false);
		});

		it('respects threshold when calculating stick position', () => {
			const result = calculatePositionState({
				position: 'left',
				scrollPosition: 90,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: 20,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});
	});
});

describe('useAffix.helpers - calculatePositionState - bottom position', () => {
	beforeEach(() => {
		setupWindowViewport();
	});

	describe(DESCRIBE_BASIC_THRESHOLD, () => {
		it('returns true when scroll position reaches bottom threshold', () => {
			const result = calculatePositionState({
				position: 'bottom',
				scrollPosition: 700,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true); // 700 + 800 >= 100 + 100 + 0 = 200
		});

		it('returns true when scroll position exceeds bottom threshold', () => {
			const result = calculatePositionState({
				position: 'bottom',
				scrollPosition: 800,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});

		it('returns false when scroll position is below bottom threshold', () => {
			const result = calculatePositionState({
				position: 'bottom',
				scrollPosition: 50,
				initialPosition: 1000,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(false); // 50 + 800 = 850 < 1000 + 100 + 0 = 1100
		});
	});
});

describe('useAffix.helpers - calculatePositionState - bottom position - threshold handling', () => {
	beforeEach(() => {
		setupWindowViewport();
	});

	it('respects threshold when calculating bottom stick position', () => {
		const result = calculatePositionState({
			position: 'bottom',
			scrollPosition: 680,
			initialPosition: DEFAULT_INITIAL_POSITION,
			threshold: 20,
			rect: DEFAULT_RECT,
		});

		expect(result).toBe(true); // 680 + 800 >= 100 + 100 + 20 = 220
	});

	it('returns false when scroll position is below threshold-adjusted bottom position', () => {
		const result = calculatePositionState({
			position: 'bottom',
			scrollPosition: 50,
			initialPosition: 1000,
			threshold: 20,
			rect: DEFAULT_RECT,
		});

		expect(result).toBe(false); // 50 + 800 = 850 < 1000 + 100 + 20 = 1120
	});
});

describe('useAffix.helpers - calculatePositionState - bottom position - element size', () => {
	beforeEach(() => {
		setupWindowViewport();
	});

	it('accounts for element height in calculation', () => {
		const result = calculatePositionState({
			position: 'bottom',
			scrollPosition: 500,
			initialPosition: DEFAULT_INITIAL_POSITION,
			threshold: DEFAULT_THRESHOLD,
			rect: createMockRect(0, 0, 100, 200),
		});

		expect(result).toBe(true); // 500 + 800 >= 100 + 200 + 0 = 300
	});
});

describe('useAffix.helpers - calculatePositionState - right position', () => {
	beforeEach(() => {
		setupWindowViewport();
	});

	describe(DESCRIBE_BASIC_THRESHOLD, () => {
		it('returns true when scroll position reaches right threshold', () => {
			const result = calculatePositionState({
				position: 'right',
				scrollPosition: 1100,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true); // 1100 + 1200 >= 100 + 100 + 0 = 200
		});

		it('returns true when scroll position exceeds right threshold', () => {
			const result = calculatePositionState({
				position: 'right',
				scrollPosition: 1200,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});

		it('returns false when scroll position is below right threshold', () => {
			const result = calculatePositionState({
				position: 'right',
				scrollPosition: 50,
				initialPosition: 1500,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(false); // 50 + 1200 = 1250 < 1500 + 100 + 0 = 1600
		});

		it('respects threshold when calculating right stick position', () => {
			const result = calculatePositionState({
				position: 'right',
				scrollPosition: 1080,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: 20,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true); // 1080 + 1200 >= 100 + 100 + 20 = 220
		});

		it('accounts for element width in calculation', () => {
			const result = calculatePositionState({
				position: 'right',
				scrollPosition: 1000,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: createMockRect(0, 0, 200, 100),
			});

			expect(result).toBe(true); // 1000 + 1200 >= 100 + 200 + 0 = 300
		});
	});
});

describe('useAffix.helpers - calculatePositionState - edge cases', () => {
	beforeEach(() => {
		setupWindowViewport();
	});

	describe('threshold handling', () => {
		it('handles zero threshold', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 100,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true);
		});

		it('handles negative threshold', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 90,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: -10,
				rect: DEFAULT_RECT,
			});

			// scrollPosition >= initialPosition - threshold
			// 90 >= 100 - (-10) = 90 >= 110 = false
			expect(result).toBe(false);
		});

		it('handles large threshold values', () => {
			const result = calculatePositionState({
				position: POSITION_TOP,
				scrollPosition: 50,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: 100,
				rect: DEFAULT_RECT,
			});

			expect(result).toBe(true); // 50 >= 100 - 100 = 0
		});
	});

	describe('element size handling', () => {
		it('handles zero-sized element', () => {
			const result = calculatePositionState({
				position: 'bottom',
				scrollPosition: 100,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: createMockRect(0, 0, 0, 0),
			});

			expect(result).toBe(true); // 100 + 800 >= 100 + 0 + 0 = 100
		});

		it('handles very large element sizes', () => {
			const result = calculatePositionState({
				position: 'bottom',
				scrollPosition: 1000,
				initialPosition: DEFAULT_INITIAL_POSITION,
				threshold: DEFAULT_THRESHOLD,
				rect: createMockRect(0, 0, 100, 5000),
			});

			// scrollPosition + viewportSize >= initialPosition + elementSize + threshold
			// 1000 + 800 = 1800 >= 100 + 5000 + 0 = 5100 = false
			expect(result).toBe(false);
		});
	});
});
