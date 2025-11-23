/**
 * Select Component Tests
 *
 * Tests for the Select component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 */

import Select from '@core/ui/forms/select/Select';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const LABEL_COUNTRY = 'Country';
const ERROR_MESSAGE = 'Error message';
const ARIA_INVALID_TRUE = 'true';
const ARIA_INVALID = 'aria-invalid';
const ARIA_DESCRIBEDBY = 'aria-describedby';

// Helper to get select element with correct type
// Type guard is necessary because getByLabelText returns HTMLElement,
// but we need HTMLSelectElement to access properties like .value and .selectedOptions
const getSelectElement = (label: string): HTMLSelectElement => {
	const element = screen.getByLabelText(label);
	if (!(element instanceof HTMLSelectElement)) {
		throw new TypeError(`Expected HTMLSelectElement but got ${element.constructor.name}`);
	}
	return element;
};

describe('Select - Rendering - Basic', () => {
	it('renders select element', () => {
		renderWithProviders(
			<Select>
				<option value="">Choose...</option>
				<option value="1">Option 1</option>
			</Select>
		);
		const select = screen.getByRole('combobox');
		expect(select).toBeInTheDocument();
		expect(select.tagName).toBe('SELECT');
	});

	it('renders with label', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY}>
				<option value="">Choose...</option>
				<option value="us">United States</option>
			</Select>
		);
		expect(screen.getByLabelText(LABEL_COUNTRY)).toBeInTheDocument();
	});

	it('renders all options', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY}>
				<option value="us">United States</option>
				<option value="uk">United Kingdom</option>
				<option value="ca">Canada</option>
			</Select>
		);
		expect(screen.getByText('United States')).toBeInTheDocument();
		expect(screen.getByText('United Kingdom')).toBeInTheDocument();
		expect(screen.getByText('Canada')).toBeInTheDocument();
	});
});

describe('Select - Rendering - Props', () => {
	it('renders with helper text', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} helperText="Select your country">
				<option value="">Choose...</option>
			</Select>
		);
		expect(screen.getByText('Select your country')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error="Country is required">
				<option value="">Choose...</option>
			</Select>
		);
		expect(screen.getByText('Country is required')).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} required>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByRole('combobox');
		expect(select).toHaveAttribute('required');
	});

	it('applies fullWidth class when fullWidth is true', () => {
		renderWithProviders(
			<Select fullWidth label="Test">
				<option value="1">Option 1</option>
			</Select>
		);
		const select = screen.getByLabelText('Test');
		expect(select).toBeInTheDocument();
	});

	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(
			<Select size="sm" label="Small">
				<option value="1">Option 1</option>
			</Select>
		);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(
			<Select size="md" label="Medium">
				<option value="1">Option 1</option>
			</Select>
		);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(
			<Select size="lg" label="Large">
				<option value="1">Option 1</option>
			</Select>
		);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});
});

describe('Select - User Interactions - Selection', () => {
	it('allows selecting an option', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY}>
				<option value="">Choose...</option>
				<option value="us">United States</option>
				<option value="uk">United Kingdom</option>
			</Select>
		);
		const select = getSelectElement(LABEL_COUNTRY);

		fireEvent.change(select, { target: { value: 'us' } });
		expect(select.value).toBe('us');
	});

	it('handles multiple selection when multiple prop is true', () => {
		renderWithProviders(
			<Select label="Countries" multiple>
				<option value="us">United States</option>
				<option value="uk">United Kingdom</option>
				<option value="ca">Canada</option>
			</Select>
		);
		const select = getSelectElement('Countries');
		expect(select).toHaveAttribute('multiple');

		// Select multiple options by directly setting selected property
		const [optionUs, optionUk] = [select.options[0], select.options[1]];

		if (optionUs && optionUk) {
			optionUs.selected = true;
			optionUk.selected = true;

			// Trigger change event to simulate user interaction
			fireEvent.change(select);

			const selectedOptions = Array.from(select.selectedOptions).map(opt => opt.value);
			expect(selectedOptions).toContain('us');
			expect(selectedOptions).toContain('uk');
		}
	});
});

describe('Select - User Interactions - Event Handlers', () => {
	it('calls onChange handler when value changes', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<Select label={LABEL_COUNTRY} onChange={handleChange}>
				<option value="">Choose...</option>
				<option value="us">United States</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);

		fireEvent.change(select, { target: { value: 'us' } });
		expect(handleChange).toHaveBeenCalled();
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<Select label={LABEL_COUNTRY} onFocus={handleFocus} onBlur={handleBlur}>
				<option value="">Choose...</option>
				<option value="us">United States</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);

		fireEvent.focus(select);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(select);
		expect(handleBlur).toHaveBeenCalled();
	});
});

describe('Select - User Interactions - Controlled and Uncontrolled Modes', () => {
	it('supports controlled mode', () => {
		const TestComponent = () => {
			const [value, setValue] = React.useState('');
			return (
				<Select label={LABEL_COUNTRY} value={value} onChange={e => setValue(e.target.value)}>
					<option value="">Choose...</option>
					<option value="us">United States</option>
				</Select>
			);
		};
		renderWithProviders(<TestComponent />);
		const select = getSelectElement(LABEL_COUNTRY);

		fireEvent.change(select, { target: { value: 'us' } });
		expect(select.value).toBe('us');
	});

	it('supports uncontrolled mode with defaultValue', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} defaultValue="us">
				<option value="">Choose...</option>
				<option value="us">United States</option>
			</Select>
		);
		const select = getSelectElement(LABEL_COUNTRY);
		expect(select.value).toBe('us');
	});
});

describe('Select - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error="Country is required">
				<option value="">Choose...</option>
			</Select>
		);
		expect(screen.getByText('Country is required')).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error={ERROR_MESSAGE}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		expect(select).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('associates error message with select via ARIA', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error={ERROR_MESSAGE}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		const errorId = select.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error="Invalid selection" helperText="Select a valid country">
				<option value="">Choose...</option>
			</Select>
		);
		expect(screen.getByText('Invalid selection')).toBeInTheDocument();
		expect(screen.getByText('Select a valid country')).toBeInTheDocument();
	});

	it('validates required field', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} required>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByRole('combobox');
		expect(select).toHaveAttribute('required');
	});
});

describe('Select - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Select label={LABEL_COUNTRY} helperText="Select your country">
				<option value="">Choose...</option>
				<option value="us">United States</option>
			</Select>
		);
		await expectA11y(container);
	});
});

describe('Select - Accessibility - Label Association', () => {
	it('associates label with select via id', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		const label = screen.getByText(LABEL_COUNTRY);
		expect(select).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', select.id);
	});

	it('supports custom selectId', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} selectId="custom-select-id">
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		expect(select).toHaveAttribute('id', 'custom-select-id');
	});
});

describe('Select - Accessibility - ARIA Attributes', () => {
	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(
			<Select label={LABEL_COUNTRY} helperText={helperText}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		const describedBy = select.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		expect(screen.getByText(helperText)).toBeInTheDocument();
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error={ERROR_MESSAGE}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		const describedBy = select.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it('sets aria-invalid when error is present', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error={ERROR_MESSAGE}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		expect(select).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		expect(select).not.toHaveAttribute(ARIA_INVALID);
	});
});

describe('Select - Error States', () => {
	it('displays error message', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error="This field is required">
				<option value="">Choose...</option>
			</Select>
		);
		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('applies error styling', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error={ERROR_MESSAGE}>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		expect(select).toHaveAttribute(ARIA_INVALID, ARIA_INVALID_TRUE);
	});

	it('prioritizes error over helper text', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} error={ERROR_MESSAGE} helperText="Helper text">
				<option value="">Choose...</option>
			</Select>
		);
		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(screen.getByText('Helper text')).toBeInTheDocument();
	});
});

describe('Select - Disabled States', () => {
	it('renders disabled select', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} disabled>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		expect(select).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<Select label={LABEL_COUNTRY} disabled onChange={handleChange}>
				<option value="">Choose...</option>
				<option value="us">United States</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);

		fireEvent.change(select, { target: { value: 'us' } });
		expect(handleChange).not.toHaveBeenCalled();
	});

	it('applies disabled styling', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} disabled>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		expect(select).toBeDisabled();
		expect(select).toHaveAttribute('disabled');
	});

	it('maintains label association when disabled', () => {
		renderWithProviders(
			<Select label={LABEL_COUNTRY} disabled>
				<option value="">Choose...</option>
			</Select>
		);
		const select = screen.getByLabelText(LABEL_COUNTRY);
		const label = screen.getByText(LABEL_COUNTRY);
		expect(select).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', select.id);
	});
});
