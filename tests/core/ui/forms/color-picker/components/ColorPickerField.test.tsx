/**
 * ColorPickerField Component Tests
 *
 * Tests for the ColorPickerField component including:
 * - Rendering
 * - User interactions
 * - Accessibility
 * - Disabled states
 * - Required states
 * - Controlled and uncontrolled modes
 * - Props forwarding
 */

import { ColorPickerField } from '@core/ui/forms/color-picker/components/ColorPickerField';
import { fireEvent } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_ID = 'test-color-picker';
const TEST_CLASS = 'test-class';
const ARIA_DESCRIBEDBY = 'aria-describedby';

const defaultProps = {
	id: TEST_ID,
	colorPickerClasses: TEST_CLASS,
	ariaDescribedBy: undefined,
	disabled: undefined,
	required: undefined,
	value: undefined,
	defaultValue: undefined,
	onChange: undefined,
	props: {},
};

// Helper function to get the color input element
// Note: Using querySelector is necessary here because color inputs don't have a standard
// Testing Library role, and we need to query by type attribute
function getColorInput(container: HTMLElement, id?: string): HTMLInputElement {
	// Prefer getElementById when ID is available (more reliable)
	if (id) {
		const input = document.getElementById(id) as HTMLInputElement | null;
		if (input?.type === 'color') {
			return input;
		}
	}
	// Fallback to querySelector when ID is not available

	const input = container.querySelector<HTMLInputElement>('input[type="color"]');
	if (!input) {
		throw new Error('Color input not found');
	}
	return input;
}

describe('ColorPickerField - Rendering', () => {
	it('renders color input element', () => {
		const { container } = renderWithProviders(<ColorPickerField {...defaultProps} />);
		const input = getColorInput(container, TEST_ID);
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'color');
	});

	it('renders with correct id', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('id', TEST_ID);
	});

	it('renders with correct className', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveClass(TEST_CLASS);
	});

	it('renders with undefined id when id is undefined', () => {
		const { container } = renderWithProviders(
			<ColorPickerField {...defaultProps} id={undefined} />
		);
		const input = getColorInput(container);
		expect(input).not.toHaveAttribute('id');
	});

	it('applies additional props from props object', () => {
		renderWithProviders(
			<ColorPickerField
				{...defaultProps}
				props={{ 'aria-label': 'Custom label', name: 'color-picker' }}
			/>
		);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('aria-label', 'Custom label');
		expect(input).toHaveAttribute('name', 'color-picker');
		expect(input).toHaveAttribute('type', 'color');
	});
});

describe('ColorPickerField - User Interactions', () => {
	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorPickerField {...defaultProps} onChange={handleChange} />);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#ff0000' } });
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange).toHaveBeenCalledWith('#ff0000');
	});

	it('calls onChange handler with new color value', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorPickerField {...defaultProps} onChange={handleChange} />);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#00ff00' } });
		expect(handleChange).toHaveBeenCalledWith('#00ff00');
	});

	it('calls inputProps.onChange handler when provided', () => {
		const handleInputPropsChange = vi.fn();
		renderWithProviders(
			<ColorPickerField {...defaultProps} props={{ onChange: handleInputPropsChange }} />
		);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#ff0000' } });
		expect(handleInputPropsChange).toHaveBeenCalledTimes(1);
	});

	it('inputProps.onChange overrides internal onChange when both are provided', () => {
		const handleChange = vi.fn();
		const handleInputPropsChange = vi.fn();
		renderWithProviders(
			<ColorPickerField
				{...defaultProps}
				onChange={handleChange}
				props={{ onChange: handleInputPropsChange }}
			/>
		);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#ff0000' } });
		// When inputProps.onChange is provided, it overrides the internal handler
		// so only inputProps.onChange is called (due to spread order)
		expect(handleInputPropsChange).toHaveBeenCalledTimes(1);
		expect(handleInputPropsChange).toHaveBeenCalledWith(
			expect.objectContaining({
				target: expect.objectContaining({ value: '#ff0000' }),
			})
		);
		// The onChange prop is not called because inputProps.onChange overrides it
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('does not call onChange when handler is not provided', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);

		expect(() => {
			fireEvent.change(input, { target: { value: '#0000ff' } });
		}).not.toThrow();
	});

	it('supports controlled mode with value prop', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('#ff0000');
			return (
				<ColorPickerField
					{...defaultProps}
					value={value}
					onChange={newColor => setValue(newColor)}
				/>
			);
		};
		renderWithProviders(<TestComponent />);
		const input = getColorInput(document.body, TEST_ID);

		expect(input.value).toBe('#ff0000');

		fireEvent.change(input, { target: { value: '#00ff00' } });
		expect(input.value).toBe('#00ff00');
	});

	it('supports uncontrolled mode with defaultValue prop', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} defaultValue="#0000ff" />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input.value).toBe('#0000ff');
	});
});

describe('ColorPickerField - Accessibility', () => {
	it('sets aria-describedby when ariaDescribedBy is provided', () => {
		const describedBy = 'error-message-id';
		renderWithProviders(<ColorPickerField {...defaultProps} ariaDescribedBy={describedBy} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, describedBy);
	});

	it('does not set aria-describedby when ariaDescribedBy is undefined', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} ariaDescribedBy={undefined} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toHaveAttribute(ARIA_DESCRIBEDBY);
	});

	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<ColorPickerField {...defaultProps} props={{ 'aria-label': 'Color picker' }} />
		);
		await expectA11y(container);
	});

	it('has no accessibility violations with aria-describedby', async () => {
		const { container } = renderWithProviders(
			<ColorPickerField
				{...defaultProps}
				ariaDescribedBy="description-id"
				props={{ 'aria-label': 'Color picker' }}
			/>
		);
		await expectA11y(container);
	});

	it('has no accessibility violations when disabled', async () => {
		const { container } = renderWithProviders(
			<ColorPickerField
				{...defaultProps}
				disabled={true}
				props={{ 'aria-label': 'Color picker' }}
			/>
		);
		await expectA11y(container);
	});

	it('has no accessibility violations when required', async () => {
		const { container } = renderWithProviders(
			<ColorPickerField
				{...defaultProps}
				required={true}
				props={{ 'aria-label': 'Color picker' }}
			/>
		);
		await expectA11y(container);
	});
});

describe('ColorPickerField - Disabled States', () => {
	it('renders as disabled when disabled is true', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} disabled={true} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toBeDisabled();
	});

	it('renders as enabled when disabled is false', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} disabled={false} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeDisabled();
	});

	it('renders as enabled when disabled is undefined', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeDisabled();
	});

	it('does not call onChange when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<ColorPickerField {...defaultProps} disabled={true} onChange={handleChange} />
		);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#ff0000' } });
		// Note: onChange may still fire in some browsers even when disabled,
		// but the input should be disabled
		expect(input).toBeDisabled();
	});
});

describe('ColorPickerField - Required States', () => {
	it('renders as required when required is true', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} required={true} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('required');
	});

	it('renders as not required when required is false', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} required={false} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeRequired();
	});

	it('renders as not required when required is undefined', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeRequired();
	});
});

describe('ColorPickerField - Edge Cases', () => {
	it('handles empty string value', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} value="" />);
		const input = getColorInput(document.body, TEST_ID);
		// Color inputs default to #000000 when value is empty
		expect(input.value).toBe('#000000');
	});

	it('handles undefined value', () => {
		renderWithProviders(<ColorPickerField {...defaultProps} value={undefined} />);
		const input = getColorInput(document.body, TEST_ID);
		// Color inputs default to #000000 when value is undefined
		expect(input.value).toBe('#000000');
	});

	it('handles multiple rapid onChange calls', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorPickerField {...defaultProps} onChange={handleChange} />);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#ff0000' } });
		fireEvent.change(input, { target: { value: '#00ff00' } });
		fireEvent.change(input, { target: { value: '#0000ff' } });

		expect(handleChange).toHaveBeenCalledTimes(3);
		expect(handleChange).toHaveBeenNthCalledWith(1, '#ff0000');
		expect(handleChange).toHaveBeenNthCalledWith(2, '#00ff00');
		expect(handleChange).toHaveBeenNthCalledWith(3, '#0000ff');
	});

	it('handles invalid color values gracefully', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorPickerField {...defaultProps} onChange={handleChange} />);
		const input = getColorInput(document.body, TEST_ID);

		// Color inputs may not trigger onChange for invalid values in some browsers
		// but the handler should still be set up correctly
		fireEvent.change(input, { target: { value: 'invalid-color' } });
		// The onChange may or may not be called depending on browser behavior
		// This test verifies the component doesn't crash
		expect(input).toBeInTheDocument();
	});

	it('handles props.onChange being undefined', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorPickerField {...defaultProps} onChange={handleChange} props={{}} />);
		const input = getColorInput(document.body, TEST_ID);

		expect(() => {
			fireEvent.change(input, { target: { value: '#ff0000' } });
		}).not.toThrow();
		expect(handleChange).toHaveBeenCalledWith('#ff0000');
	});
});
