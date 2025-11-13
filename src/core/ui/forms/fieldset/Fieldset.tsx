import { TEXT_SIZE_CLASSES } from '@core/constants/ui/shared';
import { getFieldsetVariantClasses } from '@core/ui/forms/fieldset/helpers/FieldsetHelpers';
import type { FieldsetProps } from '@src-types/ui/forms';

/**
 * Fieldset - Semantic grouping for form fields
 *
 * Features:
 * - Semantic HTML: uses <fieldset> and <legend> elements
 * - Accessible: proper ARIA relationships
 * - Disabled state support
 * - Size variants for legend: sm, md, lg
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Fieldset legend="Personal Information">
 *   <Input label="First Name" />
 *   <Input label="Last Name" />
 * </Fieldset>
 * ```
 *
 * @example
 * ```tsx
 * <Fieldset legend="Preferences" disabled>
 *   <Checkbox label="Email notifications" />
 *   <Checkbox label="SMS notifications" />
 * </Fieldset>
 * ```
 */
export default function Fieldset({
	children,
	legend,
	disabled = false,
	size = 'md',
	className,
	...props
}: Readonly<FieldsetProps>) {
	return (
		<fieldset
			className={getFieldsetVariantClasses({ size, className })}
			disabled={disabled}
			{...props}
		>
			{legend ? <legend className={getFieldsetLegendClasses({ size })}>{legend}</legend> : null}
			{children}
		</fieldset>
	);
}

/**
 * Helper function to get legend class names
 */
function getFieldsetLegendClasses({ size }: { size: 'sm' | 'md' | 'lg' }): string {
	return `font-medium text-text-primary mb-2 ${TEXT_SIZE_CLASSES[size]}`;
}
