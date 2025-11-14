import { designTokens } from '@core/constants/designTokens';
import { getChartColors } from '@core/ui/data-display/chart/shared/ChartHelpers';
import type { AreaChartProps } from '@src-types/ui/data/chart';

import { createAreaProps, type CurveType } from './AreaChart.props';

export const DEFAULT_CHART_HEIGHT = 300;
export const DEFAULT_FILL_OPACITY = 0.6;

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
export function prepareAreaConfig(config: ChartConfig) {
	const colors = getChartColors(config.colorScheme);
	const primaryColor = colors[0] ?? designTokens.color.info.DEFAULT;
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
