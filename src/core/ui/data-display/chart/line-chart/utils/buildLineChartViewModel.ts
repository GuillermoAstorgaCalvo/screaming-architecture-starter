import type { LineChartEmptyStateProps } from '@core/ui/data-display/chart/line-chart/components/LineChartEmptyState';
import type { LineChartWrapperProps } from '@core/ui/data-display/chart/line-chart/components/LineChartWrapper';
import { prepareLineChartConfig } from '@core/ui/data-display/chart/line-chart/helpers/LineChart.config';
import type {
	ContentProps,
	LineChartViewModel,
	NormalizedLineChartProps,
} from '@core/ui/data-display/chart/line-chart/types/LineChart.types';
import { normalizeLineChartProps } from '@core/ui/data-display/chart/line-chart/utils/normalizeLineChartProps';
import type { LineChartProps } from '@src-types/ui/data/chart';

/**
 * Builds the view model for LineChart component
 *
 * @param props - Raw LineChart props
 * @returns View model with all necessary props for rendering
 *
 * @internal
 */
export function buildLineChartViewModel(props: Readonly<LineChartProps>): LineChartViewModel {
	const normalized = normalizeLineChartProps(props);

	return {
		hasData: normalized.data.length > 0,
		contentProps: createContentProps(normalized),
		wrapperProps: createWrapperProps(normalized),
		emptyStateProps: createEmptyStateProps(normalized),
		lineProps: prepareLineChartConfig(props).lineProps,
	};
}

function createContentProps(props: NormalizedLineChartProps): ContentProps {
	return {
		data: props.data,
		width: props.width,
		height: props.height,
		showGrid: props.showGrid,
		showTooltip: props.showTooltip,
		showLegend: props.showLegend,
	};
}

function createWrapperProps(
	props: NormalizedLineChartProps
): Omit<LineChartWrapperProps, 'children'> {
	return {
		title: props.title,
		description: props.description,
		chartClassName: props.chartClassName,
		className: props.className,
		props: props.restProps,
	};
}

function createEmptyStateProps(props: NormalizedLineChartProps): LineChartEmptyStateProps {
	return {
		title: props.title,
		emptyMessage: props.emptyMessage,
		className: props.className,
		props: props.restProps,
	};
}
