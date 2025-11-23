/**
 * useRichTextEditor Tests
 *
 * Tests for the useRichTextEditor hook including:
 * - Prop extraction
 * - State computation
 * - Field props building
 * - Return values
 */

import {
	useRichTextEditorProps,
	useRichTextEditorState,
} from '@core/ui/forms/rich-text-editor/hooks/useRichTextEditor';
import type { RichTextEditorProps } from '@src-types/ui/forms-editors';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useRichTextEditorState - State Computation', () => {
	it('generates ID when label is provided', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: undefined,
				label: 'Content',
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('rich-text-editor-');
	});

	it('uses provided editorId when given', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'custom-id',
				label: 'Content',
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.finalId).toBe('custom-id');
	});

	it('returns undefined finalId when neither editorId nor label provided', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: undefined,
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('sets hasError to true when error is provided', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: 'Error message',
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('sets hasError to false when error is not provided', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('generates ariaDescribedBy for error', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: 'Error message',
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-id-error');
	});

	it('generates ariaDescribedBy for helperText when no error', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: undefined,
				helperText: 'Helper text',
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-id-helper');
	});

	it('returns undefined ariaDescribedBy when neither error nor helperText', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('generates editor classes with size sm', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'sm',
				className: undefined,
			})
		);

		expect(result.current.editorClasses).toContain('text-sm');
	});

	it('generates editor classes with size md', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.editorClasses).toContain('text-base');
	});

	it('generates editor classes with size lg', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'lg',
				className: undefined,
			})
		);

		expect(result.current.editorClasses).toContain('text-lg');
	});

	it('includes custom className in editor classes', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: undefined,
				helperText: undefined,
				size: 'md',
				className: 'custom-class',
			})
		);

		expect(result.current.editorClasses).toContain('custom-class');
	});

	it('includes error border class when hasError is true', () => {
		const { result } = renderHook(() =>
			useRichTextEditorState({
				editorId: 'test-id',
				label: undefined,
				error: 'Error',
				helperText: undefined,
				size: 'md',
				className: undefined,
			})
		);

		expect(result.current.editorClasses).toContain('border-destructive');
	});
});

describe('useRichTextEditorProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			error: 'Invalid content',
			helperText: 'Enter content',
			size: 'lg',
			fullWidth: true,
			editorId: 'custom-id',
			disabled: true,
			required: true,
			value: '<p>Content</p>',
			onChange: () => {},
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.label).toBe('Content');
		expect(result.current.error).toBe('Invalid content');
		expect(result.current.helperText).toBe('Enter content');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.label).toBe('Content');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.state).toBeDefined();
		// State should be computed with default size 'md'
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: RichTextEditorProps = {
			label: 'Content',
			value: '<p>Content</p>',
			onChange,
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps.value).toBe('<p>Content</p>');
		expect(result.current.editorProps.onChange).toBe(onChange);
	});

	it('extracts defaultValue correctly', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			defaultValue: '<p>Default</p>',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps.defaultValue).toBe('<p>Default</p>');
	});

	it('extracts disabled and required correctly', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			disabled: true,
			required: true,
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps.disabled).toBe(true);
		expect(result.current.editorProps.required).toBe(true);
	});

	it('handles required from HTMLAttributes', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			required: true,
		} as RichTextEditorProps;

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.required).toBe(true);
		expect(result.current.editorProps.required).toBe(true);
	});
});

describe('useRichTextEditorProps - State Computation', () => {
	it('computes state using useRichTextEditorState', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			error: 'Invalid content',
			helperText: 'Enter content',
			size: 'lg',
			editorId: 'test-id',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
	});

	it('passes computed state to field props', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			editorId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps.id).toBe('test-id');
		expect(result.current.editorProps.className).toBe(result.current.state.editorClasses);
		expect(result.current.editorProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.editorProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('useRichTextEditorProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = () => {};
		const props: RichTextEditorProps = {
			label: 'Content',
			editorId: 'test-id',
			disabled: true,
			required: true,
			value: '<p>Content</p>',
			onChange,
			placeholder: 'Enter content',
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps).toBeDefined();
		expect(result.current.editorProps.id).toBe('test-id');
		expect(result.current.editorProps.className).toBeDefined();
		expect(result.current.editorProps.hasError).toBe(false);
		expect(result.current.editorProps.disabled).toBe(true);
		expect(result.current.editorProps.required).toBe(true);
		expect(result.current.editorProps.value).toBe('<p>Content</p>');
		expect(result.current.editorProps.onChange).toBe(onChange);
		expect(result.current.editorProps.placeholder).toBe('Enter content');
	});

	it('includes optional props conditionally', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			editorId: 'test-id',
			minHeight: 300,
			maxHeight: 500,
			extensions: [],
			toolbar: { bold: false },
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps.minHeight).toBe(300);
		expect(result.current.editorProps.maxHeight).toBe(500);
		expect(result.current.editorProps.extensions).toEqual([]);
		expect(result.current.editorProps.toolbar).toEqual({ bold: false });
	});

	it('handles uncontrolled mode with defaultValue', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			defaultValue: '<p>Default</p>',
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps.defaultValue).toBe('<p>Default</p>');
		expect(result.current.editorProps.value).toBeUndefined();
	});

	it('handles controlled mode with value', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			value: '<p>Content</p>',
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.editorProps.value).toBe('<p>Content</p>');
		expect(result.current.editorProps.defaultValue).toBeUndefined();
	});
});

describe('useRichTextEditorProps - Return Values', () => {
	it('returns all expected values', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			error: 'Invalid',
			helperText: 'Helper',
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('editorProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});

	it('returns extracted label, error, and helperText', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			error: 'Invalid content',
			helperText: 'Enter content',
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.label).toBe('Content');
		expect(result.current.error).toBe('Invalid content');
		expect(result.current.helperText).toBe('Enter content');
	});

	it('returns required and fullWidth flags', () => {
		const props: RichTextEditorProps = {
			label: 'Content',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});
});

describe('useRichTextEditorProps - Integration', () => {
	it('handles complete RichTextEditor props flow', () => {
		const onChange = () => {};
		const props: RichTextEditorProps = {
			label: 'Content',
			error: 'Invalid content',
			helperText: 'Enter content',
			size: 'lg',
			fullWidth: true,
			editorId: 'content-editor',
			disabled: false,
			required: true,
			value: '<p>Content</p>',
			onChange,
			placeholder: 'Enter content',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('Content');
		expect(result.current.error).toBe('Invalid content');
		expect(result.current.helperText).toBe('Enter content');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('content-editor');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('content-editor-error');

		// Check field props
		expect(result.current.editorProps.id).toBe('content-editor');
		expect(result.current.editorProps.hasError).toBe(true);
		expect(result.current.editorProps.disabled).toBe(false);
		expect(result.current.editorProps.required).toBe(true);
		expect(result.current.editorProps.value).toBe('<p>Content</p>');
		expect(result.current.editorProps.onChange).toBe(onChange);
		expect(result.current.editorProps.placeholder).toBe('Enter content');
	});

	it('handles minimal props', () => {
		const props: RichTextEditorProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useRichTextEditorProps({ props }));

		expect(result.current.label).toBeUndefined();
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
		expect(result.current.state).toBeDefined();
		expect(result.current.editorProps).toBeDefined();
	});

	it('updates when props change', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: RichTextEditorProps }) => useRichTextEditorProps({ props }),
			{
				initialProps: {
					props: {
						label: 'Content',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.label).toBe('Content');
		expect(result.current.state.hasError).toBe(false);

		rerender({
			props: {
				label: 'Content',
				error: 'Invalid',
				size: 'md',
			},
		});

		expect(result.current.error).toBe('Invalid');
		expect(result.current.state.hasError).toBe(true);
	});
});
