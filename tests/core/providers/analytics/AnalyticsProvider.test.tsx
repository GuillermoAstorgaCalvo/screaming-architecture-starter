import type { AnalyticsInitOptions, AnalyticsPort } from '@core/ports/AnalyticsPort';
import { AnalyticsProvider } from '@core/providers/analytics/AnalyticsProvider';
import { useAnalytics } from '@core/providers/analytics/useAnalytics';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

interface ProviderTestProps {
	analytics: AnalyticsPort;
	config: AnalyticsInitOptions | null;
}

const createProviderWrapper = (propsRef: { current: ProviderTestProps }) => {
	return function ProviderWrapper({ children }: PropsWithChildren) {
		const { analytics, config } = propsRef.current;
		return (
			<AnalyticsProvider analytics={analytics} config={config}>
				{children}
			</AnalyticsProvider>
		);
	};
};

const createMockAnalyticsAdapter = (overrides: Partial<AnalyticsPort> = {}): AnalyticsPort => ({
	initialize: vi.fn(),
	trackEvent: vi.fn(),
	trackPageView: vi.fn(),
	identify: vi.fn(),
	setUserProperties: vi.fn(),
	reset: vi.fn(),
	...overrides,
});

const createPropsRef = (analytics: AnalyticsPort, config: AnalyticsInitOptions | null = null) => ({
	current: { analytics, config },
});

const renderUseAnalyticsHook = (propsRef: { current: ProviderTestProps }) => {
	const wrapper = createProviderWrapper(propsRef);
	return renderHook(() => useAnalytics(), { wrapper });
};

const updateProps = (
	propsRef: { current: ProviderTestProps },
	analytics: AnalyticsPort,
	config: AnalyticsInitOptions | null = null
) => {
	propsRef.current = { analytics, config };
};

const getInitializeMock = (adapter: AnalyticsPort) => {
	if (typeof adapter.initialize !== 'function') {
		throw new TypeError('Analytics adapter initialize mock is missing');
	}

	return adapter.initialize as ReturnType<typeof vi.fn>;
};

const waitForInitializeCalls = async (adapter: AnalyticsPort, expectedCalls: number) => {
	const initializeMock = getInitializeMock(adapter);
	await waitFor(() => expect(initializeMock).toHaveBeenCalledTimes(expectedCalls));
};

const expectInitializeCalledWith = (adapter: AnalyticsPort, config: AnalyticsInitOptions) => {
	const initializeMock = getInitializeMock(adapter);
	expect(initializeMock).toHaveBeenLastCalledWith(config);
};

afterEach(() => {
	vi.restoreAllMocks();
});

describe('AnalyticsProvider context', () => {
	it('provides the analytics adapter through context', () => {
		const analyticsAdapter = createMockAnalyticsAdapter();
		const propsRef = createPropsRef(analyticsAdapter);
		const { result } = renderUseAnalyticsHook(propsRef);

		expect(result.current).toBe(analyticsAdapter);
	});

	it('tracks custom events via the provided adapter', () => {
		const analyticsAdapter = createMockAnalyticsAdapter();
		const propsRef = createPropsRef(analyticsAdapter);
		const { result } = renderUseAnalyticsHook(propsRef);

		const event = { name: 'signup_complete', params: { plan: 'pro' } };
		result.current.trackEvent(event);

		expect(analyticsAdapter.trackEvent).toHaveBeenCalledWith(event);
	});

	it('tracks page views via the provided adapter', () => {
		const analyticsAdapter = createMockAnalyticsAdapter();
		const propsRef = createPropsRef(analyticsAdapter);
		const { result } = renderUseAnalyticsHook(propsRef);

		const pageView = { path: '/dashboard', title: 'Dashboard' };
		result.current.trackPageView(pageView);

		expect(analyticsAdapter.trackPageView).toHaveBeenCalledWith(pageView);
	});

	it('updates context value when the analytics adapter changes', () => {
		const firstAdapter = createMockAnalyticsAdapter();
		const secondAdapter = createMockAnalyticsAdapter();
		const propsRef = createPropsRef(firstAdapter);
		const { result, rerender } = renderUseAnalyticsHook(propsRef);
		expect(result.current).toBe(firstAdapter);

		updateProps(propsRef, secondAdapter);
		rerender();

		expect(result.current).toBe(secondAdapter);
	});
});

describe('AnalyticsProvider initialization', () => {
	it('initializes analytics when config changes and initialize is provided', async () => {
		const analyticsAdapter = createMockAnalyticsAdapter();
		const propsRef = createPropsRef(analyticsAdapter, null);
		const { rerender } = renderUseAnalyticsHook(propsRef);
		expect(analyticsAdapter.initialize).not.toHaveBeenCalled();

		updateProps(propsRef, analyticsAdapter, { writeKey: 'alpha' });
		rerender();
		await waitForInitializeCalls(analyticsAdapter, 1);
		expectInitializeCalledWith(analyticsAdapter, { writeKey: 'alpha' });

		updateProps(propsRef, analyticsAdapter, { writeKey: 'alpha' });
		rerender();
		await waitForInitializeCalls(analyticsAdapter, 1);

		updateProps(propsRef, analyticsAdapter, { writeKey: 'beta' });
		rerender();
		await waitForInitializeCalls(analyticsAdapter, 2);
		expectInitializeCalledWith(analyticsAdapter, { writeKey: 'beta' });
	});

	it('handles initialization errors and retries when config stays the same', async () => {
		const error = new TypeError('failed to init');
		const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

		const initialize = vi
			.fn()
			.mockImplementationOnce(() => Promise.reject(error))
			.mockResolvedValueOnce(undefined);

		const analyticsAdapter = createMockAnalyticsAdapter({ initialize });
		const propsRef = createPropsRef(analyticsAdapter, {
			writeKey: 'alpha',
		} satisfies AnalyticsInitOptions);
		const { rerender } = renderUseAnalyticsHook(propsRef);

		await waitForInitializeCalls(analyticsAdapter, 1);
		await waitFor(() =>
			expect(warnSpy).toHaveBeenCalledWith('Failed to initialize analytics provider', error)
		);

		updateProps(propsRef, analyticsAdapter, { writeKey: 'alpha' });
		rerender();

		await waitForInitializeCalls(analyticsAdapter, 2);
		expect(warnSpy).toHaveBeenCalledTimes(1);
	});
});

describe('useAnalytics guard', () => {
	it('throws when useAnalytics is called outside of AnalyticsProvider', () => {
		expect(() => renderHook(() => useAnalytics())).toThrowError(
			'useAnalytics must be used within an AnalyticsProvider'
		);
	});
});
