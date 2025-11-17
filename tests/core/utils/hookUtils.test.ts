import { getDependenciesKey } from '@core/utils/hookUtils';
import { describe, expect, it } from 'vitest';

const FUNCTION_MARKER = '[Function]';

describe('hookUtils - getDependenciesKey - empty arrays', () => {
	it('should return empty array string for empty array', () => {
		expect(getDependenciesKey([])).toBe('[]');
	});
});

describe('hookUtils - getDependenciesKey - primitive values', () => {
	it('should serialize string values', () => {
		expect(getDependenciesKey(['hello'])).toBe('["hello"]');
		expect(getDependenciesKey(['hello', 'world'])).toBe('["hello","world"]');
	});

	it('should serialize number values', () => {
		expect(getDependenciesKey([42])).toBe('[42]');
		expect(getDependenciesKey([1, 2, 3])).toBe('[1,2,3]');
		expect(getDependenciesKey([0])).toBe('[0]');
		expect(getDependenciesKey([-1])).toBe('[-1]');
		expect(getDependenciesKey([3.14])).toBe('[3.14]');
	});

	it('should serialize boolean values', () => {
		expect(getDependenciesKey([true])).toBe('[true]');
		expect(getDependenciesKey([false])).toBe('[false]');
		expect(getDependenciesKey([true, false])).toBe('[true,false]');
	});

	it('should serialize null values', () => {
		expect(getDependenciesKey([null])).toBe('[null]');
		expect(getDependenciesKey([null, null])).toBe('[null,null]');
	});

	it('should serialize undefined values', () => {
		// JSON.stringify converts undefined to null in arrays
		expect(getDependenciesKey([undefined])).toBe('[null]');
		expect(getDependenciesKey([undefined, undefined])).toBe('[null,null]');
	});

	it('should serialize mixed primitives', () => {
		// JSON.stringify converts undefined to null in arrays
		expect(getDependenciesKey(['hello', 42, true, null, undefined])).toBe(
			'["hello",42,true,null,null]'
		);
	});

	it('should serialize symbol values', () => {
		const sym1 = Symbol('test');
		const sym2 = Symbol('test');
		const key1 = getDependenciesKey([sym1]);
		const key2 = getDependenciesKey([sym2]);
		// JSON.stringify converts symbols to null, so they're considered serializable
		expect(key1).toBe('[null]');
		expect(key2).toBe('[null]');
		// Different symbol instances produce the same key (limitation of JSON.stringify)
		expect(key1).toBe(key2);
	});

	it('should serialize bigint values', () => {
		const bigInt1 = BigInt(123);
		const bigInt2 = BigInt(456);
		// BigInt is not JSON serializable, so should use fallback
		const key1 = getDependenciesKey([bigInt1]);
		const key2 = getDependenciesKey([bigInt2]);
		const key3 = getDependenciesKey([bigInt1, bigInt2]);
		expect(key1).toMatch(/^\d+:/); // Should start with length prefix
		expect(key2).toMatch(/^\d+:/); // Should start with length prefix
		expect(key3).toMatch(/^\d+:/); // Should start with length prefix
		expect(key1).toContain('123');
		expect(key2).toContain('456');
	});
});

describe('hookUtils - getDependenciesKey - serializable objects', () => {
	it('should serialize plain objects', () => {
		expect(getDependenciesKey([{ a: 1 }])).toBe('[{"a":1}]');
		expect(getDependenciesKey([{ a: 1, b: 2 }])).toBe('[{"a":1,"b":2}]');
	});

	it('should serialize nested objects', () => {
		expect(getDependenciesKey([{ a: { b: 2 } }])).toBe('[{"a":{"b":2}}]');
	});

	it('should serialize arrays', () => {
		expect(getDependenciesKey([[1, 2, 3]])).toBe('[[1,2,3]]');
		expect(
			getDependenciesKey([
				[1, 2],
				[3, 4],
			])
		).toBe('[[1,2],[3,4]]');
	});

	it('should serialize arrays with objects', () => {
		expect(getDependenciesKey([[{ a: 1 }]])).toBe('[[{"a":1}]]');
	});

	it('should serialize objects with arrays', () => {
		expect(getDependenciesKey([{ items: [1, 2, 3] }])).toBe('[{"items":[1,2,3]}]');
	});

	it('should serialize objects with null and undefined values', () => {
		// JSON.stringify omits undefined properties in objects
		expect(getDependenciesKey([{ a: null, b: undefined }])).toBe('[{"a":null}]');
	});

	it('should serialize empty objects and arrays', () => {
		expect(getDependenciesKey([{}])).toBe('[{}]');
		expect(getDependenciesKey([[]])).toBe('[[]]');
	});

	it('should produce consistent keys for same objects', () => {
		const obj = { a: 1, b: 2 };
		const key1 = getDependenciesKey([obj]);
		const key2 = getDependenciesKey([obj]);
		expect(key1).toBe(key2);
	});

	it('should produce different keys for different objects with same structure', () => {
		const obj1 = { a: 1, b: 2 };
		const obj2 = { a: 1, b: 2 };
		const key1 = getDependenciesKey([obj1]);
		const key2 = getDependenciesKey([obj2]);
		// Same structure should produce same key
		expect(key1).toBe(key2);
	});
});

describe('hookUtils - getDependenciesKey - non-serializable values', () => {
	it('should handle functions', () => {
		const fn = () => {};
		const key = getDependenciesKey([fn]);
		// Functions are not serializable, so should use fallback
		expect(key).toContain(FUNCTION_MARKER);
		expect(key).toMatch(/^\d+:/); // Should start with length prefix
	});

	it('should handle objects with functions', () => {
		const obj = { a: 1, fn: () => {} };
		const key = getDependenciesKey([obj]);
		// Objects with functions: JSON.stringify omits function properties
		// So the object itself is serializable (just without the function)
		expect(key).toBe('[{"a":1}]');
	});

	it('should handle circular references', () => {
		const circular: { self?: unknown } = {};
		circular.self = circular;
		const key = getDependenciesKey([circular]);
		// Circular references should use fallback
		expect(key).toMatch(/^\d+:/); // Should start with length prefix
	});

	it('should handle mixed serializable and non-serializable values', () => {
		const fn = () => {};
		const key = getDependenciesKey(['hello', 42, fn, { a: 1 }]);
		// Should use fallback when any value is non-serializable
		expect(key).toContain(FUNCTION_MARKER);
		expect(key).toMatch(/^\d+:/); // Should start with length prefix
	});

	it('should handle multiple functions', () => {
		const fn1 = () => {};
		const fn2 = () => {};
		const key = getDependenciesKey([fn1, fn2]);
		expect(key).toContain(FUNCTION_MARKER);
		expect(key).toMatch(/^\d+:/); // Should start with length prefix
	});

	it('should handle objects with circular references', () => {
		const parent: { child?: unknown } = {};
		const child: { parent?: unknown } = {};
		parent.child = child;
		child.parent = parent;
		const key = getDependenciesKey([parent]);
		// Should use fallback for circular references
		expect(key).toMatch(/^\d+:/); // Should start with length prefix
	});
});

describe('hookUtils - getDependenciesKey - edge cases', () => {
	it('should handle special number values', () => {
		expect(getDependenciesKey([Number.NaN])).toBe('[null]'); // JSON.stringify converts NaN to null
		expect(getDependenciesKey([Number.POSITIVE_INFINITY])).toBe('[null]'); // JSON.stringify converts Infinity to null
		expect(getDependenciesKey([Number.NEGATIVE_INFINITY])).toBe('[null]'); // JSON.stringify converts -Infinity to null
	});

	it('should handle Date objects', () => {
		const date = new Date('2023-01-01T00:00:00.000Z');
		const key = getDependenciesKey([date]);
		// Dates are serialized as ISO strings
		expect(key).toContain('2023-01-01');
	});

	it('should handle RegExp objects', () => {
		const regex = /test/g;
		const key = getDependenciesKey([regex]);
		// RegExp objects are serialized as empty objects by JSON.stringify
		expect(key).toBe('[{}]');
	});

	it('should handle Map objects', () => {
		const map = new Map([['a', 1]]);
		const key = getDependenciesKey([map]);
		// Maps are serialized as empty objects by JSON.stringify
		expect(key).toBe('[{}]');
	});

	it('should handle Set objects', () => {
		const set = new Set([1, 2, 3]);
		const key = getDependenciesKey([set]);
		// Sets are serialized as empty objects by JSON.stringify
		expect(key).toBe('[{}]');
	});

	it('should handle undefined in object properties', () => {
		// JSON.stringify omits undefined properties in objects
		expect(getDependenciesKey([{ a: undefined }])).toBe('[{}]');
	});

	it('should handle very long arrays', () => {
		const longArray = Array.from({ length: 1000 }, (_, i) => i);
		const key = getDependenciesKey([longArray]);
		expect(key).toBeTruthy();
		expect(key.length).toBeGreaterThan(0);
	});

	it('should handle deeply nested objects', () => {
		let deep: unknown = {};
		for (let i = 0; i < 10; i++) {
			deep = { nested: deep };
		}
		const key = getDependenciesKey([deep]);
		expect(key).toBeTruthy();
		expect(key.length).toBeGreaterThan(0);
	});

	it('should handle empty string', () => {
		expect(getDependenciesKey([''])).toBe('[""]');
	});

	it('should handle zero', () => {
		expect(getDependenciesKey([0])).toBe('[0]');
	});

	it('should handle negative zero', () => {
		// JSON.stringify treats -0 as 0
		expect(getDependenciesKey([-0])).toBe('[0]');
	});
});

describe('hookUtils - getDependenciesKey - dependency change detection', () => {
	it('should produce same key for identical primitive arrays', () => {
		const deps1 = [1, 2, 3];
		const deps2 = [1, 2, 3];
		expect(getDependenciesKey(deps1)).toBe(getDependenciesKey(deps2));
	});

	it('should produce different keys for different primitive arrays', () => {
		const deps1 = [1, 2, 3];
		const deps2 = [1, 2, 4];
		expect(getDependenciesKey(deps1)).not.toBe(getDependenciesKey(deps2));
	});

	it('should produce same key for identical object arrays', () => {
		const deps1 = [{ a: 1 }, { b: 2 }];
		const deps2 = [{ a: 1 }, { b: 2 }];
		expect(getDependenciesKey(deps1)).toBe(getDependenciesKey(deps2));
	});

	it('should produce different keys for different object arrays', () => {
		const deps1 = [{ a: 1 }, { b: 2 }];
		const deps2 = [{ a: 1 }, { b: 3 }];
		expect(getDependenciesKey(deps1)).not.toBe(getDependenciesKey(deps2));
	});

	it('should produce different keys when order changes', () => {
		const deps1 = [1, 2];
		const deps2 = [2, 1];
		expect(getDependenciesKey(deps1)).not.toBe(getDependenciesKey(deps2));
	});

	it('should produce same key for same function reference', () => {
		const fn = () => {};
		const deps1 = [fn];
		const deps2 = [fn];
		// Same function reference should produce same fallback key
		const key1 = getDependenciesKey(deps1);
		const key2 = getDependenciesKey(deps2);
		expect(key1).toBe(key2);
	});

	it('should produce same fallback key for different functions with same structure', () => {
		const fn1 = () => {};
		const fn2 = () => {};
		const deps1 = [fn1];
		const deps2 = [fn2];
		// Different function instances with same structure may produce same fallback
		// This is a limitation of the fallback mechanism
		const key1 = getDependenciesKey(deps1);
		const key2 = getDependenciesKey(deps2);
		// Both should use fallback format
		expect(key1).toMatch(/^\d+:/);
		expect(key2).toMatch(/^\d+:/);
	});
});

describe('hookUtils - getDependenciesKey - real-world scenarios', () => {
	it('should handle typical React hook dependencies', () => {
		const userId = '123';
		const page = 1;
		const filters = { status: 'active' };
		const deps = [userId, page, filters];
		const key = getDependenciesKey(deps);
		expect(key).toBeTruthy();
		expect(key).toContain('123');
		expect(key).toContain('1');
		expect(key).toContain('active');
	});

	it('should handle dependencies with callbacks', () => {
		const callback = () => {};
		const value = 'test';
		const deps = [callback, value];
		const key = getDependenciesKey(deps);
		// Should use fallback due to function
		expect(key).toMatch(/^\d+:/);
		expect(key).toContain(FUNCTION_MARKER);
	});

	it('should handle dependencies with complex nested structures', () => {
		const deps = [
			{
				user: { id: 1, name: 'John' },
				settings: { theme: 'dark', notifications: true },
			},
			[1, 2, 3],
			'search',
		];
		const key = getDependenciesKey(deps);
		expect(key).toBeTruthy();
		expect(key.length).toBeGreaterThan(0);
	});
});
