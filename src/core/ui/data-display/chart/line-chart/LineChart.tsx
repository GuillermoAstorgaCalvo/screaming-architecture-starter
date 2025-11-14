import { LineChartContent } from '@core/ui/data-display/chart/line-chart/components/LineChartContent';
import { LineChartEmptyState } from '@core/ui/data-display/chart/line-chart/components/LineChartEmptyState';
import { LineChartWrapper } from '@core/ui/data-display/chart/line-chart/components/LineChartWrapper';
import { buildLineChartViewModel } from '@core/ui/data-display/chart/line-chart/utils/buildLineChartViewModel';
import type { LineChartProps } from '@src-types/ui/data/chart';

/**
 * LineChart - Line chart component for data visualization
 *
 * Features:
 * - Accessible: proper ARIA attributes and semantic structure
 * - Responsive: adapts to container size
 * - Customizable: colors, curves, dots, fill
 * - Interactive: tooltips, legends, hover effects
 * - Dark mode support via theme colors
 * - Empty state handling
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={[
 *     { name: 'Jan', value: 400 },
 *     { name: 'Feb', value: 300 },
 *     { name: 'Mar', value: 200 },
 *   ]}
 *   title="Monthly Trends"
 *   colorScheme="primary"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <LineChart
 *   data={trendData}
 *   curveType="monotone"
 *   showDots
 *   strokeWidth={3}
 *   height={400}
 * />
 * ```
 */
export default function LineChart(props: Readonly<LineChartProps>) {
	const viewModel = buildLineChartViewModel(props);

	if (!viewModel.hasData) {
		return <LineChartEmptyState {...viewModel.emptyStateProps} />;
	}

	return (
		<LineChartWrapper {...viewModel.wrapperProps}>
			<LineChartContent {...viewModel.contentProps} lineProps={viewModel.lineProps} />
		</LineChartWrapper>
	);
}
