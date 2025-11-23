/**
 * Meter Component Tests
 *
 * Tests for the Meter component including:
 * - Rendering
 * - Size variants (sm, md, lg)
 * - Value display
 * - Label and unit display
 * - Custom formatValue function
 * - Thresholds and variants (success, warning, error)
 * - Manual variant override
 * - Accessibility (ARIA attributes)
 * - Edge cases (min/max values, zero, etc.)
 */

import Meter from '@core/ui/data-display/meter/Meter';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Meter - Rendering', () => {
	it('renders meter element', () => {
		renderWithProviders(<Meter value={50} max={100} />);
		const meter = screen.getByRole('meter');
		expect(meter).toBeInTheDocument();
	});

	it('renders with basic value and max', () => {
		renderWithProviders(<Meter value={50} max={100} />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveAttribute('value', '50');
		expect(meter).toHaveAttribute('min', '0');
		expect(meter).toHaveAttribute('max', '100');
	});

	it('renders with custom min value', () => {
		renderWithProviders(<Meter value={25} min={10} max={100} />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveAttribute('min', '10');
		expect(meter).toHaveAttribute('value', '25');
	});

	it('renders with label', () => {
		renderWithProviders(<Meter value={50} max={100} label="Storage" />);
		expect(screen.getByText('Storage')).toBeInTheDocument();
	});

	it('renders without label when not provided', () => {
		renderWithProviders(<Meter value={50} max={100} />);
		expect(screen.queryByText('Storage')).not.toBeInTheDocument();
	});

	it('renders value text by default', () => {
		renderWithProviders(<Meter value={50} max={100} />);
		expect(screen.getByText(/50.*100/)).toBeInTheDocument();
	});

	it('does not render value text when showValue is false', () => {
		renderWithProviders(<Meter value={50} max={100} showValue={false} />);
		expect(screen.queryByText(/50.*100/)).not.toBeInTheDocument();
	});

	it('renders with unit', () => {
		renderWithProviders(<Meter value={500} max={1000} unit="GB" />);
		expect(screen.getByText(/500.*1,000.*GB/)).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		renderWithProviders(<Meter value={50} max={100} className="custom-meter" />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveClass('custom-meter');
	});
});

describe('Meter - Size Variants', () => {
	it('renders with default size (md)', () => {
		renderWithProviders(<Meter value={50} max={100} />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveClass('h-2');
	});

	it('renders with sm size', () => {
		renderWithProviders(<Meter value={50} max={100} size="sm" />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveClass('h-1');
	});

	it('renders with md size', () => {
		renderWithProviders(<Meter value={50} max={100} size="md" />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveClass('h-2');
	});

	it('renders with lg size', () => {
		renderWithProviders(<Meter value={50} max={100} size="lg" />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveClass('h-3');
	});
});

describe('Meter - Value Formatting', () => {
	it('formats value with default format', () => {
		renderWithProviders(<Meter value={500} max={1000} />);
		expect(screen.getByText(/500.*1,000/)).toBeInTheDocument();
	});

	it('formats value with unit', () => {
		renderWithProviders(<Meter value={500} max={1000} unit="GB" />);
		expect(screen.getByText(/500.*1,000.*GB/)).toBeInTheDocument();
	});

	it('uses custom formatValue function', () => {
		const formatValue = (val: number, max: number, unit?: string) =>
			`${val}${unit || ''} of ${max}${unit || ''}`;
		renderWithProviders(<Meter value={75} max={100} unit="MB/s" formatValue={formatValue} />);
		expect(screen.getByText('75MB/s of 100MB/s')).toBeInTheDocument();
	});

	it('formats large numbers with locale formatting', () => {
		renderWithProviders(<Meter value={1234567} max={5000000} />);
		expect(screen.getByText(/1,234,567.*5,000,000/)).toBeInTheDocument();
	});
});

describe('Meter - Thresholds and Variants', () => {
	it('renders with default variant when no thresholds', () => {
		renderWithProviders(<Meter value={50} max={100} />);
		const meter = screen.getByRole('meter');
		// Check that the meter bar has default variant classes
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-primary"]');
		expect(meterBar).toBeInTheDocument();
	});

	it('applies success variant when percentage meets threshold', () => {
		renderWithProviders(
			<Meter
				value={50}
				max={100}
				thresholds={[
					{ value: 40, variant: 'success' },
					{ value: 80, variant: 'warning' },
					{ value: 90, variant: 'error' },
				]}
			/>
		);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-success"]');
		expect(meterBar).toBeInTheDocument();
	});

	it('applies warning variant when percentage meets warning threshold', () => {
		renderWithProviders(
			<Meter
				value={85}
				max={100}
				thresholds={[
					{ value: 40, variant: 'success' },
					{ value: 80, variant: 'warning' },
					{ value: 90, variant: 'error' },
				]}
			/>
		);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-warning"]');
		expect(meterBar).toBeInTheDocument();
	});

	it('applies error variant when percentage meets error threshold', () => {
		renderWithProviders(
			<Meter
				value={95}
				max={100}
				thresholds={[
					{ value: 40, variant: 'success' },
					{ value: 80, variant: 'warning' },
					{ value: 90, variant: 'error' },
				]}
			/>
		);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-destructive"]');
		expect(meterBar).toBeInTheDocument();
	});

	it('uses default variant when percentage is below all thresholds', () => {
		renderWithProviders(
			<Meter
				value={30}
				max={100}
				thresholds={[
					{ value: 40, variant: 'success' },
					{ value: 80, variant: 'warning' },
					{ value: 90, variant: 'error' },
				]}
			/>
		);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-primary"]');
		expect(meterBar).toBeInTheDocument();
	});

	it('applies manual variant override when provided', () => {
		renderWithProviders(
			<Meter
				value={95}
				max={100}
				variant="success"
				thresholds={[{ value: 90, variant: 'error' }]}
			/>
		);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-success"]');
		expect(meterBar).toBeInTheDocument();
	});

	it('handles thresholds sorted in any order', () => {
		renderWithProviders(
			<Meter
				value={85}
				max={100}
				thresholds={[
					{ value: 90, variant: 'error' },
					{ value: 40, variant: 'success' },
					{ value: 80, variant: 'warning' },
				]}
			/>
		);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-warning"]');
		expect(meterBar).toBeInTheDocument();
	});
});

describe('Meter - Percentage Calculations', () => {
	it('calculates 0% for value at min', () => {
		renderWithProviders(<Meter value={0} min={0} max={100} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		expect(meterBar).toHaveStyle({ width: '0%' });
	});

	it('calculates 100% for value at max', () => {
		renderWithProviders(<Meter value={100} min={0} max={100} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		expect(meterBar).toHaveStyle({ width: '100%' });
	});

	it('calculates 50% for value at midpoint', () => {
		renderWithProviders(<Meter value={50} min={0} max={100} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		expect(meterBar).toHaveStyle({ width: '50%' });
	});

	it('calculates percentage with custom min', () => {
		renderWithProviders(<Meter value={30} min={10} max={100} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		// (30 - 10) / (100 - 10) * 100 = 22.22...%
		const width = meterBar?.getAttribute('style');
		expect(width).toMatch(/22\.22/);
	});

	it('clamps value below min to 0%', () => {
		renderWithProviders(<Meter value={-10} min={0} max={100} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		expect(meterBar).toHaveStyle({ width: '0%' });
	});

	it('clamps value above max to 100%', () => {
		renderWithProviders(<Meter value={150} min={0} max={100} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		expect(meterBar).toHaveStyle({ width: '100%' });
	});

	it('handles zero range (min equals max)', () => {
		renderWithProviders(<Meter value={50} min={50} max={50} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		expect(meterBar).toHaveStyle({ width: '0%' });
	});
});

describe('Meter - Accessibility', () => {
	it('has aria-label when provided', () => {
		renderWithProviders(<Meter value={50} max={100} aria-label="Custom label" />);
		const meter = screen.getByRole('meter', { name: 'Custom label' });
		expect(meter).toBeInTheDocument();
	});

	it('generates aria-label from label and value', () => {
		renderWithProviders(<Meter value={50} max={100} label="Storage" unit="GB" />);
		const meter = screen.getByRole('meter');
		const ariaLabel = meter.getAttribute('aria-label');
		expect(ariaLabel).toContain('Storage');
		expect(ariaLabel).toContain('50');
		expect(ariaLabel).toContain('100');
		expect(ariaLabel).toContain('GB');
	});

	it('generates default aria-label when no label provided', () => {
		renderWithProviders(<Meter value={50} max={100} />);
		const meter = screen.getByRole('meter');
		const ariaLabel = meter.getAttribute('aria-label');
		expect(ariaLabel).toContain('Meter');
		expect(ariaLabel).toContain('50');
		expect(ariaLabel).toContain('100');
	});

	it('passes accessibility checks', async () => {
		const { container } = renderWithProviders(
			<Meter value={50} max={100} label="Storage" unit="GB" />
		);
		await expectA11y(container);
	});
});

describe('Meter - Edge Cases', () => {
	it('handles zero value', () => {
		renderWithProviders(<Meter value={0} max={100} />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveAttribute('value', '0');
		expect(screen.getByText(/0.*100/)).toBeInTheDocument();
	});

	it('handles very large values', () => {
		renderWithProviders(<Meter value={999999} max={1000000} />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveAttribute('value', '999999');
	});

	it('handles decimal values', () => {
		renderWithProviders(<Meter value={50.5} max={100} />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveAttribute('value', '50.5');
	});

	it('handles negative min value', () => {
		renderWithProviders(<Meter value={0} min={-50} max={50} />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveAttribute('min', '-50');
		expect(meter).toHaveAttribute('value', '0');
		// Should calculate 50%: (0 - (-50)) / (50 - (-50)) * 100 = 50%
		const meterBar = meter.parentElement?.querySelector('div[style*="width"]');
		expect(meterBar).toHaveStyle({ width: '50%' });
	});

	it('handles empty thresholds array', () => {
		renderWithProviders(<Meter value={50} max={100} thresholds={[]} />);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-primary"]');
		expect(meterBar).toBeInTheDocument();
	});

	it('handles single threshold', () => {
		renderWithProviders(
			<Meter value={50} max={100} thresholds={[{ value: 40, variant: 'success' }]} />
		);
		const meter = screen.getByRole('meter');
		const meterBar = meter.parentElement?.querySelector('div[class*="bg-success"]');
		expect(meterBar).toBeInTheDocument();
	});
});

describe('Meter - HTML Attributes', () => {
	it('passes through additional HTML attributes', () => {
		renderWithProviders(<Meter value={50} max={100} data-testid="custom-meter" id="meter-1" />);
		const meter = screen.getByTestId('custom-meter');
		expect(meter).toHaveAttribute('id', 'meter-1');
	});

	it('merges custom className with default classes', () => {
		renderWithProviders(<Meter value={50} max={100} className="my-custom-class" />);
		const meter = screen.getByRole('meter');
		expect(meter).toHaveClass('my-custom-class');
	});
});
