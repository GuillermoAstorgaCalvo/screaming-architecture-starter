import { QueryProvider } from '@app/providers/QueryProvider';
import { env } from '@core/config/env.client';
import { useQueryClient } from '@tanstack/react-query';
import { render, renderHook, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

const createWrapper = () => {
	const QueryProviderTestWrapper = ({ children }: { children: ReactNode }) => (
		<QueryProvider>{children}</QueryProvider>
	);
	QueryProviderTestWrapper.displayName = 'QueryProviderTestWrapper';
	return QueryProviderTestWrapper;
};

describe('QueryProvider', () => {
	const originalProdValue = env.PROD;

	afterEach(() => {
		env.PROD = originalProdValue;
	});

	it('provides a QueryClient instance to descendants and memoizes it across renders', () => {
		const wrapper = createWrapper();
		const { result, rerender } = renderHook(() => useQueryClient(), { wrapper });

		const initialClient = result.current;
		expect(initialClient).toBeDefined();

		rerender();

		expect(result.current).toBe(initialClient);
	});

	it('renders children via the QueryClientProvider context', () => {
		render(
			<QueryProvider>
				<span>query-provider-child</span>
			</QueryProvider>
		);

		expect(screen.getByText('query-provider-child')).toBeInTheDocument();
	});

	it('configures query defaults with the expected caching and retry behavior', () => {
		env.PROD = true;
		const wrapper = createWrapper();
		const { result } = renderHook(() => useQueryClient(), { wrapper });

		const { queries } = result.current.getDefaultOptions();
		expect(queries).toBeDefined();
		expect(queries?.staleTime).toBe(30_000);
		expect(queries?.gcTime).toBe(300_000);
		expect(queries?.retry).toBe(3);
		expect(queries?.refetchOnWindowFocus).toBe(true);
		expect(queries?.refetchOnReconnect).toBe(true);
		expect(queries?.refetchOnMount).toBe(true);

		const retryDelay = queries?.retryDelay;
		expect(typeof retryDelay).toBe('function');
		if (typeof retryDelay !== 'function') {
			throw new TypeError('retryDelay should be a function');
		}
		const retryDelayError = new TypeError('retry delay test error');
		expect(retryDelay(0, retryDelayError)).toBe(1_000);
		expect(retryDelay(3, retryDelayError)).toBe(8_000);
		expect(retryDelay(10, retryDelayError)).toBe(30_000);
	});

	it('disables refetch on window focus outside production', () => {
		env.PROD = false;
		const wrapper = createWrapper();
		const { result } = renderHook(() => useQueryClient(), { wrapper });

		const { queries } = result.current.getDefaultOptions();
		expect(queries?.refetchOnWindowFocus).toBe(false);
	});

	it('configures mutation defaults with single retry and fixed delay', () => {
		const wrapper = createWrapper();
		const { result } = renderHook(() => useQueryClient(), { wrapper });

		const { mutations } = result.current.getDefaultOptions();
		expect(mutations).toBeDefined();
		expect(mutations?.retry).toBe(1);
		expect(mutations?.retryDelay).toBe(1_000);
	});
});
