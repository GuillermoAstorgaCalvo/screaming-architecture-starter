import {
	PROGRESS_BAR_BASE_CLASSES,
	PROGRESS_BASE_CLASSES,
	PROGRESS_SIZE_CLASSES,
} from '@core/constants/ui/display/progress';
import type { ProgressProps } from '@src-types/ui/feedback';
import { twMerge } from 'tailwind-merge';

/**
 * Progress - Progress indicator component
 *
 * Features:
 * - Size variants: sm, md, lg
 * - Optional value display
 * - Accessible ARIA attributes
 * - Smooth animations
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Progress value={50} size="md" />
 * ```
 *
 * @example
 * ```tsx
 * <Progress value={75} size="lg" showValue aria-label="Upload progress: 75%" />
 * ```
 */
function calculatePercentage(value: number, max: number): number {
	return Math.min(Math.max((value / max) * 100, 0), 100);
}

function getProgressLabel(
	percentage: number,
	showValue: boolean,
	ariaLabel?: string
): string | undefined {
	if (ariaLabel) return ariaLabel;
	return showValue ? `${Math.round(percentage)}%` : undefined;
}

function ProgressBar({ percentage }: Readonly<{ percentage: number }>) {
	return <div className={PROGRESS_BAR_BASE_CLASSES} style={{ width: `${percentage}%` }} />;
}

function ProgressValue({ value }: Readonly<{ value: number }>) {
	return <div className="mt-1 text-xs text-text-secondary text-right">{value}%</div>;
}

export default function Progress({
	value,
	max = 100,
	size = 'md',
	showValue = false,
	className,
	'aria-label': ariaLabel,
	...props
}: Readonly<ProgressProps>) {
	const percentage = calculatePercentage(value, max);
	const progressClasses = twMerge(PROGRESS_BASE_CLASSES, PROGRESS_SIZE_CLASSES[size], className);
	const label = getProgressLabel(percentage, showValue, ariaLabel);
	const shouldShowValue = showValue && !ariaLabel;
	const progressValue = Math.round(percentage);

	return (
		<div className="w-full">
			<progress className={progressClasses} value={value} max={max} aria-label={label} {...props}>
				<ProgressBar percentage={percentage} />
			</progress>
			{shouldShowValue ? <ProgressValue value={progressValue} /> : null}
		</div>
	);
}
