import { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { TestProviders } from '@tests/utils/TestProviders';
import React from 'react';

export type UseSessionStorageTestContext = () => {
	wrapper: ({ children }: { children: React.ReactNode }) => React.ReactElement;
	mockStorage: MockStorageAdapter;
	mockLogger: MockLoggerAdapter;
};

export const createTestProvidersWrapper = ({
	getStorage,
	getLogger,
}: {
	getStorage: () => MockStorageAdapter;
	getLogger: () => MockLoggerAdapter;
}) => {
	const ProvidersWrapper = ({ children }: { children: React.ReactNode }) => (
		<TestProviders
			storage={getStorage()}
			logger={getLogger()}
			auth={new MockAuthAdapter()}
			http={new MockHttpAdapter()}
			analytics={new MockAnalyticsAdapter()}
			defaultTheme="light"
		>
			{children}
		</TestProviders>
	);

	ProvidersWrapper.displayName = 'UseSessionStorageTestProvidersWrapper';

	return ProvidersWrapper;
};

export const setupUseSessionStorageTestSuite = () => {
	let mockStorage: MockStorageAdapter;
	let mockLogger: MockLoggerAdapter;

	beforeEach(() => {
		mockStorage = new MockStorageAdapter();
		mockLogger = new MockLoggerAdapter();
		mockStorage.reset();
		mockLogger.reset();
	});

	const wrapper = createTestProvidersWrapper({
		getStorage: () => mockStorage,
		getLogger: () => mockLogger,
	});

	const getContext: UseSessionStorageTestContext = () => ({
		wrapper,
		mockStorage,
		mockLogger,
	});

	return { getContext };
};
