import { METER_BAR_BASE_CLASSES, METER_VARIANT_CLASSES } from '@core/constants/ui/display/progress';
import { formatValue } from '@core/ui/data-display/meter/utils/Meter.utils';
import type { MeterVariant } from '@src-types/ui/feedback';
import { twMerge } from 'tailwind-merge';

/**
 * Meter bar component
 */
export function MeterBar({
	percentage,
	variant,
}: Readonly<{ percentage: number; variant: MeterVariant }>) {
	const variantClasses = METER_VARIANT_CLASSES[variant];
	const barClasses = twMerge(METER_BAR_BASE_CLASSES, variantClasses);

	return <div className={barClasses} style={{ width: `${percentage}%` }} />;
}

/**
 * Meter value display component
 */
export function MeterValue({
	value,
	max,
	unit,
	formatValue: customFormatValue,
}: Readonly<{
	value: number;
	max: number;
	unit?: string;
	formatValue?: (value: number, max: number, unit?: string) => string;
}>) {
	const displayValue = customFormatValue
		? customFormatValue(value, max, unit)
		: formatValue(value, max, unit);

	return (
		<div className="mt-1 text-xs text-gray-600 dark:text-gray-400 text-right">{displayValue}</div>
	);
}

/**
 * Meter label component
 */
export function MeterLabel({ label }: Readonly<{ label: string }>) {
	return <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>;
}

/**
 * Meter element with bar overlay
 */
export function MeterElement({
	value,
	min,
	max,
	className,
	ariaLabel,
	percentage,
	variant,
}: Readonly<{
	value: number;
	min: number;
	max: number;
	className: string;
	ariaLabel: string;
	percentage: number;
	variant: MeterVariant;
}>) {
	return (
		<div className="relative">
			<meter className={className} value={value} min={min} max={max} aria-label={ariaLabel} />
			<div className="absolute inset-0 pointer-events-none">
				<MeterBar percentage={percentage} variant={variant} />
			</div>
		</div>
	);
}
