import {
	ChartAxes,
	ChartContainer,
	ChartEmptyState,
	ChartHeader,
	ChartTooltipAndLegend,
} from '@core/ui/data-display/chart/shared/ChartComponents';
import type { AreaChartProps } from '@src-types/ui/data/chart';
import type { HTMLAttributes, ReactNode } from 'react';
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer } from 'recharts';

import type { AreaProps } from './AreaChart.props';

export { createAreaProps } from './AreaChart.props';

interface EmptyStateProps {
	title?: string | undefined;
	emptyMessage: ReactNode;
	className?: string | undefined;
	containerProps?: HTMLAttributes<HTMLDivElement>;
}

export function renderEmptyState({
	title,
	emptyMessage,
	className,
	containerProps,
}: EmptyStateProps) {
	return (
		<div className={className} {...containerProps}>
			<ChartEmptyState title={title} emptyMessage={emptyMessage} />
		</div>
	);
}

interface ChartContentProps {
	data: AreaChartProps['data'];
	width: number | string;
	height: number;
	showGrid: boolean;
	showTooltip: boolean;
	showLegend: boolean;
	areaProps: AreaProps;
}

/** Renders the chart content (ResponsiveContainer + RechartsAreaChart) */
export function renderAreaChartContent({
	data,
	width,
	height,
	showGrid,
	showTooltip,
	showLegend,
	areaProps,
}: ChartContentProps) {
	return (
		<ResponsiveContainer width={width} height={height}>
			<RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
				<ChartAxes showGrid={showGrid} isHorizontal={false} />
				<ChartTooltipAndLegend showTooltip={showTooltip} showLegend={showLegend} />
				<Area {...areaProps} />
			</RechartsAreaChart>
		</ResponsiveContainer>
	);
}

interface ChartWrapperProps {
	title?: string | undefined;
	description?: string | undefined;
	chartClassName?: string | undefined;
	className?: string | undefined;
	containerProps: HTMLAttributes<HTMLDivElement>;
	chartContent: ReactNode;
}

/** Renders the chart wrapper with header and container */
export function renderChartWrapper({
	title,
	description,
	chartClassName,
	className,
	containerProps,
	chartContent,
}: ChartWrapperProps) {
	return (
		<div className={className} {...containerProps}>
			<ChartHeader title={title} description={description} />
			<ChartContainer
				chartClassName={chartClassName}
				description={description}
				title={title}
				chartType="Area"
			>
				{chartContent}
			</ChartContainer>
		</div>
	);
}

interface RenderChartProps {
	data: AreaChartProps['data'];
	title?: string | undefined;
	description?: string | undefined;
	width: number | string;
	height: number;
	showLegend: boolean;
	showTooltip: boolean;
	showGrid: boolean;
	areaProps: AreaProps;
	chartClassName?: string | undefined;
	className?: string | undefined;
	containerProps: HTMLAttributes<HTMLDivElement>;
}

/** Renders the chart with data */
export function renderChart(props: RenderChartProps) {
	return renderChartWrapper({
		title: props.title,
		description: props.description,
		chartClassName: props.chartClassName,
		className: props.className,
		containerProps: props.containerProps,
		chartContent: renderAreaChartContent({
			data: props.data,
			width: props.width,
			height: props.height,
			showGrid: props.showGrid,
			showTooltip: props.showTooltip,
			showLegend: props.showLegend,
			areaProps: props.areaProps,
		}),
	});
}
