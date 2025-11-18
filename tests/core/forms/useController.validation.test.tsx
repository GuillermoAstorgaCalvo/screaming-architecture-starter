import { zodResolver } from '@hookform/resolvers/zod';
import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import {
	EMAIL_ERROR_MESSAGE,
	MIN_LENGTH_ERROR_MESSAGE,
	renderUseController,
} from './useController.helpers';

// Helper functions
function createEmailSchema() {
	return z.object({
		email: z.email({ message: EMAIL_ERROR_MESSAGE }),
	});
}

function createNameSchema() {
	return z.object({
		name: z.string().min(3, MIN_LENGTH_ERROR_MESSAGE),
	});
}

async function triggerValidation(
	formControls: { trigger: (field: string) => Promise<boolean> },
	fieldName: string
) {
	await act(async () => {
		await (formControls.trigger as (field: string) => Promise<boolean>)(fieldName);
	});
}

async function waitForAsync() {
	await act(async () => {
		await Promise.resolve();
	});
}

function setupEmailController() {
	const schema = createEmailSchema();
	return renderUseController<{ email: string }>(
		{ name: 'email' },
		{
			resolver: zodResolver(schema),
			defaultValues: { email: '' },
			mode: 'onChange',
		}
	);
}

function setupNameController(mode: 'onChange' | 'onBlur' = 'onChange') {
	const schema = createNameSchema();
	return renderUseController<{ name: string }>(
		{ name: 'name' },
		{
			resolver: zodResolver(schema),
			defaultValues: { name: '' },
			mode,
		}
	);
}

describe('useController - validation integration', () => {
	describe('error display', () => {
		it('should show validation error when field is invalid', async () => {
			const { result, formControls } = setupEmailController();

			act(() => {
				result.current.field.onChange('invalid-email');
			});

			await triggerValidation(formControls as any, 'email');

			expect(result.current.fieldState.invalid).toBe(true);
			expect(result.current.fieldState.error?.message).toBe(EMAIL_ERROR_MESSAGE);
		});
	});

	describe('error clearing', () => {
		it('should clear validation error when field becomes valid', async () => {
			const { result, formControls } = setupEmailController();

			act(() => {
				result.current.field.onChange('invalid-email');
			});

			await triggerValidation(formControls as any, 'email');
			expect(result.current.fieldState.invalid).toBe(true);

			act(() => {
				result.current.field.onChange('valid@example.com');
			});

			await triggerValidation(formControls as any, 'email');

			expect(result.current.fieldState.invalid).toBe(false);
			expect(result.current.fieldState.error).toBeUndefined();
		});
	});

	describe('validation modes', () => {
		it('should validate on blur when mode is onBlur', async () => {
			const { result } = setupNameController('onBlur');

			act(() => {
				result.current.field.onChange('ab');
			});

			expect(result.current.fieldState.invalid).toBe(false);

			act(() => {
				result.current.field.onBlur();
			});

			await waitForAsync();

			expect(result.current.fieldState.invalid).toBe(true);
			expect(result.current.fieldState.error?.message).toBe(MIN_LENGTH_ERROR_MESSAGE);
		});

		it('should validate on change when mode is onChange', async () => {
			const { result } = setupNameController('onChange');

			act(() => {
				result.current.field.onChange('ab');
			});

			await waitForAsync();

			expect(result.current.fieldState.invalid).toBe(true);
			expect(result.current.fieldState.error?.message).toBe(MIN_LENGTH_ERROR_MESSAGE);
		});
	});
});
