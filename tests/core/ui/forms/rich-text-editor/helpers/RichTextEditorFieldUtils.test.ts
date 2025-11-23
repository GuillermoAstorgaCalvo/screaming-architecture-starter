/**
 * RichTextEditorFieldUtils Tests
 *
 * Tests for the RichTextEditorFieldUtils including:
 * - getContainerStyle function
 * - getContentProps function
 */

import {
	getContainerStyle,
	getContentProps,
} from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorFieldUtils';
import type { useEditor } from '@tiptap/react';
import { describe, expect, it, vi } from 'vitest';

describe('getContainerStyle', () => {
	it('returns empty object when both minHeight and maxHeight are undefined', () => {
		const result = getContainerStyle(undefined, undefined);
		expect(result).toEqual({});
	});

	it('returns minHeight when only minHeight is provided as number', () => {
		const result = getContainerStyle(300, undefined);
		expect(result).toEqual({ minHeight: '300px' });
	});

	it('returns minHeight when only minHeight is provided as string', () => {
		const result = getContainerStyle('300px', undefined);
		expect(result).toEqual({ minHeight: '300px' });
	});

	it('returns maxHeight when only maxHeight is provided as number', () => {
		const result = getContainerStyle(undefined, 500);
		expect(result).toEqual({ maxHeight: '500px' });
	});

	it('returns maxHeight when only maxHeight is provided as string', () => {
		const result = getContainerStyle(undefined, '500px');
		expect(result).toEqual({ maxHeight: '500px' });
	});

	it('returns both minHeight and maxHeight when both are provided', () => {
		const result = getContainerStyle(300, 500);
		expect(result).toEqual({ minHeight: '300px', maxHeight: '500px' });
	});

	it('handles string values for both heights', () => {
		const result = getContainerStyle('20rem', '30rem');
		expect(result).toEqual({ minHeight: '20rem', maxHeight: '30rem' });
	});

	it('converts number to px string', () => {
		const result = getContainerStyle(100, 200);
		expect(result.minHeight).toBe('100px');
		expect(result.maxHeight).toBe('200px');
	});

	it('preserves string values as-is', () => {
		const result = getContainerStyle('10vh', '20vh');
		expect(result.minHeight).toBe('10vh');
		expect(result.maxHeight).toBe('20vh');
	});
});

describe('getContentProps', () => {
	it('returns props with editor, hasError, and ariaDescribedBy', () => {
		const mockEditor = {
			getHTML: vi.fn(),
			commands: {},
		} as unknown as NonNullable<ReturnType<typeof useEditor>>;

		const result = getContentProps(mockEditor, true, 'editor-1-error');

		expect(result).toEqual({
			editor: mockEditor,
			hasError: true,
			ariaDescribedBy: 'editor-1-error',
		});
	});

	it('includes ariaDescribedBy when provided', () => {
		const mockEditor = {
			getHTML: vi.fn(),
			commands: {},
		} as unknown as NonNullable<ReturnType<typeof useEditor>>;

		const result = getContentProps(mockEditor, false, 'editor-1-helper');

		expect(result.ariaDescribedBy).toBe('editor-1-helper');
	});

	it('omits ariaDescribedBy when undefined', () => {
		const mockEditor = {
			getHTML: vi.fn(),
			commands: {},
		} as unknown as NonNullable<ReturnType<typeof useEditor>>;

		const result = getContentProps(mockEditor, false, undefined);

		expect(result).not.toHaveProperty('ariaDescribedBy');
	});

	it('sets hasError correctly', () => {
		const mockEditor = {
			getHTML: vi.fn(),
			commands: {},
		} as unknown as NonNullable<ReturnType<typeof useEditor>>;

		const resultWithError = getContentProps(mockEditor, true, undefined);
		expect(resultWithError.hasError).toBe(true);

		const resultWithoutError = getContentProps(mockEditor, false, undefined);
		expect(resultWithoutError.hasError).toBe(false);
	});

	it('always includes editor in result', () => {
		const mockEditor = {
			getHTML: vi.fn(),
			commands: {},
		} as unknown as NonNullable<ReturnType<typeof useEditor>>;

		const result = getContentProps(mockEditor, false, undefined);

		expect(result.editor).toBe(mockEditor);
	});
});
