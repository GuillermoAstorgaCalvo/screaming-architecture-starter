import type { FormControls } from '@core/forms/formAdapter';
import type { FieldValues } from 'react-hook-form';

import { buildCallbacks } from './FormWizard.callbacks';
import { useFormWizardForm } from './FormWizard.form';
import { createStateHandlers, useFormWizardStateManagement } from './FormWizard.state';
import { useWizardStateSync } from './FormWizard.sync';
import type { FormWizardProps, FormWizardState } from './FormWizardTypes';
import { useFormWizardHandlers } from './useFormWizardHandlers';

/**
 * Initialize form wizard handlers with all dependencies
 */
function useFormWizardHandlersInit<T extends FieldValues>(config: {
	state: FormWizardState<T>;
	steps: FormWizardProps<T>['steps'];
	formControls: FormControls<T>;
	stateHandlers: {
		setActiveStep: (step: number) => void;
		markStepCompleted: (stepIndex: number) => void;
		markStepError: (stepIndex: number) => void;
		clearStepError: (stepIndex: number) => void;
		updateFormData: (data: Partial<T>) => void;
		setIsSubmitting: (isSubmitting: boolean) => void;
	};
	callbacks: {
		onStepChange?: (stepIndex: number) => void;
		onComplete?: (data: T) => void | Promise<void>;
		onCancel?: () => void;
	};
	options: {
		validateOnStepChange: boolean;
		allowBackNavigation: boolean;
	};
}) {
	return useFormWizardHandlers<T>({
		state: config.state,
		steps: config.steps,
		formControls: config.formControls,
		...config.stateHandlers,
		...(config.callbacks.onStepChange !== undefined && {
			onStepChange: config.callbacks.onStepChange,
		}),
		...(config.callbacks.onComplete !== undefined && {
			onComplete: config.callbacks.onComplete,
		}),
		...(config.callbacks.onCancel !== undefined && { onCancel: config.callbacks.onCancel }),
		...config.options,
	});
}

/**
 * Initialize all form wizard dependencies and state
 */
export function useFormWizardInit<T extends FieldValues>(config: {
	formOptions?: FormWizardProps<T>['formOptions'];
	initialStep: number;
	controlledActiveStep: number | undefined;
	persistData: boolean;
	persistKey: string;
	steps: FormWizardProps<T>['steps'];
	onStepChange?: (stepIndex: number) => void;
	onComplete?: (data: T) => void | Promise<void>;
	onCancel?: () => void;
	validateOnStepChange: boolean;
	allowBackNavigation: boolean;
}) {
	const formControls = useFormWizardForm<T>(config.formOptions);
	const stateManagement = useFormWizardStateManagement<T>({
		initialStep: config.initialStep,
		controlledActiveStep: config.controlledActiveStep,
		persistData: config.persistData,
		persistKey: config.persistKey,
		steps: config.steps,
	});
	const synchronizedState = useWizardStateSync(stateManagement, config.controlledActiveStep);
	const handlers = useFormWizardHandlersInit<T>({
		state: synchronizedState,
		steps: config.steps,
		formControls,
		stateHandlers: createStateHandlers<T>(stateManagement),
		callbacks: buildCallbacks<T>(config),
		options: {
			validateOnStepChange: config.validateOnStepChange,
			allowBackNavigation: config.allowBackNavigation,
		},
	});

	return { formControls, synchronizedState, handlers };
}
