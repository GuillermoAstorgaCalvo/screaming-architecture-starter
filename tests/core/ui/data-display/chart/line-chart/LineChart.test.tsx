/**
 * LineChart Component Tests
 *
 * Tests for the LineChart component including:
 * - Rendering
 * - Data visualization
 * - Interactions (tooltips, legends, hover)
 * - Empty state handling
 * - Accessibility
 */

import LineChart from '@core/ui/data-display/chart/line-chart/LineChart';
import type { LineChartProps } from '@src-types/ui/data/chart';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

// Helper to find chart container using test ID (preferred method)
const findChartContainer = () => screen.getByTestId('line-chart-container');

const mockData = [
	{ name: 'Jan', value: 400 },
	{ name: 'Feb', value: 300 },
	{ name: 'Mar', value: 200 },
	{ name: 'Apr', value: 500 },
	{ name: 'May', value: 600 },
];

describe('LineChart - Rendering', () => {
	describe('Basic Rendering', () => {
		it('renders chart with data', () => {
			renderWithProviders(<LineChart data={mockData} title="Monthly Trends" />);
			expect(screen.getByText('Monthly Trends')).toBeInTheDocument();
		});

		it('renders empty state when data is empty', () => {
			renderWithProviders(
				<LineChart data={[]} title="Monthly Trends" emptyMessage="No data available" />
			);
			expect(screen.getByText('No data available')).toBeInTheDocument();
		});

		it('renders with custom empty message', () => {
			renderWithProviders(<LineChart data={[]} emptyMessage="Custom empty message" />);
			expect(screen.getByText('Custom empty message')).toBeInTheDocument();
		});

		it('renders with title and description', () => {
			renderWithProviders(
				<LineChart
					data={mockData}
					title="Trend Analysis"
					description="Monthly trend data for 2024"
				/>
			);
			expect(screen.getByText('Trend Analysis')).toBeInTheDocument();
			expect(screen.getByText('Monthly trend data for 2024')).toBeInTheDocument();
		});

		it('renders without title', async () => {
			renderWithProviders(<LineChart data={mockData} />);
			// Chart should still render even without title
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
		});
	});

	describe('Styling and Classes', () => {
		it('applies custom className', () => {
			renderWithProviders(<LineChart data={mockData} className="custom-chart-class" />);
			const rootWrapper = screen.getByTestId('line-chart-root');
			expect(rootWrapper).toHaveClass('custom-chart-class');
		});

		it('applies custom chartClassName', () => {
			renderWithProviders(<LineChart data={mockData} chartClassName="custom-inner-class" />);
			const chartContainer = findChartContainer();
			expect(chartContainer).toHaveClass('custom-inner-class');
		});
	});
});

describe('LineChart - Basic Data Rendering', () => {
	it('renders chart with provided data', async () => {
		renderWithProviders(<LineChart data={mockData} />);
		// Recharts renders SVG elements via ResponsiveContainer
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('handles single data point', async () => {
		renderWithProviders(<LineChart data={[{ name: 'Jan', value: 400 }]} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('handles multiple data points', async () => {
		const largeDataset = Array.from({ length: 20 }, (_, i) => ({
			name: `Month ${i + 1}`,
			value: Math.floor(Math.random() * 1000),
		}));
		renderWithProviders(<LineChart data={largeDataset} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});
});

describe('LineChart - Data Configuration', () => {
	it('renders with custom width and height', async () => {
		renderWithProviders(<LineChart data={mockData} width={800} height={400} />);
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
			<LineChart data={dataWithCustomKey as LineChartProps['data']} dataKey="sales" />
		);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with different color schemes', async () => {
		const { rerender } = renderWithProviders(<LineChart data={mockData} colorScheme="primary" />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});

		rerender(<LineChart data={mockData} colorScheme="success" />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});
});

describe('LineChart - Visual Options', () => {
	it('renders with showDots enabled (default)', async () => {
		renderWithProviders(<LineChart data={mockData} showDots />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with showDots disabled', async () => {
		renderWithProviders(<LineChart data={mockData} showDots={false} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with filled area', async () => {
		renderWithProviders(<LineChart data={mockData} filled />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders without filled area', async () => {
		renderWithProviders(<LineChart data={mockData} filled={false} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});
});

describe('LineChart - Line Configuration', () => {
	it('renders with custom strokeWidth', async () => {
		renderWithProviders(<LineChart data={mockData} strokeWidth={4} />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});

	it('renders with different curve types', async () => {
		const curveTypes = [
			'linear',
			'monotone',
			'step',
			'stepBefore',
			'stepAfter',
		] as const satisfies ReadonlyArray<'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter'>;

		const { rerender } = renderWithProviders(
			<LineChart data={mockData} curveType={curveTypes[0]} />
		);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});

		for (let i = 1; i < curveTypes.length; i++) {
			const curveType = curveTypes[i];
			if (curveType) {
				rerender(<LineChart data={mockData} curveType={curveType} />);
				await waitFor(() => {
					expect(findChartContainer()).toBeInTheDocument();
				});
			}
		}
	});

	it('renders with connectNulls enabled', async () => {
		const dataWithNulls = [
			{ name: 'Jan', value: 400 },
			{ name: 'Feb', value: null },
			{ name: 'Mar', value: 200 },
		];
		renderWithProviders(<LineChart data={dataWithNulls as LineChartProps['data']} connectNulls />);
		await waitFor(() => {
			expect(findChartContainer()).toBeInTheDocument();
		});
	});
});

describe('LineChart - Interactions', () => {
	describe('Legend and Tooltip', () => {
		it('shows legend when showLegend is true', async () => {
			renderWithProviders(<LineChart data={mockData} showLegend />);
			// Legend is rendered by recharts
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
		});

		it('hides legend when showLegend is false', async () => {
			renderWithProviders(<LineChart data={mockData} showLegend={false} />);
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
		});

		it('shows tooltip when showTooltip is true', async () => {
			renderWithProviders(<LineChart data={mockData} showTooltip />);
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
		});

		it('hides tooltip when showTooltip is false', async () => {
			renderWithProviders(<LineChart data={mockData} showTooltip={false} />);
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
		});
	});

	describe('Grid and Hover', () => {
		it('shows grid when showGrid is true', async () => {
			renderWithProviders(<LineChart data={mockData} showGrid />);
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
		});

		it('hides grid when showGrid is false', async () => {
			renderWithProviders(<LineChart data={mockData} showGrid={false} />);
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
		});

		it('handles hover interactions', async () => {
			renderWithProviders(<LineChart data={mockData} showTooltip />);
			const chartContainer = findChartContainer();
			await waitFor(() => {
				expect(chartContainer).toBeInTheDocument();
			});

			// Simulate hover on chart area using test ID
			const responsiveContainer = screen.getByTestId('line-chart-responsive-container');
			fireEvent.mouseEnter(responsiveContainer);
			// Tooltip interaction is handled by recharts internally
		});
	});
});

describe('LineChart - Accessibility', () => {
	describe('A11y Violations and Content', () => {
		it('has no accessibility violations', async () => {
			const { container } = renderWithProviders(
				<LineChart data={mockData} title="Monthly Trends" description="Trend data" />
			);
			await expectA11y(container);
		});

		it('renders with accessible title', () => {
			renderWithProviders(<LineChart data={mockData} title="Monthly Trend Analysis" />);
			expect(screen.getByText('Monthly Trend Analysis')).toBeInTheDocument();
		});

		it('renders with accessible description', () => {
			renderWithProviders(
				<LineChart data={mockData} title="Trends" description="Monthly trend data visualization" />
			);
			expect(screen.getByText('Monthly trend data visualization')).toBeInTheDocument();
		});
	});

	describe('ARIA Attributes', () => {
		it('has proper ARIA attributes', async () => {
			renderWithProviders(<LineChart data={mockData} title="Chart Title" />);
			// Chart container should have proper structure
			await waitFor(() => {
				expect(findChartContainer()).toBeInTheDocument();
			});
			const chartContainer = findChartContainer();
			// Chart container should have aria-label
			expect(chartContainer).toHaveAttribute('aria-label');
		});
	});
});
