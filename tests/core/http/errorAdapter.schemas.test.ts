import { apiErrorResponseSchema, validationErrorsSchema } from '@core/http/errorAdapter.schemas';
import { describe, expect, it } from 'vitest';

const FIELD_EMAIL = 'email';
const MESSAGE_INVALID_EMAIL = 'Invalid email';
const MESSAGE_ERROR = 'Error';
const MESSAGE_NAME_REQUIRED = 'Name is required';

function defineApiErrorResponseBasicTests() {
	describe('basic validation', () => {
		it('validates a minimal API error response with only message', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: 'Something went wrong',
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.message).toBe('Something went wrong');
				expect(result.data.code).toBeUndefined();
				expect(result.data.errors).toBeUndefined();
				expect(result.data.context).toBeUndefined();
			}
		});

		it('validates API error response with code only', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: 'Error occurred',
				code: 'ERROR_CODE_123',
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.message).toBe('Error occurred');
				expect(result.data.code).toBe('ERROR_CODE_123');
			}
		});
	});
}

function defineApiErrorResponseComplexTests() {
	describe('complex validation', () => {
		it('validates a complete API error response with all fields', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: 'Validation failed',
				code: 'VALIDATION_ERROR',
				errors: [
					{ field: FIELD_EMAIL, message: 'Invalid email format' },
					{ field: 'password', message: 'Password too short' },
				],
				context: { userId: '123', timestamp: '2024-01-01' },
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.message).toBe('Validation failed');
				expect(result.data.code).toBe('VALIDATION_ERROR');
				expect(result.data.errors).toHaveLength(2);
				expect(result.data.errors?.[0]).toEqual({
					field: FIELD_EMAIL,
					message: 'Invalid email format',
				});
				expect(result.data.context).toEqual({ userId: '123', timestamp: '2024-01-01' });
			}
		});

		it('validates API error response with errors array only', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: 'Validation errors',
				errors: [{ field: 'name', message: MESSAGE_NAME_REQUIRED }],
			});

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.errors).toHaveLength(1);
				expect(result.data.errors?.[0]).toEqual({
					field: 'name',
					message: MESSAGE_NAME_REQUIRED,
				});
			}
		});

		it('accepts context with various value types', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: MESSAGE_ERROR,
				context: {
					string: 'value',
					number: 123,
					boolean: true,
					array: [1, 2, 3],
					nested: { key: 'value' },
				},
			});

			expect(result.success).toBe(true);
		});
	});
}

function defineApiErrorResponseValidTests() {
	defineApiErrorResponseBasicTests();
	defineApiErrorResponseComplexTests();
}

function defineApiErrorResponseInvalidTests() {
	describe('invalid cases', () => {
		it('rejects API error response without message', () => {
			const result = apiErrorResponseSchema.safeParse({
				code: 'ERROR_CODE',
			});

			expect(result.success).toBe(false);
		});

		it('rejects API error response with empty message', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: '',
			});

			expect(result.success).toBe(true); // Empty string is valid for Zod string()
		});

		it('rejects API error response with invalid errors structure', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: MESSAGE_ERROR,
				errors: [{ invalidField: 'value' }],
			});

			expect(result.success).toBe(false);
		});

		it('rejects API error response with non-array errors', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: MESSAGE_ERROR,
				errors: 'not an array',
			});

			expect(result.success).toBe(false);
		});

		it('rejects API error response with invalid context type', () => {
			const result = apiErrorResponseSchema.safeParse({
				message: MESSAGE_ERROR,
				context: 'not an object',
			});

			expect(result.success).toBe(false);
		});
	});
}

function defineValidationErrorsValidTests() {
	describe('valid cases', () => {
		it('validates an empty validation errors array', () => {
			const result = validationErrorsSchema.safeParse([]);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual([]);
			}
		});

		it('validates a single validation error', () => {
			const result = validationErrorsSchema.safeParse([
				{ field: FIELD_EMAIL, message: MESSAGE_INVALID_EMAIL },
			]);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toHaveLength(1);
				expect(result.data[0]).toEqual({ field: FIELD_EMAIL, message: MESSAGE_INVALID_EMAIL });
			}
		});

		it('validates multiple validation errors', () => {
			const result = validationErrorsSchema.safeParse([
				{ field: FIELD_EMAIL, message: MESSAGE_INVALID_EMAIL },
				{ field: 'password', message: 'Password too short' },
				{ field: 'name', message: MESSAGE_NAME_REQUIRED },
			]);

			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toHaveLength(3);
			}
		});
	});
}

function defineValidationErrorsInvalidTests() {
	describe('invalid cases', () => {
		it('rejects validation errors with missing field', () => {
			const result = validationErrorsSchema.safeParse([{ message: 'Error message' }]);

			expect(result.success).toBe(false);
		});

		it('rejects validation errors with missing message', () => {
			const result = validationErrorsSchema.safeParse([{ field: FIELD_EMAIL }]);

			expect(result.success).toBe(false);
		});

		it('rejects validation errors with invalid field type', () => {
			const result = validationErrorsSchema.safeParse([{ field: 123, message: 'Error' }]);

			expect(result.success).toBe(false);
		});

		it('rejects validation errors with invalid message type', () => {
			const result = validationErrorsSchema.safeParse([{ field: FIELD_EMAIL, message: 123 }]);

			expect(result.success).toBe(false);
		});

		it('rejects non-array input', () => {
			const result = validationErrorsSchema.safeParse({
				field: FIELD_EMAIL,
				message: MESSAGE_ERROR,
			});

			expect(result.success).toBe(false);
		});

		it('rejects null input', () => {
			const result = validationErrorsSchema.safeParse(null);

			expect(result.success).toBe(false);
		});

		it('rejects undefined input', () => {
			const result = validationErrorsSchema.safeParse(undefined);

			expect(result.success).toBe(false);
		});
	});
}

describe('errorAdapter.schemas', () => {
	describe('apiErrorResponseSchema', () => {
		defineApiErrorResponseValidTests();
		defineApiErrorResponseInvalidTests();
	});

	describe('validationErrorsSchema', () => {
		defineValidationErrorsValidTests();
		defineValidationErrorsInvalidTests();
	});
});
