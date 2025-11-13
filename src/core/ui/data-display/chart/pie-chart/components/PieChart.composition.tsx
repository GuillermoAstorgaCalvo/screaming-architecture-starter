import { renderPieCells } from '@core/ui/data-display/chart/pie-chart/components/PieChart.cells';
import {
	renderLegend,
	renderTooltip,
} from '@core/ui/data-display/chart/pie-chart/components/PieChart.overlays';
import {
	buildPieProps,
	getBasePieProps,
} from '@core/ui/data-display/chart/pie-chart/helpers/PieChart.config';
import type { ChartContentParams } from '@core/ui/data-display/chart/pie-chart/types/PieChart.types';
import type { PieChartProps } from '@src-types/ui/data/chart';
import type { ReactElement } from 'react';
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer } from 'recharts';

/**
 * Renders the Pie component with all its configuration
 */
export function renderPieComponent({
	data,
	dataKey,
	nameKey,
	showLabels,
	innerRadius,
	outerRadius,
	paddingAngle,
	startAngle,
	endAngle,
	activeOnHover,
	colorScheme,
}: {
	data: PieChartProps['data'];
	dataKey: PieChartProps['dataKey'];
	nameKey: string;
	showLabels: boolean;
	innerRadius: number;
	outerRadius: number;
	paddingAngle: number;
	startAngle: number;
	endAngle: number;
	activeOnHover: boolean;
	colorScheme: PieChartProps['colorScheme'];
}): ReactElement {
	const baseProps = getBasePieProps({
		data,
		dataKey,
		nameKey,
		showLabels,
		innerRadius,
		outerRadius,
		paddingAngle,
		startAngle,
		endAngle,
	});

	const pieProps = buildPieProps(baseProps, activeOnHover);
	const cells = renderPieCells(data, nameKey, colorScheme);

	return <Pie {...pieProps}>{cells}</Pie>;
}

/**
 * Renders the pie chart with tooltip and legend
 */
export function renderPieChartWithOverlays({
	pieComponent,
	showTooltip,
	showLegend,
}: {
	pieComponent: ReactElement;
	showTooltip: boolean;
	showLegend: boolean;
}): ReactElement {
	return (
		<RechartsPieChart>
			{pieComponent}
			{renderTooltip(showTooltip)}
			{renderLegend(showLegend)}
		</RechartsPieChart>
	);
}

/**
 * Wraps the pie chart in a ResponsiveContainer
 */
export function wrapWithResponsiveContainer(
	width: string | number,
	height: number,
	chartContent: ReactElement
): ReactElement {
	return (
		<ResponsiveContainer width={width} height={height}>
			{chartContent}
		</ResponsiveContainer>
	);
}

/**
 * Builds the complete chart with pie component, overlays, and container
 */
export function buildCompleteChart(params: ChartContentParams): ReactElement {
	const pieComponent = renderPieComponent({
		data: params.data,
		dataKey: params.dataKey,
		nameKey: params.nameKey,
		showLabels: params.showLabels,
		innerRadius: params.innerRadius,
		outerRadius: params.outerRadius,
		paddingAngle: params.paddingAngle,
		startAngle: params.startAngle,
		endAngle: params.endAngle,
		activeOnHover: params.activeOnHover,
		colorScheme: params.colorScheme,
	});

	const chartWithOverlays = renderPieChartWithOverlays({
		pieComponent,
		showTooltip: params.showTooltip,
		showLegend: params.showLegend,
	});

	return wrapWithResponsiveContainer(params.width, params.height, chartWithOverlays);
}
