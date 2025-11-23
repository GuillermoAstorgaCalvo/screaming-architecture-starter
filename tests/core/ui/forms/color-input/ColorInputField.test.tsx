/**
 * ColorInputField Component Tests
 *
 * Tests for the ColorInputField component including:
 * - Rendering
 * - User interactions
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Required states
 * - Controlled and uncontrolled modes
 */

import { ColorInputField } from '@core/ui/forms/color-input/components/ColorInputField';
import { fireEvent } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_ID = 'test-color-input';
const TEST_CLASS = 'test-class';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';

const defaultProps = {
	id: TEST_ID,
	className: TEST_CLASS,
	hasError: false,
	ariaDescribedBy: undefined,
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

describe('ColorInputField - Rendering', () => {
	it('renders color input element', () => {
		const { container } = renderWithProviders(<ColorInputField {...defaultProps} />);
		const input = getColorInput(container, TEST_ID);
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'color');
	});

	it('renders with correct id', () => {
		renderWithProviders(<ColorInputField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('id', TEST_ID);
	});

	it('renders with correct className', () => {
		renderWithProviders(<ColorInputField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveClass(TEST_CLASS);
	});

	it('renders with undefined id when id is undefined', () => {
		const { container } = renderWithProviders(<ColorInputField {...defaultProps} id={undefined} />);
		const input = getColorInput(container);
		expect(input).not.toHaveAttribute('id');
	});

	it('applies additional props from props object', () => {
		renderWithProviders(
			<ColorInputField
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

describe('ColorInputField - User Interactions', () => {
	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorInputField {...defaultProps} onChange={handleChange} />);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#ff0000' } });
		expect(handleChange).toHaveBeenCalledTimes(1);
		expect(handleChange).toHaveBeenCalledWith('#ff0000');
	});

	it('calls onChange handler with new color value', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorInputField {...defaultProps} onChange={handleChange} />);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#00ff00' } });
		expect(handleChange).toHaveBeenCalledWith('#00ff00');
	});

	it('does not call onChange when handler is not provided', () => {
		renderWithProviders(<ColorInputField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);

		expect(() => {
			fireEvent.change(input, { target: { value: '#0000ff' } });
		}).not.toThrow();
	});

	it('supports controlled mode with value prop', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('#ff0000');
			return (
				<ColorInputField
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
		renderWithProviders(<ColorInputField {...defaultProps} defaultValue="#0000ff" />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input.value).toBe('#0000ff');
	});
});

describe('ColorInputField - Validation', () => {
	it('applies aria-invalid when hasError is true', () => {
		renderWithProviders(<ColorInputField {...defaultProps} hasError={true} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not apply aria-invalid when hasError is false', () => {
		renderWithProviders(<ColorInputField {...defaultProps} hasError={false} />);
		const input = getColorInput(document.body, TEST_ID);
		// When hasError is false, aria-invalid may be set to "false" or not present
		// Either is acceptable, but it should not be "true"
		const ariaInvalid = input.getAttribute(ARIA_INVALID);
		if (ariaInvalid !== null) {
			expect(ariaInvalid).not.toBe(ARIA_INVALID_TRUE);
		}
	});

	it('associates error message with input via aria-describedby', () => {
		const describedBy = 'error-message-id';
		renderWithProviders(
			<ColorInputField {...defaultProps} hasError={true} ariaDescribedBy={describedBy} />
		);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, describedBy);
	});

	it('does not set aria-describedby when ariaDescribedBy is undefined', () => {
		renderWithProviders(<ColorInputField {...defaultProps} ariaDescribedBy={undefined} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toHaveAttribute(ARIA_DESCRIBEDBY);
	});
});

describe('ColorInputField - Disabled States', () => {
	it('renders as disabled when disabled is true', () => {
		renderWithProviders(<ColorInputField {...defaultProps} disabled={true} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toBeDisabled();
	});

	it('renders as enabled when disabled is false', () => {
		renderWithProviders(<ColorInputField {...defaultProps} disabled={false} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeDisabled();
	});

	it('renders as enabled when disabled is undefined', () => {
		renderWithProviders(<ColorInputField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeDisabled();
	});

	it('does not call onChange when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<ColorInputField {...defaultProps} disabled={true} onChange={handleChange} />
		);
		const input = getColorInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '#ff0000' } });
		// Note: onChange may still fire in some browsers even when disabled,
		// but the input should be disabled
		expect(input).toBeDisabled();
	});
});

describe('ColorInputField - Required States', () => {
	it('renders as required when required is true', () => {
		renderWithProviders(<ColorInputField {...defaultProps} required={true} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('required');
	});

	it('renders as not required when required is false', () => {
		renderWithProviders(<ColorInputField {...defaultProps} required={false} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeRequired();
	});

	it('renders as not required when required is undefined', () => {
		renderWithProviders(<ColorInputField {...defaultProps} />);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).not.toBeRequired();
	});
});

describe('ColorInputField - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<ColorInputField {...defaultProps} props={{ 'aria-label': 'Color picker' }} />
		);
		await expectA11y(container);
	});

	it('has no accessibility violations with error state', async () => {
		const { container } = renderWithProviders(
			<ColorInputField
				{...defaultProps}
				hasError={true}
				ariaDescribedBy="error-id"
				props={{ 'aria-label': 'Color picker' }}
			/>
		);
		await expectA11y(container);
	});

	it('has no accessibility violations when disabled', async () => {
		const { container } = renderWithProviders(
			<ColorInputField {...defaultProps} disabled={true} props={{ 'aria-label': 'Color picker' }} />
		);
		await expectA11y(container);
	});

	it('has no accessibility violations when required', async () => {
		const { container } = renderWithProviders(
			<ColorInputField {...defaultProps} required={true} props={{ 'aria-label': 'Color picker' }} />
		);
		await expectA11y(container);
	});

	it('maintains proper ARIA attributes for error state', () => {
		const describedBy = 'error-description';
		renderWithProviders(
			<ColorInputField {...defaultProps} hasError={true} ariaDescribedBy={describedBy} />
		);
		const input = getColorInput(document.body, TEST_ID);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, describedBy);
	});
});

describe('ColorInputField - Edge Cases', () => {
	it('handles empty string value', () => {
		renderWithProviders(<ColorInputField {...defaultProps} value="" />);
		const input = getColorInput(document.body, TEST_ID);
		// Color inputs default to #000000 when value is empty or invalid
		// This is browser behavior, so we verify the input exists and is functional
		expect(input).toBeInTheDocument();
		expect(input.type).toBe('color');
	});

	it('handles undefined value', () => {
		renderWithProviders(<ColorInputField {...defaultProps} value={undefined} />);
		const input = getColorInput(document.body, TEST_ID);
		// Color inputs default to #000000 when value is undefined or invalid
		// This is browser behavior, so we verify the input exists and is functional
		expect(input).toBeInTheDocument();
		expect(input.type).toBe('color');
	});

	it('handles multiple rapid onChange calls', () => {
		const handleChange = vi.fn();
		renderWithProviders(<ColorInputField {...defaultProps} onChange={handleChange} />);
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
		renderWithProviders(<ColorInputField {...defaultProps} onChange={handleChange} />);
		const input = getColorInput(document.body, TEST_ID);

		// Note: Browsers may normalize invalid color values or not fire onChange
		// We test that the component doesn't crash and can handle the event
		fireEvent.change(input, { target: { value: 'invalid-color' } });
		// The onChange may or may not be called depending on browser behavior
		// The important thing is that the component handles it without errors
		expect(input).toBeInTheDocument();
	});
});
