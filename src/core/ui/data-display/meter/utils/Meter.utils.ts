import type { MeterVariant } from '@src-types/ui/feedback';

/**
 * Calculate percentage from value, min, and max
 */
export function calculatePercentage(value: number, min: number, max: number): number {
	const range = max - min;
	if (range <= 0) return 0;
	const normalizedValue = Math.max(min, Math.min(max, value)) - min;
	return Math.min(Math.max((normalizedValue / range) * 100, 0), 100);
}

/**
 * Determine variant from thresholds based on percentage
 */
export function getVariantFromThresholds(
	percentage: number,
	thresholds?: Array<{ value: number; variant: MeterVariant }>
): MeterVariant {
	if (!thresholds || thresholds.length === 0) {
		return 'default';
	}

	// Sort thresholds by value (descending) to check from highest to lowest
	const sortedThresholds = [...thresholds].sort((a, b) => b.value - a.value);

	// Find the first threshold that the percentage meets or exceeds
	for (const threshold of sortedThresholds) {
		if (percentage >= threshold.value) {
			return threshold.variant;
		}
	}

	return 'default';
}

/**
 * Format value for display
 */
export function formatValue(value: number, max: number, unit?: string): string {
	const formattedValue = value.toLocaleString();
	const formattedMax = max.toLocaleString();
	if (unit) {
		return `${formattedValue} / ${formattedMax} ${unit}`;
	}
	return `${formattedValue} / ${formattedMax}`;
}

/**
 * Generate ARIA label for meter
 */
export function getMeterAriaLabel({
	ariaLabel,
	label,
	value,
	max,
	unit,
}: {
	ariaLabel?: string;
	label?: string;
	value: number;
	max: number;
	unit?: string;
}): string {
	if (ariaLabel) return ariaLabel;
	const valueText = formatValue(value, max, unit);
	return label ? `${label}: ${valueText}` : `Meter: ${valueText}`;
}
