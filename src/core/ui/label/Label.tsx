import { ARIA_LABELS } from '@core/constants/aria';
import { getLabelVariantClasses } from '@core/ui/variants/label';
import type { LabelProps } from '@src-types/ui/forms';

/**
 * Label - Reusable label component
 *
 * Features:
 * - Accessible: semantic label element
 * - Required indicator: shows asterisk when required
 * - Size variants: sm, md, lg
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Label htmlFor="email" required size="md">
 *   Email Address
 * </Label>
 * ```
 */
export default function Label({
	children,
	required = false,
	size = 'md',
	className,
	...props
}: Readonly<LabelProps>) {
	return (
		<label
			className={getLabelVariantClasses({ size, className })}
			aria-required={required}
			{...props}
		>
			{children}
			{required ? (
				<span className="text-red-600 dark:text-red-400 ml-1" aria-label={ARIA_LABELS.REQUIRED}>
					*
				</span>
			) : null}
		</label>
	);
}
