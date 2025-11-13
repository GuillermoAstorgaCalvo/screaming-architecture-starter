import type { PieChartProps } from '@src-types/ui/data/chart';
import type { ReactElement } from 'react';

import { ChartContainer, ChartHeader } from './ChartComponents';
import { buildCompleteChart } from './PieChart.composition';
import { renderEmptyState } from './PieChart.empty';
import type { ChartContentParams } from './PieChart.types';

const DEFAULT_HEIGHT = 300;
const DEFAULT_OUTER_RADIUS = 80;
const DEFAULT_END_ANGLE = 360;

/**
 * Gets default value for optional props
 */
function getDefaultValue<T>(value: T | undefined, defaultValue: T): T {
	return value ?? defaultValue;
}

/**
 * Creates chart content configuration
 */
function createChartContentConfig(props: Readonly<PieChartProps>): ChartContentParams {
	return {
		data: props.data,
		dataKey: props.dataKey,
		nameKey: getDefaultValue(props.nameKey, 'name'),
		width: getDefaultValue(props.width, '100%'),
		height: getDefaultValue(props.height, DEFAULT_HEIGHT),
		showLabels: getDefaultValue(props.showLabels, true),
		innerRadius: getDefaultValue(props.innerRadius, 0),
		outerRadius: getDefaultValue(props.outerRadius, DEFAULT_OUTER_RADIUS),
		paddingAngle: getDefaultValue(props.paddingAngle, 0),
		startAngle: getDefaultValue(props.startAngle, 0),
		endAngle: getDefaultValue(props.endAngle, DEFAULT_END_ANGLE),
		activeOnHover: getDefaultValue(props.activeOnHover, true),
		colorScheme: getDefaultValue(props.colorScheme, 'default'),
		showTooltip: getDefaultValue(props.showTooltip, true),
		showLegend: getDefaultValue(props.showLegend, true),
	};
}

/**
 * Renders the chart wrapper with header and container
 */
function renderChartWrapper({
	title,
	description,
	chartClassName,
	chartContent,
}: {
	title?: string | undefined;
	description?: string | undefined;
	chartClassName?: string | undefined;
	chartContent: ReactElement;
}): ReactElement {
	return (
		<>
			<ChartHeader title={title} description={description} />
			<ChartContainer
				chartClassName={chartClassName}
				description={description}
				title={title}
				chartType="Pie"
			>
				{chartContent}
			</ChartContainer>
		</>
	);
}

/**
 * PieChart - Pie/donut chart component for data visualization
 *
 * Features:
 * - Accessible: proper ARIA attributes and semantic structure
 * - Responsive: adapts to container size
 * - Customizable: colors, radius, angles, labels
 * - Interactive: tooltips, legends, hover effects
 * - Dark mode support via theme colors
 * - Empty state handling
 * - Supports donut charts via innerRadius
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={[
 *     { name: 'Desktop', value: 400 },
 *     { name: 'Mobile', value: 300 },
 *     { name: 'Tablet', value: 200 },
 *   ]}
 *   dataKey="value"
 *   title="Device Distribution"
 *   colorScheme="primary"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PieChart
 *   data={categoryData}
 *   dataKey="value"
 *   innerRadius={60}
 *   outerRadius={80}
 *   showLabels
 *   activeOnHover
 *   height={400}
 * />
 * ```
 */

export default function PieChart(props: Readonly<PieChartProps>) {
	if (props.data.length === 0) {
		return renderEmptyState({
			className: props.className,
			title: props.title,
			emptyMessage: props.emptyMessage,
		});
	}

	const chartContent = buildCompleteChart(createChartContentConfig(props));

	return (
		<div className={props.className} {...props}>
			{renderChartWrapper({
				title: props.title,
				description: props.description,
				chartClassName: props.chartClassName,
				chartContent,
			})}
		</div>
	);
}
