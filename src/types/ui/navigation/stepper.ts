import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Stepper step status types
 */
export type StepperStepStatus = 'pending' | 'active' | 'completed' | 'error';

/**
 * Stepper orientation types
 */
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Stepper step data
 */
export interface StepperStep {
	/** Unique identifier for the step */
	id: string;
	/** Step label/title */
	label: string;
	/** Optional step description */
	description?: string;
	/** Optional step content */
	content?: ReactNode;
}

/**
 * Stepper component props
 */
export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of step data */
	steps: readonly StepperStep[];
	/** Current active step index (0-based) */
	activeStep: number;
	/** Orientation of the stepper @default 'horizontal' */
	orientation?: StepperOrientation;
	/** Size of the stepper @default 'md' */
	size?: StandardSize;
	/** Whether to show step numbers @default true */
	showNumbers?: boolean;
	/** Optional click handler for steps */
	onStepClick?: (stepIndex: number) => void;
}
