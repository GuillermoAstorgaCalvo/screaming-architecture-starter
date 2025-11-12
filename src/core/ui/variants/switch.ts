import {
	SWITCH_BASE_CLASSES,
	SWITCH_CHECKED_CLASSES,
	SWITCH_SIZE_CLASSES,
	SWITCH_THUMB_BASE_CLASSES,
	SWITCH_THUMB_CHECKED_CLASSES,
	SWITCH_THUMB_SIZE_CLASSES,
	SWITCH_THUMB_UNCHECKED_CLASSES,
	SWITCH_UNCHECKED_CLASSES,
} from '@core/constants/ui/controls';
import type { StandardSize } from '@src-types/ui/base';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Switch variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Switch component.
 * Combines base classes, size classes, and checked/unchecked state classes.
 */
export const switchVariants = cva(SWITCH_BASE_CLASSES, {
	variants: {
		size: {
			sm: SWITCH_SIZE_CLASSES.sm,
			md: SWITCH_SIZE_CLASSES.md,
			lg: SWITCH_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
		checked: {
			true: SWITCH_CHECKED_CLASSES,
			false: SWITCH_UNCHECKED_CLASSES,
		},
	},
	defaultVariants: {
		size: 'md',
		checked: false,
	},
});

/**
 * Type for switch variant props
 * Extracted from switchVariants using VariantProps
 */
export type SwitchVariants = VariantProps<typeof switchVariants>;

/**
 * Helper function to get switch class names with proper merging
 *
 * @param props - Switch variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getSwitchVariantClasses(
	props: SwitchVariants & { className?: string | undefined }
): string {
	return twMerge(switchVariants(props), props.className);
}

/**
 * Switch thumb variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Switch thumb (the moving circle).
 */
export const switchThumbVariants = cva(SWITCH_THUMB_BASE_CLASSES, {
	variants: {
		size: {
			sm: SWITCH_THUMB_SIZE_CLASSES.sm,
			md: SWITCH_THUMB_SIZE_CLASSES.md,
			lg: SWITCH_THUMB_SIZE_CLASSES.lg,
		} satisfies Record<StandardSize, string>,
		checked: {
			true: '',
			false: SWITCH_THUMB_UNCHECKED_CLASSES,
		},
	},
	defaultVariants: {
		size: 'md',
		checked: false,
	},
});

/**
 * Type for switch thumb variant props
 */
export type SwitchThumbVariants = VariantProps<typeof switchThumbVariants>;

/**
 * Helper function to get switch thumb class names with proper merging
 *
 * @param props - Switch thumb variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getSwitchThumbVariantClasses(
	props: SwitchThumbVariants & {
		checked: boolean;
		size: StandardSize;
		className?: string | undefined;
	}
): string {
	const translateClass = props.checked
		? SWITCH_THUMB_CHECKED_CLASSES[props.size]
		: SWITCH_THUMB_UNCHECKED_CLASSES;
	return twMerge(
		switchThumbVariants({ size: props.size, checked: props.checked }),
		translateClass,
		props.className
	);
}
