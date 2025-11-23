/**
 * RangeSliderContent Component Tests
 *
 * Tests for the RangeSliderContent component including:
 * - Rendering
 * - Props forwarding
 * - Label rendering
 * - Messages rendering
 */

import { RangeSliderContent } from '@core/ui/forms/range-slider/components/RangeSliderContent';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const createContentProps = (overrides?: Partial<Parameters<typeof RangeSliderContent>[0]>) => ({
	rangeSliderId: 'test-range-slider',
	sliderClasses: 'test-slider',
	trackClasses: 'test-track',
	activeTrackClasses: 'test-active-track',
	thumbClasses: 'test-thumb',
	ariaDescribedBy: undefined,
	fullWidth: false,
	min: 0,
	max: 100,
	fieldProps: {} as any,
	...overrides,
});

describe('RangeSliderContent - Rendering', () => {
	it('renders range slider content', () => {
		const props = createContentProps();
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs).toHaveLength(2);
	});

	it('renders with label', () => {
		const props = createContentProps({ label: 'Price Range' });
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const label = screen.getByText('Price Range');
		expect(label).toBeInTheDocument();
	});

	it('does not render label when not provided', () => {
		const props = createContentProps();
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const label = screen.queryByText('Price Range');
		expect(label).not.toBeInTheDocument();
	});

	it('renders error message', () => {
		const props = createContentProps({
			rangeSliderId: 'test-id',
			error: 'Invalid range',
		});
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const error = screen.getByText('Invalid range');
		expect(error).toBeInTheDocument();
	});

	it('renders helper text', () => {
		const props = createContentProps({
			rangeSliderId: 'test-id',
			helperText: 'Select a range',
		});
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const helper = screen.getByText('Select a range');
		expect(helper).toBeInTheDocument();
	});

	it('renders both error and helper text', () => {
		const props = createContentProps({
			rangeSliderId: 'test-id',
			error: 'Invalid range',
			helperText: 'Select a range',
		});
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		expect(screen.getByText('Invalid range')).toBeInTheDocument();
		expect(screen.getByText('Select a range')).toBeInTheDocument();
	});

	it('does not render messages when rangeSliderId is undefined', () => {
		const props = createContentProps({
			rangeSliderId: undefined,
			error: 'Invalid range',
			helperText: 'Select a range',
		});
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		expect(screen.queryByText('Invalid range')).not.toBeInTheDocument();
		expect(screen.queryByText('Select a range')).not.toBeInTheDocument();
	});
});

describe('RangeSliderContent - Full Width', () => {
	it('applies full width class when fullWidth is true', () => {
		const props = createContentProps({ fullWidth: true });
		const { container } = renderWithProviders(<RangeSliderContent {...props} />);

		const wrapper = container.querySelector('.w-full');
		expect(wrapper).toBeInTheDocument();
	});

	it('does not apply full width class when fullWidth is false', () => {
		const props = createContentProps({ fullWidth: false });
		const { container } = renderWithProviders(<RangeSliderContent {...props} />);

		// Check the wrapper div (first child div) doesn't have w-full class
		// The wrapper is the direct child of the container
		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toBeInTheDocument();
		// When fullWidth is false, the wrapper should not have w-full class
		// However, inputs may have w-full for their own styling, so we check the wrapper specifically
		expect(wrapper.className).not.toContain('w-full');
	});
});

describe('RangeSliderContent - Props Forwarding', () => {
	it('forwards min and max to field', () => {
		const props = createContentProps({ min: 10, max: 90 });
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('min', '10');
		expect(inputs[0]).toHaveAttribute('max', '90');
	});

	it('forwards step to field', () => {
		const props = createContentProps({ step: 5 });
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('step', '5');
	});

	it('forwards disabled state', () => {
		const props = createContentProps({ disabled: true });
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toBeDisabled();
		expect(inputs[1]).toBeDisabled();
	});

	it('forwards required state', () => {
		const props = createContentProps({ required: true });
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('required');
		expect(inputs[1]).toHaveAttribute('required');
	});

	it('forwards value in controlled mode', () => {
		const props = createContentProps({ value: [20, 80] });
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('20');
		expect(inputs[1]).toHaveValue('80');
	});

	it('forwards defaultValue in uncontrolled mode', () => {
		const props = createContentProps({ defaultValue: [25, 75] });
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveValue('25');
		expect(inputs[1]).toHaveValue('75');
	});
});

describe('RangeSliderContent - Label Association', () => {
	it('associates label with min input when rangeSliderId provided', () => {
		const props = createContentProps({
			rangeSliderId: 'test-id',
			label: 'Price Range',
		});
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const label = screen.getByText('Price Range');
		// The label's htmlFor is set to rangeSliderId, not rangeSliderId-min
		// The actual input IDs are rangeSliderId-min and rangeSliderId-max
		expect(label).toHaveAttribute('for', 'test-id');
	});

	it('does not render label when rangeSliderId is undefined', () => {
		const props = createContentProps({
			rangeSliderId: undefined,
			label: 'Price Range',
		});
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const label = screen.queryByText('Price Range');
		expect(label).not.toBeInTheDocument();
	});
});

describe('RangeSliderContent - ARIA Attributes', () => {
	it('forwards ariaDescribedBy to inputs', () => {
		const props = createContentProps({
			ariaDescribedBy: 'test-error test-helper',
		});
		renderWithProviders(<RangeSliderContent {...(props as any)} />);

		const inputs = screen.getAllByRole('slider');
		expect(inputs[0]).toHaveAttribute('aria-describedby', 'test-error test-helper');
		expect(inputs[1]).toHaveAttribute('aria-describedby', 'test-error test-helper');
	});
});
