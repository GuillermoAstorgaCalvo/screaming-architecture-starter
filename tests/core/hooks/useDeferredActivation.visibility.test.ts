/**
 * Tests for useDeferredActivation hook - Visibility change activation
 */

import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { advanceTime, DEFAULT_TIMEOUT } from './useDeferredActivation.test-utils';

// Helper to set document visibility state
const setVisibilityState = (state: 'visible' | 'hidden') => {
	if (typeof document !== 'undefined') {
		Object.defineProperty(document, 'visibilityState', {
			value: state,
			writable: true,
			configurable: true,
		});
	}
};

// Helper to dispatch visibility change event
const dispatchVisibilityChange = () => {
	if (typeof document !== 'undefined') {
		document.dispatchEvent(new Event('visibilitychange'));
	}
};

// Helper to change visibility and dispatch event
const changeVisibility = (state: 'visible' | 'hidden') => {
	act(() => {
		setVisibilityState(state);
		dispatchVisibilityChange();
	});
};

// Test suite for basic visibility change scenarios
const describeBasicVisibilityChange = () => {
	describe('basic visibility change', () => {
		it('should not activate on visibility change when triggerOnVisibilityHidden is false', () => {
			const { result } = renderHook(() =>
				useDeferredActivation({ triggerOnVisibilityHidden: false })
			);

			expect(result.current).toBe(false);
			changeVisibility('hidden');
			expect(result.current).toBe(false);
		});

		it('should activate when visibility becomes hidden and triggerOnVisibilityHidden is true', async () => {
			const { result } = renderHook(() =>
				useDeferredActivation({ triggerOnVisibilityHidden: true })
			);

			expect(result.current).toBe(false);
			changeVisibility('hidden');
			expect(result.current).toBe(true);
		});

		it('should not activate when visibility becomes visible', () => {
			const { result } = renderHook(() =>
				useDeferredActivation({ triggerOnVisibilityHidden: true })
			);

			expect(result.current).toBe(false);
			changeVisibility('visible');
			expect(result.current).toBe(false);
		});
	});
};

// Test suite for visibility change edge cases
const describeVisibilityChangeEdgeCases = () => {
	describe('visibility change edge cases', () => {
		it('should activate immediately if document is already hidden when triggerOnVisibilityHidden is true', async () => {
			setVisibilityState('hidden');

			const { result } = renderHook(() =>
				useDeferredActivation({ triggerOnVisibilityHidden: true })
			);

			expect(result.current).toBe(true);
			setVisibilityState('visible');
		});

		it('should activate on visibility change even if timeout has not elapsed', async () => {
			const { result } = renderHook(() =>
				useDeferredActivation({
					timeout: DEFAULT_TIMEOUT,
					triggerOnVisibilityHidden: true,
				})
			);

			expect(result.current).toBe(false);
			changeVisibility('hidden');
			expect(result.current).toBe(true);

			act(() => {
				advanceTime(DEFAULT_TIMEOUT);
			});

			expect(result.current).toBe(true);
		});
	});
};

describe('useDeferredActivation - visibility change activation', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		setVisibilityState('visible');
	});

	afterEach(() => {
		vi.useRealTimers();
		setVisibilityState('visible');
	});

	describeBasicVisibilityChange();
	describeVisibilityChangeEdgeCases();
});
