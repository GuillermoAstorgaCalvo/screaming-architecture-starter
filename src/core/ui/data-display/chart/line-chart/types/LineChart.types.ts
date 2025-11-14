import type { LineChartContentProps } from '@core/ui/data-display/chart/line-chart/components/LineChartContent';
import type { LineChartEmptyStateProps } from '@core/ui/data-display/chart/line-chart/components/LineChartEmptyState';
import type { LineChartWrapperProps } from '@core/ui/data-display/chart/line-chart/components/LineChartWrapper';
import type { LineProps } from '@core/ui/data-display/chart/line-chart/helpers/LineChart.config';
import type { LineChartProps } from '@src-types/ui/data/chart';

export type ContentProps = Omit<LineChartContentProps, 'lineProps'>;
export type WrapperProps = Omit<LineChartWrapperProps, 'children'>;

export interface LineChartViewModel {
	readonly hasData: boolean;
	readonly contentProps: ContentProps;
	readonly wrapperProps: WrapperProps;
	readonly emptyStateProps: LineChartEmptyStateProps;
	readonly lineProps: LineProps;
}

export interface NormalizedLineChartProps {
	readonly data: LineChartProps['data'];
	readonly title: LineChartProps['title'];
	readonly description: LineChartProps['description'];
	readonly width: NonNullable<LineChartProps['width']>;
	readonly height: NonNullable<LineChartProps['height']>;
	readonly showLegend: NonNullable<LineChartProps['showLegend']>;
	readonly showTooltip: NonNullable<LineChartProps['showTooltip']>;
	readonly showGrid: NonNullable<LineChartProps['showGrid']>;
	readonly emptyMessage: NonNullable<LineChartProps['emptyMessage']>;
	readonly chartClassName: LineChartProps['chartClassName'];
	readonly className: LineChartProps['className'];
	readonly restProps: LineChartWrapperProps['props'];
}
