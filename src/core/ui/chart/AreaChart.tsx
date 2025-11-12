import type { AreaChartProps } from '@src-types/ui/data';
import type { HTMLAttributes, ReactNode } from 'react';

import { createAreaProps, renderChart, renderEmptyState } from './AreaChart.helpers';
import { getChartColors } from './ChartHelpers';

type CurveType = 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';

const DEFAULT_CHART_HEIGHT = 300;
const DEFAULT_FILL_OPACITY = 0.6;

interface ChartConfig {
	colorScheme: AreaChartProps['colorScheme'];
	dataKey: string;
	showDots: boolean;
	strokeWidth: number;
	curveType: CurveType;
	connectNulls: boolean;
	fillOpacity: number;
}

/** Prepares the area props configuration */
function prepareAreaConfig(config: ChartConfig) {
	const colors = getChartColors(config.colorScheme);
	const primaryColor = colors[0] ?? '#3b82f6';
	return createAreaProps({
		color: primaryColor,
		dataKey: config.dataKey,
		curveType: config.curveType,
		strokeWidth: config.strokeWidth,
		fillOpacity: config.fillOpacity,
		showDots: config.showDots,
		connectNulls: config.connectNulls,
	});
}

interface NormalizedAreaChartProps {
	data: AreaChartProps['data'];
	title?: string | undefined;
	description?: string | undefined;
	width: number | string;
	height: number;
	colorScheme: AreaChartProps['colorScheme'];
	showLegend: boolean;
	showTooltip: boolean;
	showGrid: boolean;
	dataKey: string;
	showDots: boolean;
	strokeWidth: number;
	curveType: CurveType;
	connectNulls: boolean;
	fillOpacity: number;
	emptyMessage: ReactNode;
	chartClassName?: string | undefined;
	className?: string | undefined;
	containerProps: HTMLAttributes<HTMLDivElement>;
}

const DEFAULT_PROPS = {
	width: '100%',
	height: DEFAULT_CHART_HEIGHT,
	colorScheme: 'default' as const,
	showLegend: true,
	showTooltip: true,
	showGrid: true,
	dataKey: 'value',
	showDots: false,
	strokeWidth: 2,
	curveType: 'monotone' as const,
	connectNulls: false,
	fillOpacity: DEFAULT_FILL_OPACITY,
	emptyMessage: 'No data available',
} as const;

/** Normalizes and extracts props from AreaChartProps */
function normalizeProps(props: Readonly<AreaChartProps>): NormalizedAreaChartProps {
	const { data, title, description, chartClassName, className, ...restProps } = props;
	const normalized = {
		...DEFAULT_PROPS,
		...props,
		data,
		title,
		description,
		chartClassName,
		className,
	};
	return {
		...normalized,
		containerProps: restProps,
	};
}

/**
 * AreaChart - Area chart component for data visualization
 * Features: Accessible, responsive, customizable, interactive, dark mode support
 * @example <AreaChart data={[{name:'Jan',value:400}]} title="Trends" />
 */
export default function AreaChart(props: Readonly<AreaChartProps>) {
	const normalized = normalizeProps(props);
	if (normalized.data.length === 0) {
		return renderEmptyState({
			title: normalized.title,
			emptyMessage: normalized.emptyMessage,
			className: normalized.className,
			containerProps: normalized.containerProps,
		});
	}
	const areaProps = prepareAreaConfig({
		colorScheme: normalized.colorScheme,
		dataKey: normalized.dataKey,
		showDots: normalized.showDots,
		strokeWidth: normalized.strokeWidth,
		curveType: normalized.curveType,
		connectNulls: normalized.connectNulls,
		fillOpacity: normalized.fillOpacity,
	});
	return renderChart({
		data: normalized.data,
		title: normalized.title,
		description: normalized.description,
		width: normalized.width,
		height: normalized.height,
		showLegend: normalized.showLegend,
		showTooltip: normalized.showTooltip,
		showGrid: normalized.showGrid,
		areaProps,
		chartClassName: normalized.chartClassName,
		className: normalized.className,
		containerProps: normalized.containerProps,
	});
}
