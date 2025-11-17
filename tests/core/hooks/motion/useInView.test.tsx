import { useInView } from '@core/hooks/motion/useInView';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type ObserverSpy = ReturnType<typeof vi.fn>;

interface MockObserver {
	observe: ObserverSpy;
	disconnect: ObserverSpy;
	unobserve: ObserverSpy;
	callback?: IntersectionObserverCallback;
}

interface UseInViewTestContext {
	getMockObserver: () => MockObserver;
	getMockIntersectionObserver: () => typeof IntersectionObserver;
	getObserverCallback: () => IntersectionObserverCallback | undefined;
	getObserveSpy: () => ObserverSpy;
	getDisconnectSpy: () => ObserverSpy;
}

const triggerIntersectionCallback = (
	ctx: UseInViewTestContext,
	entries: IntersectionObserverEntry[]
) => {
	const callback = ctx.getObserverCallback();
	if (callback) {
		callback(entries, ctx.getMockObserver() as unknown as IntersectionObserver);
	}
};

type TestRegistrar = (ctx: UseInViewTestContext) => void;

const registerBasicFunctionalityTests: TestRegistrar[] = [
	registerReturnsRefAndStateTest,
	registerObservesElementTest,
	registerSetsInViewTrueTest,
	registerSetsInViewFalseTest,
	registerUpdatesEntryTest,
];

const registerOptionTests: TestRegistrar[] = [
	registerUsesDefaultThresholdTest,
	registerUsesCustomThresholdTest,
	registerUsesCustomRootMarginTest,
	registerUsesCustomRootTest,
	registerSkipsObservationWhenDisabledTest,
];

const registerTriggerOnceTests: TestRegistrar[] = [
	registerTriggerOnceTrueTest,
	registerTriggerOnceFalseTest,
];

const registerCleanupTests: TestRegistrar[] = [
	registerDisconnectOnUnmountTest,
	registerDisconnectOnRefChangeTest,
	registerSkipsObservationForNullTest,
];

const registerEdgeCaseTests: TestRegistrar[] = [
	registerHandlesEmptyEntriesTest,
	registerHandlesMultipleThresholdsTest,
	registerReobservesWhenOptionsChangeTest,
];

function describeBasicFunctionalitySuite(ctx: UseInViewTestContext) {
	describe('basic functionality', () => {
		for (const registerTest of registerBasicFunctionalityTests) {
			registerTest(ctx);
		}
	});
}

function describeOptionsSuite(ctx: UseInViewTestContext) {
	describe('options', () => {
		for (const registerTest of registerOptionTests) {
			registerTest(ctx);
		}
	});
}

function describeTriggerOnceSuite(ctx: UseInViewTestContext) {
	describe('triggerOnce option', () => {
		for (const registerTest of registerTriggerOnceTests) {
			registerTest(ctx);
		}
	});
}

function describeCleanupSuite(ctx: UseInViewTestContext) {
	describe('cleanup', () => {
		for (const registerTest of registerCleanupTests) {
			registerTest(ctx);
		}
	});
}

function describeEdgeCasesSuite(ctx: UseInViewTestContext) {
	describe('edge cases', () => {
		for (const registerTest of registerEdgeCaseTests) {
			registerTest(ctx);
		}
	});
}

function registerReturnsRefAndStateTest(_ctx: UseInViewTestContext) {
	it('should return ref and inView state', () => {
		const { result } = renderHook(() => useInView());

		expect(result.current).toHaveProperty('ref');
		expect(result.current).toHaveProperty('inView');
		expect(result.current).toHaveProperty('entry');
		expect(typeof result.current.ref).toBe('function');
		expect(result.current.inView).toBe(false);
	});
}

function registerObservesElementTest(ctx: UseInViewTestContext) {
	it('should observe element when ref is attached', async () => {
		const { result, rerender } = renderHook(({ enabled }) => useInView({ enabled }), {
			initialProps: { enabled: true },
		});
		const element = document.createElement('div');

		act(() => {
			result.current.ref(element);
		});

		// Trigger effect by toggling enabled (which is a dependency)
		rerender({ enabled: false });
		rerender({ enabled: true });

		await waitFor(() => {
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalled();
			expect(ctx.getObserveSpy()).toHaveBeenCalledWith(element);
		});
	});
}

function registerSetsInViewTrueTest(ctx: UseInViewTestContext) {
	it('should set inView to true when element intersects', async () => {
		const { result, rerender } = renderHook(() => useInView());
		const element = document.createElement('div');

		act(() => {
			result.current.ref(element);
		});

		// Trigger effect by rerendering
		rerender();

		triggerIntersectionCallback(ctx, [
			{
				isIntersecting: true,
				intersectionRatio: 1,
				target: element,
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRect: {} as DOMRectReadOnly,
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		]);

		await waitFor(() => {
			expect(result.current.inView).toBe(true);
		});
	});
}

function registerSetsInViewFalseTest(ctx: UseInViewTestContext) {
	it('should set inView to false when element does not intersect', async () => {
		const { result, rerender } = renderHook(() => useInView());
		const element = document.createElement('div');

		act(() => {
			result.current.ref(element);
		});

		// Trigger effect by rerendering
		rerender();

		// First set to true
		triggerIntersectionCallback(ctx, [
			{
				isIntersecting: true,
				intersectionRatio: 1,
				target: element,
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRect: {} as DOMRectReadOnly,
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		]);

		await waitFor(() => {
			expect(result.current.inView).toBe(true);
		});

		// Then set to false
		triggerIntersectionCallback(ctx, [
			{
				isIntersecting: false,
				intersectionRatio: 0,
				target: element,
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRect: {} as DOMRectReadOnly,
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		]);

		await waitFor(() => {
			expect(result.current.inView).toBe(false);
		});
	});
}

function registerUpdatesEntryTest(ctx: UseInViewTestContext) {
	it('should update entry when intersection changes', async () => {
		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		result.current.ref(element);

		const entry: IntersectionObserverEntry = {
			isIntersecting: true,
			intersectionRatio: 0.5,
			target: element,
			boundingClientRect: {} as DOMRectReadOnly,
			intersectionRect: {} as DOMRectReadOnly,
			rootBounds: null,
			time: Date.now(),
		} as IntersectionObserverEntry;

		triggerIntersectionCallback(ctx, [entry]);

		await waitFor(() => {
			expect(result.current.entry).toBe(entry);
		});
	});
}

function registerUsesDefaultThresholdTest(ctx: UseInViewTestContext) {
	it('should use default threshold of 0', async () => {
		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		result.current.ref(element);

		await waitFor(() => {
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({
					threshold: 0,
				})
			);
		});
	});
}

function registerUsesCustomThresholdTest(ctx: UseInViewTestContext) {
	it('should use custom threshold', async () => {
		const { result } = renderHook(() => useInView({ threshold: 0.5 }));
		const element = document.createElement('div');

		result.current.ref(element);

		await waitFor(() => {
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({
					threshold: 0.5,
				})
			);
		});
	});
}

function registerUsesCustomRootMarginTest(ctx: UseInViewTestContext) {
	it('should use custom rootMargin', async () => {
		const { result } = renderHook(() => useInView({ rootMargin: '100px' }));
		const element = document.createElement('div');

		result.current.ref(element);

		await waitFor(() => {
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({
					rootMargin: '100px',
				})
			);
		});
	});
}

function registerUsesCustomRootTest(ctx: UseInViewTestContext) {
	it('should use custom root element', async () => {
		const rootElement = document.createElement('div');
		const { result } = renderHook(() => useInView({ root: rootElement }));
		const element = document.createElement('div');

		result.current.ref(element);

		await waitFor(() => {
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({
					root: rootElement,
				})
			);
		});
	});
}

function registerSkipsObservationWhenDisabledTest(ctx: UseInViewTestContext) {
	it('should not observe when enabled is false', () => {
		const { result } = renderHook(() => useInView({ enabled: false }));
		const element = document.createElement('div');

		result.current.ref(element);

		expect(ctx.getMockIntersectionObserver()).not.toHaveBeenCalled();
		expect(ctx.getObserveSpy()).not.toHaveBeenCalled();
	});
}

function registerTriggerOnceTrueTest(ctx: UseInViewTestContext) {
	it('should trigger only once when triggerOnce is true', async () => {
		const { result } = renderHook(() => useInView({ triggerOnce: true }));
		const element = document.createElement('div');

		result.current.ref(element);

		// First intersection
		triggerIntersectionCallback(ctx, [
			{
				isIntersecting: true,
				intersectionRatio: 1,
				target: element,
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRect: {} as DOMRectReadOnly,
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		]);

		await waitFor(() => {
			expect(result.current.inView).toBe(true);
		});

		// Leave viewport
		triggerIntersectionCallback(ctx, [
			{
				isIntersecting: false,
				intersectionRatio: 0,
				target: element,
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRect: {} as DOMRectReadOnly,
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		]);

		// Should remain true because triggerOnce is enabled
		await waitFor(() => {
			expect(result.current.inView).toBe(true);
		});
	});
}

function registerTriggerOnceFalseTest(ctx: UseInViewTestContext) {
	it('should allow multiple triggers when triggerOnce is false', async () => {
		const { result } = renderHook(() => useInView({ triggerOnce: false }));
		const element = document.createElement('div');

		result.current.ref(element);

		// First intersection
		triggerIntersectionCallback(ctx, [
			{
				isIntersecting: true,
				intersectionRatio: 1,
				target: element,
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRect: {} as DOMRectReadOnly,
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		]);

		await waitFor(() => {
			expect(result.current.inView).toBe(true);
		});

		// Leave viewport
		triggerIntersectionCallback(ctx, [
			{
				isIntersecting: false,
				intersectionRatio: 0,
				target: element,
				boundingClientRect: {} as DOMRectReadOnly,
				intersectionRect: {} as DOMRectReadOnly,
				rootBounds: null,
				time: Date.now(),
			} as IntersectionObserverEntry,
		]);

		// Should be false because triggerOnce is false
		await waitFor(() => {
			expect(result.current.inView).toBe(false);
		});
	});
}

function registerDisconnectOnUnmountTest(ctx: UseInViewTestContext) {
	it('should disconnect observer on unmount', async () => {
		const { result, unmount } = renderHook(() => useInView());
		const element = document.createElement('div');

		result.current.ref(element);
		await waitFor(() => {
			expect(ctx.getObserveSpy()).toHaveBeenCalled();
		});

		unmount();

		expect(ctx.getDisconnectSpy()).toHaveBeenCalled();
	});
}

function registerDisconnectOnRefChangeTest(ctx: UseInViewTestContext) {
	it('should disconnect previous observer when ref changes', async () => {
		const { result } = renderHook(() => useInView());
		const element1 = document.createElement('div');
		const element2 = document.createElement('div');

		result.current.ref(element1);
		await waitFor(() => {
			expect(ctx.getObserveSpy()).toHaveBeenCalledWith(element1);
		});

		result.current.ref(element2);
		await waitFor(() => {
			expect(ctx.getDisconnectSpy()).toHaveBeenCalled();
			expect(ctx.getObserveSpy()).toHaveBeenCalledWith(element2);
		});
	});
}

function registerSkipsObservationForNullTest(ctx: UseInViewTestContext) {
	it('should not observe when element is null', () => {
		const { result } = renderHook(() => useInView());

		result.current.ref(null);

		expect(ctx.getMockIntersectionObserver()).not.toHaveBeenCalled();
	});
}

function registerHandlesEmptyEntriesTest(ctx: UseInViewTestContext) {
	it('should handle empty entries array', () => {
		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		result.current.ref(element);

		// Should not throw when entries array is empty
		expect(() => {
			triggerIntersectionCallback(ctx, []);
		}).not.toThrow();
	});
}

function registerHandlesMultipleThresholdsTest(ctx: UseInViewTestContext) {
	it('should handle multiple threshold values', async () => {
		const { result } = renderHook(() => useInView({ threshold: [0, 0.5, 1] }));
		const element = document.createElement('div');

		result.current.ref(element);

		await waitFor(() => {
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({
					threshold: [0, 0.5, 1],
				})
			);
		});
	});
}

function registerReobservesWhenOptionsChangeTest(ctx: UseInViewTestContext) {
	it('should re-observe when options change', async () => {
		const { result, rerender } = renderHook(({ threshold }) => useInView({ threshold }), {
			initialProps: { threshold: 0 },
		});
		const element = document.createElement('div');

		result.current.ref(element);
		await waitFor(() => {
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ threshold: 0 })
			);
		});

		rerender({ threshold: 0.5 });
		await waitFor(() => {
			expect(ctx.getDisconnectSpy()).toHaveBeenCalled();
			expect(ctx.getMockIntersectionObserver()).toHaveBeenCalledWith(
				expect.any(Function),
				expect.objectContaining({ threshold: 0.5 })
			);
		});
	});
}

describe('useInView', () => {
	let mockObserver: MockObserver;
	let mockIntersectionObserver: typeof IntersectionObserver;
	let observeSpy: ObserverSpy;
	let disconnectSpy: ObserverSpy;
	let unobserveSpy: ObserverSpy;

	beforeEach(() => {
		observeSpy = vi.fn();
		disconnectSpy = vi.fn();
		unobserveSpy = vi.fn();

		mockObserver = {
			observe: observeSpy,
			disconnect: disconnectSpy,
			unobserve: unobserveSpy,
		};

		function intersectionObserverMockImpl(
			this: IntersectionObserver,
			callback: IntersectionObserverCallback
		) {
			mockObserver.callback = callback;
			return mockObserver as unknown as IntersectionObserver;
		}

		mockIntersectionObserver = vi.fn(
			intersectionObserverMockImpl
		) as unknown as typeof IntersectionObserver;

		globalThis.IntersectionObserver = mockIntersectionObserver;
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	const testContext: UseInViewTestContext = {
		getMockObserver: () => mockObserver,
		getMockIntersectionObserver: () => mockIntersectionObserver,
		getObserverCallback: () => mockObserver.callback,
		getObserveSpy: () => observeSpy,
		getDisconnectSpy: () => disconnectSpy,
	};

	describeBasicFunctionalitySuite(testContext);
	describeOptionsSuite(testContext);
	describeTriggerOnceSuite(testContext);
	describeCleanupSuite(testContext);
	describeEdgeCasesSuite(testContext);
});
