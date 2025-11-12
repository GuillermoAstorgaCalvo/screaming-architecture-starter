import type { StandardSize } from '@src-types/ui/base';
import type {
	FloatingActionButtonPosition,
	FloatingActionButtonProps,
} from '@src-types/ui/navigation';
import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * FAB position classes
 */
const FAB_POSITION_CLASSES: Record<FloatingActionButtonPosition, string> = {
	'bottom-right': 'fixed bottom-4 right-4 sm:bottom-6 sm:right-6',
	'bottom-left': 'fixed bottom-4 left-4 sm:bottom-6 sm:left-6',
	'top-right': 'fixed top-4 right-4 sm:top-6 sm:right-6',
	'top-left': 'fixed top-4 left-4 sm:top-6 sm:left-6',
} as const;

/**
 * FAB size classes
 */
const FAB_SIZE_CLASSES = {
	sm: 'h-10 w-10 text-sm',
	md: 'h-14 w-14 text-base',
	lg: 'h-16 w-16 text-lg',
} as const;

/**
 * FAB variant classes
 */
const FAB_VARIANT_CLASSES = {
	primary:
		'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl dark:bg-primary dark:hover:bg-primary/90',
	secondary:
		'bg-secondary text-secondary-foreground hover:bg-secondary-dark shadow-lg hover:shadow-xl dark:bg-secondary-dark dark:hover:bg-secondary',
} as const;

/**
 * FAB base classes
 */
const FAB_BASE_CLASSES =
	'inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed z-50';

/**
 * Extended FAB classes
 */
const FAB_EXTENDED_CLASSES = 'px-6 rounded-full';

/**
 * Extended FAB size classes
 */
const FAB_EXTENDED_SIZE_CLASSES = {
	sm: 'h-10 px-4 text-sm',
	md: 'h-14 px-6 text-base',
	lg: 'h-16 px-8 text-lg',
} as const;

/**
 * Gets the position classes for the FAB
 */
function getPositionClasses(position: FloatingActionButtonPosition): string {
	return FAB_POSITION_CLASSES[position];
}

/**
 * Gets the size classes for the regular (non-extended) FAB
 */
function getRegularSizeClasses(size: StandardSize): string {
	return FAB_SIZE_CLASSES[size];
}

/**
 * Gets the size classes for the extended FAB
 */
function getExtendedSizeClasses(size: StandardSize): string {
	return FAB_EXTENDED_SIZE_CLASSES[size];
}

/**
 * Gets the variant classes for the FAB
 */
function getVariantClasses(variant: 'primary' | 'secondary'): string {
	return FAB_VARIANT_CLASSES[variant];
}

/**
 * Gets the extended padding classes for the FAB
 */
function getExtendedPaddingClasses(): string {
	return FAB_EXTENDED_CLASSES;
}

/**
 * Computes all classes for the FAB
 */
function getFloatingActionButtonClasses({
	position,
	size,
	variant,
	extended,
	className,
}: {
	position: FloatingActionButtonPosition;
	size: StandardSize;
	variant: 'primary' | 'secondary';
	extended: boolean;
	className?: string;
}): string {
	const sizeClasses = extended ? getExtendedSizeClasses(size) : getRegularSizeClasses(size);

	const extendedPaddingClasses = extended ? getExtendedPaddingClasses() : '';

	return twMerge(
		FAB_BASE_CLASSES,
		getPositionClasses(position),
		sizeClasses,
		getVariantClasses(variant),
		extendedPaddingClasses,
		className
	);
}

/**
 * Renders the FAB content (icon and optional label)
 */
function FloatingActionButtonContent({
	icon,
	extended,
	label,
}: Readonly<{
	icon: ReactNode;
	extended: boolean;
	label?: ReactNode;
}>) {
	return (
		<span className="flex items-center gap-2">
			{icon}
			{extended && label ? <span className="font-medium">{label}</span> : null}
		</span>
	);
}

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
			aria-label={ariaLabel}
			title={tooltip ?? ariaLabel}
			{...props}
		>
			<FloatingActionButtonContent icon={icon} extended={extended} label={label} />
		</button>
	);
}
