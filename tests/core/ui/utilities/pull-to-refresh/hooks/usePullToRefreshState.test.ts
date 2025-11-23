/**
 * usePullToRefreshState Hook Tests
 *
 * Tests for the usePullToRefreshState hook:
 * - Initial state
 * - State management
 * - Computed properties (isRefreshing, canRelease, isIdle)
 */

import { usePullToRefreshState } from '@core/ui/utilities/pull-to-refresh/hooks/usePullToRefreshState';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('usePullToRefreshState - Initial State', () => {
	it('returns initial state', () => {
		const { result } = renderHook(() => usePullToRefreshState(80));

		expect(result.current.state).toBe('idle');
		expect(result.current.pullDistance).toBe(0);
		expect(result.current.touchStartY.current).toBeNull();
		expect(result.current.containerRef.current).toBeNull();
		expect(result.current.isRefreshing).toBe(false);
		expect(result.current.canRelease).toBe(false);
		expect(result.current.isIdle).toBe(true);
	});

	it('initializes with provided threshold', () => {
		const { result } = renderHook(() => usePullToRefreshState(100));

		expect(result.current.state).toBe('idle');
		expect(result.current.canRelease).toBe(false);
	});
});

describe('usePullToRefreshState - State Management', () => {
	it('updates state correctly', () => {
		const { result } = renderHook(() => usePullToRefreshState(80));

		act(() => {
			result.current.setState('pulling');
		});

		expect(result.current.state).toBe('pulling');
		expect(result.current.isIdle).toBe(false);
	});

	it('updates pull distance correctly', () => {
		const { result } = renderHook(() => usePullToRefreshState(80));

		act(() => {
			result.current.setPullDistance(50);
		});

		expect(result.current.pullDistance).toBe(50);
		expect(result.current.canRelease).toBe(false); // 50 < 80
	});

	it('updates touchStartY correctly', () => {
		const { result } = renderHook(() => usePullToRefreshState(80));

		act(() => {
			result.current.touchStartY.current = 100;
		});

		expect(result.current.touchStartY.current).toBe(100);
	});
});

describe('usePullToRefreshState - Computed Properties', () => {
	it('computes isRefreshing correctly', () => {
		const { result } = renderHook(() => usePullToRefreshState(80));

		expect(result.current.isRefreshing).toBe(false);

		act(() => {
			result.current.setState('refreshing');
		});

		expect(result.current.isRefreshing).toBe(true);
		expect(result.current.isIdle).toBe(false);
	});

	it('computes canRelease correctly', () => {
		const { result } = renderHook(() => usePullToRefreshState(80));

		expect(result.current.canRelease).toBe(false);

		act(() => {
			result.current.setPullDistance(80);
		});

		expect(result.current.canRelease).toBe(true);

		act(() => {
			result.current.setPullDistance(100);
		});

		expect(result.current.canRelease).toBe(true);
	});

	it('computes isIdle correctly', () => {
		const { result } = renderHook(() => usePullToRefreshState(80));

		expect(result.current.isIdle).toBe(true);

		act(() => {
			result.current.setState('pulling');
		});

		expect(result.current.isIdle).toBe(false);

		act(() => {
			result.current.setState('idle');
		});

		expect(result.current.isIdle).toBe(true);
	});

	it('computes canRelease with different thresholds', () => {
		const { result: result50 } = renderHook(() => usePullToRefreshState(50));
		const { result: result100 } = renderHook(() => usePullToRefreshState(100));

		act(() => {
			result50.current.setPullDistance(60);
			result100.current.setPullDistance(60);
		});

		expect(result50.current.canRelease).toBe(true); // 60 >= 50
		expect(result100.current.canRelease).toBe(false); // 60 < 100
	});
});
