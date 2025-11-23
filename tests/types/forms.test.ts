import type {
	FormData,
	FormFieldType,
	FormFieldValue,
	FormResetOptions,
	FormSubmissionState,
	FormValidationError,
} from '@src-types/forms';
import { describe, expect, it } from 'vitest';

describe('forms types', () => {
	const INVALID_EMAIL_MESSAGE = 'Invalid email format';
	const TEST_EMAIL = 'john@example.com';

	describe('FormFieldType', () => {
		it('should accept all form field types', () => {
			const types: FormFieldType[] = [
				'text',
				'email',
				'password',
				'number',
				'tel',
				'url',
				'search',
				'date',
				'datetime-local',
				'time',
				'month',
				'week',
				'color',
				'file',
				'checkbox',
				'radio',
				'textarea',
				'select',
			];
			expect(types).toHaveLength(18);
		});
	});

	describe('FormValidationError', () => {
		it('should allow FormValidationError with all properties', () => {
			const error: FormValidationError = {
				field: 'email',
				message: INVALID_EMAIL_MESSAGE,
				type: 'validation',
			};
			expect(error.field).toBe('email');
			expect(error.message).toBe(INVALID_EMAIL_MESSAGE);
			expect(error.type).toBe('validation');
		});

		it('should allow FormValidationError without type', () => {
			const error: FormValidationError = {
				field: 'email',
				message: INVALID_EMAIL_MESSAGE,
			};
			expect(error.field).toBe('email');
			expect(error.message).toBe(INVALID_EMAIL_MESSAGE);
		});
	});

	describe('FormSubmissionState', () => {
		it('should allow FormSubmissionState with all properties', () => {
			const state: FormSubmissionState = {
				isSubmitting: true,
				isSuccess: false,
				isError: false,
				error: null,
			};
			expect(state.isSubmitting).toBe(true);
			expect(state.isSuccess).toBe(false);
			expect(state.isError).toBe(false);
			expect(state.error).toBeNull();
		});

		it('should allow FormSubmissionState with error', () => {
			const state: FormSubmissionState = {
				isSubmitting: false,
				isSuccess: false,
				isError: true,
				error: 'Submission failed',
			};
			expect(state.isSubmitting).toBe(false);
			expect(state.isSuccess).toBe(false);
			expect(state.isError).toBe(true);
			expect(state.error).toBe('Submission failed');
		});
	});

	describe('FormData', () => {
		it('should allow FormData with generic type', () => {
			interface UserForm extends Record<string, unknown> {
				name: string;
				email: string;
				age: number;
			}
			const TEST_NAME = 'John Doe';
			const formData: FormData<UserForm> = {
				name: TEST_NAME,
				email: TEST_EMAIL,
				age: 30,
			};
			expect(formData.name).toBe(TEST_NAME);
			expect(formData.email).toBe(TEST_EMAIL);
			expect(formData.age).toBe(30);
		});

		it('should allow FormData with default type', () => {
			const formData: FormData = {
				field1: 'value1',
				field2: 42,
			};
			expect(formData.field1).toBe('value1');
			expect(formData.field2).toBe(42);
		});
	});

	describe('FormFieldValue', () => {
		it('should accept string value', () => {
			const value: FormFieldValue = 'test';
			expect(value).toBe('test');
		});

		it('should accept number value', () => {
			const value: FormFieldValue = 42;
			expect(value).toBe(42);
		});

		it('should accept boolean value', () => {
			const value: FormFieldValue = true;
			expect(value).toBe(true);
		});

		it('should accept File value', () => {
			const TEXT_PLAIN_TYPE = 'text/plain';
			const file = new File(['content'], 'test.txt', { type: TEXT_PLAIN_TYPE });
			const value: FormFieldValue = file;
			expect(value).toBeInstanceOf(File);
		});

		it('should accept File array value', () => {
			const TEXT_PLAIN_TYPE = 'text/plain';
			const files = [
				new File(['content1'], 'test1.txt', { type: TEXT_PLAIN_TYPE }),
				new File(['content2'], 'test2.txt', { type: TEXT_PLAIN_TYPE }),
			];
			const value: FormFieldValue = files;
			expect(value).toHaveLength(2);
		});

		it('should accept null value', () => {
			const value: FormFieldValue = null;
			expect(value).toBeNull();
		});

		it('should accept undefined value', () => {
			const value: FormFieldValue = undefined;
			expect(value).toBeUndefined();
		});
	});

	describe('FormResetOptions', () => {
		it('should allow FormResetOptions with all properties', () => {
			interface UserForm {
				name: string;
				email: string;
			}
			const options: FormResetOptions<UserForm> = {
				values: { name: 'John', email: TEST_EMAIL },
				keepErrors: true,
				keepDirty: false,
				keepValues: false,
				keepDefaultValues: true,
			};
			expect(options.values).toBeDefined();
			expect(options.keepErrors).toBe(true);
			expect(options.keepDirty).toBe(false);
			expect(options.keepValues).toBe(false);
			expect(options.keepDefaultValues).toBe(true);
		});

		it('should allow FormResetOptions without optional properties', () => {
			interface UserForm {
				name: string;
				email: string;
			}
			const options: FormResetOptions<UserForm> = {};
			expect(options).toBeDefined();
		});
	});
});
