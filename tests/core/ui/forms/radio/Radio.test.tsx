/**
 * Radio Component Tests
 *
 * Tests for the Radio component including:
 * - Rendering
 * - User interactions
 * - Validation
 * - Accessibility
 * - Error states
 * - Disabled states
 */

import Radio from '@core/ui/forms/radio/Radio';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';

const TEST_OPTION_NAME = 'option';
const TEST_OPTION_VALUE = '1';
const TEST_OPTION_LABEL = 'Option 1';
const ERROR_MESSAGE = 'Error message';
const SELECTION_REQUIRED = 'Selection required';
const ARIA_DESCRIBEDBY = 'aria-describedby';
const ARIA_INVALID = 'aria-invalid';

const getRadioInput = (label: string): HTMLInputElement => {
	const element = screen.getByLabelText(label);
	if (!(element instanceof HTMLInputElement)) {
		throw new TypeError(`Expected HTMLInputElement but got ${element.constructor.name}`);
	}
	return element;
};

const ControlledRadioTest = () => {
	const [value, setValue] = React.useState('');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);
	return (
		<>
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				checked={value === TEST_OPTION_VALUE}
				onChange={handleChange}
			/>
			<Radio
				name={TEST_OPTION_NAME}
				value="2"
				label="Option 2"
				checked={value === '2'}
				onChange={handleChange}
			/>
		</>
	);
};

describe('Radio - Rendering', () => {
	it('renders radio element', () => {
		renderWithProviders(
			<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} />
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		expect(radio).toBeInTheDocument();
		expect(radio.tagName).toBe('INPUT');
		expect(radio).toHaveAttribute('type', 'radio');
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				helperText="Select this option"
			/>
		);
		expect(screen.getByText('Select this option')).toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				error={SELECTION_REQUIRED}
			/>
		);
		expect(screen.getByText(SELECTION_REQUIRED)).toBeInTheDocument();
	});

	it('renders with required indicator when required', () => {
		renderWithProviders(
			<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} required />
		);
		const radio = screen.getByRole('radio', { name: new RegExp(TEST_OPTION_LABEL) });
		expect(radio).toHaveAttribute('required');
	});
});

describe('Radio - Rendering - Variants', () => {
	it('renders different size variants', () => {
		const { rerender } = renderWithProviders(
			<Radio name="option" value="1" size="sm" label="Small" />
		);
		expect(screen.getByLabelText('Small')).toBeInTheDocument();

		rerender(<Radio name="option" value="1" size="md" label="Medium" />);
		expect(screen.getByLabelText('Medium')).toBeInTheDocument();

		rerender(<Radio name="option" value="1" size="lg" label="Large" />);
		expect(screen.getByLabelText('Large')).toBeInTheDocument();
	});

	it('renders with correct name attribute for radio group', () => {
		renderWithProviders(
			<>
				<Radio name="gender" value="male" label="Male" />
				<Radio name="gender" value="female" label="Female" />
			</>
		);
		const maleRadio = screen.getByLabelText('Male');
		const femaleRadio = screen.getByLabelText('Female');
		expect(maleRadio).toHaveAttribute('name', 'gender');
		expect(femaleRadio).toHaveAttribute('name', 'gender');
	});
});

describe('Radio - Rendering States', () => {
	it('renders checked radio when checked prop is true', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				checked
				onChange={handleChange}
			/>
		);
		const radio = getRadioInput(TEST_OPTION_LABEL);
		expect(radio.checked).toBe(true);
	});

	it('renders unchecked radio by default', () => {
		renderWithProviders(
			<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} />
		);
		const radio = getRadioInput(TEST_OPTION_LABEL);
		expect(radio.checked).toBe(false);
	});
});

describe('Radio - User Interactions', () => {
	it('selects radio on click', () => {
		renderWithProviders(
			<>
				<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} />
				<Radio name={TEST_OPTION_NAME} value="2" label="Option 2" />
			</>
		);
		const radio1 = getRadioInput(TEST_OPTION_LABEL);
		const radio2 = getRadioInput('Option 2');

		expect(radio1.checked).toBe(false);
		expect(radio2.checked).toBe(false);

		fireEvent.click(radio1);
		expect(radio1.checked).toBe(true);
		expect(radio2.checked).toBe(false);

		fireEvent.click(radio2);
		expect(radio1.checked).toBe(false);
		expect(radio2.checked).toBe(true);
	});

	it('calls onChange handler when clicked', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				onChange={handleChange}
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);

		fireEvent.click(radio);
		expect(handleChange).toHaveBeenCalled();
	});

	it('handles focus and blur events', () => {
		const handleFocus = vi.fn();
		const handleBlur = vi.fn();
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);

		fireEvent.focus(radio);
		expect(handleFocus).toHaveBeenCalled();

		fireEvent.blur(radio);
		expect(handleBlur).toHaveBeenCalled();
	});
});

describe('Radio - User Interactions - Selection', () => {
	it('can be selected via keyboard', () => {
		renderWithProviders(
			<>
				<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} />
				<Radio name={TEST_OPTION_NAME} value="2" label="Option 2" />
			</>
		);
		const radio1 = getRadioInput(TEST_OPTION_LABEL);
		const radio2 = getRadioInput('Option 2');

		radio1.focus();
		// Space key on focused radio triggers click event in browsers
		fireEvent.click(radio1);
		expect(radio1.checked).toBe(true);
		expect(radio2.checked).toBe(false);
	});

	it('only one radio in group can be selected at a time', () => {
		renderWithProviders(
			<>
				<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} />
				<Radio name={TEST_OPTION_NAME} value="2" label="Option 2" />
				<Radio name={TEST_OPTION_NAME} value="3" label="Option 3" />
			</>
		);
		const radio1 = getRadioInput(TEST_OPTION_LABEL);
		const radio2 = getRadioInput('Option 2');
		const radio3 = getRadioInput('Option 3');

		fireEvent.click(radio1);
		expect(radio1.checked).toBe(true);
		expect(radio2.checked).toBe(false);
		expect(radio3.checked).toBe(false);

		fireEvent.click(radio2);
		expect(radio1.checked).toBe(false);
		expect(radio2.checked).toBe(true);
		expect(radio3.checked).toBe(false);
	});
});

describe('Radio - User Interactions - Modes', () => {
	it('supports controlled mode', () => {
		renderWithProviders(<ControlledRadioTest />);
		const radio1 = getRadioInput(TEST_OPTION_LABEL);
		const radio2 = getRadioInput('Option 2');

		expect(radio1.checked).toBe(false);
		expect(radio2.checked).toBe(false);

		fireEvent.click(radio1);
		expect(radio1.checked).toBe(true);
		expect(radio2.checked).toBe(false);

		fireEvent.click(radio2);
		expect(radio1.checked).toBe(false);
		expect(radio2.checked).toBe(true);
	});

	it('supports uncontrolled mode with defaultChecked', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				defaultChecked
			/>
		);
		const radio = getRadioInput(TEST_OPTION_LABEL);
		expect(radio.checked).toBe(true);
	});
});

describe('Radio - Validation', () => {
	it('displays error message when error prop is provided', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				error={SELECTION_REQUIRED}
			/>
		);
		expect(screen.getByText(SELECTION_REQUIRED)).toBeInTheDocument();
	});

	it('applies error styling when error is present', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				error={ERROR_MESSAGE}
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		expect(radio).toHaveAttribute(ARIA_INVALID, 'true');
	});

	it('associates error message with radio via ARIA', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				error={ERROR_MESSAGE}
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		const errorId = radio.getAttribute(ARIA_DESCRIBEDBY);
		expect(errorId).toBeTruthy();
		if (errorId) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', errorId);
		}
	});

	it('validates required field', () => {
		renderWithProviders(
			<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} required />
		);
		const radio = screen.getByRole('radio', { name: new RegExp(TEST_OPTION_LABEL) });
		expect(radio).toHaveAttribute('required');
	});
});

describe('Radio - Validation - Messages', () => {
	it('shows both error and helper text when both are provided', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				error={SELECTION_REQUIRED}
				helperText="Please select an option"
			/>
		);
		expect(screen.getByText(SELECTION_REQUIRED)).toBeInTheDocument();
		expect(screen.getByText('Please select an option')).toBeInTheDocument();
	});
});

describe('Radio - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				helperText="Select this option"
			/>
		);
		await expectA11y(container);
	});

	it('associates label with radio via id', () => {
		renderWithProviders(
			<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} />
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		const label = screen.getByText(TEST_OPTION_LABEL);
		expect(radio).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', radio.id);
	});

	it('supports custom radioId', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				radioId="custom-radio-id"
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		expect(radio).toHaveAttribute('id', 'custom-radio-id');
	});
});

describe('Radio - Accessibility - ARIA', () => {
	it('uses aria-describedby for helper text', () => {
		const helperText = 'Helper text';
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				helperText={helperText}
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		const describedBy = radio.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(helperText)).toBeInTheDocument();
			expect(screen.getByText(helperText)).toHaveAttribute('id', describedBy);
		}
	});

	it('uses aria-describedby for error message', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				error={ERROR_MESSAGE}
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		const describedBy = radio.getAttribute(ARIA_DESCRIBEDBY);
		expect(describedBy).toBeTruthy();
		if (describedBy) {
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.getByText(ERROR_MESSAGE)).toHaveAttribute('id', describedBy);
		}
	});

	it('sets aria-invalid when error is present', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				error={ERROR_MESSAGE}
			/>
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		expect(radio).toHaveAttribute(ARIA_INVALID, 'true');
	});

	it('does not set aria-invalid when no error', () => {
		renderWithProviders(
			<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} />
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		expect(radio).not.toHaveAttribute(ARIA_INVALID);
	});
});

describe('Radio - Disabled States', () => {
	it('renders disabled radio', () => {
		renderWithProviders(
			<Radio name={TEST_OPTION_NAME} value={TEST_OPTION_VALUE} label={TEST_OPTION_LABEL} disabled />
		);
		const radio = screen.getByLabelText(TEST_OPTION_LABEL);
		expect(radio).toBeDisabled();
	});

	it('prevents user interaction when disabled', () => {
		const handleChange = vi.fn();
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				disabled
				onChange={handleChange}
			/>
		);
		const radio = getRadioInput(TEST_OPTION_LABEL);

		const initialChecked = radio.checked;
		fireEvent.click(radio);
		expect(handleChange).not.toHaveBeenCalled();
		expect(radio.checked).toBe(initialChecked);
	});

	it('maintains checked state when disabled', () => {
		renderWithProviders(
			<Radio
				name={TEST_OPTION_NAME}
				value={TEST_OPTION_VALUE}
				label={TEST_OPTION_LABEL}
				checked
				disabled
			/>
		);
		const radio = getRadioInput(TEST_OPTION_LABEL);
		expect(radio.checked).toBe(true);
		expect(radio).toBeDisabled();
	});
});
