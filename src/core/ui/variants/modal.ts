import { MODAL_SIZE_CLASSES } from '@core/constants/ui/overlays';
import type { ModalSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Modal dialog variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Modal dialog overlay.
 */
export const modalDialogVariants = cva(
	'fixed inset-0 z-modal flex items-center justify-center p-lg bg-transparent backdrop:bg-overlay dark:backdrop:bg-overlay-default-dark'
);

/**
 * Modal body variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Modal body (the actual modal content).
 */
export const modalBodyVariants = cva(
	'bg-surface rounded-lg shadow-lg w-full max-h-[90vh] overflow-y-auto',
	{
		variants: {
			size: {
				sm: MODAL_SIZE_CLASSES.sm,
				md: MODAL_SIZE_CLASSES.md,
				lg: MODAL_SIZE_CLASSES.lg,
				xl: MODAL_SIZE_CLASSES.xl,
				full: MODAL_SIZE_CLASSES.full,
			} satisfies Record<ModalSize, string>,
		},
		defaultVariants: {
			size: 'md',
		},
	}
);

/**
 * Type for modal dialog variant props
 */
export type ModalDialogVariants = VariantProps<typeof modalDialogVariants>;

/**
 * Type for modal body variant props
 */
export type ModalBodyVariants = VariantProps<typeof modalBodyVariants>;

/**
 * Helper function to get modal dialog class names with proper merging
 *
 * @param props - Modal dialog variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getModalDialogVariantClasses(
	props: ModalDialogVariants & { className?: string | undefined }
): string {
	return twMerge(modalDialogVariants(props), props.className);
}

/**
 * Helper function to get modal body class names with proper merging
 *
 * @param props - Modal body variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getModalBodyVariantClasses(
	props: ModalBodyVariants & { className?: string | undefined }
): string {
	return twMerge(modalBodyVariants(props), props.className);
}
