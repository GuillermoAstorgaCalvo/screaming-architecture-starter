/**
 * RangeSliderField Component Tests
 *
 * Tests for the RangeSliderField component including:
 * - Rendering
 * - Props forwarding
 * - Class application
 */

import { RangeSliderField } from '@core/ui/forms/range-slider/components/RangeSliderField';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createFieldProps = (overrides?: Partial<Parameters<typeof RangeSliderField>[0]>) => ({
	minId: 'test-min',
	maxId: 'test-max',
	sliderClasses: 'test-slider',
	trackClasses: 'test-track',
	activeTrackClasses: 'test-active-track',
	thumbClasses: 'test-thumb',
	ariaDescribedBy: undefined,
	min: 0,
	max: 100,
	props: {},
	...overrides,
});

describe('RangeSliderField - Rendering', () => {
	it('renders range slider field', () => {
		const props = createFieldProps();
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs).toHaveLength(2);
	});

	it('renders slider container with correct classes', () => {
		const props = createFieldProps({ sliderClasses: 'custom-slider' });
		const { container } = renderWithProviders(<RangeSliderField {...props} />);

		const slider = container.querySelector('.custom-slider');
		expect(slider).toBeInTheDocument();
	});

	it('renders track with correct classes', () => {
		const props = createFieldProps({ trackClasses: 'custom-track' });
		const { container } = renderWithProviders(<RangeSliderField {...props} />);

		const track = container.querySelector('.custom-track');
		expect(track).toBeInTheDocument();
	});
});

describe('RangeSliderField - Props Forwarding', () => {
	it('forwards min and max to inputs', () => {
		const props = createFieldProps({ min: 10, max: 90 });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('min', '10');
		expect(inputs[0]).toHaveAttribute('max', '90');
		expect(inputs[1]).toHaveAttribute('min', '10');
		expect(inputs[1]).toHaveAttribute('max', '90');
	});

	it('forwards step to inputs', () => {
		const props = createFieldProps({ step: 5 });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('step', '5');
		expect(inputs[1]).toHaveAttribute('step', '5');
	});

	it('forwards disabled state', () => {
		const props = createFieldProps({ disabled: true });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toBeDisabled();
		expect(inputs[1]).toBeDisabled();
	});

	it('forwards required state', () => {
		const props = createFieldProps({ required: true });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('required');
		expect(inputs[1]).toHaveAttribute('required');
	});

	it('forwards value in controlled mode', () => {
		const props = createFieldProps({ value: [20, 80] });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('20');
		expect(inputs[1]).toHaveValue('80');
	});

	it('forwards defaultValue in uncontrolled mode', () => {
		const props = createFieldProps({ defaultValue: [25, 75] });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('25');
		expect(inputs[1]).toHaveValue('75');
	});

	it('forwards minId and maxId to inputs', () => {
		const props = createFieldProps({ minId: 'custom-min', maxId: 'custom-max' });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('id', 'custom-min');
		expect(inputs[1]).toHaveAttribute('id', 'custom-max');
	});

	it('forwards ariaDescribedBy to inputs', () => {
		const props = createFieldProps({ ariaDescribedBy: 'test-error test-helper' });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('aria-describedby', 'test-error test-helper');
		expect(inputs[1]).toHaveAttribute('aria-describedby', 'test-error test-helper');
	});
});

describe('RangeSliderField - onChange Handler', () => {
	it('calls onChange when value changes', () => {
		const onChange = vi.fn();
		const props = createFieldProps({ value: [20, 80], onChange });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		if (minInput) {
			fireEvent.change(minInput, { target: { value: '30' } });
		}

		expect(onChange).toHaveBeenCalledWith([30, 80]);
	});

	it('handles undefined onChange gracefully', () => {
		const props = createFieldProps({ value: [20, 80], onChange: undefined });
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const minInput = screen.getAllByRole('slider')[0];
		expect(minInput).toBeDefined();
		// Should not throw
		expect(() => {
			if (minInput) {
				fireEvent.change(minInput, { target: { value: '30' } });
			}
		}).not.toThrow();
	});
});

describe('RangeSliderField - Additional Props', () => {
	it('forwards additional input props', () => {
		const props = createFieldProps({
			props: {
				'data-testid': 'range-field',
				className: 'custom-input',
			} as any,
		});
		renderWithProviders(<RangeSliderField {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('data-testid', 'range-field');
		expect(inputs[0]).toHaveClass('custom-input');
	});
});
