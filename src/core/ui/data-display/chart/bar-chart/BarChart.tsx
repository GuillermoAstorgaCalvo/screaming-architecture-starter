import i18n from '@core/i18n/i18n';
import type { BarChartProps } from '@src-types/ui/data/chart';
import type { ReactNode } from 'react';

import { BarChartContent } from './components/BarChartContent';
import { BarChartEmptyState } from './components/BarChartEmptyState';
import { BarChartWrapper } from './components/BarChartWrapper';
import { buildBarChartContentConfig } from './helpers/BarChart.config';

function renderEmptyState(params: {
	title: string | undefined;
	emptyMessage: ReactNode;
	className: string | undefined;
	restProps: Record<string, unknown>;
}) {
	return (
		<BarChartEmptyState
			title={params.title}
			emptyMessage={params.emptyMessage}
			className={params.className}
			props={params.restProps}
		/>
	);
}

function renderChart(params: {
	title: string | undefined;
	description: string | undefined;
	chartClassName: string | undefined;
	className: string | undefined;
	restProps: Record<string, unknown>;
	props: Readonly<BarChartProps>;
}) {
	const chartConfig = buildBarChartContentConfig(params.props);
	return (
		<BarChartWrapper
			title={params.title}
			description={params.description}
			chartClassName={params.chartClassName}
			className={params.className}
			props={params.restProps}
		>
			<BarChartContent {...chartConfig} />
		</BarChartWrapper>
	);
}

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
		width: _width,
		height: _height,
		colorScheme: _colorScheme,
		showLegend: _showLegend,
		showTooltip: _showTooltip,
		showGrid: _showGrid,
		dataKey: _dataKey,
		orientation: _orientation,
		stacked: _stacked,
		barGap: _barGap,
		categoryGap: _categoryGap,
		radius: _radius,
		size: _size,
		...restProps
	} = props;
	if (data.length === 0) {
		return renderEmptyState({ title, emptyMessage, className, restProps });
	}
	return renderChart({ title, description, chartClassName, className, restProps, props });
}
