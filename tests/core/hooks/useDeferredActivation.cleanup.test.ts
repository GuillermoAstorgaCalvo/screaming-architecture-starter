/**
 * Tests for useDeferredActivation hook - Cleanup
 */

import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
	advanceTime,
	DEFAULT_EVENTS,
	DEFAULT_TIMEOUT,
	dispatchEvent,
	eventHandlers,
	setupEventListenerSpy,
} from './useDeferredActivation.test-utils';

// Helper to verify event listener cleanup
const verifyEventListenersCleanup = (removeEventListenerSpy: ReturnType<typeof vi.spyOn>) => {
	for (const eventName of DEFAULT_EVENTS) {
		expect(removeEventListenerSpy).toHaveBeenCalledWith(eventName, expect.any(Function));
	}
};

// Helper to setup and verify event listener cleanup on unmount
const testEventListenerCleanup = () => {
	const removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener');
	const { unmount } = renderHook(() => useDeferredActivation());

	unmount();
	verifyEventListenersCleanup(removeEventListenerSpy);
	removeEventListenerSpy.mockRestore();
};

// Helper to setup and verify timeout cleanup on unmount
const testTimeoutCleanup = () => {
	const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
	const { unmount } = renderHook(() => useDeferredActivation());

	unmount();
	expect(clearTimeoutSpy).toHaveBeenCalled();
	clearTimeoutSpy.mockRestore();
};

// Helper to test visibility change listener cleanup
const testVisibilityChangeCleanup = () => {
	if (typeof document === 'undefined') {
		return;
	}

	const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
	const { unmount } = renderHook(() => useDeferredActivation({ triggerOnVisibilityHidden: true }));

	unmount();
	expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
	removeEventListenerSpy.mockRestore();
};

// Helper to test cleanup after activation
const testCleanupAfterActivation = () => {
	const removeEventListenerSpy = vi.spyOn(globalThis, 'removeEventListener');
	const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
	const { result } = renderHook(() => useDeferredActivation());

	act(() => {
		dispatchEvent('pointerdown');
	});

	expect(result.current).toBe(true);
	expect(removeEventListenerSpy).toHaveBeenCalled();
	expect(clearTimeoutSpy).toHaveBeenCalled();

	removeEventListenerSpy.mockRestore();
	clearTimeoutSpy.mockRestore();
};

// Helper to test no activation after cleanup
const testNoActivationAfterCleanup = () => {
	const { result, unmount } = renderHook(() => useDeferredActivation());

	unmount();

	act(() => {
		dispatchEvent('pointerdown');
		advanceTime(DEFAULT_TIMEOUT);
	});

	expect(result.current).toBe(false);
};

describe('useDeferredActivation - cleanup', () => {
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

	it('should cleanup event listeners on unmount', () => {
		testEventListenerCleanup();
	});

	it('should cleanup timeout on unmount', () => {
		testTimeoutCleanup();
	});

	it('should cleanup visibility change listener on unmount when triggerOnVisibilityHidden is true', () => {
		testVisibilityChangeCleanup();
	});

	it('should cleanup after activation', async () => {
		testCleanupAfterActivation();
	});

	it('should not activate again after cleanup', async () => {
		testNoActivationAfterCleanup();
	});
});
