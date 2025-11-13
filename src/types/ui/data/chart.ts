import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Chart data point
 */
export interface ChartDataPoint {
	/** Label for the data point (x-axis) */
	name: string;
	/** Value for the data point (y-axis) */
	value: number;
	/** Optional additional data fields */
	[key: string]: string | number | undefined;
}

/**
 * Chart color scheme
 */
export type ChartColorScheme =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'error'
	| 'info'
	| string[];

/**
 * Base chart component props
 */
export interface BaseChartProps extends HTMLAttributes<HTMLDivElement> {
	/** Chart data array */
	data: ChartDataPoint[];
	/** Chart title */
	title?: string;
	/** Chart description (for accessibility) */
	description?: string;
	/** Width of the chart @default '100%' */
	width?: number | string;
	/** Height of the chart @default 300 */
	height?: number;
	/** Color scheme for the chart @default 'default' */
	colorScheme?: ChartColorScheme;
	/** Whether to show legend @default true */
	showLegend?: boolean;
	/** Whether to show tooltip @default true */
	showTooltip?: boolean;
	/** Whether to show grid lines @default true */
	showGrid?: boolean;
	/** Size of the chart @default 'md' */
	size?: StandardSize;
	/** Optional empty state message */
	emptyMessage?: ReactNode;
	/** Custom className for the chart container */
	chartClassName?: string;
}

/**
 * BarChart component props
 */
export interface BarChartProps extends BaseChartProps {
	/** Data key for the value (if data has multiple value fields) */
	dataKey?: string;
	/** Orientation of bars @default 'vertical' */
	orientation?: 'horizontal' | 'vertical';
	/** Whether bars are stacked @default false */
	stacked?: boolean;
	/** Gap between bars @default 0 */
	barGap?: number;
	/** Category gap (gap between groups) @default 0 */
	categoryGap?: number;
	/** Radius of bar corners @default 0 */
	radius?: number | [number, number, number, number];
}

/**
 * LineChart component props
 */
export interface LineChartProps extends BaseChartProps {
	/** Data key for the value (if data has multiple value fields) */
	dataKey?: string;
	/** Whether to show dots on data points @default true */
	showDots?: boolean;
	/** Whether to fill area under the line @default false */
	filled?: boolean;
	/** Stroke width of the line @default 2 */
	strokeWidth?: number;
	/** Type of curve @default 'linear' */
	curveType?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
	/** Whether to connect null values @default false */
	connectNulls?: boolean;
}

/**
 * AreaChart component props
 */
export interface AreaChartProps extends BaseChartProps {
	/** Data key for the value (if data has multiple value fields) */
	dataKey?: string;
	/** Whether to show dots on data points @default false */
	showDots?: boolean;
	/** Stroke width of the area border @default 2 */
	strokeWidth?: number;
	/** Type of curve @default 'monotone' */
	curveType?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
	/** Whether to connect null values @default false */
	connectNulls?: boolean;
	/** Opacity of the area fill @default 0.6 */
	fillOpacity?: number;
}

/**
 * PieChart component props
 */
export interface PieChartProps extends BaseChartProps {
	/** Data key for the value */
	dataKey: string;
	/** Data key for the label/name */
	nameKey?: string;
	/** Inner radius (for donut chart) @default 0 */
	innerRadius?: number;
	/** Outer radius (percentage of container) @default 80 */
	outerRadius?: number;
	/** Padding angle between segments @default 0 */
	paddingAngle?: number;
	/** Start angle (in degrees) @default 0 */
	startAngle?: number;
	/** End angle (in degrees) @default 360 */
	endAngle?: number;
	/** Whether to show labels on segments @default true */
	showLabels?: boolean;
	/** Whether to show active segment on hover @default true */
	activeOnHover?: boolean;
	/** Label line length @default 30 */
	labelLineLength?: number;
}
