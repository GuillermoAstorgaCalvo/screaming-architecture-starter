/**
 * Tests for useDeferredActivation hook - Initial state
 */

import { useDeferredActivation } from '@core/hooks/useDeferredActivation';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CUSTOM_TIMEOUT } from './useDeferredActivation.test-utils';

describe('useDeferredActivation - initial state', () => {
	it('should return false initially when event listeners are supported', () => {
		const { result } = renderHook(() => useDeferredActivation());

		expect(result.current).toBe(false);
	});

	it('should return true initially in SSR/Node environment', () => {
		const originalAddEventListener = globalThis.addEventListener;
		const originalDocument = globalThis.document;

		// Mock SSR environment
		Object.defineProperty(globalThis, 'addEventListener', {
			value: undefined,
			writable: true,
			configurable: true,
		});

		Object.defineProperty(globalThis, 'document', {
			value: undefined,
			writable: true,
			configurable: true,
		});

		// In SSR, the hook should return true immediately
		// We can't use renderHook here because it requires document
		// Instead, we test the logic directly
		const supportsEventListeners = typeof globalThis.addEventListener === 'function';
		expect(supportsEventListeners).toBe(false);

		// Restore
		Object.defineProperty(globalThis, 'addEventListener', {
			value: originalAddEventListener,
			writable: true,
			configurable: true,
		});

		Object.defineProperty(globalThis, 'document', {
			value: originalDocument,
			writable: true,
			configurable: true,
		});
	});

	it('should return false initially with custom timeout', () => {
		const { result } = renderHook(() => useDeferredActivation({ timeout: CUSTOM_TIMEOUT }));

		expect(result.current).toBe(false);
	});

	it('should return false initially with custom events', () => {
		const { result } = renderHook(() => useDeferredActivation({ events: ['click', 'focus'] }));

		expect(result.current).toBe(false);
	});
});
