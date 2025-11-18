import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderUseController } from './useController.helpers';

describe('useController - primitive types', () => {
	it('should handle string fields', () => {
		const { result } = renderUseController<{ name: string }>(
			{ name: 'name' },
			{ defaultValues: { name: '' } }
		);

		act(() => {
			result.current.field.onChange('Test String');
		});

		expect(result.current.field.value).toBe('Test String');
		expect(typeof result.current.field.value).toBe('string');
	});

	it('should handle number fields', () => {
		const { result } = renderUseController<{ age: number }>(
			{ name: 'age' },
			{ defaultValues: { age: 0 } }
		);

		act(() => {
			result.current.field.onChange(25);
		});

		expect(result.current.field.value).toBe(25);
		expect(typeof result.current.field.value).toBe('number');
	});

	it('should handle boolean fields', () => {
		const { result } = renderUseController<{ active: boolean }>(
			{ name: 'active' },
			{ defaultValues: { active: false } }
		);

		act(() => {
			result.current.field.onChange(true);
		});

		expect(result.current.field.value).toBe(true);
		expect(typeof result.current.field.value).toBe('boolean');
	});
});

describe('useController - complex types', () => {
	it('should handle nested object fields', () => {
		type FormData = Record<string, unknown> & {
			user: {
				name: string;
				email: string;
			};
		};

		const { result } = renderUseController<FormData>(
			{ name: 'user.name' },
			{ defaultValues: { user: { name: '', email: '' } } }
		);

		act(() => {
			result.current.field.onChange('John Doe');
		});

		expect(result.current.field.value).toBe('John Doe');
	});

	it('should handle array fields', () => {
		const { result } = renderUseController<{ tags: string[] }>(
			{ name: 'tags' },
			{ defaultValues: { tags: [] } }
		);

		act(() => {
			result.current.field.onChange(['tag1', 'tag2']);
		});

		expect(result.current.field.value).toEqual(['tag1', 'tag2']);
		expect(Array.isArray(result.current.field.value)).toBe(true);
	});
});
