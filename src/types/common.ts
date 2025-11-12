/**
 * Common utility types used across the application
 *
 * Provides reusable type utilities and helpers that don't belong to
 * specific domains or feature areas.
 */

/**
 * Make specific properties optional in a type
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make specific properties required in a type
 * Note: Renamed from Required to avoid conflict with TypeScript's built-in Required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Make all properties deep partial
 */
export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

/**
 * Make all properties deep required
 */
export type DeepRequired<T> = T extends object
	? {
			[P in keyof T]-?: DeepRequired<T[P]>;
		}
	: T;

/**
 * Extract the value type from a Record or object type
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extract keys of type T that have values of type V
 */
export type KeysOfType<T, V> = {
	[K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

/**
 * A function that returns void
 */
export type VoidFunction = () => void;

/**
 * A function that accepts any arguments and returns void
 */
export type VoidFunctionAnyArgs = (...args: unknown[]) => void;

/**
 * A function type that accepts no arguments
 */
export type NoArgFunction<T> = () => T;

/**
 * A function type that accepts one argument
 */
export type UnaryFunction<T, R> = (arg: T) => R;

/**
 * A function type that accepts two arguments
 */
export type BinaryFunction<T, U, R> = (arg1: T, arg2: U) => R;

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = [T, ...T[]];

/**
 * Primitive types
 */
export type Primitive = string | number | boolean | null | undefined;

/**
 * Object with string keys
 */
export type StringRecord<T = unknown> = Record<string, T>;

/**
 * Object with number keys
 */
export type NumberRecord<T = unknown> = Record<number, T>;

/**
 * A type that can be undefined
 */
export type Maybe<T> = T | undefined;

/**
 * A type that can be null or undefined
 */
export type MaybeNull<T> = T | null | undefined;

/**
 * Branded type helper for nominal typing
 */
export type Brand<T, B> = T & { __brand: B };

/**
 * Timestamp in milliseconds
 */
export type Timestamp = Brand<number, 'Timestamp'>;

/**
 * ID type (typically string or number)
 */
export type ID = string | number;

/**
 * UUID type (branded string)
 */
export type UUID = Brand<string, 'UUID'>;

/**
 * Extract the return type of a function
 */
export type ReturnType<T extends (...args: unknown[]) => unknown> = T extends (
	...args: unknown[]
) => infer R
	? R
	: never;

/**
 * Extract the parameters of a function as a tuple
 */
export type Parameters<T extends (...args: unknown[]) => unknown> = T extends (
	...args: infer P
) => unknown
	? P
	: never;

/**
 * Extract the first parameter of a function
 */
export type FirstParameter<T extends (...args: unknown[]) => unknown> = Parameters<T>[0];

/**
 * Extract the second parameter of a function
 */
export type SecondParameter<T extends (...args: unknown[]) => unknown> = Parameters<T>[1];

/**
 * Extract the last parameter of a function
 */
export type LastParameter<T extends (...args: unknown[]) => unknown> =
	Parameters<T> extends []
		? never
		: Parameters<T> extends [...unknown[], infer Last]
			? Last
			: never;

/**
 * Awaited type helper (extracts the resolved type from a Promise)
 * Similar to TypeScript's built-in Awaited but more explicit
 */
export type Awaited<T> = T extends Promise<infer U> ? Awaited<U> : T;

/**
 * Make readonly properties mutable
 */
export type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

/**
 * Extract only function properties from a type
 */
export type FunctionProperties<T> = {
	[K in keyof T as T[K] extends (...args: unknown[]) => unknown ? K : never]: T[K];
};

/**
 * Extract only non-function properties from a type
 */
export type NonFunctionProperties<T> = {
	[K in keyof T as T[K] extends (...args: unknown[]) => unknown ? never : K]: T[K];
};

/**
 * Array element type
 */
export type ArrayElement<T extends readonly unknown[]> = T extends readonly (infer U)[] ? U : never;

/**
 * Tuple to union
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number];

/**
 * Union to intersection
 */
export type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
	x: infer I
) => void
	? I
	: never;

/**
 * Extract only string keys from a type
 */
export type StringKeys<T> = Extract<keyof T, string>;

/**
 * Extract only number keys from a type
 */
export type NumberKeys<T> = Extract<keyof T, number>;

/**
 * Extract only symbol keys from a type
 */
export type SymbolKeys<T> = Extract<keyof T, symbol>;

/**
 * Make all properties nullable (deep transformation)
 * Note: For a single value that can be null, use `MaybeNull<T>` instead
 */
export type NullableProperties<T> = {
	[P in keyof T]: T[P] | null;
};

/**
 * Make all properties optional and nullable
 */
export type OptionalNullable<T> = {
	[P in keyof T]?: T[P] | null;
};

/**
 * Extract property type from object type
 */
export type PropType<T, K extends keyof T> = T[K];

/**
 * Recursive readonly
 */
export type DeepReadonly<T> = T extends (...args: unknown[]) => unknown
	? T
	: T extends object
		? {
				readonly [P in keyof T]: DeepReadonly<T[P]>;
			}
		: T;

/**
 * Recursive mutable (opposite of DeepReadonly)
 */
export type DeepMutable<T> = T extends (...args: unknown[]) => unknown
	? T
	: T extends object
		? {
				-readonly [P in keyof T]: DeepMutable<T[P]>;
			}
		: T;

/**
 * Record with string keys and values of type T
 * (alias for Record<string, T> but more explicit)
 */
export type StringKeyRecord<T> = Record<string, T>;

/**
 * Record with number keys and values of type T
 */
export type NumberKeyRecord<T> = Record<number, T>;

/**
 * Exclude null and undefined from a type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

/**
 * Extract the type from a Promise, null, or undefined
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapNullable<T> = T extends null | undefined ? never : T;
export type UnwrapMaybe<T> = T extends undefined ? never : T;

/**
 * Type assertion helper (for type narrowing)
 */
export type AssertType<T, Expected> = T extends Expected ? T : never;

/**
 * Check if type is exactly another type
 */
export type IsEqual<T, U> =
	(<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? true : false;
