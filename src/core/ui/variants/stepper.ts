import {
	STEPPER_BASE_CLASSES,
	STEPPER_ORIENTATION_CLASSES,
	STEPPER_STEP_SIZE_CLASSES,
} from '@core/constants/ui/display';
import type { StandardSize } from '@src-types/ui/base';
import type { StepperOrientation } from '@src-types/ui/navigation';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

/**
 * Stepper variant definition using class-variance-authority
 *
 * Provides type-safe variant management for Stepper component.
 */
export const stepperVariants = cva(STEPPER_BASE_CLASSES, {
	variants: {
		orientation: {
			horizontal: STEPPER_ORIENTATION_CLASSES.horizontal,
			vertical: STEPPER_ORIENTATION_CLASSES.vertical,
		} satisfies Record<StepperOrientation, string>,
	},
	defaultVariants: {
		orientation: 'horizontal',
	},
});

/**
 * Type for stepper variant props
 * Extracted from stepperVariants using VariantProps
 */
export type StepperVariants = VariantProps<typeof stepperVariants>;

/**
 * Helper function to get stepper class names with proper merging
 *
 * @param props - Stepper variant props
 * @param className - Additional classes to merge
 * @returns Merged class names string
 */
export function getStepperVariantClasses(
	props: StepperVariants & { className?: string | undefined }
): string {
	return twMerge(stepperVariants(props), props.className);
}

/**
 * Helper function to get stepper step size classes
 *
 * @param size - Step size
 * @returns Size classes string
 */
export function getStepperStepSizeClasses(size: StandardSize): string {
	return STEPPER_STEP_SIZE_CLASSES[size];
}
