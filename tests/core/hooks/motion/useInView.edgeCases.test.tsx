import { useInView } from '@core/hooks/motion/useInView';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { triggerIntersectionCallback, type UseInViewTestContext } from './useInView.test.utils';

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
	unobserveSpy: ObserverSpy;
}

const createMockObserver = (): MockObserverSetup => {
	const observeSpy = vi.fn();
	const disconnectSpy = vi.fn();
	const unobserveSpy = vi.fn();

	const mockObserver: MockObserver = {
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

	const mockIntersectionObserver = vi.fn(
		intersectionObserverMockImpl
	) as unknown as typeof IntersectionObserver;

	return {
		mockObserver,
		mockIntersectionObserver,
		observeSpy,
		disconnectSpy,
		unobserveSpy,
	};
};

const createTestContext = (setup: MockObserverSetup): UseInViewTestContext => {
	return {
		getMockObserver: () => setup.mockObserver,
		getMockIntersectionObserver: () => setup.mockIntersectionObserver,
		getObserverCallback: () => setup.mockObserver.callback,
		getObserveSpy: () => setup.observeSpy,
		getDisconnectSpy: () => setup.disconnectSpy,
	};
};

const createIntersectionEntry = (element: HTMLElement): IntersectionObserverEntry =>
	({
		isIntersecting: true,
		intersectionRatio: 1,
		target: element,
		boundingClientRect: {} as DOMRectReadOnly,
		intersectionRect: {} as DOMRectReadOnly,
		rootBounds: null,
		time: Date.now(),
	}) as IntersectionObserverEntry;

const testEmptyEntriesArray = (testContext: UseInViewTestContext) => {
	const { result } = renderHook(() => useInView());
	const element = document.createElement('div');
	result.current.ref(element);
	expect(() => {
		triggerIntersectionCallback(testContext, []);
	}).not.toThrow();
};

const testMultipleThresholdValues = async (testContext: UseInViewTestContext) => {
	const { result } = renderHook(() => useInView({ threshold: [0, 0.5, 1] }));
	const element = document.createElement('div');
	result.current.ref(element);
	await waitFor(() => {
		expect(testContext.getMockIntersectionObserver()).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({ threshold: [0, 0.5, 1] })
		);
	});
};

const testReobserveOnOptionsChange = async (testContext: UseInViewTestContext) => {
	const { result, rerender } = renderHook(({ threshold }) => useInView({ threshold }), {
		initialProps: { threshold: 0 },
	});
	const element = document.createElement('div');
	result.current.ref(element);
	await waitFor(() => {
		expect(testContext.getMockIntersectionObserver()).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({ threshold: 0 })
		);
	});
	rerender({ threshold: 0.5 });
	await waitFor(() => {
		expect(testContext.getDisconnectSpy()).toHaveBeenCalled();
		expect(testContext.getMockIntersectionObserver()).toHaveBeenCalledWith(
			expect.any(Function),
			expect.objectContaining({ threshold: 0.5 })
		);
	});
};

const testUndefinedEntryInCallback = (testContext: UseInViewTestContext) => {
	const { result } = renderHook(() => useInView());
	const element = document.createElement('div');
	result.current.ref(element);
	const callback = testContext.getObserverCallback();
	if (callback) {
		expect(() => {
			callback([], testContext.getMockObserver() as unknown as IntersectionObserver);
		}).not.toThrow();
	}
};

const testTriggerOnceNoReconnect = async (testContext: UseInViewTestContext) => {
	const { result, rerender } = renderHook(() => useInView({ triggerOnce: true }));
	const element = document.createElement('div');
	result.current.ref(element);
	rerender();
	triggerIntersectionCallback(testContext, [createIntersectionEntry(element)]);
	await waitFor(() => {
		expect(result.current.inView).toBe(true);
	});
	const initialObserveCalls = testContext.getObserveSpy().mock.calls.length;
	rerender();
	await waitFor(() => {
		expect(testContext.getObserveSpy().mock.calls.length).toBe(initialObserveCalls);
	});
};

const testEnabledFalseNoObserve = async (testContext: UseInViewTestContext) => {
	const { result, rerender } = renderHook(({ enabled }) => useInView({ enabled }), {
		initialProps: { enabled: false },
	});
	const element = document.createElement('div');
	result.current.ref(element);
	rerender({ enabled: false });
	expect(testContext.getMockIntersectionObserver()).not.toHaveBeenCalled();
	expect(testContext.getObserveSpy()).not.toHaveBeenCalled();
};

const testNullElementReconnect = async (testContext: UseInViewTestContext) => {
	const { result, rerender } = renderHook(() => useInView());
	const element = document.createElement('div');
	result.current.ref(element);
	await waitFor(() => {
		expect(testContext.getObserveSpy()).toHaveBeenCalled();
	});
	result.current.ref(null);
	expect(() => {
		rerender();
	}).not.toThrow();
};

describe('useInView - edge cases', () => {
	let testContext: UseInViewTestContext;

	beforeEach(() => {
		const setup = createMockObserver();
		globalThis.IntersectionObserver = setup.mockIntersectionObserver;
		testContext = createTestContext(setup);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should handle empty entries array', () => {
		testEmptyEntriesArray(testContext);
	});

	it('should handle multiple threshold values', async () => {
		await testMultipleThresholdValues(testContext);
	});

	it('should re-observe when options change', async () => {
		await testReobserveOnOptionsChange(testContext);
	});

	it('should handle undefined entry in intersection callback', () => {
		testUndefinedEntryInCallback(testContext);
	});

	it('should not reconnect observer when triggerOnce is true and already triggered', async () => {
		await testTriggerOnceNoReconnect(testContext);
	});

	it('should not observe when reconnecting with enabled false', async () => {
		await testEnabledFalseNoObserve(testContext);
	});

	it('should handle null element in reconnectObserver', async () => {
		await testNullElementReconnect(testContext);
	});
});
