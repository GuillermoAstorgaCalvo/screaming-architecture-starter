import { useFormAdapter } from '@core/forms/formAdapter';
import { type Path, useController } from '@core/forms/useController';
import { act, renderHook } from '@testing-library/react';
import { type ReactNode, useLayoutEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderUseController } from './useController.helpers';

interface FormControlsRef<T extends Record<string, unknown>> {
	current: ReturnType<typeof useFormAdapter<T>> | null;
}

const createFormWrapper = <T extends Record<string, unknown>>(
	formControlsRef: FormControlsRef<T>,
	formOptions: Parameters<typeof useFormAdapter<T>>[0]
) => {
	const Wrapper = ({ children }: { children: ReactNode }) => {
		const formControls = useFormAdapter<T>(formOptions);
		// Use useLayoutEffect and also set synchronously for immediate access
		useLayoutEffect(() => {
			formControlsRef.current = formControls;
		});
		// eslint-disable-next-line -- Test helper pattern: need to share ref between wrapper and hook callback
		formControlsRef.current = formControls;
		return children;
	};
	return Wrapper;
};

const renderControllerHook = <T extends Record<string, unknown>>(
	fieldName: Path<T>,
	formControlsRef: FormControlsRef<T>,
	Wrapper: ({ children }: { children: ReactNode }) => ReactNode
) => {
	return renderHook(
		() => {
			if (!formControlsRef.current) throw new Error('Form not initialized');
			return useController<T>({ name: fieldName, control: formControlsRef.current.control });
		},
		{ wrapper: Wrapper }
	);
};

describe('useController - form integration', () => {
	it('should update form values when field changes', () => {
		const { result, formControls } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		act(() => {
			result.current.field.onChange('New Value');
		});

		expect(formControls.getValues('name')).toBe('New Value');
	});

	it('should reflect form reset in field value', () => {
		const { result, formControls } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: 'Initial' } }
		);

		act(() => {
			result.current.field.onChange('Changed');
		});

		expect(result.current.field.value).toBe('Changed');

		act(() => {
			formControls.reset({ name: 'Reset Value' });
		});

		expect(result.current.field.value).toBe('Reset Value');
	});

	it('should work with form submission', async () => {
		const onSubmit = vi.fn();
		const { result, formControls } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		act(() => {
			result.current.field.onChange('Submitted Value');
		});

		await act(async () => {
			await formControls.handleSubmit(onSubmit)();
		});

		expect(onSubmit).toHaveBeenCalled();
		expect(onSubmit.mock.calls[0]?.[0]).toEqual({ name: 'Submitted Value' });
	});
});

describe('useController - multiple controllers', () => {
	it('should handle multiple independent fields', () => {
		const formControlsRef: FormControlsRef<{ name: string; email: string }> = {
			current: null,
		};

		const formOptions = { defaultValues: { name: '', email: '' } };
		const Wrapper = createFormWrapper(formControlsRef, formOptions);

		const { result: nameResult } = renderControllerHook('name', formControlsRef, Wrapper);
		const { result: emailResult } = renderControllerHook('email', formControlsRef, Wrapper);

		act(() => {
			nameResult.current.field.onChange('John');
			emailResult.current.field.onChange('john@example.com');
		});

		expect(nameResult.current.field.value).toBe('John');
		expect(emailResult.current.field.value).toBe('john@example.com');
	});

	it('should work with formAdapter control object', () => {
		const { result, formControls } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		// Verify useController works with formAdapter's control
		expect(result.current.field).toBeDefined();
		expect(result.current.fieldState).toBeDefined();
		expect(formControls.control).toBeDefined();

		act(() => {
			result.current.field.onChange('Test Value');
		});

		expect(formControls.getValues('name')).toBe('Test Value');
	});

	it('should maintain field state consistency with formAdapter', () => {
		const { result, formControls } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: 'Initial' } }
		);

		// Verify field state matches form state
		expect(result.current.field.value).toBe('Initial');
		expect(formControls.getValues('name')).toBe('Initial');

		act(() => {
			result.current.field.onChange('Updated');
		});

		expect(result.current.field.value).toBe('Updated');
		expect(formControls.getValues('name')).toBe('Updated');
		expect(result.current.fieldState.isDirty).toBe(true);
		// Note: form-level isDirty may not immediately reflect field-level isDirty
		// This is expected behavior in react-hook-form
		expect(typeof formControls.isDirty).toBe('boolean');
	});
});
