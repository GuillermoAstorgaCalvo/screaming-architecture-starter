import { MemoryStorageAdapter } from '@infra/storage/memoryStorageAdapter';
import { beforeEach, describe, expect, it } from 'vitest';

const TEST_KEY = 'test-key';
const TEST_VALUE = 'test-value';
const UPDATED_VALUE = 'updated-value';

function setupMultipleItems(adapter: MemoryStorageAdapter, count: number): void {
	for (let i = 0; i < count; i++) {
		adapter.setItem(`key${i}`, `value${i}`);
	}
}

function verifyItemsExist(
	adapter: MemoryStorageAdapter,
	items: Array<{ key: string; value: string }>
): void {
	for (const { key, value } of items) {
		expect(adapter.getItem(key)).toBe(value);
	}
}

function verifyItemsRemoved(adapter: MemoryStorageAdapter, keys: string[]): void {
	for (const key of keys) {
		expect(adapter.getItem(key)).toBeNull();
	}
}

function describeGetItem(adapter: () => MemoryStorageAdapter): void {
	describe('getItem', () => {
		it('should return null for non-existent key', () => {
			expect(adapter().getItem('non-existent')).toBeNull();
		});

		it('should return stored value', () => {
			adapter().setItem(TEST_KEY, TEST_VALUE);
			expect(adapter().getItem(TEST_KEY)).toBe(TEST_VALUE);
		});

		it('should return null for removed key', () => {
			adapter().setItem(TEST_KEY, TEST_VALUE);
			adapter().removeItem(TEST_KEY);
			expect(adapter().getItem(TEST_KEY)).toBeNull();
		});
	});
}

function describeSetItem(adapter: () => MemoryStorageAdapter): void {
	describe('setItem', () => {
		it('should store value and return true', () => {
			const result = adapter().setItem(TEST_KEY, TEST_VALUE);
			expect(result).toBe(true);
			expect(adapter().getItem(TEST_KEY)).toBe(TEST_VALUE);
		});

		it('should overwrite existing value', () => {
			adapter().setItem(TEST_KEY, 'old-value');
			const result = adapter().setItem(TEST_KEY, 'new-value');
			expect(result).toBe(true);
			expect(adapter().getItem(TEST_KEY)).toBe('new-value');
		});

		it('should handle empty string value', () => {
			const result = adapter().setItem('empty-key', '');
			expect(result).toBe(true);
			expect(adapter().getItem('empty-key')).toBe('');
		});

		it('should handle special characters in value', () => {
			const specialValue = 'value with "quotes" and \'apostrophes\' and =equals';
			const result = adapter().setItem('special-key', specialValue);
			expect(result).toBe(true);
			expect(adapter().getItem('special-key')).toBe(specialValue);
		});
	});
}

function describeRemoveItem(adapter: () => MemoryStorageAdapter): void {
	describe('removeItem', () => {
		it('should remove item and return true', () => {
			adapter().setItem(TEST_KEY, TEST_VALUE);
			const result = adapter().removeItem(TEST_KEY);
			expect(result).toBe(true);
			expect(adapter().getItem(TEST_KEY)).toBeNull();
		});

		it('should return false when removing non-existent key', () => {
			const result = adapter().removeItem('non-existent');
			expect(result).toBe(false);
		});

		it('should handle multiple removals', () => {
			const keys = ['key1', 'key2', 'key3'];
			for (const key of keys) {
				adapter().setItem(key, `value${key.slice(-1)}`);
			}

			for (const key of keys) {
				expect(adapter().removeItem(key)).toBe(true);
			}

			verifyItemsRemoved(adapter(), keys);
		});
	});
}

function describeClear(adapter: () => MemoryStorageAdapter): void {
	describe('clear', () => {
		it('should clear all items and return true', () => {
			adapter().setItem('key1', 'value1');
			adapter().setItem('key2', 'value2');
			const result = adapter().clear();
			expect(result).toBe(true);
			expect(adapter().getLength()).toBe(0);
		});

		it('should return true when clearing empty storage', () => {
			const result = adapter().clear();
			expect(result).toBe(true);
			expect(adapter().getLength()).toBe(0);
		});

		it('should clear all items but preserve structure', () => {
			adapter().setItem('key1', 'value1');
			adapter().setItem('key2', 'value2');
			adapter().clear();
			adapter().setItem('new-key', 'new-value');
			expect(adapter().getItem('new-key')).toBe('new-value');
			expect(adapter().getLength()).toBe(1);
		});
	});
}

function describeGetLength(adapter: () => MemoryStorageAdapter): void {
	describe('getLength', () => {
		it('should return 0 for empty storage', () => {
			expect(adapter().getLength()).toBe(0);
		});

		it('should return correct length', () => {
			setupMultipleItems(adapter(), 3);
			expect(adapter().getLength()).toBe(3);
		});

		it('should not increment length when overwriting existing key', () => {
			adapter().setItem('key1', 'value1');
			adapter().setItem('key2', 'value2');
			expect(adapter().getLength()).toBe(2);

			adapter().setItem('key1', UPDATED_VALUE);
			expect(adapter().getLength()).toBe(2);
		});

		it('should decrement length when removing items', () => {
			setupMultipleItems(adapter(), 3);
			expect(adapter().getLength()).toBe(3);

			adapter().removeItem('key2');
			expect(adapter().getLength()).toBe(2);

			adapter().removeItem('key1');
			expect(adapter().getLength()).toBe(1);
		});
	});
}

function describeKey(adapter: () => MemoryStorageAdapter): void {
	describe('key', () => {
		it('should return null for invalid index', () => {
			expect(adapter().key(0)).toBeNull();
			expect(adapter().key(-1)).toBeNull();
			expect(adapter().key(100)).toBeNull();
		});

		it('should return key at given index', () => {
			setupMultipleItems(adapter(), 3);

			// Note: Map iteration order is insertion order
			const keys = [adapter().key(0), adapter().key(1), adapter().key(2)];
			expect(keys).toContain('key0');
			expect(keys).toContain('key1');
			expect(keys).toContain('key2');
		});

		it('should return null for index beyond length', () => {
			adapter().setItem('key1', 'value1');
			expect(adapter().key(1)).toBeNull();
		});
	});
}

function describeReset(adapter: () => MemoryStorageAdapter): void {
	describe('reset', () => {
		it('should clear all storage', () => {
			adapter().setItem('key1', 'value1');
			adapter().setItem('key2', 'value2');
			adapter().reset();
			expect(adapter().getLength()).toBe(0);
			expect(adapter().getItem('key1')).toBeNull();
			expect(adapter().getItem('key2')).toBeNull();
		});

		it('should allow storage after reset', () => {
			adapter().setItem('key1', 'value1');
			adapter().reset();
			adapter().setItem('new-key', 'new-value');
			expect(adapter().getItem('new-key')).toBe('new-value');
		});
	});
}

function describeIntegration(adapter: () => MemoryStorageAdapter): void {
	describe('Integration', () => {
		it('should handle full storage lifecycle', () => {
			const initialItems = [
				{ key: 'key1', value: 'value1' },
				{ key: 'key2', value: 'value2' },
				{ key: 'key3', value: 'value3' },
			];

			for (const { key, value } of initialItems) {
				adapter().setItem(key, value);
			}

			verifyItemsExist(adapter(), initialItems);
			expect(adapter().getLength()).toBe(3);

			adapter().removeItem('key2');
			expect(adapter().getItem('key2')).toBeNull();
			expect(adapter().getLength()).toBe(2);

			adapter().setItem('key1', UPDATED_VALUE);
			expect(adapter().getItem('key1')).toBe(UPDATED_VALUE);
			expect(adapter().getLength()).toBe(2);

			adapter().clear();
			expect(adapter().getLength()).toBe(0);
			expect(adapter().getItem('key1')).toBeNull();
		});

		it('should handle concurrent operations', () => {
			adapter().setItem('key1', 'value1');
			adapter().setItem('key2', 'value2');
			adapter().setItem('key1', 'updated1');
			adapter().setItem('key3', 'value3');

			verifyItemsExist(adapter(), [
				{ key: 'key1', value: 'updated1' },
				{ key: 'key2', value: 'value2' },
				{ key: 'key3', value: 'value3' },
			]);
			expect(adapter().getLength()).toBe(3);
		});

		it('should handle large number of items', () => {
			const itemCount = 100;
			setupMultipleItems(adapter(), itemCount);

			expect(adapter().getLength()).toBe(itemCount);
			verifyItemsExist(adapter(), [
				{ key: 'key0', value: 'value0' },
				{ key: 'key50', value: 'value50' },
				{ key: 'key99', value: 'value99' },
			]);
		});
	});
}

describe('MemoryStorageAdapter', () => {
	let adapter: MemoryStorageAdapter;

	beforeEach(() => {
		adapter = new MemoryStorageAdapter();
	});

	describeGetItem(() => adapter);
	describeSetItem(() => adapter);
	describeRemoveItem(() => adapter);
	describeClear(() => adapter);
	describeGetLength(() => adapter);
	describeKey(() => adapter);
	describeReset(() => adapter);
	describeIntegration(() => adapter);
});
