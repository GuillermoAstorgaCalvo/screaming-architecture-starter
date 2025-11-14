import { useTranslation } from '@core/i18n/useTranslation';
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
	const { t } = useTranslation('common');
	return (
		<label
			className={getLabelVariantClasses({ size, className })}
			aria-required={required}
			{...props}
		>
			{children}
			{required ? (
				<span
					className="text-destructive dark:text-destructive-foreground ml-1"
					aria-label={t('a11y.required')}
				>
					*
				</span>
			) : null}
		</label>
	);
}
