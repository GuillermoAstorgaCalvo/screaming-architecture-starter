/**
 * useColorPicker Tests
 *
 * Tests for the useColorPicker hook:
 * - useColorPickerProps: Prop processing, state computation, content props building
 */

import { useColorPickerProps } from '@core/ui/forms/color-picker/hooks/useColorPicker';
import type { ColorPickerProps } from '@src-types/ui/forms-advanced';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useColorPickerProps - ID Generation', () => {
	it('generates ID from label when colorPickerId is not provided', () => {
		const props: ColorPickerProps = {
			label: 'Theme Color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerId).toBeDefined();
		expect(typeof result.current.contentProps.colorPickerId).toBe('string');
	});

	it('uses provided colorPickerId when available', () => {
		const customId = 'custom-color-picker-id';
		const props: ColorPickerProps = {
			colorPickerId: customId,
			label: 'Theme Color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerId).toBe(customId);
	});

	it('returns undefined when no label and no colorPickerId provided', () => {
		const props: ColorPickerProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerId).toBeUndefined();
	});

	it('generates ID when label is provided even without colorPickerId', () => {
		const props: ColorPickerProps = {
			label: 'Background Color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerId).toBeDefined();
		expect(typeof result.current.contentProps.colorPickerId).toBe('string');
	});

	it('prioritizes colorPickerId over label for ID generation', () => {
		const customId = 'my-custom-id';
		const props: ColorPickerProps = {
			colorPickerId: customId,
			label: 'Theme Color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerId).toBe(customId);
	});
});

describe('useColorPickerProps - Error State', () => {
	it('includes error classes when error is provided', () => {
		const props: ColorPickerProps = {
			error: 'Invalid color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.error).toBe('Invalid color');
		expect(result.current.contentProps.colorPickerClasses).toBeDefined();
		expect(typeof result.current.contentProps.colorPickerClasses).toBe('string');
	});

	it('handles no error state', () => {
		const props: ColorPickerProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.error).toBeUndefined();
		expect(result.current.contentProps.colorPickerClasses).toBeDefined();
	});

	it('updates when error changes', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: ColorPickerProps }) => useColorPickerProps({ props }),
			{
				initialProps: {
					props: {
						colorPickerId: 'test-picker',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.contentProps.error).toBeUndefined();

		rerender({
			props: {
				colorPickerId: 'test-picker',
				error: 'Error message',
				size: 'md',
			},
		});
		expect(result.current.contentProps.error).toBe('Error message');

		rerender({
			props: {
				colorPickerId: 'test-picker',
				size: 'md',
			},
		});
		expect(result.current.contentProps.error).toBeUndefined();
	});
});

describe('useColorPickerProps - ARIA Attributes', () => {
	it('generates aria-describedby with error ID when error is provided', () => {
		const props: ColorPickerProps = {
			colorPickerId: 'test-color-picker',
			error: 'Invalid color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBe('test-color-picker-error');
	});

	it('generates aria-describedby with helper text ID when helperText is provided', () => {
		const props: ColorPickerProps = {
			colorPickerId: 'test-color-picker',
			helperText: 'Choose a color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBe('test-color-picker-helper');
	});

	it('generates aria-describedby with both error and helper text IDs', () => {
		const props: ColorPickerProps = {
			colorPickerId: 'test-color-picker',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toContain('test-color-picker-error');
		expect(result.current.contentProps.ariaDescribedBy).toContain('test-color-picker-helper');
	});

	it('returns undefined for aria-describedby when no error or helperText', () => {
		const props: ColorPickerProps = {
			colorPickerId: 'test-color-picker',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBeUndefined();
	});

	it('returns undefined for aria-describedby when colorPickerId is undefined', () => {
		const props: ColorPickerProps = {
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.ariaDescribedBy).toBeUndefined();
	});

	it('updates aria-describedby when error changes', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: ColorPickerProps }) => useColorPickerProps({ props }),
			{
				initialProps: {
					props: {
						colorPickerId: 'test-color-picker',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.contentProps.ariaDescribedBy).toBeUndefined();

		rerender({
			props: {
				colorPickerId: 'test-color-picker',
				error: 'Error message',
				size: 'md',
			},
		});
		expect(result.current.contentProps.ariaDescribedBy).toBe('test-color-picker-error');

		rerender({
			props: {
				colorPickerId: 'test-color-picker',
				size: 'md',
			},
		});
		expect(result.current.contentProps.ariaDescribedBy).toBeUndefined();
	});
});

describe('useColorPickerProps - CSS Classes', () => {
	it('generates color picker classes with default size', () => {
		const props: ColorPickerProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerClasses).toBeDefined();
		expect(typeof result.current.contentProps.colorPickerClasses).toBe('string');
	});

	it('generates color picker classes for small size', () => {
		const props: ColorPickerProps = {
			size: 'sm',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerClasses).toBeDefined();
		expect(typeof result.current.contentProps.colorPickerClasses).toBe('string');
	});

	it('generates color picker classes for large size', () => {
		const props: ColorPickerProps = {
			size: 'lg',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerClasses).toBeDefined();
		expect(typeof result.current.contentProps.colorPickerClasses).toBe('string');
	});

	it('applies custom className when provided', () => {
		const customClass = 'custom-color-picker-class';
		const props: ColorPickerProps = {
			size: 'md',
			className: customClass,
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerClasses).toContain(customClass);
	});

	it('combines custom className with default classes', () => {
		const customClass = 'my-custom-class';
		const props: ColorPickerProps = {
			size: 'md',
			className: customClass,
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerClasses).toContain(customClass);
		expect(result.current.contentProps.colorPickerClasses.length).toBeGreaterThan(
			customClass.length
		);
	});

	it('defaults size to md when not provided', () => {
		const props: ColorPickerProps = {
			label: 'Color',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.colorPickerClasses).toBeDefined();
		expect(typeof result.current.contentProps.colorPickerClasses).toBe('string');
	});
});

describe('useColorPickerProps - Prop Extraction', () => {
	it('extracts all props correctly', () => {
		const onChange = () => {};
		const props: ColorPickerProps = {
			label: 'Theme Color',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'lg',
			fullWidth: true,
			colorPickerId: 'custom-id',
			disabled: true,
			required: true,
			value: '#ff0000',
			swatches: ['#ff0000', '#00ff00', '#0000ff'],
			showSwatches: true,
			onChange,
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.label).toBe('Theme Color');
		expect(result.current.contentProps.error).toBe('Invalid color');
		expect(result.current.contentProps.helperText).toBe('Choose a color');
		expect(result.current.contentProps.required).toBe(true);
		expect(result.current.contentProps.fullWidth).toBe(true);
		expect(result.current.contentProps.disabled).toBe(true);
		expect(result.current.contentProps.value).toBe('#ff0000');
		expect(result.current.contentProps.swatches).toEqual(['#ff0000', '#00ff00', '#0000ff']);
		expect(result.current.contentProps.showSwatches).toBe(true);
		expect(result.current.contentProps.onChange).toBe(onChange);
	});

	it('uses default values for optional props', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.label).toBe('Color');
		expect(result.current.contentProps.error).toBeUndefined();
		expect(result.current.contentProps.helperText).toBeUndefined();
		expect(result.current.contentProps.required).toBeUndefined();
		expect(result.current.contentProps.fullWidth).toBe(false);
		expect(result.current.contentProps.disabled).toBeUndefined();
		expect(result.current.contentProps.showSwatches).toBe(true);
	});

	it('defaults showSwatches to true when not provided', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.showSwatches).toBe(true);
	});

	it('respects showSwatches when explicitly set to false', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			size: 'md',
			showSwatches: false,
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.showSwatches).toBe(false);
	});

	it('extracts value and onChange correctly', () => {
		const onChange = () => {};
		const props: ColorPickerProps = {
			label: 'Color',
			value: '#00ff00',
			onChange,
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.value).toBe('#00ff00');
		expect(result.current.contentProps.onChange).toBe(onChange);
	});

	it('extracts defaultValue correctly', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			defaultValue: '#0000ff',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.defaultValue).toBe('#0000ff');
	});

	it('extracts disabled and required correctly', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			disabled: true,
			required: true,
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.disabled).toBe(true);
		expect(result.current.contentProps.required).toBe(true);
	});
});

describe('useColorPickerProps - Field Props Building', () => {
	it('builds complete field props object', () => {
		const onChange = () => {};
		const props: ColorPickerProps = {
			label: 'Color',
			colorPickerId: 'test-id',
			disabled: true,
			required: true,
			value: '#ff0000',
			onChange,
			size: 'md',
			placeholder: 'Select color',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.fieldProps).toBeDefined();
		expect(result.current.contentProps.fieldProps).toHaveProperty('placeholder', 'Select color');
	});

	it('includes rest props in field props', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			'data-testid': 'color-picker',
			size: 'md',
		} as any;

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.fieldProps).toBeDefined();
		expect(result.current.contentProps.fieldProps).toHaveProperty('data-testid', 'color-picker');
	});

	it('excludes controlled props from field props', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			size: 'md',
			disabled: true,
			required: true,
			value: '#ff0000',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		// These should not be in fieldProps directly (they're in contentProps)
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('size');
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('type');
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('label');
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('error');
		expect(result.current.contentProps.fieldProps).not.toHaveProperty('helperText');
	});

	it('handles uncontrolled mode with defaultValue', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			defaultValue: '#00ff00',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.defaultValue).toBe('#00ff00');
		expect(result.current.contentProps.value).toBeUndefined();
	});

	it('handles controlled mode with value', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			value: '#0000ff',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.value).toBe('#0000ff');
		expect(result.current.contentProps.defaultValue).toBeUndefined();
	});
});

describe('useColorPickerProps - Return Values', () => {
	it('returns all expected values in contentProps', () => {
		const props: ColorPickerProps = {
			label: 'Theme Color',
			error: 'Invalid',
			helperText: 'Helper',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps).toHaveProperty('colorPickerId');
		expect(result.current.contentProps).toHaveProperty('colorPickerClasses');
		expect(result.current.contentProps).toHaveProperty('ariaDescribedBy');
		expect(result.current.contentProps).toHaveProperty('label');
		expect(result.current.contentProps).toHaveProperty('error');
		expect(result.current.contentProps).toHaveProperty('helperText');
		expect(result.current.contentProps).toHaveProperty('required');
		expect(result.current.contentProps).toHaveProperty('fullWidth');
		expect(result.current.contentProps).toHaveProperty('showSwatches');
		expect(result.current.contentProps).toHaveProperty('fieldProps');
	});

	it('returns extracted label, error, and helperText', () => {
		const props: ColorPickerProps = {
			label: 'Theme Color',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.label).toBe('Theme Color');
		expect(result.current.contentProps.error).toBe('Invalid color');
		expect(result.current.contentProps.helperText).toBe('Choose a color');
	});

	it('returns required and fullWidth flags', () => {
		const props: ColorPickerProps = {
			label: 'Color',
			required: true,
			fullWidth: true,
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.required).toBe(true);
		expect(result.current.contentProps.fullWidth).toBe(true);
	});
});

describe('useColorPickerProps - Integration', () => {
	it('handles complete ColorPicker props flow', () => {
		const onChange = () => {};
		const props: ColorPickerProps = {
			label: 'Theme Color',
			error: 'Invalid color',
			helperText: 'Choose a color',
			size: 'lg',
			fullWidth: true,
			colorPickerId: 'theme-color-picker',
			disabled: false,
			required: true,
			value: '#ff0000',
			swatches: ['#ff0000', '#00ff00', '#0000ff'],
			showSwatches: true,
			onChange,
			placeholder: 'Select color',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		// Check extracted props
		expect(result.current.contentProps.label).toBe('Theme Color');
		expect(result.current.contentProps.error).toBe('Invalid color');
		expect(result.current.contentProps.helperText).toBe('Choose a color');
		expect(result.current.contentProps.required).toBe(true);
		expect(result.current.contentProps.fullWidth).toBe(true);
		expect(result.current.contentProps.disabled).toBe(false);
		expect(result.current.contentProps.value).toBe('#ff0000');
		expect(result.current.contentProps.swatches).toEqual(['#ff0000', '#00ff00', '#0000ff']);
		expect(result.current.contentProps.showSwatches).toBe(true);
		expect(result.current.contentProps.onChange).toBe(onChange);

		// Check computed state
		expect(result.current.contentProps.colorPickerId).toBe('theme-color-picker');
		expect(result.current.contentProps.ariaDescribedBy).toContain('theme-color-picker-error');
		expect(result.current.contentProps.ariaDescribedBy).toContain('theme-color-picker-helper');
		expect(result.current.contentProps.colorPickerClasses).toBeDefined();

		// Check field props
		expect(result.current.contentProps.fieldProps).toBeDefined();
		expect(result.current.contentProps.fieldProps).toHaveProperty('placeholder', 'Select color');
	});

	it('handles minimal props', () => {
		const props: ColorPickerProps = {
			size: 'md',
		};

		const { result } = renderHook(() => useColorPickerProps({ props }));

		expect(result.current.contentProps.label).toBeUndefined();
		expect(result.current.contentProps.error).toBeUndefined();
		expect(result.current.contentProps.helperText).toBeUndefined();
		expect(result.current.contentProps.required).toBeUndefined();
		expect(result.current.contentProps.fullWidth).toBe(false);
		expect(result.current.contentProps.showSwatches).toBe(true);
		expect(result.current.contentProps.colorPickerId).toBeUndefined();
		expect(result.current.contentProps.colorPickerClasses).toBeDefined();
		expect(result.current.contentProps.fieldProps).toBeDefined();
	});

	it('updates when props change', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: ColorPickerProps }) => useColorPickerProps({ props }),
			{
				initialProps: {
					props: {
						label: 'Color',
						size: 'md',
					},
				},
			}
		);

		expect(result.current.contentProps.label).toBe('Color');
		expect(result.current.contentProps.error).toBeUndefined();

		rerender({
			props: {
				label: 'Color',
				error: 'Invalid',
				size: 'md',
			},
		});

		expect(result.current.contentProps.error).toBe('Invalid');
		expect(result.current.contentProps.ariaDescribedBy).toBeDefined();
	});

	it('maintains state consistency across rerenders', () => {
		const { result, rerender } = renderHook(
			({ props }: { props: ColorPickerProps }) => useColorPickerProps({ props }),
			{
				initialProps: {
					props: {
						colorPickerId: 'test-id',
						label: 'Theme Color',
						size: 'md',
					},
				},
			}
		);

		const initialId = result.current.contentProps.colorPickerId;
		const initialClasses = result.current.contentProps.colorPickerClasses;

		rerender({
			props: {
				colorPickerId: 'test-id',
				label: 'Theme Color',
				size: 'lg',
			},
		});

		expect(result.current.contentProps.colorPickerId).toBe(initialId);
		expect(result.current.contentProps.colorPickerClasses).not.toBe(initialClasses);
	});
});
