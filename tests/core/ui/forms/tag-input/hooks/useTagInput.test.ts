/**
 * useTagInputProps Tests
 *
 * Tests for the useTagInputProps hook:
 * - Props extraction
 * - State computation
 * - Field props building
 * - Integration
 */

import { useTagInputProps } from '@core/ui/forms/tag-input/hooks/useTagInput';
import type { TagInputProps } from '@src-types/ui/forms-inputs';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('useTagInputProps', () => {
	it('should be a function', () => {
		expect(typeof useTagInputProps).toBe('function');
	});

	it('returns all expected properties', () => {
		const props: TagInputProps = {};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});

	it('extracts form props correctly', () => {
		const props: TagInputProps = {
			label: 'Tags',
			error: 'Error message',
			helperText: 'Helper text',
			size: 'lg',
			fullWidth: true,
			required: true,
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.label).toBe('Tags');
		expect(result.current.error).toBe('Error message');
		expect(result.current.helperText).toBe('Helper text');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('computes state correctly', () => {
		const props: TagInputProps = {
			label: 'Tags',
			error: 'Error',
			helperText: 'Helper',
			size: 'md',
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.finalId).toBeTruthy();
		expect(result.current.state.ariaDescribedBy).toBeTruthy();
		expect(result.current.state.inputClasses).toBeTruthy();
	});

	it('builds field props correctly', () => {
		const props: TagInputProps = {
			tags: ['tag1', 'tag2'],
			chipSize: 'sm',
			chipVariant: 'primary',
			placeholder: 'Add tags',
			maxTags: 5,
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.fieldProps.tags).toEqual(['tag1', 'tag2']);
		expect(result.current.fieldProps.chipSize).toBe('sm');
		expect(result.current.fieldProps.chipVariant).toBe('primary');
		expect(result.current.fieldProps.placeholder).toBe('Add tags');
		expect(result.current.fieldProps.maxTags).toBe(5);
	});

	it('handles controlled tags', () => {
		const props: TagInputProps = {
			tags: ['controlled1', 'controlled2'],
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.fieldProps.tags).toEqual(['controlled1', 'controlled2']);
	});

	it('handles uncontrolled tags', () => {
		const props: TagInputProps = {
			defaultTags: ['default1', 'default2'],
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.fieldProps.tags).toEqual(['default1', 'default2']);
	});

	it('handles controlled input value', () => {
		const props: TagInputProps = {
			value: 'controlled value',
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('controlled value');
	});

	it('handles uncontrolled input value', () => {
		const props: TagInputProps = {
			defaultValue: 'default value',
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('default value');
	});

	it('provides working handlers', () => {
		const onChange = vi.fn();
		const props: TagInputProps = {
			onChange,
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(typeof result.current.fieldProps.onChange).toBe('function');
		expect(typeof result.current.fieldProps.onRemoveTag).toBe('function');
		expect(typeof result.current.fieldProps.onKeyDown).toBe('function');
	});

	it('handles all props together', () => {
		const onChange = vi.fn();
		const onValueChange = vi.fn();
		const props: TagInputProps = {
			label: 'Tags',
			error: 'Error',
			helperText: 'Helper',
			size: 'lg',
			fullWidth: true,
			tagInputId: 'custom-id',
			className: 'custom-class',
			disabled: true,
			required: true,
			value: 'value',
			defaultValue: 'default',
			onChange,
			onValueChange,
			tags: ['tag1'],
			defaultTags: ['default1'],
			chipSize: 'sm',
			chipVariant: 'success',
			placeholder: 'Add',
			maxTags: 10,
			separator: ',',
			allowDuplicates: true,
		};

		const { result } = renderHook(() => useTagInputProps({ props }));

		expect(result.current.label).toBe('Tags');
		expect(result.current.error).toBe('Error');
		expect(result.current.helperText).toBe('Helper');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
		expect(result.current.state.finalId).toBe('custom-id');
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.tags).toEqual(['tag1']);
		expect(result.current.fieldProps.chipSize).toBe('sm');
		expect(result.current.fieldProps.chipVariant).toBe('success');
		expect(result.current.fieldProps.placeholder).toBe('Add');
		expect(result.current.fieldProps.maxTags).toBe(10);
	});
});
