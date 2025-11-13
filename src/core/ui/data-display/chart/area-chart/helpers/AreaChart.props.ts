export type CurveType = 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';

export interface AreaPropsConfig {
	color: string;
	dataKey: string;
	curveType: CurveType;
	strokeWidth: number;
	fillOpacity: number;
	showDots: boolean;
	connectNulls: boolean;
}

export interface AreaProps {
	type: CurveType;
	dataKey: string;
	stroke: string;
	fill: string;
	strokeWidth: number;
	fillOpacity: number;
	dot: false | { fill: string; r: number };
	activeDot: { r: number };
	connectNulls: boolean;
	isAnimationActive: boolean;
}

export function createAreaProps({
	color,
	dataKey,
	curveType,
	strokeWidth,
	fillOpacity,
	showDots,
	connectNulls,
}: AreaPropsConfig): AreaProps {
	return {
		type: curveType,
		dataKey,
		stroke: color,
		fill: color,
		strokeWidth,
		fillOpacity,
		dot: showDots ? { fill: color, r: 4 } : false,
		activeDot: { r: 6 },
		connectNulls,
		isAnimationActive: true,
	};
}
