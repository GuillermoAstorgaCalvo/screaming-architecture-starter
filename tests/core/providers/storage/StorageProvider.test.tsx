import type { StoragePort } from '@core/ports/StoragePort';
import { StorageContext } from '@core/providers/storage/StorageContext';
import { StorageProvider } from '@core/providers/storage/StorageProvider';
import { useStorage } from '@core/providers/storage/useStorage';
import { renderHook } from '@testing-library/react';
import { type ReactNode, useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createMockStorage = (): StoragePort => ({
	getItem: vi.fn().mockReturnValue('value'),
	setItem: vi.fn().mockReturnValue(true),
	removeItem: vi.fn().mockReturnValue(true),
	clear: vi.fn().mockReturnValue(true),
	getLength: vi.fn().mockReturnValue(0),
	key: vi.fn().mockReturnValue(null),
});

const createWrapper = (storage: StoragePort = createMockStorage()) => {
	const StorageProviderTestWrapper = ({ children }: { children: ReactNode }) => (
		<StorageProvider storage={storage}>{children}</StorageProvider>
	);
	StorageProviderTestWrapper.displayName = 'StorageProviderTestWrapper';
	return StorageProviderTestWrapper;
};

describe('StorageProvider', () => {
	it('provides the storage adapter via context', () => {
		const storage = createMockStorage();
		const wrapper = createWrapper(storage);

		const { result } = renderHook(() => useContext(StorageContext), { wrapper });

		expect(result.current?.storage).toBe(storage);
	});

	it('memoizes the context value when storage instance is stable', () => {
		const storage = createMockStorage();
		const wrapper = createWrapper(storage);

		const { result, rerender } = renderHook(() => useContext(StorageContext), { wrapper });

		const firstValue = result.current;
		rerender();

		expect(result.current).toBe(firstValue);
	});
});

describe('useStorage', () => {
	it('exposes the storage adapter supplied by the provider', () => {
		const storage = createMockStorage();
		const wrapper = createWrapper(storage);

		const { result } = renderHook(() => useStorage(), { wrapper });

		expect(result.current).toBe(storage);
	});

	it('delegates storage operations to the provided adapter', () => {
		const storage = createMockStorage();
		const wrapper = createWrapper(storage);
		const tokenKey = 'user-token';

		const { result } = renderHook(() => useStorage(), { wrapper });

		result.current.getItem(tokenKey);
		result.current.setItem(tokenKey, 'abc123');
		result.current.removeItem(tokenKey);
		result.current.clear();
		result.current.getLength();
		result.current.key(0);

		expect(storage.getItem).toHaveBeenCalledWith(tokenKey);
		expect(storage.setItem).toHaveBeenCalledWith(tokenKey, 'abc123');
		expect(storage.removeItem).toHaveBeenCalledWith(tokenKey);
		expect(storage.clear).toHaveBeenCalled();
		expect(storage.getLength).toHaveBeenCalled();
		expect(storage.key).toHaveBeenCalledWith(0);
	});

	it('throws when used outside of a StorageProvider', () => {
		expect(() => renderHook(() => useStorage())).toThrowError(
			'useStorage must be used within a StorageProvider'
		);
	});
});
