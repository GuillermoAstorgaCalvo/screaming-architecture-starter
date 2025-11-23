/**
 * Tests for useInfiniteScroll hook
 *
 * Tests the useInfiniteScroll hook:
 * - Initialization and refs
 * - Intersection Observer setup and cleanup
 * - Load more triggering
 * - Edge cases and error handling
 */

import { useInfiniteScroll } from '@core/ui/utilities/infinite-scroll/hooks/useInfiniteScroll';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type ObserverSpy = ReturnType<typeof vi.fn>;

interface MockObserver {
	observe: ObserverSpy;
	disconnect: ObserverSpy;
	unobserve: ObserverSpy;
	callback?: IntersectionObserverCallback;
}

interface MockObserverSetup {
	mockObserver: MockObserver;
	mockIntersectionObserver: typeof IntersectionObserver;
	observeSpy: ObserverSpy;
	disconnectSpy: ObserverSpy;
}

const createMockObserver = (): MockObserverSetup => {
	const observeSpy = vi.fn();
	const disconnectSpy = vi.fn();

	const mockObserver: MockObserver = {
		observe: observeSpy,
		disconnect: disconnectSpy,
		unobserve: vi.fn(),
	};

	function intersectionObserverMockImpl(
		this: IntersectionObserver,
		callback: IntersectionObserverCallback
	) {
		mockObserver.callback = callback;
		return mockObserver as unknown as IntersectionObserver;
	}

	const mockIntersectionObserver = vi.fn(
		intersectionObserverMockImpl
	) as unknown as typeof IntersectionObserver;

	return {
		mockObserver,
		mockIntersectionObserver,
		observeSpy,
		disconnectSpy,
	};
};

const createIntersectionEntry = (
	element: HTMLElement,
	isIntersecting: boolean = true
): IntersectionObserverEntry =>
	({
		isIntersecting,
		intersectionRatio: isIntersecting ? 1 : 0,
		target: element,
		boundingClientRect: {} as DOMRectReadOnly,
		intersectionRect: {} as DOMRectReadOnly,
		rootBounds: null,
		time: Date.now(),
	}) as IntersectionObserverEntry;

const triggerIntersection = (
	mockObserver: MockObserver,
	element: HTMLElement,
	isIntersecting: boolean = true
) => {
	if (mockObserver.callback) {
		mockObserver.callback(
			[createIntersectionEntry(element, isIntersecting)],
			mockObserver as unknown as IntersectionObserver
		);
	}
};

// Helper to set sentinel ref and trigger effect by toggling enabled prop
const setupSentinelAndTriggerEffect = (
	result: { current: { sentinelRef: { current: HTMLDivElement | null } } },
	rerender: (props: { enabled: boolean }) => void,
	sentinel: HTMLElement
) => {
	act(() => {
		result.current.sentinelRef.current = sentinel as HTMLDivElement;
	});
	// Trigger re-render by toggling enabled to cause useEffect to run again
	rerender({ enabled: false });
	rerender({ enabled: true });
};

describe('useInfiniteScroll - Initialization', () => {
	it('returns sentinelRef', () => {
		const { result } = renderHook(() =>
			useInfiniteScroll({
				isLoading: false,
				hasMore: true,
				onLoadMore: vi.fn(),
			})
		);

		expect(result.current.sentinelRef).toBeDefined();
		expect(result.current.sentinelRef.current).toBeNull();
	});

	it('initializes with default options', () => {
		const onLoadMore = vi.fn();
		const { result } = renderHook(() =>
			useInfiniteScroll({
				isLoading: false,
				hasMore: true,
				onLoadMore,
			})
		);

		expect(result.current.sentinelRef).toBeDefined();
		expect(onLoadMore).not.toHaveBeenCalled();
	});
});

describe('useInfiniteScroll - Intersection Observer Setup', () => {
	let setup: MockObserverSetup;
	let originalIntersectionObserver: typeof IntersectionObserver;

	beforeEach(() => {
		setup = createMockObserver();
		originalIntersectionObserver = globalThis.IntersectionObserver;
		globalThis.IntersectionObserver = setup.mockIntersectionObserver;
	});

	afterEach(() => {
		globalThis.IntersectionObserver = originalIntersectionObserver;
		vi.restoreAllMocks();
	});

	it('creates Intersection Observer when enabled and hasMore', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.mockIntersectionObserver).toHaveBeenCalled();
		});
	});

	it('observes sentinel element when available', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalledWith(sentinel);
		});
	});

	it('does not create observer when disabled', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled, isLoading }: { enabled: boolean; isLoading?: boolean }) =>
				useInfiniteScroll({
					isLoading: isLoading ?? false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: false, isLoading: false } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by changing a different prop to cause useEffect to run again
		// Use isLoading to trigger without enabling the observer
		rerender({ enabled: false, isLoading: true });
		rerender({ enabled: false, isLoading: false });

		// Wait for effect to run
		await waitFor(() => {
			expect(setup.mockIntersectionObserver).not.toHaveBeenCalled();
		});

		expect(setup.observeSpy).not.toHaveBeenCalled();
		// No observer was created, so disconnect should not be called
		expect(setup.disconnectSpy).not.toHaveBeenCalled();
	});

	it('does not create observer when hasMore is false', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ hasMore, isLoading }) =>
				useInfiniteScroll({
					isLoading,
					hasMore,
					onLoadMore,
					enabled: true,
				}),
			{ initialProps: { hasMore: false, isLoading: false } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by changing isLoading to cause useEffect to run again
		// This won't create observer because hasMore is still false
		rerender({ hasMore: false, isLoading: true });
		rerender({ hasMore: false, isLoading: false });

		// Wait for effect to run
		await waitFor(() => {
			expect(setup.mockIntersectionObserver).not.toHaveBeenCalled();
		});

		expect(setup.observeSpy).not.toHaveBeenCalled();
		// No observer was created, so disconnect should not be called
		expect(setup.disconnectSpy).not.toHaveBeenCalled();
	});

	it('uses custom rootMargin', async () => {
		const onLoadMore = vi.fn();
		const customRootMargin = '200px';
		const { result, rerender } = renderHook(
			({ rootMargin }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					rootMargin,
				}),
			{ initialProps: { rootMargin: customRootMargin } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by changing rootMargin to cause useEffect to run again
		rerender({ rootMargin: '100px' });
		rerender({ rootMargin: customRootMargin });

		await waitFor(() => {
			expect(setup.mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ rootMargin: customRootMargin })
			);
		});
	});

	it('cleans up observer on unmount', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender, unmount } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		unmount();

		await waitFor(() => {
			expect(setup.disconnectSpy).toHaveBeenCalled();
		});
	});

	it('cleans up previous observer when re-setting up', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		const disconnectCallCount = setup.disconnectSpy.mock.calls.length;

		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.disconnectSpy.mock.calls.length).toBeGreaterThan(disconnectCallCount);
		});
	});
});

describe('useInfiniteScroll - Load More Triggering', () => {
	let setup: MockObserverSetup;
	let originalIntersectionObserver: typeof IntersectionObserver;

	beforeEach(() => {
		setup = createMockObserver();
		originalIntersectionObserver = globalThis.IntersectionObserver;
		globalThis.IntersectionObserver = setup.mockIntersectionObserver;
	});

	afterEach(() => {
		globalThis.IntersectionObserver = originalIntersectionObserver;
		vi.restoreAllMocks();
	});

	it('triggers onLoadMore when sentinel intersects', async () => {
		const onLoadMore = vi.fn().mockResolvedValue(undefined);
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore).toHaveBeenCalledTimes(1);
		});
	});

	it('does not trigger onLoadMore when not intersecting', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, false);
		});

		await waitFor(() => {
			expect(onLoadMore).not.toHaveBeenCalled();
		});
	});

	it('does not trigger onLoadMore when isLoading is true', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ isLoading }) =>
				useInfiniteScroll({
					isLoading,
					hasMore: true,
					onLoadMore,
				}),
			{ initialProps: { isLoading: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling isLoading to cause useEffect to run again
		rerender({ isLoading: false });
		rerender({ isLoading: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore).not.toHaveBeenCalled();
		});
	});

	it('does not trigger onLoadMore when hasMore is false', async () => {
		const onLoadMore = vi.fn();
		const { result } = renderHook(() =>
			useInfiniteScroll({
				isLoading: false,
				hasMore: false,
				onLoadMore,
			})
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Observer should not be set up when hasMore is false
		await waitFor(() => {
			expect(setup.observeSpy).not.toHaveBeenCalled();
		});
	});

	it('prevents multiple simultaneous loads', async () => {
		const onLoadMore = vi.fn(() => new Promise<void>(resolve => setTimeout(resolve, 10)));
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		// Trigger first intersection
		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		// Immediately trigger second intersection (should be ignored)
		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore).toHaveBeenCalledTimes(1);
		});

		// Wait for the first load to complete
		await act(async () => {
			await new Promise(resolve => setTimeout(resolve, 20));
		});

		// Now trigger again - should be allowed
		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore).toHaveBeenCalledTimes(2);
		});
	});

	it('handles async onLoadMore', async () => {
		const onLoadMore = vi.fn().mockResolvedValue(undefined);
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore).toHaveBeenCalledTimes(1);
		});
	});

	it('handles onLoadMore that returns void', async () => {
		const onLoadMore = vi.fn(() => {
			// Returns void
		});
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore).toHaveBeenCalledTimes(1);
		});
	});

	it('handles onLoadMore errors gracefully', async () => {
		const onLoadMore = vi.fn().mockRejectedValue(new Error('Load failed'));
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore).toHaveBeenCalledTimes(1);
		});

		// Error should be caught and not throw
		await act(async () => {
			await new Promise(resolve => setTimeout(resolve, 0));
		});
	});
});

describe('useInfiniteScroll - State Changes', () => {
	let setup: MockObserverSetup;
	let originalIntersectionObserver: typeof IntersectionObserver;

	beforeEach(() => {
		setup = createMockObserver();
		originalIntersectionObserver = globalThis.IntersectionObserver;
		globalThis.IntersectionObserver = setup.mockIntersectionObserver;
	});

	afterEach(() => {
		globalThis.IntersectionObserver = originalIntersectionObserver;
		vi.restoreAllMocks();
	});

	it('updates observer when isLoading changes', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ isLoading }) =>
				useInfiniteScroll({
					isLoading,
					hasMore: true,
					onLoadMore,
				}),
			{ initialProps: { isLoading: false } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling isLoading to cause useEffect to run again
		rerender({ isLoading: true });
		rerender({ isLoading: false });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		rerender({ isLoading: true });

		await waitFor(() => {
			expect(setup.mockIntersectionObserver).toHaveBeenCalled();
		});
	});

	it('updates observer when hasMore changes', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ hasMore }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore,
					onLoadMore,
				}),
			{ initialProps: { hasMore: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling hasMore to cause useEffect to run again
		rerender({ hasMore: false });
		rerender({ hasMore: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		rerender({ hasMore: false });

		await waitFor(() => {
			expect(setup.disconnectSpy).toHaveBeenCalled();
		});
	});

	it('updates observer when enabled changes', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		rerender({ enabled: false });

		await waitFor(() => {
			expect(setup.disconnectSpy).toHaveBeenCalled();
		});
	});

	it('updates observer when rootMargin changes', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ rootMargin }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					rootMargin,
				}),
			{ initialProps: { rootMargin: '100px' } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by changing rootMargin to cause useEffect to run again
		rerender({ rootMargin: '200px' });
		rerender({ rootMargin: '100px' });

		await waitFor(() => {
			expect(setup.mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ rootMargin: '100px' })
			);
		});

		rerender({ rootMargin: '200px' });

		await waitFor(() => {
			expect(setup.mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ rootMargin: '200px' })
			);
		});
	});

	it('updates observer when onLoadMore changes', async () => {
		const onLoadMore1 = vi.fn();
		const onLoadMore2 = vi.fn();
		const { result, rerender } = renderHook(
			({ onLoadMore }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
				}),
			{ initialProps: { onLoadMore: onLoadMore1 } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by changing onLoadMore to cause useEffect to run again
		rerender({ onLoadMore: onLoadMore2 });
		rerender({ onLoadMore: onLoadMore1 });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		rerender({ onLoadMore: onLoadMore2 });

		act(() => {
			triggerIntersection(setup.mockObserver, sentinel, true);
		});

		await waitFor(() => {
			expect(onLoadMore2).toHaveBeenCalled();
		});
	});
});

describe('useInfiniteScroll - Edge Cases', () => {
	let setup: MockObserverSetup;
	let originalIntersectionObserver: typeof IntersectionObserver;

	beforeEach(() => {
		setup = createMockObserver();
		originalIntersectionObserver = globalThis.IntersectionObserver;
		globalThis.IntersectionObserver = setup.mockIntersectionObserver;
	});

	afterEach(() => {
		globalThis.IntersectionObserver = originalIntersectionObserver;
		vi.restoreAllMocks();
	});

	it('handles sentinel element not available', async () => {
		const onLoadMore = vi.fn();
		renderHook(() =>
			useInfiniteScroll({
				isLoading: false,
				hasMore: true,
				onLoadMore,
			})
		);

		// Sentinel ref is null, observer should not be set up
		await waitFor(() => {
			expect(setup.observeSpy).not.toHaveBeenCalled();
		});
	});

	it('handles empty entries array in intersection callback', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		// Trigger with empty entries
		act(() => {
			if (setup.mockObserver.callback) {
				setup.mockObserver.callback([], setup.mockObserver as unknown as IntersectionObserver);
			}
		});

		// Should not throw and not call onLoadMore
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('handles entry without isIntersecting property', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.observeSpy).toHaveBeenCalled();
		});

		// Trigger with entry that has undefined isIntersecting
		act(() => {
			if (setup.mockObserver.callback) {
				const entry = createIntersectionEntry(sentinel, true);
				// @ts-expect-error - Testing edge case
				entry.isIntersecting = undefined;
				setup.mockObserver.callback([entry], setup.mockObserver as unknown as IntersectionObserver);
			}
		});

		// Should not call onLoadMore when isIntersecting is falsy
		expect(onLoadMore).not.toHaveBeenCalled();
	});

	it('uses default rootMargin when not provided', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(setup.mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ rootMargin: 'var(--spacing-4xl)' })
			);
		});
	});

	it('ignores threshold parameter (not used in implementation)', async () => {
		const onLoadMore = vi.fn();
		const { result, rerender } = renderHook(
			({ enabled }) =>
				useInfiniteScroll({
					isLoading: false,
					hasMore: true,
					onLoadMore,
					enabled,
					threshold: 500, // Should be ignored
				}),
			{ initialProps: { enabled: true } }
		);

		const sentinel = document.createElement('div');
		act(() => {
			result.current.sentinelRef.current = sentinel;
		});

		// Trigger re-render by toggling enabled to cause useEffect to run again
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			// Threshold should be 0 in the observer config, not 500
			expect(setup.mockIntersectionObserver).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ threshold: 0 })
			);
		});
	});
});
