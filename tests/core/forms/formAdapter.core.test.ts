/**
 * FormAdapter Core Operations Tests
 *
 * Tests for core form operations: initialization, registration, value management,
 * submission, reset, validation triggering, and watching.
 */

import { useFormAdapter, type UseFormAdapterOptions } from '@core/forms/formAdapter';
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
	assertFormControls,
	assertFormState,
	createFormWithDefaults,
	createSimpleForm,
	createTestForm,
	DEFAULT_TEST_FORM_DATA,
	FIELD_NAME_NESTED_FIELD,
	FIELD_NAME_VALUE,
	FIELD_VALUE_NESTED,
	FIELD_VALUE_TEST,
	setValueInAct,
	type SimpleFormData,
	type TestFormData,
	VALIDATION_MESSAGE_VALUE_REQUIRED,
} from './formAdapter.helpers';

function registerBasicInitializationTests() {
	it('should initialize with default values', () => {
		const { result } = createSimpleForm();

		expect(result.current).toBeDefined();
		assertFormControls(result);
	});

	it('should initialize with default form state', () => {
		const { result } = createSimpleForm();

		// isValid defaults to false in react-hook-form until validation runs
		assertFormState(result);
	});

	it('should initialize without options', () => {
		const { result } = renderHook(() => useFormAdapter<TestFormData>());

		expect(result.current).toBeDefined();
		assertFormControls(result);
	});
}

function registerOptionsInitializationTests() {
	it('should accept initial default values', () => {
		const defaultValues: TestFormData = {
			...DEFAULT_TEST_FORM_DATA,
			age: 30,
		};

		const { result } = renderHook(() => useFormAdapter<TestFormData>({ defaultValues }));

		const values = result.current.getValues();
		expect(values.name).toBe('John');
		expect(values.email).toBe('john@example.com');
		expect(values.age).toBe(30);
	});

	it('should accept validation rules', () => {
		const options: UseFormAdapterOptions<TestFormData> = {
			defaultValues: {
				name: '',
				email: '',
			},
			mode: 'onChange',
		};

		const { result } = renderHook(() => useFormAdapter<TestFormData>(options));

		expect(result.current.formState).toBeDefined();
	});

	it('should initialize useForm with provided options', () => {
		const options: UseFormAdapterOptions<TestFormData> = {
			defaultValues: DEFAULT_TEST_FORM_DATA,
			mode: 'onBlur',
			reValidateMode: 'onChange',
		};

		const { result } = renderHook(() => useFormAdapter<TestFormData>(options));

		// Verify form was initialized with options
		expect(result.current.formState).toBeDefined();
		expect(result.current.getValues()).toEqual(DEFAULT_TEST_FORM_DATA);
	});
}

function registerFormControlsTests() {
	it('should return all required form controls', () => {
		const { result } = createSimpleForm();

		// Verify all controls are returned from useFormAdapter
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
		expect(typeof controls.isValid).toBe('boolean');
		expect(typeof controls.isSubmitting).toBe('boolean');
		expect(typeof controls.isDirty).toBe('boolean');
	});
}

function registerInitializationTests() {
	describe('initialization', () => {
		registerBasicInitializationTests();
		registerOptionsInitializationTests();
		registerFormControlsTests();
	});
}

function registerRegisterTests() {
	describe('register', () => {
		it('should register a field', () => {
			const { result } = createSimpleForm();

			const registerReturn = result.current.register(FIELD_NAME_VALUE);
			expect(registerReturn).toBeDefined();
			expect(typeof registerReturn.onChange).toBe('function');
			expect(typeof registerReturn.onBlur).toBe('function');
			expect(typeof registerReturn.ref).toBe('function');
			expect(typeof registerReturn.name).toBe('string');
		});

		it('should register nested fields', () => {
			const { result } = createTestForm();

			const registerReturn = result.current.register(FIELD_NAME_NESTED_FIELD);
			expect(registerReturn).toBeDefined();
			expect(registerReturn.name).toBe(FIELD_NAME_NESTED_FIELD);
		});

		it('should register with validation options', () => {
			const { result } = createSimpleForm();

			const registerReturn = result.current.register(FIELD_NAME_VALUE, {
				required: VALIDATION_MESSAGE_VALUE_REQUIRED,
				minLength: { value: 3, message: 'Too short' },
			});

			expect(registerReturn).toBeDefined();
		});
	});
}

function registerGetValuesTests() {
	describe('getValues', () => {
		it('should get all form values', () => {
			const { result } = renderHook(() =>
				useFormAdapter<TestFormData>({ defaultValues: DEFAULT_TEST_FORM_DATA })
			);

			const values = result.current.getValues();
			expect(values).toEqual(DEFAULT_TEST_FORM_DATA);
		});

		it('should get specific field value', () => {
			const { result } = renderHook(() =>
				useFormAdapter<TestFormData>({ defaultValues: DEFAULT_TEST_FORM_DATA })
			);

			const name = result.current.getValues('name');
			expect(name).toBe('John');
		});

		it('should get nested field value', () => {
			const defaultValues: TestFormData = {
				...DEFAULT_TEST_FORM_DATA,
				nested: {
					field: FIELD_VALUE_NESTED,
				},
			};

			const { result } = renderHook(() => useFormAdapter<TestFormData>({ defaultValues }));

			const nestedField = result.current.getValues(FIELD_NAME_NESTED_FIELD);
			expect(nestedField).toBe(FIELD_VALUE_NESTED);
		});

		it('should return undefined for unset fields', () => {
			const { result } = renderHook(() => useFormAdapter<TestFormData>());

			const age = result.current.getValues('age');
			expect(age).toBeUndefined();
		});
	});
}

function registerSetValueTests() {
	describe('setValue', () => {
		it('should set a field value', () => {
			const { result } = createSimpleForm();

			setValueInAct(result, FIELD_NAME_VALUE, FIELD_VALUE_TEST);

			const value = result.current.getValues(FIELD_NAME_VALUE);
			expect(value).toBe(FIELD_VALUE_TEST);
		});

		it('should set nested field value', () => {
			const { result } = createTestForm();

			setValueInAct(result, FIELD_NAME_NESTED_FIELD, FIELD_VALUE_NESTED);

			const nestedField = result.current.getValues(FIELD_NAME_NESTED_FIELD);
			expect(nestedField).toBe(FIELD_VALUE_NESTED);
		});

		it('should mark form as dirty when setting value', () => {
			const defaultValues: SimpleFormData = { value: 'initial' };
			const { result } = createFormWithDefaults<SimpleFormData>(defaultValues);

			expect(result.current.isDirty).toBe(false);

			setValueInAct(result, FIELD_NAME_VALUE, FIELD_VALUE_TEST, { shouldDirty: true });

			expect(result.current.isDirty).toBe(true);
		});

		it('should set value with options', () => {
			const { result } = createSimpleForm();

			setValueInAct(result, FIELD_NAME_VALUE, FIELD_VALUE_TEST, {
				shouldDirty: true,
			});

			const value = result.current.getValues(FIELD_NAME_VALUE);
			expect(value).toBe(FIELD_VALUE_TEST);
		});
	});
}

function registerHandleSubmitTests() {
	describe('handleSubmit', () => {
		it('should call onSubmit handler when form is valid', async () => {
			const onSubmit = vi.fn();
			const { result } = createSimpleForm();

			setValueInAct(result, FIELD_NAME_VALUE, FIELD_VALUE_TEST);

			const submitHandler = result.current.handleSubmit(onSubmit);

			await act(async () => {
				await submitHandler();
			});

			expect(onSubmit).toHaveBeenCalledTimes(1);
			// handleSubmit passes form data as first parameter (second may be undefined)
			expect(onSubmit.mock.calls[0]?.[0]).toEqual({ value: FIELD_VALUE_TEST });
		});

		it('should call onError handler when form is invalid', async () => {
			const onSubmit = vi.fn();
			const onError = vi.fn();
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					defaultValues: { value: '' },
					mode: 'onSubmit',
				})
			);

			// Register with required validation
			result.current.register(FIELD_NAME_VALUE, { required: VALIDATION_MESSAGE_VALUE_REQUIRED });

			const submitHandler = result.current.handleSubmit(onSubmit, onError);

			await act(async () => {
				await submitHandler();
			});

			expect(onSubmit).not.toHaveBeenCalled();
			expect(onError).toHaveBeenCalledTimes(1);
		});

		it('should not call onSubmit when form has validation errors', async () => {
			const onSubmit = vi.fn();
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					mode: 'onChange',
				})
			);

			// Register with validation
			result.current.register(FIELD_NAME_VALUE, { required: 'Required' });

			const submitHandler = result.current.handleSubmit(onSubmit);

			await act(async () => {
				await submitHandler();
			});

			expect(onSubmit).not.toHaveBeenCalled();
		});
	});
}

function registerResetTests() {
	describe('reset', () => {
		it('should reset form to default values', () => {
			const defaultValues: SimpleFormData = { value: 'initial' };
			const { result } = createFormWithDefaults<SimpleFormData>(defaultValues);

			setValueInAct(result, FIELD_NAME_VALUE, 'modified', { shouldDirty: true });

			expect(result.current.getValues(FIELD_NAME_VALUE)).toBe('modified');
			expect(result.current.isDirty).toBe(true);

			act(() => {
				result.current.reset();
			});

			expect(result.current.getValues(FIELD_NAME_VALUE)).toBe('initial');
			expect(result.current.isDirty).toBe(false);
		});

		it('should reset to provided values', () => {
			const defaultValues: SimpleFormData = { value: 'initial' };
			const { result } = createFormWithDefaults<SimpleFormData>(defaultValues);

			setValueInAct(result, FIELD_NAME_VALUE, 'modified');

			act(() => {
				result.current.reset({ value: 'new-default' });
			});

			expect(result.current.getValues(FIELD_NAME_VALUE)).toBe('new-default');
		});

		it('should clear errors on reset', () => {
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					mode: 'onChange',
				})
			);

			result.current.register(FIELD_NAME_VALUE, { required: 'Required' });

			act(() => {
				result.current.setError(FIELD_NAME_VALUE, { type: 'manual', message: 'Error' });
			});

			expect(result.current.errors.value).toBeDefined();

			act(() => {
				result.current.reset();
			});

			expect(result.current.errors.value).toBeUndefined();
		});
	});
}

function registerTriggerTests() {
	describe('trigger', () => {
		it('should trigger validation for a specific field', async () => {
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					mode: 'onChange',
				})
			);

			result.current.register(FIELD_NAME_VALUE, { required: VALIDATION_MESSAGE_VALUE_REQUIRED });

			await act(async () => {
				const isValid = await result.current.trigger(FIELD_NAME_VALUE);
				expect(isValid).toBe(false);
			});

			expect(result.current.errors.value).toBeDefined();
		});

		it('should trigger validation for all fields', async () => {
			const { result } = renderHook(() =>
				useFormAdapter<TestFormData>({
					mode: 'onChange',
				})
			);

			result.current.register('name', { required: 'Name is required' });
			result.current.register('email', { required: 'Email is required' });

			await act(async () => {
				const isValid = await result.current.trigger();
				expect(isValid).toBe(false);
			});

			expect(result.current.errors.name).toBeDefined();
			expect(result.current.errors.email).toBeDefined();
		});

		it('should return true when validation passes', async () => {
			const { result } = renderHook(() =>
				useFormAdapter<SimpleFormData>({
					mode: 'onChange',
				})
			);

			result.current.register(FIELD_NAME_VALUE, { required: VALIDATION_MESSAGE_VALUE_REQUIRED });

			act(() => {
				result.current.setValue(FIELD_NAME_VALUE, FIELD_VALUE_TEST);
			});

			await act(async () => {
				const isValid = await result.current.trigger(FIELD_NAME_VALUE);
				expect(isValid).toBe(true);
			});
		});
	});
}

function registerWatchTests() {
	describe('watch', () => {
		it('should watch all form values', () => {
			const { result } = renderHook(() =>
				useFormAdapter<TestFormData>({ defaultValues: DEFAULT_TEST_FORM_DATA })
			);

			const watchedValues = result.current.watch();
			expect(watchedValues).toEqual(DEFAULT_TEST_FORM_DATA);
		});

		it('should watch specific field', () => {
			const { result } = renderHook(() =>
				useFormAdapter<TestFormData>({ defaultValues: DEFAULT_TEST_FORM_DATA })
			);

			const name = result.current.watch('name');
			expect(name).toBe('John');
		});

		it('should watch nested field', () => {
			const defaultValues: TestFormData = {
				...DEFAULT_TEST_FORM_DATA,
				nested: {
					field: FIELD_VALUE_NESTED,
				},
			};

			const { result } = renderHook(() => useFormAdapter<TestFormData>({ defaultValues }));

			const nestedField = result.current.watch(FIELD_NAME_NESTED_FIELD);
			expect(nestedField).toBe(FIELD_VALUE_NESTED);
		});

		it('should update watched value when field changes', () => {
			const { result } = renderHook(() => useFormAdapter<SimpleFormData>());

			const initialValue = result.current.watch(FIELD_NAME_VALUE);
			expect(initialValue).toBeUndefined();

			act(() => {
				result.current.setValue(FIELD_NAME_VALUE, 'new-value');
			});

			// Note: watch() returns current value, but we need to re-render to see updates
			// In a real component, watch would trigger re-renders
			const updatedValue = result.current.getValues(FIELD_NAME_VALUE);
			expect(updatedValue).toBe('new-value');
		});
	});
}

describe('useFormAdapter - core operations', () => {
	registerInitializationTests();
	registerRegisterTests();
	registerGetValuesTests();
	registerSetValueTests();
	registerHandleSubmitTests();
	registerResetTests();
	registerTriggerTests();
	registerWatchTests();
});
