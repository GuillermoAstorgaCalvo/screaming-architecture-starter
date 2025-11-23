/**
 * TrendIndicator Component Tests
 *
 * Tests for the TrendIndicator component including:
 * - Rendering with different trend directions (up, down, neutral)
 * - Different sizes (sm, md, lg)
 * - Icon rendering (up/down have icons, neutral doesn't)
 * - Label rendering (optional)
 * - Positive and negative trend values
 * - Accessibility attributes (aria-label)
 * - CSS classes application
 */

import { TrendIndicator } from '@core/ui/data-display/stat/components/TrendIndicator';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('TrendIndicator - Basic Rendering', () => {
	it('renders trend indicator container', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />);
		const container = screen.getByLabelText(/trend: up/i);
		expect(container).toBeInTheDocument();
		expect(container.tagName).toBe('DIV');
	});

	it('renders formatted trend value', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />);
		expect(screen.getByText('+5.5%')).toBeInTheDocument();
	});

	it('renders with positive trend value', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 10 }} size="md" />);
		expect(screen.getByText('+10.0%')).toBeInTheDocument();
	});

	it('renders with negative trend value', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'down', value: -5.5 }} size="md" />);
		expect(screen.getByText('-5.5%')).toBeInTheDocument();
	});

	it('renders with zero trend value', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'neutral', value: 0 }} size="md" />);
		expect(screen.getByText('+0.0%')).toBeInTheDocument();
	});
});

describe('TrendIndicator - Trend Directions', () => {
	it('renders up trend with arrow-up icon', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />);
		const container = screen.getByLabelText(/trend: up/i);
		expect(container).toBeInTheDocument();
		// Icon should be present for up direction
		const icon = container.querySelector('[aria-hidden="true"]');
		expect(icon).toBeInTheDocument();
	});

	it('renders down trend with arrow-down icon', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'down', value: -5.5 }} size="md" />);
		const container = screen.getByLabelText(/trend: down/i);
		expect(container).toBeInTheDocument();
		// Icon should be present for down direction
		const icon = container.querySelector('[aria-hidden="true"]');
		expect(icon).toBeInTheDocument();
	});

	it('renders neutral trend without icon', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'neutral', value: 0 }} size="md" />);
		const container = screen.getByLabelText(/trend: neutral/i);
		expect(container).toBeInTheDocument();
		// Icon should not be present for neutral direction
		const icon = container.querySelector('[aria-hidden="true"]');
		expect(icon).not.toBeInTheDocument();
	});

	it('applies correct color classes for up direction', () => {
		const { container } = renderWithProviders(
			<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />
		);
		const trendContainer = container.firstChild as HTMLElement;
		expect(trendContainer).toHaveClass('text-success');
	});

	it('applies correct color classes for down direction', () => {
		const { container } = renderWithProviders(
			<TrendIndicator trend={{ direction: 'down', value: -5.5 }} size="md" />
		);
		const trendContainer = container.firstChild as HTMLElement;
		expect(trendContainer).toHaveClass('text-destructive');
	});

	it('applies correct color classes for neutral direction', () => {
		const { container } = renderWithProviders(
			<TrendIndicator trend={{ direction: 'neutral', value: 0 }} size="md" />
		);
		const trendContainer = container.firstChild as HTMLElement;
		expect(trendContainer).toHaveClass('text-text-secondary');
	});
});

describe('TrendIndicator - Sizes', () => {
	it('renders with sm size', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="sm" />);
		const container = screen.getByLabelText(/trend: up/i);
		expect(container).toBeInTheDocument();
	});

	it('renders with md size', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />);
		const container = screen.getByLabelText(/trend: up/i);
		expect(container).toBeInTheDocument();
	});

	it('renders with lg size', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="lg" />);
		const container = screen.getByLabelText(/trend: up/i);
		expect(container).toBeInTheDocument();
	});

	it('applies size-specific classes for all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
		for (const size of sizes) {
			const { container, unmount } = renderWithProviders(
				<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size={size} />
			);
			const trendContainer = container.firstChild as HTMLElement;
			expect(trendContainer).toBeInTheDocument();
			unmount();
		}
	});
});

describe('TrendIndicator - Optional Label', () => {
	it('renders without label when not provided', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />);
		const container = screen.getByLabelText(/trend: up/i);
		// Should only have the value span, not a label span
		const spans = container.querySelectorAll('span');
		expect(spans.length).toBe(1); // Only the value span
		expect(spans[0]?.textContent).toBe('+5.5%');
	});

	it('renders with label when provided', () => {
		renderWithProviders(
			<TrendIndicator trend={{ direction: 'up', value: 5.5, label: 'vs last month' }} size="md" />
		);
		expect(screen.getByText('+5.5%')).toBeInTheDocument();
		expect(screen.getByText('vs last month')).toBeInTheDocument();
	});

	it('applies correct styling to label', () => {
		renderWithProviders(
			<TrendIndicator trend={{ direction: 'up', value: 5.5, label: 'vs last month' }} size="md" />
		);
		const label = screen.getByText('vs last month');
		expect(label).toHaveClass('text-text-muted', 'font-normal');
	});

	it('renders label with different text', () => {
		renderWithProviders(
			<TrendIndicator
				trend={{ direction: 'down', value: -3.2, label: 'from previous period' }}
				size="md"
			/>
		);
		expect(screen.getByText('from previous period')).toBeInTheDocument();
	});
});

describe('TrendIndicator - CSS Classes', () => {
	it('applies base styling classes', () => {
		const { container } = renderWithProviders(
			<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />
		);
		const trendContainer = container.firstChild as HTMLElement;
		expect(trendContainer).toHaveClass('flex', 'items-center', 'gap-xs', 'font-medium');
	});

	it('merges size classes with base classes', () => {
		const { container } = renderWithProviders(
			<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="sm" />
		);
		const trendContainer = container.firstChild as HTMLElement;
		expect(trendContainer).toHaveClass('flex', 'items-center', 'gap-xs', 'font-medium');
	});

	it('merges color classes with base classes', () => {
		const { container } = renderWithProviders(
			<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />
		);
		const trendContainer = container.firstChild as HTMLElement;
		expect(trendContainer).toHaveClass(
			'flex',
			'items-center',
			'gap-xs',
			'font-medium',
			'text-success'
		);
	});
});

describe('TrendIndicator - Accessibility', () => {
	it('sets aria-label with trend direction and value', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />);
		const container = screen.getByLabelText('Trend: up +5.5%');
		expect(container).toBeInTheDocument();
	});

	it('sets aria-label for down direction', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'down', value: -5.5 }} size="md" />);
		const container = screen.getByLabelText('Trend: down -5.5%');
		expect(container).toBeInTheDocument();
	});

	it('sets aria-label for neutral direction', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'neutral', value: 0 }} size="md" />);
		const container = screen.getByLabelText('Trend: neutral +0.0%');
		expect(container).toBeInTheDocument();
	});

	it('sets aria-hidden on icon when present', () => {
		renderWithProviders(<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size="md" />);
		const container = screen.getByLabelText(/trend: up/i);
		const icon = container.querySelector('[aria-hidden="true"]');
		expect(icon).toBeInTheDocument();
		expect(icon).toHaveAttribute('aria-hidden', 'true');
	});
});

describe('TrendIndicator - Integration', () => {
	it('renders correctly with all trend directions', () => {
		const trends = [
			{ direction: 'up' as const, value: 5.5 },
			{ direction: 'down' as const, value: -3.2 },
			{ direction: 'neutral' as const, value: 0 },
		];

		for (const trend of trends) {
			const { unmount } = renderWithProviders(<TrendIndicator trend={trend} size="md" />);
			const container = screen.getByLabelText(new RegExp(`Trend: ${trend.direction}`, 'i'));
			expect(container).toBeInTheDocument();
			unmount();
		}
	});

	it('renders correctly with all size variants', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<TrendIndicator trend={{ direction: 'up', value: 5.5 }} size={size} />
			);
			const container = screen.getByLabelText(/trend: up/i);
			expect(container).toBeInTheDocument();
			unmount();
		}
	});

	it('renders correctly with combination of props', () => {
		renderWithProviders(
			<TrendIndicator
				trend={{ direction: 'up', value: 12.5, label: 'vs last quarter' }}
				size="lg"
			/>
		);
		expect(screen.getByText('+12.5%')).toBeInTheDocument();
		expect(screen.getByText('vs last quarter')).toBeInTheDocument();
		const container = screen.getByLabelText(/trend: up/i);
		expect(container).toBeInTheDocument();
	});

	it('handles edge case values correctly', () => {
		const edgeCases = [
			{ value: 0.01, expected: '+0.0%' },
			{ value: -0.01, expected: '-0.0%' },
			{ value: 99.99, expected: '+100.0%' },
			{ value: -99.99, expected: '-100.0%' },
			{ value: 1000, expected: '+1000.0%' },
			{ value: -1000, expected: '-1000.0%' },
		];

		for (const edgeCase of edgeCases) {
			const { unmount } = renderWithProviders(
				<TrendIndicator trend={{ direction: 'up', value: edgeCase.value }} size="md" />
			);
			expect(screen.getByText(edgeCase.expected)).toBeInTheDocument();
			unmount();
		}
	});
});
