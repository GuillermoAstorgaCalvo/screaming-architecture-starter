/**
 * Tests for useDeferredActivation hook - Event activation
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

// Helper function to test event activation
const testEventActivation = (
	eventName: string,
	options?: Parameters<typeof useDeferredActivation>[0]
) => {
	const { result } = renderHook(() => useDeferredActivation(options));

	expect(result.current).toBe(false);

	act(() => {
		dispatchEvent(eventName);
	});

	expect(result.current).toBe(true);
};

// Helper function to test that activation doesn't occur
const testNoActivation = (
	eventsToDispatch: string[],
	options?: Parameters<typeof useDeferredActivation>[0]
) => {
	const { result } = renderHook(() => useDeferredActivation(options));

	expect(result.current).toBe(false);

	act(() => {
		for (const eventName of eventsToDispatch) {
			dispatchEvent(eventName);
		}
	});

	expect(result.current).toBe(false);
};

// Helper function to test multiple events activation
const testMultipleEventsActivation = (eventsToDispatch: string[]) => {
	const { result } = renderHook(() => useDeferredActivation());

	expect(result.current).toBe(false);

	act(() => {
		for (const eventName of eventsToDispatch) {
			dispatchEvent(eventName);
		}
	});

	expect(result.current).toBe(true);
};

// Helper function to test activation before timeout
const testActivationBeforeTimeout = () => {
	const { result } = renderHook(() => useDeferredActivation({ timeout: DEFAULT_TIMEOUT }));

	expect(result.current).toBe(false);

	act(() => {
		dispatchEvent('pointerdown');
	});

	expect(result.current).toBe(true);

	act(() => {
		advanceTime(DEFAULT_TIMEOUT);
	});

	expect(result.current).toBe(true);
};

describe('useDeferredActivation - event activation', () => {
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

	describe('default events', () => {
		it('should activate on pointerdown event', () => {
			testEventActivation('pointerdown');
		});

		it('should activate on keydown event', () => {
			testEventActivation('keydown');
		});

		it('should activate on mousemove event', () => {
			testEventActivation('mousemove');
		});

		it('should activate on touchstart event', () => {
			testEventActivation('touchstart');
		});

		it('should activate on any of the default events', () => {
			const events = [...DEFAULT_EVENTS];
			for (const eventName of events) {
				const { result, unmount } = renderHook(() => useDeferredActivation());

				expect(result.current).toBe(false);

				act(() => {
					dispatchEvent(eventName);
				});

				expect(result.current).toBe(true);

				unmount();
			}
		});
	});

	describe('custom events', () => {
		it('should activate on custom events', () => {
			const customEvents = ['click', 'focus', 'scroll'] as const;
			testEventActivation('click', { events: customEvents });
		});

		it('should not activate on events not in the list', () => {
			testNoActivation(['keydown', 'pointerdown'], { events: ['click'] });
		});
	});

	describe('event activation behavior', () => {
		it('should activate on first event even if multiple are registered', () => {
			testMultipleEventsActivation(['pointerdown', 'keydown', 'mousemove']);
		});

		it('should activate immediately when event fires before timeout', () => {
			testActivationBeforeTimeout();
		});
	});
});
