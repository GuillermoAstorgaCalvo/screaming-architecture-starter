/**
 * RangeSlider Component Tests
 *
 * Tests for the RangeSlider component including:
 * - Rendering
 * - Props forwarding
 * - Integration with hooks
 */

import RangeSlider from '@core/ui/forms/range-slider/RangeSlider';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const LABEL_PRICE_RANGE = 'Price Range';
const ERROR_MESSAGE = 'Invalid range';
const HELPER_TEXT = 'Select a price range';

describe('RangeSlider - Rendering', () => {
	it('renders range slider component', () => {
		renderWithProviders(<RangeSlider min={0} max={100} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs).toHaveLength(2);
	});

	it('renders with label', () => {
		renderWithProviders(<RangeSlider label={LABEL_PRICE_RANGE} min={0} max={100} />);

		const label = screen.getByText(LABEL_PRICE_RANGE);
		expect(label).toBeInTheDocument();
	});

	it('renders without label', () => {
		renderWithProviders(<RangeSlider min={0} max={100} />);

		const label = screen.queryByText(LABEL_PRICE_RANGE);
		expect(label).not.toBeInTheDocument();
	});

	it('renders with error message', () => {
		renderWithProviders(
			<RangeSlider label={LABEL_PRICE_RANGE} error={ERROR_MESSAGE} min={0} max={100} />
		);

		const error = screen.getByText(ERROR_MESSAGE);
		expect(error).toBeInTheDocument();
	});

	it('renders with helper text', () => {
		renderWithProviders(
			<RangeSlider label={LABEL_PRICE_RANGE} helperText={HELPER_TEXT} min={0} max={100} />
		);

		const helper = screen.getByText(HELPER_TEXT);
		expect(helper).toBeInTheDocument();
	});

	it('renders with both error and helper text', () => {
		renderWithProviders(
			<RangeSlider
				label={LABEL_PRICE_RANGE}
				error={ERROR_MESSAGE}
				helperText={HELPER_TEXT}
				min={0}
				max={100}
			/>
		);

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		// Helper text should be present but visually hidden when error exists
		const helper = screen.getByText(HELPER_TEXT);
		expect(helper).toBeInTheDocument();
	});
});

describe('RangeSlider - Props', () => {
	it('applies min and max values', () => {
		renderWithProviders(<RangeSlider min={10} max={90} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('min', '10');
		expect(inputs[0]).toHaveAttribute('max', '90');
		expect(inputs[1]).toHaveAttribute('min', '10');
		expect(inputs[1]).toHaveAttribute('max', '90');
	});

	it('applies step value', () => {
		renderWithProviders(<RangeSlider min={0} max={100} step={5} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('step', '5');
		expect(inputs[1]).toHaveAttribute('step', '5');
	});

	it('applies disabled state', () => {
		renderWithProviders(<RangeSlider min={0} max={100} disabled />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toBeDisabled();
		expect(inputs[1]).toBeDisabled();
	});

	it('applies required state', () => {
		renderWithProviders(<RangeSlider label={LABEL_PRICE_RANGE} min={0} max={100} required />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('required');
		expect(inputs[1]).toHaveAttribute('required');
	});

	it('applies fullWidth prop', () => {
		const { container } = renderWithProviders(<RangeSlider min={0} max={100} fullWidth />);

		const wrapper = container.querySelector('.w-full');
		expect(wrapper).toBeInTheDocument();
	});

	it('applies custom rangeSliderId', () => {
		renderWithProviders(
			<RangeSlider label={LABEL_PRICE_RANGE} rangeSliderId="custom-id" min={0} max={100} />
		);

		// The label should be associated with the rangeSliderId, not the individual inputs
		// Range sliders use aria-labelledby or the label is associated with the container
		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('id', 'custom-id-min');
		expect(inputs[1]).toHaveAttribute('id', 'custom-id-max');
	});

	it('applies size prop', () => {
		renderWithProviders(<RangeSlider min={0} max={100} size="lg" />);

		const sliderElement = screen.getAllByRole('slider')[0];
		expect(sliderElement).toBeDefined();
		const slider = sliderElement?.closest('.relative');
		expect(slider).toHaveClass('h-3');
	});
});

describe('RangeSlider - Controlled Mode', () => {
	it('uses controlled value', () => {
		const value: [number, number] = [20, 80];
		renderWithProviders(<RangeSlider min={0} max={100} value={value} />);

		const inputs = screen.getAllByRole('slider');
		// Check aria-valuenow which should have the numeric values
		expect(inputs[0]).toHaveAttribute('aria-valuenow', '20');
		expect(inputs[1]).toHaveAttribute('aria-valuenow', '80');
	});

	it('calls onChange when value changes', () => {
		const onChange = vi.fn();
		renderWithProviders(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '30' } });
		}

		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('updates when controlled value prop changes', () => {
		const { rerender } = renderWithProviders(<RangeSlider min={0} max={100} value={[20, 80]} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('aria-valuenow', '20');
		expect(inputs[1]).toHaveAttribute('aria-valuenow', '80');

		rerender(<RangeSlider min={0} max={100} value={[30, 90]} />);

		expect(inputs[0]).toHaveAttribute('aria-valuenow', '30');
		expect(inputs[1]).toHaveAttribute('aria-valuenow', '90');
	});
});

describe('RangeSlider - Uncontrolled Mode', () => {
	it('uses defaultValue', () => {
		const defaultValue: [number, number] = [25, 75];
		renderWithProviders(<RangeSlider min={0} max={100} defaultValue={defaultValue} />);

		const inputs = screen.getAllByRole('slider');
		// Range inputs return string values
		expect(inputs[0]).toHaveAttribute('value', '25');
		expect(inputs[1]).toHaveAttribute('value', '75');
	});

	it('calls onChange when value changes in uncontrolled mode', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<RangeSlider min={0} max={100} defaultValue={[20, 80]} onChange={onChange} />
		);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '30' } });
		}

		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('defaults to [min, max] when no defaultValue provided', () => {
		renderWithProviders(<RangeSlider min={10} max={90} />);

		const inputs = screen.getAllByRole('slider');
		// Range inputs return string values
		expect(inputs[0]).toHaveAttribute('value', '10');
		expect(inputs[1]).toHaveAttribute('value', '90');
	});
});

describe('RangeSlider - User Interactions', () => {
	it('handles min value change', () => {
		const onChange = vi.fn();
		renderWithProviders(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '30' } });
		}

		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('handles max value change', () => {
		const onChange = vi.fn();
		renderWithProviders(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />);

		const maxInput = screen.getAllByRole('slider')[1];
		expect(maxInput).toBeDefined();
		if (maxInput) {
			fireEvent.change(maxInput, { target: { value: '90' } });
		}

		expect(onChange).toHaveBeenCalledWith([20, 90]);
	});

	it('prevents min from exceeding max', () => {
		const onChange = vi.fn();
		renderWithProviders(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />);

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
		renderWithProviders(<RangeSlider min={0} max={100} value={[20, 80]} onChange={onChange} />);

		const maxInput = screen.getAllByRole('slider')[1];
		expect(maxInput).toBeDefined();
		if (maxInput) {
			fireEvent.change(maxInput, { target: { value: '10' } });
		}

		// Max should be clamped to min value (20)
		expect(onChange).toHaveBeenCalledWith([20, 20]);
	});
});

describe('RangeSlider - Accessibility', () => {
	it('has proper ARIA attributes', () => {
		renderWithProviders(
			<RangeSlider
				label={LABEL_PRICE_RANGE}
				min={0}
				max={100}
				value={[20, 80]}
				error={ERROR_MESSAGE}
			/>
		);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('aria-valuemin', '0');
		expect(inputs[0]).toHaveAttribute('aria-valuemax', '100');
		expect(inputs[0]).toHaveAttribute('aria-valuenow', '20');
		expect(inputs[1]).toHaveAttribute('aria-valuemin', '0');
		expect(inputs[1]).toHaveAttribute('aria-valuemax', '100');
		expect(inputs[1]).toHaveAttribute('aria-valuenow', '80');
	});

	it('has aria-describedby when error or helper text exists', () => {
		renderWithProviders(
			<RangeSlider
				label={LABEL_PRICE_RANGE}
				min={0}
				max={100}
				error={ERROR_MESSAGE}
				helperText={HELPER_TEXT}
			/>
		);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toBeDefined();
		const describedBy = inputs[0]?.getAttribute('aria-describedby');
		expect(describedBy).toBeTruthy();
		expect(describedBy).toContain('error');
		expect(describedBy).toContain('helper');
	});

	it('associates label with inputs', () => {
		renderWithProviders(
			<RangeSlider label={LABEL_PRICE_RANGE} min={0} max={100} rangeSliderId="test-id" />
		);

		const label = screen.getByText(LABEL_PRICE_RANGE);
		// The label's for attribute should point to the rangeSliderId (container), not individual inputs
		// Range sliders typically use the container ID for the label
		expect(label).toHaveAttribute('for', 'test-id');
	});
});

describe('RangeSlider - Edge Cases', () => {
	it('handles min equals max', () => {
		renderWithProviders(<RangeSlider min={50} max={50} />);

		const inputs = screen.getAllByRole('slider');
		// Range inputs return string values
		expect(inputs[0]).toHaveAttribute('value', '50');
		expect(inputs[1]).toHaveAttribute('value', '50');
	});

	it('handles reversed value array', () => {
		const onChange = vi.fn();
		renderWithProviders(<RangeSlider min={0} max={100} value={[80, 20]} onChange={onChange} />);

		// Component should normalize to [20, 80]
		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('aria-valuenow', '20');
		expect(inputs[1]).toHaveAttribute('aria-valuenow', '80');
	});

	it('handles value outside min/max bounds', () => {
		renderWithProviders(<RangeSlider min={0} max={100} value={[-10, 150]} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toBeDefined();
		expect(inputs[1]).toBeDefined();
		// The component normalizes the values (swaps if reversed) but doesn't clamp to min/max
		// The HTML range input will handle the clamping at the browser level
		const minValue = inputs[0]?.getAttribute('aria-valuenow');
		const maxValue = inputs[1]?.getAttribute('aria-valuenow');
		expect(minValue).not.toBeNull();
		expect(maxValue).not.toBeNull();
		// The component normalizes [-10, 150] to [-10, 150] (min, max order)
		// The browser will clamp these values when the user interacts
		expect(Number(minValue)).toBe(-10);
		expect(Number(maxValue)).toBe(150);
	});
});
