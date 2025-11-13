import type { PieChartProps } from '@src-types/ui/data/chart';
import type { ReactElement } from 'react';
import { Cell } from 'recharts';

import { getChartColor } from './ChartHelpers';

/**
 * Renders the Cell components for each data entry in the pie chart
 */
export function renderPieCells(
	data: PieChartProps['data'],
	nameKey: string,
	colorScheme: PieChartProps['colorScheme']
): ReactElement[] {
	return data.map((entry, index) => {
		const entryKey = entry[nameKey] ?? entry.name;
		return (
			<Cell
				key={entryKey ? String(entryKey) : `cell-${index}`}
				fill={getChartColor(index, colorScheme)}
			/>
		);
	});
}
