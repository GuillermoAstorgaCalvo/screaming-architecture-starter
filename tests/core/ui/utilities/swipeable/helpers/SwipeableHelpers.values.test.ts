/**
 * SwipeableHelpers.values Tests
 *
 * Tests for value calculation functions:
 * - shouldShowActions
 * - calculateSwipeValues
 * - calculateSwipeStyles
 */

import { getDirectionFlags } from '@core/ui/utilities/swipeable/helpers/SwipeableHelpers.direction';
import {
	RESET_SWIPE_STATE,
	type SwipeState,
} from '@core/ui/utilities/swipeable/helpers/SwipeableHelpers.types';
import {
	calculateSwipeStyles,
	calculateSwipeValues,
	shouldShowActions,
} from '@core/ui/utilities/swipeable/helpers/SwipeableHelpers.values';
import type { SwipeableAction } from '@src-types/ui/overlays/interactions';
import { describe, expect, it } from 'vitest';

describe('SwipeableHelpers.values - shouldShowActions', () => {
	describe('when hasActions is false', () => {
		it('returns false', () => {
			const flags = getDirectionFlags('horizontal');
			expect(
				shouldShowActions({
					hasActions: false,
					flags,
					deltaX: 100,
					deltaY: 0,
					threshold: 50,
				})
			).toBe(false);
		});
	});

	describe('when threshold is exceeded - horizontal', () => {
		it('returns true for left swipe', () => {
			const flags = getDirectionFlags('horizontal');
			expect(
				shouldShowActions({
					hasActions: true,
					flags,
					deltaX: -100,
					deltaY: 0,
					threshold: 50,
				})
			).toBe(true);
		});

		it('returns true for right swipe', () => {
			const flags = getDirectionFlags('horizontal');
			expect(
				shouldShowActions({
					hasActions: true,
					flags,
					deltaX: 100,
					deltaY: 0,
					threshold: 50,
				})
			).toBe(true);
		});
	});
});

describe('SwipeableHelpers.values - shouldShowActions (vertical)', () => {
	describe('when threshold is exceeded - vertical', () => {
		it('returns true for up swipe', () => {
			const flags = getDirectionFlags('vertical');
			expect(
				shouldShowActions({
					hasActions: true,
					flags,
					deltaX: 0,
					deltaY: -100,
					threshold: 50,
				})
			).toBe(true);
		});

		it('returns true for down swipe', () => {
			const flags = getDirectionFlags('vertical');
			expect(
				shouldShowActions({
					hasActions: true,
					flags,
					deltaX: 0,
					deltaY: 100,
					threshold: 50,
				})
			).toBe(true);
		});
	});
});

describe('SwipeableHelpers.values - shouldShowActions (threshold)', () => {
	describe('when threshold is not exceeded', () => {
		it('returns false', () => {
			const flags = getDirectionFlags('horizontal');
			expect(
				shouldShowActions({
					hasActions: true,
					flags,
					deltaX: 30,
					deltaY: 0,
					threshold: 50,
				})
			).toBe(false);
		});
	});

	describe('when direction restrictions apply', () => {
		it('returns false when direction does not allow the swipe direction', () => {
			const flags = getDirectionFlags('left');
			// Right swipe when only left is allowed
			expect(
				shouldShowActions({
					hasActions: true,
					flags,
					deltaX: 100,
					deltaY: 0,
					threshold: 50,
				})
			).toBe(false);
		});

		it('returns true when direction is "all" and threshold is exceeded', () => {
			const flags = getDirectionFlags('all');
			expect(
				shouldShowActions({
					hasActions: true,
					flags,
					deltaX: 100,
					deltaY: 0,
					threshold: 50,
				})
			).toBe(true);
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeValues', () => {
	const leftActions: readonly SwipeableAction[] = [{ id: 'left1', content: 'Left 1' }];
	const rightActions: readonly SwipeableAction[] = [{ id: 'right1', content: 'Right 1' }];

	describe('horizontal swipes', () => {
		it('calculates correct values for left swipe', () => {
			const swipeState: SwipeState = {
				startX: 100,
				startY: 50,
				currentX: 0,
				currentY: 50,
				isSwiping: true,
			};

			const result = calculateSwipeValues({
				swipeState,
				direction: 'horizontal',
				leftActions,
				rightActions: [],
				upActions: [],
				downActions: [],
				threshold: 50,
			});

			expect(result.deltaX).toBe(-100);
			expect(result.deltaY).toBe(0);
			expect(result.swipeDirection).toBe('left');
			expect(result.actions).toEqual(leftActions);
			expect(result.showActions).toBe(true);
		});

		it('calculates correct values for right swipe', () => {
			const swipeState: SwipeState = {
				startX: 0,
				startY: 50,
				currentX: 100,
				currentY: 50,
				isSwiping: true,
			};

			const result = calculateSwipeValues({
				swipeState,
				direction: 'horizontal',
				leftActions: [],
				rightActions,
				upActions: [],
				downActions: [],
				threshold: 50,
			});

			expect(result.deltaX).toBe(100);
			expect(result.deltaY).toBe(0);
			expect(result.swipeDirection).toBe('right');
			expect(result.actions).toEqual(rightActions);
			expect(result.showActions).toBe(true);
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeValues (vertical)', () => {
	const upActions: readonly SwipeableAction[] = [{ id: 'up1', content: 'Up 1' }];
	const downActions: readonly SwipeableAction[] = [{ id: 'down1', content: 'Down 1' }];

	describe('vertical swipes', () => {
		it('calculates correct values for up swipe', () => {
			const swipeState: SwipeState = {
				startX: 50,
				startY: 100,
				currentX: 50,
				currentY: 0,
				isSwiping: true,
			};

			const result = calculateSwipeValues({
				swipeState,
				direction: 'vertical',
				leftActions: [],
				rightActions: [],
				upActions,
				downActions: [],
				threshold: 50,
			});

			expect(result.deltaX).toBe(0);
			expect(result.deltaY).toBe(-100);
			expect(result.swipeDirection).toBe('up');
			expect(result.actions).toEqual(upActions);
			expect(result.showActions).toBe(true);
		});

		it('calculates correct values for down swipe', () => {
			const swipeState: SwipeState = {
				startX: 50,
				startY: 0,
				currentX: 50,
				currentY: 100,
				isSwiping: true,
			};

			const result = calculateSwipeValues({
				swipeState,
				direction: 'vertical',
				leftActions: [],
				rightActions: [],
				upActions: [],
				downActions,
				threshold: 50,
			});

			expect(result.deltaX).toBe(0);
			expect(result.deltaY).toBe(100);
			expect(result.swipeDirection).toBe('down');
			expect(result.actions).toEqual(downActions);
			expect(result.showActions).toBe(true);
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeValues (below threshold)', () => {
	const rightActions: readonly SwipeableAction[] = [{ id: 'right1', content: 'Right 1' }];

	describe('when swipe is below threshold', () => {
		it('returns empty actions and false showActions', () => {
			const swipeState: SwipeState = {
				startX: 0,
				startY: 50,
				currentX: 30,
				currentY: 50,
				isSwiping: true,
			};

			const result = calculateSwipeValues({
				swipeState,
				direction: 'horizontal',
				leftActions: [],
				rightActions,
				upActions: [],
				downActions: [],
				threshold: 50,
			});

			expect(result.deltaX).toBe(30);
			expect(result.swipeDirection).toBe('right');
			expect(result.actions).toEqual(rightActions);
			expect(result.showActions).toBe(false); // Below threshold
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeValues (equal deltas)', () => {
	describe('when deltas are equal', () => {
		it('returns null swipeDirection', () => {
			const swipeState: SwipeState = {
				startX: 0,
				startY: 0,
				currentX: 50,
				currentY: 50,
				isSwiping: true,
			};

			const result = calculateSwipeValues({
				swipeState,
				direction: 'all',
				leftActions: [],
				rightActions: [],
				upActions: [],
				downActions: [],
				threshold: 50,
			});

			expect(result.swipeDirection).toBe(null);
			expect(result.actions).toEqual([]);
			expect(result.showActions).toBe(false);
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeValues (reset state)', () => {
	describe('when swipe state is reset', () => {
		it('handles reset swipe state', () => {
			const result = calculateSwipeValues({
				swipeState: RESET_SWIPE_STATE,
				direction: 'horizontal',
				leftActions: [],
				rightActions: [],
				upActions: [],
				downActions: [],
				threshold: 50,
			});

			expect(result.deltaX).toBe(0);
			expect(result.deltaY).toBe(0);
			expect(result.swipeDirection).toBe(null);
			expect(result.actions).toEqual([]);
			expect(result.showActions).toBe(false);
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeStyles', () => {
	describe('horizontal swipes', () => {
		it('calculates styles for left swipe', () => {
			const result = calculateSwipeStyles({
				deltaX: -100,
				deltaY: 0,
				swipeDirection: 'left',
				threshold: 50,
			});

			expect(result.contentStyle).toEqual({
				transform: 'translate(-100px, 0px)',
			});
			expect(result.actionsContainerStyle).toEqual({
				left: 0,
				width: '100px',
			});
		});

		it('calculates styles for right swipe', () => {
			const result = calculateSwipeStyles({
				deltaX: 100,
				deltaY: 0,
				swipeDirection: 'right',
				threshold: 50,
			});

			expect(result.contentStyle).toEqual({
				transform: 'translate(100px, 0px)',
			});
			expect(result.actionsContainerStyle).toEqual({
				right: 0,
				width: '100px',
			});
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeStyles (vertical)', () => {
	describe('vertical swipes', () => {
		it('calculates styles for up swipe', () => {
			const result = calculateSwipeStyles({
				deltaX: 0,
				deltaY: -100,
				swipeDirection: 'up',
				threshold: 50,
			});

			expect(result.contentStyle).toEqual({
				transform: 'translate(0px, -100px)',
			});
			expect(result.actionsContainerStyle).toEqual({
				top: 0,
				height: '100px',
				width: '100%',
			});
		});

		it('calculates styles for down swipe', () => {
			const result = calculateSwipeStyles({
				deltaX: 0,
				deltaY: 100,
				swipeDirection: 'down',
				threshold: 50,
			});

			expect(result.contentStyle).toEqual({
				transform: 'translate(0px, 100px)',
			});
			expect(result.actionsContainerStyle).toEqual({
				bottom: 0,
				height: '100px',
				width: '100%',
			});
		});
	});
});

describe('SwipeableHelpers.values - calculateSwipeStyles (edge cases)', () => {
	describe('when swipeDirection is null', () => {
		it('calculates styles for null swipeDirection', () => {
			const result = calculateSwipeStyles({
				deltaX: 0,
				deltaY: 0,
				swipeDirection: null,
				threshold: 50,
			});

			expect(result.contentStyle).toEqual({
				transform: 'translate(0px, 0px)',
			});
			expect(result.actionsContainerStyle).toEqual({});
		});
	});

	describe('when action container size exceeds limit', () => {
		it('caps action container size at threshold * 2', () => {
			const result = calculateSwipeStyles({
				deltaX: -200,
				deltaY: 0,
				swipeDirection: 'left',
				threshold: 50,
			});

			expect(result.actionsContainerStyle).toEqual({
				left: 0,
				width: '100px', // threshold * 2
			});
		});
	});
});
