import {
	combineResults,
	err,
	type Failure,
	flatMap,
	isFailure,
	isSuccess,
	mapError,
	mapResult,
	ok,
	type Result,
	type Success,
	toResult,
	unwrap,
	unwrapOr,
	unwrapOrElse,
} from '@src-types/result';
import { describe, expect, it } from 'vitest';

describe('result types', () => {
	const TEST_VALUE = 'test';
	const ERROR_VALUE = 'error';
	const DEFAULT_VALUE = 'default';
	const UNWRAP_SUCCESS_DESC = 'should unwrap success value';

	describe('ok', () => {
		it('should create a success result', () => {
			const result = ok(TEST_VALUE);
			expect(result.success).toBe(true);
			expect(result.data).toBe(TEST_VALUE);
		});

		it('should create a success result with number', () => {
			const result = ok(42);
			expect(result.success).toBe(true);
			expect(result.data).toBe(42);
		});

		it('should create a success result with object', () => {
			const data = { name: 'test', value: 42 };
			const result = ok(data);
			expect(result.success).toBe(true);
			expect(result.data).toEqual(data);
		});
	});

	describe('err', () => {
		it('should create a failure result', () => {
			const error = new Error('test error');
			const result = err(error);
			expect(result.success).toBe(false);
			expect(result.error).toBe(error);
		});

		it('should create a failure result with string', () => {
			const result = err('error message');
			expect(result.success).toBe(false);
			expect(result.error).toBe('error message');
		});
	});

	describe('isSuccess', () => {
		it('should return true for success result', () => {
			const result = ok(TEST_VALUE);
			expect(isSuccess(result)).toBe(true);
		});

		it('should return false for failure result', () => {
			const result = err(ERROR_VALUE);
			expect(isSuccess(result)).toBe(false);
		});

		it('should narrow type to Success', () => {
			const result: Result<string, Error> = ok(TEST_VALUE);
			if (isSuccess(result)) {
				// TypeScript should know result is Success<string>
				expect(result.data).toBe(TEST_VALUE);
			}
		});
	});

	describe('isFailure', () => {
		it('should return true for failure result', () => {
			const result = err('error');
			expect(isFailure(result)).toBe(true);
		});

		it('should return false for success result', () => {
			const result = ok(TEST_VALUE);
			expect(isFailure(result)).toBe(false);
		});

		it('should narrow type to Failure', () => {
			const result: Result<string, Error> = err(new Error('error'));
			if (isFailure(result)) {
				// TypeScript should know result is Failure<Error>
				expect(result.error).toBeInstanceOf(Error);
			}
		});
	});

	describe('mapResult', () => {
		it('should map success value', () => {
			const result = ok(5);
			const mapped = mapResult(result, x => x * 2);
			expect(isSuccess(mapped)).toBe(true);
			if (isSuccess(mapped)) {
				expect(mapped.data).toBe(10);
			}
		});

		it('should not map failure value', () => {
			const result = err('error');
			const mapped = mapResult(result, (x: string) => x.toUpperCase());
			expect(isFailure(mapped)).toBe(true);
			if (isFailure(mapped)) {
				expect(mapped.error).toBe('error');
			}
		});

		it('should preserve error type when mapping success', () => {
			const result: Result<number, string> = ok(5);
			const mapped = mapResult(result, x => x.toString());
			expect(isSuccess(mapped)).toBe(true);
		});
	});

	describe('mapError', () => {
		it('should map error value', () => {
			const result = err('error');
			const mapped = mapError(result, e => new Error(e));
			expect(isFailure(mapped)).toBe(true);
			if (isFailure(mapped)) {
				expect(mapped.error).toBeInstanceOf(Error);
			}
		});

		it('should not map success value', () => {
			const result = ok(TEST_VALUE);
			const mapped = mapError(result, (e: string) => new Error(e));
			expect(isSuccess(mapped)).toBe(true);
			if (isSuccess(mapped)) {
				expect(mapped.data).toBe(TEST_VALUE);
			}
		});
	});

	describe('flatMap', () => {
		it('should chain success results', () => {
			const result = ok(5);
			const chained = flatMap(result, x => ok(x * 2));
			expect(isSuccess(chained)).toBe(true);
			if (isSuccess(chained)) {
				expect(chained.data).toBe(10);
			}
		});

		it('should propagate failure in chain', () => {
			const result = ok(5);
			const chained = flatMap(result, () => err('chain error'));
			expect(isFailure(chained)).toBe(true);
			if (isFailure(chained)) {
				expect(chained.error).toBe('chain error');
			}
		});

		it('should not chain failure results', () => {
			const result = err('initial error');
			const chained = flatMap(result, (x: number) => ok(x * 2));
			expect(isFailure(chained)).toBe(true);
			if (isFailure(chained)) {
				expect(chained.error).toBe('initial error');
			}
		});
	});

	describe('unwrap', () => {
		it(UNWRAP_SUCCESS_DESC, () => {
			const result = ok(TEST_VALUE);
			const value = unwrap(result);
			expect(value).toBe(TEST_VALUE);
		});

		it('should throw on failure', () => {
			const result = err(ERROR_VALUE);
			expect(() => unwrap(result)).toThrow(ERROR_VALUE);
		});
	});

	describe('unwrapOr', () => {
		it(UNWRAP_SUCCESS_DESC, () => {
			const result = ok(TEST_VALUE);
			const value = unwrapOr(result, DEFAULT_VALUE);
			expect(value).toBe(TEST_VALUE);
		});

		it('should return default on failure', () => {
			const result = err(ERROR_VALUE);
			const value = unwrapOr(result, DEFAULT_VALUE);
			expect(value).toBe(DEFAULT_VALUE);
		});
	});

	describe('unwrapOrElse', () => {
		it(UNWRAP_SUCCESS_DESC, () => {
			const result = ok(TEST_VALUE);
			const value = unwrapOrElse(result, () => DEFAULT_VALUE);
			expect(value).toBe(TEST_VALUE);
		});

		it('should compute default from error', () => {
			const result = err(ERROR_VALUE);
			const value = unwrapOrElse(result, e => `default from ${e}`);
			expect(value).toBe(`default from ${ERROR_VALUE}`);
		});
	});

	describe('toResult', () => {
		it('should convert successful promise to success result', async () => {
			const promise = Promise.resolve(TEST_VALUE);
			const result = await toResult(promise);
			expect(isSuccess(result)).toBe(true);
			if (isSuccess(result)) {
				expect(result.data).toBe(TEST_VALUE);
			}
		});

		it('should convert failed promise to failure result', async () => {
			const promise = Promise.reject(new Error('test error'));
			const result = await toResult(promise);
			expect(isFailure(result)).toBe(true);
			if (isFailure(result)) {
				expect(result.error).toBeInstanceOf(Error);
			}
		});

		it('should convert failed promise with string error', async () => {
			const promise = Promise.reject(new Error('string error'));
			const result = await toResult<string>(promise);
			expect(isFailure(result)).toBe(true);
			if (isFailure(result)) {
				expect(result.error).toBeInstanceOf(Error);
				expect(result.error.message).toBe('string error');
			}
		});
	});

	describe('combineResults', () => {
		it('should combine all success results', () => {
			const results = [ok(1), ok(2), ok(3)];
			const combined = combineResults(results);
			expect(isSuccess(combined)).toBe(true);
			if (isSuccess(combined)) {
				expect(combined.data).toEqual([1, 2, 3]);
			}
		});

		it('should return first failure', () => {
			const results = [ok(1), err(ERROR_VALUE), ok(3)];
			const combined = combineResults(results);
			expect(isFailure(combined)).toBe(true);
			if (isFailure(combined)) {
				expect(combined.error).toBe(ERROR_VALUE);
			}
		});

		it('should return first failure even if later results fail', () => {
			const results = [ok(1), err('first error'), err('second error')];
			const combined = combineResults(results);
			expect(isFailure(combined)).toBe(true);
			if (isFailure(combined)) {
				expect(combined.error).toBe('first error');
			}
		});

		it('should return success with empty array for empty input', () => {
			const results: Result<number, string>[] = [];
			const combined = combineResults(results);
			expect(isSuccess(combined)).toBe(true);
			if (isSuccess(combined)) {
				expect(combined.data).toEqual([]);
			}
		});
	});

	describe('type definitions', () => {
		it('should allow Success type', () => {
			const success: Success<string> = { success: true, data: TEST_VALUE };
			expect(success.success).toBe(true);
			expect(success.data).toBe(TEST_VALUE);
		});

		it('should allow Failure type', () => {
			const failure: Failure<string> = { success: false, error: ERROR_VALUE };
			expect(failure.success).toBe(false);
			expect(failure.error).toBe(ERROR_VALUE);
		});

		it('should allow Result union type', () => {
			const success: Result<string, Error> = ok(TEST_VALUE);
			const failure: Result<string, Error> = err(new Error(ERROR_VALUE));
			expect(success.success).toBe(true);
			expect(failure.success).toBe(false);
		});
	});
});
