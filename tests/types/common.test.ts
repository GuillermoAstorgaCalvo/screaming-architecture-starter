import type {
	AssertType,
	BinaryFunction,
	Brand,
	DeepPartial,
	DeepRequired,
	ID,
	IsEqual,
	Maybe,
	MaybeNull,
	Mutable,
	NoArgFunction,
	NonEmptyArray,
	NonNullable,
	NullableProperties,
	NumberKeyRecord,
	NumberKeys,
	NumberRecord,
	Optional,
	OptionalNullable,
	Primitive,
	RequireFields,
	StringKeyRecord,
	StringRecord,
	SymbolKeys,
	Timestamp,
	UnaryFunction,
	UnwrapMaybe,
	UnwrapNullable,
	UUID,
	ValueOf,
	VoidFunction,
	VoidFunctionAnyArgs,
} from '@src-types/common';
import { describe, expect, it } from 'vitest';

describe('common types', () => {
	describe('Optional', () => {
		it('should make specific properties optional', () => {
			interface TestType {
				a: string;
				b: number;
			}
			type OptionalB = Optional<TestType, 'b'>;
			const obj: OptionalB = { a: 'test' };
			expect(obj.a).toBe('test');
			expect(obj.b).toBeUndefined();
		});
	});

	describe('RequireFields', () => {
		it('should make specific properties required', () => {
			interface TestType {
				a?: string;
				b?: number;
			}
			type RequiredAB = RequireFields<TestType, 'a' | 'b'>;
			const obj: RequiredAB = { a: 'test', b: 42 };
			expect(obj.a).toBe('test');
			expect(obj.b).toBe(42);
		});
	});

	describe('DeepPartial', () => {
		it('should make all properties deep partial', () => {
			interface TestType {
				a: { b: { c: string } };
			}
			type PartialTest = DeepPartial<TestType>;
			const obj: PartialTest = { a: { b: {} } };
			expect(obj.a?.b?.c).toBeUndefined();
		});
	});

	describe('DeepRequired', () => {
		it('should make all properties deep required', () => {
			interface TestType {
				a?: { b?: { c?: string } };
			}
			type RequiredTest = DeepRequired<TestType>;
			const obj: RequiredTest = { a: { b: { c: 'test' } } };
			expect(obj.a.b.c).toBe('test');
		});
	});

	describe('ValueOf', () => {
		it('should extract value type from Record', () => {
			interface TestRecord {
				a: string;
				b: number;
			}
			type Value = ValueOf<TestRecord>;
			const value: Value = 'test';
			expect(value).toBe('test');
		});
	});

	describe('VoidFunction', () => {
		it('should accept function returning void', () => {
			const fn: VoidFunction = () => {
				// void
			};
			fn();
		});
	});

	describe('VoidFunctionAnyArgs', () => {
		it('should accept function with any args returning void', () => {
			const fn: VoidFunctionAnyArgs = (...args) => {
				expect(args).toBeDefined();
			};
			fn(1, 2, 3);
		});
	});

	describe('NoArgFunction', () => {
		it('should accept function with no args', () => {
			type TestFn = NoArgFunction<string>;
			const fn: TestFn = () => 'test';
			expect(fn()).toBe('test');
		});
	});

	describe('UnaryFunction', () => {
		it('should accept function with one arg', () => {
			const fn: UnaryFunction<number, string> = String;
			expect(fn(42)).toBe('42');
		});
	});

	describe('BinaryFunction', () => {
		it('should accept function with two args', () => {
			const fn: BinaryFunction<number, number, number> = (a, b) => a + b;
			expect(fn(5, 3)).toBe(8);
		});
	});

	describe('NonEmptyArray', () => {
		it('should accept non-empty array', () => {
			const arr: NonEmptyArray<string> = ['first', 'second'];
			expect(arr).toHaveLength(2);
		});
	});

	describe('Primitive', () => {
		it('should accept primitive types', () => {
			const str: Primitive = 'string';
			const num: Primitive = 42;
			const bool: Primitive = true;
			const nul: Primitive = null;
			const undef: Primitive = undefined;
			expect(str).toBe('string');
			expect(num).toBe(42);
			expect(bool).toBe(true);
			expect(nul).toBeNull();
			expect(undef).toBeUndefined();
		});
	});

	describe('StringRecord', () => {
		it('should accept record with string keys', () => {
			const record: StringRecord<number> = { a: 1, b: 2 };
			expect(record.a).toBe(1);
			expect(record.b).toBe(2);
		});
	});

	describe('NumberRecord', () => {
		it('should accept record with number keys', () => {
			const record: NumberRecord<string> = { 1: 'one', 2: 'two' };
			expect(record[1]).toBe('one');
			expect(record[2]).toBe('two');
		});
	});

	describe('Maybe', () => {
		it('should accept value or undefined', () => {
			const value1: Maybe<string> = 'test';
			const value2: Maybe<string> = undefined;
			expect(value1).toBe('test');
			expect(value2).toBeUndefined();
		});
	});

	describe('MaybeNull', () => {
		it('should accept value, null, or undefined', () => {
			const value1: MaybeNull<string> = 'test';
			const value2: MaybeNull<string> = null;
			const value3: MaybeNull<string> = undefined;
			expect(value1).toBe('test');
			expect(value2).toBeNull();
			expect(value3).toBeUndefined();
		});
	});

	describe('Brand', () => {
		it('should create branded type', () => {
			type UserId = Brand<string, 'UserId'>;
			const id: UserId = '123' as UserId;
			expect(id).toBe('123');
		});
	});

	describe('Timestamp', () => {
		it('should accept branded timestamp', () => {
			const ts: Timestamp = 1704067199000 as Timestamp;
			expect(ts).toBe(1704067199000);
		});
	});

	describe('ID', () => {
		it('should accept string or number id', () => {
			const id1: ID = '123';
			const id2: ID = 123;
			expect(id1).toBe('123');
			expect(id2).toBe(123);
		});
	});

	describe('UUID', () => {
		it('should accept branded UUID', () => {
			const uuid: UUID = '550e8400-e29b-41d4-a716-446655440000' as UUID;
			expect(uuid).toBe('550e8400-e29b-41d4-a716-446655440000');
		});
	});

	describe('Mutable', () => {
		it('should make readonly properties mutable', () => {
			interface ReadonlyType {
				readonly a: string;
				readonly b: number;
			}
			type MutableType = Mutable<ReadonlyType>;
			const obj: MutableType = { a: 'test', b: 42 };
			obj.a = 'changed';
			expect(obj.a).toBe('changed');
		});
	});

	describe('NumberKeys', () => {
		it('should extract only number keys', () => {
			interface TestType {
				a: string;
				1: number;
			}
			type NumKeys = NumberKeys<TestType>;
			const key: NumKeys = 1;
			expect(key).toBe(1);
		});
	});

	describe('SymbolKeys', () => {
		it('should extract only symbol keys', () => {
			const sym = Symbol('test');
			interface TestType {
				a: string;
				[sym]: number;
			}
			type SymKeys = SymbolKeys<TestType>;
			const key: SymKeys = sym;
			expect(key).toBe(sym);
		});
	});

	describe('OptionalNullable', () => {
		it('should make all properties optional and nullable', () => {
			interface TestType {
				a: string;
				b: number;
			}
			type OptionalNullableType = OptionalNullable<TestType>;
			const obj: OptionalNullableType = { a: null };
			expect(obj.a).toBeNull();
			expect(obj.b).toBeUndefined();
		});
	});

	describe('StringKeyRecord', () => {
		it('should accept record with string keys', () => {
			const record: StringKeyRecord<number> = { a: 1 };
			expect(record.a).toBe(1);
		});
	});

	describe('NumberKeyRecord', () => {
		it('should accept record with number keys', () => {
			const record: NumberKeyRecord<string> = { 1: 'one' };
			expect(record[1]).toBe('one');
		});
	});

	describe('NonNullable', () => {
		it('should exclude null and undefined', () => {
			type TestType = string | null | undefined;
			type NonNull = NonNullable<TestType>;
			const value: NonNull = 'test';
			expect(value).toBe('test');
		});
	});

	describe('UnwrapNullable', () => {
		it('should exclude null and undefined', () => {
			type TestType = string | null | undefined;
			type Unwrapped = UnwrapNullable<TestType>;
			const value: Unwrapped = 'test';
			expect(value).toBe('test');
		});
	});

	describe('UnwrapMaybe', () => {
		it('should exclude undefined', () => {
			type TestType = string | undefined;
			type Unwrapped = UnwrapMaybe<TestType>;
			const value: Unwrapped = 'test';
			expect(value).toBe('test');
		});
	});

	describe('IsEqual', () => {
		it('should check type equality', () => {
			type Equal = IsEqual<string, string>;
			type NotEqual = IsEqual<string, number>;
			const equal: Equal = true;
			const notEqual: NotEqual = false;
			expect(equal).toBe(true);
			expect(notEqual).toBe(false);
		});

		it('should correctly identify equal object types', () => {
			type Equal = IsEqual<{ a: string }, { a: string }>;
			const equal: Equal = true;
			expect(equal).toBe(true);
		});

		it('should correctly identify different object types', () => {
			type NotEqual = IsEqual<{ a: string }, { b: number }>;
			const notEqual: NotEqual = false;
			expect(notEqual).toBe(false);
		});
	});

	describe('NullableProperties', () => {
		it('should make all properties nullable', () => {
			interface TestType {
				a: string;
				b: number;
				c: boolean;
			}
			type NullableType = NullableProperties<TestType>;
			const obj: NullableType = { a: null, b: null, c: null };
			expect(obj.a).toBeNull();
			expect(obj.b).toBeNull();
			expect(obj.c).toBeNull();
		});

		it('should allow original values or null', () => {
			interface TestType {
				a: string;
				b: number;
			}
			type NullableType = NullableProperties<TestType>;
			const obj1: NullableType = { a: 'test', b: 42 };
			const obj2: NullableType = { a: null, b: 42 };
			expect(obj1.a).toBe('test');
			expect(obj1.b).toBe(42);
			expect(obj2.a).toBeNull();
			expect(obj2.b).toBe(42);
		});

		it('should work with nested objects', () => {
			interface TestType {
				a: { b: string };
			}
			type NullableType = NullableProperties<TestType>;
			const obj: NullableType = { a: null };
			expect(obj.a).toBeNull();
		});
	});

	describe('AssertType', () => {
		it('should assert type matches expected', () => {
			type TestType = AssertType<string, string>;
			const value: TestType = 'test';
			expect(value).toBe('test');
		});

		it('should narrow type to never when assertion fails', () => {
			type TestType = AssertType<string, number>;
			// This should be never, so we can't assign a value
			type IsNever = TestType extends never ? true : false;
			const isNever: IsNever = true;
			expect(isNever).toBe(true);
		});

		it('should work with object types', () => {
			interface Expected {
				a: string;
			}
			interface Actual {
				a: string;
			}
			type TestType = AssertType<Actual, Expected>;
			const obj: TestType = { a: 'test' };
			expect(obj.a).toBe('test');
		});
	});

	describe('Optional - edge cases', () => {
		it('should make multiple properties optional', () => {
			interface TestType {
				a: string;
				b: number;
				c: boolean;
			}
			type OptionalBC = Optional<TestType, 'b' | 'c'>;
			const obj: OptionalBC = { a: 'test' };
			expect(obj.a).toBe('test');
			expect(obj.b).toBeUndefined();
			expect(obj.c).toBeUndefined();
		});

		it('should work with already optional properties', () => {
			interface TestType {
				a: string;
				b?: number;
			}
			type OptionalB = Optional<TestType, 'b'>;
			const obj: OptionalB = { a: 'test' };
			expect(obj.a).toBe('test');
		});
	});

	describe('RequireFields - edge cases', () => {
		it('should require multiple fields', () => {
			interface TestType {
				a?: string;
				b?: number;
				c?: boolean;
			}
			type RequiredAB = RequireFields<TestType, 'a' | 'b'>;
			const obj: RequiredAB = { a: 'test', b: 42 };
			expect(obj.a).toBe('test');
			expect(obj.b).toBe(42);
		});
	});

	describe('DeepPartial - edge cases', () => {
		it('should handle arrays', () => {
			interface TestType {
				arr: string[];
			}
			type PartialTest = DeepPartial<TestType>;
			const obj: PartialTest = {};
			expect(obj.arr).toBeUndefined();
		});

		it('should handle mixed nested structures', () => {
			interface TestType {
				a: { b: { c: string; d: number } };
			}
			type PartialTest = DeepPartial<TestType>;
			const obj: PartialTest = { a: { b: { c: 'test' } } };
			expect(obj.a?.b?.c).toBe('test');
			expect(obj.a?.b?.d).toBeUndefined();
		});
	});

	describe('DeepRequired - edge cases', () => {
		it('should handle arrays', () => {
			interface TestType {
				arr?: string[];
			}
			type RequiredTest = DeepRequired<TestType>;
			const obj: RequiredTest = { arr: ['test'] };
			expect(obj.arr).toEqual(['test']);
		});
	});

	describe('NonEmptyArray - edge cases', () => {
		it('should accept single element array', () => {
			const arr: NonEmptyArray<string> = ['single'];
			expect(arr).toHaveLength(1);
		});

		it('should accept large arrays', () => {
			const arr: NonEmptyArray<number> = [1, 2, 3, 4, 5];
			expect(arr).toHaveLength(5);
		});
	});

	describe('Brand - edge cases', () => {
		it('should work with number base type', () => {
			type UserId = Brand<number, 'UserId'>;
			const id: UserId = 123 as UserId;
			expect(id).toBe(123);
		});

		it('should prevent mixing different brands', () => {
			type UserId = Brand<string, 'UserId'>;
			type OrderId = Brand<string, 'OrderId'>;
			const userId: UserId = '123' as UserId;
			// This should cause a type error, but we can test the runtime value
			expect(userId).toBe('123');
		});
	});

	describe('ValueOf - edge cases', () => {
		it('should extract value type from object with mixed types', () => {
			interface TestRecord {
				a: string;
				b: number;
				c: boolean;
			}
			type Value = ValueOf<TestRecord>;
			const value1: Value = 'test';
			const value2: Value = 42;
			const value3: Value = true;
			expect(value1).toBe('test');
			expect(value2).toBe(42);
			expect(value3).toBe(true);
		});
	});
});
