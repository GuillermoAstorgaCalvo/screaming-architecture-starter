import { useLocalStorage } from '@core/hooks/storage/useLocalStorage';
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import {
	createUseLocalStorageTestContext,
	SYNC_SCHEMA_INVALID_VALUE,
	SYNC_SCHEMA_VALID_VALUE,
	TEST_STORAGE_KEYS,
} from './useLocalStorage.test.shared';

const { getWrapper, getMockStorage } = createUseLocalStorageTestContext();

const syncsWithStorageEventsFromOtherTabs = async () => {
	const wrapper = getWrapper();
	const { result } = renderHook(() => useLocalStorage('sync-key', 'initial'), { wrapper });

	const storageEvent = new StorageEvent('storage', {
		key: 'sync-key',
		newValue: JSON.stringify('synced-value'),
		storageArea: globalThis.window.localStorage,
	});

	act(() => {
		globalThis.window.dispatchEvent(storageEvent);
	});

	await waitFor(() => {
		expect(result.current[0]).toBe('synced-value');
	});
};

const ignoresStorageEventsForDifferentKeys = () => {
	const wrapper = getWrapper();
	const { result } = renderHook(() => useLocalStorage('sync-key-2', 'initial'), { wrapper });

	const storageEvent = new StorageEvent('storage', {
		key: 'different-key',
		newValue: JSON.stringify('different-value'),
		storageArea: globalThis.window.localStorage,
	});

	act(() => {
		globalThis.window.dispatchEvent(storageEvent);
	});

	expect(result.current[0]).toBe('initial');
};

const handlesStorageEventRemoval = async () => {
	const storageKey = TEST_STORAGE_KEYS.syncRemoval;
	const mockStorage = getMockStorage();
	mockStorage.setItem(storageKey, JSON.stringify('existing'));

	const wrapper = getWrapper();
	const { result } = renderHook(() => useLocalStorage(storageKey, 'default'), { wrapper });

	const storageEvent = new StorageEvent('storage', {
		key: storageKey,
		newValue: null,
		storageArea: globalThis.window.localStorage,
	});

	act(() => {
		globalThis.window.dispatchEvent(storageEvent);
	});

	await waitFor(() => {
		expect(result.current[0]).toBe('default');
	});
};

const validatesStorageEventWithSchema = async () => {
	const schema = z.object({ id: z.string(), count: z.number() });
	const storageKey = TEST_STORAGE_KEYS.syncSchema;

	const wrapper = getWrapper();
	const { result } = renderHook(() => useLocalStorage(storageKey, { id: '', count: 0 }, schema), {
		wrapper,
	});

	const validEvent = new StorageEvent('storage', {
		key: storageKey,
		newValue: JSON.stringify(SYNC_SCHEMA_VALID_VALUE),
		storageArea: globalThis.window.localStorage,
	});

	act(() => {
		globalThis.window.dispatchEvent(validEvent);
	});

	await waitFor(() => {
		expect(result.current[0]).toEqual(SYNC_SCHEMA_VALID_VALUE);
	});

	const invalidEvent = new StorageEvent('storage', {
		key: storageKey,
		newValue: JSON.stringify(SYNC_SCHEMA_INVALID_VALUE),
		storageArea: globalThis.window.localStorage,
	});

	act(() => {
		globalThis.window.dispatchEvent(invalidEvent);
	});

	await waitFor(() => {
		expect(result.current[0]).toEqual({ id: '', count: 0 });
	});
};

const ignoresSessionStorageEvents = () => {
	const wrapper = getWrapper();
	const { result } = renderHook(() => useLocalStorage('sync-key-4', 'initial'), { wrapper });

	const storageEvent = new StorageEvent('storage', {
		key: 'sync-key-4',
		newValue: JSON.stringify('session-value'),
		storageArea: globalThis.window.sessionStorage,
	});

	act(() => {
		globalThis.window.dispatchEvent(storageEvent);
	});

	expect(result.current[0]).toBe('initial');
};

describe('useLocalStorage - cross-tab synchronization', () => {
	it('syncs with storage events from other tabs', syncsWithStorageEventsFromOtherTabs);
	it('ignores storage events for different keys', ignoresStorageEventsForDifferentKeys);
	it('handles storage event with null value (removal)', handlesStorageEventRemoval);
	it('validates storage event values with schema', validatesStorageEventWithSchema);
	it('ignores storage events from sessionStorage', ignoresSessionStorageEvents);
});

describe('useLocalStorage - cleanup', () => {
	it('removes event listener on unmount', () => {
		if (globalThis.window !== undefined) {
			const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');

			const wrapper = getWrapper();
			const { unmount } = renderHook(() => useLocalStorage('cleanup-key', 'initial'), {
				wrapper,
			});

			unmount();

			expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

			removeEventListenerSpy.mockRestore();
		}
	});
});
