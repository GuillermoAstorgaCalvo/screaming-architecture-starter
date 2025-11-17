import { useLocalStorage } from '@core/hooks/storage/useLocalStorage';
import { act, renderHook } from '@testing-library/react';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { describe, expect, it, vi } from 'vitest';

import {
	createUseLocalStorageTestContext,
	createWrapperWithCustomStorage,
	TEST_STORAGE_KEYS,
	TEST_STRING_VALUES,
} from './useLocalStorage.test.shared';

const { getWrapper, getMockStorage, getMockLogger } = createUseLocalStorageTestContext();

describe('useLocalStorage - removal', () => {
	it('removes value from storage using setValue(null)', () => {
		const storageKey = TEST_STORAGE_KEYS.remove;
		const mockStorage = getMockStorage();
		mockStorage.setItem(storageKey, JSON.stringify('value'));

		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage(storageKey, 'default'), { wrapper });

		act(() => {
			result.current[1](null);
		});

		expect(result.current[0]).toBe('default');
		expect(mockStorage.getItem(storageKey)).toBeNull();
	});

	it('removes value from storage using removeValue', () => {
		const storageKey = TEST_STORAGE_KEYS.removeAlt;
		const mockStorage = getMockStorage();
		mockStorage.setItem(storageKey, JSON.stringify('value'));

		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage(storageKey, 'default'), { wrapper });

		act(() => {
			result.current[2]();
		});

		expect(result.current[0]).toBe('default');
		expect(mockStorage.getItem(storageKey)).toBeNull();
	});
});

describe('useLocalStorage - SSR safety', () => {
	it('handles SSR environment safely', () => {
		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage('ssr-key', TEST_STRING_VALUES.ssrDefault), {
			wrapper,
		});

		expect(result.current[0]).toBe(TEST_STRING_VALUES.ssrDefault);
	});

	it('does not crash when storage operations fail', () => {
		const wrapper = getWrapper();
		const { unmount } = renderHook(
			() => useLocalStorage('ssr-key-2', TEST_STRING_VALUES.ssrDefault),
			{ wrapper }
		);

		expect(() => unmount()).not.toThrow();
	});
});

describe('useLocalStorage - error handling', () => {
	it('handles JSON parse errors gracefully', () => {
		const mockStorage = getMockStorage();
		mockStorage.setItem('invalid-json', 'not-valid-json{');

		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage('invalid-json', 'default'), { wrapper });

		expect(result.current[0]).toBe('default');
	});

	it('handles storage setItem failure', () => {
		const mockLogger = getMockLogger();
		const failingStorage = new MockStorageAdapter();
		failingStorage.setItem = vi.fn().mockReturnValue(false);

		const failingWrapper = createWrapperWithCustomStorage(failingStorage, mockLogger);
		const { result } = renderHook(() => useLocalStorage('fail-key', 'initial'), {
			wrapper: failingWrapper,
		});

		act(() => {
			result.current[1]('should-fail');
		});

		expect(result.current[0]).toBe('initial');
		expect(mockLogger.logs.some(log => log.message.includes('Failed to set item'))).toBe(true);
	});

	it('handles storage removeItem failure', () => {
		const mockLogger = getMockLogger();
		const failingStorage = new MockStorageAdapter();
		failingStorage.removeItem = vi.fn().mockReturnValue(false);

		const failingWrapper = createWrapperWithCustomStorage(failingStorage, mockLogger);
		failingStorage.setItem('fail-remove', JSON.stringify('value'));

		const { result } = renderHook(() => useLocalStorage('fail-remove', 'default'), {
			wrapper: failingWrapper,
		});

		act(() => {
			result.current[1](null);
		});

		expect(mockLogger.logs.some(log => log.message.includes('Failed to remove item'))).toBe(true);
	});

	it('handles serialization errors', () => {
		const mockLogger = getMockLogger();
		const wrapper = getWrapper();
		const circular: { self?: unknown } = {};
		circular.self = circular;

		const { result } = renderHook(() => useLocalStorage('circular-key', 'default'), { wrapper });

		act(() => {
			result.current[1](circular as unknown as string);
		});

		expect(mockLogger.logs.some(log => log.message.includes('Failed to serialize value'))).toBe(
			true
		);
	});
});
