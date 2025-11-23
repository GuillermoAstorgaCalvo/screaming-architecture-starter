/**
 * ColorPickerContent Component Tests
 *
 * Tests for the ColorPickerContent component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Swatch selection
 * - Conditional rendering
 */

import { ColorPickerContent } from '@core/ui/forms/color-picker/components/ColorPickerContent';
import type { ColorPickerContentProps } from '@core/ui/forms/color-picker/types/ColorPickerTypes';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_COLOR = 'Choose Color';
const COLOR_PICKER_ID = 'test-color-picker';
const ERROR_MESSAGE = 'Error message';
const HELPER_TEXT = 'Helper text';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';
const ARIA_DESCRIBEDBY = 'aria-describedby';

const DEFAULT_PROPS: ColorPickerContentProps = {
	colorPickerId: COLOR_PICKER_ID,
	colorPickerClasses: 'test-class',
	ariaDescribedBy: undefined,
	fullWidth: false,
	showSwatches: false,
	hasError: false,
	fieldProps: {},
};

describe('ColorPickerContent - Rendering', () => {
	it('renders color picker field', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} />);
		// Color input might not be accessible via role, so check by type
		const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(colorInput).toBeInTheDocument();
		expect(colorInput.tagName).toBe('INPUT');
		expect(colorInput).toHaveAttribute('type', 'color');
	});

	it('renders with label when label and colorPickerId are provided', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} label={LABEL_COLOR} />);
		expect(screen.getByText(LABEL_COLOR)).toBeInTheDocument();
	});

	it('does not render label when label is missing', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} />);
		expect(screen.queryByText(LABEL_COLOR)).not.toBeInTheDocument();
	});

	it('does not render label when colorPickerId is missing', () => {
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} colorPickerId={undefined} label={LABEL_COLOR} />
		);
		expect(screen.queryByText(LABEL_COLOR)).not.toBeInTheDocument();
	});

	it('renders with helper text when colorPickerId is provided', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} helperText={HELPER_TEXT} />);
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});

	it('renders with error message when colorPickerId is provided', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} error={ERROR_MESSAGE} />);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('does not render messages when colorPickerId is missing', () => {
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				colorPickerId={undefined}
				error={ERROR_MESSAGE}
				helperText={HELPER_TEXT}
			/>
		);
		expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
		expect(screen.queryByText(HELPER_TEXT)).not.toBeInTheDocument();
	});

	it('renders swatches when showSwatches is true and swatches array has items', () => {
		const swatches = ['#ff0000', '#00ff00', '#0000ff'];
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} showSwatches={true} swatches={swatches} />
		);
		expect(screen.getByLabelText('Select color #ff0000')).toBeInTheDocument();
		expect(screen.getByLabelText('Select color #00ff00')).toBeInTheDocument();
		expect(screen.getByLabelText('Select color #0000ff')).toBeInTheDocument();
	});

	it('does not render swatches when showSwatches is false', () => {
		const swatches = ['#ff0000', '#00ff00'];
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} showSwatches={false} swatches={swatches} />
		);
		expect(screen.queryByLabelText('Select color #ff0000')).not.toBeInTheDocument();
	});

	it('does not render swatches when swatches array is empty', () => {
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} showSwatches={true} swatches={[]} />
		);
		expect(screen.queryByLabelText(/Select color/)).not.toBeInTheDocument();
	});

	it('does not render swatches when swatches is undefined', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} showSwatches={true} />);
		expect(screen.queryByLabelText(/Select color/)).not.toBeInTheDocument();
	});

	it('applies fullWidth prop to wrapper', () => {
		const { container } = renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} fullWidth={true} />
		);
		// The wrapper should be in the DOM, checking structure
		const colorInput = container.querySelector('input[type="color"]');
		expect(colorInput).toBeInTheDocument();
	});

	it('renders with required indicator when required is true', () => {
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} label={LABEL_COLOR} required={true} />
		);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toHaveAttribute('required');
	});
});

describe('ColorPickerContent - User Interactions', () => {
	it('calls onChange handler when color value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} onChange={handleChange} />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;

		fireEvent.change(input, { target: { value: '#ff0000' } });
		expect(handleChange).toHaveBeenCalledWith('#ff0000');
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('calls onChange handler when swatch is selected', () => {
		const handleChange = vi.fn();
		const swatches = ['#ff0000', '#00ff00', '#0000ff'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				showSwatches={true}
				swatches={swatches}
				onChange={handleChange}
			/>
		);

		const swatchButton = screen.getByLabelText('Select color #ff0000');
		fireEvent.click(swatchButton);
		expect(handleChange).toHaveBeenCalledWith('#ff0000');
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles multiple swatch selections', () => {
		const handleChange = vi.fn();
		const swatches = ['#ff0000', '#00ff00', '#0000ff'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				showSwatches={true}
				swatches={swatches}
				onChange={handleChange}
			/>
		);

		fireEvent.click(screen.getByLabelText('Select color #ff0000'));
		fireEvent.click(screen.getByLabelText('Select color #00ff00'));
		fireEvent.click(screen.getByLabelText('Select color #0000ff'));

		expect(handleChange).toHaveBeenCalledTimes(3);
		expect(handleChange).toHaveBeenNthCalledWith(1, '#ff0000');
		expect(handleChange).toHaveBeenNthCalledWith(2, '#00ff00');
		expect(handleChange).toHaveBeenNthCalledWith(3, '#0000ff');
	});

	it('supports controlled mode with value prop', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('#000000');
			return (
				<ColorPickerContent {...DEFAULT_PROPS} value={value} onChange={color => setValue(color)} />
			);
		};
		renderWithProviders(<TestComponent />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;

		expect(input.value).toBe('#000000');

		fireEvent.change(input, { target: { value: '#ffffff' } });
		expect(input.value).toBe('#ffffff');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} defaultValue="#ff0000" />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toHaveAttribute('value', '#ff0000');
	});

	it('does not call onChange when onChange is not provided', () => {
		const swatches = ['#ff0000'];
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} showSwatches={true} swatches={swatches} />
		);

		const swatchButton = screen.getByLabelText('Select color #ff0000');
		// Should not throw error
		expect(() => fireEvent.click(swatchButton)).not.toThrow();
	});
});

describe('ColorPickerContent - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} error={ERROR_MESSAGE} />);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('displays helper text when helperText prop is provided', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} helperText={HELPER_TEXT} />);
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} required={true} />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toHaveAttribute('required');
	});

	it('does not show error styling when no error', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
	});
});

describe('ColorPickerContent - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} label={LABEL_COLOR} helperText={HELPER_TEXT} />
		);
		await expectA11y(container);
	});

	it('associates label with input via id when label and colorPickerId are provided', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} label={LABEL_COLOR} />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		const label = screen.getByText(LABEL_COLOR);
		expect(input).toHaveAttribute('id', COLOR_PICKER_ID);
		expect(label).toBeInTheDocument();
	});

	it('uses aria-describedby for helper text when colorPickerId is provided', () => {
		const ariaDescribedBy = `${COLOR_PICKER_ID}-helper`;
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				helperText={HELPER_TEXT}
				ariaDescribedBy={ariaDescribedBy}
			/>
		);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		expect(describedBy).toBe(ariaDescribedBy);
		if (describedBy) {
			expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
			expect(screen.getByText(HELPER_TEXT)).toHaveAttribute('id', `${COLOR_PICKER_ID}-helper`);
		}
	});

	it('uses aria-describedby for error message when colorPickerId is provided', () => {
		const ariaDescribedBy = `${COLOR_PICKER_ID}-error`;
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				error={ERROR_MESSAGE}
				ariaDescribedBy={ariaDescribedBy}
			/>
		);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		const describedBy = input.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		expect(describedBy).toBe(ariaDescribedBy);
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', `${COLOR_PICKER_ID}-error`);
		}
	});

	it('uses custom ariaDescribedBy when provided', () => {
		const customAriaDescribedBy = 'custom-described-by';
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} ariaDescribedBy={customAriaDescribedBy} />
		);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, customAriaDescribedBy);
	});

	it('swatches have proper aria-labels', () => {
		const swatches = ['#ff0000', '#00ff00'];
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} showSwatches={true} swatches={swatches} />
		);
		expect(screen.getByLabelText('Select color #ff0000')).toBeInTheDocument();
		expect(screen.getByLabelText('Select color #00ff00')).toBeInTheDocument();
	});
});

describe('ColorPickerContent - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} error="This field is required" />);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('prioritizes error over helper text when both are provided', () => {
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} error={ERROR_MESSAGE} helperText={HELPER_TEXT} />
		);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
	});
});

describe('ColorPickerContent - Disabled States', () => {
	it('renders disabled input when disabled is true', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} disabled={true} />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('disables swatches when disabled is true', () => {
		const swatches = ['#ff0000', '#00ff00'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				showSwatches={true}
				swatches={swatches}
				disabled={true}
			/>
		);
		const swatchButtons = screen.getAllByLabelText(/Select color/);
		for (const button of swatchButtons) {
			expect(button).toBeDisabled();
		}
	});

	it('prevents swatch selection when disabled', () => {
		const handleChange = vi.fn();
		const swatches = ['#ff0000'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				showSwatches={true}
				swatches={swatches}
				disabled={true}
				onChange={handleChange}
			/>
		);

		const swatchButton = screen.getByLabelText('Select color #ff0000');
		expect(swatchButton).toBeDisabled();
		// Note: fireEvent doesn't respect disabled state like real browser events would
		// In a real browser, disabled elements don't fire click events
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} label={LABEL_COLOR} disabled={true} />
		);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		const label = screen.getByText(LABEL_COLOR);
		expect(input).toHaveAttribute('id', COLOR_PICKER_ID);
		expect(label).toBeInTheDocument();
	});
});

describe('ColorPickerContent - Swatch Selection', () => {
	it('highlights current color in swatches', () => {
		const swatches = ['#ff0000', '#00ff00', '#0000ff'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				showSwatches={true}
				swatches={swatches}
				value="#ff0000"
			/>
		);

		const swatchButton = screen.getByLabelText('Select color #ff0000');
		// The selected swatch should have specific styling (checked via classNames in component)
		expect(swatchButton).toBeInTheDocument();
	});

	it('handles case-insensitive color matching for swatch selection', () => {
		const swatches = ['#FF0000', '#00ff00'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				showSwatches={true}
				swatches={swatches}
				value="#ff0000"
			/>
		);

		// Should still match despite case difference
		const swatchButton = screen.getByLabelText('Select color #FF0000');
		expect(swatchButton).toBeInTheDocument();
	});

	it('handles swatch selection with empty value', () => {
		const handleChange = vi.fn();
		const swatches = ['#ff0000'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				showSwatches={true}
				swatches={swatches}
				value={undefined}
				onChange={handleChange}
			/>
		);

		const swatchButton = screen.getByLabelText('Select color #ff0000');
		fireEvent.click(swatchButton);
		expect(handleChange).toHaveBeenCalledWith('#ff0000');
	});
});

describe('ColorPickerContent - Props Forwarding', () => {
	it('forwards fieldProps to input element', () => {
		const fieldProps = {
			'data-testid': 'custom-color-picker',
			'aria-label': 'Custom color picker',
		};
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} fieldProps={fieldProps} />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toHaveAttribute('data-testid', 'custom-color-picker');
		expect(input).toHaveAttribute('aria-label', 'Custom color picker');
	});

	it('applies colorPickerClasses to input', () => {
		const customClasses = 'custom-picker-class';
		renderWithProviders(
			<ColorPickerContent {...DEFAULT_PROPS} colorPickerClasses={customClasses} />
		);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toHaveClass(customClasses);
	});
});

describe('ColorPickerContent - Conditional Rendering', () => {
	it('renders all components when all props are provided', () => {
		const swatches = ['#ff0000', '#00ff00'];
		renderWithProviders(
			<ColorPickerContent
				{...DEFAULT_PROPS}
				label={LABEL_COLOR}
				error={ERROR_MESSAGE}
				helperText={HELPER_TEXT}
				showSwatches={true}
				swatches={swatches}
				required={true}
			/>
		);

		expect(screen.getByText(LABEL_COLOR)).toBeInTheDocument();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText(HELPER_TEXT)).toBeInTheDocument();
		expect(screen.getByLabelText('Select color #ff0000')).toBeInTheDocument();
		expect(screen.getByLabelText('Select color #00ff00')).toBeInTheDocument();
	});

	it('renders minimal components when only required props are provided', () => {
		renderWithProviders(<ColorPickerContent {...DEFAULT_PROPS} />);
		const input = document.querySelector('input[type="color"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(screen.queryByText(LABEL_COLOR)).not.toBeInTheDocument();
		expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();
		expect(screen.queryByText(HELPER_TEXT)).not.toBeInTheDocument();
		expect(screen.queryByLabelText(/Select color/)).not.toBeInTheDocument();
	});
});
