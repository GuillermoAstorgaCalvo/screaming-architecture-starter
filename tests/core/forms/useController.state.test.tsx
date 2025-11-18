import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderUseController } from './useController.helpers';

describe('useController - field state management', () => {
	it('should provide fieldState with error, invalid, isDirty, isTouched', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		const { fieldState } = result.current;

		expect(fieldState).toHaveProperty('error');
		expect(fieldState).toHaveProperty('invalid');
		expect(fieldState).toHaveProperty('isDirty');
		expect(fieldState).toHaveProperty('isTouched');
	});

	it('should track isDirty state when value changes from default', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: 'Initial' } }
		);

		expect(result.current.fieldState.isDirty).toBe(false);

		act(() => {
			result.current.field.onChange('Changed');
		});

		expect(result.current.fieldState.isDirty).toBe(true);
	});

	it('should reset isDirty when value returns to default', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: 'Initial' } }
		);

		act(() => {
			result.current.field.onChange('Changed');
		});
		expect(result.current.fieldState.isDirty).toBe(true);

		act(() => {
			result.current.field.onChange('Initial');
		});
		expect(result.current.fieldState.isDirty).toBe(false);
	});

	it('should track isTouched state after onBlur', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		expect(result.current.fieldState.isTouched).toBe(false);

		act(() => {
			result.current.field.onBlur();
		});

		expect(result.current.fieldState.isTouched).toBe(true);
	});
});
