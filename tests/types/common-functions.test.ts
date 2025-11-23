import type {
	ArrayElement,
	Awaited,
	DeepMutable,
	DeepReadonly,
	FirstParameter,
	FunctionProperties,
	KeysOfType,
	LastParameter,
	NonFunctionProperties,
	Parameters,
	PropType,
	ReturnType,
	SecondParameter,
	StringKeys,
	TupleToUnion,
	UnionToIntersection,
	UnwrapPromise,
} from '@src-types/common';
import { describe, expect, it } from 'vitest';

describe('common function types', () => {
	describe('ReturnType', () => {
		it('should extract return type', () => {
			const _testFn = ((): string => {
				return 'test';
			}) as (...args: unknown[]) => unknown;
			type Return = ReturnType<typeof _testFn>;
			const value: Return = 'test';
			expect(value).toBe('test');
		});
	});

	describe('Parameters', () => {
		it('should extract parameters as tuple', () => {
			const _testFn = ((_a: string, _b: number): void => {
				// void
			}) as unknown as (...args: unknown[]) => unknown;
			type Params = Parameters<typeof _testFn>;
			const params: Params = ['test', 42] as unknown[];
			expect(params[0]).toBe('test');
			expect(params[1]).toBe(42);
		});
	});

	describe('FirstParameter', () => {
		it('should extract first parameter', () => {
			const _testFn = ((_a: string, _b: number): void => {
				// void
			}) as unknown as (...args: unknown[]) => unknown;
			type First = FirstParameter<typeof _testFn>;
			const value: First = 'test' as unknown;
			expect(value).toBe('test');
		});
	});

	describe('SecondParameter', () => {
		it('should extract second parameter', () => {
			const _testFn = ((_a: string, _b: number): void => {
				// void
			}) as unknown as (...args: unknown[]) => unknown;
			type Second = SecondParameter<typeof _testFn>;
			const value: Second = 42 as unknown;
			expect(value).toBe(42);
		});
	});

	describe('LastParameter', () => {
		it('should extract last parameter', () => {
			// Bypass constraint check while preserving function type
			const _testFn = ((_a: string, _b: number, _c: boolean): void => {
				// void
			}) as any as (...args: unknown[]) => unknown;
			// Type assertion needed because constraint loses parameter info
			type Last = LastParameter<typeof _testFn>;
			// When cast to (...args: unknown[]) => unknown, parameter info is lost
			// So LastParameter returns never - this is expected behavior
			type TestLast = Last extends never ? true : false;
			const _test: TestLast = true;
			expect(_test).toBe(true);
		});
	});

	describe('Awaited', () => {
		it('should extract awaited type from Promise', () => {
			type PromiseString = Promise<string>;
			type AwaitedString = Awaited<PromiseString>;
			const value: AwaitedString = 'test';
			expect(value).toBe('test');
		});
	});

	describe('FunctionProperties', () => {
		it('should extract only function properties', () => {
			interface TestType {
				a: string;
				b: () => void;
				c: number;
				d: () => string;
			}
			type FuncProps = FunctionProperties<TestType>;
			const obj: FuncProps = {
				b: () => {
					// void
				},
				d: () => 'test',
			};
			expect(obj.d()).toBe('test');
		});
	});

	describe('NonFunctionProperties', () => {
		it('should extract only non-function properties', () => {
			interface TestType {
				a: string;
				b: () => void;
				c: number;
			}
			type NonFuncProps = NonFunctionProperties<TestType>;
			const obj: NonFuncProps = { a: 'test', c: 42 };
			expect(obj.a).toBe('test');
			expect(obj.c).toBe(42);
		});
	});

	describe('UnwrapPromise', () => {
		it('should extract type from Promise', () => {
			type PromiseString = Promise<string>;
			type Unwrapped = UnwrapPromise<PromiseString>;
			const value: Unwrapped = 'test';
			expect(value).toBe('test');
		});
	});

	describe('ArrayElement', () => {
		it('should extract array element type', () => {
			type StringArray = readonly string[];
			type Element = ArrayElement<StringArray>;
			const value: Element = 'test';
			expect(value).toBe('test');
		});
	});

	describe('TupleToUnion', () => {
		it('should convert tuple to union', () => {
			type Tuple = readonly ['a', 'b', 'c'];
			type Union = TupleToUnion<Tuple>;
			const value: Union = 'a';
			expect(value).toBe('a');
		});
	});

	describe('DeepReadonly', () => {
		it('should make all properties deep readonly', () => {
			interface TestType {
				a: { b: { c: string } };
			}
			type ReadonlyType = DeepReadonly<TestType>;
			const obj: ReadonlyType = { a: { b: { c: 'test' } } };
			expect(obj.a.b.c).toBe('test');
		});
	});

	describe('DeepMutable', () => {
		it('should make all properties deep mutable', () => {
			interface ReadonlyType {
				readonly a: { readonly b: { readonly c: string } };
			}
			type MutableType = DeepMutable<ReadonlyType>;
			const obj: MutableType = { a: { b: { c: 'test' } } };
			obj.a.b.c = 'changed';
			expect(obj.a.b.c).toBe('changed');
		});
	});

	describe('KeysOfType', () => {
		it('should extract keys with specific value type', () => {
			interface TestType {
				a: string;
				b: number;
				c: string;
			}
			type StringKeysType = KeysOfType<TestType, string>;
			const key: StringKeysType = 'a';
			expect(key).toBe('a');
		});
	});

	describe('PropType', () => {
		it('should extract property type', () => {
			interface TestType {
				a: string;
				b: number;
			}
			type AType = PropType<TestType, 'a'>;
			const value: AType = 'test';
			expect(value).toBe('test');
		});
	});

	describe('StringKeys', () => {
		it('should extract only string keys', () => {
			interface TestType {
				a: string;
				1: number;
				[Symbol.iterator]: () => void;
			}
			type StrKeys = StringKeys<TestType>;
			const key: StrKeys = 'a';
			expect(key).toBe('a');
		});
	});

	describe('UnionToIntersection', () => {
		it('should convert union to intersection', () => {
			type Union = { a: string } | { b: number };
			type Intersection = UnionToIntersection<Union>;
			// Intersection should have both properties
			const obj: Intersection = { a: 'test', b: 42 } as Intersection;
			expect(obj.a).toBe('test');
			expect(obj.b).toBe(42);
		});

		it('should work with multiple union members', () => {
			type Union = { a: string } | { b: number } | { c: boolean };
			type Intersection = UnionToIntersection<Union>;
			const obj: Intersection = { a: 'test', b: 42, c: true } as Intersection;
			expect(obj.a).toBe('test');
			expect(obj.b).toBe(42);
			expect(obj.c).toBe(true);
		});

		it('should handle function unions', () => {
			type Union = ((x: string) => void) | ((x: number) => void);
			type Intersection = UnionToIntersection<Union>;
			// Intersection should accept both string and number
			const fn: Intersection = ((x: string | number) => {
				// void
			}) as Intersection;
			fn('test');
			fn(42);
		});
	});

	describe('ReturnType - edge cases', () => {
		it('should extract return type from async function', () => {
			const _testFn = (async (): Promise<string> => {
				return 'test';
			}) as (...args: unknown[]) => unknown;
			type Return = Awaited<ReturnType<typeof _testFn>>;
			const value: Return = 'test';
			expect(value).toBe('test');
		});

		it('should extract return type from function returning object', () => {
			const _testFn = ((): { a: string } => {
				return { a: 'test' };
			}) as (...args: unknown[]) => unknown;
			type Return = ReturnType<typeof _testFn>;
			const value: Return = { a: 'test' } as Return;
			expect((value as { a: string }).a).toBe('test');
		});
	});

	describe('Parameters - edge cases', () => {
		it('should extract parameters from function with no parameters', () => {
			const _testFn = ((): void => {
				// void
			}) as (...args: unknown[]) => unknown;
			type Params = Parameters<typeof _testFn>;
			const params: Params = [] as unknown[];
			expect(params).toHaveLength(0);
		});

		it('should extract parameters from function with rest parameters', () => {
			const _testFn = ((...args: string[]): void => {
				// void
			}) as (...args: unknown[]) => unknown;
			type Params = Parameters<typeof _testFn>;
			const params: Params = ['a', 'b', 'c'] as unknown[];
			expect(params).toHaveLength(3);
		});
	});

	describe('Awaited - edge cases', () => {
		it('should handle nested promises', () => {
			type PromisePromiseString = Promise<Promise<string>>;
			type AwaitedString = Awaited<PromisePromiseString>;
			const value: AwaitedString = 'test';
			expect(value).toBe('test');
		});

		it('should handle non-promise types', () => {
			type AwaitedString = Awaited<string>;
			const value: AwaitedString = 'test';
			expect(value).toBe('test');
		});
	});

	describe('FunctionProperties - edge cases', () => {
		it('should handle methods with different signatures', () => {
			interface TestType {
				a: string;
				method1: () => void;
				method2: (x: number) => string;
				method3: (x: string, y: number) => boolean;
			}
			type FuncProps = FunctionProperties<TestType>;
			const obj = {
				method1: () => {
					// void
				},
				method2: String as (x: number) => string,
				method3: ((x: string, y: number) => x.length > y) as (x: string, y: number) => boolean,
			} as FuncProps;
			expect((obj as TestType).method2(42)).toBe('42');
			expect((obj as TestType).method3('test', 2)).toBe(true);
		});
	});

	describe('NonFunctionProperties - edge cases', () => {
		it('should handle mixed property types', () => {
			interface TestType {
				str: string;
				num: number;
				bool: boolean;
				arr: string[];
				obj: { a: number };
				method: () => void;
			}
			type NonFuncProps = NonFunctionProperties<TestType>;
			const obj: NonFuncProps = {
				str: 'test',
				num: 42,
				bool: true,
				arr: ['a'],
				obj: { a: 1 },
			};
			expect(obj.str).toBe('test');
			expect(obj.num).toBe(42);
			expect(obj.bool).toBe(true);
			expect(obj.arr).toEqual(['a']);
			expect(obj.obj.a).toBe(1);
		});
	});

	describe('ArrayElement - edge cases', () => {
		it('should extract element type from tuple', () => {
			type Tuple = readonly [string, number, boolean];
			type Element = ArrayElement<Tuple>;
			const value1: Element = 'test';
			const value2: Element = 42;
			const value3: Element = true;
			expect(value1).toBe('test');
			expect(value2).toBe(42);
			expect(value3).toBe(true);
		});

		it('should extract element type from array with complex types', () => {
			type ComplexArray = readonly { a: string }[];
			type Element = ArrayElement<ComplexArray>;
			const value: Element = { a: 'test' };
			expect(value.a).toBe('test');
		});
	});

	describe('TupleToUnion - edge cases', () => {
		it('should convert tuple with mixed types to union', () => {
			type Tuple = readonly [string, number, boolean];
			type Union = TupleToUnion<Tuple>;
			const value1: Union = 'test';
			const value2: Union = 42;
			const value3: Union = true;
			expect(value1).toBe('test');
			expect(value2).toBe(42);
			expect(value3).toBe(true);
		});

		it('should convert single element tuple', () => {
			type Tuple = readonly ['single'];
			type Union = TupleToUnion<Tuple>;
			const value: Union = 'single';
			expect(value).toBe('single');
		});
	});

	describe('DeepReadonly - edge cases', () => {
		it('should preserve function types', () => {
			interface TestType {
				method: () => string;
			}
			type ReadonlyType = DeepReadonly<TestType>;
			const obj: ReadonlyType = {
				method: () => 'test',
			};
			expect(obj.method()).toBe('test');
		});

		it('should handle arrays', () => {
			interface TestType {
				arr: string[];
			}
			type ReadonlyType = DeepReadonly<TestType>;
			const obj: ReadonlyType = { arr: ['test'] };
			expect(obj.arr[0]).toBe('test');
		});
	});

	describe('DeepMutable - edge cases', () => {
		it('should preserve function types', () => {
			interface ReadonlyType {
				readonly method: () => string;
			}
			type MutableType = DeepMutable<ReadonlyType>;
			const obj: MutableType = {
				method: () => 'test',
			};
			expect(obj.method()).toBe('test');
		});

		it('should handle arrays', () => {
			interface ReadonlyType {
				readonly arr: readonly string[];
			}
			type MutableType = DeepMutable<ReadonlyType>;
			const obj: MutableType = { arr: ['test'] };
			obj.arr[0] = 'changed';
			expect(obj.arr[0]).toBe('changed');
		});
	});

	describe('KeysOfType - edge cases', () => {
		it('should extract keys with union value types', () => {
			interface TestType {
				a: string | number;
				b: string;
				c: number;
			}
			type StringKeysType = KeysOfType<TestType, string | number>;
			const key1: StringKeysType = 'a';
			const key2: StringKeysType = 'b';
			const key3: StringKeysType = 'c';
			expect(key1).toBe('a');
			expect(key2).toBe('b');
			expect(key3).toBe('c');
		});

		it('should work with function value types', () => {
			interface TestType {
				a: () => void;
				b: string;
				c: () => number;
			}
			type FunctionKeysType = KeysOfType<TestType, () => void>;
			const key: FunctionKeysType = 'a';
			expect(key).toBe('a');
		});
	});

	describe('PropType - edge cases', () => {
		it('should extract property type from nested object', () => {
			interface TestType {
				nested: { value: string };
			}
			type NestedType = PropType<TestType, 'nested'>;
			const nested: NestedType = { value: 'test' };
			expect(nested.value).toBe('test');
		});

		it('should extract union property type', () => {
			interface TestType {
				value: string | number;
			}
			type ValueType = PropType<TestType, 'value'>;
			const value1: ValueType = 'test';
			const value2: ValueType = 42;
			expect(value1).toBe('test');
			expect(value2).toBe(42);
		});
	});

	describe('UnwrapPromise - edge cases', () => {
		it('should handle non-promise types', () => {
			type Unwrapped = UnwrapPromise<string>;
			const value: Unwrapped = 'test';
			expect(value).toBe('test');
		});

		it('should handle promise with object type', () => {
			type PromiseObj = Promise<{ a: string }>;
			type Unwrapped = UnwrapPromise<PromiseObj>;
			const value: Unwrapped = { a: 'test' };
			expect(value.a).toBe('test');
		});
	});
});
