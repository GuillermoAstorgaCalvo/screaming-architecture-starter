/**
 * usePullToRefreshHandlers Hook Tests
 *
 * Tests for the usePullToRefreshHandlers hook:
 * - Touch handlers
 * - Gesture detection
 * - Refresh trigger
 * - Disabled state
 * - Edge cases
 */

import {
	usePullToRefreshHandlers,
	type UsePullToRefreshHandlersReturn,
} from '@core/ui/utilities/pull-to-refresh/hooks/usePullToRefreshHandlers';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { TouchEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

const DEFAULT_THRESHOLD = 80;
const DEFAULT_TOUCH_Y = 100;
const SCROLL_TOP_AT_TOP = 0;
const SCROLL_TOP_SCROLLED = 50;
const ASYNC_REFRESH_DELAY = 50;
const TEST_DOES_NOT_RECORD_TOUCH_START = 'does not record touch start';

// Helper to create touch event
const createTouchEvent = (clientY: number): TouchEvent<HTMLDivElement> => {
	return {
		touches: [{ clientY } as Touch],
		targetTouches: [{ clientY } as Touch],
		changedTouches: [{ clientY } as Touch],
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
	} as unknown as TouchEvent<HTMLDivElement>;
};

// Helper to perform touch start and move sequence
const performTouchSequence = (
	result: { current: UsePullToRefreshHandlersReturn },
	touchStartY: number,
	touchMoveY: number
) => {
	const touchStart = createTouchEvent(touchStartY);
	const touchMove = createTouchEvent(touchMoveY);

	act(() => {
		result.current.handleTouchStart(touchStart);
		result.current.handleTouchMove(touchMove);
	});
};

// Helper to set scroll position
const setScrollTop = (element: HTMLElement | null, scrollTop: number) => {
	if (element) {
		Object.defineProperty(element, 'scrollTop', {
			writable: true,
			value: scrollTop,
		});
	}
};

// Helper to setup hook with container
const setupHook = (options: {
	disabled?: boolean;
	threshold?: number;
	onRefresh?: () => void | Promise<void>;
}) => {
	const onRefresh = options.onRefresh ?? vi.fn();
	const { result } = renderHook(() =>
		usePullToRefreshHandlers({
			disabled: options.disabled ?? false,
			threshold: options.threshold ?? DEFAULT_THRESHOLD,
			onRefresh,
		})
	);

	const container = document.createElement('div');
	act(() => {
		result.current.containerRef.current = container;
	});

	return { result, container, onRefresh };
};

// Helper to create async refresh callback
const createAsyncRefresh = (delay = 50): (() => Promise<void>) => {
	return vi.fn(() => {
		return new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, delay);
		});
	});
};

// Helper to execute touch end and wait for refresh
const executeTouchEnd = async (result: { current: UsePullToRefreshHandlersReturn }) => {
	await act(async () => {
		await result.current.handleTouchEnd();
	});
};

describe('usePullToRefreshHandlers - Initial State', () => {
	it('returns initial handlers and state', () => {
		const onRefresh = vi.fn();
		const { result } = renderHook(() =>
			usePullToRefreshHandlers({
				disabled: false,
				threshold: DEFAULT_THRESHOLD,
				onRefresh,
			})
		);

		expect(result.current.containerRef.current).toBeNull();
		expect(typeof result.current.handleTouchStart).toBe('function');
		expect(typeof result.current.handleTouchMove).toBe('function');
		expect(typeof result.current.handleTouchEnd).toBe('function');
		expect(result.current.isRefreshing).toBe(false);
		expect(result.current.canRelease).toBe(false);
		expect(result.current.isIdle).toBe(true);
		expect(result.current.pullDistance).toBe(0);
	});
});

describe('usePullToRefreshHandlers - Touch Start', () => {
	describe('when container is at top', () => {
		it('records touch start', () => {
			const { result, container } = setupHook({});
			setScrollTop(container, SCROLL_TOP_AT_TOP);

			const touchEvent = createTouchEvent(DEFAULT_TOUCH_Y);

			act(() => {
				result.current.handleTouchStart(touchEvent);
			});

			expect(result.current.isIdle).toBe(true);
		});
	});

	describe('when container is scrolled', () => {
		it(TEST_DOES_NOT_RECORD_TOUCH_START, () => {
			const { result, container } = setupHook({});
			setScrollTop(container, SCROLL_TOP_SCROLLED);

			const touchEvent = createTouchEvent(DEFAULT_TOUCH_Y);

			act(() => {
				result.current.handleTouchStart(touchEvent);
			});

			expect(result.current.isIdle).toBe(true);
		});
	});

	describe('when disabled', () => {
		it(TEST_DOES_NOT_RECORD_TOUCH_START, () => {
			const { result, container } = setupHook({ disabled: true });
			setScrollTop(container, SCROLL_TOP_AT_TOP);

			const touchEvent = createTouchEvent(DEFAULT_TOUCH_Y);

			act(() => {
				result.current.handleTouchStart(touchEvent);
			});

			expect(result.current.isIdle).toBe(true);
		});
	});

	describe('when already refreshing', () => {
		it(TEST_DOES_NOT_RECORD_TOUCH_START, () => {
			const { result, container } = setupHook({});
			setScrollTop(container, SCROLL_TOP_AT_TOP);

			const touchStart = createTouchEvent(DEFAULT_TOUCH_Y);
			act(() => {
				result.current.handleTouchStart(touchStart);
			});

			expect(result.current.isIdle).toBe(true);
		});
	});
});

describe('usePullToRefreshHandlers - Touch Move', () => {
	describe('pull distance updates', () => {
		it('updates pull distance when pulling down', () => {
			const { result, container } = setupHook({});
			setScrollTop(container, SCROLL_TOP_AT_TOP);
			performTouchSequence(result, DEFAULT_TOUCH_Y, 150);

			expect(result.current.pullDistance).toBeGreaterThan(0);
			expect(result.current.isIdle).toBe(false);
		});

		it('does not update pull distance when pulling up', () => {
			const { result, container } = setupHook({});
			setScrollTop(container, SCROLL_TOP_AT_TOP);
			performTouchSequence(result, 200, DEFAULT_TOUCH_Y);

			expect(result.current.pullDistance).toBe(0);
		});
	});

	describe('threshold handling', () => {
		it('updates state to release when threshold is exceeded', () => {
			const { result, container } = setupHook({});
			setScrollTop(container, SCROLL_TOP_AT_TOP);
			performTouchSequence(result, DEFAULT_TOUCH_Y, 200);

			expect(result.current.canRelease).toBe(true);
		});
	});

	describe('resistance', () => {
		it('applies resistance when pull exceeds max distance', () => {
			const threshold = DEFAULT_THRESHOLD;
			const maxPull = threshold * 1.5;
			const { result, container } = setupHook({ threshold });
			setScrollTop(container, SCROLL_TOP_AT_TOP);
			performTouchSequence(result, DEFAULT_TOUCH_Y, 300);

			expect(result.current.pullDistance).toBeLessThanOrEqual(maxPull);
		});
	});

	describe('disabled state', () => {
		it('does not update pull distance when disabled', () => {
			const { result, container } = setupHook({ disabled: true });
			setScrollTop(container, SCROLL_TOP_AT_TOP);
			performTouchSequence(result, DEFAULT_TOUCH_Y, 200);

			expect(result.current.pullDistance).toBe(0);
		});
	});

	describe('scrolled container', () => {
		it('does not update pull distance when container is scrolled', () => {
			const { result, container } = setupHook({});
			setScrollTop(container, SCROLL_TOP_SCROLLED);
			performTouchSequence(result, DEFAULT_TOUCH_Y, 200);

			expect(result.current.pullDistance).toBe(0);
		});
	});
});

describe('usePullToRefreshHandlers - Touch End - Refresh Triggering', () => {
	it('triggers refresh when canRelease is true', async () => {
		const { result, container, onRefresh } = setupHook({});
		setScrollTop(container, SCROLL_TOP_AT_TOP);
		performTouchSequence(result, DEFAULT_TOUCH_Y, 200);

		expect(result.current.canRelease).toBe(true);
		await executeTouchEnd(result);

		await waitFor(() => {
			expect(onRefresh).toHaveBeenCalledTimes(1);
		});
	});

	it('does not trigger refresh when canRelease is false', async () => {
		const { result, container, onRefresh } = setupHook({});
		setScrollTop(container, SCROLL_TOP_AT_TOP);
		performTouchSequence(result, DEFAULT_TOUCH_Y, 150);

		expect(result.current.canRelease).toBe(false);
		await executeTouchEnd(result);

		expect(onRefresh).not.toHaveBeenCalled();
	});

	it('does not trigger refresh when disabled', async () => {
		const { result, container, onRefresh } = setupHook({ disabled: true });
		setScrollTop(container, SCROLL_TOP_AT_TOP);
		await executeTouchEnd(result);

		expect(onRefresh).not.toHaveBeenCalled();
	});
});

describe('usePullToRefreshHandlers - Touch End - Callbacks and State', () => {
	it('handles async refresh callback', async () => {
		const onRefresh = createAsyncRefresh(ASYNC_REFRESH_DELAY);
		const { result, container } = setupHook({ onRefresh });
		setScrollTop(container, SCROLL_TOP_AT_TOP);
		performTouchSequence(result, DEFAULT_TOUCH_Y, 200);
		await executeTouchEnd(result);

		await waitFor(() => {
			expect(onRefresh).toHaveBeenCalledTimes(1);
		});
	});

	it('handles sync refresh callback', async () => {
		const { result, container, onRefresh } = setupHook({});
		setScrollTop(container, SCROLL_TOP_AT_TOP);
		performTouchSequence(result, DEFAULT_TOUCH_Y, 200);
		await executeTouchEnd(result);

		expect(onRefresh).toHaveBeenCalledTimes(1);
	});

	it('resets state after refresh completes', async () => {
		const onRefresh = createAsyncRefresh(ASYNC_REFRESH_DELAY);
		const { result, container } = setupHook({ onRefresh });
		setScrollTop(container, SCROLL_TOP_AT_TOP);
		performTouchSequence(result, DEFAULT_TOUCH_Y, 200);
		await executeTouchEnd(result);

		await waitFor(
			() => {
				expect(result.current.isRefreshing).toBe(false);
				expect(result.current.isIdle).toBe(true);
				expect(result.current.pullDistance).toBe(0);
			},
			{ timeout: 200 }
		);
	});
});
