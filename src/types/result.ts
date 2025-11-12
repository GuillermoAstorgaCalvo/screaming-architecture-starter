/**
 * Result/Either type utilities
 *
 * Provides functional programming patterns for error handling using
 * Result/Either types instead of exceptions.
 */

/**
 * Result type representing success or failure
 * Similar to Rust's Result<T, E> or functional Either type
 */
export type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * Success variant of Result
 */
export interface Success<T> {
	readonly success: true;
	readonly data: T;
}

/**
 * Failure variant of Result
 */
export interface Failure<E> {
	readonly success: false;
	readonly error: E;
}

/**
 * Create a successful Result
 */
export function ok<T>(data: T): Success<T> {
	return { success: true, data };
}

/**
 * Create a failed Result
 */
export function err<E>(error: E): Failure<E> {
	return { success: false, error };
}

/**
 * Type guard to check if Result is success
 */
export function isSuccess<T, E>(result: Result<T, E>): result is Success<T> {
	return result.success;
}

/**
 * Type guard to check if Result is failure
 */
export function isFailure<T, E>(result: Result<T, E>): result is Failure<E> {
	return !result.success;
}

/**
 * Map over the success value
 */
export function mapResult<T, U, E>(result: Result<T, E>, fn: (data: T) => U): Result<U, E> {
	if (isSuccess(result)) {
		return ok(fn(result.data));
	}
	return result;
}

/**
 * Map over the error value
 */
export function mapError<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
	if (isFailure(result)) {
		return err(fn(result.error));
	}
	return result;
}

/**
 * Flat map (chain) over the success value
 */
export function flatMap<T, U, E>(
	result: Result<T, E>,
	fn: (data: T) => Result<U, E>
): Result<U, E> {
	if (isSuccess(result)) {
		return fn(result.data);
	}
	return result;
}

/**
 * Unwrap the value or throw if failure
 */
export function unwrap<T, E>(result: Result<T, E>): T {
	if (isSuccess(result)) {
		return result.data;
	}
	throw result.error;
}

/**
 * Unwrap the value or return default if failure
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
	if (isSuccess(result)) {
		return result.data;
	}
	return defaultValue;
}

/**
 * Unwrap the value or compute default from error
 */
export function unwrapOrElse<T, E>(result: Result<T, E>, fn: (error: E) => T): T {
	if (isSuccess(result)) {
		return result.data;
	}
	return fn(result.error);
}

/**
 * Convert a Promise to a Result
 */
export async function toResult<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return ok(data);
	} catch (error) {
		return err(error as E);
	}
}

/**
 * Combine multiple Results into one
 * Returns first failure or success with array of values
 */
export function combineResults<T, E>(results: Result<T, E>[]): Result<T[], E> {
	const values: T[] = [];
	for (const result of results) {
		if (isFailure(result)) {
			return result;
		}
		values.push(result.data);
	}
	return ok(values);
}
