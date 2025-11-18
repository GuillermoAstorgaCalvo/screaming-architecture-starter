import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
	INVALID_CODE_MESSAGE,
	MIN_LENGTH_ERROR_MESSAGE,
	renderUseController,
} from './useController.helpers';

/**
 * Helper function to create a secret code validator
 */
function createSecretCodeValidator() {
	return (value: string) => {
		if (value !== 'SECRET') {
			return INVALID_CODE_MESSAGE;
		}
		return true;
	};
}

/**
 * Helper function to trigger validation
 */
async function triggerValidation<T extends Record<string, unknown>>(
	formControls: ReturnType<typeof renderUseController<T>>['formControls'],
	fieldName: string
) {
	await act(async () => {
		await (formControls.trigger as (field: string) => Promise<boolean>)(fieldName);
	});
}

/**
 * Helper function to trigger validation and assert invalid state
 */
async function triggerAndAssertInvalid<T extends Record<string, unknown>>(
	formControls: ReturnType<typeof renderUseController<T>>['formControls'],
	fieldName: string,
	expectedMessage: string,
	result: ReturnType<typeof renderUseController<T>>['result']
) {
	await triggerValidation(formControls, fieldName);

	expect(result.current.fieldState.invalid).toBe(true);
	expect(result.current.fieldState.error?.message).toBe(expectedMessage);
}

/**
 * Helper function to change field value and trigger validation
 */
async function changeValueAndTrigger<T extends Record<string, unknown>>(
	field: { onChange: (value: string) => void },
	value: string,
	formControls: ReturnType<typeof renderUseController<T>>['formControls'],
	fieldName: string
) {
	act(() => {
		field.onChange(value);
	});

	await triggerValidation(formControls, fieldName);
}

/**
 * Helper to test required rule validation
 */
async function testRequiredRule() {
	const { result, formControls } = renderUseController<{ name: string }>(
		{
			name: 'name',
			rules: { required: 'Name is required' },
		},
		{ defaultValues: { name: '' } }
	);

	await triggerAndAssertInvalid(formControls, 'name', 'Name is required', result);
}

/**
 * Helper to test minLength rule validation
 */
async function testMinLengthRule() {
	const { result, formControls } = renderUseController<{ name: string }>(
		{
			name: 'name',
			rules: { minLength: { value: 3, message: MIN_LENGTH_ERROR_MESSAGE } },
		},
		{ defaultValues: { name: '' } }
	);

	await changeValueAndTrigger(result.current.field, 'ab', formControls, 'name');

	expect(result.current.fieldState.invalid).toBe(true);
	expect(result.current.fieldState.error?.message).toBe(MIN_LENGTH_ERROR_MESSAGE);
}

/**
 * Helper to test custom validation - invalid case
 */
async function testCustomValidationInvalid() {
	const { result, formControls } = renderUseController<{ code: string }>(
		{
			name: 'code',
			rules: {
				validate: createSecretCodeValidator(),
			},
		},
		{ defaultValues: { code: '' } }
	);

	await changeValueAndTrigger(result.current.field, 'WRONG', formControls, 'code');

	expect(result.current.fieldState.invalid).toBe(true);
	expect(result.current.fieldState.error?.message).toBe(INVALID_CODE_MESSAGE);
}

/**
 * Helper to test custom validation - valid case
 */
async function testCustomValidationValid() {
	const { result, formControls } = renderUseController<{ code: string }>(
		{
			name: 'code',
			rules: {
				validate: createSecretCodeValidator(),
			},
		},
		{ defaultValues: { code: '' } }
	);

	await changeValueAndTrigger(result.current.field, 'SECRET', formControls, 'code');

	expect(result.current.fieldState.invalid).toBe(false);
}

describe('useController - rules and validation', () => {
	describe('built-in rules', () => {
		it('should respect required rule', testRequiredRule);

		it('should respect minLength rule', testMinLengthRule);
	});

	describe('custom validation', () => {
		it('should respect custom validation function - invalid case', testCustomValidationInvalid);

		it('should respect custom validation function - valid case', testCustomValidationValid);
	});
});
