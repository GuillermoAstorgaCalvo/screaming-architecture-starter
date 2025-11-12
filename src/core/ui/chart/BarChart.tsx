import type { BarChartProps } from '@src-types/ui/data';
import type { ReactNode } from 'react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer } from 'recharts';

import {
	ChartAxes,
	ChartContainer,
	ChartEmptyState,
	ChartHeader,
	ChartTooltipAndLegend,
} from './ChartComponents';
import { getChartColors } from './ChartHelpers';

const DEFAULT_CHART_HEIGHT = 300;

interface EmptyStateProps {
	title?: string | undefined;
	emptyMessage: ReactNode;
	className?: string | undefined;
	props: Record<string, unknown>;
}

/**
 * Renders the empty state when no data is available
 */
function renderEmptyState({ title, emptyMessage, className, props }: EmptyStateProps) {
	return (
		<div className={className} {...props}>
			<ChartEmptyState title={title} emptyMessage={emptyMessage} />
		</div>
	);
}

interface BarChartContentProps {
	data: BarChartProps['data'];
	width: string | number;
	height: number;
	isHorizontal: boolean;
	barGap: number;
	categoryGap: number;
	showGrid: boolean;
	showTooltip: boolean;
	showLegend: boolean;
	dataKey: string;
	color: string;
	radius: number | [number, number, number, number];
}

/**
 * Renders the bar chart content with Recharts components
 */
function renderBarChartContent({
	data,
	width,
	height,
	isHorizontal,
	barGap,
	categoryGap,
	showGrid,
	showTooltip,
	showLegend,
	dataKey,
	color,
	radius,
}: BarChartContentProps) {
	return (
		<ResponsiveContainer width={width} height={height}>
			<RechartsBarChart
				data={data}
				layout={isHorizontal ? 'vertical' : 'horizontal'}
				margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
				barGap={barGap}
				barCategoryGap={categoryGap}
			>
				<ChartAxes showGrid={showGrid} isHorizontal={isHorizontal} />
				<ChartTooltipAndLegend showTooltip={showTooltip} showLegend={showLegend} />
				<Bar dataKey={dataKey} fill={color} radius={radius} isAnimationActive />
			</RechartsBarChart>
		</ResponsiveContainer>
	);
}

interface ChartWrapperProps {
	title?: string | undefined;
	description?: string | undefined;
	chartClassName?: string | undefined;
	children: ReactNode;
}

/**
 * Renders the chart wrapper with header and container
 */
function renderChartWrapper({ title, description, chartClassName, children }: ChartWrapperProps) {
	return (
		<>
			<ChartHeader title={title} description={description} />
			<ChartContainer
				chartClassName={chartClassName}
				description={description}
				title={title}
				chartType="Bar"
			>
				{children}
			</ChartContainer>
		</>
	);
}

interface BarChartConfig {
	isHorizontal: boolean;
	barColor: string;
}

/**
 * Prepares chart configuration from props
 */
function prepareChartConfig(
	colorScheme: BarChartProps['colorScheme'],
	orientation: BarChartProps['orientation']
): BarChartConfig {
	const colors = getChartColors(colorScheme);
	const isHorizontal = orientation === 'horizontal';
	const barColor = colors[0] ?? '#3b82f6';

	return { isHorizontal, barColor };
}

interface ChartContentConfig {
	data: BarChartProps['data'];
	width: string | number;
	height: number;
	isHorizontal: boolean;
	barGap: number;
	categoryGap: number;
	showGrid: boolean;
	showTooltip: boolean;
	showLegend: boolean;
	dataKey: string;
	color: string;
	radius: number | [number, number, number, number];
}

/**
 * Extracts and normalizes chart props with defaults
 */
function extractChartProps(props: Readonly<BarChartProps>): ChartContentConfig {
	return {
		data: props.data,
		width: props.width ?? '100%',
		height: props.height ?? DEFAULT_CHART_HEIGHT,
		isHorizontal: props.orientation === 'horizontal',
		barGap: props.barGap ?? 0,
		categoryGap: props.categoryGap ?? 0,
		showGrid: props.showGrid ?? true,
		showTooltip: props.showTooltip ?? true,
		showLegend: props.showLegend ?? true,
		dataKey: props.dataKey ?? 'value',
		color: '', // Will be set from config
		radius: props.radius ?? 0,
	};
}

interface RenderChartProps {
	props: Readonly<BarChartProps>;
	config: BarChartConfig;
}

/**
 * Renders the complete chart with wrapper
 */
function renderChart({ props, config }: RenderChartProps) {
	const chartProps = extractChartProps(props);
	chartProps.color = config.barColor;
	chartProps.isHorizontal = config.isHorizontal;

	const { className, ...restProps } = props;

	return (
		<div className={className} {...restProps}>
			{renderChartWrapper({
				title: props.title,
				description: props.description,
				chartClassName: props.chartClassName,
				children: renderBarChartContent(chartProps),
			})}
		</div>
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
	const { data, title, emptyMessage = 'No data available', className, ...restProps } = props;

	if (data.length === 0) {
		return renderEmptyState({ title, emptyMessage, className, props: restProps });
	}

	const config = prepareChartConfig(props.colorScheme, props.orientation);
	return renderChart({ props, config });
}
