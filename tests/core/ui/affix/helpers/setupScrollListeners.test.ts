/**
 * Tests for setupScrollListeners helper function
 */

import { setupScrollListeners } from '@core/ui/affix/helpers/useAffix.helpers';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('useAffix.helpers - setupScrollListeners - container listeners', () => {
	let mockAddEventListener: ReturnType<typeof vi.fn>;
	let mockRemoveEventListener: ReturnType<typeof vi.fn>;
	let handler: () => void;

	beforeEach(() => {
		handler = vi.fn();
		mockAddEventListener = vi.fn();
		mockRemoveEventListener = vi.fn();
	});

	it('sets up scroll listener on container when container is provided', () => {
		const container = document.createElement('div');
		container.addEventListener = mockAddEventListener as typeof container.addEventListener;
		container.removeEventListener = mockRemoveEventListener as typeof container.removeEventListener;

		const cleanup = setupScrollListeners(container, handler);

		expect(mockAddEventListener).toHaveBeenCalledTimes(1);
		expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
			passive: true,
		});
		expect(cleanup).toBeInstanceOf(Function);
	});

	it('returns cleanup function that removes scroll listener from container', () => {
		const container = document.createElement('div');
		container.addEventListener = mockAddEventListener as typeof container.addEventListener;
		container.removeEventListener = mockRemoveEventListener as typeof container.removeEventListener;

		const cleanup = setupScrollListeners(container, handler);
		cleanup();

		expect(mockRemoveEventListener).toHaveBeenCalledTimes(1);
		expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
	});
});

describe('useAffix.helpers - setupScrollListeners - window listeners', () => {
	let mockAddEventListener: ReturnType<typeof vi.fn>;
	let handler: () => void;

	beforeEach(() => {
		handler = vi.fn();
		mockAddEventListener = vi.fn();
	});

	it('sets up scroll and resize listeners on window when container is null', () => {
		const originalAddEventListener = globalThis.window.addEventListener;
		globalThis.window.addEventListener =
			mockAddEventListener as typeof globalThis.window.addEventListener;

		setupScrollListeners(null, handler);

		expect(mockAddEventListener).toHaveBeenCalledTimes(2);
		expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
			passive: true,
		});
		expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function), {
			passive: true,
		});

		globalThis.window.addEventListener = originalAddEventListener;
	});

	it('sets up scroll and resize listeners on window when container is undefined', () => {
		const originalAddEventListener = globalThis.window.addEventListener;
		globalThis.window.addEventListener =
			mockAddEventListener as typeof globalThis.window.addEventListener;

		setupScrollListeners(undefined, handler);

		expect(mockAddEventListener).toHaveBeenCalledTimes(2);
		expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), {
			passive: true,
		});
		expect(mockAddEventListener).toHaveBeenCalledWith('resize', expect.any(Function), {
			passive: true,
		});

		globalThis.window.addEventListener = originalAddEventListener;
	});

	it('returns cleanup function that removes scroll and resize listeners from window', () => {
		const mockRemoveEventListener = vi.fn();
		const originalAddEventListener = globalThis.window.addEventListener;
		const originalRemoveEventListener = globalThis.window.removeEventListener;
		globalThis.window.addEventListener =
			mockAddEventListener as typeof globalThis.window.addEventListener;
		globalThis.window.removeEventListener =
			mockRemoveEventListener as typeof globalThis.window.removeEventListener;

		const cleanup = setupScrollListeners(null, handler);
		cleanup();

		expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
		expect(mockRemoveEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
		expect(mockRemoveEventListener).toHaveBeenCalledWith('resize', expect.any(Function));

		globalThis.window.addEventListener = originalAddEventListener;
		globalThis.window.removeEventListener = originalRemoveEventListener;
	});
});

describe('useAffix.helpers - setupScrollListeners - throttled handlers', () => {
	let handler: () => void;

	beforeEach(() => {
		handler = vi.fn();
	});

	it('uses throttled handler for container scroll events', () => {
		const container = document.createElement('div');
		let capturedHandler: (() => void) | null = null;
		container.addEventListener = vi.fn((event, scrollHandler) => {
			if (event === 'scroll') {
				capturedHandler = scrollHandler as () => void;
			}
		}) as typeof container.addEventListener;

		setupScrollListeners(container, handler);

		expect(capturedHandler).not.toBe(handler); // Should be throttled version
		expect(capturedHandler).toBeInstanceOf(Function);
	});

	it('uses throttled handler for window scroll events', () => {
		let capturedScrollHandler: (() => void) | null = null;
		const originalAddEventListener = globalThis.window.addEventListener;
		globalThis.window.addEventListener = vi.fn((event, scrollHandler) => {
			if (event === 'scroll') {
				capturedScrollHandler = scrollHandler as () => void;
			}
		}) as typeof globalThis.window.addEventListener;

		setupScrollListeners(null, handler);

		expect(capturedScrollHandler).not.toBe(handler); // Should be throttled version
		expect(capturedScrollHandler).toBeInstanceOf(Function);

		globalThis.window.addEventListener = originalAddEventListener;
	});
});

describe('useAffix.helpers - setupScrollListeners - multiple instances', () => {
	let mockAddEventListener: ReturnType<typeof vi.fn>;
	let mockRemoveEventListener: ReturnType<typeof vi.fn>;
	let handler: () => void;

	beforeEach(() => {
		handler = vi.fn();
		mockAddEventListener = vi.fn();
		mockRemoveEventListener = vi.fn();
	});

	it('can be called multiple times with different containers', () => {
		const container1 = document.createElement('div');
		const container2 = document.createElement('div');
		container1.addEventListener = vi.fn() as typeof container1.addEventListener;
		container2.addEventListener = vi.fn() as typeof container2.addEventListener;

		const cleanup1 = setupScrollListeners(container1, handler);
		const cleanup2 = setupScrollListeners(container2, handler);

		expect(container1.addEventListener).toHaveBeenCalledTimes(1);
		expect(container2.addEventListener).toHaveBeenCalledTimes(1);
		expect(cleanup1).toBeInstanceOf(Function);
		expect(cleanup2).toBeInstanceOf(Function);

		cleanup1();
		cleanup2();
	});

	it('cleanup function can be called multiple times safely', () => {
		const container = document.createElement('div');
		container.addEventListener = mockAddEventListener as typeof container.addEventListener;
		container.removeEventListener = mockRemoveEventListener as typeof container.removeEventListener;

		const cleanup = setupScrollListeners(container, handler);
		cleanup();
		cleanup(); // Call again

		expect(mockRemoveEventListener).toHaveBeenCalledTimes(2);
	});
});
