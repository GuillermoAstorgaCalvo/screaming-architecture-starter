import type { PieChartProps } from '@src-types/ui/data/chart';
import type { ReactNode } from 'react';

/**
 * Parameters for building complete chart content
 */
export interface ChartContentParams {
	data: PieChartProps['data'];
	dataKey: PieChartProps['dataKey'];
	nameKey: string;
	width: string | number;
	height: number;
	showLabels: boolean;
	innerRadius: number;
	outerRadius: number;
	paddingAngle: number;
	startAngle: number;
	endAngle: number;
	activeOnHover: boolean;
	colorScheme: PieChartProps['colorScheme'];
	showTooltip: boolean;
	showLegend: boolean;
}

/**
 * Props for rendering empty state
 */
export interface EmptyStateProps {
	className?: string | undefined;
	title?: string | undefined;
	emptyMessage?: ReactNode | undefined;
}
