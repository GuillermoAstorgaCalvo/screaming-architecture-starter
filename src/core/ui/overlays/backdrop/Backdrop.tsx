import { BACKDROP_BASE_CLASSES } from '@core/constants/ui/overlays';
import type { BackdropProps } from '@src-types/ui/overlays/containers';
import type { CSSProperties, MouseEvent } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Backdrop - Standalone reusable backdrop/overlay component
 *
 * Features:
 * - Reusable backdrop for custom overlays, modals, drawers, etc.
 * - Smooth fade in/out transitions
 * - Customizable opacity and blur
 * - Click handler support
 * - Accessible: proper ARIA attributes
 * - Dark mode support
 * - Optional backdrop blur
 *
 * @example
 * ```tsx
 * <Backdrop
 *   isOpen={isOpen}
 *   onClick={() => setIsOpen(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Backdrop
 *   isOpen={showOverlay}
 *   onClick={handleClose}
 *   variant="blur"
 *   opacity="light"
 *   className="z-50"
 * />
 * ```
 */
export default function Backdrop({
	isOpen,
	onClick,
	variant = 'default',
	opacity = 'default',
	className,
	zIndex,
	...props
}: Readonly<BackdropProps>) {
	if (!isOpen) {
		return null;
	}

	const backdropClasses = twMerge(
		BACKDROP_BASE_CLASSES,
		getVariantClasses(variant),
		getOpacityClasses(opacity),
		className
	);

	const handleClick = (e: MouseEvent<HTMLDivElement>) => {
		if (onClick && e.target === e.currentTarget) {
			onClick(e);
		}
	};

	const style: CSSProperties | undefined = zIndex === undefined ? undefined : { zIndex };

	return (
		<div
			className={backdropClasses}
			onClick={handleClick}
			aria-hidden="true"
			style={style}
			{...props}
		/>
	);
}

/**
 * Get variant-specific classes
 */
function getVariantClasses(variant: BackdropProps['variant']): string {
	switch (variant) {
		case 'blur': {
			return 'backdrop-blur-sm';
		}
		case 'solid': {
			return '';
		}
		case 'default':
		default: {
			return '';
		}
	}
}

/**
 * Get opacity-specific classes
 */
function getOpacityClasses(opacity: BackdropProps['opacity']): string {
	switch (opacity) {
		case 'light': {
			return 'bg-black/30 dark:bg-black/40';
		}
		case 'medium': {
			return 'bg-black/50 dark:bg-black/60';
		}
		case 'dark': {
			return 'bg-black/70 dark:bg-black/80';
		}
		case 'default':
		default: {
			return 'bg-black/50 dark:bg-black/70';
		}
	}
}
