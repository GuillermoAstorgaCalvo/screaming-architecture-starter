/**
 * Shared test utilities for useDeferredActivation tests
 */

import { vi } from 'vitest';

// Test constants
export const DEFAULT_TIMEOUT = 1500;
export const CUSTOM_TIMEOUT = 500;
export const DEFAULT_EVENTS = ['pointerdown', 'keydown', 'mousemove', 'touchstart'] as const;

// Helper to create mock event
export const createMockEvent = (type: string): Event => {
	return new Event(type, { bubbles: true, cancelable: true });
};

// Store captured event handlers
export const eventHandlers = new Map<string, Set<EventListener>>();

// Spy on addEventListener to capture handlers
export const setupEventListenerSpy = () => {
	const originalAddEventListener = globalThis.addEventListener.bind(globalThis);
	const spy = vi.spyOn(globalThis, 'addEventListener');
	spy.mockImplementation((eventName, handler, options) => {
		if (typeof eventName === 'string' && typeof handler === 'function') {
			if (!eventHandlers.has(eventName)) {
				eventHandlers.set(eventName, new Set());
			}
			const handlers = eventHandlers.get(eventName);
			if (handlers) {
				handlers.add(handler);
			}
		}
		// Call original to ensure listeners are actually registered
		originalAddEventListener(eventName, handler, options);
	});
};

// Helper to trigger captured event handlers
const triggerEvent = (eventName: string) => {
	const handlers = eventHandlers.get(eventName);
	if (handlers) {
		const event = createMockEvent(eventName);
		for (const handler of handlers) {
			handler(event);
		}
	}
};

// Helper to dispatch event - trigger captured handlers directly for reliability
export const dispatchEvent = (eventName: string) => {
	// First try to trigger captured handlers (most reliable in test environment)
	triggerEvent(eventName);
	// Also try to dispatch on window/globalThis if available (for completeness)
	if (globalThis.window !== undefined && typeof globalThis.window.dispatchEvent === 'function') {
		const event = createMockEvent(eventName);
		globalThis.window.dispatchEvent(event);
	} else if (typeof globalThis.dispatchEvent === 'function') {
		const event = createMockEvent(eventName);
		globalThis.dispatchEvent(event);
	}
};

// Helper to advance time
export const advanceTime = (ms: number) => {
	vi.advanceTimersByTime(ms);
};
