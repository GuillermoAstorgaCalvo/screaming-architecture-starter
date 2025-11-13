/**
 * Formats the label for pie chart segments
 */
export function formatPieLabel({ name, percent }: { name: string; percent: number }): string {
	return `${name}: ${(percent * 100).toFixed(0)}%`;
}

/**
 * Gets the pie label formatter or false based on showLabels prop
 */
export function getPieLabelFormatter(showLabels: boolean) {
	if (showLabels) {
		return formatPieLabel;
	}
	return false;
}
