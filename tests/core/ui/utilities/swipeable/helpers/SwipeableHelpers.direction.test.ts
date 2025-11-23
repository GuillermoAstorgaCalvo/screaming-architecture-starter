/**
 * SwipeableHelpers.direction Tests
 *
 * Tests for direction calculation and action retrieval:
 * - calculateSwipeDirection
 * - getActionsForDirection
 * - getDirectionFlags
 */

import {
	calculateSwipeDirection,
	getActionsForDirection,
	getDirectionFlags,
} from '@core/ui/utilities/swipeable/helpers/SwipeableHelpers.direction';
import type { SwipeableAction } from '@src-types/ui/overlays/interactions';
import { describe, expect, it } from 'vitest';

describe('SwipeableHelpers.direction - calculateSwipeDirection - basic directions', () => {
	it('returns "right" when deltaX is positive and greater than deltaY', () => {
		expect(
			calculateSwipeDirection({ absDeltaX: 100, absDeltaY: 50, deltaX: 100, deltaY: 50 })
		).toBe('right');
	});

	it('returns "left" when deltaX is negative and absDeltaX is greater than absDeltaY', () => {
		expect(
			calculateSwipeDirection({ absDeltaX: 100, absDeltaY: 50, deltaX: -100, deltaY: 50 })
		).toBe('left');
	});

	it('returns "down" when deltaY is positive and greater than deltaX', () => {
		expect(
			calculateSwipeDirection({ absDeltaX: 50, absDeltaY: 100, deltaX: 50, deltaY: 100 })
		).toBe('down');
	});

	it('returns "up" when deltaY is negative and absDeltaY is greater than absDeltaX', () => {
		expect(
			calculateSwipeDirection({ absDeltaX: 50, absDeltaY: 100, deltaX: 50, deltaY: -100 })
		).toBe('up');
	});
});

describe('SwipeableHelpers.direction - calculateSwipeDirection - edge cases - equal deltas', () => {
	it('returns null when absDeltaX equals absDeltaY', () => {
		expect(calculateSwipeDirection({ absDeltaX: 50, absDeltaY: 50, deltaX: 50, deltaY: 50 })).toBe(
			null
		);
	});

	it('returns null when both deltas are zero', () => {
		expect(calculateSwipeDirection({ absDeltaX: 0, absDeltaY: 0, deltaX: 0, deltaY: 0 })).toBe(
			null
		);
	});

	it('returns null when absDeltaX equals absDeltaY with opposite signs', () => {
		expect(calculateSwipeDirection({ absDeltaX: 50, absDeltaY: 50, deltaX: 50, deltaY: -50 })).toBe(
			null
		);
	});

	it('returns null when absDeltaX equals absDeltaY with both negative', () => {
		expect(
			calculateSwipeDirection({ absDeltaX: 50, absDeltaY: 50, deltaX: -50, deltaY: -50 })
		).toBe(null);
	});
});

describe('SwipeableHelpers.direction - calculateSwipeDirection - edge cases - dominant axis with mixed signs', () => {
	it('returns "right" when deltaX is positive and absDeltaX equals absDeltaY but deltaX > 0', () => {
		// When absDeltaX > absDeltaY, it should return right/left based on deltaX sign
		expect(
			calculateSwipeDirection({ absDeltaX: 100, absDeltaY: 50, deltaX: 100, deltaY: -50 })
		).toBe('right');
	});

	it('returns "left" when deltaX is negative and absDeltaX equals absDeltaY but deltaX < 0', () => {
		expect(
			calculateSwipeDirection({ absDeltaX: 100, absDeltaY: 50, deltaX: -100, deltaY: -50 })
		).toBe('left');
	});
});

describe('SwipeableHelpers.direction - calculateSwipeDirection - edge cases - slight differences', () => {
	it('returns "right" when deltaX is positive and absDeltaX is slightly greater than absDeltaY', () => {
		expect(calculateSwipeDirection({ absDeltaX: 51, absDeltaY: 50, deltaX: 51, deltaY: 50 })).toBe(
			'right'
		);
	});

	it('returns "down" when deltaY is positive and absDeltaY is slightly greater than absDeltaX', () => {
		expect(calculateSwipeDirection({ absDeltaX: 50, absDeltaY: 51, deltaX: 50, deltaY: 51 })).toBe(
			'down'
		);
	});

	it('returns "up" when deltaY is negative and absDeltaY is slightly greater than absDeltaX', () => {
		expect(calculateSwipeDirection({ absDeltaX: 50, absDeltaY: 51, deltaX: 50, deltaY: -51 })).toBe(
			'up'
		);
	});
});

// Shared test data for getActionsForDirection tests
const leftActions: readonly SwipeableAction[] = [{ id: 'left1', content: 'Left 1' }];
const rightActions: readonly SwipeableAction[] = [{ id: 'right1', content: 'Right 1' }];
const upActions: readonly SwipeableAction[] = [{ id: 'up1', content: 'Up 1' }];
const downActions: readonly SwipeableAction[] = [{ id: 'down1', content: 'Down 1' }];

describe('SwipeableHelpers.direction - getActionsForDirection - basic direction mapping', () => {
	it('returns leftActions for "left" direction', () => {
		const result = getActionsForDirection({
			direction: 'left',
			leftActions,
			rightActions,
			upActions,
			downActions,
		});
		expect(result).toEqual(leftActions);
	});

	it('returns rightActions for "right" direction', () => {
		const result = getActionsForDirection({
			direction: 'right',
			leftActions,
			rightActions,
			upActions,
			downActions,
		});
		expect(result).toEqual(rightActions);
	});

	it('returns upActions for "up" direction', () => {
		const result = getActionsForDirection({
			direction: 'up',
			leftActions,
			rightActions,
			upActions,
			downActions,
		});
		expect(result).toEqual(upActions);
	});

	it('returns downActions for "down" direction', () => {
		const result = getActionsForDirection({
			direction: 'down',
			leftActions,
			rightActions,
			upActions,
			downActions,
		});
		expect(result).toEqual(downActions);
	});
});

describe('SwipeableHelpers.direction - getActionsForDirection - edge cases', () => {
	it('returns empty array for null direction', () => {
		const result = getActionsForDirection({
			direction: null,
			leftActions,
			rightActions,
			upActions,
			downActions,
		});
		expect(result).toEqual([]);
	});

	it('returns empty array for empty action arrays', () => {
		const result = getActionsForDirection({
			direction: 'left',
			leftActions: [],
			rightActions: [],
			upActions: [],
			downActions: [],
		});
		expect(result).toEqual([]);
	});

	it('returns empty array for default case with invalid direction', () => {
		// Test the default case using type assertion to bypass TypeScript's type checking
		const result = getActionsForDirection({
			direction: 'invalid' as any,
			leftActions,
			rightActions,
			upActions,
			downActions,
		});
		expect(result).toEqual([]);
	});
});

describe('SwipeableHelpers.direction - getActionsForDirection - multiple actions', () => {
	it('handles multiple actions in arrays', () => {
		const multipleLeftActions: readonly SwipeableAction[] = [
			{ id: 'left1', content: 'Left 1' },
			{ id: 'left2', content: 'Left 2' },
		];
		const result = getActionsForDirection({
			direction: 'left',
			leftActions: multipleLeftActions,
			rightActions,
			upActions,
			downActions,
		});
		expect(result).toEqual(multipleLeftActions);
		expect(result.length).toBe(2);
	});
});

describe('SwipeableHelpers.direction - getDirectionFlags - composite directions', () => {
	it('returns correct flags for "all" direction', () => {
		const flags = getDirectionFlags('all');
		expect(flags.isHorizontal).toBe(true);
		expect(flags.isVertical).toBe(true);
		expect(flags.isLeft).toBe(true);
		expect(flags.isRight).toBe(true);
		expect(flags.isUp).toBe(true);
		expect(flags.isDown).toBe(true);
	});

	it('returns correct flags for "horizontal" direction', () => {
		const flags = getDirectionFlags('horizontal');
		expect(flags.isHorizontal).toBe(true);
		expect(flags.isVertical).toBe(false);
		expect(flags.isLeft).toBe(true);
		expect(flags.isRight).toBe(true);
		expect(flags.isUp).toBe(false);
		expect(flags.isDown).toBe(false);
	});

	it('returns correct flags for "vertical" direction', () => {
		const flags = getDirectionFlags('vertical');
		expect(flags.isHorizontal).toBe(false);
		expect(flags.isVertical).toBe(true);
		expect(flags.isLeft).toBe(false);
		expect(flags.isRight).toBe(false);
		expect(flags.isUp).toBe(true);
		expect(flags.isDown).toBe(true);
	});
});

describe('SwipeableHelpers.direction - getDirectionFlags - individual directions', () => {
	it('returns correct flags for "left" direction', () => {
		const flags = getDirectionFlags('left');
		expect(flags.isHorizontal).toBe(true);
		expect(flags.isVertical).toBe(false);
		expect(flags.isLeft).toBe(true);
		expect(flags.isRight).toBe(false);
		expect(flags.isUp).toBe(false);
		expect(flags.isDown).toBe(false);
	});

	it('returns correct flags for "right" direction', () => {
		const flags = getDirectionFlags('right');
		expect(flags.isHorizontal).toBe(true);
		expect(flags.isVertical).toBe(false);
		expect(flags.isLeft).toBe(false);
		expect(flags.isRight).toBe(true);
		expect(flags.isUp).toBe(false);
		expect(flags.isDown).toBe(false);
	});

	it('returns correct flags for "up" direction', () => {
		const flags = getDirectionFlags('up');
		expect(flags.isHorizontal).toBe(false);
		expect(flags.isVertical).toBe(true);
		expect(flags.isLeft).toBe(false);
		expect(flags.isRight).toBe(false);
		expect(flags.isUp).toBe(true);
		expect(flags.isDown).toBe(false);
	});

	it('returns correct flags for "down" direction', () => {
		const flags = getDirectionFlags('down');
		expect(flags.isHorizontal).toBe(false);
		expect(flags.isVertical).toBe(true);
		expect(flags.isLeft).toBe(false);
		expect(flags.isRight).toBe(false);
		expect(flags.isUp).toBe(false);
		expect(flags.isDown).toBe(true);
	});
});
