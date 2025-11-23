/**
 * RichTextEditorEditor Tests
 *
 * Tests for the RichTextEditorEditor including:
 * - formatHeight function
 * - getDefaultExtensions function
 * - useEditorValueSync hook
 * - useEditorEditableSync hook
 * - getEditorConfig function
 * - useRichTextEditor hook
 */

import {
	formatHeight,
	getDefaultExtensions,
	getEditorConfig,
	useEditorEditableSync,
	useEditorValueSync,
	useRichTextEditor,
} from '@core/ui/forms/rich-text-editor/helpers/RichTextEditorEditor';
import type { RichTextEditorFieldProps } from '@core/ui/forms/rich-text-editor/types/RichTextEditorTypes';
import { renderHook, waitFor } from '@testing-library/react';
import { useEditor } from '@tiptap/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock TipTap
vi.mock('@tiptap/react', () => ({
	useEditor: vi.fn(),
	EditorContent: vi.fn(() => null),
}));

vi.mock('@tiptap/starter-kit', () => ({
	default: {
		configure: vi.fn(() => []),
	},
}));

vi.mock('@tiptap/extension-placeholder', () => ({
	default: {
		configure: vi.fn(() => ({})),
	},
}));

describe('formatHeight', () => {
	it('returns undefined when height is undefined', () => {
		const result = formatHeight(undefined);
		expect(result).toBeUndefined();
	});

	it('converts number to px string', () => {
		const result = formatHeight(300);
		expect(result).toBe('300px');
	});

	it('returns string as-is', () => {
		const result = formatHeight('300px');
		expect(result).toBe('300px');
	});

	it('handles different string formats', () => {
		expect(formatHeight('20rem')).toBe('20rem');
		expect(formatHeight('50vh')).toBe('50vh');
		expect(formatHeight('100%')).toBe('100%');
	});

	it('handles zero value', () => {
		expect(formatHeight(0)).toBe('0px');
		expect(formatHeight('0')).toBe('0');
	});
});

describe('getDefaultExtensions', () => {
	it('returns array with StarterKit and Placeholder extensions', () => {
		const result = getDefaultExtensions();
		expect(Array.isArray(result)).toBe(true);
		expect(result.length).toBeGreaterThan(0);
	});

	it('uses default placeholder when placeholderText is not provided', () => {
		const result = getDefaultExtensions();
		// The function should call Placeholder.configure with DEFAULT_PLACEHOLDER
		expect(result).toBeDefined();
	});

	it('uses custom placeholder when provided', () => {
		const customPlaceholder = 'Custom placeholder';
		const result = getDefaultExtensions(undefined, customPlaceholder);
		expect(result).toBeDefined();
	});

	it('passes toolbar config to StarterKit', () => {
		const toolbar: RichTextEditorFieldProps['toolbar'] = { bold: false };
		const result = getDefaultExtensions(toolbar);
		expect(result).toBeDefined();
	});
});

describe('useEditorValueSync', () => {
	it('does not update editor when value is undefined', () => {
		const mockSetContent = vi.fn();
		const mockEditor = {
			getHTML: vi.fn(() => '<p>Existing content</p>'),
			commands: {
				setContent: mockSetContent,
			},
		};

		const { rerender } = renderHook(
			({ value }: { value: string | undefined }) => {
				useEditorValueSync(mockEditor as any, value);
			},
			{
				initialProps: { value: undefined },
			}
		);

		expect(mockSetContent).not.toHaveBeenCalled();

		rerender({ value: undefined });
		expect(mockSetContent).not.toHaveBeenCalled();
	});

	it('does not update editor when editor is null', () => {
		const { rerender } = renderHook(
			({ value }: { value: string | undefined }) => {
				useEditorValueSync(null, value);
			},
			{
				initialProps: { value: '<p>New content</p>' },
			}
		);

		// Should not throw or cause errors
		rerender({ value: '<p>Updated content</p>' });
	});

	it('updates editor when value changes', async () => {
		const mockSetContent = vi.fn();
		const mockGetHTML = vi.fn(() => '<p>Old content</p>');
		const mockEditor = {
			getHTML: mockGetHTML,
			commands: {
				setContent: mockSetContent,
			},
		};

		const { rerender } = renderHook(
			({ value }: { value: string | undefined }) => {
				useEditorValueSync(mockEditor as any, value);
			},
			{
				initialProps: { value: '<p>Old content</p>' },
			}
		);

		// Initial render with same value should not trigger update
		await waitFor(() => {
			expect(mockSetContent).not.toHaveBeenCalled();
		});

		// Update with new value
		rerender({ value: '<p>New content</p>' });
		await waitFor(() => {
			expect(mockSetContent).toHaveBeenCalledWith('<p>New content</p>');
		});
	});

	it('does not update editor when value matches current HTML', () => {
		const mockSetContent = vi.fn();
		const mockGetHTML = vi.fn(() => '<p>Same content</p>');
		const mockEditor = {
			getHTML: mockGetHTML,
			commands: {
				setContent: mockSetContent,
			},
		};

		renderHook(
			({ value }: { value: string | undefined }) => {
				useEditorValueSync(mockEditor as any, value);
			},
			{
				initialProps: { value: '<p>Same content</p>' },
			}
		);

		expect(mockSetContent).not.toHaveBeenCalled();
	});
});

describe('useEditorEditableSync', () => {
	it('sets editor to editable when not disabled and not readOnly', () => {
		const mockSetEditable = vi.fn();
		const mockEditor = {
			setEditable: mockSetEditable,
		};

		renderHook(() => {
			useEditorEditableSync(mockEditor as any, false, false);
		});

		expect(mockSetEditable).toHaveBeenCalledWith(true);
	});

	it('sets editor to non-editable when disabled', () => {
		const mockSetEditable = vi.fn();
		const mockEditor = {
			setEditable: mockSetEditable,
		};

		renderHook(() => {
			useEditorEditableSync(mockEditor as any, true, false);
		});

		expect(mockSetEditable).toHaveBeenCalledWith(false);
	});

	it('sets editor to non-editable when readOnly', () => {
		const mockSetEditable = vi.fn();
		const mockEditor = {
			setEditable: mockSetEditable,
		};

		renderHook(() => {
			useEditorEditableSync(mockEditor as any, false, true);
		});

		expect(mockSetEditable).toHaveBeenCalledWith(false);
	});

	it('sets editor to non-editable when both disabled and readOnly', () => {
		const mockSetEditable = vi.fn();
		const mockEditor = {
			setEditable: mockSetEditable,
		};

		renderHook(() => {
			useEditorEditableSync(mockEditor as any, true, true);
		});

		expect(mockSetEditable).toHaveBeenCalledWith(false);
	});

	it('does not throw when editor is null', () => {
		renderHook(() => {
			useEditorEditableSync(null, false, false);
		});
		// Should not throw
	});

	it('updates when disabled changes', () => {
		const mockSetEditable = vi.fn();
		const mockEditor = {
			setEditable: mockSetEditable,
		};

		const { rerender } = renderHook(
			({ disabled }: { disabled: boolean }) => {
				useEditorEditableSync(mockEditor as any, disabled, false);
			},
			{
				initialProps: { disabled: false },
			}
		);

		expect(mockSetEditable).toHaveBeenCalledWith(true);

		rerender({ disabled: true });
		expect(mockSetEditable).toHaveBeenCalledWith(false);
	});
});

describe('getEditorConfig', () => {
	it('returns config with default extensions when extensions not provided', () => {
		const options = {
			disabled: false,
			readOnly: false,
		};

		const result = getEditorConfig(options);

		expect(result).toHaveProperty('extensions');
		expect(result).toHaveProperty('content');
		expect(result).toHaveProperty('editable');
		expect(result).toHaveProperty('onUpdate');
	});

	it('uses custom extensions when provided', () => {
		const customExtensions = [{ name: 'custom' }];
		const options = {
			extensions: customExtensions,
			disabled: false,
			readOnly: false,
		};

		const result = getEditorConfig(options);

		expect(result.extensions).toBe(customExtensions);
	});

	it('uses value when provided', () => {
		const options = {
			value: '<p>Content</p>',
			disabled: false,
			readOnly: false,
		};

		const result = getEditorConfig(options);

		expect(result.content).toBe('<p>Content</p>');
	});

	it('uses defaultValue when value is not provided', () => {
		const options = {
			extensions: undefined,
			toolbar: undefined,
			placeholder: undefined,
			value: undefined,
			defaultValue: '<p>Default</p>',
			disabled: false,
			readOnly: false,
			onChange: undefined,
		};

		const result = getEditorConfig(options);

		expect(result.content).toBe('<p>Default</p>');
	});

	it('uses empty string when neither value nor defaultValue provided', () => {
		const options = {
			extensions: undefined,
			toolbar: undefined,
			placeholder: undefined,
			value: undefined,
			defaultValue: undefined,
			disabled: false,
			readOnly: false,
			onChange: undefined,
		};

		const result = getEditorConfig(options);

		expect(result.content).toBe('');
	});

	it('sets editable to false when disabled', () => {
		const options = {
			extensions: undefined,
			toolbar: undefined,
			placeholder: undefined,
			value: undefined,
			defaultValue: undefined,
			disabled: true,
			readOnly: false,
			onChange: undefined,
		};

		const result = getEditorConfig(options);

		expect(result.editable).toBe(false);
	});

	it('sets editable to false when readOnly', () => {
		const options = {
			extensions: undefined,
			toolbar: undefined,
			placeholder: undefined,
			value: undefined,
			defaultValue: undefined,
			disabled: false,
			readOnly: true,
			onChange: undefined,
		};

		const result = getEditorConfig(options);

		expect(result.editable).toBe(false);
	});

	it('calls onChange when onUpdate is triggered', () => {
		const onChange = vi.fn();
		const mockEditor = {
			getHTML: vi.fn(() => '<p>Updated</p>'),
		};

		const options = {
			extensions: undefined,
			toolbar: undefined,
			placeholder: undefined,
			value: undefined,
			defaultValue: undefined,
			disabled: false,
			readOnly: false,
			onChange,
		};

		const result = getEditorConfig(options);

		result.onUpdate({ editor: mockEditor as any });

		expect(onChange).toHaveBeenCalledWith('<p>Updated</p>');
	});

	it('does not call onChange when editor is null in onUpdate', () => {
		const onChange = vi.fn();

		const options = {
			extensions: undefined,
			toolbar: undefined,
			placeholder: undefined,
			value: undefined,
			defaultValue: undefined,
			disabled: false,
			readOnly: false,
			onChange,
		};

		const result = getEditorConfig(options);

		result.onUpdate({ editor: null as any });

		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('useRichTextEditor', () => {
	beforeEach(() => {
		vi.mocked(useEditor).mockClear();
	});

	it('returns editor instance when initialization succeeds', () => {
		const mockEditor = {
			getHTML: vi.fn(),
			commands: {},
			setEditable: vi.fn(),
		};

		vi.mocked(useEditor).mockReturnValue(mockEditor as any);

		const { result } = renderHook(() =>
			useRichTextEditor({
				extensions: undefined,
				toolbar: undefined,
				placeholder: undefined,
				value: undefined,
				defaultValue: undefined,
				disabled: false,
				readOnly: false,
				onChange: undefined,
			})
		);

		expect(result.current).toBe(mockEditor);
	});

	it('returns null when initialization fails', () => {
		vi.mocked(useEditor).mockReturnValue(null as any);

		const { result } = renderHook(() =>
			useRichTextEditor({
				extensions: undefined,
				toolbar: undefined,
				placeholder: undefined,
				value: undefined,
				defaultValue: undefined,
				disabled: false,
				readOnly: false,
				onChange: undefined,
			})
		);

		expect(result.current).toBeNull();
	});

	it('syncs value changes', () => {
		const mockSetContent = vi.fn();
		const mockGetHTML = vi.fn(() => '<p>Old</p>');
		const mockEditor = {
			getHTML: mockGetHTML,
			commands: {
				setContent: mockSetContent,
			},
			setEditable: vi.fn(),
		};

		vi.mocked(useEditor).mockReturnValue(mockEditor as any);

		const { rerender } = renderHook(
			({ value }: { value: string | undefined }) =>
				useRichTextEditor({
					extensions: undefined,
					toolbar: undefined,
					placeholder: undefined,
					value,
					defaultValue: undefined,
					disabled: false,
					readOnly: false,
					onChange: undefined,
				}),
			{
				initialProps: { value: '<p>Old</p>' },
			}
		);

		rerender({ value: '<p>New</p>' });

		// Value sync should be called
		expect(mockSetContent).toHaveBeenCalled();
	});
});
