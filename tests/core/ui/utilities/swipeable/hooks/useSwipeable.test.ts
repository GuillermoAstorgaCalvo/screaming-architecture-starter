/**
 * useSwipeable Hook Tests
 *
 * Tests for the useSwipeable hook:
 * - Gesture handling (touch start, move, end)
 * - State management
 * - Handlers (touch handlers, action click handler)
 * - Disabled state
 * - onSwipe callback
 */

import {
	useSwipeable,
	type UseSwipeableParams,
} from '@core/ui/utilities/swipeable/hooks/useSwipeable';
import type { SwipeableAction, SwipeableDirection } from '@src-types/ui/overlays/interactions';
import { act, fireEvent, renderHook } from '@testing-library/react';
import type { TouchEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_SWIPEABLE_PARAMS = {
	direction: 'horizontal' as const,
	threshold: 50,
	leftActions: [] as const,
	rightActions: [] as const,
	upActions: [] as const,
	downActions: [] as const,
	disabled: false,
	onSwipe: undefined,
};

const INITIAL_CONTENT_STYLE = {
	transform: 'translate(0px, 0px)',
};

// Helper functions
const createTouchEvent = (clientX: number, clientY: number): TouchEvent<HTMLDivElement> => {
	return {
		touches: [{ clientX, clientY }],
	} as unknown as TouchEvent<HTMLDivElement>;
};

const createSwipeableHook = (overrides: Partial<UseSwipeableParams> = {}) => {
	return renderHook(() =>
		useSwipeable({
			...DEFAULT_SWIPEABLE_PARAMS,
			...overrides,
		})
	);
};

const createSwipeableWithActions = (
	actions: {
		leftActions?: readonly SwipeableAction[];
		rightActions?: readonly SwipeableAction[];
		upActions?: readonly SwipeableAction[];
		downActions?: readonly SwipeableAction[];
	},
	overrides: Partial<UseSwipeableParams> = {}
) => {
	return renderHook(() =>
		useSwipeable({
			...DEFAULT_SWIPEABLE_PARAMS,
			...actions,
			...overrides,
		})
	);
};

type SwipeableHookResult = ReturnType<typeof useSwipeable>;

const performSwipe = (
	result: { current: SwipeableHookResult },
	startX: number,
	startY: number,
	endX: number,
	endY: number
) => {
	const touchStartEvent = createTouchEvent(startX, startY);
	const touchMoveEvent = createTouchEvent(endX, endY);

	act(() => {
		result.current.handleTouchStart(touchStartEvent);
	});
	act(() => {
		result.current.handleTouchMove(touchMoveEvent);
	});
};

describe('useSwipeable - Initialization', () => {
	it('returns initial state with reset values', () => {
		const { result } = createSwipeableHook();

		expect(result.current.contentStyle).toEqual(INITIAL_CONTENT_STYLE);
		expect(result.current.actionsContainerStyle).toEqual({});
		expect(result.current.actions).toEqual([]);
		expect(result.current.showActions).toBe(false);
		expect(typeof result.current.handleTouchStart).toBe('function');
		expect(typeof result.current.handleTouchMove).toBe('function');
		expect(typeof result.current.handleTouchEnd).toBe('function');
		expect(typeof result.current.handleActionClick).toBe('function');
	});
});

describe('useSwipeable - Touch Gesture Handling', () => {
	it('handles touch start event', () => {
		const { result } = createSwipeableHook();

		const touchStartEvent = createTouchEvent(100, 50);

		fireEvent.touchStart(document.createElement('div'), touchStartEvent);
		result.current.handleTouchStart(touchStartEvent);

		expect(result.current.contentStyle.transform).toContain('translate');
	});

	it('handles touch move event', () => {
		const { result } = createSwipeableHook();

		const touchStartEvent = createTouchEvent(100, 50);
		const touchMoveEvent = createTouchEvent(150, 50);

		result.current.handleTouchStart(touchStartEvent);
		result.current.handleTouchMove(touchMoveEvent);

		expect(result.current.contentStyle.transform).toContain('translate');
	});

	it('handles touch end event', () => {
		const { result } = createSwipeableHook();

		const touchStartEvent = createTouchEvent(100, 50);

		result.current.handleTouchStart(touchStartEvent);
		result.current.handleTouchEnd();

		expect(result.current.contentStyle).toEqual(INITIAL_CONTENT_STYLE);
		expect(result.current.showActions).toBe(false);
	});

	it('does not handle touch events when disabled', () => {
		const { result } = createSwipeableHook({ disabled: true });

		const touchStartEvent = createTouchEvent(100, 50);
		const initialContentStyle = result.current.contentStyle;

		result.current.handleTouchStart(touchStartEvent);

		expect(result.current.contentStyle).toEqual(initialContentStyle);
	});

	it('does not handle touch move when not swiping', () => {
		const { result } = createSwipeableHook();

		const touchMoveEvent = createTouchEvent(150, 50);
		const initialContentStyle = result.current.contentStyle;

		result.current.handleTouchMove(touchMoveEvent);

		expect(result.current.contentStyle).toEqual(initialContentStyle);
	});
});

describe('useSwipeable - Action Handling', () => {
	it('shows actions when swipe exceeds threshold', () => {
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions });

		performSwipe(result, 0, 50, 100, 50);

		expect(result.current.showActions).toBe(true);
		expect(result.current.actions).toEqual(rightActions);
	});

	it('handles action click', async () => {
		const onAction = vi.fn();
		const rightActions: readonly SwipeableAction[] = [{ id: 'edit', content: 'Edit', onAction }];

		const { result } = createSwipeableWithActions({ rightActions });

		const [firstAction] = rightActions;
		if (firstAction) {
			await result.current.handleActionClick(firstAction);
		}

		expect(onAction).toHaveBeenCalledTimes(1);
		expect(result.current.showActions).toBe(false);
	});

	it('handles async action', async () => {
		const onAction = vi.fn().mockResolvedValue(undefined);
		const rightActions: readonly SwipeableAction[] = [{ id: 'edit', content: 'Edit', onAction }];

		const { result } = createSwipeableWithActions({ rightActions });

		const [firstAction] = rightActions;
		if (firstAction) {
			await result.current.handleActionClick(firstAction);
		}

		expect(onAction).toHaveBeenCalledTimes(1);
	});

	it('resets state after action click', async () => {
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions });

		const [firstAction] = rightActions;
		if (firstAction) {
			await result.current.handleActionClick(firstAction);
		}

		expect(result.current.contentStyle).toEqual(INITIAL_CONTENT_STYLE);
		expect(result.current.showActions).toBe(false);
	});
});

describe('useSwipeable - onSwipe Callback', () => {
	it('calls onSwipe when swipe exceeds threshold', () => {
		const onSwipe = vi.fn<(direction: SwipeableDirection) => void>();
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions(
			{ rightActions },
			{ onSwipe: onSwipe as unknown as UseSwipeableParams['onSwipe'] }
		);

		performSwipe(result, 0, 50, 100, 50);
		act(() => {
			result.current.handleTouchEnd();
		});

		expect(onSwipe).toHaveBeenCalledWith('right');
	});

	it('does not call onSwipe when swipe does not exceed threshold', () => {
		const onSwipe = vi.fn<(direction: SwipeableDirection) => void>();
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions(
			{ rightActions },
			{ onSwipe: onSwipe as unknown as UseSwipeableParams['onSwipe'] }
		);

		const touchStartEvent = createTouchEvent(0, 50);
		const touchMoveEvent = createTouchEvent(30, 50);

		result.current.handleTouchStart(touchStartEvent);
		result.current.handleTouchMove(touchMoveEvent);
		result.current.handleTouchEnd();

		expect(onSwipe).not.toHaveBeenCalled();
	});

	it('does not call onSwipe when disabled', () => {
		const onSwipe = vi.fn<(direction: SwipeableDirection) => void>();

		const { result } = createSwipeableHook({
			disabled: true,
			onSwipe: onSwipe as unknown as UseSwipeableParams['onSwipe'],
		});

		result.current.handleTouchEnd();

		expect(onSwipe).not.toHaveBeenCalled();
	});
});

describe('useSwipeable - Direction Support', () => {
	it('handles left swipe', () => {
		const leftActions: readonly SwipeableAction[] = [
			{ id: 'delete', content: 'Delete', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ leftActions });

		performSwipe(result, 100, 50, 0, 50);

		expect(result.current.actions).toEqual(leftActions);
	});

	it('handles vertical swipe', () => {
		const upActions: readonly SwipeableAction[] = [{ id: 'up', content: 'Up', onAction: vi.fn() }];

		const { result } = createSwipeableWithActions(
			{ upActions },
			{ direction: 'vertical' as SwipeableDirection }
		);

		performSwipe(result, 50, 100, 50, 0);

		expect(result.current.actions).toEqual(upActions);
	});
});

describe('useSwipeable - Edge Cases: Empty Touches', () => {
	it('does not handle touch start when touches array is empty', () => {
		const { result } = createSwipeableHook();

		const emptyTouchEvent = {
			touches: [],
		} as unknown as TouchEvent<HTMLDivElement>;

		const initialContentStyle = result.current.contentStyle;

		result.current.handleTouchStart(emptyTouchEvent);

		expect(result.current.contentStyle).toEqual(initialContentStyle);
	});

	it('does not handle touch move when touches array is empty', () => {
		const { result } = createSwipeableHook();

		const touchStartEvent = createTouchEvent(100, 50);
		const emptyTouchEvent = {
			touches: [],
		} as unknown as TouchEvent<HTMLDivElement>;

		act(() => {
			result.current.handleTouchStart(touchStartEvent);
		});

		const contentStyleAfterStart = result.current.contentStyle;

		act(() => {
			result.current.handleTouchMove(emptyTouchEvent);
		});

		// Should not change from the state after touch start
		expect(result.current.contentStyle).toEqual(contentStyleAfterStart);
	});
});

describe('useSwipeable - Edge Cases: Threshold Calculations - Horizontal', () => {
	it('does not show actions when swipe exactly meets threshold (strict inequality)', () => {
		const threshold = 50;
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions }, { threshold });

		// Swipe exactly 50 pixels (threshold) - should NOT trigger (strict >)
		performSwipe(result, 0, 50, threshold, 50);

		expect(result.current.showActions).toBe(false);
	});

	it('does not show actions when swipe is just below threshold', () => {
		const threshold = 50;
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions }, { threshold });

		// Swipe 49 pixels (just below threshold)
		performSwipe(result, 0, 50, threshold - 1, 50);

		expect(result.current.showActions).toBe(false);
	});

	it('shows actions when swipe is just above threshold', () => {
		const threshold = 50;
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions }, { threshold });

		// Swipe 51 pixels (just above threshold)
		performSwipe(result, 0, 50, threshold + 1, 50);

		expect(result.current.showActions).toBe(true);
	});

	it('handles left swipe threshold correctly', () => {
		const threshold = 50;
		const leftActions: readonly SwipeableAction[] = [
			{ id: 'delete', content: 'Delete', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ leftActions }, { threshold });

		// Swipe left exceeding threshold (deltaX < -threshold)
		performSwipe(result, 100, 50, 100 - threshold - 1, 50);

		expect(result.current.showActions).toBe(true);
		expect(result.current.actions).toEqual(leftActions);
	});
});

describe('useSwipeable - Edge Cases: Threshold Calculations - Vertical', () => {
	it('handles vertical swipe threshold correctly', () => {
		const threshold = 50;
		const downActions: readonly SwipeableAction[] = [
			{ id: 'down', content: 'Down', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions(
			{ downActions },
			{ direction: 'vertical' as SwipeableDirection, threshold }
		);

		// Swipe down exceeding threshold (deltaY > threshold)
		performSwipe(result, 50, 0, 50, threshold + 1);

		expect(result.current.showActions).toBe(true);
		expect(result.current.actions).toEqual(downActions);
	});

	it('handles up swipe threshold correctly', () => {
		const threshold = 50;
		const upActions: readonly SwipeableAction[] = [{ id: 'up', content: 'Up', onAction: vi.fn() }];

		const { result } = createSwipeableWithActions(
			{ upActions },
			{ direction: 'vertical' as SwipeableDirection, threshold }
		);

		// Swipe up exceeding threshold (deltaY < -threshold)
		performSwipe(result, 50, 100, 50, 100 - threshold - 1);

		expect(result.current.showActions).toBe(true);
		expect(result.current.actions).toEqual(upActions);
	});
});

describe('useSwipeable - Edge Cases: Threshold Calculations - Edge Values', () => {
	it('handles zero threshold', () => {
		const threshold = 0;
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions }, { threshold });

		// Any movement should trigger actions with zero threshold
		performSwipe(result, 0, 50, 1, 50);

		expect(result.current.showActions).toBe(true);
	});

	it('handles very large threshold', () => {
		const threshold = 1000;
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions }, { threshold });

		// Small swipe should not trigger
		performSwipe(result, 0, 50, 100, 50);

		expect(result.current.showActions).toBe(false);

		// Large swipe should trigger
		performSwipe(result, 0, 50, 1100, 50);

		expect(result.current.showActions).toBe(true);
	});
});

describe('useSwipeable - Edge Cases: Gesture Detection - onSwipe Callback', () => {
	it('does not call onSwipe when showActions is false', () => {
		const onSwipe = vi.fn<(direction: SwipeableDirection) => void>();
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions(
			{ rightActions },
			{ onSwipe: onSwipe as unknown as UseSwipeableParams['onSwipe'], threshold: 100 }
		);

		// Swipe below threshold
		performSwipe(result, 0, 50, 30, 50);

		act(() => {
			result.current.handleTouchEnd();
		});

		expect(result.current.showActions).toBe(false);
		expect(onSwipe).not.toHaveBeenCalled();
	});

	it('does not call onSwipe when swipeDirection is null', () => {
		const onSwipe = vi.fn<(direction: SwipeableDirection) => void>();
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions(
			{ rightActions },
			{ onSwipe: onSwipe as unknown as UseSwipeableParams['onSwipe'] }
		);

		// Swipe with equal deltaX and deltaY (should result in null direction)
		performSwipe(result, 0, 0, 100, 100);

		act(() => {
			result.current.handleTouchEnd();
		});

		expect(onSwipe).not.toHaveBeenCalled();
	});

	it('does not call onSwipe when onSwipe callback is undefined', () => {
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions });

		performSwipe(result, 0, 50, 100, 50);

		act(() => {
			result.current.handleTouchEnd();
		});

		// Should not throw and should reset state
		expect(result.current.contentStyle).toEqual(INITIAL_CONTENT_STYLE);
		expect(result.current.showActions).toBe(false);
	});
});

describe('useSwipeable - Edge Cases: Gesture Detection - Touch End', () => {
	it('handles touch end when not swiping', () => {
		const onSwipe = vi.fn<(direction: SwipeableDirection) => void>();
		const { result } = createSwipeableHook({
			onSwipe: onSwipe as unknown as UseSwipeableParams['onSwipe'],
		});

		act(() => {
			result.current.handleTouchEnd();
		});

		expect(onSwipe).not.toHaveBeenCalled();
		expect(result.current.contentStyle).toEqual(INITIAL_CONTENT_STYLE);
	});
});

describe('useSwipeable - Edge Cases: Gesture Detection - Action Click', () => {
	it('handles action click without onAction callback', async () => {
		const actionWithoutCallback: SwipeableAction = {
			id: 'no-callback',
			content: 'No Callback',
		};

		const { result } = createSwipeableHook();

		// Should not throw
		await expect(result.current.handleActionClick(actionWithoutCallback)).resolves.toBeUndefined();
		expect(result.current.contentStyle).toEqual(INITIAL_CONTENT_STYLE);
		expect(result.current.showActions).toBe(false);
	});
});

describe('useSwipeable - Edge Cases: Gesture Detection - Ambiguous Direction', () => {
	it('handles equal deltaX and deltaY (ambiguous direction)', () => {
		const rightActions: readonly SwipeableAction[] = [
			{ id: 'edit', content: 'Edit', onAction: vi.fn() },
		];

		const { result } = createSwipeableWithActions({ rightActions });

		// Equal movement in both directions
		performSwipe(result, 0, 0, 50, 50);

		// Should not show actions when direction is ambiguous
		expect(result.current.showActions).toBe(false);
		expect(result.current.actions).toEqual([]);
	});
});
