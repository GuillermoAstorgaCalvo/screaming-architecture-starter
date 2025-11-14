import i18n from '@core/i18n/i18n';
import type { BarChartProps } from '@src-types/ui/data/chart';

import { BarChartContent } from './components/BarChartContent';
import { BarChartEmptyState } from './components/BarChartEmptyState';
import { BarChartWrapper } from './components/BarChartWrapper';
import { buildBarChartContentConfig } from './helpers/BarChart.config';

/**
 * BarChart - Bar chart component for data visualization
 *
 * Features:
 * - Accessible: proper ARIA attributes and semantic structure
 * - Responsive: adapts to container size
 * - Customizable: colors, orientation, stacking, gaps
 * - Interactive: tooltips, legends, hover effects
 * - Dark mode support via theme colors
 * - Empty state handling
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={[
 *     { name: 'Jan', value: 400 },
 *     { name: 'Feb', value: 300 },
 *     { name: 'Mar', value: 200 },
 *   ]}
 *   title="Monthly Sales"
 *   colorScheme="primary"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <BarChart
 *   data={salesData}
 *   orientation="horizontal"
 *   showLegend
 *   showTooltip
 *   height={400}
 * />
 * ```
 */
export default function BarChart(props: Readonly<BarChartProps>) {
	const {
		data,
		title,
		description,
		emptyMessage = i18n.t('common.noDataAvailable', { ns: 'common' }),
		chartClassName,
		className,
		...restProps
	} = props;

	if (data.length === 0) {
		return (
			<BarChartEmptyState
				title={title}
				emptyMessage={emptyMessage}
				className={className}
				props={restProps}
			/>
		);
	}

	const chartConfig = buildBarChartContentConfig(props);

	return (
		<BarChartWrapper
			title={title}
			description={description}
			chartClassName={chartClassName}
			className={className}
			props={restProps}
		>
			<BarChartContent {...chartConfig} />
		</BarChartWrapper>
	);
}
