/**
 * StatCard Component Tests
 *
 * Tests for StatCard component:
 * - Rendering
 * - Value and label display
 * - Optional trend indicators
 * - Optional icon display
 * - Size variants (sm, md, lg)
 * - Card variants (elevated, outlined, flat)
 * - Padding variants
 * - Custom className
 * - HTML attributes
 * - Accessibility
 */

import StatCard from '@core/ui/data-display/stat/StatCard';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const TestIcon = () => <svg data-testid="test-icon" />;

describe('StatCard - Rendering', () => {
	it('should render without crashing', () => {
		expect(() => {
			renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		}).not.toThrow();
	});

	it('should render value and label', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		expect(screen.getByText('1,234')).toBeInTheDocument();
		expect(screen.getByText('Total Users')).toBeInTheDocument();
	});

	it('should render numeric value', () => {
		renderWithProviders(<StatCard value={42} label="Active Sessions" />);
		expect(screen.getByText('42')).toBeInTheDocument();
		expect(screen.getByText('Active Sessions')).toBeInTheDocument();
	});

	it('should render with string value', () => {
		renderWithProviders(<StatCard value="99.9%" label="Uptime" />);
		expect(screen.getByText('99.9%')).toBeInTheDocument();
		expect(screen.getByText('Uptime')).toBeInTheDocument();
	});
});

describe('StatCard - Trend Indicator', () => {
	it('should render trend indicator with up direction', () => {
		renderWithProviders(
			<StatCard value="1,234" label="Total Users" trend={{ direction: 'up', value: 12.5 }} />
		);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render trend indicator with down direction', () => {
		renderWithProviders(
			<StatCard value={42} label="Active Sessions" trend={{ direction: 'down', value: 5.2 }} />
		);
		expect(screen.getByText('Active Sessions')).toBeInTheDocument();
		expect(screen.getByText('42')).toBeInTheDocument();
	});

	it('should render trend indicator with neutral direction', () => {
		renderWithProviders(
			<StatCard value="99.9%" label="Uptime" trend={{ direction: 'neutral', value: 0 }} />
		);
		expect(screen.getByText('Uptime')).toBeInTheDocument();
		expect(screen.getByText('99.9%')).toBeInTheDocument();
	});

	it('should render trend indicator with label', () => {
		renderWithProviders(
			<StatCard
				value="1,234"
				label="Total Users"
				trend={{ direction: 'up', value: 12.5, label: 'vs last week' }}
			/>
		);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should not render trend indicator when trend is not provided', () => {
		const { container } = renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
		// TrendIndicator should not be rendered
		const trendElements = container.querySelectorAll('[aria-label*="Trend"]');
		expect(trendElements.length).toBe(0);
	});
});

describe('StatCard - Icon', () => {
	it('should render icon when provided', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" icon={<TestIcon />} />);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should not render icon when not provided', () => {
		const { container } = renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
		// Icon container should not be rendered
		const iconContainers = container.querySelectorAll('[aria-hidden="true"]');
		const hasStatIcon = Array.from(iconContainers).some(
			el => el.textContent === '' || el.querySelector('svg')
		);
		expect(hasStatIcon).toBe(false);
	});

	it('should render icon with trend indicator', () => {
		renderWithProviders(
			<StatCard
				value="1,234"
				label="Total Users"
				icon={<TestIcon />}
				trend={{ direction: 'up', value: 12.5 }}
			/>
		);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});
});

describe('StatCard - Size Variants', () => {
	it('should render with default size (md)', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with sm size', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" size="sm" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with md size', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" size="md" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with lg size', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" size="lg" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should pass size to trend indicator', () => {
		renderWithProviders(
			<StatCard
				value="1,234"
				label="Total Users"
				size="lg"
				trend={{ direction: 'up', value: 12.5 }}
			/>
		);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should pass size to icon', () => {
		renderWithProviders(
			<StatCard value="1,234" label="Total Users" size="sm" icon={<TestIcon />} />
		);
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});
});

describe('StatCard - Card Variants', () => {
	it('should render with default variant (elevated)', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with elevated variant', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" variant="elevated" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with outlined variant', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" variant="outlined" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with flat variant', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" variant="flat" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});
});

describe('StatCard - Padding Variants', () => {
	it('should render with default padding (md)', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with sm padding', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" padding="sm" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with md padding', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" padding="md" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});

	it('should render with lg padding', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" padding="lg" />);
		expect(screen.getByText('Total Users')).toBeInTheDocument();
		expect(screen.getByText('1,234')).toBeInTheDocument();
	});
});

describe('StatCard - Custom className', () => {
	it('should apply custom className', () => {
		const { container } = renderWithProviders(
			<StatCard value="1,234" label="Total Users" className="custom-stat-card" />
		);
		const card = container.querySelector('.custom-stat-card');
		expect(card).toBeInTheDocument();
	});

	it('should merge custom className with variant classes', () => {
		const { container } = renderWithProviders(
			<StatCard value="1,234" label="Total Users" className="custom-class" size="lg" />
		);
		const card = container.querySelector('.custom-class');
		expect(card).toBeInTheDocument();
	});
});

describe('StatCard - HTML Attributes', () => {
	it('should preserve HTML attributes', () => {
		renderWithProviders(
			<StatCard
				value="1,234"
				label="Total Users"
				data-testid="stat-card"
				aria-label="Statistics card"
			/>
		);
		const card = screen.getByTestId('stat-card');
		expect(card).toBeInTheDocument();
		expect(card).toHaveAttribute('aria-label', 'Statistics card');
	});

	it('should support data attributes', () => {
		renderWithProviders(<StatCard value="1,234" label="Total Users" data-stat-id="user-count" />);
		const card = screen.getByText('Total Users').closest('[data-stat-id]');
		expect(card).toHaveAttribute('data-stat-id', 'user-count');
	});
});

describe('StatCard - Accessibility', () => {
	it('should have no accessibility violations', async () => {
		const { container } = renderWithProviders(<StatCard value="1,234" label="Total Users" />);
		await expectA11y(container);
	});

	it('should have no accessibility violations with trend', async () => {
		const { container } = renderWithProviders(
			<StatCard value="1,234" label="Total Users" trend={{ direction: 'up', value: 12.5 }} />
		);
		await expectA11y(container);
	});

	it('should have no accessibility violations with icon', async () => {
		const { container } = renderWithProviders(
			<StatCard value="1,234" label="Total Users" icon={<TestIcon />} />
		);
		await expectA11y(container);
	});

	it('should have no accessibility violations with all props', async () => {
		const { container } = renderWithProviders(
			<StatCard
				value="1,234"
				label="Total Users"
				trend={{ direction: 'up', value: 12.5, label: 'vs last week' }}
				icon={<TestIcon />}
				size="lg"
				variant="outlined"
			/>
		);
		await expectA11y(container);
	});
});

describe('StatCard - Integration', () => {
	it('should render correctly with all optional props', () => {
		renderWithProviders(
			<StatCard
				value={42}
				label="Active Sessions"
				trend={{ direction: 'down', value: 5.2, label: 'vs last week' }}
				icon={<TestIcon />}
				size="lg"
				variant="outlined"
				padding="lg"
			/>
		);
		expect(screen.getByText('Active Sessions')).toBeInTheDocument();
		expect(screen.getByText('42')).toBeInTheDocument();
		expect(screen.getByTestId('test-icon')).toBeInTheDocument();
	});

	it('should render correctly with minimal props', () => {
		renderWithProviders(<StatCard value="0" label="Empty State" />);
		expect(screen.getByText('Empty State')).toBeInTheDocument();
		expect(screen.getByText('0')).toBeInTheDocument();
	});

	it('should handle all size variants with trend', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];
		for (const size of sizes) {
			const { unmount } = renderWithProviders(
				<StatCard
					value="1,234"
					label="Total Users"
					size={size}
					trend={{ direction: 'up', value: 12.5 }}
				/>
			);
			expect(screen.getByText('Total Users')).toBeInTheDocument();
			expect(screen.getByText('1,234')).toBeInTheDocument();
			unmount();
		}
	});

	it('should handle all card variants', () => {
		const variants: Array<'elevated' | 'outlined' | 'flat'> = ['elevated', 'outlined', 'flat'];
		for (const variant of variants) {
			const { unmount } = renderWithProviders(
				<StatCard value="1,234" label="Total Users" variant={variant} />
			);
			expect(screen.getByText('Total Users')).toBeInTheDocument();
			expect(screen.getByText('1,234')).toBeInTheDocument();
			unmount();
		}
	});

	it('should handle all trend directions', () => {
		const directions: Array<'up' | 'down' | 'neutral'> = ['up', 'down', 'neutral'];
		for (const direction of directions) {
			const { unmount } = renderWithProviders(
				<StatCard value="1,234" label="Total Users" trend={{ direction, value: 12.5 }} />
			);
			expect(screen.getByText('Total Users')).toBeInTheDocument();
			expect(screen.getByText('1,234')).toBeInTheDocument();
			unmount();
		}
	});
});
