import type { FormActionsProps } from '@src-types/ui/forms';

import { getFormActionsVariantClasses } from './helpers/FormActionsHelpers';

/**
 * FormActions - Container for submit/cancel button groups with consistent spacing
 *
 * Features:
 * - Consistent spacing between action buttons
 * - Alignment options: start, center, end, space-between
 * - Gap size variants: sm, md, lg, none
 * - Full width option
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <FormActions align="end" gap="md">
 *   <Button variant="secondary">Cancel</Button>
 *   <Button variant="primary">Submit</Button>
 * </FormActions>
 * ```
 *
 * @example
 * ```tsx
 * <FormActions align="space-between" gap="lg" fullWidth>
 *   <Button variant="ghost">Reset</Button>
 *   <Button variant="primary">Save Changes</Button>
 * </FormActions>
 * ```
 */
export default function FormActions({
	children,
	gap = 'md',
	align = 'end',
	fullWidth = false,
	className,
	...props
}: Readonly<FormActionsProps>) {
	return (
		<div className={getFormActionsVariantClasses({ gap, align, fullWidth, className })} {...props}>
			{children}
		</div>
	);
}
