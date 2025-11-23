/**
 * FormWizard.form Tests
 *
 * Tests for the useFormWizardForm helper function including:
 * - Initializing form controls with form options
 * - Initializing form controls without form options
 * - Verifying form controls are properly created
 */

import { useFormWizardForm } from '@core/ui/forms/form-wizard/helpers/FormWizard.form';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

interface TestFormData {
	name: string;
	email: string;
	age?: number;
}

describe('useFormWizardForm', () => {
	it('initializes form controls without form options', () => {
		const { result } = renderHook(() => useFormWizardForm<TestFormData>());

		expect(result.current).toBeDefined();
		expect(result.current.register).toBeDefined();
		expect(result.current.handleSubmit).toBeDefined();
		expect(result.current.reset).toBeDefined();
		expect(result.current.setValue).toBeDefined();
		expect(result.current.getValues).toBeDefined();
		expect(result.current.trigger).toBeDefined();
		expect(result.current.watch).toBeDefined();
		expect(result.current.control).toBeDefined();
		expect(typeof result.current.isValid).toBe('boolean');
		expect(typeof result.current.isDirty).toBe('boolean');
	});

	it('initializes form controls with form options', () => {
		const defaultValues: TestFormData = {
			name: 'John',
			email: 'john@example.com',
			age: 30,
		};

		const { result } = renderHook(() => useFormWizardForm<TestFormData>({ defaultValues }));

		expect(result.current).toBeDefined();
		expect(result.current.getValues()).toEqual(defaultValues);
	});

	it('initializes form controls with empty default values', () => {
		const defaultValues: TestFormData = {
			name: '',
			email: '',
		};

		const { result } = renderHook(() => useFormWizardForm<TestFormData>({ defaultValues }));

		expect(result.current).toBeDefined();
		const values = result.current.getValues();
		expect(values.name).toBe('');
		expect(values.email).toBe('');
	});

	it('initializes form controls with undefined form options', () => {
		const { result } = renderHook(() => useFormWizardForm<TestFormData>());

		expect(result.current).toBeDefined();
		expect(result.current.register).toBeDefined();
		expect(result.current.handleSubmit).toBeDefined();
	});

	it('returns form controls that can be used for form operations', () => {
		const { result } = renderHook(() => useFormWizardForm<TestFormData>());

		const formControls = result.current;

		// Verify all required methods exist
		expect(typeof formControls.register).toBe('function');
		expect(typeof formControls.handleSubmit).toBe('function');
		expect(typeof formControls.reset).toBe('function');
		expect(typeof formControls.setValue).toBe('function');
		expect(typeof formControls.getValues).toBe('function');
		expect(typeof formControls.trigger).toBe('function');
		expect(typeof formControls.watch).toBe('function');
		expect(typeof formControls.setError).toBe('function');
		expect(typeof formControls.clearErrors).toBe('function');
		expect(typeof formControls.unregister).toBe('function');
		expect(typeof formControls.setFocus).toBe('function');
		expect(typeof formControls.getFieldState).toBe('function');
	});

	it('initializes with mode option', () => {
		const { result } = renderHook(() => useFormWizardForm<TestFormData>({ mode: 'onChange' }));

		expect(result.current).toBeDefined();
		expect(result.current.control).toBeDefined();
	});

	it('initializes with reValidateMode option', () => {
		const { result } = renderHook(() =>
			useFormWizardForm<TestFormData>({ reValidateMode: 'onChange' })
		);

		expect(result.current).toBeDefined();
		expect(result.current.control).toBeDefined();
	});

	it('handles complex form data types', () => {
		interface ComplexFormData {
			user: {
				name: string;
				address: {
					street: string;
					city: string;
				};
			};
			tags: string[];
		}

		const defaultValues: ComplexFormData = {
			user: {
				name: 'John',
				address: {
					street: '123 Main St',
					city: 'New York',
				},
			},
			tags: ['tag1', 'tag2'],
		};

		const { result } = renderHook(() => useFormWizardForm<ComplexFormData>({ defaultValues }));

		expect(result.current).toBeDefined();
		expect(result.current.getValues()).toEqual(defaultValues);
	});
});
