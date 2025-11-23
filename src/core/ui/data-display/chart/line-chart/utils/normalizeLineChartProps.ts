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
	const {
		data,
		title,
		description,
		emptyMessage,
		chartClassName,
		className,
		width,
		height,
		showLegend,
		showTooltip,
		showGrid,
		colorScheme: _colorScheme,
		dataKey: _dataKey,
		showDots: _showDots,
		filled: _filled,
		strokeWidth: _strokeWidth,
		curveType: _curveType,
		connectNulls: _connectNulls,
		size: _size,
		...restDivProps
	} = props;

	const divProps = restDivProps as LineChartWrapperProps['props'];

	return {
		data,
		title,
		description,
		width: withDefault(width, '100%'),
		height: withDefault(height, DEFAULT_HEIGHT),
		showLegend: withDefault(showLegend, true),
		showTooltip: withDefault(showTooltip, true),
		showGrid: withDefault(showGrid, true),
		emptyMessage: emptyMessage ?? DEFAULT_EMPTY_MESSAGE,
		chartClassName,
		className,
		restProps: divProps,
	};
}
