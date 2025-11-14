import type { StatTrendDirection } from '@src-types/ui/layout/card';

/**
 * Get trend color classes based on direction
 *
 * @param direction - Trend direction
 * @returns Color classes for the trend
 */
export function getTrendColorClasses(direction: StatTrendDirection): string {
	switch (direction) {
		case 'up': {
			return 'text-success';
		}
		case 'down': {
			return 'text-destructive';
		}
		case 'neutral': {
			return 'text-text-secondary';
		}
		default: {
			return 'text-text-secondary';
		}
	}
}

/**
 * Format trend value as percentage string
 *
 * @param value - Trend percentage value
 * @returns Formatted percentage string
 */
export function formatTrendValue(value: number): string {
	const sign = value >= 0 ? '+' : '';
	return `${sign}${value.toFixed(1)}%`;
}

/**
 * Get trend icon name based on direction
 *
 * @param direction - Trend direction
 * @returns Icon name for the trend
 */
export function getTrendIconName(direction: StatTrendDirection): 'arrow-up' | 'arrow-down' | null {
	switch (direction) {
		case 'up': {
			return 'arrow-up';
		}
		case 'down': {
			return 'arrow-down';
		}
		case 'neutral': {
			return null;
		}
		default: {
			return null;
		}
	}
}
