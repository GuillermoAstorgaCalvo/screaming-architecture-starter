import i18n from '@core/i18n/i18n';
import type { AreaChartProps } from '@src-types/ui/data/chart';
import type { HTMLAttributes, ReactNode } from 'react';

import { DEFAULT_CHART_HEIGHT, DEFAULT_FILL_OPACITY } from './AreaChart.config';
import type { CurveType } from './AreaChart.props';

export interface NormalizedAreaChartProps {
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
	emptyMessage: i18n.t('common.noDataAvailable', { ns: 'common' }),
} as const;

/** Normalizes and extracts props from AreaChartProps */
export function normalizeProps(props: Readonly<AreaChartProps>): NormalizedAreaChartProps {
	const {
		data,
		title,
		description,
		chartClassName,
		className,
		width: _width,
		height: _height,
		colorScheme: _colorScheme,
		showLegend: _showLegend,
		showTooltip: _showTooltip,
		showGrid: _showGrid,
		dataKey: _dataKey,
		showDots: _showDots,
		strokeWidth: _strokeWidth,
		curveType: _curveType,
		connectNulls: _connectNulls,
		fillOpacity: _fillOpacity,
		emptyMessage: _emptyMessage,
		size: _size,
		...restProps
	} = props;
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
