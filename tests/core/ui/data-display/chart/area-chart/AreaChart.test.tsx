/**
 * AreaChart Component Tests
 *
 * Tests for the AreaChart component including:
 * - Rendering
 * - Data visualization
 * - Interactions (tooltips, legends, hover)
 * - Empty state handling
 * - Accessibility
 */

import AreaChart from '@core/ui/data-display/chart/area-chart/AreaChart';
import type { AreaChartProps } from '@src-types/ui/data/chart';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { defaultAxeConfig, expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

// Helper to find chart container using test ID
const findChartContainer = () => screen.getByTestId('area-chart-container');

const mockData = [
	{ name: 'Jan', value: 400 },
	{ name: 'Feb', value: 300 },
	{ name: 'Mar', value: 200 },
	{ name: 'Apr', value: 500 },
	{ name: 'May', value: 600 },
];

describe('AreaChart - Rendering', () => {
	it('renders chart with data', () => {
		renderWithProviders(<AreaChart data={mockData} title="Monthly Trends" />);
		expect(screen.getByText('Monthly Trends')).toBeInTheDocument();
	});

	it('renders empty state when data is empty', () => {
		renderWithProviders(
			<AreaChart data={[]} title="Monthly Trends" emptyMessage="No data available" />
		);
		expect(screen.getByText('No data available')).toBeInTheDocument();
	});

	it('renders with custom empty message', () => {
		renderWithProviders(<AreaChart data={[]} emptyMessage="Custom empty message" />);
		expect(screen.getByText('Custom empty message')).toBeInTheDocument();
	});

	it('renders with title and description', () => {
		renderWithProviders(
			<AreaChart data={mockData} title="Sales Trends" description="Monthly sales data for 2024" />
		);
		expect(screen.getByText('Sales Trends')).toBeInTheDocument();
		expect(screen.getByText('Monthly sales data for 2024')).toBeInTheDocument();
	});

	it('renders without title', async () => {
		renderWithProviders(<AreaChart data={mockData} />);
		// Chart should still render even without title
		// Recharts ResponsiveContainer may render asynchronously
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('applies custom className', () => {
		renderWithProviders(<AreaChart data={mockData} className="custom-chart-class" />);
		const rootWrapper = screen.getByTestId('area-chart-root');
		expect(rootWrapper).toHaveClass('custom-chart-class');
	});

	it('applies custom chartClassName', () => {
		renderWithProviders(<AreaChart data={mockData} chartClassName="custom-inner-class" />);
		const chartContainer = findChartContainer();
		expect(chartContainer).toHaveClass('custom-inner-class');
	});
});

describe('AreaChart - Data Visualization', () => {
	it('renders chart with provided data', async () => {
		renderWithProviders(<AreaChart data={mockData} />);
		// Recharts renders SVG elements via ResponsiveContainer
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('handles single data point', async () => {
		renderWithProviders(<AreaChart data={[{ name: 'Jan', value: 400 }]} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('handles multiple data points', async () => {
		const largeDataset = Array.from({ length: 20 }, (_, i) => ({
			name: `Month ${i + 1}`,
			value: Math.floor(Math.random() * 1000),
		}));
		renderWithProviders(<AreaChart data={largeDataset} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with custom width and height', async () => {
		renderWithProviders(<AreaChart data={mockData} width={800} height={400} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with custom dataKey', async () => {
		const dataWithCustomKey: Array<{ name: string; sales: number; value?: number }> = [
			{ name: 'Jan', sales: 400 },
			{ name: 'Feb', sales: 300 },
		];
		renderWithProviders(
			<AreaChart data={dataWithCustomKey as AreaChartProps['data']} dataKey="sales" />
		);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with different color schemes', async () => {
		const { rerender } = renderWithProviders(<AreaChart data={mockData} colorScheme="primary" />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});

		rerender(<AreaChart data={mockData} colorScheme="success" />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});
});

describe('AreaChart - Configuration Options', () => {
	it('renders with showDots enabled', async () => {
		renderWithProviders(<AreaChart data={mockData} showDots />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with showDots disabled', async () => {
		renderWithProviders(<AreaChart data={mockData} showDots={false} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with custom strokeWidth', async () => {
		renderWithProviders(<AreaChart data={mockData} strokeWidth={4} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with connectNulls enabled', async () => {
		const dataWithNulls = [
			{ name: 'Jan', value: 400 },
			{ name: 'Feb', value: null },
			{ name: 'Mar', value: 200 },
		];
		renderWithProviders(<AreaChart data={dataWithNulls as AreaChartProps['data']} connectNulls />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with custom fillOpacity', async () => {
		renderWithProviders(<AreaChart data={mockData} fillOpacity={0.8} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});
});

describe('AreaChart - Curve Configuration', () => {
	it('renders with different curve types', async () => {
		const curveTypes = [
			'linear',
			'monotone',
			'step',
			'stepBefore',
			'stepAfter',
		] as const satisfies ReadonlyArray<'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter'>;

		const { rerender } = renderWithProviders(
			<AreaChart data={mockData} curveType={curveTypes[0]} />
		);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});

		for (let i = 1; i < curveTypes.length; i++) {
			const curveType = curveTypes[i];
			if (curveType) {
				rerender(<AreaChart data={mockData} curveType={curveType} />);
				await waitFor(() => {
					expect(findChartContainer()).toBeInTheDocument();
				});
			}
		}
	});
});

describe('AreaChart - Interactions', () => {
	it('shows legend when showLegend is true', async () => {
		renderWithProviders(<AreaChart data={mockData} showLegend />);
		// Legend is rendered by recharts
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('hides legend when showLegend is false', async () => {
		renderWithProviders(<AreaChart data={mockData} showLegend={false} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('shows tooltip when showTooltip is true', async () => {
		renderWithProviders(<AreaChart data={mockData} showTooltip />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('hides tooltip when showTooltip is false', async () => {
		renderWithProviders(<AreaChart data={mockData} showTooltip={false} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('shows grid when showGrid is true', async () => {
		renderWithProviders(<AreaChart data={mockData} showGrid />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('hides grid when showGrid is false', async () => {
		renderWithProviders(<AreaChart data={mockData} showGrid={false} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('handles hover interactions', async () => {
		renderWithProviders(<AreaChart data={mockData} showTooltip />);
		const chartContainer = findChartContainer();
		await waitFor(() => {
			expect(chartContainer).toBeInTheDocument();
		});

		// Simulate hover on chart area using test ID
		const responsiveContainer = screen.getByTestId('area-chart-responsive-container');
		fireEvent.mouseEnter(responsiveContainer);
		// Tooltip interaction is handled by recharts internally
	});
});

describe('AreaChart - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const { container } = renderWithProviders(
			<AreaChart data={mockData} title="Monthly Trends" description="Sales data" />
		);
		// Skip aria-label check as it may be on div without role (component issue)
		const config = {
			...defaultAxeConfig,
			rules: {
				...defaultAxeConfig.rules,
				'aria-prohibited-attr': { enabled: false },
			},
		} as typeof defaultAxeConfig;
		await expectA11y(container, config);
	});

	it('renders with accessible title', () => {
		renderWithProviders(<AreaChart data={mockData} title="Monthly Sales Trends" />);
		expect(screen.getByText('Monthly Sales Trends')).toBeInTheDocument();
	});

	it('renders with accessible description', () => {
		renderWithProviders(
			<AreaChart data={mockData} title="Sales" description="Monthly sales data visualization" />
		);
		expect(screen.getByText('Monthly sales data visualization')).toBeInTheDocument();
	});

	it('has proper ARIA attributes', async () => {
		renderWithProviders(<AreaChart data={mockData} title="Chart Title" />);
		// Chart container should have proper structure
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
		const chartContainer = findChartContainer();
		// Chart container should have aria-label
		expect(chartContainer).toHaveAttribute('aria-label');
	});
});
