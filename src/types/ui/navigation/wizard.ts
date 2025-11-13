import type { StandardSize } from '@src-types/ui/base';
import type { HTMLAttributes, ReactNode } from 'react';

import type { StepperOrientation } from './stepper';

/**
 * Wizard step validation function
 * Returns true if step is valid, false otherwise
 */
export type WizardStepValidator<T extends Record<string, unknown> = Record<string, unknown>> = (
	data: T
) => boolean | Promise<boolean>;

/**
 * Wizard step configuration
 */
export interface WizardStepConfig {
	/** Unique identifier for the step */
	id: string;
	/** Step label/title */
	label: string;
	/** Optional step description */
	description?: string;
	/** Step content (ReactNode) */
	content: ReactNode;
	/** Whether this step can be skipped @default false */
	skippable?: boolean;
	/** Whether this step is optional (doesn't block completion) @default false */
	optional?: boolean;
	/** Optional validation function for this step */
	validate?: WizardStepValidator;
	/** Whether to validate on step change @default true */
	validateOnChange?: boolean;
}

/**
 * Wizard component props
 */
export interface WizardProps extends HTMLAttributes<HTMLDivElement> {
	/** Array of wizard step configurations */
	steps: readonly WizardStepConfig[];
	/** Initial active step index (0-based) @default 0 */
	initialStep?: number;
	/** Controlled active step index (0-based) */
	activeStep?: number;
	/** Callback when step changes */
	onStepChange?: (stepIndex: number) => void;
	/** Callback when wizard is completed */
	onComplete?: () => void | Promise<void>;
	/** Callback when wizard is cancelled */
	onCancel?: () => void;
	/** Orientation of the stepper @default 'horizontal' */
	orientation?: StepperOrientation;
	/** Size of the stepper @default 'md' */
	size?: StandardSize;
	/** Whether to show step numbers @default true */
	showNumbers?: boolean;
	/** Whether to show navigation buttons @default true */
	showNavigation?: boolean;
	/** Custom label for next button */
	nextButtonLabel?: string;
	/** Custom label for previous button */
	previousButtonLabel?: string;
	/** Custom label for finish button */
	finishButtonLabel?: string;
	/** Whether to show progress indicator @default true */
	showProgress?: boolean;
	/** Whether to allow going back to previous steps @default true */
	allowBackNavigation?: boolean;
	/** Form data (for validation) */
	formData?: Record<string, unknown>;
	/** Class name for the wizard container */
	className?: string;
}
