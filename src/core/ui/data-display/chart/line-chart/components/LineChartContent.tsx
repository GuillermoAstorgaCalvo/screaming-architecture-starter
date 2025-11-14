import type { LineProps } from '@core/ui/data-display/chart/line-chart/helpers/LineChart.config';
import {
	ChartAxes,
	ChartTooltipAndLegend,
} from '@core/ui/data-display/chart/shared/ChartComponents';
import { CHART_MARGIN } from '@core/ui/data-display/chart/shared/chartConstants';
import type { LineChartProps } from '@src-types/ui/data/chart';
import { Line, LineChart as RechartsLineChart, ResponsiveContainer } from 'recharts';

export interface LineChartContentProps {
	readonly data: LineChartProps['data'];
	readonly width: string | number;
	readonly height: number;
	readonly showGrid: boolean;
	readonly showTooltip: boolean;
	readonly showLegend: boolean;
	readonly lineProps: LineProps;
}

export function LineChartContent({
	data,
	width,
	height,
	showGrid,
	showTooltip,
	showLegend,
	lineProps,
}: LineChartContentProps) {
	return (
		<ResponsiveContainer width={width as number | `${number}%`} height={height}>
			<RechartsLineChart data={data} margin={CHART_MARGIN}>
				<ChartAxes showGrid={showGrid} isHorizontal={false} />
				<ChartTooltipAndLegend showTooltip={showTooltip} showLegend={showLegend} />
				<Line {...lineProps} />
			</RechartsLineChart>
		</ResponsiveContainer>
	);
}
