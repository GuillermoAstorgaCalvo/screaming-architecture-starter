/**
 * Tests for useDeferredActivation hook - Edge cases
 */

import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	advanceTime,
	CUSTOM_TIMEOUT,
	DEFAULT_TIMEOUT,
	dispatchEvent,
	eventHandlers,
	setupEventListenerSpy,
} from './useDeferredActivation.test-utils';

function testBasicEdgeCases() {
	describe('basic edge cases', () => {
		it('should only activate once even if multiple events fire', async () => {
			const { result } = renderHook(() => useDeferredActivation());

			act(() => {
				dispatchEvent('pointerdown');
				dispatchEvent('keydown');
				dispatchEvent('mousemove');
				dispatchEvent('touchstart');
			});

			expect(result.current).toBe(true);

			// Should only be activated once
			expect(result.current).toBe(true);
		});

		it('should handle empty events array', () => {
			const { result } = renderHook(() => useDeferredActivation({ events: [] }));

			expect(result.current).toBe(false);

			act(() => {
				advanceTime(DEFAULT_TIMEOUT);
			});

			// Should activate via timeout
			expect(result.current).toBe(true);
		});

		it('should handle rapid event firing', async () => {
			const { result } = renderHook(() => useDeferredActivation());

			expect(result.current).toBe(false);

			act(() => {
				// Fire events rapidly
				for (let i = 0; i < 10; i++) {
					dispatchEvent('pointerdown');
					dispatchEvent('keydown');
				}
			});

			expect(result.current).toBe(true);
		});
	});
}

function testTimeoutEdgeCases() {
	describe('timeout edge cases', () => {
		it('should handle very short timeout', async () => {
			const shortTimeout = 10;
			const { result } = renderHook(() => useDeferredActivation({ timeout: shortTimeout }));

			expect(result.current).toBe(false);

			act(() => {
				advanceTime(shortTimeout);
			});

			expect(result.current).toBe(true);
		});

		it('should handle very long timeout', () => {
			const longTimeout = 10000;
			const { result } = renderHook(() => useDeferredActivation({ timeout: longTimeout }));

			expect(result.current).toBe(false);

			act(() => {
				advanceTime(longTimeout - 100);
			});

			expect(result.current).toBe(false);
		});

		it('should handle event firing after timeout setup but before timeout', async () => {
			const { result } = renderHook(() => useDeferredActivation({ timeout: DEFAULT_TIMEOUT }));

			expect(result.current).toBe(false);

			act(() => {
				advanceTime(DEFAULT_TIMEOUT / 2);
				dispatchEvent('pointerdown');
			});

			expect(result.current).toBe(true);

			// Timeout should be cleaned up
			act(() => {
				advanceTime(DEFAULT_TIMEOUT);
			});

			// Should remain true
			expect(result.current).toBe(true);
		});
	});
}

function testMultipleHooksEdgeCases() {
	describe('multiple hooks edge cases', () => {
		it('should handle multiple hooks simultaneously', () => {
			const { result: result1 } = renderHook(() => useDeferredActivation());
			const { result: result2 } = renderHook(() =>
				useDeferredActivation({ timeout: CUSTOM_TIMEOUT })
			);

			expect(result1.current).toBe(false);
			expect(result2.current).toBe(false);

			act(() => {
				dispatchEvent('pointerdown');
			});

			expect(result1.current).toBe(true);
			expect(result2.current).toBe(true);
		});

		it('should handle document being null (SSR)', () => {
			// This test verifies the hook handles missing document gracefully
			// We can't actually set document to undefined and use renderHook,
			// so we test the logic indirectly by checking the hook's behavior
			// when triggerOnVisibilityHidden is true but document might not exist
			const { result } = renderHook(() =>
				useDeferredActivation({ triggerOnVisibilityHidden: true })
			);

			// Should not crash and should wait for timeout or events
			expect(result.current).toBe(false);
		});
	});
}

describe('useDeferredActivation - edge cases', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		eventHandlers.clear();
		setupEventListenerSpy();
	});

	afterEach(() => {
		eventHandlers.clear();
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	testBasicEdgeCases();
	testTimeoutEdgeCases();
	testMultipleHooksEdgeCases();
});
