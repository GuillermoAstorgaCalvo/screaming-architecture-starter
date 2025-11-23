import { useInView } from '@core/hooks/motion/useInView';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

interface MockObserverSetup {
	observe: ReturnType<typeof vi.fn>;
	disconnect: ReturnType<typeof vi.fn>;
}

const createMockObserver = (): MockObserverSetup => {
	const observeSpy = vi.fn();
	const disconnectSpy = vi.fn();
	return {
		observe: observeSpy,
		disconnect: disconnectSpy,
	};
};

const createFactoryObserver = (
	mockObserver: MockObserverSetup
): ((_callback: IntersectionObserverCallback) => IntersectionObserver) => {
	const factoryObserver = vi.fn((_callback: IntersectionObserverCallback) => {
		return mockObserver as unknown as IntersectionObserver;
	});
	Object.setPrototypeOf(factoryObserver, null);
	return factoryObserver;
};

const createThrowingConstructor = (
	mockObserver: MockObserverSetup
): typeof IntersectionObserver => {
	const throwingConstructorFn = vi.fn((_callback: IntersectionObserverCallback) => {
		if (throwingConstructorFn.mock.calls.length === 1) {
			throw new TypeError('Test error');
		}
		return mockObserver as unknown as IntersectionObserver;
	});
	const throwingConstructor = throwingConstructorFn as unknown as typeof IntersectionObserver;
	throwingConstructor.prototype = {} as IntersectionObserver;
	return throwingConstructor;
};

const createNonTypeErrorConstructor = (): typeof IntersectionObserver => {
	const throwingConstructor = vi.fn(() => {
		throw new Error('Non-TypeError');
	}) as unknown as typeof IntersectionObserver;
	throwingConstructor.prototype = {} as IntersectionObserver;
	return throwingConstructor;
};

const setupTestWithNullObserver = () => {
	const originalIntersectionObserver = globalThis.IntersectionObserver;
	// @ts-expect-error - Testing edge case
	globalThis.IntersectionObserver = null;
	return () => {
		globalThis.IntersectionObserver = originalIntersectionObserver;
	};
};

const setupTestWithMissingObserver = () => {
	const originalIntersectionObserver = globalThis.IntersectionObserver;
	// @ts-expect-error - Testing edge case where IntersectionObserver is missing
	delete globalThis.IntersectionObserver;
	return () => {
		globalThis.IntersectionObserver = originalIntersectionObserver;
	};
};

describe('useInView - advanced edge cases', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should handle null observer creation gracefully', () => {
		const restore = setupTestWithNullObserver();
		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		expect(() => {
			result.current.ref(element);
		}).not.toThrow();

		restore();
	});

	it('should handle factory pattern IntersectionObserver', async () => {
		const mockObserver = createMockObserver();
		const factoryObserver = createFactoryObserver(mockObserver);
		// @ts-expect-error - Testing factory pattern
		globalThis.IntersectionObserver = factoryObserver;

		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		result.current.ref(element);

		await waitFor(() => {
			expect(factoryObserver).toHaveBeenCalled();
		});

		globalThis.IntersectionObserver = IntersectionObserver;
	});

	it('should handle TypeError in observer creation and fallback to factory', async () => {
		const mockObserver = createMockObserver();
		const throwingConstructor = createThrowingConstructor(mockObserver);
		globalThis.IntersectionObserver = throwingConstructor;

		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		expect(() => {
			result.current.ref(element);
		}).not.toThrow();

		const factoryObserver = createFactoryObserver(mockObserver);
		// @ts-expect-error - Testing factory pattern
		globalThis.IntersectionObserver = factoryObserver;

		result.current.ref(null);
		result.current.ref(element);

		globalThis.IntersectionObserver = IntersectionObserver;
	});

	it('should throw non-TypeError exceptions', () => {
		const throwingConstructor = createNonTypeErrorConstructor();
		globalThis.IntersectionObserver = throwingConstructor;

		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		expect(() => {
			result.current.ref(element);
		}).toThrow('Non-TypeError');

		globalThis.IntersectionObserver = IntersectionObserver;
	});

	it('should handle missing IntersectionObserver in globalThis', () => {
		const restore = setupTestWithMissingObserver();
		const { result } = renderHook(() => useInView());
		const element = document.createElement('div');

		expect(() => {
			result.current.ref(element);
		}).not.toThrow();

		restore();
	});
});
