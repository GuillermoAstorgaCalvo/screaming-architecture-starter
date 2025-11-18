import { useFormAdapter } from '@core/forms/formAdapter';
import { useController } from '@core/forms/useController';
import { act, renderHook } from '@testing-library/react';
import { type ReactNode, useLayoutEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { renderUseController } from './useController.helpers';

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
		const formControlsRef = {
			current: null as ReturnType<typeof useFormAdapter<{ name: string; email: string }>> | null,
		};

		const Wrapper = ({ children }: { children: ReactNode }) => {
			const formControls = useFormAdapter<{ name: string; email: string }>({
				defaultValues: { name: '', email: '' },
			});
			// Use useLayoutEffect and also set synchronously for immediate access
			useLayoutEffect(() => {
				formControlsRef.current = formControls;
			});
			// eslint-disable-next-line -- Test helper pattern: need to share ref between wrapper and hook callback
			formControlsRef.current = formControls;
			return children;
		};

		const { result: nameResult } = renderHook(
			() => {
				if (!formControlsRef.current) throw new Error('Form not initialized');
				return useController({ name: 'name', control: formControlsRef.current.control });
			},
			{ wrapper: Wrapper }
		);

		const { result: emailResult } = renderHook(
			() => {
				if (!formControlsRef.current) throw new Error('Form not initialized');
				return useController({ name: 'email', control: formControlsRef.current.control });
			},
			{ wrapper: Wrapper }
		);

		act(() => {
			nameResult.current.field.onChange('John');
			emailResult.current.field.onChange('john@example.com');
		});

		expect(nameResult.current.field.value).toBe('John');
		expect(emailResult.current.field.value).toBe('john@example.com');
	});
});
