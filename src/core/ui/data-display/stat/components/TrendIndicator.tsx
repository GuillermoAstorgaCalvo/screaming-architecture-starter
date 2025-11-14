import {
	formatTrendValue,
	getTrendColorClasses,
	getTrendIconName,
} from '@core/ui/data-display/stat/helpers/StatCardHelpers';
import Icon from '@core/ui/icons/Icon';
import { getStatCardTrendSizeClasses } from '@core/ui/variants/stat';
import type { StandardSize } from '@src-types/ui/base';
import type { StatCardProps } from '@src-types/ui/layout/card';
import { twMerge } from 'tailwind-merge';

interface TrendIndicatorProps {
	trend: NonNullable<StatCardProps['trend']>;
	size: StandardSize;
}

/**
 * TrendIndicator - Displays trend information with icon and formatted value
 *
 * Shows trend direction (up/down/neutral) with appropriate icon and color,
 * along with the formatted percentage value and optional label.
 */
export function TrendIndicator({ trend, size }: Readonly<TrendIndicatorProps>) {
	const trendIconName = getTrendIconName(trend.direction);
	const trendColorClasses = getTrendColorClasses(trend.direction);
	const trendSizeClasses = getStatCardTrendSizeClasses(size);

	return (
		<div
			className={twMerge(
				trendSizeClasses,
				trendColorClasses,
				'flex items-center gap-xs font-medium'
			)}
			aria-label={`Trend: ${trend.direction} ${formatTrendValue(trend.value)}`}
		>
			{trendIconName ? (
				<Icon name={trendIconName} size="sm" className="shrink-0" aria-hidden="true" />
			) : null}
			<span>{formatTrendValue(trend.value)}</span>
			{trend.label ? <span className="text-text-muted font-normal">{trend.label}</span> : null}
		</div>
	);
}
