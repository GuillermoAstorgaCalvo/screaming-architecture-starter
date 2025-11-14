import { designTokens } from '@core/constants/designTokens';
import { getChartColors } from '@core/ui/data-display/chart/shared/ChartHelpers';
import type { LineChartProps } from '@src-types/ui/data/chart';

export interface LinePropsConfig {
	readonly curveType: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
	readonly dataKey: string;
	readonly color: string;
	readonly strokeWidth: number;
	readonly showDots: boolean;
	readonly connectNulls: boolean;
}

export function createLineProps({
	curveType,
	dataKey,
	color,
	strokeWidth,
	showDots,
	connectNulls,
}: LinePropsConfig) {
	return {
		type: curveType,
		dataKey,
		stroke: color,
		strokeWidth,
		dot: showDots ? { fill: color, r: 4 } : false,
		activeDot: { r: 6 },
		connectNulls,
		isAnimationActive: true,
	} as const;
}

export type LineProps = ReturnType<typeof createLineProps>;

interface LineChartOptions {
	readonly colorScheme: LineChartProps['colorScheme'];
	readonly curveType: NonNullable<LineChartProps['curveType']>;
	readonly dataKey: string;
	readonly strokeWidth: number;
	readonly showDots: boolean;
	readonly connectNulls: boolean;
}

type BaseLineChartOptions = Pick<
	LineChartOptions,
	'colorScheme' | 'curveType' | 'dataKey' | 'strokeWidth'
>;
type BehaviorLineChartOptions = Pick<LineChartOptions, 'showDots' | 'connectNulls'>;

function extractLineChartOptions(props: Readonly<LineChartProps>): LineChartOptions {
	return {
		...resolveBaseLineOptions(props),
		...resolveBehaviorLineOptions(props),
	};
}

function resolveBaseLineOptions(props: Readonly<LineChartProps>): BaseLineChartOptions {
	const {
		colorScheme = 'default',
		curveType = 'linear',
		dataKey = 'value',
		strokeWidth = 2,
	} = props;

	return { colorScheme, curveType, dataKey, strokeWidth };
}

function resolveBehaviorLineOptions(props: Readonly<LineChartProps>): BehaviorLineChartOptions {
	const { showDots = true, connectNulls = false } = props;
	return { showDots, connectNulls };
}

function mapOptionsToLinePropsConfig(options: LineChartOptions): LinePropsConfig {
	const colors = getChartColors(options.colorScheme);
	const primaryColor = colors[0] ?? designTokens.color.info.DEFAULT;

	return {
		curveType: options.curveType,
		dataKey: options.dataKey,
		color: primaryColor,
		strokeWidth: options.strokeWidth,
		showDots: options.showDots,
		connectNulls: options.connectNulls,
	};
}

export function prepareLineChartConfig(props: Readonly<LineChartProps>) {
	const options = extractLineChartOptions(props);
	return { lineProps: createLineProps(mapOptionsToLinePropsConfig(options)) };
}
