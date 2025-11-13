/**
 * Stepper display constants
 */
import type { StandardSize } from '@src-types/ui/base';
import type { StepperOrientation } from '@src-types/ui/navigation/stepper';

export const STEPPER_BASE_CLASSES = 'flex';

export const STEPPER_ORIENTATION_CLASSES: Record<StepperOrientation, string> = {
	horizontal: 'flex-row items-center',
	vertical: 'flex-col',
} as const;

export const STEPPER_STEP_SIZE_CLASSES: Record<StandardSize, string> = {
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
} as const;
