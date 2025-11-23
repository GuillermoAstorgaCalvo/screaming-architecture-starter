/**
 * TagInputHelpers Tests
 *
 * Tests for helper functions:
 * - getTagInputClasses
 * - getAriaDescribedBy
 * - generateTagInputId
 * - normalizeTag
 * - isValidTag
 * - isDuplicateTag
 */

import {
	generateTagInputId,
	getAriaDescribedBy,
	getTagInputClasses,
	isDuplicateTag,
	isValidTag,
	normalizeTag,
} from '@core/ui/forms/tag-input/helpers/TagInputHelpers';
import { describe, expect, it } from 'vitest';

describe('getTagInputClasses', () => {
	it('should be a function', () => {
		expect(typeof getTagInputClasses).toBe('function');
	});

	it('should return classes for small size without error', () => {
		const classes = getTagInputClasses({
			size: 'sm',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for medium size without error', () => {
		const classes = getTagInputClasses({
			size: 'md',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return classes for large size without error', () => {
		const classes = getTagInputClasses({
			size: 'lg',
			hasError: false,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});

	it('should return different classes for different sizes', () => {
		const smClasses = getTagInputClasses({ size: 'sm', hasError: false });
		const mdClasses = getTagInputClasses({ size: 'md', hasError: false });
		const lgClasses = getTagInputClasses({ size: 'lg', hasError: false });

		expect(smClasses).not.toBe(mdClasses);
		expect(smClasses).not.toBe(lgClasses);
		expect(mdClasses).not.toBe(lgClasses);
	});

	it('should return error state classes when hasError is true', () => {
		const normalClasses = getTagInputClasses({
			size: 'md',
			hasError: false,
		});
		const errorClasses = getTagInputClasses({
			size: 'md',
			hasError: true,
		});

		expect(errorClasses).not.toBe(normalClasses);
		expect(typeof errorClasses).toBe('string');
		expect(errorClasses.length).toBeGreaterThan(0);
	});

	it('should merge custom className', () => {
		const customClass = 'custom-tag-input-class';
		const classes = getTagInputClasses({
			size: 'md',
			hasError: false,
			className: customClass,
		});
		expect(classes).toContain(customClass);
	});

	it('should work with undefined className', () => {
		const classes = getTagInputClasses({
			size: 'md',
			hasError: false,
			className: undefined,
		});
		expect(typeof classes).toBe('string');
		expect(classes.length).toBeGreaterThan(0);
	});
});

describe('getAriaDescribedBy', () => {
	it('should be a function', () => {
		expect(typeof getAriaDescribedBy).toBe('function');
	});

	it('should return undefined when no error or helperText', () => {
		const result = getAriaDescribedBy('tag-input-1');
		expect(result).toBeUndefined();
	});

	it('should return error ID when only error is provided', () => {
		const tagInputId = 'tag-input-1';
		const error = 'This field is required';
		const result = getAriaDescribedBy(tagInputId, error);
		expect(result).toBe(`${tagInputId}-error`);
	});

	it('should return helper ID when only helperText is provided', () => {
		const tagInputId = 'tag-input-1';
		const helperText = 'Add tags';
		const result = getAriaDescribedBy(tagInputId, undefined, helperText);
		expect(result).toBe(`${tagInputId}-helper`);
	});

	it('should return both IDs when error and helperText are provided', () => {
		const tagInputId = 'tag-input-1';
		const error = 'Invalid tags';
		const helperText = 'Add tags';
		const result = getAriaDescribedBy(tagInputId, error, helperText);
		expect(result).toBe(`${tagInputId}-error ${tagInputId}-helper`);
	});

	it('should handle different tagInputId values', () => {
		const tagInputId = 'my-custom-tag-input';
		const error = 'Error message';
		const result = getAriaDescribedBy(tagInputId, error);
		expect(result).toBe(`${tagInputId}-error`);
	});

	it('should return undefined for empty string error (falsy check)', () => {
		const tagInputId = 'tag-input-1';
		const result = getAriaDescribedBy(tagInputId, '');
		expect(result).toBeUndefined();
	});

	it('should return undefined for empty string helperText (falsy check)', () => {
		const tagInputId = 'tag-input-1';
		const result = getAriaDescribedBy(tagInputId, undefined, '');
		expect(result).toBeUndefined();
	});
});

describe('generateTagInputId', () => {
	it('should be a function', () => {
		expect(typeof generateTagInputId).toBe('function');
	});

	it('should return inputId when provided', () => {
		const customId = 'my-custom-id';
		const result = generateTagInputId({ generatedId: 'generated:123', inputId: customId });
		expect(result).toBe(customId);
	});

	it('should return inputId even when label is provided', () => {
		const customId = 'my-custom-id';
		const result = generateTagInputId({
			generatedId: 'generated:123',
			inputId: customId,
			label: 'Tag Label',
		});
		expect(result).toBe(customId);
	});

	it('should return undefined when no inputId and no label', () => {
		const result = generateTagInputId({ generatedId: 'generated:123' });
		expect(result).toBeUndefined();
	});

	it('should return undefined when no inputId and empty label', () => {
		const result = generateTagInputId({ generatedId: 'generated:123', label: '' });
		expect(result).toBeUndefined();
	});

	it('should generate ID from label when inputId is not provided', () => {
		const generatedId = 'generated:123';
		const label = 'Tag Label';
		const result = generateTagInputId({ generatedId, label });
		expect(result).toBe('taginput-generated123');
	});

	it('should remove colons from generatedId', () => {
		const generatedId = 'generated:123:456';
		const label = 'Tag Label';
		const result = generateTagInputId({ generatedId, label });
		expect(result).toBe('taginput-generated123456');
	});

	it('should handle generatedId with multiple colons', () => {
		const generatedId = 'form:field:tag:input';
		const label = 'Tags';
		const result = generateTagInputId({ generatedId, label });
		expect(result).toBe('taginput-formfieldtaginput');
	});

	it('should handle generatedId without colons', () => {
		const generatedId = 'generated123';
		const label = 'Tag Label';
		const result = generateTagInputId({ generatedId, label });
		expect(result).toBe('taginput-generated123');
	});

	it('should prioritize inputId over label', () => {
		const customId = 'custom-id';
		const generatedId = 'generated:123';
		const label = 'Tag Label';
		const result = generateTagInputId({ generatedId, inputId: customId, label });
		expect(result).toBe(customId);
	});
});

describe('normalizeTag', () => {
	it('should be a function', () => {
		expect(typeof normalizeTag).toBe('function');
	});

	it('should trim whitespace from tag', () => {
		expect(normalizeTag('  tag  ')).toBe('tag');
		expect(normalizeTag(' tag ')).toBe('tag');
		expect(normalizeTag('\ttag\n')).toBe('tag');
	});

	it('should return empty string for whitespace-only tag', () => {
		expect(normalizeTag('   ')).toBe('');
		expect(normalizeTag('\t\n')).toBe('');
	});

	it('should return tag as-is when no whitespace', () => {
		expect(normalizeTag('tag')).toBe('tag');
		expect(normalizeTag('tag-name')).toBe('tag-name');
	});

	it('should handle empty string', () => {
		expect(normalizeTag('')).toBe('');
	});
});

describe('isValidTag', () => {
	it('should be a function', () => {
		expect(typeof isValidTag).toBe('function');
	});

	it('should return true for non-empty tag after normalization', () => {
		expect(isValidTag('tag')).toBe(true);
		expect(isValidTag('  tag  ')).toBe(true);
		expect(isValidTag('tag-name')).toBe(true);
	});

	it('should return false for empty tag', () => {
		expect(isValidTag('')).toBe(false);
		expect(isValidTag('   ')).toBe(false);
		expect(isValidTag('\t\n')).toBe(false);
	});

	it('should return false for whitespace-only tag', () => {
		expect(isValidTag(' ')).toBe(false);
		expect(isValidTag('\t')).toBe(false);
		expect(isValidTag('\n')).toBe(false);
	});
});

describe('isDuplicateTag', () => {
	it('should be a function', () => {
		expect(typeof isDuplicateTag).toBe('function');
	});

	it('should return true when tag exists in array (case-insensitive)', () => {
		const tags = ['Tag1', 'Tag2', 'Tag3'];
		expect(isDuplicateTag('tag1', tags)).toBe(true);
		expect(isDuplicateTag('TAG2', tags)).toBe(true);
		expect(isDuplicateTag('tag3', tags)).toBe(true);
	});

	it('should return false when tag does not exist in array', () => {
		const tags = ['Tag1', 'Tag2', 'Tag3'];
		expect(isDuplicateTag('Tag4', tags)).toBe(false);
		expect(isDuplicateTag('Different', tags)).toBe(false);
	});

	it('should handle empty tags array', () => {
		const tags: string[] = [];
		expect(isDuplicateTag('tag', tags)).toBe(false);
	});

	it('should normalize tag before checking', () => {
		const tags = ['Tag1'];
		expect(isDuplicateTag('  tag1  ', tags)).toBe(true);
		expect(isDuplicateTag('TAG1', tags)).toBe(true);
	});

	it('should handle tags with different casing', () => {
		const tags = ['JavaScript', 'TypeScript'];
		expect(isDuplicateTag('javascript', tags)).toBe(true);
		expect(isDuplicateTag('TYPESCRIPT', tags)).toBe(true);
		expect(isDuplicateTag('typescript', tags)).toBe(true);
	});
});
