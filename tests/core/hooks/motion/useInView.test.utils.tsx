import type { vi } from 'vitest';

export type ObserverSpy = ReturnType<typeof vi.fn>;

export interface MockObserver {
	observe: ObserverSpy;
	disconnect: ObserverSpy;
	unobserve: ObserverSpy;
	callback?: IntersectionObserverCallback;
}

export interface UseInViewTestContext {
	getMockObserver: () => MockObserver;
	getMockIntersectionObserver: () => typeof IntersectionObserver;
	getObserverCallback: () => IntersectionObserverCallback | undefined;
	getObserveSpy: () => ObserverSpy;
	getDisconnectSpy: () => ObserverSpy;
}

export const triggerIntersectionCallback = (
	ctx: UseInViewTestContext,
	entries: IntersectionObserverEntry[]
) => {
	const callback = ctx.getObserverCallback();
	if (callback) {
		callback(entries, ctx.getMockObserver() as unknown as IntersectionObserver);
	}
};

export type TestRegistrar = (ctx: UseInViewTestContext) => void;
