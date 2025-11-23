/**
 * useTagInputProps Tests
 *
 * Tests for props extraction functions:
 * - extractTagInputProps
 * - extractFormProps
 * - extractInputValueProps
 * - extractTagProps
 * - extractTagBehaviorProps
 * - extractRestProps
 */

import { extractTagInputProps } from '@core/ui/forms/tag-input/hooks/useTagInput.props';
import type { TagInputProps } from '@src-types/ui/forms-inputs';
import { describe, expect, it, vi } from 'vitest';

describe('extractTagInputProps', () => {
	it('should be a function', () => {
		expect(typeof extractTagInputProps).toBe('function');
	});

	it('extracts all form props with defaults', () => {
		const props: TagInputProps = {
			label: 'Tags',
			size: 'md',
			fullWidth: true,
		};

		const result = extractTagInputProps(props);

		expect(result.label).toBe('Tags');
		expect(result.size).toBe('md');
		expect(result.fullWidth).toBe(true);
		expect(result.error).toBeUndefined();
		expect(result.helperText).toBeUndefined();
	});

	it('applies default size when not provided', () => {
		const props: TagInputProps = {};

		const result = extractTagInputProps(props);

		expect(result.size).toBe('md');
	});

	it('applies default fullWidth when not provided', () => {
		const props: TagInputProps = {};

		const result = extractTagInputProps(props);

		expect(result.fullWidth).toBe(false);
	});

	it('extracts input value props', () => {
		const props: TagInputProps = {
			value: 'test value',
			defaultValue: 'default value',
			onChange: vi.fn(),
			onValueChange: vi.fn(),
		};

		const result = extractTagInputProps(props);

		expect(result.value).toBe('test value');
		expect(result.defaultValue).toBe('default value');
		expect(result.onChange).toBe(props.onChange);
		expect(result.onValueChange).toBe(props.onValueChange);
	});

	it('extracts tag props', () => {
		const props: TagInputProps = {
			tags: ['tag1', 'tag2'],
			defaultTags: ['default1'],
			chipSize: 'lg',
			chipVariant: 'primary',
		};

		const result = extractTagInputProps(props);

		expect(result.tags).toEqual(['tag1', 'tag2']);
		expect(result.defaultTags).toEqual(['default1']);
		expect(result.chipSize).toBe('lg');
		expect(result.chipVariant).toBe('primary');
	});

	it('extracts tag behavior props with defaults', () => {
		const props: TagInputProps = {
			placeholder: 'Add tags',
			maxTags: 5,
		};

		const result = extractTagInputProps(props);

		expect(result.placeholder).toBe('Add tags');
		expect(result.maxTags).toBe(5);
		expect(result.separator).toEqual(/[\n,]/);
		expect(result.allowDuplicates).toBe(false);
	});

	it('applies default separator when not provided', () => {
		const props: TagInputProps = {};

		const result = extractTagInputProps(props);

		expect(result.separator).toEqual(/[\n,]/);
	});

	it('applies default allowDuplicates when not provided', () => {
		const props: TagInputProps = {};

		const result = extractTagInputProps(props);

		expect(result.allowDuplicates).toBe(false);
	});

	it('extracts custom separator', () => {
		const props: TagInputProps = {
			separator: ';',
		};

		const result = extractTagInputProps(props);

		expect(result.separator).toBe(';');
	});

	it('extracts allowDuplicates when true', () => {
		const props: TagInputProps = {
			allowDuplicates: true,
		};

		const result = extractTagInputProps(props);

		expect(result.allowDuplicates).toBe(true);
	});

	it('extracts rest props excluding handled props', () => {
		const props: TagInputProps = {
			label: 'Tags',
			value: 'test',
			autoFocus: true,
			'data-testid': 'tag-input',
		} as any;

		const result = extractTagInputProps(props);

		expect(result.rest.autoFocus).toBe(true);
		expect((result.rest as any)['data-testid']).toBe('tag-input');
		expect(result.rest).not.toHaveProperty('label');
		expect(result.rest).not.toHaveProperty('value');
		expect(result.rest).not.toHaveProperty('size');
		expect(result.rest).not.toHaveProperty('id');
		expect(result.rest).not.toHaveProperty('className');
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
			autoFocus: true,
		};

		const result = extractTagInputProps(props);

		expect(result.label).toBe('Tags');
		expect(result.error).toBe('Error');
		expect(result.helperText).toBe('Helper');
		expect(result.size).toBe('lg');
		expect(result.fullWidth).toBe(true);
		expect(result.tagInputId).toBe('custom-id');
		expect(result.className).toBe('custom-class');
		expect(result.disabled).toBe(true);
		expect(result.required).toBe(true);
		expect(result.value).toBe('value');
		expect(result.defaultValue).toBe('default');
		expect(result.onChange).toBe(onChange);
		expect(result.onValueChange).toBe(onValueChange);
		expect(result.tags).toEqual(['tag1']);
		expect(result.defaultTags).toEqual(['default1']);
		expect(result.chipSize).toBe('sm');
		expect(result.chipVariant).toBe('success');
		expect(result.placeholder).toBe('Add');
		expect(result.maxTags).toBe(10);
		expect(result.separator).toBe(',');
		expect(result.allowDuplicates).toBe(true);
		expect(result.rest.autoFocus).toBe(true);
	});
});
