import type { FormControls, UseFormAdapterOptions } from '@core/forms/formAdapter';
import type { StandardSize } from '@src-types/ui/base';
import type { StepperOrientation } from '@src-types/ui/navigation/stepper';
import type { HTMLAttributes, ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

/**
 * Form controls subset for step content
 */
export interface FormWizardStepControls<T extends FieldValues = FieldValues> {
	readonly register: FormControls<T>['register'];
	readonly errors: FormControls<T>['errors'];
	readonly setValue: FormControls<T>['setValue'];
	readonly getValues: FormControls<T>['getValues'];
	readonly watch: FormControls<T>['watch'];
	readonly trigger: FormControls<T>['trigger'];
	readonly control: FormControls<T>['control'];
	readonly isValid: boolean;
	readonly isDirty: boolean;
}

/**
 * Form wizard step configuration
 */
export interface FormWizardStep<T extends FieldValues = FieldValues> {
	/** Unique identifier for the step */
	id: string;
	/** Step label/title */
	label: string;
	/** Optional step description */
	description?: string;
	/** Step content (ReactNode) - receives form controls and current step data */
	content: (formControls: FormWizardStepControls<T>) => ReactNode;
	/** Optional validation function for this step - receives form data */
	validate?: (data: T) => boolean | Promise<boolean>;
	/** Fields to validate for this step (if not provided, validates all fields) */
	validateFields?: readonly (keyof T)[];
	/** Whether this step can be skipped @default false */
	skippable?: boolean;
	/** Whether this step is optional (doesn't block completion) @default false */
	optional?: boolean;
}

/**
 * Form wizard component props
 */
export interface FormWizardProps<T extends FieldValues = FieldValues>
	extends Omit<HTMLAttributes<HTMLDivElement>, 'onSubmit'> {
	/** Array of wizard step configurations */
	steps: readonly FormWizardStep<T>[];
	/** Form configuration options */
	formOptions?: UseFormAdapterOptions<T>;
	/** Initial active step index (0-based) @default 0 */
	initialStep?: number;
	/** Controlled active step index (0-based) */
	activeStep?: number;
	/** Callback when step changes */
	onStepChange?: (stepIndex: number) => void;
	/** Callback when wizard is completed - receives all form data */
	onComplete?: (data: T) => void | Promise<void>;
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
	/** Whether to validate on step change @default true */
	validateOnStepChange?: boolean;
	/** Whether to persist form data in localStorage */
	persistData?: boolean;
	/** Key for localStorage persistence @default 'form-wizard-data' */
	persistKey?: string;
	/** Class name for the wizard container */
	className?: string;
}

/**
 * Form wizard step status
 */
export type FormWizardStepStatus = 'pending' | 'active' | 'completed' | 'error';

/**
 * Form wizard state
 */
export interface FormWizardState<T extends FieldValues = FieldValues> {
	/** Current active step index */
	activeStep: number;
	/** Completed step indices */
	completedSteps: Set<number>;
	/** Steps with validation errors */
	errorSteps: Set<number>;
	/** Form data */
	formData: Partial<T>;
	/** Whether wizard is submitting */
	isSubmitting: boolean;
}
