import type { AreaChartProps } from '@src-types/ui/data';
import type { HTMLAttributes, ReactNode } from 'react';
import { Area, AreaChart as RechartsAreaChart, ResponsiveContainer } from 'recharts';

import {
	ChartAxes,
	ChartContainer,
	ChartEmptyState,
	ChartHeader,
	ChartTooltipAndLegend,
} from './ChartComponents';

type CurveType = 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';

export interface AreaPropsConfig {
	color: string;
	dataKey: string;
	curveType: CurveType;
	strokeWidth: number;
	fillOpacity: number;
	showDots: boolean;
	connectNulls: boolean;
}

export interface AreaProps {
	type: CurveType;
	dataKey: string;
	stroke: string;
	fill: string;
	strokeWidth: number;
	fillOpacity: number;
	dot: false | { fill: string; r: number };
	activeDot: { r: number };
	connectNulls: boolean;
	isAnimationActive: boolean;
}

/** Creates the props object for the Area component */
export function createAreaProps({
	color,
	dataKey,
	curveType,
	strokeWidth,
	fillOpacity,
	showDots,
	connectNulls,
}: AreaPropsConfig): AreaProps {
	return {
		type: curveType,
		dataKey,
		stroke: color,
		fill: color,
		strokeWidth,
		fillOpacity,
		dot: showDots ? { fill: color, r: 4 } : false,
		activeDot: { r: 6 },
		connectNulls,
		isAnimationActive: true,
	};
}

interface EmptyStateProps {
	title?: string | undefined;
	emptyMessage: ReactNode;
	className?: string | undefined;
	containerProps?: HTMLAttributes<HTMLDivElement>;
}

/** Renders the empty state when no data is available */
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
export function renderChart({
	data,
	title,
	description,
	width,
	height,
	showLegend,
	showTooltip,
	showGrid,
	areaProps,
	chartClassName,
	className,
	containerProps,
}: RenderChartProps) {
	const chartContent = renderAreaChartContent({
		data,
		width,
		height,
		showGrid,
		showTooltip,
		showLegend,
		areaProps,
	});

	return renderChartWrapper({
		title,
		description,
		chartClassName,
		className,
		containerProps,
		chartContent,
	});
}
