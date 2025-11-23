import { useLocalStorage } from '@core/hooks/storage/useLocalStorage';
import { act, renderHook } from '@testing-library/react';
import { MockStorageAdapter } from '@tests/utils/mocks/MockStorageAdapter';
import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import {
	createTestProvidersWrapper,
	setupUseLocalStorageTestSuite,
	type UseLocalStorageTestContext,
} from './useLocalStorage.test.context';

const registerValuePersistenceTests = (getContext: UseLocalStorageTestContext) => {
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
	getContext: UseLocalStorageTestContext,
	scenario: ValuePersistenceScenario<T>
) {
	it(`stores and retrieves ${scenario.title} values`, () => {
		const { wrapper, mockStorage } = getContext();
		const { result } = renderHook(() => useLocalStorage(scenario.key, scenario.initial), {
			wrapper,
		});

		act(() => {
			result.current[1](scenario.updated);
		});

		expect(result.current[0]).toEqual(scenario.updated);
		expect(mockStorage.getItem(scenario.key)).toBe(JSON.stringify(scenario.updated));
	});
}
const registerValueRetrievalTests = (getContext: UseLocalStorageTestContext) => {
	describe('value retrieval', () => {
		it('returns initial value when storage is empty', () => {
			const { wrapper } = getContext();
			const { result } = renderHook(() => useLocalStorage('empty-key', 'default'), { wrapper });

			expect(result.current[0]).toBe('default');
		});

		it('retrieves existing value from storage on mount', () => {
			const { wrapper, mockStorage } = getContext();
			mockStorage.setItem('existing-key', JSON.stringify('stored-value'));

			const { result } = renderHook(() => useLocalStorage('existing-key', 'default'), {
				wrapper,
			});

			expect(result.current[0]).toBe('stored-value');
		});

		it('retrieves complex object from storage on mount', () => {
			const { wrapper, mockStorage } = getContext();
			const storedObject = { name: 'John', age: 30 };
			mockStorage.setItem('user-key', JSON.stringify(storedObject));

			const { result } = renderHook(() => useLocalStorage('user-key', {}), { wrapper });

			expect(result.current[0]).toEqual(storedObject);
		});
	});
};
const registerValueUpdatesTests = (getContext: UseLocalStorageTestContext) => {
	describe('value updates', () => {
		it('updates value and persists to storage', () => {
			const { wrapper, mockStorage } = getContext();
			const { result } = renderHook(() => useLocalStorage('update-key', 'initial'), { wrapper });

			act(() => {
				result.current[1]('updated');
			});

			expect(result.current[0]).toBe('updated');
			expect(mockStorage.getItem('update-key')).toBe(JSON.stringify('updated'));
		});

		it('updates value multiple times', () => {
			const { wrapper } = getContext();
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
};
const registerRemovalTests = (getContext: UseLocalStorageTestContext) => {
	describe('removal', () => {
		const removalKey = 'remove-key';
		const removalKey2 = 'remove-key-2';
		const removalValue = 'value';
		const defaultValue = 'default';

		it('removes value from storage using setValue(null)', () => {
			const { wrapper, mockStorage } = getContext();
			mockStorage.setItem(removalKey, JSON.stringify(removalValue));

			const { result } = renderHook(() => useLocalStorage(removalKey, defaultValue), { wrapper });

			act(() => {
				result.current[1](null);
			});

			expect(result.current[0]).toBe(defaultValue);
			expect(mockStorage.getItem(removalKey)).toBeNull();
		});

		it('removes value from storage using removeValue', () => {
			const { wrapper, mockStorage } = getContext();
			mockStorage.setItem(removalKey2, JSON.stringify(removalValue));

			const { result } = renderHook(() => useLocalStorage(removalKey2, defaultValue), {
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
const registerSsrSafetyTests = (getContext: UseLocalStorageTestContext) => {
	describe('SSR safety', () => {
		const ssrDefaultValue = 'ssr-default';

		it('handles SSR environment safely', () => {
			const { wrapper } = getContext();
			const { result } = renderHook(() => useLocalStorage('ssr-key', ssrDefaultValue), {
				wrapper,
			});

			expect(result.current[0]).toBe(ssrDefaultValue);
		});

		it('does not crash when storage operations fail', () => {
			const { wrapper } = getContext();
			const { unmount } = renderHook(() => useLocalStorage('ssr-key-2', ssrDefaultValue), {
				wrapper,
			});

			expect(() => unmount()).not.toThrow();
		});
	});
};
const registerJsonParseErrorTests = (getContext: UseLocalStorageTestContext) => {
	it('handles JSON parse errors gracefully', () => {
		const { wrapper, mockStorage } = getContext();
		mockStorage.setItem('invalid-json', 'not-valid-json{');

		const { result } = renderHook(() => useLocalStorage('invalid-json', 'default'), {
			wrapper,
		});

		expect(result.current[0]).toBe('default');
	});
};
const registerSetItemFailureTests = (getContext: UseLocalStorageTestContext) => {
	it('handles storage setItem failure', () => {
		const { mockLogger } = getContext();
		const failingStorage = new MockStorageAdapter();
		failingStorage.setItem = vi.fn().mockReturnValue(false);

		const failingWrapper = createTestProvidersWrapper({
			getStorage: () => failingStorage,
			getLogger: () => mockLogger,
		});

		const { result } = renderHook(() => useLocalStorage('fail-key', 'initial'), {
			wrapper: failingWrapper,
		});

		act(() => {
			result.current[1]('should-fail');
		});

		expect(result.current[0]).toBe('initial');
		expect(mockLogger.logs.some(log => log.message.includes('Failed to set item'))).toBe(true);
	});
};
const registerRemoveItemFailureTests = (getContext: UseLocalStorageTestContext) => {
	it('handles storage removeItem failure', () => {
		const { mockStorage, mockLogger } = getContext();
		const failingStorage = new MockStorageAdapter();
		failingStorage.removeItem = vi.fn().mockReturnValue(false);

		const failingWrapper = createTestProvidersWrapper({
			getStorage: () => failingStorage,
			getLogger: () => mockLogger,
		});

		mockStorage.setItem('fail-remove', JSON.stringify('value'));

		const { result } = renderHook(() => useLocalStorage('fail-remove', 'default'), {
			wrapper: failingWrapper,
		});

		act(() => {
			result.current[1](null);
		});

		expect(mockLogger.logs.some(log => log.message.includes('Failed to remove item'))).toBe(true);
	});
};
const registerSerializationErrorTests = (getContext: UseLocalStorageTestContext) => {
	it('handles serialization errors', () => {
		const { wrapper, mockLogger } = getContext();
		const circular: { self?: unknown } = {};
		circular.self = circular;

		const { result } = renderHook(() => useLocalStorage('circular-key', 'default'), {
			wrapper,
		});

		act(() => {
			result.current[1](circular as unknown as string);
		});

		expect(mockLogger.logs.some(log => log.message.includes('Failed to serialize value'))).toBe(
			true
		);
	});
};
function registerErrorHandlingTests(getContext: UseLocalStorageTestContext) {
	describe('error handling', () => {
		registerJsonParseErrorTests(getContext);
		registerSetItemFailureTests(getContext);
		registerRemoveItemFailureTests(getContext);
		registerSerializationErrorTests(getContext);
	});
}
const registerSerializationTests = (getContext: UseLocalStorageTestContext) => {
	describe('serialization/deserialization', () => {
		it('handles JSON serialization correctly', () => {
			const { wrapper, mockStorage } = getContext();
			const complexObject = {
				foo: 'bar',
				count: 42,
				nested: { deep: true },
				array: [1, 2, 3],
			};

			const { result } = renderHook(() => useLocalStorage('complex-key', {}), { wrapper });

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

			const { result } = renderHook(() => useLocalStorage('deserialize-key', {}), { wrapper });

			expect(result.current[0]).toEqual(storedObject);
		});

		it('handles special JSON values (null, undefined)', () => {
			const { wrapper, mockStorage } = getContext();
			const { result } = renderHook(() => useLocalStorage('null-key', null), { wrapper });

			act(() => {
				result.current[1](null);
			});

			expect(result.current[0]).toBeNull();
			expect(mockStorage.getItem('null-key')).toBeNull();
		});
	});
};
const registerValidSchemaTests = (getContext: UseLocalStorageTestContext) => {
	it('validates and accepts valid values with schema', () => {
		const { wrapper, mockStorage } = getContext();
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const validValue = { name: 'John', age: 30 };
		mockStorage.setItem('schema-key', JSON.stringify(validValue));

		const { result } = renderHook(
			() => useLocalStorage('schema-key', { name: '', age: 0 }, schema),
			{ wrapper }
		);

		expect(result.current[0]).toEqual(validValue);
	});
};
const registerInvalidSchemaTests = (getContext: UseLocalStorageTestContext) => {
	it('rejects invalid values and uses initial value with schema', () => {
		const { wrapper, mockStorage, mockLogger } = getContext();
		const schema = z.object({
			name: z.string(),
			age: z.number(),
		});

		const invalidValue = { name: 'John', age: 'not-a-number' };
		mockStorage.setItem('schema-key-2', JSON.stringify(invalidValue));

		const { result } = renderHook(
			() => useLocalStorage('schema-key-2', { name: '', age: 0 }, schema),
			{ wrapper }
		);

		expect(result.current[0]).toEqual({ name: '', age: 0 });
		expect(mockLogger.logs.some(log => log.message.includes('failed schema validation'))).toBe(
			true
		);
	});
};
const registerDeferredValidationTests = (getContext: UseLocalStorageTestContext) => {
	it('allows setting values that will be validated on next load', () => {
		const { wrapper, mockStorage } = getContext();
		const schema = z.string().min(3);
		const schemaKey = 'schema-key-3';
		const defaultValue = 'default';

		const { result } = renderHook(() => useLocalStorage(schemaKey, defaultValue, schema), {
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
		const { result: result2 } = renderHook(() => useLocalStorage(schemaKey, defaultValue, schema), {
			wrapper,
		});

		expect(result2.current[0]).toBe(defaultValue);
	});
};

const registerZodSchemaValidationTests = (getContext: UseLocalStorageTestContext) => {
	describe('Zod schema validation', () => {
		registerValidSchemaTests(getContext);
		registerInvalidSchemaTests(getContext);
		registerDeferredValidationTests(getContext);
	});
};
const registerSyncValueChangeTests = (getContext: UseLocalStorageTestContext) => {
	it('syncs value changes from other tabs', () => {
		if (globalThis.window === undefined) {
			return;
		}

		const { wrapper } = getContext();
		const { result } = renderHook(() => useLocalStorage('sync-key', 'initial'), { wrapper });

		expect(result.current[0]).toBe('initial');
		const storageEvent = new StorageEvent('storage', {
			key: 'sync-key',
			newValue: JSON.stringify('synced-value'),
			oldValue: JSON.stringify('initial'),
			storageArea: globalThis.window.localStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('synced-value');
	});
};
const registerSyncValueRemovalTests = (getContext: UseLocalStorageTestContext) => {
	const syncRemoveKey = 'sync-remove-key';
	it('syncs value removal from other tabs', () => {
		if (globalThis.window === undefined) {
			return;
		}

		const { wrapper, mockStorage } = getContext();
		mockStorage.setItem(syncRemoveKey, JSON.stringify('value'));

		const { result } = renderHook(() => useLocalStorage(syncRemoveKey, 'default'), {
			wrapper,
		});

		expect(result.current[0]).toBe('value');
		const storageEvent = new StorageEvent('storage', {
			key: syncRemoveKey,
			newValue: null,
			oldValue: JSON.stringify('value'),
			storageArea: globalThis.window.localStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('default');
	});
};
const registerSyncSchemaValidationTests = (getContext: UseLocalStorageTestContext) => {
	it('validates synced values with schema', () => {
		if (globalThis.window === undefined) {
			return;
		}

		const { wrapper, mockLogger } = getContext();
		const schema = z.object({
			id: z.string(),
			count: z.number(),
		});

		const { result } = renderHook(
			() => useLocalStorage('sync-schema-key', { id: '', count: 0 }, schema),
			{ wrapper }
		);
		const storageEvent = new StorageEvent('storage', {
			key: 'sync-schema-key',
			newValue: JSON.stringify({ id: '123', count: 'not-a-number' }),
			oldValue: null,
			storageArea: globalThis.window.localStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toEqual({ id: '', count: 0 });
		expect(mockLogger.logs.some(log => log.message.includes('failed schema validation'))).toBe(
			true
		);
	});
};
const registerSyncIgnoreTests = (getContext: UseLocalStorageTestContext) => {
	const testKey = 'my-key';
	it('ignores storage events from different keys', () => {
		if (globalThis.window === undefined) return;
		const { wrapper } = getContext();
		const { result } = renderHook(() => useLocalStorage(testKey, 'initial'), { wrapper });
		const storageEvent = new StorageEvent('storage', {
			key: 'other-key',
			newValue: JSON.stringify('other-value'),
			oldValue: null,
			storageArea: globalThis.window.localStorage,
		});
		act(() => globalThis.window.dispatchEvent(storageEvent));
		expect(result.current[0]).toBe('initial');
	});
	it('ignores storage events from sessionStorage', () => {
		if (globalThis.window === undefined) return;
		const { wrapper } = getContext();
		const { result } = renderHook(() => useLocalStorage(testKey, 'initial'), { wrapper });
		const storageEvent = new StorageEvent('storage', {
			key: testKey,
			newValue: JSON.stringify('session-value'),
			oldValue: null,
			storageArea: globalThis.window.sessionStorage,
		});
		act(() => globalThis.window.dispatchEvent(storageEvent));
		expect(result.current[0]).toBe('initial');
	});
};
const registerSyncParseErrorTests = (getContext: UseLocalStorageTestContext) => {
	it('handles parse errors in storage events gracefully', () => {
		if (globalThis.window === undefined) {
			return;
		}

		const { wrapper, mockLogger } = getContext();
		const { result } = renderHook(() => useLocalStorage('parse-error-key', 'default'), {
			wrapper,
		});
		const storageEvent = new StorageEvent('storage', {
			key: 'parse-error-key',
			newValue: 'invalid-json{',
			oldValue: null,
			storageArea: globalThis.window.localStorage,
		});

		act(() => {
			globalThis.window.dispatchEvent(storageEvent);
		});

		expect(result.current[0]).toBe('default');
		expect(
			mockLogger.logs.some(log => log.message.includes('Failed to parse storage event value'))
		).toBe(true);
	});
};
const registerCrossTabSyncTests = (getContext: UseLocalStorageTestContext) => {
	describe('cross-tab synchronization', () => {
		registerSyncValueChangeTests(getContext);
		registerSyncValueRemovalTests(getContext);
		registerSyncSchemaValidationTests(getContext);
		registerSyncIgnoreTests(getContext);
		registerSyncParseErrorTests(getContext);
	});
};
const registerCleanupTests = (getContext: UseLocalStorageTestContext) => {
	describe('cleanup', () => {
		it('removes event listener on unmount', () => {
			if (globalThis.window !== undefined) {
				const { wrapper } = getContext();
				const removeEventListenerSpy = vi.spyOn(globalThis.window, 'removeEventListener');

				const { unmount } = renderHook(() => useLocalStorage('cleanup-key', 'initial'), {
					wrapper,
				});

				unmount();

				expect(removeEventListenerSpy).toHaveBeenCalledWith('storage', expect.any(Function));

				removeEventListenerSpy.mockRestore();
			}
		});
	});
};
describe('useLocalStorage', () => {
	const { getContext } = setupUseLocalStorageTestSuite();

	registerValuePersistenceTests(getContext);
	registerValueRetrievalTests(getContext);
	registerValueUpdatesTests(getContext);
	registerRemovalTests(getContext);
	registerSsrSafetyTests(getContext);
	registerErrorHandlingTests(getContext);
	registerSerializationTests(getContext);
	registerZodSchemaValidationTests(getContext);
	registerCrossTabSyncTests(getContext);
	registerCleanupTests(getContext);
});
