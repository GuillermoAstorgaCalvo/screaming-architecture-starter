import { METER_BASE_CLASSES, METER_SIZE_CLASSES } from '@core/constants/ui/display/progress';
import {
	MeterElement,
	MeterLabel,
	MeterValue,
} from '@core/ui/data-display/meter/components/MeterComponents';
import {
	buildAriaLabelProps,
	buildMeterValueProps,
} from '@core/ui/data-display/meter/helpers/Meter.helpers';
import {
	calculatePercentage,
	getMeterAriaLabel,
	getVariantFromThresholds,
} from '@core/ui/data-display/meter/utils/Meter.utils';
import type { MeterProps } from '@src-types/ui/feedback';
import { twMerge } from 'tailwind-merge';

/**
 * Meter - Measurement display component for showing values within ranges
 *
 * Features:
 * - Displays actual values with units (e.g., storage, bandwidth)
 * - Color variants based on thresholds (success/warning/error)
 * - Size variants: sm, md, lg
 * - Custom value formatting
 * - Accessible ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Meter value={500} max={1000} unit="GB" label="Storage" />
 * ```
 *
 * @example
 * ```tsx
 * <Meter
 *   value={850}
 *   max={1000}
 *   unit="GB"
 *   label="Storage"
 *   thresholds={[
 *     { value: 80, variant: 'warning' },
 *     { value: 90, variant: 'error' }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Meter
 *   value={75}
 *   max={100}
 *   unit="MB/s"
 *   formatValue={(val, max, unit) => `${val}${unit} of ${max}${unit}`}
 * />
 * ```
 */
export default function Meter({
	value,
	min = 0,
	max,
	size = 'md',
	unit,
	label,
	showValue = true,
	formatValue: customFormatValue,
	thresholds,
	variant: manualVariant,
	className,
	'aria-label': ariaLabel,
	...props
}: Readonly<MeterProps>) {
	const percentage = calculatePercentage(value, min, max);
	const variant = manualVariant ?? getVariantFromThresholds(percentage, thresholds);
	const meterClasses = twMerge(METER_BASE_CLASSES, METER_SIZE_CLASSES[size], className);
	return (
		<div className="w-full" {...props}>
			{label ? <MeterLabel label={label} /> : null}
			<MeterElement
				value={value}
				min={min}
				max={max}
				className={meterClasses}
				ariaLabel={getMeterAriaLabel(buildAriaLabelProps({ ariaLabel, label, value, max, unit }))}
				percentage={percentage}
				variant={variant}
			/>
			{showValue ? (
				<MeterValue {...buildMeterValueProps({ value, max, unit, customFormatValue })} />
			) : null}
		</div>
	);
}
