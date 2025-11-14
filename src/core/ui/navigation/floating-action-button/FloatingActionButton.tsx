import { FloatingActionButtonContent } from '@core/ui/navigation/floating-action-button/components/FloatingActionButtonComponents';
import { FAB_Z_INDEX } from '@core/ui/navigation/floating-action-button/constants/FloatingActionButtonConstants';
import { getFloatingActionButtonClasses } from '@core/ui/navigation/floating-action-button/utils/floatingActionButtonUtils';
import type { FloatingActionButtonProps } from '@src-types/ui/navigation/floatingActionButton';

/**
 * FloatingActionButton - Floating action button for primary actions
 *
 * Features:
 * - Accessible: proper semantic HTML, keyboard navigation, focus states
 * - Multiple positions: bottom-right, bottom-left, top-right, top-left
 * - Size variants: sm, md, lg
 * - Visual variants: primary, secondary
 * - Extended mode: shows label text
 * - Dark mode support
 * - Mobile-friendly with proper touch targets
 *
 * @example
 * ```tsx
 * <FloatingActionButton
 *   icon={<PlusIcon />}
 *   aria-label="Add new item"
 *   onClick={handleAdd}
 *   position="bottom-right"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <FloatingActionButton
 *   icon={<PlusIcon />}
 *   aria-label="Create new post"
 *   label="Create"
 *   extended
 *   onClick={handleCreate}
 * />
 * ```
 */
export default function FloatingActionButton({
	icon,
	'aria-label': ariaLabel,
	tooltip,
	position = 'bottom-right',
	size = 'md',
	variant = 'primary',
	extended = false,
	label,
	className,
	...props
}: Readonly<FloatingActionButtonProps>) {
	const classes = getFloatingActionButtonClasses({
		position,
		size,
		variant,
		extended,
		...(className !== undefined && { className }),
	});

	return (
		<button
			type="button"
			className={classes}
			style={{ zIndex: FAB_Z_INDEX }}
			aria-label={ariaLabel}
			title={tooltip ?? ariaLabel}
			{...props}
		>
			<FloatingActionButtonContent icon={icon} extended={extended} label={label} />
		</button>
	);
}
