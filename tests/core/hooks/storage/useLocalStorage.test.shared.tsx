import { MockAnalyticsAdapter } from '@tests/utils/mocks/MockAnalyticsAdapter';
import { MockAuthAdapter } from '@tests/utils/mocks/MockAuthAdapter';
import { MockHttpAdapter } from '@tests/utils/mocks/MockHttpAdapter';
import { MockLoggerAdapter } from '@tests/utils/mocks/MockLoggerAdapter';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { TestProviders } from '@tests/utils/TestProviders';
import React from 'react';
import { beforeEach } from 'vitest';

export type TestWrapper = React.FC<{ children: React.ReactNode }>;

export interface UseLocalStorageTestContext {
	wrapper: TestWrapper;
	mockStorage: MockStorageAdapter;
	mockLogger: MockLoggerAdapter;
}

export type WrapperGetter = () => TestWrapper;
export type StorageGetter = () => MockStorageAdapter;
export type LoggerGetter = () => MockLoggerAdapter;

interface ContextAccessors {
	getWrapper: WrapperGetter;
	getMockStorage: StorageGetter;
	getMockLogger: LoggerGetter;
}

export const createUseLocalStorageTestContext = (): ContextAccessors => {
	let context: UseLocalStorageTestContext | null = null;

	beforeEach(() => {
		const mockStorage = new MockStorageAdapter();
		const mockLogger = new MockLoggerAdapter();
		mockStorage.reset();
		mockLogger.reset();

		const UseLocalStorageTestWrapper: TestWrapper = ({ children }) => (
			<TestProviders
				storage={mockStorage}
				logger={mockLogger}
				auth={new MockAuthAdapter()}
				http={new MockHttpAdapter()}
				analytics={new MockAnalyticsAdapter()}
				defaultTheme="light"
			>
				{children}
			</TestProviders>
		);
		UseLocalStorageTestWrapper.displayName = 'UseLocalStorageTestWrapper';

		context = {
			wrapper: UseLocalStorageTestWrapper,
			mockStorage,
			mockLogger,
		};
	});

	const readContext = () => {
		if (!context) {
			throw new Error('UseLocalStorage test context is not initialized.');
		}
		return context;
	};

	return {
		getWrapper: () => readContext().wrapper,
		getMockStorage: () => readContext().mockStorage,
		getMockLogger: () => readContext().mockLogger,
	};
};

export const TEST_STORAGE_KEYS = {
	remove: 'remove-key',
	removeAlt: 'remove-key-2',
	schemaMinLength: 'schema-key-3',
	syncRemoval: 'sync-key-3',
	syncSchema: 'sync-schema-key',
} as const;

export const TEST_STRING_VALUES = {
	ssrDefault: 'ssr-default',
	schemaDefault: 'default',
	validLongString: 'valid-long-string',
	invalidShortString: 'ab',
} as const;

export const SYNC_SCHEMA_VALID_VALUE = { id: '123', count: 5 } as const;
export const SYNC_SCHEMA_INVALID_VALUE = { id: '123', count: 'not-a-number' } as const;

export const createWrapperWithCustomStorage = (
	storage: MockStorageAdapter,
	logger: MockLoggerAdapter
): TestWrapper => {
	const CustomStorageWrapper: TestWrapper = ({ children }) => (
		<TestProviders
			storage={storage}
			logger={logger}
			auth={new MockAuthAdapter()}
			http={new MockHttpAdapter()}
			analytics={new MockAnalyticsAdapter()}
			defaultTheme="light"
		>
			{children}
		</TestProviders>
	);
	CustomStorageWrapper.displayName = 'CustomStorageWrapper';
	return CustomStorageWrapper;
};
