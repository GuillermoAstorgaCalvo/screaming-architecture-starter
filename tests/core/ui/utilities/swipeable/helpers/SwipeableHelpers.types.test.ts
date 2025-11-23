/**
 * SwipeableHelpers.types Tests
 *
 * Tests for type definitions and constants:
 * - RESET_SWIPE_STATE
 */

import { RESET_SWIPE_STATE } from '@core/ui/utilities/swipeable/helpers/SwipeableHelpers.types';
import { describe, expect, it } from 'vitest';

describe('SwipeableHelpers.types - RESET_SWIPE_STATE', () => {
	it('has correct structure with all required properties', () => {
		expect(RESET_SWIPE_STATE).toHaveProperty('startX');
		expect(RESET_SWIPE_STATE).toHaveProperty('startY');
		expect(RESET_SWIPE_STATE).toHaveProperty('currentX');
		expect(RESET_SWIPE_STATE).toHaveProperty('currentY');
		expect(RESET_SWIPE_STATE).toHaveProperty('isSwiping');
	});

	it('has all numeric properties set to 0', () => {
		expect(RESET_SWIPE_STATE.startX).toBe(0);
		expect(RESET_SWIPE_STATE.startY).toBe(0);
		expect(RESET_SWIPE_STATE.currentX).toBe(0);
		expect(RESET_SWIPE_STATE.currentY).toBe(0);
	});

	it('has isSwiping set to false', () => {
		expect(RESET_SWIPE_STATE.isSwiping).toBe(false);
	});

	it('matches expected reset state object', () => {
		expect(RESET_SWIPE_STATE).toEqual({
			startX: 0,
			startY: 0,
			currentX: 0,
			currentY: 0,
			isSwiping: false,
		});
	});
});
