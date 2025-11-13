import type { PieChartProps } from '@src-types/ui/data/chart';

import { getPieLabelFormatter } from './PieChart.labels';

/**
 * Gets the inner radius value as a percentage string or 0
 */
export function getInnerRadius(innerRadius: number): string | number {
	return innerRadius > 0 ? `${innerRadius}%` : 0;
}

/**
 * Gets the active index prop when hover is disabled
 */
export function getDisabledHoverProps() {
	return { activeIndex: -1 };
}

/**
 * Gets hover-related props based on activeOnHover setting
 */
export function getHoverProps(activeOnHover: boolean) {
	if (activeOnHover) {
		return {};
	}
	return getDisabledHoverProps();
}

/**
 * Base pie props configuration interface
 */
export interface BasePiePropsConfig {
	data: PieChartProps['data'];
	dataKey: PieChartProps['dataKey'];
	nameKey: string;
	showLabels: boolean;
	innerRadius: number;
	outerRadius: number;
	paddingAngle: number;
	startAngle: number;
	endAngle: number;
}

/**
 * Gets base pie props
 */
export function getBasePieProps({
	data,
	dataKey,
	nameKey,
	showLabels,
	innerRadius,
	outerRadius,
	paddingAngle,
	startAngle,
	endAngle,
}: BasePiePropsConfig) {
	return {
		data,
		cx: '50%' as const,
		cy: '50%' as const,
		labelLine: showLabels,
		label: getPieLabelFormatter(showLabels),
		outerRadius: `${outerRadius}%`,
		innerRadius: getInnerRadius(innerRadius),
		fill: '#8884d8',
		dataKey,
		nameKey,
		paddingAngle,
		startAngle,
		endAngle,
		isAnimationActive: true,
	};
}

/**
 * Builds the final pie props by merging base props with hover props
 */
export function buildPieProps(
	baseProps: ReturnType<typeof getBasePieProps>,
	activeOnHover: boolean
) {
	return {
		...baseProps,
		...getHoverProps(activeOnHover),
	};
}
