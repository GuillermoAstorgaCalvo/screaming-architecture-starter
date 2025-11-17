import { useLocalStorage } from '@core/hooks/storage/useLocalStorage';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { createUseLocalStorageTestContext } from './useLocalStorage.test.shared';

const { getWrapper, getMockStorage } = createUseLocalStorageTestContext();

describe('useLocalStorage - value persistence', () => {
	it('stores and retrieves string values', () => {
		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('test-key', 'initial'), { wrapper });

		act(() => {
			result.current[1]('updated');
		});

		expect(result.current[0]).toBe('updated');
		expect(mockStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
	});

	it('stores and retrieves number values', () => {
		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('num-key', 0), { wrapper });

		act(() => {
			result.current[1](42);
		});

		expect(result.current[0]).toBe(42);
		expect(mockStorage.getItem('num-key')).toBe(JSON.stringify(42));
	});

	it('stores and retrieves boolean values', () => {
		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('bool-key', false), { wrapper });

		act(() => {
			result.current[1](true);
		});

		expect(result.current[0]).toBe(true);
		expect(mockStorage.getItem('bool-key')).toBe(JSON.stringify(true));
	});

	it('stores and retrieves object values', () => {
		const initialValue = { foo: 'bar', count: 0 };
		const updatedValue = { foo: 'baz', count: 1 };
		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('obj-key', initialValue), { wrapper });

		act(() => {
			result.current[1](updatedValue);
		});

		expect(result.current[0]).toEqual(updatedValue);
		expect(mockStorage.getItem('obj-key')).toBe(JSON.stringify(updatedValue));
	});

	it('stores and retrieves array values', () => {
		const initialValue: number[] = [];
		const updatedValue = [1, 2, 3];
		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('arr-key', initialValue), { wrapper });

		act(() => {
			result.current[1](updatedValue);
		});

		expect(result.current[0]).toEqual(updatedValue);
		expect(mockStorage.getItem('arr-key')).toBe(JSON.stringify(updatedValue));
	});
});

describe('useLocalStorage - value retrieval', () => {
	it('returns initial value when storage is empty', () => {
		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage('empty-key', 'default'), { wrapper });

		expect(result.current[0]).toBe('default');
	});

	it('retrieves existing value from storage on mount', () => {
		const mockStorage = getMockStorage();
		mockStorage.setItem('existing-key', JSON.stringify('stored-value'));

		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage('existing-key', 'default'), { wrapper });

		expect(result.current[0]).toBe('stored-value');
	});

	it('retrieves complex object from storage on mount', () => {
		const storedObject = { name: 'John', age: 30 };
		const mockStorage = getMockStorage();
		mockStorage.setItem('user-key', JSON.stringify(storedObject));

		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage('user-key', {}), { wrapper });

		expect(result.current[0]).toEqual(storedObject);
	});
});

describe('useLocalStorage - value updates', () => {
	it('updates value and persists to storage', () => {
		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('update-key', 'initial'), { wrapper });

		act(() => {
			result.current[1]('updated');
		});

		expect(result.current[0]).toBe('updated');
		expect(mockStorage.getItem('update-key')).toBe(JSON.stringify('updated'));
	});

	it('updates value multiple times', () => {
		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage('multi-key', 0), { wrapper });

		act(() => {
			result.current[1](1);
		});
		expect(result.current[0]).toBe(1);

		act(() => {
			result.current[1](2);
		});
		expect(result.current[0]).toBe(2);

		act(() => {
			result.current[1](3);
		});
		expect(result.current[0]).toBe(3);
	});
});
