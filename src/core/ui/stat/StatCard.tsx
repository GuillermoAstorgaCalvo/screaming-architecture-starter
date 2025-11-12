import Card from '@core/ui/card/Card';
import Icon from '@core/ui/icons/Icon';
import {
	getStatCardIconSizeClasses,
	getStatCardLabelSizeClasses,
	getStatCardTrendSizeClasses,
	getStatCardValueSizeClasses,
	getStatCardVariantClasses,
} from '@core/ui/variants/stat';
import type { StandardSize } from '@src-types/ui/base';
import type { StatCardProps } from '@src-types/ui/layout/card';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { formatTrendValue, getTrendColorClasses, getTrendIconName } from './StatCardHelpers';

interface TrendIndicatorProps {
	trend: NonNullable<StatCardProps['trend']>;
	size: StandardSize;
}

function TrendIndicator({ trend, size }: Readonly<TrendIndicatorProps>) {
	const trendIconName = getTrendIconName(trend.direction);
	const trendColorClasses = getTrendColorClasses(trend.direction);
	const trendSizeClasses = getStatCardTrendSizeClasses(size);

	return (
		<div
			className={twMerge(
				trendSizeClasses,
				trendColorClasses,
				'flex items-center gap-1 font-medium'
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

interface StatIconProps {
	icon: ReactNode;
	size: StandardSize;
}

function StatIcon({ icon, size }: Readonly<StatIconProps>) {
	const iconSizeClasses = getStatCardIconSizeClasses(size);

	return (
		<div
			className={twMerge(
				iconSizeClasses,
				'flex shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20'
			)}
			aria-hidden="true"
		>
			{icon}
		</div>
	);
}

/**
 * StatCard - Metrics/statistics display component for dashboards and analytics
 *
 * Features:
 * - Value and label display
 * - Optional trend indicators with icons
 * - Optional icon display
 * - Size variants: sm, md, lg
 * - Card variants: elevated, outlined, flat
 * - Dark mode support
 * - Accessible semantic HTML
 *
 * @example
 * ```tsx
 * <StatCard
 *   value="1,234"
 *   label="Total Users"
 *   trend={{ direction: 'up', value: 12.5 }}
 *   icon={<Icon name="users" />}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <StatCard
 *   value={42}
 *   label="Active Sessions"
 *   trend={{ direction: 'down', value: 5.2, label: 'vs last week' }}
 *   size="lg"
 *   variant="outlined"
 * />
 * ```
 */
export default function StatCard({
	value,
	label,
	trend,
	icon,
	size = 'md',
	variant = 'elevated',
	padding = 'md',
	className,
	...props
}: Readonly<StatCardProps>) {
	const cardClasses = getStatCardVariantClasses({ size, className });
	const valueClasses = getStatCardValueSizeClasses(size);
	const labelClasses = getStatCardLabelSizeClasses(size);

	return (
		<Card variant={variant} padding={padding} className={cardClasses} {...props}>
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-1 flex-col gap-2">
					<div className={twMerge(labelClasses, 'text-text-muted font-medium')}>{label}</div>
					<div className={twMerge(valueClasses, 'text-text-primary')}>{value}</div>
					{trend ? <TrendIndicator trend={trend} size={size} /> : null}
				</div>
				{icon ? <StatIcon icon={icon} size={size} /> : null}
			</div>
		</Card>
	);
}
