import { useSessionStorage } from '@core/hooks/storage/useSessionStorage';
import { act, renderHook } from '@testing-library/react';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import {
	createTestProvidersWrapper,
	setupUseSessionStorageTestSuite,
	type UseSessionStorageTestContext,
} from './useSessionStorage.test.context';

const registerValuePersistenceTests = (getContext: UseSessionStorageTestContext) => {
	describe('value persistence', () => {
		const registerScenario = <T>(scenario: ValuePersistenceScenario<T>) =>
			registerValuePersistenceScenario(getContext, scenario);

		registerScenario({ title: 'string', key: 'test-key', initial: 'initial', updated: 'updated' });
		registerScenario({ title: 'number', key: 'num-key', initial: 0, updated: 42 });
		registerScenario({ title: 'boolean', key: 'bool-key', initial: false, updated: true });
		registerScenario({
			title: 'object',
			key: 'obj-key',
			initial: { foo: 'bar', count: 0 },
			updated: { foo: 'baz', count: 1 },
		});
		registerScenario({
			title: 'array',
			key: 'arr-key',
			initial: [] as number[],
			updated: [1, 2, 3],
		});
	});
};

interface ValuePersistenceScenario<T> {
	title: string;
	key: string;
	initial: T;
	updated: T;
}

function registerValuePersistenceScenario<T>(
	getContext: UseSessionStorageTestContext,
	scenario: ValuePersistenceScenario<T>
) {
	it(`stores and retrieves ${scenario.title} values`, () => {
		const { wrapper, mockStorage } = getContext();
		const { result } = renderHook(() => useSessionStorage(scenario.key, scenario.initial), {
			wrapper,
		});

		act(() => {
			result.current[1](scenario.updated);
		});

		expect(result.current[0]).toEqual(scenario.updated);
		expect(mockStorage.getItem(scenario.key)).toBe(JSON.stringify(scenario.updated));
	});
}

const registerValueRetrievalTests = (getContext: UseSessionStorageTestContext) => {
	describe('value retrieval', () => {
		it('returns initial value when storage is empty', () => {
			const { wrapper } = getContext();
			const { result } = renderHook(() => useSessionStorage('empty-key', 'default'), { wrapper });

			expect(result.current[0]).toBe('default');
		});

		it('retrieves existing value from storage on mount', () => {
			const { wrapper, mockStorage } = getContext();
			mockStorage.setItem('existing-key', JSON.stringify('stored-value'));

			const { result } = renderHook(() => useSessionStorage('existing-key', 'default'), {
				wrapper,
			});

			expect(result.current[0]).toBe('stored-value');
		});

		it('retrieves complex object from storage on mount', () => {
			const { wrapper, mockStorage } = getContext();
			const storedObject = { name: 'John', age: 30 };
			mockStorage.setItem('user-key', JSON.stringify(storedObject));

			const { result } = renderHook(() => useSessionStorage('user-key', {}), { wrapper });

			expect(result.current[0]).toEqual(storedObject);
		});
	});
};

const registerValueUpdatesTests = (getContext: UseSessionStorageTestContext) => {
	describe('value updates', () => {
		it('updates value and persists to storage', () => {
			const { wrapper, mockStorage } = getContext();
			const { result } = renderHook(() => useSessionStorage('update-key', 'initial'), { wrapper });

			act(() => {
				result.current[1]('updated');
			});

			expect(result.current[0]).toBe('updated');
			expect(mockStorage.getItem('update-key')).toBe(JSON.stringify('updated'));
		});

		it('updates value multiple times', () => {
			const { wrapper } = getContext();
			const { result } = renderHook(() => useSessionStorage('multi-key', 0), { wrapper });

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
};

const registerRemovalTests = (getContext: UseSessionStorageTestContext) => {
	describe('removal', () => {
		const removalKey = 'remove-key';
		const removalKey2 = 'remove-key-2';
		const removalValue = 'value';
		const defaultValue = 'default';

		it('removes value from storage using setValue(null)', () => {
			const { wrapper, mockStorage } = getContext();
			mockStorage.setItem(removalKey, JSON.stringify(removalValue));

			const { result } = renderHook(() => useSessionStorage(removalKey, defaultValue), { wrapper });

			act(() => {
				result.current[1](null);
			});

			expect(result.current[0]).toBe(defaultValue);
			expect(mockStorage.getItem(removalKey)).toBeNull();
		});

		it('removes value from storage using removeValue', () => {
			const { wrapper, mockStorage } = getContext();
			mockStorage.setItem(removalKey2, JSON.stringify(removalValue));

			const { result } = renderHook(() => useSessionStorage(removalKey2, defaultValue), {
				wrapper,
			});

			act(() => {
				result.current[2]();
			});

			expect(result.current[0]).toBe(defaultValue);
			expect(mockStorage.getItem(removalKey2)).toBeNull();
		});
	});
};

const registerSsrSafetyTests = (getContext: UseSessionStorageTestContext) => {
	describe('SSR safety', () => {
		const ssrDefaultValue = 'ssr-default';

		it('handles SSR environment safely', () => {
			const { wrapper } = getContext();
			const { result } = renderHook(() => useSessionStorage('ssr-key', ssrDefaultValue), {
				wrapper,
			});

			expect(result.current[0]).toBe(ssrDefaultValue);
		});

		it('does not crash when storage operations fail', () => {
			const { wrapper } = getContext();
			const { unmount } = renderHook(() => useSessionStorage('ssr-key-2', ssrDefaultValue), {
				wrapper,
			});

			expect(() => unmount()).not.toThrow();
		});
	});
};

function registerErrorHandlingTests(getContext: UseSessionStorageTestContext) {
	describe('error handling', () => {
		it('handles JSON parse errors gracefully', () => {
			const { wrapper, mockStorage } = getContext();
			mockStorage.setItem('invalid-json', 'not-valid-json{');

			const { result } = renderHook(() => useSessionStorage('invalid-json', 'default'), {
				wrapper,
			});

			expect(result.current[0]).toBe('default');
		});

		it('handles storage setItem failure', () => {
			const { mockLogger } = getContext();
			const failingStorage = new MockStorageAdapter();
			failingStorage.setItem = vi.fn().mockReturnValue(false);

			const failingWrapper = createTestProvidersWrapper({
				getStorage: () => failingStorage,
				getLogger: () => mockLogger,
			});

			const { result } = renderHook(() => useSessionStorage('fail-key', 'initial'), {
				wrapper: failingWrapper,
			});

			act(() => {
				result.current[1]('should-fail');
			});

			expect(result.current[0]).toBe('initial');
			expect(mockLogger.logs.some(log => log.message.includes('Failed to set item'))).toBe(true);
		});

		it('handles storage removeItem failure', () => {
			const { mockStorage, mockLogger } = getContext();
			const failingStorage = new MockStorageAdapter();
			failingStorage.removeItem = vi.fn().mockReturnValue(false);

			const failingWrapper = createTestProvidersWrapper({
				getStorage: () => failingStorage,
				getLogger: () => mockLogger,
			});

			mockStorage.setItem('fail-remove', JSON.stringify('value'));

			const { result } = renderHook(() => useSessionStorage('fail-remove', 'default'), {
				wrapper: failingWrapper,
			});

			act(() => {
				result.current[1](null);
			});

			expect(mockLogger.logs.some(log => log.message.includes('Failed to remove item'))).toBe(true);
		});

		it('handles serialization errors', () => {
			const { wrapper, mockLogger } = getContext();
			const circular: { self?: unknown } = {};
			circular.self = circular;

			const { result } = renderHook(() => useSessionStorage('circular-key', 'default'), {
				wrapper,
			});

			act(() => {
				result.current[1](circular as unknown as string);
			});

			expect(mockLogger.logs.some(log => log.message.includes('Failed to serialize value'))).toBe(
				true
			);
		});
	});
}

const registerSerializationTests = (getContext: UseSessionStorageTestContext) => {
	describe('serialization/deserialization', () => {
		it('handles JSON serialization correctly', () => {
			const { wrapper, mockStorage } = getContext();
			const complexObject = {
				foo: 'bar',
				count: 42,
				nested: { deep: true },
				array: [1, 2, 3],
			};

			const { result } = renderHook(() => useSessionStorage('complex-key', {}), { wrapper });

			act(() => {
				result.current[1](complexObject);
			});

			expect(result.current[0]).toEqual(complexObject);
			expect(mockStorage.getItem('complex-key')).toBe(JSON.stringify(complexObject));
		});

		it('handles JSON deserialization correctly', () => {
			const { wrapper, mockStorage } = getContext();
			const storedObject = { name: 'Alice', age: 25 };
			mockStorage.setItem('deserialize-key', JSON.stringify(storedObject));

			const { result } = renderHook(() => useSessionStorage('deserialize-key', {}), { wrapper });

			expect(result.current[0]).toEqual(storedObject);
		});

		it('handles special JSON values (null, undefined)', () => {
			const { wrapper, mockStorage } = getContext();
			const { result } = renderHook(() => useSessionStorage('null-key', null), { wrapper });

			act(() => {
				result.current[1](null);
			});

			expect(result.current[0]).toBeNull();
			expect(mockStorage.getItem('null-key')).toBeNull();
		});
	});
};

const registerZodSchemaValidationTests = (getContext: UseSessionStorageTestContext) => {
	describe('Zod schema validation', () => {
		it('validates and accepts valid values with schema', () => {
			const { wrapper, mockStorage } = getContext();
			const schema = z.object({
				name: z.string(),
				age: z.number(),
			});

			const validValue = { name: 'John', age: 30 };
			mockStorage.setItem('schema-key', JSON.stringify(validValue));

			const { result } = renderHook(
				() => useSessionStorage('schema-key', { name: '', age: 0 }, schema),
				{ wrapper }
			);

			expect(result.current[0]).toEqual(validValue);
		});

		it('rejects invalid values and uses initial value with schema', () => {
			const { wrapper, mockStorage, mockLogger } = getContext();
			const schema = z.object({
				name: z.string(),
				age: z.number(),
			});

			const invalidValue = { name: 'John', age: 'not-a-number' };
			mockStorage.setItem('schema-key-2', JSON.stringify(invalidValue));

			const { result } = renderHook(
				() => useSessionStorage('schema-key-2', { name: '', age: 0 }, schema),
				{ wrapper }
			);

			expect(result.current[0]).toEqual({ name: '', age: 0 });
			expect(mockLogger.logs.some(log => log.message.includes('failed schema validation'))).toBe(
				true
			);
		});

		it('allows setting values that will be validated on next load', () => {
			const { wrapper, mockStorage } = getContext();
			const schema = z.string().min(3);
			const schemaKey = 'schema-key-3';
			const defaultValue = 'default';

			const { result } = renderHook(() => useSessionStorage(schemaKey, defaultValue, schema), {
				wrapper,
			});

			act(() => {
				result.current[1]('valid-long-string');
			});

			expect(result.current[0]).toBe('valid-long-string');

			act(() => {
				result.current[1]('ab');
			});

			expect(result.current[0]).toBe('ab');

			mockStorage.setItem(schemaKey, JSON.stringify('ab'));
			const { result: result2 } = renderHook(
				() => useSessionStorage(schemaKey, defaultValue, schema),
				{ wrapper }
			);

			expect(result2.current[0]).toBe(defaultValue);
		});
	});
};

const registerCleanupTests = (getContext: UseSessionStorageTestContext) => {
	describe('cleanup', () => {
		it('removes event listener on unmount', () => {
			if (globalThis.window !== undefined) {
				const { wrapper } = getContext();
				const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');

				const { unmount } = renderHook(() => useSessionStorage('cleanup-key', 'initial'), {
					wrapper,
				});

				unmount();

				expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

				removeEventListenerSpy.mockRestore();
			}
		});
	});
};

describe('useSessionStorage', () => {
	const { getContext } = setupUseSessionStorageTestSuite();

	registerValuePersistenceTests(getContext);
	registerValueRetrievalTests(getContext);
	registerValueUpdatesTests(getContext);
	registerRemovalTests(getContext);
	registerSsrSafetyTests(getContext);
	registerErrorHandlingTests(getContext);
	registerSerializationTests(getContext);
	registerZodSchemaValidationTests(getContext);
	registerCleanupTests(getContext);
});
