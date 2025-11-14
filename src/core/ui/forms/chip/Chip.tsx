import { ARIA_LABELS } from '@core/constants/aria';
import CloseIcon from '@core/ui/icons/close-icon/CloseIcon';
import { getChipVariantClasses } from '@core/ui/variants/chip';
import type { ChipProps } from '@src-types/ui/feedback';
import { type MouseEvent, useCallback, useMemo } from 'react';

/**
 * Chip - Removable tag/filter component
 *
 * Features:
 * - Similar to Badge but with remove functionality
 * - Multiple variants: default, primary, success, warning, error, info
 * - Size variants: sm, md, lg
 * - Optional remove button with customizable aria-label
 * - Dark mode support
 * - Accessible focus states
 *
 * @example
 * ```tsx
 * <Chip variant="primary" onRemove={() => handleRemove()}>
 *   Filter Tag
 * </Chip>
 * ```
 *
 * @example
 * ```tsx
 * <Chip variant="success" size="sm" removable>
 *   Active
 * </Chip>
 * ```
 */
interface ChipRemoveButtonProps {
	onRemove: NonNullable<ChipProps['onRemove']>;
	size: ChipProps['size'];
	label: string;
}

const ChipRemoveButton = ({ onRemove, size, label }: ChipRemoveButtonProps) => {
	const handleRemove = useCallback(
		(event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			onRemove();
		},
		[onRemove]
	);

	return (
		<button
			type="button"
			onClick={handleRemove}
			className="ml-xs rounded-full p-xs transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary dark:hover:bg-muted-dark"
			aria-label={label}
			title={label}
		>
			<CloseIcon size={size === 'sm' ? 'sm' : 'md'} className="h-3 w-3" />
		</button>
	);
};

export default function Chip({
	variant = 'default',
	size = 'md',
	removable = false,
	onRemove,
	removeAriaLabel,
	className,
	children,
	...props
}: Readonly<ChipProps>) {
	const classes = useMemo(
		() => getChipVariantClasses({ variant, size, className }),
		[variant, size, className]
	);
	const removeButtonLabel = useMemo(() => removeAriaLabel ?? ARIA_LABELS.DELETE, [removeAriaLabel]);
	const shouldRenderRemoveButton = removable && onRemove;

	return (
		<div className={classes} {...props}>
			<span>{children}</span>
			{shouldRenderRemoveButton ? (
				<ChipRemoveButton onRemove={onRemove} size={size} label={removeButtonLabel} />
			) : null}
		</div>
	);
}
