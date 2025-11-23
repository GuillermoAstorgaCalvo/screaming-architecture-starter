/**
 * MeterComponents Tests
 *
 * Tests for MeterComponents including:
 * - MeterBar: rendering with different variants and percentages
 * - MeterValue: rendering with default and custom formatters, with/without units
 * - MeterLabel: rendering with different labels
 * - MeterElement: rendering with all props and integration
 * - Accessibility
 */

import {
	MeterBar,
	MeterElement,
	MeterLabel,
	MeterValue,
} from '@core/ui/data-display/meter/components/MeterComponents';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('MeterBar - Rendering', () => {
	it('should render meter bar element', () => {
		const { container } = renderWithProviders(<MeterBar percentage={50} variant="default" />);
		const bar = container.querySelector('div');
		expect(bar).toBeInTheDocument();
	});

	it('should apply correct width style based on percentage', () => {
		const { container } = renderWithProviders(<MeterBar percentage={75} variant="default" />);
		const bar = container.querySelector('div');
		expect(bar).toHaveStyle({ width: '75%' });
	});

	it('should apply width style for 0%', () => {
		const { container } = renderWithProviders(<MeterBar percentage={0} variant="default" />);
		const bar = container.querySelector('div');
		expect(bar).toHaveStyle({ width: '0%' });
	});

	it('should apply width style for 100%', () => {
		const { container } = renderWithProviders(<MeterBar percentage={100} variant="default" />);
		const bar = container.querySelector('div');
		expect(bar).toHaveStyle({ width: '100%' });
	});

	it('should apply base classes', () => {
		const { container } = renderWithProviders(<MeterBar percentage={50} variant="default" />);
		const bar = container.querySelector('div');
		expect(bar).toHaveClass('h-full');
	});
});

describe('MeterBar - Variants', () => {
	it('should render with default variant', () => {
		const { container } = renderWithProviders(<MeterBar percentage={50} variant="default" />);
		const bar = container.querySelector('div');
		expect(bar).toBeInTheDocument();
		expect(bar).toHaveClass('bg-primary');
	});

	it('should render with success variant', () => {
		const { container } = renderWithProviders(<MeterBar percentage={50} variant="success" />);
		const bar = container.querySelector('div');
		expect(bar).toBeInTheDocument();
		expect(bar).toHaveClass('bg-success');
	});

	it('should render with warning variant', () => {
		const { container } = renderWithProviders(<MeterBar percentage={50} variant="warning" />);
		const bar = container.querySelector('div');
		expect(bar).toBeInTheDocument();
		expect(bar).toHaveClass('bg-warning');
	});

	it('should render with error variant', () => {
		const { container } = renderWithProviders(<MeterBar percentage={50} variant="error" />);
		const bar = container.querySelector('div');
		expect(bar).toBeInTheDocument();
		expect(bar).toHaveClass('bg-destructive');
	});
});

describe('MeterValue - Rendering', () => {
	it('should render meter value element', () => {
		renderWithProviders(<MeterValue value={50} max={100} />);
		const valueElement = screen.getByText(/50/);
		expect(valueElement).toBeInTheDocument();
	});

	it('should display formatted value with default formatter', () => {
		renderWithProviders(<MeterValue value={50} max={100} />);
		expect(screen.getByText('50 / 100')).toBeInTheDocument();
	});

	it('should display formatted value with unit', () => {
		renderWithProviders(<MeterValue value={50} max={100} unit="GB" />);
		expect(screen.getByText('50 / 100 GB')).toBeInTheDocument();
	});

	it('should display formatted value with custom unit', () => {
		renderWithProviders(<MeterValue value={75} max={200} unit="MB" />);
		expect(screen.getByText('75 / 200 MB')).toBeInTheDocument();
	});

	it('should apply correct CSS classes', () => {
		const { container } = renderWithProviders(<MeterValue value={50} max={100} />);
		const valueElement = container.querySelector('div');
		expect(valueElement).toHaveClass('mt-1', 'text-xs', 'text-text-secondary');
	});

	it('should handle large numbers with default formatter', () => {
		renderWithProviders(<MeterValue value={1000} max={5000} />);
		expect(screen.getByText('1,000 / 5,000')).toBeInTheDocument();
	});
});

describe('MeterValue - Custom Formatter', () => {
	it('should use custom formatter when provided', () => {
		const customFormatter = vi.fn((value: number, max: number, unit?: string) => {
			return `${value}${unit || ''} of ${max}${unit || ''}`;
		});

		renderWithProviders(<MeterValue value={50} max={100} formatValue={customFormatter} />);
		expect(screen.getByText('50 of 100')).toBeInTheDocument();
		expect(customFormatter).toHaveBeenCalledWith(50, 100, undefined);
	});

	it('should use custom formatter with unit', () => {
		const customFormatter = vi.fn((value: number, max: number, unit?: string) => {
			return `${value}${unit} / ${max}${unit}`;
		});

		renderWithProviders(
			<MeterValue value={75} max={200} unit="GB" formatValue={customFormatter} />
		);
		expect(screen.getByText('75GB / 200GB')).toBeInTheDocument();
		expect(customFormatter).toHaveBeenCalledWith(75, 200, 'GB');
	});

	it('should prioritize custom formatter over default', () => {
		const customFormatter = vi.fn(() => 'Custom format');
		renderWithProviders(<MeterValue value={50} max={100} formatValue={customFormatter} />);
		expect(screen.getByText('Custom format')).toBeInTheDocument();
		expect(customFormatter).toHaveBeenCalledTimes(1);
	});
});

describe('MeterLabel - Rendering', () => {
	it('should render meter label element', () => {
		renderWithProviders(<MeterLabel label="Storage" />);
		expect(screen.getByText('Storage')).toBeInTheDocument();
	});

	it('should display label text', () => {
		renderWithProviders(<MeterLabel label="Bandwidth Usage" />);
		expect(screen.getByText('Bandwidth Usage')).toBeInTheDocument();
	});

	it('should apply correct CSS classes', () => {
		const { container } = renderWithProviders(<MeterLabel label="Test Label" />);
		const labelElement = container.querySelector('div');
		expect(labelElement).toHaveClass('mb-1', 'text-sm', 'font-medium', 'text-text-primary');
	});

	it('should handle empty label', () => {
		const { container } = renderWithProviders(<MeterLabel label="" />);
		const labelElement = container.querySelector('div');
		expect(labelElement).toBeInTheDocument();
		expect(labelElement?.textContent).toBe('');
	});

	it('should handle long label text', () => {
		const longLabel = 'This is a very long label that should still be displayed correctly';
		renderWithProviders(<MeterLabel label={longLabel} />);
		expect(screen.getByText(longLabel)).toBeInTheDocument();
	});
});

describe('MeterElement - Rendering', () => {
	it('should render meter element', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={50}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Test meter"
				percentage={50}
				variant="default"
			/>
		);
		const meter = container.querySelector('meter');
		expect(meter).toBeInTheDocument();
	});

	it('should apply correct meter attributes', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={75}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Storage meter"
				percentage={75}
				variant="default"
			/>
		);
		const meter = container.querySelector('meter');
		expect(meter).toHaveAttribute('value', '75');
		expect(meter).toHaveAttribute('min', '0');
		expect(meter).toHaveAttribute('max', '100');
		expect(meter).toHaveAttribute('aria-label', 'Storage meter');
		expect(meter).toHaveClass('test-class');
	});

	it('should render with MeterBar overlay', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={50}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Test meter"
				percentage={50}
				variant="success"
			/>
		);
		const overlay = container.querySelector('.absolute');
		expect(overlay).toBeInTheDocument();
		const bar = overlay?.querySelector('div');
		expect(bar).toBeInTheDocument();
		expect(bar).toHaveStyle({ width: '50%' });
	});

	it('should apply correct container classes', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={50}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Test meter"
				percentage={50}
				variant="default"
			/>
		);
		const containerDiv = container.querySelector('.relative');
		expect(containerDiv).toBeInTheDocument();
	});

	it('should render overlay with pointer-events-none', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={50}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Test meter"
				percentage={50}
				variant="default"
			/>
		);
		const overlay = container.querySelector('.pointer-events-none');
		expect(overlay).toBeInTheDocument();
	});

	it('should pass percentage to MeterBar', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={25}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Test meter"
				percentage={25}
				variant="warning"
			/>
		);
		const bar = container.querySelector('.absolute div');
		expect(bar).toHaveStyle({ width: '25%' });
	});

	it('should pass variant to MeterBar', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={50}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Test meter"
				percentage={50}
				variant="error"
			/>
		);
		const bar = container.querySelector('.absolute div');
		expect(bar).toHaveClass('bg-destructive');
	});

	it('should handle different min values', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={150}
				min={100}
				max={200}
				className="test-class"
				ariaLabel="Test meter"
				percentage={50}
				variant="default"
			/>
		);
		const meter = container.querySelector('meter');
		expect(meter).toHaveAttribute('min', '100');
		expect(meter).toHaveAttribute('max', '200');
		expect(meter).toHaveAttribute('value', '150');
	});
});

describe('MeterComponents - Accessibility', () => {
	it('MeterBar should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<MeterBar percentage={50} variant="default" />);
		await expectA11y(container);
	});

	it('MeterValue should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<MeterValue value={50} max={100} />);
		await expectA11y(container);
	});

	it('MeterLabel should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<MeterLabel label="Storage" />);
		await expectA11y(container);
	});

	it('MeterElement should have no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={50}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Storage meter"
				percentage={50}
				variant="default"
			/>
		);
		await expectA11y(container);
	});

	it('MeterElement should have proper ARIA label', () => {
		const { container } = renderWithProviders(
			<MeterElement
				value={50}
				min={0}
				max={100}
				className="test-class"
				ariaLabel="Storage usage meter"
				percentage={50}
				variant="default"
			/>
		);
		const meter = container.querySelector('meter');
		expect(meter).toHaveAttribute('aria-label', 'Storage usage meter');
	});
});
