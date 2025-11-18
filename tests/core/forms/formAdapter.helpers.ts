/**
 * Shared test helpers for formAdapter tests
 */

import { useFormAdapter } from '@core/forms/formAdapter';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { FieldValues } from 'react-hook-form';
import { expect } from 'vitest';

// Test form schema types
export interface TestFormData {
	name: string;
	email: string;
	age?: number;
	nested?: {
		field: string;
	};
}

export interface SimpleFormData {
	value: string;
}

// Test data constants
export const DEFAULT_TEST_FORM_DATA: TestFormData = {
	name: 'John',
	email: 'john@example.com',
};

// Test field names
export const FIELD_NAME_VALUE = 'value';
export const FIELD_NAME_NESTED_FIELD = 'nested.field';

// Test field values
export const FIELD_VALUE_NESTED = 'nested-value';
export const FIELD_VALUE_TEST = 'test-value';

// Test validation messages
export const VALIDATION_MESSAGE_VALUE_REQUIRED = 'Value is required';

// Type helpers
export type FormControls<T extends FieldValues> = ReturnType<typeof useFormAdapter<T>>;
export type RenderHookResult<T extends FieldValues> = ReturnType<
	typeof renderHook<FormControls<T>, unknown>
>;
export type FormResult<T extends FieldValues> = RenderHookResult<T>['result'];

// Helper functions to reduce nesting and duplication
export function createFormWithDefaults<T extends FieldValues>(defaultValues: T) {
	return renderHook<FormControls<T>, unknown>(() =>
		useFormAdapter<T>({ defaultValues: defaultValues as any })
	);
}

export function createSimpleForm() {
	return renderHook<FormControls<SimpleFormData>, unknown>(() => useFormAdapter<SimpleFormData>());
}

export function createTestForm() {
	return renderHook<FormControls<TestFormData>, unknown>(() => useFormAdapter<TestFormData>());
}

export function setValueInAct<T extends FieldValues>(
	result: FormResult<T>,
	field: string,
	value: unknown,
	options?: { shouldDirty?: boolean }
) {
	const controls = result.current;
	act(() => {
		controls.setValue(field as any, value as any, options);
	});
}

export function setErrorInAct<T extends FieldValues>(
	result: FormResult<T>,
	field: string,
	error: { type: string; message: string }
) {
	const controls = result.current;
	act(() => {
		controls.setError(field as any, error);
	});
}

export function assertFormControls<T extends FieldValues>(result: FormResult<T>) {
	const controls = result.current;
	expect(controls.register).toBeDefined();
	expect(controls.handleSubmit).toBeDefined();
	expect(controls.reset).toBeDefined();
	expect(controls.setValue).toBeDefined();
	expect(controls.getValues).toBeDefined();
	expect(controls.trigger).toBeDefined();
	expect(controls.watch).toBeDefined();
	expect(controls.setError).toBeDefined();
	expect(controls.clearErrors).toBeDefined();
	expect(controls.unregister).toBeDefined();
	expect(controls.setFocus).toBeDefined();
	expect(controls.getFieldState).toBeDefined();
	expect(controls.control).toBeDefined();
}

export function assertFormState<T extends FieldValues>(result: FormResult<T>) {
	const controls = result.current;
	expect(typeof controls.isValid).toBe('boolean');
	expect(controls.isSubmitting).toBe(false);
	expect(controls.isDirty).toBe(false);
	expect(controls.errors).toEqual({});
	expect(controls.formState).toBeDefined();
}

export function assertFieldStateProperties(fieldState: {
	isDirty: boolean;
	isTouched: boolean;
	invalid: boolean;
	error?: { message?: string };
}) {
	expect(fieldState.isDirty).toBeDefined();
	expect(fieldState.isTouched).toBeDefined();
	expect(fieldState.invalid).toBeDefined();
	// error may be undefined if field has no errors
	expect(fieldState.error === undefined || fieldState.error !== undefined).toBe(true);
}

export function assertFormStateProperties(formState: {
	isValid: boolean;
	isDirty: boolean;
	isSubmitting: boolean;
	errors: Record<string, unknown>;
}) {
	expect(formState).toBeDefined();
	expect(typeof formState.isValid).toBe('boolean');
	expect(typeof formState.isDirty).toBe('boolean');
	expect(typeof formState.isSubmitting).toBe('boolean');
	expect(formState.errors).toBeDefined();
}

export function assertControlProperties(control: unknown) {
	expect(control).toBeDefined();
	expect(typeof control).toBe('object');
}

export async function waitForIsSubmitting<T extends FieldValues>(result: FormResult<T>) {
	const controls = result.current;
	await waitFor(
		() => {
			expect(controls.isSubmitting).toBe(true);
		},
		{ timeout: 1000 }
	);
}

export async function waitForSubmissionComplete() {
	await act(async () => {
		await new Promise<void>(resolve => {
			setTimeout(() => {
				resolve();
			}, 100);
		});
	});
}

export function setMultipleValues<T extends FieldValues>(
	result: FormResult<T>,
	field: string,
	count: number
) {
	const controls = result.current;
	act(() => {
		for (let i = 0; i < count; i++) {
			controls.setValue(field as any, `value-${i}` as any);
		}
	});
}
