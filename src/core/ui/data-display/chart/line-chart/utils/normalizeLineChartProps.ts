import i18n from '@core/i18n/i18n';
import type { LineChartWrapperProps } from '@core/ui/data-display/chart/line-chart/components/LineChartWrapper';
import type { NormalizedLineChartProps } from '@core/ui/data-display/chart/line-chart/types/LineChart.types';
import type { LineChartProps } from '@src-types/ui/data/chart';

const DEFAULT_HEIGHT = 300;
const DEFAULT_EMPTY_MESSAGE = i18n.t('common.noDataAvailable', { ns: 'common' });

function withDefault<T>(value: T | undefined, fallback: T): T {
	return value ?? fallback;
}

/**
 * Normalizes LineChart props by applying default values
 *
 * @param props - Raw props from component
 * @returns Normalized props with defaults applied
 *
 * @internal
 */
export function normalizeLineChartProps(props: Readonly<LineChartProps>): NormalizedLineChartProps {
	const { data, title, description, emptyMessage, chartClassName, className, ...restDivProps } =
		props;

	const divProps = restDivProps as LineChartWrapperProps['props'];

	return {
		data,
		title,
		description,
		width: withDefault(props.width, '100%'),
		height: withDefault(props.height, DEFAULT_HEIGHT),
		showLegend: withDefault(props.showLegend, true),
		showTooltip: withDefault(props.showTooltip, true),
		showGrid: withDefault(props.showGrid, true),
		emptyMessage: emptyMessage ?? DEFAULT_EMPTY_MESSAGE,
		chartClassName,
		className,
		restProps: divProps,
	};
}
