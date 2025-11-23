/**
 * NumberInputField Component Tests
 *
 * Tests for the NumberInputField component including:
 * - Rendering
 * - Input attributes
 * - Increment/decrement buttons
 * - User interactions
 * - Accessibility
 */

import { NumberInputField } from '@core/ui/forms/number-input/components/NumberInputField';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('NumberInputField - Rendering', () => {
	it('renders number input element', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'number');
	});

	it('applies id attribute', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('id', 'test-input');
	});

	it('applies className', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="custom-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveClass('custom-class');
	});

	it('renders increment and decrement buttons', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons).toHaveLength(2);
	});
});

describe('NumberInputField - Input Attributes', () => {
	it('applies min attribute', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				min={0}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('min', '0');
	});

	it('applies max attribute', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				max={100}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('max', '100');
	});

	it('applies step attribute', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				step={0.5}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('step', '0.5');
	});

	it('applies disabled attribute', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toBeDisabled();
	});

	it('applies required attribute', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				required={true}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('required');
	});

	it('applies aria-invalid when hasError is true', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={true}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('aria-invalid', 'true');
	});

	it('applies aria-describedby', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy="test-input-error test-input-helper"
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('aria-describedby', 'test-input-error test-input-helper');
	});

	it('forwards additional props to input', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={
					{
						placeholder: 'Enter number',
						'data-testid': 'number-input',
					} as any
				}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('placeholder', 'Enter number');
		expect(input).toHaveAttribute('data-testid', 'number-input');
	});
});

describe('NumberInputField - Increment/Decrement Buttons', () => {
	it('calls onIncrement when increment button is clicked', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		const incrementButton = buttons[0]; // First button is increment
		expect(incrementButton).toBeDefined();
		fireEvent.click(incrementButton!);

		expect(onIncrement).toHaveBeenCalledTimes(1);
	});

	it('calls onDecrement when decrement button is clicked', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		const decrementButton = buttons[1]; // Second button is decrement
		expect(decrementButton).toBeDefined();
		fireEvent.click(decrementButton!);

		expect(onDecrement).toHaveBeenCalledTimes(1);
	});

	it('disables increment button when canIncrement is false', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={false}
				canDecrement={true}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		const incrementButton = buttons[0];
		expect(incrementButton).toBeDisabled();
	});

	it('disables decrement button when canDecrement is false', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={false}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		const decrementButton = buttons[1];
		expect(decrementButton).toBeDisabled();
	});

	it('disables both buttons when input is disabled', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				disabled={true}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toBeDisabled();
		expect(buttons[1]).toBeDisabled();
	});
});

describe('NumberInputField - User Interactions', () => {
	it('handles input value changes', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		const onChange = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{ onChange }}
			/>
		);

		const input = screen.getByRole('spinbutton');
		fireEvent.change(input, { target: { value: '42' } });

		expect(onChange).toHaveBeenCalled();
	});

	it('handles focus and blur events', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		const onFocus = vi.fn();
		const onBlur = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{ onFocus, onBlur }}
			/>
		);

		const input = screen.getByRole('spinbutton');
		fireEvent.focus(input);
		expect(onFocus).toHaveBeenCalled();

		fireEvent.blur(input);
		expect(onBlur).toHaveBeenCalled();
	});
});

describe('NumberInputField - Accessibility', () => {
	it('has proper ARIA attributes', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={true}
				ariaDescribedBy="test-input-error"
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const input = screen.getByRole('spinbutton');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveAttribute('aria-describedby', 'test-input-error');
	});

	it('has accessible increment button', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[0]).toHaveAttribute('aria-label');
	});

	it('has accessible decrement button', () => {
		const onIncrement = vi.fn();
		const onDecrement = vi.fn();
		renderWithProviders(
			<NumberInputField
				id="test-input"
				className="test-class"
				hasError={false}
				ariaDescribedBy={undefined}
				onIncrement={onIncrement}
				onDecrement={onDecrement}
				canIncrement={true}
				canDecrement={true}
				props={{}}
			/>
		);

		const buttons = screen.getAllByRole('button');
		expect(buttons[1]).toHaveAttribute('aria-label');
	});
});
