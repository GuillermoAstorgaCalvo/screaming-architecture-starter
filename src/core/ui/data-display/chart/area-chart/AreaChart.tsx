import { prepareAreaConfig } from '@core/ui/data-display/chart/area-chart/helpers/AreaChart.config';
import {
	renderChart,
	renderEmptyState,
} from '@core/ui/data-display/chart/area-chart/helpers/AreaChart.helpers';
import { normalizeProps } from '@core/ui/data-display/chart/area-chart/helpers/AreaChart.normalize';
import type { AreaChartProps } from '@src-types/ui/data/chart';

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
