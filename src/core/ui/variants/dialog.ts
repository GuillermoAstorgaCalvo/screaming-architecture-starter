import { MODAL_SIZE_CLASSES } from '@core/constants/ui/overlays';
import type { ModalSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Dialog dialog variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Dialog overlay.
 */
export const dialogDialogVariants = cva(
	'fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop:bg-black/50 dark:backdrop:bg-black/70',
	{
		variants: {
			variant: {
				default: '',
				centered: 'items-center justify-center',
				fullscreen: 'p-0',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

/**
 * Dialog body variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Dialog body (the actual dialog content).
 */
export const dialogBodyVariants = cva(
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
			variant: {
				default: '',
				centered: '',
				fullscreen: 'rounded-none max-h-screen h-screen max-w-full w-full m-0',
			},
		},
		defaultVariants: {
			size: 'md',
			variant: 'default',
		},
	}
);

/**
 * Type for dialog dialog variant props
 */
export type DialogDialogVariants = VariantProps<typeof dialogDialogVariants>;

/**
 * Type for dialog body variant props
 */
export type DialogBodyVariants = VariantProps<typeof dialogBodyVariants>;

/**
 * Helper function to get dialog dialog class names with proper merging
 *
 * @param props - Dialog dialog variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getDialogDialogVariantClasses(
	props: DialogDialogVariants & { className?: string | undefined }
): string {
	return twMerge(dialogDialogVariants(props), props.className);
}

/**
 * Helper function to get dialog body class names with proper merging
 *
 * @param props - Dialog body variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getDialogBodyVariantClasses(
	props: DialogBodyVariants & { className?: string | undefined }
): string {
	return twMerge(dialogBodyVariants(props), props.className);
}
