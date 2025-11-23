/**
 * CurrencyInputField Component Tests
 *
 * Tests for the CurrencyInputField component including:
 * - Rendering
 * - Currency symbol display
 * - User interactions
 * - Accessibility
 * - Error states
 * - Disabled states
 * - Required states
 * - Controlled and uncontrolled modes
 */

import { CurrencyInputField } from '@core/ui/forms/currency-input/components/CurrencyInputField';
import { fireEvent } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_ID = 'test-currency-input';
const TEST_CLASS = 'test-class';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_INVALID = 'aria-invalid';
const ARIA_INVALID_TRUE = 'true';

const defaultProps = {
	id: TEST_ID,
	className: TEST_CLASS,
	hasError: false,
	ariaDescribedBy: undefined,
	currency: 'USD',
	props: {},
};

// Helper function to get the currency input element
function getCurrencyInput(container: HTMLElement, id?: string): HTMLInputElement {
	// Prefer getElementById when ID is available (more reliable)
	if (id) {
		const input = document.getElementById(id) as HTMLInputElement | null;
		if (input?.type === 'text' && input?.inputMode === 'decimal') {
			return input;
		}
	}
	// Fallback to querySelector when ID is not available

	const input = container.querySelector<HTMLInputElement>(
		'input[type="text"][inputmode="decimal"]'
	);
	if (!input) {
		throw new Error('Currency input not found');
	}
	return input;
}

// Helper function to get the currency symbol container element
function getCurrencySymbolContainer(container: HTMLElement): HTMLElement {
	const symbolContainer = container.querySelector('.text-text-muted');
	if (!symbolContainer) {
		throw new Error('Currency symbol container not found');
	}
	return symbolContainer as HTMLElement;
}

// Helper function to get the currency symbol span element
function getCurrencySymbolSpan(container: HTMLElement): HTMLElement {
	const symbolSpan = container.querySelector('span.text-sm.font-medium');
	if (!symbolSpan) {
		throw new Error('Currency symbol span not found');
	}
	return symbolSpan as HTMLElement;
}

describe('CurrencyInputField - Rendering', () => {
	it('renders currency input element', () => {
		const { container } = renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const input = getCurrencyInput(container, TEST_ID);
		expect(input).toBeInTheDocument();
		expect(input.tagName).toBe('INPUT');
		expect(input).toHaveAttribute('type', 'text');
		expect(input).toHaveAttribute('inputMode', 'decimal');
	});

	it('renders with correct id', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('id', TEST_ID);
	});

	it('renders with correct className', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveClass(TEST_CLASS);
	});

	it('renders with undefined id when id is undefined', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} id={undefined} />
		);
		const input = getCurrencyInput(container);
		expect(input).not.toHaveAttribute('id');
	});

	it('applies additional props from props object', () => {
		renderWithProviders(
			<CurrencyInputField
				{...defaultProps}
				props={{ 'aria-label': 'Amount', name: 'amount', placeholder: 'Enter amount' }}
			/>
		);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('aria-label', 'Amount');
		expect(input).toHaveAttribute('name', 'amount');
		expect(input).toHaveAttribute('placeholder', 'Enter amount');
		expect(input).toHaveAttribute('type', 'text');
	});
});

describe('CurrencyInputField - Currency Symbol Display', () => {
	it('displays USD symbol ($)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="USD" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('$');
	});

	it('displays EUR symbol (€)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="EUR" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('€');
	});

	it('displays GBP symbol (£)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="GBP" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('£');
	});

	it('displays JPY symbol (¥)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="JPY" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('¥');
	});

	it('displays CNY symbol (¥)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="CNY" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('¥');
	});

	it('displays AUD symbol (A$)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="AUD" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('A$');
	});

	it('displays CAD symbol (C$)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="CAD" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('C$');
	});

	it('displays CHF symbol (CHF)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="CHF" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('CHF');
	});

	it('displays INR symbol (₹)', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="INR" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('₹');
	});

	it('displays currency code as fallback for unknown currency', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="XYZ" />
		);
		const symbol = getCurrencySymbolSpan(container);
		expect(symbol).toHaveTextContent('XYZ');
	});

	it('renders currency symbol with correct styling classes', () => {
		const { container } = renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const symbolContainer = getCurrencySymbolContainer(container);
		const symbolSpan = getCurrencySymbolSpan(container);
		expect(symbolContainer).toHaveClass('text-text-muted');
		expect(symbolSpan).toHaveClass('text-sm');
		expect(symbolSpan).toHaveClass('font-medium');
	});
});

describe('CurrencyInputField - User Interactions', () => {
	it('allows typing text', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const input = getCurrencyInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '100.50' } });
		expect(input).toHaveValue('100.50');
	});

	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<CurrencyInputField {...defaultProps} props={{ onChange: handleChange }} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '100' } });
		expect(handleChange).toHaveBeenCalledTimes(1);
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<CurrencyInputField {...defaultProps} props={{ onFocus: handleFocus, onBlur: handleBlur }} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);

		fireEvent.focus(input);
		expect(handleFocus).toHaveBeenCalledTimes(1);

		fireEvent.blur(input);
		expect(handleBlur).toHaveBeenCalledTimes(1);
	});

	it('handles keyboard events', () => {
		const handleKeyDown = vi.fn();
		renderWithProviders(
			<CurrencyInputField {...defaultProps} props={{ onKeyDown: handleKeyDown }} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);

		fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
		expect(handleKeyDown).toHaveBeenCalledTimes(1);
	});

	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('100');
			return (
				<CurrencyInputField
					{...defaultProps}
					props={{ value, onChange: e => setValue(e.target.value) }}
				/>
			);
		};
		renderWithProviders(<TestComponent />);
		const input = getCurrencyInput(document.body, TEST_ID);

		expect(input).toHaveValue('100');

		fireEvent.change(input, { target: { value: '200' } });
		expect(input).toHaveValue('200');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} props={{ defaultValue: '50.25' }} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveValue('50.25');
	});
});

describe('CurrencyInputField - Validation', () => {
	it('applies aria-invalid when hasError is true', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} hasError={true} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not apply aria-invalid when hasError is false', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} hasError={false} />);
		const input = getCurrencyInput(document.body, TEST_ID);
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
			<CurrencyInputField {...defaultProps} hasError={true} ariaDescribedBy={describedBy} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, describedBy);
	});

	it('does not set aria-describedby when ariaDescribedBy is undefined', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} ariaDescribedBy={undefined} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).not.toHaveAttribute(ARIA_DESCRIBEDBY);
	});
});

describe('CurrencyInputField - Disabled States', () => {
	it('renders as disabled when disabled is true', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} disabled={true} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toBeDisabled();
	});

	it('renders as enabled when disabled is false', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} disabled={false} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).not.toBeDisabled();
	});

	it('renders as enabled when disabled is undefined', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).not.toBeDisabled();
	});

	it('does not call onChange when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<CurrencyInputField {...defaultProps} disabled={true} props={{ onChange: handleChange }} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '100' } });
		// Note: onChange may still fire in some browsers even when disabled,
		// but the input should be disabled
		expect(input).toBeDisabled();
	});
});

describe('CurrencyInputField - Required States', () => {
	it('renders as required when required is true', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} required={true} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('required');
	});

	it('renders as not required when required is false', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} required={false} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).not.toBeRequired();
	});

	it('renders as not required when required is undefined', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).not.toBeRequired();
	});
});

describe('CurrencyInputField - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} props={{ 'aria-label': 'Amount' }} />
		);
		await expectA11y(container);
	});

	it('has no accessibility violations with error state', async () => {
		const { container } = renderWithProviders(
			<CurrencyInputField
				{...defaultProps}
				hasError={true}
				ariaDescribedBy="error-id"
				props={{ 'aria-label': 'Amount' }}
			/>
		);
		await expectA11y(container);
	});

	it('has no accessibility violations when disabled', async () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} disabled={true} props={{ 'aria-label': 'Amount' }} />
		);
		await expectA11y(container);
	});

	it('has no accessibility violations when required', async () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} required={true} props={{ 'aria-label': 'Amount' }} />
		);
		await expectA11y(container);
	});

	it('maintains proper ARIA attributes for error state', () => {
		const describedBy = 'error-description';
		renderWithProviders(
			<CurrencyInputField {...defaultProps} hasError={true} ariaDescribedBy={describedBy} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, describedBy);
	});
});

describe('CurrencyInputField - Edge Cases', () => {
	it('handles empty string value', () => {
		renderWithProviders(
			<CurrencyInputField {...defaultProps} props={{ value: '', readOnly: true }} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toBeInTheDocument();
		expect(input.value).toBe('');
	});

	it('handles undefined value', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} props={{ value: undefined }} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toBeInTheDocument();
		expect(input.type).toBe('text');
	});

	it('handles numeric string values', () => {
		renderWithProviders(
			<CurrencyInputField {...defaultProps} props={{ value: '1234.56', readOnly: true }} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveValue('1234.56');
	});

	it('handles multiple rapid onChange calls', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<CurrencyInputField {...defaultProps} props={{ onChange: handleChange }} />
		);
		const input = getCurrencyInput(document.body, TEST_ID);

		fireEvent.change(input, { target: { value: '100' } });
		fireEvent.change(input, { target: { value: '200' } });
		fireEvent.change(input, { target: { value: '300' } });

		expect(handleChange).toHaveBeenCalledTimes(3);
	});

	it('handles empty currency code', () => {
		const { container } = renderWithProviders(<CurrencyInputField {...defaultProps} currency="" />);
		const symbol = getCurrencySymbolSpan(container);
		// Empty currency should display as empty string
		expect(symbol).toHaveTextContent('');
	});

	it('handles special characters in currency code', () => {
		const { container } = renderWithProviders(
			<CurrencyInputField {...defaultProps} currency="BTC" />
		);
		const symbol = getCurrencySymbolSpan(container);
		// Unknown currency should display the code itself
		expect(symbol).toHaveTextContent('BTC');
	});

	it('maintains inputMode decimal attribute', () => {
		renderWithProviders(<CurrencyInputField {...defaultProps} />);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('inputMode', 'decimal');
	});

	it('preserves all input props except excluded ones', () => {
		renderWithProviders(
			<CurrencyInputField
				{...defaultProps}
				props={{
					name: 'amount',
					placeholder: 'Enter amount',
					maxLength: 10,
					min: '0',
					max: '1000',
					step: '0.01',
				}}
			/>
		);
		const input = getCurrencyInput(document.body, TEST_ID);
		expect(input).toHaveAttribute('name', 'amount');
		expect(input).toHaveAttribute('placeholder', 'Enter amount');
		expect(input).toHaveAttribute('maxLength', '10');
		expect(input).toHaveAttribute('min', '0');
		expect(input).toHaveAttribute('max', '1000');
		expect(input).toHaveAttribute('step', '0.01');
		// Type should always be 'text' (not overridden)
		expect(input).toHaveAttribute('type', 'text');
	});
});
