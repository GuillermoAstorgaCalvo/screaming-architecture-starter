import {
	ChartAxes,
	ChartContainer,
	ChartEmptyState,
	ChartHeader,
	ChartTooltipAndLegend,
} from '@core/ui/data-display/chart/shared/ChartComponents';
import { getChartColors } from '@core/ui/data-display/chart/shared/ChartHelpers';
import type { LineChartProps } from '@src-types/ui/data/chart';
import type { ComponentProps, ReactNode } from 'react';
import { Line, LineChart as RechartsLineChart, ResponsiveContainer } from 'recharts';

interface EmptyStateProps {
	title?: string | undefined;
	emptyMessage: string | ReactNode;
	className?: string | undefined;
	props: ComponentProps<'div'>;
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

interface LinePropsConfig {
	curveType: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
	dataKey: string;
	color: string;
	strokeWidth: number;
	showDots: boolean;
	connectNulls: boolean;
}

/**
 * Creates props for the Line component
 */
function createLineProps({
	curveType,
	dataKey,
	color,
	strokeWidth,
	showDots,
	connectNulls,
}: LinePropsConfig) {
	return {
		type: curveType,
		dataKey,
		stroke: color,
		strokeWidth,
		dot: showDots ? { fill: color, r: 4 } : false,
		activeDot: { r: 6 },
		connectNulls,
		isAnimationActive: true,
	} as const;
}

interface ChartContentProps {
	data: LineChartProps['data'];
	width: string | number;
	height: number;
	showGrid: boolean;
	showTooltip: boolean;
	showLegend: boolean;
	lineProps: ReturnType<typeof createLineProps>;
}

/**
 * Renders the chart content with axes, tooltip, legend, and line
 */
function renderLineChartContent({
	data,
	width,
	height,
	showGrid,
	showTooltip,
	showLegend,
	lineProps,
}: ChartContentProps) {
	return (
		<ResponsiveContainer width={width} height={height}>
			<RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
				<ChartAxes showGrid={showGrid} isHorizontal={false} />
				<ChartTooltipAndLegend showTooltip={showTooltip} showLegend={showLegend} />
				<Line {...lineProps} />
			</RechartsLineChart>
		</ResponsiveContainer>
	);
}

interface ChartWrapperProps {
	title?: string | undefined;
	description?: string | undefined;
	chartClassName?: string | undefined;
	className?: string | undefined;
	children: ReactNode;
	props: ComponentProps<'div'>;
}

/**
 * Renders the chart wrapper with header and container
 */
function renderChartWrapper({
	title,
	description,
	chartClassName,
	className,
	children,
	props,
}: ChartWrapperProps) {
	return (
		<div className={className} {...props}>
			<ChartHeader title={title} description={description} />
			<ChartContainer
				chartClassName={chartClassName}
				description={description}
				title={title}
				chartType="Line"
			>
				{children}
			</ChartContainer>
		</div>
	);
}

/**
 * Prepares line chart configuration from props
 */
function prepareLineChartConfig(props: Readonly<LineChartProps>) {
	const {
		colorScheme = 'default',
		curveType = 'linear',
		dataKey = 'value',
		strokeWidth = 2,
		showDots = true,
		connectNulls = false,
	} = props;

	const colors = getChartColors(colorScheme);
	const lineProps = createLineProps({
		curveType,
		dataKey,
		color: colors[0] ?? '#3b82f6',
		strokeWidth,
		showDots,
		connectNulls,
	});

	return { lineProps };
}

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
	const {
		data,
		title,
		description,
		width = '100%',
		height = 300,
		showLegend = true,
		showTooltip = true,
		showGrid = true,
		emptyMessage = 'No data available',
		chartClassName,
		className,
		...restProps
	} = props;

	if (data.length === 0) {
		return renderEmptyState({ title, emptyMessage, className, props: restProps });
	}

	const { lineProps } = prepareLineChartConfig(props);
	const chartContent = renderLineChartContent({
		data,
		width,
		height,
		showGrid,
		showTooltip,
		showLegend,
		lineProps,
	});

	return renderChartWrapper({
		title,
		description,
		chartClassName,
		className,
		children: chartContent,
		props: restProps,
	});
}
