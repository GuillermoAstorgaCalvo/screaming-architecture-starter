import { getIconButtonVariantClasses } from '@core/ui/variants/iconButton';
import type { IconButtonProps } from '@src-types/ui';

export type {
	IconButtonProps,
	StandardSize as IconButtonSize,
	IconButtonVariant,
} from '@src-types/ui';

/**
 * IconButton - Reusable icon button component
 *
 * Features:
 * - Accessible: requires aria-label
 * - Size variants: sm, md, lg
 * - Visual variants: default, ghost
 * - Dark mode support
 * - Focus states
 *
 * @example
 * ```tsx
 * <IconButton
 *   icon={<CloseIcon />}
 *   aria-label="Close"
 *   onClick={handleClose}
 *   variant="ghost"
 * />
 * ```
 */
export default function IconButton({
	icon,
	'aria-label': ariaLabel,
	title,
	size = 'md',
	variant = 'default',
	className,
	...props
}: Readonly<IconButtonProps>) {
	return (
		<button
			type="button"
			className={getIconButtonVariantClasses({ variant, size, className })}
			aria-label={ariaLabel}
			title={title ?? ariaLabel}
			{...props}
		>
			{icon}
		</button>
	);
}
