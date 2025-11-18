import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderUseController } from './useController.helpers';

describe('useController - edge cases', () => {
	it('should handle empty string values', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: 'Initial' } }
		);

		act(() => {
			result.current.field.onChange('');
		});

		expect(result.current.field.value).toBe('');
	});

	it('should handle null values', () => {
		const { result } = renderUseController<{ value: string | null }>(
			{ name: 'value' },
			{ defaultValues: { value: null } }
		);

		act(() => {
			result.current.field.onChange(null);
		});

		expect(result.current.field.value).toBeNull();
	});

	it('should handle undefined values', () => {
		const { result } = renderUseController<{ value?: string }>(
			{ name: 'value' },
			{ defaultValues: {} }
		);

		act(() => {
			result.current.field.onChange(undefined);
		});

		expect(result.current.field.value).toBeUndefined();
	});

	it('should maintain field reference stability', () => {
		const { result, rerender } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		const firstField = result.current.field;

		rerender();

		const secondField = result.current.field;

		expect(firstField).toBe(secondField);
	});
});
