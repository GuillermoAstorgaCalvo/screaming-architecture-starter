/**
 * RangeSliderInput Component Tests
 *
 * Tests for the RangeSliderInput component including:
 * - Rendering
 * - State management
 * - Value handling
 * - Change handlers
 */

import { RangeSliderInput } from '@core/ui/forms/range-slider/components/RangeSliderInput';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createInputProps = (overrides?: Partial<Parameters<typeof RangeSliderInput>[0]>) => ({
	minId: 'test-min',
	maxId: 'test-max',
	ariaDescribedBy: undefined,
	required: false,
	disabled: false,
	min: 0,
	max: 100,
	thumbClasses: 'test-thumb',
	inputProps: {},
	...overrides,
});

describe('RangeSliderInput - Rendering', () => {
	it('renders range slider inputs', () => {
		const props = createInputProps();
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs).toHaveLength(2);
	});

	it('renders with correct IDs', () => {
		const props = createInputProps({ minId: 'custom-min', maxId: 'custom-max' });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('id', 'custom-min');
		expect(inputs[1]).toHaveAttribute('id', 'custom-max');
	});
});

describe('RangeSliderInput - Controlled Mode', () => {
	it('uses controlled value', () => {
		const props = createInputProps({ value: [20, 80] });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('20');
		expect(inputs[1]).toHaveValue('80');
	});

	it('calls onChange when value changes', () => {
		const onChange = vi.fn();
		const props = createInputProps({ value: [20, 80], onChange });
		renderWithProviders(<RangeSliderInput {...props} />);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '30' } });
		}

		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('updates when controlled value prop changes', () => {
		const props = createInputProps({ value: [20, 80] });
		const { rerender } = renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('20');
		expect(inputs[1]).toHaveValue('80');

		rerender(<RangeSliderInput {...props} value={[30, 90]} />);

		expect(inputs[0]).toHaveValue('30');
		expect(inputs[1]).toHaveValue('90');
	});
});

describe('RangeSliderInput - Uncontrolled Mode', () => {
	it('uses defaultValue', () => {
		const props = createInputProps({ defaultValue: [25, 75] });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('25');
		expect(inputs[1]).toHaveValue('75');
	});

	it('calls onChange when value changes in uncontrolled mode', () => {
		const onChange = vi.fn();
		const props = createInputProps({ defaultValue: [20, 80], onChange });
		renderWithProviders(<RangeSliderInput {...props} />);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '30' } });
		}

		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('defaults to [min, max] when no defaultValue provided', () => {
		const props = createInputProps({ min: 10, max: 90 });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('10');
		expect(inputs[1]).toHaveValue('90');
	});
});

describe('RangeSliderInput - Value Constraints', () => {
	it('prevents min from exceeding max', () => {
		const onChange = vi.fn();
		const props = createInputProps({ value: [20, 80], onChange });
		renderWithProviders(<RangeSliderInput {...props} />);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '90' } });
		}

		// Min should be clamped to max value (80)
		expect(onChange).toHaveBeenCalledWith([80, 80]);
	});

	it('prevents max from going below min', () => {
		const onChange = vi.fn();
		const props = createInputProps({ value: [20, 80], onChange });
		renderWithProviders(<RangeSliderInput {...props} />);

		const maxInput = screen.getAllByRole('slider')[1];
		expect(maxInput).toBeDefined();
		if (maxInput) {
			fireEvent.change(maxInput, { target: { value: '10' } });
		}

		// Max should be clamped to min value (20)
		expect(onChange).toHaveBeenCalledWith([20, 20]);
	});

	it('normalizes reversed value array', () => {
		const props = createInputProps({ value: [80, 20] });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		// Component should normalize to [20, 80]
		expect(inputs[0]).toHaveValue('20');
		expect(inputs[1]).toHaveValue('80');
	});
});

describe('RangeSliderInput - Props Forwarding', () => {
	it('forwards min and max to inputs', () => {
		const props = createInputProps({ min: 10, max: 90 });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('min', '10');
		expect(inputs[0]).toHaveAttribute('max', '90');
		expect(inputs[1]).toHaveAttribute('min', '10');
		expect(inputs[1]).toHaveAttribute('max', '90');
	});

	it('forwards step to inputs', () => {
		const props = createInputProps({ step: 5 });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('step', '5');
		expect(inputs[1]).toHaveAttribute('step', '5');
	});

	it('forwards disabled state', () => {
		const props = createInputProps({ disabled: true });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toBeDisabled();
		expect(inputs[1]).toBeDisabled();
	});

	it('forwards required state', () => {
		const props = createInputProps({ required: true });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('required');
		expect(inputs[1]).toHaveAttribute('required');
	});

	it('forwards ariaDescribedBy to inputs', () => {
		const props = createInputProps({ ariaDescribedBy: 'test-error test-helper' });
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('aria-describedby', 'test-error test-helper');
		expect(inputs[1]).toHaveAttribute('aria-describedby', 'test-error test-helper');
	});
});

describe('RangeSliderInput - Additional Props', () => {
	it('forwards additional input props', () => {
		const props = createInputProps({
			inputProps: {
				'data-testid': 'range-input',
				className: 'custom-input',
			} as any,
		});
		renderWithProviders(<RangeSliderInput {...props} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('data-testid', 'range-input');
		expect(inputs[0]).toHaveClass('custom-input');
	});
});
