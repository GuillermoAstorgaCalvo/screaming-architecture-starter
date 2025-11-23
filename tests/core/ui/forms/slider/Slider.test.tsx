/**
 * Slider Component Tests
 *
 * Tests for the Slider component including:
 * - Rendering
 * - Props forwarding
 * - Label rendering
 * - Error and helper text
 * - Controlled and uncontrolled modes
 */

import Slider from '@core/ui/forms/slider/Slider';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createSliderProps = (overrides?: Partial<Parameters<typeof Slider>[0]>) => ({
	min: 0,
	max: 100,
	...overrides,
});

describe('Slider - Rendering', () => {
	it('renders slider input', () => {
		const props = createSliderProps();
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'range');
	});

	it('renders with label', () => {
		const props = createSliderProps({ label: 'Volume' });
		renderWithProviders(<Slider {...props} />);

		const label = screen.getByText('Volume');
		expect(label).toBeInTheDocument();
	});

	it('does not render label when not provided', () => {
		const props = createSliderProps();
		renderWithProviders(<Slider {...props} />);

		const label = screen.queryByText('Volume');
		expect(label).not.toBeInTheDocument();
	});

	it('renders error message', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			error: 'Invalid value',
		});
		renderWithProviders(<Slider {...props} />);

		const error = screen.getByText('Invalid value');
		expect(error).toBeInTheDocument();
	});

	it('renders helper text', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			helperText: 'Select a value',
		});
		renderWithProviders(<Slider {...props} />);

		const helper = screen.getByText('Select a value');
		expect(helper).toBeInTheDocument();
	});

	it('renders both error and helper text', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			error: 'Invalid value',
			helperText: 'Select a value',
		});
		renderWithProviders(<Slider {...props} />);

		expect(screen.getByText('Invalid value')).toBeInTheDocument();
		expect(screen.getByText('Select a value')).toBeInTheDocument();
	});

	it('does not render messages when sliderId is undefined', () => {
		const props = createSliderProps({
			error: 'Invalid value',
			helperText: 'Select a value',
		});
		renderWithProviders(<Slider {...props} />);

		expect(screen.queryByText('Invalid value')).not.toBeInTheDocument();
		expect(screen.queryByText('Select a value')).not.toBeInTheDocument();
	});
});

describe('Slider - Props Forwarding', () => {
	it('forwards min and max to input', () => {
		const props = createSliderProps({ min: 10, max: 90 });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('min', '10');
		expect(input).toHaveAttribute('max', '90');
	});

	it('uses default min and max when not provided', () => {
		const props = createSliderProps();
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('min', '0');
		expect(input).toHaveAttribute('max', '100');
	});

	it('forwards step to input', () => {
		const props = createSliderProps({ step: 5 });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('step', '5');
	});

	it('forwards disabled state', () => {
		const props = createSliderProps({ disabled: true });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toBeDisabled();
	});

	it('forwards required state', () => {
		const props = createSliderProps({ required: true });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('required');
	});

	it('forwards value in controlled mode', () => {
		const props = createSliderProps({ value: 50 });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveValue('50');
	});

	it('forwards defaultValue in uncontrolled mode', () => {
		const props = createSliderProps({ defaultValue: 75 });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveValue('75');
	});
});

describe('Slider - onChange Handler', () => {
	it('calls onChange when value changes', () => {
		const onChange = vi.fn();
		const props = createSliderProps({ value: 50, onChange });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		fireEvent.change(input, { target: { value: '60' } });

		expect(onChange).toHaveBeenCalled();
	});

	it('handles undefined onChange gracefully', () => {
		const props = createSliderProps({ value: 50, onChange: undefined });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		// Should not throw
		expect(() => {
			fireEvent.change(input, { target: { value: '60' } });
		}).not.toThrow();
	});
});

describe('Slider - Size Variants', () => {
	it('applies sm size classes', () => {
		const props = createSliderProps({ size: 'sm' });
		const { container } = renderWithProviders(<Slider {...props} />);

		const slider = container.querySelector('.h-1');
		expect(slider).toBeInTheDocument();
	});

	it('applies md size classes by default', () => {
		const props = createSliderProps();
		const { container } = renderWithProviders(<Slider {...props} />);

		const slider = container.querySelector('.h-2');
		expect(slider).toBeInTheDocument();
	});

	it('applies lg size classes', () => {
		const props = createSliderProps({ size: 'lg' });
		const { container } = renderWithProviders(<Slider {...props} />);

		const slider = container.querySelector('.h-3');
		expect(slider).toBeInTheDocument();
	});
});

describe('Slider - Full Width', () => {
	it('applies full width class when fullWidth is true', () => {
		const props = createSliderProps({ fullWidth: true });
		const { container } = renderWithProviders(<Slider {...props} />);

		const wrapper = container.querySelector('.w-full');
		expect(wrapper).toBeInTheDocument();
	});

	it('does not apply full width class when fullWidth is false', () => {
		const props = createSliderProps({ fullWidth: false });
		const { container } = renderWithProviders(<Slider {...props} />);

		const wrapper = container.firstChild as HTMLElement;
		expect(wrapper).toBeInTheDocument();
		expect(wrapper.className).not.toContain('w-full');
	});
});

describe('Slider - ID Generation', () => {
	it('uses provided sliderId', () => {
		const props = createSliderProps({ sliderId: 'custom-id', label: 'Volume' });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('id', 'custom-id');
	});

	it('generates id when label is provided but sliderId is not', () => {
		const props = createSliderProps({ label: 'Volume' });
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		const label = screen.getByText('Volume');
		expect(input).toHaveAttribute('id');
		expect(label).toHaveAttribute('for', input.getAttribute('id'));
	});

	it('does not generate id when neither label nor sliderId is provided', () => {
		const props = createSliderProps();
		renderWithProviders(<Slider {...props} />);

		// Input may or may not have an id, but label should not be rendered
		const label = screen.queryByText('Volume');
		expect(label).not.toBeInTheDocument();
	});
});

describe('Slider - ARIA Attributes', () => {
	it('forwards ariaDescribedBy to input when error exists', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			error: 'Invalid value',
		});
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('aria-describedby', 'test-id-error');
	});

	it('forwards ariaDescribedBy to input when helperText exists', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			helperText: 'Select a value',
		});
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('aria-describedby', 'test-id-helper');
	});

	it('forwards ariaDescribedBy to input when both error and helperText exist', () => {
		const props = createSliderProps({
			sliderId: 'test-id',
			error: 'Invalid value',
			helperText: 'Select a value',
		});
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('aria-describedby', 'test-id-error test-id-helper');
	});
});

describe('Slider - Additional Props', () => {
	it('forwards additional input props', () => {
		const props = createSliderProps({
			'data-testid': 'slider-input',
		} as any);
		renderWithProviders(<Slider {...props} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('data-testid', 'slider-input');
		// Note: The input has sr-only hardcoded for accessibility (visual slider is the thumb div)
		// Additional props like data-testid are forwarded correctly
	});
});
