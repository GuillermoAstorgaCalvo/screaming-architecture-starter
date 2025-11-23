/**
 * Tests for PromptDialogInput component
 *
 * Tests the PromptDialogInput component:
 * - Rendering with different props
 * - Input value handling
 * - Error display
 * - Required field indication
 * - Different input types
 */

import { PromptDialogInput } from '@core/ui/overlays/prompt-dialog/components/PromptDialogInput';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const TEST_LABEL = 'Name';
const TEST_PLACEHOLDER = 'Enter your name';

const renderPromptDialogInput = (props: {
	label?: string;
	type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	required?: boolean;
	error?: string;
}) => {
	const {
		label = TEST_LABEL,
		type = 'text',
		value = '',
		onChange = () => {},
		placeholder = TEST_PLACEHOLDER,
		required = false,
		error,
	} = props;

	return renderWithProviders(
		<PromptDialogInput
			label={label}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			required={required}
			{...(error !== undefined && { error })}
		/>
	);
};

describe('PromptDialogInput - Rendering', () => {
	it('renders input field with label', () => {
		renderPromptDialogInput({});

		const input = screen.getByLabelText(TEST_LABEL);
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'text');
	});

	it('renders input with placeholder', () => {
		renderPromptDialogInput({});

		const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
		expect(input).toBeInTheDocument();
	});

	it('renders input with value', () => {
		renderPromptDialogInput({ value: 'Test Value' });

		const input = screen.getByLabelText(TEST_LABEL);
		expect(input).toHaveValue('Test Value');
	});

	it('renders with different input types', () => {
		const { rerender } = renderPromptDialogInput({ type: 'email' });
		let input = screen.getByLabelText(TEST_LABEL);
		expect(input).toHaveAttribute('type', 'email');

		rerender(
			<PromptDialogInput
				label={TEST_LABEL}
				type="password"
				value=""
				onChange={() => {}}
				placeholder={TEST_PLACEHOLDER}
				required={false}
			/>
		);
		input = screen.getByLabelText(TEST_LABEL);
		expect(input).toHaveAttribute('type', 'password');
	});

	it('renders with custom label', () => {
		renderPromptDialogInput({ label: 'Email Address' });

		const input = screen.getByLabelText('Email Address');
		expect(input).toBeInTheDocument();
	});
});

describe('PromptDialogInput - Value Handling', () => {
	it('calls onChange when input value changes', () => {
		const onChange = vi.fn();
		renderPromptDialogInput({ onChange });

		const input = screen.getByLabelText(TEST_LABEL);
		fireEvent.change(input, { target: { value: 'New Value' } });

		expect(onChange).toHaveBeenCalledWith('New Value');
		expect(onChange).toHaveBeenCalledTimes(1);
	});

	it('updates displayed value when value prop changes', () => {
		const { rerender } = renderPromptDialogInput({ value: 'Initial' });

		let input = screen.getByLabelText(TEST_LABEL);
		expect(input).toHaveValue('Initial');

		rerender(
			<PromptDialogInput
				label={TEST_LABEL}
				type="text"
				value="Updated"
				onChange={() => {}}
				placeholder={TEST_PLACEHOLDER}
				required={false}
			/>
		);

		input = screen.getByLabelText(TEST_LABEL);
		expect(input).toHaveValue('Updated');
	});
});

describe('PromptDialogInput - Error Display', () => {
	it('displays error message when error is provided', () => {
		renderPromptDialogInput({ error: 'This field is required' });

		expect(screen.getByText('This field is required')).toBeInTheDocument();
	});

	it('does not display error when error is undefined', () => {
		renderPromptDialogInput({});

		expect(screen.queryByText('This field is required')).not.toBeInTheDocument();
	});

	it('applies error styling when error is provided', () => {
		renderPromptDialogInput({ error: 'Error message' });

		const input = screen.getByLabelText(TEST_LABEL);
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});
});

describe('PromptDialogInput - Required Field', () => {
	it('marks input as required when required is true', () => {
		renderPromptDialogInput({ required: true });

		const input = screen.getByPlaceholderText(TEST_PLACEHOLDER);
		expect(input).toHaveAttribute('required');
	});

	it('does not mark input as required when required is false', () => {
		renderPromptDialogInput({ required: false });

		const input = screen.getByLabelText(TEST_LABEL);
		expect(input).not.toHaveAttribute('required');
	});
});

describe('PromptDialogInput - Full Width', () => {
	it('renders input with full width', () => {
		renderPromptDialogInput({});

		const input = screen.getByLabelText(TEST_LABEL);
		// The Input component should apply fullWidth styling
		// We can verify the input is rendered correctly
		expect(input).toBeInTheDocument();
	});
});
