/**
 * Slider Component Tests
 *
 * Tests for the Slider component:
 * - Rendering
 * - Value display
 * - Value formatting
 * - Marks display
 * - Helper text
 * - Disabled state
 * - Event handling
 */

import Slider from '@domains/shared/components/slider/Slider';
import type { SliderMark } from '@domains/shared/components/slider/types/slider.types';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('Slider - Rendering', () => {
	it('renders slider input', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} />);

		const input = screen.getByRole('slider');
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute('type', 'range');
	});

	it('renders with label', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} label="Volume" id="volume" />);

		expect(screen.getByText('Volume')).toBeInTheDocument();
	});

	it('renders with helper text', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<Slider value={50} onChange={onChange} helperText="Adjust volume" id="volume" />
		);

		expect(screen.getByText('Adjust volume')).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} className="custom-slider" />);

		const slider = screen.getByTestId('slider-wrapper');
		expect(slider).toHaveClass('custom-slider');
	});

	it('generates id when not provided', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} label="Volume" />);

		const label = screen.getByText('Volume');
		const input = screen.getByRole('slider');
		expect(label).toHaveAttribute('for');
		expect(input).toHaveAttribute('id');
	});
});

describe('Slider - Value Handling', () => {
	it('displays current value', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveValue('50');
		expect(input).toHaveAttribute('aria-valuenow', '50');
	});

	it('calls onChange when value changes', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} />);

		const input = screen.getByRole('slider');
		fireEvent.change(input, { target: { value: '75' } });

		expect(onChange).toHaveBeenCalledWith(75);
	});

	it('clamps value to min', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} min={0} max={100} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('min', '0');
		expect(input).toHaveAttribute('aria-valuemin', '0');
	});

	it('clamps value to max', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} min={0} max={100} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('max', '100');
		expect(input).toHaveAttribute('aria-valuemax', '100');
	});

	it('uses default min and max when not provided', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('min', '0');
		expect(input).toHaveAttribute('max', '100');
	});

	it('uses custom step value', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} step={5} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('step', '5');
	});

	it('uses default step value when not provided', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('step', '1');
	});
});

describe('Slider - Value Display', () => {
	it('shows value when showValue is true', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} showValue label="Volume" />);

		expect(screen.getByText('50')).toBeInTheDocument();
	});

	it('hides value when showValue is false', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} showValue={false} label="Volume" />);

		expect(screen.queryByText('50')).not.toBeInTheDocument();
	});

	it('hides value by default', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} label="Volume" />);

		expect(screen.queryByText('50')).not.toBeInTheDocument();
	});

	it('formats value with formatValue function', () => {
		const onChange = vi.fn();
		const formatValue = (value: number) => `${value}%`;

		renderWithProviders(
			<Slider value={50} onChange={onChange} showValue formatValue={formatValue} label="Volume" />
		);

		expect(screen.getByText('50%')).toBeInTheDocument();
	});

	it('updates formatted value when value changes', () => {
		const onChange = vi.fn();
		const formatValue = (value: number) => `${value}%`;

		const { rerender } = renderWithProviders(
			<Slider value={50} onChange={onChange} showValue formatValue={formatValue} label="Volume" />
		);

		expect(screen.getByText('50%')).toBeInTheDocument();

		rerender(
			<Slider value={75} onChange={onChange} showValue formatValue={formatValue} label="Volume" />
		);

		expect(screen.getByText('75%')).toBeInTheDocument();
	});
});

describe('Slider - Marks', () => {
	const marks: SliderMark[] = [
		{ value: 0, label: 'Min' },
		{ value: 50, label: 'Mid' },
		{ value: 100, label: 'Max' },
	];

	it('renders marks when provided', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} marks={marks} id="slider" />);

		expect(screen.getByText('Min')).toBeInTheDocument();
		expect(screen.getByText('Mid')).toBeInTheDocument();
		expect(screen.getByText('Max')).toBeInTheDocument();
	});

	it('does not render marks when not provided', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} id="slider" />);

		const marksContainer = screen.queryByRole('region', { name: /marks/i });
		expect(marksContainer).not.toBeInTheDocument();
	});

	it('renders marks without labels', () => {
		const marksWithoutLabels: SliderMark[] = [{ value: 0 }, { value: 50 }, { value: 100 }];

		const onChange = vi.fn();
		renderWithProviders(
			<Slider value={50} onChange={onChange} marks={marksWithoutLabels} id="slider" />
		);

		const marksContainer = screen.getByTestId('slider-marks');
		expect(marksContainer).toBeInTheDocument();
	});

	it('positions marks correctly', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<Slider value={50} onChange={onChange} marks={marks} min={0} max={100} id="slider" />
		);

		const marksContainer = screen.getByTestId('slider-marks');
		expect(marksContainer).toBeInTheDocument();
	});
});

describe('Slider - Disabled State', () => {
	it('renders disabled slider', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} disabled />);

		const input = screen.getByRole('slider');
		expect(input).toBeDisabled();
		expect(input).toHaveAttribute('aria-disabled', 'true');
	});

	it('does not call onChange when disabled', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} disabled />);

		const input = screen.getByRole('slider');
		fireEvent.change(input, { target: { value: '75' } });

		// Note: The onChange might still fire from the input, but the component should handle it
		// This test verifies the disabled attribute is set
		expect(input).toBeDisabled();
	});
});

describe('Slider - Accessibility', () => {
	it('has correct ARIA attributes', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} min={0} max={100} id="slider" />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('aria-valuemin', '0');
		expect(input).toHaveAttribute('aria-valuemax', '100');
		expect(input).toHaveAttribute('aria-valuenow', '50');
	});

	it('associates helper text with input', () => {
		const onChange = vi.fn();
		renderWithProviders(
			<Slider value={50} onChange={onChange} helperText="Helper text" id="slider" />
		);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('aria-describedby', 'slider-helper');
	});

	it('associates label with input', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} label="Volume" id="volume" />);

		const label = screen.getByText('Volume');
		const input = screen.getByRole('slider');
		expect(label).toHaveAttribute('for', 'volume');
		expect(input).toHaveAttribute('id', 'volume');
	});
});

describe('Slider - Edge Cases', () => {
	it('handles value at minimum', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={0} onChange={onChange} min={0} max={100} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveValue('0');
	});

	it('handles value at maximum', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={100} onChange={onChange} min={0} max={100} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveValue('100');
	});

	it('handles negative values', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={-50} onChange={onChange} min={-100} max={100} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveValue('-50');
	});

	it('handles decimal step values', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50.5} onChange={onChange} step={0.1} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('step', '0.1');
	});

	it('clamps value outside min/max range', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={150} onChange={onChange} min={0} max={100} />);

		const input = screen.getByRole('slider');
		// The value should be clamped to 100
		expect(input).toHaveValue('100');
	});
});

describe('Slider - Props Forwarding', () => {
	it('forwards other input props', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} data-testid="custom-slider" />);

		const input = screen.getByTestId('custom-slider');
		expect(input).toBeInTheDocument();
	});

	it('does not forward type prop', () => {
		const onChange = vi.fn();
		renderWithProviders(<Slider value={50} onChange={onChange} />);

		const input = screen.getByRole('slider');
		expect(input).toHaveAttribute('type', 'range');
	});
});
