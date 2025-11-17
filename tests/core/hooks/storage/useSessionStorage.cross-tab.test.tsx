import { useSessionStorage } from '@core/hooks/storage/useSessionStorage';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
	setupUseSessionStorageTestSuite,
	type UseSessionStorageTestContext,
} from './useSessionStorage.test.context';

const registerCrossTabSynchronizationTests = (getContext: UseSessionStorageTestContext) => {
	describe('cross-tab synchronization', () => {
		registerCrossTabValueSyncScenarios(getContext);
		registerCrossTabSchemaValidationScenarios(getContext);
	});
};

function registerCrossTabValueSyncScenarios(getContext: UseSessionStorageTestContext) {
	describe('value synchronization', () => {
		const syncRemovalKey = 'sync-key-3';
		const defaultValue = 'default';

		registerCrossTabSyncEventTest(getContext);
		registerCrossTabIgnoreDifferentKeyTest(getContext);
		registerCrossTabRemovalEventTest(getContext, syncRemovalKey, defaultValue);
		registerCrossTabIgnoreLocalStorageTest(getContext);
	});
}

function registerCrossTabSchemaValidationScenarios(getContext: UseSessionStorageTestContext) {
	describe('schema validation', () => {
		const syncSchemaKey = 'sync-schema-key';

		registerCrossTabSchemaValidationTest(getContext, syncSchemaKey);
	});
}

function registerCrossTabSyncEventTest(getContext: UseSessionStorageTestContext) {
	it('syncs with storage events from other tabs', async () => {
		const { wrapper } = getContext();
		const { result } = renderHook(() => useSessionStorage('sync-key', 'initial'), { wrapper });

		const storageEvent = new StorageEvent('storage', {
			key: 'sync-key',
			newValue: JSON.stringify('synced-value'),
			storageArea: globalThis.window.sessionStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		await waitFor(() => {
			expect(result.current[0]).toBe('synced-value');
		});
	});
}

function registerCrossTabIgnoreDifferentKeyTest(getContext: UseSessionStorageTestContext) {
	it('ignores storage events for different keys', () => {
		const { wrapper } = getContext();
		const { result } = renderHook(() => useSessionStorage('sync-key-2', 'initial'), { wrapper });

		const storageEvent = new StorageEvent('storage', {
			key: 'different-key',
			newValue: JSON.stringify('different-value'),
			storageArea: globalThis.window.sessionStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('initial');
	});
}

function registerCrossTabRemovalEventTest(
	getContext: UseSessionStorageTestContext,
	syncRemovalKey: string,
	defaultValue: string
) {
	it('handles storage event with null value (removal)', async () => {
		const { wrapper, mockStorage } = getContext();
		mockStorage.setItem(syncRemovalKey, JSON.stringify('existing'));

		const { result } = renderHook(() => useSessionStorage(syncRemovalKey, defaultValue), {
			wrapper,
		});

		const storageEvent = new StorageEvent('storage', {
			key: syncRemovalKey,
			newValue: null,
			storageArea: globalThis.window.sessionStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		await waitFor(() => {
			expect(result.current[0]).toBe(defaultValue);
		});
	});
}

function registerCrossTabIgnoreLocalStorageTest(getContext: UseSessionStorageTestContext) {
	it('ignores storage events from localStorage', () => {
		const { wrapper } = getContext();
		const { result } = renderHook(() => useSessionStorage('sync-key-4', 'initial'), { wrapper });

		const storageEvent = new StorageEvent('storage', {
			key: 'sync-key-4',
			newValue: JSON.stringify('local-value'),
			storageArea: globalThis.window.localStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('initial');
	});
}

function registerCrossTabSchemaValidationTest(
	getContext: UseSessionStorageTestContext,
	syncSchemaKey: string
) {
	it('validates storage event values with schema', async () => {
		const { wrapper } = getContext();
		const schema = z.object({ id: z.string(), count: z.number() });

		const { result } = renderHook(
			() => useSessionStorage(syncSchemaKey, { id: '', count: 0 }, schema),
			{ wrapper }
		);

		const validEvent = new StorageEvent('storage', {
			key: syncSchemaKey,
			newValue: JSON.stringify({ id: '123', count: 5 }),
			storageArea: globalThis.window.sessionStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(validEvent);
		});

		await waitFor(() => {
			expect(result.current[0]).toEqual({ id: '123', count: 5 });
		});

		const invalidEvent = new StorageEvent('storage', {
			key: syncSchemaKey,
			newValue: JSON.stringify({ id: '123', count: 'not-a-number' }),
			storageArea: globalThis.window.sessionStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(invalidEvent);
		});

		await waitFor(() => {
			expect(result.current[0]).toEqual({ id: '', count: 0 });
		});
	});
}

describe('useSessionStorage cross-tab synchronization', () => {
	const { getContext } = setupUseSessionStorageTestSuite();

	registerCrossTabSynchronizationTests(getContext);
});
