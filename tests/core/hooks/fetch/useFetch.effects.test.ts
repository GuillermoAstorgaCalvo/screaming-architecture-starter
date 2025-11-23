import { useAutoFetchEffect } from '@core/hooks/fetch/useFetch.effects';
import { cleanupAbortController } from '@core/hooks/fetch/useFetch.helpers';
import type { AutoFetchOptions } from '@core/hooks/fetch/useFetch.types';
import type { LoggerPort } from '@core/ports/LoggerPort';
import { renderHook } from '@testing-library/react';
import type { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@core/hooks/fetch/useFetch.helpers', () => ({
	cleanupAbortController: vi.fn(),
}));

const INITIAL_DEPENDENCIES_KEY = 'initial-key';
const TEST_DELAY_MS = 10;

interface TestSetup {
	loggerAdapter: MockLoggerAdapter;
	fetchData: () => Promise<void>;
	abortControllerRef: { current: AbortController | null };
	dependenciesKey: string;
	logger: LoggerPort;
}

const createDefaultOptions = (
	setup: TestSetup,
	overrides?: Partial<AutoFetchOptions>
): AutoFetchOptions => ({
	autoFetch: true,
	fetchData: setup.fetchData,
	dependenciesKey: setup.dependenciesKey,
	abortControllerRef: setup.abortControllerRef,
	logger: setup.logger,
	...overrides,
});

const waitForAsync = (): Promise<void> =>
	new Promise(resolve => {
		setTimeout(resolve, TEST_DELAY_MS);
	});

const setupTestEnvironment = () => {
	const loggerAdapter: MockLoggerAdapter = {
		debug: vi.fn(),
		error: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
	} as unknown as MockLoggerAdapter;
	const logger = loggerAdapter;
	const fetchData = vi.fn(() => Promise.resolve());
	const abortControllerRef = { current: null };
	const dependenciesKey = 'test-key';

	return { loggerAdapter, logger, fetchData, abortControllerRef, dependenciesKey };
};

type GetTestContext = () => TestSetup;

const runAutoFetchTests = (getContext: GetTestContext) => {
	describe('autoFetch behavior', () => {
		it('should call fetchData when autoFetch is true', async () => {
			const setup = getContext();
			const options = createDefaultOptions(setup);

			renderHook(() => useAutoFetchEffect(options));

			await waitForAsync();

			expect(setup.fetchData).toHaveBeenCalledTimes(1);
		});

		it('should not call fetchData when autoFetch is false', async () => {
			const setup = getContext();
			const options = createDefaultOptions(setup, { autoFetch: false });

			renderHook(() => useAutoFetchEffect(options));

			await waitForAsync();

			expect(setup.fetchData).not.toHaveBeenCalled();
		});
	});
};

const runCleanupTests = (getContext: GetTestContext) => {
	describe('cleanup behavior', () => {
		it('should cleanup abort controller on unmount', () => {
			const setup = getContext();
			const options = createDefaultOptions(setup);

			const { unmount } = renderHook(() => useAutoFetchEffect(options));

			unmount();

			expect(cleanupAbortController).toHaveBeenCalledWith(setup.abortControllerRef);
			expect(cleanupAbortController).toHaveBeenCalledTimes(1);
		});

		it('should cleanup abort controller when dependencies change', () => {
			const setup = getContext();
			const options = createDefaultOptions(setup);

			const { rerender } = renderHook(
				({ depsKey }) => useAutoFetchEffect({ ...options, dependenciesKey: depsKey }),
				{
					initialProps: { depsKey: 'key1' },
				}
			);

			rerender({ depsKey: 'key2' });

			expect(cleanupAbortController).toHaveBeenCalled();
		});
	});
};

const runErrorHandlingTests = (getContext: GetTestContext) => {
	describe('error handling', () => {
		it('should handle fetchData errors gracefully', async () => {
			const baseSetup = getContext();
			const error = new Error('Fetch failed');
			const failingFetchData = vi.fn(() => Promise.reject(error));
			const setup: TestSetup = {
				...baseSetup,
				fetchData: failingFetchData,
			};
			const options = createDefaultOptions(setup);

			renderHook(() => useAutoFetchEffect(options));

			await waitForAsync();

			expect(failingFetchData).toHaveBeenCalledTimes(1);
			expect(setup.logger.error).toHaveBeenCalledWith(
				'useFetch: Unhandled error in auto-fetch',
				error
			);
		});
	});
};

const runDependencyChangeTests = (getContext: GetTestContext) => {
	describe('dependency changes', () => {
		it('should use latest fetchData reference via ref when dependencies change', async () => {
			const setup = getContext();
			const firstFetchData = vi.fn(() => Promise.resolve());
			const secondFetchData = vi.fn(() => Promise.resolve());

			const { rerender } = renderHook(
				({ fetchFn, depsKey }) =>
					useAutoFetchEffect({
						autoFetch: true,
						fetchData: fetchFn,
						dependenciesKey: depsKey,
						abortControllerRef: setup.abortControllerRef,
						logger: setup.logger,
					}),
				{
					initialProps: { fetchFn: firstFetchData, depsKey: 'key1' },
				}
			);

			await waitForAsync();

			expect(firstFetchData).toHaveBeenCalledTimes(1);

			rerender({ fetchFn: secondFetchData, depsKey: 'key2' });

			await waitForAsync();

			expect(secondFetchData).toHaveBeenCalled();
		});
	});
};

const runDependenciesKeyChangeTests = (getContext: GetTestContext) => {
	describe('dependenciesKey changes', () => {
		it('should call fetchData when dependenciesKey changes with autoFetch true', async () => {
			const baseSetup = getContext();
			const setup: TestSetup = {
				...baseSetup,
				dependenciesKey: INITIAL_DEPENDENCIES_KEY,
			};
			const options = createDefaultOptions(setup);

			const { rerender } = renderHook(
				({ depsKey }) => useAutoFetchEffect({ ...options, dependenciesKey: depsKey }),
				{
					initialProps: { depsKey: INITIAL_DEPENDENCIES_KEY },
				}
			);

			await waitForAsync();

			expect(setup.fetchData).toHaveBeenCalledTimes(1);

			rerender({ depsKey: 'new-key' });

			await waitForAsync();

			expect(setup.fetchData).toHaveBeenCalledTimes(2);
		});

		it('should not call fetchData when dependenciesKey changes with autoFetch false', async () => {
			const baseSetup = getContext();
			const setup: TestSetup = {
				...baseSetup,
				dependenciesKey: INITIAL_DEPENDENCIES_KEY,
			};
			const options = createDefaultOptions(setup, { autoFetch: false });

			const { rerender } = renderHook(
				({ depsKey }) => useAutoFetchEffect({ ...options, dependenciesKey: depsKey }),
				{
					initialProps: { depsKey: INITIAL_DEPENDENCIES_KEY },
				}
			);

			await waitForAsync();

			expect(setup.fetchData).not.toHaveBeenCalled();

			rerender({ depsKey: 'new-key' });

			await waitForAsync();

			expect(setup.fetchData).not.toHaveBeenCalled();
		});
	});
};

describe('useAutoFetchEffect', () => {
	let loggerAdapter: MockLoggerAdapter;
	let fetchData: () => Promise<void>;
	let abortControllerRef: { current: AbortController | null };
	let dependenciesKey: string;
	let logger: LoggerPort;

	beforeEach(() => {
		({ loggerAdapter, logger, fetchData, abortControllerRef, dependenciesKey } =
			setupTestEnvironment());
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	const getContext: GetTestContext = (): TestSetup => ({
		loggerAdapter,
		fetchData,
		abortControllerRef,
		dependenciesKey,
		logger,
	});

	runAutoFetchTests(getContext);
	runCleanupTests(getContext);
	runErrorHandlingTests(getContext);
	runDependencyChangeTests(getContext);
	runDependenciesKeyChangeTests(getContext);
});
