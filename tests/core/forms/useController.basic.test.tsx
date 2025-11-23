import { useController } from '@core/forms/useController';
import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderUseController } from './useController.helpers';

describe('useController - hook exports and imports', () => {
	it('should export useController hook', () => {
		expect(typeof useController).toBe('function');
	});

	it('should be importable from @core/forms/useController', () => {
		expect(useController).toBeDefined();
	});

	it('should be callable as a hook', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		expect(result.current).toBeDefined();
		expect(result.current.field).toBeDefined();
		expect(result.current.fieldState).toBeDefined();
	});

	it('should return consistent hook interface', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		expect(result.current).toHaveProperty('field');
		expect(result.current).toHaveProperty('fieldState');
		expect(result.current).toHaveProperty('formState');
	});
});

describe('useController - field initialization', () => {
	it('should initialize with default value', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: 'John Doe' } }
		);

		expect(result.current.field.value).toBe('John Doe');
	});

	it('should initialize with undefined when no default value provided', () => {
		const { result } = renderUseController<{ name: string }>({ name: 'name' });

		expect(result.current.field.value).toBeUndefined();
	});
});

describe('useController - field object structure', () => {
	it('should provide field object with value, onChange, and onBlur', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		const { field } = result.current;

		expect(field).toHaveProperty('value');
		expect(field).toHaveProperty('onChange');
		expect(field).toHaveProperty('onBlur');
		expect(field).toHaveProperty('name', 'name');
		expect(field).toHaveProperty('ref');
		expect(typeof field.onChange).toBe('function');
		expect(typeof field.onBlur).toBe('function');
	});
});

describe('useController - value updates', () => {
	it('should update field value when onChange is called', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		expect(result.current.field.value).toBe('');

		act(() => {
			result.current.field.onChange('Jane Doe');
		});

		expect(result.current.field.value).toBe('Jane Doe');
	});

	it('should handle multiple value changes', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		act(() => {
			result.current.field.onChange('John');
		});
		expect(result.current.field.value).toBe('John');

		act(() => {
			result.current.field.onChange('Jane');
		});
		expect(result.current.field.value).toBe('Jane');

		act(() => {
			result.current.field.onChange('Bob');
		});
		expect(result.current.field.value).toBe('Bob');
	});
});

describe('useController - event handling', () => {
	it('should handle onBlur event', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		act(() => {
			result.current.field.onBlur();
		});

		expect(result.current.field.onBlur).toBeDefined();
	});
});
