/**
 * Callback function types
 *
 * Types for callback functions and other function-related utilities
 * used across the application.
 */

/**
 * Generic async callback function
 */
export type AsyncCallback<TArgs extends unknown[] = [], TReturn = void> = (
	...args: TArgs
) => Promise<TReturn>;

/**
 * Generic sync callback function
 */
export type SyncCallback<TArgs extends unknown[] = [], TReturn = void> = (
	...args: TArgs
) => TReturn;

/**
 * Generic callback function (sync or async)
 */
export type Callback<TArgs extends unknown[] = [], TReturn = void> =
	| AsyncCallback<TArgs, TReturn>
	| SyncCallback<TArgs, TReturn>;

/**
 * No-argument callback function
 */
export type NoArgsCallback<T = void> = () => T;

/**
 * Single-argument callback function
 */
export type SingleArgCallback<TArg, TReturn = void> = (arg: TArg) => TReturn;

/**
 * Two-argument callback function
 */
export type TwoArgCallback<TArg1, TArg2, TReturn = void> = (arg1: TArg1, arg2: TArg2) => TReturn;

/**
 * Optional callback function
 */
export type OptionalCallback<TArgs extends unknown[] = [], TReturn = void> =
	| Callback<TArgs, TReturn>
	| undefined;

/**
 * Nullable callback function
 */
export type NullableCallback<TArgs extends unknown[] = [], TReturn = void> = Callback<
	TArgs,
	TReturn
> | null;

/**
 * Maybe callback function (undefined or null)
 */
export type MaybeCallback<TArgs extends unknown[] = [], TReturn = void> =
	| Callback<TArgs, TReturn>
	| null
	| undefined;

/**
 * Callback with error handling
 */
export type ErrorHandlingCallback<TArgs extends unknown[] = [], TReturn = void> = (
	...args: TArgs
) => TReturn | Promise<TReturn>;

/**
 * Success callback (called on successful operation)
 */
export type SuccessCallback<T = void> = (data: T) => void;

/**
 * Error callback (called on failed operation)
 */
export type ErrorCallback<TError = Error> = (error: TError) => void;

/**
 * Complete callback (called after operation completes, success or error)
 */
export type CompleteCallback = () => void;

/**
 * Transform callback (maps one value to another)
 */
export type TransformCallback<TInput, TOutput> = (input: TInput) => TOutput;

/**
 * Predicate callback (returns boolean)
 */
export type PredicateCallback<T = unknown> = (value: T) => boolean;

/**
 * Filter callback (used in filter operations)
 */
export type FilterCallback<T> = PredicateCallback<T>;

/**
 * Map callback (used in map operations)
 */
export type MapCallback<TInput, TOutput> = TransformCallback<TInput, TOutput>;

/**
 * Reduce callback
 */
export type ReduceCallback<T, TAccumulator> = (
	accumulator: TAccumulator,
	currentValue: T,
	currentIndex?: number,
	array?: T[]
) => TAccumulator;

/**
 * Comparator callback (used in sort operations)
 * Returns negative if a < b, positive if a > b, 0 if a === b
 */
export type ComparatorCallback<T> = (a: T, b: T) => number;
