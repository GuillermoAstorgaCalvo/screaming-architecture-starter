/**
 * useColorInput Tests
 *
 * Tests for the useColorInput hooks:
 * - useColorInputState: ID generation, error state, ARIA attributes, classes
 * - useColorInputProps: Prop processing, state computation, field props building
 */

import {
	useColorInputProps,
	useColorInputState,
} from '@core/ui/forms/color-input/hooks/useColorInput';
import type { ColorInputProps } from '@src-types/ui/forms';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useColorInputState - ID Generation', () => {
	it('generates ID from label when colorInputId is not provided', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				label: 'Theme Color',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('color-input-');
	});

	it('uses provided colorInputId when available', () => {
		const customId = 'custom-color-input-id';
		const { result } = renderHook(() =>
			useColorInputState({
				colorInputId: customId,
				label: 'Theme Color',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});

	it('returns undefined when no label and no colorInputId provided', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeUndefined();
	});

	it('generates ID when label is provided even without colorInputId', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				label: 'Background Color',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBeDefined();
		expect(result.current.finalId).toContain('color-input-');
	});

	it('prioritizes colorInputId over label for ID generation', () => {
		const customId = 'my-custom-id';
		const { result } = renderHook(() =>
			useColorInputState({
				colorInputId: customId,
				label: 'Theme Color',
				size: 'md',
			})
		);

		expect(result.current.finalId).toBe(customId);
	});
});

describe('useColorInputState - Error State', () => {
	it('sets hasError to true when error is provided', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				error: 'Invalid color',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(true);
	});

	it('sets hasError to false when no error is provided', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('sets hasError to false when error is empty string', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				error: '',
				size: 'md',
			})
		);

		expect(result.current.hasError).toBe(false);
	});

	it('updates hasError when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useColorInputState({
					error,
					size: 'md',
				}),
			{
				initialProps: {},
			}
		);

		expect(result.current.hasError).toBe(false);

		rerender({ error: 'Error message' });
		expect(result.current.hasError).toBe(true);

		rerender({});
		expect(result.current.hasError).toBe(false);
	});
});

describe('useColorInputState - ARIA Attributes', () => {
	it('generates aria-describedby with error ID when error is provided', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				colorInputId: 'test-color-input',
				error: 'Invalid color',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-color-input-error');
	});

	it('generates aria-describedby with helper text ID when helperText is provided', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				colorInputId: 'test-color-input',
				helperText: 'Choose a color',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBe('test-color-input-helper');
	});

	it('generates aria-describedby with both error and helper text IDs', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				colorInputId: 'test-color-input',
				error: 'Invalid color',
				helperText: 'Choose a color',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toContain('test-color-input-error');
		expect(result.current.ariaDescribedBy).toContain('test-color-input-helper');
	});

	it('returns undefined for aria-describedby when no error or helperText', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				colorInputId: 'test-color-input',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined for aria-describedby when finalId is undefined', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				error: 'Invalid color',
				helperText: 'Choose a color',
				size: 'md',
			})
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();
	});

	it('updates aria-describedby when error changes', () => {
		const { result, rerender } = renderHook(
			({ error }: { error?: string }) =>
				useColorInputState({
					colorInputId: 'test-color-input',
					error,
					size: 'md',
				}),
			{
				initialProps: {},
			}
		);

		expect(result.current.ariaDescribedBy).toBeUndefined();

		rerender({ error: 'Error message' });
		expect(result.current.ariaDescribedBy).toBe('test-color-input-error');

		rerender({});
		expect(result.current.ariaDescribedBy).toBeUndefined();
	});
});

describe('useColorInputState - CSS Classes', () => {
	it('generates input classes with default size', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for small size', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				size: 'sm',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('generates input classes for large size', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				size: 'lg',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(typeof result.current.inputClasses).toBe('string');
	});

	it('includes error classes when hasError is true', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				error: 'Invalid color',
				size: 'md',
			})
		);

		expect(result.current.inputClasses).toBeDefined();
		expect(result.current.hasError).toBe(true);
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-color-input-class';
		const { result } = renderHook(() =>
			useColorInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
	});

	it('combines custom className with default classes', () => {
		const customClass = 'my-custom-class';
		const { result } = renderHook(() =>
			useColorInputState({
				size: 'md',
				className: customClass,
			})
		);

		expect(result.current.inputClasses).toContain(customClass);
		expect(result.current.inputClasses.length).toBeGreaterThan(customClass.length);
	});
});

describe('useColorInputState - Integration', () => {
	it('handles all options together', () => {
		const { result } = renderHook(() =>
			useColorInputState({
				colorInputId: 'test-id',
				label: 'Theme Color',
				error: 'Invalid color',
				helperText: 'Choose a color',
				size: 'lg',
				className: 'custom-class',
			})
		);

		expect(result.current.finalId).toBe('test-id');
		expect(result.current.hasError).toBe(true);
		expect(result.current.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.ariaDescribedBy).toContain('test-id-helper');
		expect(result.current.inputClasses).toContain('custom-class');
	});

	it('maintains state consistency across rerenders', () => {
		const { result, rerender } = renderHook(
			({ size }: { size: 'sm' | 'md' | 'lg' }) =>
				useColorInputState({
					colorInputId: 'test-id',
					label: 'Theme Color',
					size,
				}),
			{
				initialProps: { size: 'md' },
			}
		);

		const initialId = result.current.finalId;
		const initialClasses = result.current.inputClasses;

		rerender({ size: 'lg' });

		expect(result.current.finalId).toBe(initialId);
		expect(result.current.inputClasses).not.toBe(initialClasses);
	});
});

describe('useColorInputProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const props: ColorInputProps = {
			label: 'Theme Color',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'lg',
			fullWidth: true,
			colorInputId: 'custom-id',
			disabled: true,
			required: true,
			value: '#ff0000',
			onChange: () => {},
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.label).toBe('Theme Color');
		expect(result.current.error).toBe('Invalid color');
		expect(result.current.helperText).toBe('Choose a color');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});

	it('uses default values for optional props', () => {
		const props: ColorInputProps = {
			label: 'Color',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.label).toBe('Color');
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
	});

	it('defaults size to md when not provided', () => {
		const props: ColorInputProps = {
			label: 'Color',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.state).toBeDefined();
		// State should be computed with default size 'md'
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: ColorInputProps = {
			label: 'Color',
			value: '#00ff00',
			onChange,
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('#00ff00');
		expect(result.current.fieldProps.onChange).toBe(onChange);
	});

	it('extracts defaultValue correctly', () => {
		const props: ColorInputProps = {
			label: 'Color',
			defaultValue: '#0000ff',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps.defaultValue).toBe('#0000ff');
	});

	it('extracts disabled and required correctly', () => {
		const props: ColorInputProps = {
			label: 'Color',
			disabled: true,
			required: true,
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
	});
});

describe('useColorInputProps - State Computation', () => {
	it('computes state using useColorInputState', () => {
		const props: ColorInputProps = {
			label: 'Theme Color',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'lg',
			colorInputId: 'test-id',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.state).toBeDefined();
		expect(result.current.state.finalId).toBe('test-id');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('test-id-error');
		expect(result.current.state.ariaDescribedBy).toContain('test-id-helper');
	});

	it('passes computed state to field props', () => {
		const props: ColorInputProps = {
			label: 'Theme Color',
			colorInputId: 'test-id',
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBe(result.current.state.inputClasses);
		expect(result.current.fieldProps.hasError).toBe(result.current.state.hasError);
		expect(result.current.fieldProps.ariaDescribedBy).toBe(result.current.state.ariaDescribedBy);
	});
});

describe('useColorInputProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = () => {};
		const props: ColorInputProps = {
			label: 'Color',
			colorInputId: 'test-id',
			disabled: true,
			required: true,
			value: '#ff0000',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps).toBeDefined();
		expect(result.current.fieldProps.id).toBe('test-id');
		expect(result.current.fieldProps.className).toBeDefined();
		expect(result.current.fieldProps.hasError).toBe(false);
		expect(result.current.fieldProps.disabled).toBe(true);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.value).toBe('#ff0000');
		expect(result.current.fieldProps.onChange).toBe(onChange);
		expect(result.current.fieldProps.props).toBeDefined();
	});

	it('includes rest props in field props', () => {
		const props: ColorInputProps = {
			label: 'Color',
			placeholder: 'Choose a color',
			'data-testid': 'color-input',
			size: 'md',
		} as any;

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps.props).toBeDefined();
		expect(result.current.fieldProps.props.placeholder).toBe('Choose a color');
		expect((result.current.fieldProps.props as any)['data-testid']).toBe('color-input');
	});

	it('excludes controlled props from rest props', () => {
		const props: ColorInputProps = {
			label: 'Color',
			size: 'md',
			disabled: true,
			required: true,
			value: '#ff0000',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		// These should not be in props.rest
		expect(result.current.fieldProps.props).not.toHaveProperty('size');
		expect(result.current.fieldProps.props).not.toHaveProperty('type');
		expect(result.current.fieldProps.props).not.toHaveProperty('id');
		expect(result.current.fieldProps.props).not.toHaveProperty('className');
		expect(result.current.fieldProps.props).not.toHaveProperty('disabled');
		expect(result.current.fieldProps.props).not.toHaveProperty('required');
		expect(result.current.fieldProps.props).not.toHaveProperty('value');
	});

	it('handles uncontrolled mode with defaultValue', () => {
		const props: ColorInputProps = {
			label: 'Color',
			defaultValue: '#00ff00',
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps.defaultValue).toBe('#00ff00');
		expect(result.current.fieldProps.value).toBeUndefined();
	});

	it('handles controlled mode with value', () => {
		const props: ColorInputProps = {
			label: 'Color',
			value: '#0000ff',
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.fieldProps.value).toBe('#0000ff');
		expect(result.current.fieldProps.defaultValue).toBeUndefined();
	});
});

describe('useColorInputProps - Return Values', () => {
	it('returns all expected values', () => {
		const props: ColorInputProps = {
			label: 'Theme Color',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current).toHaveProperty('state');
		expect(result.current).toHaveProperty('fieldProps');
		expect(result.current).toHaveProperty('label');
		expect(result.current).toHaveProperty('error');
		expect(result.current).toHaveProperty('helperText');
		expect(result.current).toHaveProperty('required');
		expect(result.current).toHaveProperty('fullWidth');
	});

	it('returns extracted label, error, and helperText', () => {
		const props: ColorInputProps = {
			label: 'Theme Color',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.label).toBe('Theme Color');
		expect(result.current.error).toBe('Invalid color');
		expect(result.current.helperText).toBe('Choose a color');
	});

	it('returns required and fullWidth flags', () => {
		const props: ColorInputProps = {
			label: 'Color',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);
	});
});

describe('useColorInputProps - Integration', () => {
	it('handles complete ColorInput props flow', () => {
		const onChange = () => {};
		const props: ColorInputProps = {
			label: 'Theme Color',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'lg',
			fullWidth: true,
			colorInputId: 'theme-color-input',
			disabled: false,
			required: true,
			value: '#ff0000',
			onChange,
			placeholder: 'Select color',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		// Check extracted props
		expect(result.current.label).toBe('Theme Color');
		expect(result.current.error).toBe('Invalid color');
		expect(result.current.helperText).toBe('Choose a color');
		expect(result.current.required).toBe(true);
		expect(result.current.fullWidth).toBe(true);

		// Check computed state
		expect(result.current.state.finalId).toBe('theme-color-input');
		expect(result.current.state.hasError).toBe(true);
		expect(result.current.state.ariaDescribedBy).toContain('theme-color-input-error');
		expect(result.current.state.ariaDescribedBy).toContain('theme-color-input-helper');

		// Check field props
		expect(result.current.fieldProps.id).toBe('theme-color-input');
		expect(result.current.fieldProps.hasError).toBe(true);
		expect(result.current.fieldProps.disabled).toBe(false);
		expect(result.current.fieldProps.required).toBe(true);
		expect(result.current.fieldProps.value).toBe('#ff0000');
		expect(result.current.fieldProps.onChange).toBe(onChange);
		expect(result.current.fieldProps.props.placeholder).toBe('Select color');
	});

	it('handles minimal props', () => {
		const props: ColorInputProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useColorInputProps({ props }));

		expect(result.current.label).toBeUndefined();
		expect(result.current.error).toBeUndefined();
		expect(result.current.helperText).toBeUndefined();
		expect(result.current.required).toBeUndefined();
		expect(result.current.fullWidth).toBe(false);
		expect(result.current.state).toBeDefined();
		expect(result.current.fieldProps).toBeDefined();
	});

	it('updates when props change', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: ColorInputProps }) => useColorInputProps({ props }),
			{
				initialProps: {
					props: {
						label: 'Color',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.label).toBe('Color');
		expect(result.current.state.hasError).toBe(false);

		rerender({
			props: {
				label: 'Color',
				error: 'Invalid',
				size: 'md',
			},
		});

		expect(result.current.error).toBe('Invalid');
		expect(result.current.state.hasError).toBe(true);
	});
});
