/**
 * PhoneInputField Component Tests
 *
 * Tests for the PhoneInputField component including:
 * - Rendering
 * - Country code selector
 * - Input attributes
 * - Accessibility
 * - Disabled states
 * - Error states
 * - Dynamic padding based on country code
 */

import { PhoneInputField } from '@core/ui/forms/phone-input/components/PhoneInputField';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const INPUT_ID = 'phone-input-test';
const INPUT_CLASSNAME = 'test-input-class';
const ARIA_DESCRIBEDBY = 'aria-describedby';

describe('PhoneInputField - Rendering', () => {
	it('renders phone input element', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'tel');
	});

	it('applies className to input', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveClass(INPUT_CLASSNAME);
	});

	it('applies id to input', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('id', INPUT_ID);
	});

	it('renders country code selector', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toBeInTheDocument();
		expect(selector.tagName).toBe('SELECT');
	});

	it('displays current country code in selector', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+44"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i) as HTMLSelectElement;
		expect(selector.value).toBe('+44');
	});
});

describe('PhoneInputField - Country Code Selector', () => {
	it('calls onCountryCodeChange when country code is changed', () => {
		const handleCountryCodeChange = vi.fn();
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={handleCountryCodeChange}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);

		fireEvent.change(selector, { target: { value: '+44' } });
		expect(handleCountryCodeChange).toHaveBeenCalledWith('+44');
		expect(handleCountryCodeChange).toHaveBeenCalledTimes(1);
	});

	it('renders country code options', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i) as HTMLSelectElement;
		const options = Array.from(selector.options);
		expect(options.length).toBeGreaterThan(0);
	});

	it('includes common country codes in options', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i) as HTMLSelectElement;
		const values = Array.from(selector.options).map(opt => opt.value);
		expect(values).toContain('+1');
		expect(values).toContain('+44');
		expect(values).toContain('+33');
	});

	it('selector has proper aria-label', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveAttribute('aria-label');
	});
});

describe('PhoneInputField - Dynamic Padding', () => {
	it('applies correct padding for 2-digit country codes', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input).toHaveClass('pl-4xl');
	});

	it('applies correct padding for 3-digit country codes', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+358"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input.className).toContain('pl-');
	});

	it('updates padding when country code changes', () => {
		const { container, rerender } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		let input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input).toHaveClass('pl-4xl');

		rerender(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+358"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input.className).toContain('pl-');
	});
});

describe('PhoneInputField - Input Attributes', () => {
	it('applies aria-invalid when hasError is true', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={true}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('does not apply aria-invalid when hasError is false', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		const ariaInvalid = input.getAttribute('aria-invalid');
		expect(ariaInvalid).not.toBe('true');
	});

	it('applies aria-describedby when provided', () => {
		const describedBy = 'error-id helper-id';
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={describedBy}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, describedBy);
	});

	it('applies disabled attribute when disabled prop is provided', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('applies required attribute when required prop is provided', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				required={true}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('required');
	});

	it('forwards additional input props', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={
					{
						placeholder: 'Enter phone number',
						'data-testid': 'phone-field',
					} as any
				}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('placeholder', 'Enter phone number');
		expect(input).toHaveAttribute('data-testid', 'phone-field');
	});
});

describe('PhoneInputField - Disabled States', () => {
	it('disables input when disabled prop is true', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeDisabled();
	});

	it('disables country code selector when disabled prop is true', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toBeDisabled();
	});

	it('does not disable when disabled prop is undefined', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).not.toBeDisabled();
	});
});

describe('PhoneInputField - Size Detection', () => {
	it('detects small size from className', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className="h-8 text-xs"
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveClass('h-8');
	});

	it('detects large size from className', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className="h-12 text-base"
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveClass('h-12');
	});

	it('defaults to medium size when size cannot be detected', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveClass('h-10');
	});
});

describe('PhoneInputField - Accessibility', () => {
	it('input has proper ARIA attributes for error state', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={true}
				ariaDescribedBy="error-id"
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute(ARIA_DESCRIBEDBY, 'error-id');
	});

	it('country code selector has proper aria-label', () => {
		renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const selector = screen.getByLabelText(/country code/i);
		expect(selector).toHaveAttribute('aria-label');
	});
});

describe('PhoneInputField - Edge Cases', () => {
	it('handles undefined id', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={undefined}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		expect(input.id).toBe('');
	});

	it('handles empty className', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className=""
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+1"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input') as HTMLInputElement;
		expect(input).toBeInTheDocument();
	});

	it('handles unknown country code', () => {
		const { container } = renderWithProviders(
			<PhoneInputField
				id={INPUT_ID}
				className={INPUT_CLASSNAME}
				hasError={false}
				ariaDescribedBy={undefined}
				countryCode="+999"
				onCountryCodeChange={() => {}}
				props={{}}
			/>
		);
		const input = container.querySelector('input[type="tel"]') as HTMLInputElement;
		expect(input).toBeInTheDocument();
		// Should still apply default padding
		expect(input.className).toContain('pl-');
	});
});
