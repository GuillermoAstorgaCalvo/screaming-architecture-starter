import type { FormGroupProps } from '@src-types/ui/forms';

import { getFormGroupVariantClasses } from './FormGroupHelpers';

/**
 * FormGroup - Wrapper for related fields with spacing/alignment
 *
 * Features:
 * - Consistent spacing between fields
 * - Alignment options: start, center, end, stretch
 * - Gap size variants: sm, md, lg, none
 * - Full width option
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <FormGroup gap="md" align="start">
 *   <Input label="First Name" />
 *   <Input label="Last Name" />
 * </FormGroup>
 * ```
 *
 * @example
 * ```tsx
 * <FormGroup gap="lg" align="stretch" fullWidth>
 *   <Input label="Email" fullWidth />
 *   <Input label="Phone" fullWidth />
 * </FormGroup>
 * ```
 */
export default function FormGroup({
	children,
	gap = 'md',
	align = 'start',
	fullWidth = false,
	className,
	...props
}: Readonly<FormGroupProps>) {
	return (
		<div className={getFormGroupVariantClasses({ gap, align, fullWidth, className })} {...props}>
			{children}
		</div>
	);
}
