import { designTokens } from '@core/constants/designTokens';
import { getChartColors } from '@core/ui/data-display/chart/shared/ChartHelpers';
import type { BarChartProps } from '@src-types/ui/data/chart';

export const DEFAULT_BAR_CHART_HEIGHT = 300;

export interface BarChartContentConfig {
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

export function buildBarChartContentConfig(props: Readonly<BarChartProps>): BarChartContentConfig {
	return {
		data: props.data,
		...getBarChartDimensions(props),
		...getBarChartLayout(props),
		...getBarChartVisibility(props),
		dataKey: getBarChartDataKey(props),
		...getBarChartStyling(props),
	};
}

function getBarChartDimensions(props: Readonly<BarChartProps>) {
	return {
		width: props.width ?? '100%',
		height: props.height ?? DEFAULT_BAR_CHART_HEIGHT,
	};
}

function getBarChartLayout(props: Readonly<BarChartProps>) {
	return {
		isHorizontal: props.orientation === 'horizontal',
		barGap: props.barGap ?? 0,
		categoryGap: props.categoryGap ?? 0,
	};
}

function getBarChartVisibility(props: Readonly<BarChartProps>) {
	return {
		showGrid: props.showGrid ?? true,
		showTooltip: props.showTooltip ?? true,
		showLegend: props.showLegend ?? true,
	};
}

function getBarChartDataKey(props: Readonly<BarChartProps>) {
	return props.dataKey ?? 'value';
}

function getBarChartStyling(props: Readonly<BarChartProps>) {
	const colors = getChartColors(props.colorScheme ?? 'default');
	return {
		color: colors[0] ?? designTokens.color.info.DEFAULT,
		radius: props.radius ?? 0,
	};
}
