/**
 * Tests for useDeferredActivation hook - Option changes and combinations
 */

import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	advanceTime,
	CUSTOM_TIMEOUT,
	DEFAULT_TIMEOUT,
	dispatchEvent,
} from './useDeferredActivation.test-utils';

// Helper functions for test setup
function setupFakeTimers() {
	vi.useFakeTimers();
}

function teardownFakeTimers() {
	vi.useRealTimers();
	resetDocumentVisibility();
}

function resetDocumentVisibility() {
	if (typeof document !== 'undefined') {
		Object.defineProperty(document, 'visibilityState', {
			value: 'visible',
			writable: true,
			configurable: true,
		});
	}
}

function setDocumentVisibilityHidden() {
	if (typeof document !== 'undefined') {
		Object.defineProperty(document, 'visibilityState', {
			value: 'hidden',
			writable: true,
			configurable: true,
		});
		document.dispatchEvent(new Event('visibilitychange'));
	}
}

describe('useDeferredActivation - option changes', () => {
	beforeEach(() => {
		setupFakeTimers();
	});

	afterEach(() => {
		teardownFakeTimers();
	});

	describe('basic option changes', () => {
		it('should re-setup when timeout changes', async () => {
			const { result, rerender } = renderHook(({ timeout }) => useDeferredActivation({ timeout }), {
				initialProps: { timeout: DEFAULT_TIMEOUT },
			});

			expect(result.current).toBe(false);

			// Change timeout
			rerender({ timeout: CUSTOM_TIMEOUT });

			act(() => {
				advanceTime(CUSTOM_TIMEOUT);
			});

			expect(result.current).toBe(true);
		});

		it('should re-setup when events change', async () => {
			const { result, rerender } = renderHook(({ events }) => useDeferredActivation({ events }), {
				initialProps: { events: ['click'] },
			});

			expect(result.current).toBe(false);

			// Change events
			rerender({ events: ['focus'] });

			act(() => {
				dispatchEvent('focus');
			});

			expect(result.current).toBe(true);
		});
	});

	describe('advanced option changes', () => {
		it('should re-setup when triggerOnVisibilityHidden changes', async () => {
			const { result, rerender } = renderHook(
				({ triggerOnVisibilityHidden }) => useDeferredActivation({ triggerOnVisibilityHidden }),
				{
					initialProps: { triggerOnVisibilityHidden: false },
				}
			);

			expect(result.current).toBe(false);

			// Enable visibility change trigger
			rerender({ triggerOnVisibilityHidden: true });

			act(() => {
				setDocumentVisibilityHidden();
			});

			expect(result.current).toBe(true);

			// Reset for other tests
			resetDocumentVisibility();
		});

		it('should not re-setup when already activated', async () => {
			const { result, rerender } = renderHook(({ timeout }) => useDeferredActivation({ timeout }), {
				initialProps: { timeout: DEFAULT_TIMEOUT },
			});

			act(() => {
				dispatchEvent('pointerdown');
			});

			expect(result.current).toBe(true);

			// Change options after activation
			rerender({ timeout: CUSTOM_TIMEOUT });

			// Should remain activated
			expect(result.current).toBe(true);
		});
	});
});

describe('useDeferredActivation - option combinations', () => {
	beforeEach(() => {
		setupFakeTimers();
		resetDocumentVisibility();
	});

	afterEach(() => {
		teardownFakeTimers();
	});

	describe('basic option combinations', () => {
		it('should work with timeout and custom events', async () => {
			const { result } = renderHook(() =>
				useDeferredActivation({
					timeout: CUSTOM_TIMEOUT,
					events: ['click', 'focus'],
				})
			);

			expect(result.current).toBe(false);

			act(() => {
				dispatchEvent('click');
			});

			expect(result.current).toBe(true);
		});

		it('should work with custom events and visibility change', async () => {
			const { result } = renderHook(() =>
				useDeferredActivation({
					events: ['scroll', 'wheel'],
					triggerOnVisibilityHidden: true,
				})
			);

			expect(result.current).toBe(false);

			act(() => {
				dispatchEvent('scroll');
			});

			expect(result.current).toBe(true);
		});
	});
});

describe('useDeferredActivation - advanced option combinations', () => {
	beforeEach(() => {
		setupFakeTimers();
		resetDocumentVisibility();
	});

	afterEach(() => {
		teardownFakeTimers();
	});

	it('should work with timeout and visibility change', async () => {
		if (typeof document === 'undefined') {
			return; // Skip if document is not available
		}

		const { result } = renderHook(() =>
			useDeferredActivation({
				timeout: DEFAULT_TIMEOUT,
				triggerOnVisibilityHidden: true,
			})
		);

		expect(result.current).toBe(false);

		act(() => {
			setDocumentVisibilityHidden();
		});

		expect(result.current).toBe(true);

		// Reset for other tests
		resetDocumentVisibility();
	});

	it('should work with all options combined', async () => {
		const { result } = renderHook(() =>
			useDeferredActivation({
				timeout: CUSTOM_TIMEOUT,
				events: ['click'],
				triggerOnVisibilityHidden: true,
			})
		);

		expect(result.current).toBe(false);

		act(() => {
			dispatchEvent('click');
		});

		expect(result.current).toBe(true);
	});
});
