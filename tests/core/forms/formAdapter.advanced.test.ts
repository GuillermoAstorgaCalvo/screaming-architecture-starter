/**
 * FormAdapter Advanced Features Tests
 *
 * Tests for advanced features: unregister, setFocus, getFieldState,
 * form state properties, control object, integration, and edge cases.
 */

import { useFormAdapter } from '@core/forms/formAdapter';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
	assertControlProperties,
	assertFieldStateProperties,
	assertFormControls,
	assertFormStateProperties,
	createFormWithDefaults,
	createSimpleForm,
	createTestForm,
	setErrorInAct,
	setMultipleValues,
	setValueInAct,
	type SimpleFormData,
	type TestFormData,
	waitForIsSubmitting,
	waitForSubmissionComplete,
} from './formAdapter.helpers';

const NESTED_FIELD = 'nested.field';

function setFocusInAct(result: { current: { setFocus: (field: string) => void } }, field: string) {
	act(() => {
		(result.current as any).setFocus(field);
	});
}

function createDelayedSubmitHandler(delay = 50) {
	return vi.fn().mockImplementation(
		() =>
			new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, delay);
			})
	);
}

function registerUnregisterTests() {
	describe('unregister', () => {
		it('should unregister a field', () => {
			const { result } = createSimpleForm();

			result.current.register('value');
			setValueInAct(result, 'value', 'test');

			act(() => {
				result.current.unregister('value');
			});

			// Unregistered field should not be in values
			const values = result.current.getValues();
			expect(values.value).toBeUndefined();
		});

		it('should unregister nested field', () => {
			const { result } = createTestForm();

			result.current.register(NESTED_FIELD);
			setValueInAct(result, NESTED_FIELD, 'test');

			act(() => {
				result.current.unregister(NESTED_FIELD);
			});

			const nestedField = result.current.getValues(NESTED_FIELD);
			expect(nestedField).toBeUndefined();
		});
	});
}

function registerSetFocusTests() {
	describe('setFocus', () => {
		it('should focus a field', () => {
			const { result } = createSimpleForm();

			// setFocus doesn't throw when called
			expect(() => {
				setFocusInAct(result as any, 'value');
			}).not.toThrow();
		});

		it('should focus nested field', () => {
			const { result } = createTestForm();

			expect(() => {
				setFocusInAct(result as any, NESTED_FIELD);
			}).not.toThrow();
		});
	});
}

function registerGetFieldStateTests() {
	describe('getFieldState', () => {
		it('should get field state', () => {
			const { result } = createSimpleForm();

			const fieldState = result.current.getFieldState('value');
			expect(fieldState).toBeDefined();
			assertFieldStateProperties(fieldState);
		});

		it('should get field state for nested field', () => {
			const { result } = createTestForm();

			const fieldState = result.current.getFieldState(NESTED_FIELD);
			expect(fieldState).toBeDefined();
		});

		it('should reflect dirty state', () => {
			const defaultValues: SimpleFormData = { value: 'initial' };
			const { result } = createFormWithDefaults<SimpleFormData>(defaultValues);

			const initialState = result.current.getFieldState('value');
			expect(initialState.isDirty).toBe(false);

			setValueInAct(result, 'value', 'test', { shouldDirty: true });

			const updatedState = result.current.getFieldState('value');
			expect(updatedState.isDirty).toBe(true);
		});
	});
}

function registerFormStateValidationTests() {
	describe('form state properties - validation states', () => {
		it('should track isValid state', async () => {
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					mode: 'onChange',
				})
			);

			// isValid starts as false until validation runs
			expect(typeof result.current.isValid).toBe('boolean');

			result.current.register('value', { required: 'Required' });

			await act(async () => {
				await result.current.trigger('value');
			});

			expect(result.current.isValid).toBe(false);
		});

		it('should track isSubmitting state', async () => {
			const onSubmit = createDelayedSubmitHandler();
			const { result } = createSimpleForm();

			setValueInAct(result, 'value', 'test');

			const submitHandler = result.current.handleSubmit(onSubmit);

			// Start submission (fire and forget to check isSubmitting)
			act(() => {
				submitHandler();
			});

			// Check isSubmitting during submission
			await waitForIsSubmitting(result);

			// Wait for submission to complete
			await waitForSubmissionComplete();

			// Should be false after submission
			expect(result.current.isSubmitting).toBe(false);
		});
	});
}

function registerFormStateDirtyAndErrorsTests() {
	describe('form state properties - dirty and errors', () => {
		it('should track isDirty state', () => {
			const defaultValues: SimpleFormData = { value: 'initial' };
			const { result } = createFormWithDefaults<SimpleFormData>(defaultValues);

			expect(result.current.isDirty).toBe(false);

			setValueInAct(result, 'value', 'modified', { shouldDirty: true });

			expect(result.current.isDirty).toBe(true);
		});

		it('should expose errors object', () => {
			const { result } = createSimpleForm();

			// Register field first
			result.current.register('value');

			setErrorInAct(result, 'value', {
				type: 'manual',
				message: 'Test error',
			});

			expect(result.current.errors).toBeDefined();
			expect(result.current.errors.value).toBeDefined();
			expect(result.current.errors.value?.message).toBe('Test error');
		});
	});
}

function registerFormStateObjectTests() {
	describe('form state properties - formState object', () => {
		it('should expose full formState object', () => {
			const { result } = createSimpleForm();

			const { formState } = result.current;
			assertFormStateProperties(formState);
		});
	});
}

function registerFormStatePropertiesTests() {
	registerFormStateValidationTests();
	registerFormStateDirtyAndErrorsTests();
	registerFormStateObjectTests();
}

function registerControlTests() {
	describe('control', () => {
		it('should expose control object', () => {
			const { result } = createSimpleForm();

			const { control } = result.current;
			assertControlProperties(control);
		});

		it('should be usable with Controller component', () => {
			const { result } = createSimpleForm();

			// Control should be compatible with react-hook-form's Controller
			const { control } = result.current;
			assertControlProperties(control);
		});

		it('should provide control with correct structure for useController', () => {
			const { result } = createSimpleForm();

			const { control } = result.current;
			// Control should have the necessary properties for useController
			expect(control).toBeDefined();
			expect(typeof control).toBe('object');
			// Control should be compatible with react-hook-form's useController
			expect(control).toHaveProperty('_subjects');
		});
	});
}

function registerIntegrationValidationSchemaTests() {
	describe('integration with react-hook-form - validation schema', () => {
		it('should work with validation schema', async () => {
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					mode: 'onChange',
				})
			);

			const registerReturn = result.current.register('value', {
				required: 'Value is required',
				minLength: { value: 3, message: 'Too short' },
			});

			expect(registerReturn).toBeDefined();

			// Set invalid value
			act(() => {
				result.current.setValue('value', 'ab');
			});

			await act(async () => {
				await result.current.trigger('value');
			});

			expect(result.current.errors.value).toBeDefined();
			expect(result.current.errors.value?.message).toBe('Too short');
		});
	});
}

function registerIntegrationAsyncValidationTests() {
	describe('integration with react-hook-form - async validation', () => {
		it('should handle async validation', async () => {
			const asyncValidator = vi.fn().mockResolvedValue(true);
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					mode: 'onChange',
				})
			);

			const registerReturn = result.current.register('value', {
				validate: async value => {
					await asyncValidator();
					return value === 'valid' || 'Invalid value';
				},
			});

			expect(registerReturn).toBeDefined();

			act(() => {
				result.current.setValue('value', 'invalid');
			});

			await act(async () => {
				await result.current.trigger('value');
			});

			expect(result.current.errors.value).toBeDefined();
			expect(asyncValidator).toHaveBeenCalled();
		});
	});
}

function registerIntegrationFormModeTests() {
	describe('integration with react-hook-form - form modes', () => {
		it('should handle form mode configurations', () => {
			const { result: onChangeResult } = renderHook(() =>
				useFormAdapter<SimpleFormData>({ mode: 'onChange' })
			);

			const { result: onSubmitResult } = renderHook(() =>
				useFormAdapter<SimpleFormData>({ mode: 'onSubmit' })
			);

			const { result: onBlurResult } = renderHook(() =>
				useFormAdapter<SimpleFormData>({ mode: 'onBlur' })
			);

			expect(onChangeResult.current.formState).toBeDefined();
			expect(onSubmitResult.current.formState).toBeDefined();
			expect(onBlurResult.current.formState).toBeDefined();
			expect(typeof onChangeResult.current.formState.isValid).toBe('boolean');
			expect(typeof onSubmitResult.current.formState.isValid).toBe('boolean');
			expect(typeof onBlurResult.current.formState.isValid).toBe('boolean');
		});
	});
}

function registerIntegrationTests() {
	registerIntegrationValidationSchemaTests();
	registerIntegrationAsyncValidationTests();
	registerIntegrationFormModeTests();
}

function registerEdgeCasesTests() {
	describe('edge cases', () => {
		it('should handle empty form data', () => {
			const { result } = renderHook(() => useFormAdapter<Record<string, never>>());

			const values = result.current.getValues();
			expect(values).toEqual({});
		});

		it('should handle optional fields', () => {
			const { result } = renderHook(() => useFormAdapter<TestFormData>());

			const age = result.current.getValues('age');
			expect(age).toBeUndefined();

			act(() => {
				result.current.setValue('age', 25);
			});

			expect(result.current.getValues('age')).toBe(25);
		});

		it('should handle rapid value changes', () => {
			const { result } = createSimpleForm();

			setMultipleValues(result, 'value', 10);

			expect(result.current.getValues('value')).toBe('value-9');
		});

		it('should maintain function references across renders', () => {
			const { result, rerender } = renderHook(() => useFormAdapter<SimpleFormData>());

			const initialRegister = result.current.register;
			const initialHandleSubmit = result.current.handleSubmit;
			const initialReset = result.current.reset;

			rerender();

			// Functions should be stable (from react-hook-form)
			expect(result.current.register).toBe(initialRegister);
			expect(result.current.handleSubmit).toBe(initialHandleSubmit);
			expect(result.current.reset).toBe(initialReset);
		});

		it('should return object with all expected properties', () => {
			const { result } = createSimpleForm();

			// Verify the return object structure matches FormControls interface
			const controls = result.current;
			expect(controls).toHaveProperty('register');
			expect(controls).toHaveProperty('handleSubmit');
			expect(controls).toHaveProperty('reset');
			expect(controls).toHaveProperty('setValue');
			expect(controls).toHaveProperty('getValues');
			expect(controls).toHaveProperty('trigger');
			expect(controls).toHaveProperty('formState');
			expect(controls).toHaveProperty('errors');
			expect(controls).toHaveProperty('watch');
			expect(controls).toHaveProperty('setError');
			expect(controls).toHaveProperty('clearErrors');
			expect(controls).toHaveProperty('unregister');
			expect(controls).toHaveProperty('setFocus');
			expect(controls).toHaveProperty('getFieldState');
			expect(controls).toHaveProperty('control');
			expect(controls).toHaveProperty('isValid');
			expect(controls).toHaveProperty('isSubmitting');
			expect(controls).toHaveProperty('isDirty');
		});

		it('should handle undefined options parameter', () => {
			const { result } = renderHook(() => useFormAdapter<SimpleFormData>());

			expect(result.current).toBeDefined();
			assertFormControls(result);
		});
	});
}

describe('useFormAdapter - advanced features', () => {
	registerUnregisterTests();
	registerSetFocusTests();
	registerGetFieldStateTests();
	registerFormStatePropertiesTests();
	registerControlTests();
	registerIntegrationTests();
	registerEdgeCasesTests();
});
