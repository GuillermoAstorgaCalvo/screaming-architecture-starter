import { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { TestProviders } from '@tests/utils/TestProviders';
import React from 'react';

export const CANCELLED_VALUE = 'should not be set';

export function createWrapper() {
	const logger = new MockLoggerAdapter();
	const auth = new MockAuthAdapter();
	const storage = new MockStorageAdapter();
	const http = new MockHttpAdapter();
	const analytics = new MockAnalyticsAdapter();

	return {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<TestProviders
				logger={logger}
				auth={auth}
				storage={storage}
				http={http}
				analytics={analytics}
				defaultTheme="light"
			>
				{children}
			</TestProviders>
		),
		logger,
	};
}

export const delayedAsyncFn = async (signal?: AbortSignal) => {
	await new Promise<void>(resolve => {
		setTimeout(resolve, 10);
	});
	if (signal?.aborted) {
		throw new DOMException('Aborted', 'AbortError');
	}
	return 'success';
};

export const abortCheckAsyncFn = async (signal?: AbortSignal) => {
	if (signal?.aborted) {
		throw new DOMException('Aborted', 'AbortError');
	}
	await new Promise<void>(resolve => {
		setTimeout(resolve, 10);
	});
	return 'success';
};

export { useAsync } from '@core/hooks/async/useAsync';
export { act, renderHook, waitFor } from '@testing-library/react';
