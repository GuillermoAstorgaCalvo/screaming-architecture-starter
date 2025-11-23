/**
 * RichTextEditorHelpers Tests
 *
 * Tests for the RichTextEditorHelpers including:
 * - getAriaDescribedBy function
 * - generateEditorId function
 * - getRichTextEditorClasses function
 */

import {
	generateEditorId,
	getAriaDescribedBy,
	getRichTextEditorClasses,
} from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorHelpers';
import { describe, expect, it } from 'vitest';

describe('getAriaDescribedBy', () => {
	it('returns error ID when error is provided', () => {
		const result = getAriaDescribedBy('editor-1', 'Error message', 'Helper text');
		expect(result).toBe('editor-1-error');
	});

	it('returns helper ID when only helperText is provided', () => {
		const result = getAriaDescribedBy('editor-1', undefined, 'Helper text');
		expect(result).toBe('editor-1-helper');
	});

	it('returns undefined when neither error nor helperText is provided', () => {
		const result = getAriaDescribedBy('editor-1', undefined, undefined);
		expect(result).toBeUndefined();
	});

	it('prioritizes error over helperText', () => {
		const result = getAriaDescribedBy('editor-1', 'Error message', 'Helper text');
		expect(result).toBe('editor-1-error');
		expect(result).not.toContain('helper');
	});

	it('handles empty string error', () => {
		const result = getAriaDescribedBy('editor-1', '', 'Helper text');
		// Empty string is falsy, so it falls through to helperText
		expect(result).toBe('editor-1-helper');
	});

	it('handles empty string helperText', () => {
		const result = getAriaDescribedBy('editor-1', undefined, '');
		// Empty string is falsy, so it returns undefined
		expect(result).toBeUndefined();
	});
});

describe('generateEditorId', () => {
	it('returns provided editorId when given', () => {
		const result = generateEditorId('generated-id', 'custom-id', 'Label');
		expect(result).toBe('custom-id');
	});

	it('generates ID from label when editorId is not provided', () => {
		const generatedId = 'r1:r2:r3';
		const result = generateEditorId(generatedId, undefined, 'My Label');
		expect(result).toBe('rich-text-editor-r1r2r3');
	});

	it('removes colons from generated ID', () => {
		const generatedId = 'r1:r2:r3';
		const result = generateEditorId(generatedId, undefined, 'Label');
		expect(result).not.toContain(':');
		expect(result).toBe('rich-text-editor-r1r2r3');
	});

	it('returns undefined when neither editorId nor label is provided', () => {
		const result = generateEditorId('generated-id', undefined, undefined);
		expect(result).toBeUndefined();
	});

	it('handles empty string label', () => {
		const result = generateEditorId('generated-id', undefined, '');
		expect(result).toBeUndefined();
	});

	it('handles complex generated IDs with multiple colons', () => {
		const generatedId = 'r1:r2:r3:r4:r5';
		const result = generateEditorId(generatedId, undefined, 'Label');
		expect(result).toBe('rich-text-editor-r1r2r3r4r5');
	});

	it('handles generated ID without colons', () => {
		const generatedId = 'simple-id';
		const result = generateEditorId(generatedId, undefined, 'Label');
		expect(result).toBe('rich-text-editor-simple-id');
	});
});

describe('getRichTextEditorClasses', () => {
	it('returns base classes with size sm', () => {
		const result = getRichTextEditorClasses('sm', false, undefined);
		expect(result).toContain('w-full');
		expect(result).toContain('text-sm');
	});

	it('returns base classes with size md', () => {
		const result = getRichTextEditorClasses('md', false, undefined);
		expect(result).toContain('w-full');
		expect(result).toContain('text-base');
	});

	it('returns base classes with size lg', () => {
		const result = getRichTextEditorClasses('lg', false, undefined);
		expect(result).toContain('w-full');
		expect(result).toContain('text-lg');
	});

	it('includes error border class when hasError is true', () => {
		const result = getRichTextEditorClasses('md', true, undefined);
		expect(result).toContain('border-destructive');
	});

	it('excludes error border class when hasError is false', () => {
		const result = getRichTextEditorClasses('md', false, undefined);
		expect(result).not.toContain('border-destructive');
	});

	it('includes custom className when provided', () => {
		const customClass = 'custom-class';
		const result = getRichTextEditorClasses('md', false, customClass);
		expect(result).toContain(customClass);
	});

	it('combines all classes correctly', () => {
		const result = getRichTextEditorClasses('lg', true, 'custom-class');
		expect(result).toContain('w-full');
		expect(result).toContain('text-lg');
		expect(result).toContain('border-destructive');
		expect(result).toContain('custom-class');
	});

	it('handles empty className string', () => {
		const result = getRichTextEditorClasses('md', false, '');
		expect(result).toContain('w-full');
		expect(result).toContain('text-base');
	});

	it('trims whitespace from className', () => {
		const result = getRichTextEditorClasses('md', false, '  custom-class  ');
		expect(result).toContain('custom-class');
		// The implementation only trims the final result, not individual parts
		// So there may be spaces between classes, but the className itself is included as-is
		expect(result.trim()).toBe(result);
	});
});
