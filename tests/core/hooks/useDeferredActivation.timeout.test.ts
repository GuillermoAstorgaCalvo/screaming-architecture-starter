/**
 * Tests for useDeferredActivation hook - Timeout activation
 */

import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { advanceTime, CUSTOM_TIMEOUT, DEFAULT_TIMEOUT } from './useDeferredActivation.test-utils';

describe('useDeferredActivation - timeout activation', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should activate after default timeout', () => {
		const { result } = renderHook(() => useDeferredActivation());

		expect(result.current).toBe(false);

		act(() => {
			vi.advanceTimersByTime(DEFAULT_TIMEOUT);
		});

		expect(result.current).toBe(true);
	});

	it('should activate after custom timeout', () => {
		const { result } = renderHook(() => useDeferredActivation({ timeout: CUSTOM_TIMEOUT }));

		expect(result.current).toBe(false);

		act(() => {
			vi.advanceTimersByTime(CUSTOM_TIMEOUT);
		});

		expect(result.current).toBe(true);
	});

	it('should not activate before timeout elapses', () => {
		const { result } = renderHook(() => useDeferredActivation({ timeout: DEFAULT_TIMEOUT }));

		expect(result.current).toBe(false);

		act(() => {
			advanceTime(DEFAULT_TIMEOUT - 100);
		});

		expect(result.current).toBe(false);
	});

	it('should not activate via timeout when timeout is 0', () => {
		const { result } = renderHook(() => useDeferredActivation({ timeout: 0 }));

		expect(result.current).toBe(false);

		act(() => {
			// With timeout 0, no timeout is set up, so advancing time shouldn't activate
			vi.advanceTimersByTime(1000);
		});

		// Should still be false - timeout of 0 means no timeout, only events can activate
		expect(result.current).toBe(false);
	});

	it('should not activate when timeout is negative', () => {
		const { result } = renderHook(() => useDeferredActivation({ timeout: -100 }));

		expect(result.current).toBe(false);

		act(() => {
			advanceTime(1000);
		});

		expect(result.current).toBe(false);
	});
});
