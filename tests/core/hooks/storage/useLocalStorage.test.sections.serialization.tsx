import { useLocalStorage } from '@core/hooks/storage/useLocalStorage';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
	createUseLocalStorageTestContext,
	TEST_STORAGE_KEYS,
	TEST_STRING_VALUES,
} from './useLocalStorage.test.shared';

const { getWrapper, getMockStorage, getMockLogger } = createUseLocalStorageTestContext();

describe('useLocalStorage - serialization/deserialization', () => {
	it('handles JSON serialization correctly', () => {
		const complexObject = {
			foo: 'bar',
			count: 42,
			nested: { deep: true },
			array: [1, 2, 3],
		};

		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('complex-key', {}), { wrapper });

		act(() => {
			result.current[1](complexObject);
		});

		expect(result.current[0]).toEqual(complexObject);
		expect(mockStorage.getItem('complex-key')).toBe(JSON.stringify(complexObject));
	});

	it('handles JSON deserialization correctly', () => {
		const storedObject = { name: 'Alice', age: 25 };
		const mockStorage = getMockStorage();
		mockStorage.setItem('deserialize-key', JSON.stringify(storedObject));

		const wrapper = getWrapper();
		const { result } = renderHook(() => useLocalStorage('deserialize-key', {}), { wrapper });

		expect(result.current[0]).toEqual(storedObject);
	});

	it('handles special JSON values (null, undefined)', () => {
		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage('null-key', null), { wrapper });

		act(() => {
			result.current[1](null);
		});

		expect(result.current[0]).toBeNull();
		expect(mockStorage.getItem('null-key')).toBeNull();
	});
});

const ZOD_SCHEMA_SUITE = 'useLocalStorage - Zod schema validation';

describe(`${ZOD_SCHEMA_SUITE} | hydration`, () => {
	it('validates and accepts valid values with schema', () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const validValue = { name: 'John', age: 30 };
		const mockStorage = getMockStorage();
		mockStorage.setItem('schema-key', JSON.stringify(validValue));

		const wrapper = getWrapper();
		const { result } = renderHook(
			() => useLocalStorage('schema-key', { name: '', age: 0 }, schema),
			{ wrapper }
		);

		expect(result.current[0]).toEqual(validValue);
	});
});

describe(`${ZOD_SCHEMA_SUITE} | fallback`, () => {
	it('rejects invalid values and uses initial value with schema', () => {
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const invalidValue = { name: 'John', age: 'not-a-number' };
		const mockStorage = getMockStorage();
		mockStorage.setItem('schema-key-2', JSON.stringify(invalidValue));

		const mockLogger = getMockLogger();
		const wrapper = getWrapper();
		const { result } = renderHook(
			() => useLocalStorage('schema-key-2', { name: '', age: 0 }, schema),
			{ wrapper }
		);

		expect(result.current[0]).toEqual({ name: '', age: 0 });
		expect(mockLogger.logs.some(log => log.message.includes('failed schema validation'))).toBe(
			true
		);
	});
});

describe(`${ZOD_SCHEMA_SUITE} | deferred validation`, () => {
	it('allows setting values that will be validated on next load', () => {
		const schema = z.string().min(3);
		const storageKey = TEST_STORAGE_KEYS.schemaMinLength;
		const defaultValue = TEST_STRING_VALUES.schemaDefault;
		const validValue = TEST_STRING_VALUES.validLongString;
		const invalidValue = TEST_STRING_VALUES.invalidShortString;

		const wrapper = getWrapper();
		const mockStorage = getMockStorage();
		const { result } = renderHook(() => useLocalStorage(storageKey, defaultValue, schema), {
			wrapper,
		});

		act(() => {
			result.current[1](validValue);
		});
		expect(result.current[0]).toBe(validValue);

		act(() => {
			result.current[1](invalidValue);
		});
		expect(result.current[0]).toBe(invalidValue);

		mockStorage.setItem(storageKey, JSON.stringify(invalidValue));
		const { result: result2 } = renderHook(
			() => useLocalStorage(storageKey, defaultValue, schema),
			{ wrapper }
		);

		expect(result2.current[0]).toBe(defaultValue);
	});
});
