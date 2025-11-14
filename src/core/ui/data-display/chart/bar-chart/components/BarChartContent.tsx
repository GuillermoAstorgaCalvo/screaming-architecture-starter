import type { BarChartContentConfig } from '@core/ui/data-display/chart/bar-chart/helpers/BarChart.config';
import {
	ChartAxes,
	ChartTooltipAndLegend,
} from '@core/ui/data-display/chart/shared/ChartComponents';
import { CHART_MARGIN } from '@core/ui/data-display/chart/shared/chartConstants';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer } from 'recharts';

export type BarChartContentProps = Readonly<BarChartContentConfig>;

export function BarChartContent({
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
		<ResponsiveContainer width={width as number | `${number}%`} height={height}>
			<RechartsBarChart
				data={data}
				layout={isHorizontal ? 'vertical' : 'horizontal'}
				margin={CHART_MARGIN}
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
