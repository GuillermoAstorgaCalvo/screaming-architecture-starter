import Card from '@core/ui/data-display/card/Card';
import { StatIcon } from '@core/ui/data-display/stat/components/StatIcon';
import { TrendIndicator } from '@core/ui/data-display/stat/components/TrendIndicator';
import {
	getStatCardLabelSizeClasses,
	getStatCardValueSizeClasses,
	getStatCardVariantClasses,
} from '@core/ui/variants/stat';
import type { StatCardProps } from '@src-types/ui/layout/card';
import { twMerge } from 'tailwind-merge';

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
			<div className="flex items-start justify-between gap-md">
				<div className="flex flex-1 flex-col gap-sm">
					<div className={twMerge(labelClasses, 'text-text-muted font-medium')}>{label}</div>
					<div className={twMerge(valueClasses, 'text-text-primary')}>{value}</div>
					{trend ? <TrendIndicator trend={trend} size={size} /> : null}
				</div>
				{icon ? <StatIcon icon={icon} size={size} /> : null}
			</div>
		</Card>
	);
}
