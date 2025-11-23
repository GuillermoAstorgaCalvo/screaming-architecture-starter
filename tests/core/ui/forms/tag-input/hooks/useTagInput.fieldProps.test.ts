/**
 * buildTagInputFieldProps Tests
 *
 * Tests for the buildTagInputFieldProps function:
 * - Field props building
 * - State integration
 * - Props merging
 */

import { buildTagInputFieldProps } from '@core/ui/forms/tag-input/hooks/useTagInput.fieldProps';
import type {
	TagInputFieldProps,
	UseTagInputStateReturn,
} from '@core/ui/forms/tag-input/types/TagInputTypes';
import type { InputHTMLAttributes } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('buildTagInputFieldProps', () => {
	it('should be a function', () => {
		expect(typeof buildTagInputFieldProps).toBe('function');
	});

	it('builds complete field props object', () => {
		const state: UseTagInputStateReturn = {
			finalId: 'test-input',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: 'test-classes',
		};

		const result = buildTagInputFieldProps({
			state,
			disabled: undefined,
			required: undefined,
			tags: ['tag1'],
			onRemoveTag: vi.fn(),
			chipSize: 'sm',
			chipVariant: 'default',
			value: 'test value',
			onChange: vi.fn(),
			onKeyDown: undefined,
			placeholder: 'Add tags',
			maxTags: undefined,
			rest: {},
		});

		expect(result).toHaveProperty('id', 'test-input');
		expect(result).toHaveProperty('className', 'test-classes');
		expect(result).toHaveProperty('hasError', false);
		expect(result).toHaveProperty('ariaDescribedBy', undefined);
		expect(result).toHaveProperty('disabled', undefined);
		expect(result).toHaveProperty('required', undefined);
		expect(result).toHaveProperty('tags', ['tag1']);
		expect(result).toHaveProperty('chipSize', 'sm');
		expect(result).toHaveProperty('chipVariant', 'default');
		expect(result).toHaveProperty('value', 'test value');
		expect(result).toHaveProperty('placeholder', 'Add tags');
		expect(result).toHaveProperty('maxTags', undefined);
	});

	it('includes all state properties', () => {
		const state: UseTagInputStateReturn = {
			finalId: 'custom-id',
			hasError: true,
			ariaDescribedBy: 'custom-id-error',
			inputClasses: 'error-classes',
		};

		const result = buildTagInputFieldProps({
			state,
			disabled: true,
			required: true,
			tags: [],
			onRemoveTag: vi.fn(),
			chipSize: 'lg',
			chipVariant: 'primary',
			value: '',
			onChange: vi.fn(),
			onKeyDown: vi.fn(),
			placeholder: undefined,
			maxTags: 5,
			rest: {},
		});

		expect(result.id).toBe('custom-id');
		expect(result.className).toBe('error-classes');
		expect(result.hasError).toBe(true);
		expect(result.ariaDescribedBy).toBe('custom-id-error');
	});

	it('includes all field-specific props', () => {
		const state: UseTagInputStateReturn = {
			finalId: 'test-input',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: '',
		};

		const onRemoveTag = vi.fn();
		const onChange = vi.fn();
		const onKeyDown = vi.fn();

		const result = buildTagInputFieldProps({
			state,
			disabled: false,
			required: false,
			tags: ['tag1', 'tag2'],
			onRemoveTag,
			chipSize: 'md',
			chipVariant: 'success',
			value: 'input value',
			onChange,
			onKeyDown,
			placeholder: 'Placeholder',
			maxTags: 10,
			rest: {},
		});

		expect(result.disabled).toBe(false);
		expect(result.required).toBe(false);
		expect(result.tags).toEqual(['tag1', 'tag2']);
		expect(result.onRemoveTag).toBe(onRemoveTag);
		expect(result.chipSize).toBe('md');
		expect(result.chipVariant).toBe('success');
		expect(result.value).toBe('input value');
		expect(result.onChange).toBe(onChange);
		expect(result.onKeyDown).toBe(onKeyDown);
		expect(result.placeholder).toBe('Placeholder');
		expect(result.maxTags).toBe(10);
	});

	it('includes rest props', () => {
		const state: UseTagInputStateReturn = {
			finalId: 'test-input',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: '',
		};

		const rest: Readonly<
			Omit<
				InputHTMLAttributes<HTMLInputElement>,
				| 'size'
				| 'id'
				| 'className'
				| 'disabled'
				| 'required'
				| 'aria-invalid'
				| 'aria-describedby'
				| 'value'
				| 'onChange'
				| 'onKeyDown'
				| 'placeholder'
			>
		> = {
			autoFocus: true,
			'data-testid': 'tag-input',
		} as any;

		const result = buildTagInputFieldProps({
			state,
			disabled: undefined,
			required: undefined,
			tags: [],
			onRemoveTag: vi.fn(),
			chipSize: undefined,
			chipVariant: undefined,
			value: '',
			onChange: vi.fn(),
			onKeyDown: undefined,
			placeholder: undefined,
			maxTags: undefined,
			rest,
		});

		expect(result.props).toEqual(rest);
		expect(result.props.autoFocus).toBe(true);
		expect((result.props as any)['data-testid']).toBe('tag-input');
	});

	it('handles undefined optional props', () => {
		const state: UseTagInputStateReturn = {
			finalId: undefined,
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: '',
		};

		const result = buildTagInputFieldProps({
			state,
			disabled: undefined,
			required: undefined,
			tags: [],
			onRemoveTag: vi.fn(),
			chipSize: undefined,
			chipVariant: undefined,
			value: '',
			onChange: vi.fn(),
			onKeyDown: undefined,
			placeholder: undefined,
			maxTags: undefined,
			rest: {},
		});

		expect(result.id).toBeUndefined();
		expect(result.disabled).toBeUndefined();
		expect(result.required).toBeUndefined();
		expect(result.chipSize).toBeUndefined();
		expect(result.chipVariant).toBeUndefined();
		expect(result.onKeyDown).toBeUndefined();
		expect(result.placeholder).toBeUndefined();
		expect(result.maxTags).toBeUndefined();
	});

	it('returns readonly TagInputFieldProps', () => {
		const state: UseTagInputStateReturn = {
			finalId: 'test-input',
			hasError: false,
			ariaDescribedBy: undefined,
			inputClasses: '',
		};

		const result = buildTagInputFieldProps({
			state,
			disabled: undefined,
			required: undefined,
			tags: [],
			onRemoveTag: vi.fn(),
			chipSize: undefined,
			chipVariant: undefined,
			value: '',
			onChange: vi.fn(),
			onKeyDown: undefined,
			placeholder: undefined,
			maxTags: undefined,
			rest: {},
		});

		// Type check - should be TagInputFieldProps
		const _typeCheck: TagInputFieldProps = result;
		expect(_typeCheck).toBeDefined();
	});
});
