import type { UseFetchReturn } from '@core/hooks/fetch/useFetch.types';
import { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { TestProviders } from '@tests/utils/TestProviders';
import { act, type ReactElement, type ReactNode } from 'react';

export interface TestUser {
	id: string;
	name: string;
	email: string;
}

export interface TestApiResponse {
	users: TestUser[];
	total: number;
}

export interface UseFetchTestSetup {
	httpAdapter: MockHttpAdapter;
	loggerAdapter: MockLoggerAdapter;
	wrapper: ({ children }: { children: ReactNode }) => ReactElement;
}

export function createTestSetup(): UseFetchTestSetup {
	const httpAdapter = new MockHttpAdapter();
	const loggerAdapter = new MockLoggerAdapter();

	return {
		httpAdapter,
		loggerAdapter,
		wrapper: createWrapper(httpAdapter, loggerAdapter),
	};
}

function createWrapper(http: MockHttpAdapter, logger: MockLoggerAdapter) {
	const Wrapper = ({ children }: { children: ReactNode }): ReactElement => (
		<TestProviders
			http={http}
			logger={logger}
			auth={new MockAuthAdapter()}
			storage={new MockStorageAdapter()}
			analytics={new MockAnalyticsAdapter()}
			defaultTheme="light"
		>
			{children}
		</TestProviders>
	);

	Wrapper.displayName = 'UseFetchTestWrapper';

	return Wrapper;
}

export async function runFetch<T>(result: { current: UseFetchReturn<T> }): Promise<void> {
	await act(async () => {
		await result.current.fetch();
	});
}

export function runReset<T>(result: { current: UseFetchReturn<T> }): void {
	act(() => {
		result.current.reset();
	});
}
