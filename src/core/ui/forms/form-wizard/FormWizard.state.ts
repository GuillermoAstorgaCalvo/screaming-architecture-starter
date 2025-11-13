import type { FieldValues } from 'react-hook-form';

import { useFormWizardState } from './useFormWizardState';

/**
 * Initialize wizard state with persistence and step tracking
 */
export function useFormWizardStateManagement<T extends FieldValues>(config: {
	initialStep: number;
	controlledActiveStep: number | undefined;
	persistData: boolean;
	persistKey: string;
	steps: readonly unknown[];
}) {
	const {
		state,
		setActiveStep,
		markStepCompleted,
		markStepError,
		clearStepError,
		updateFormData,
		setIsSubmitting,
	} = useFormWizardState<T>({
		initialStep: config.controlledActiveStep ?? config.initialStep,
		persistData: config.persistData,
		persistKey: config.persistKey,
		steps: config.steps,
	});

	return {
		state,
		setActiveStep,
		markStepCompleted,
		markStepError,
		clearStepError,
		updateFormData,
		setIsSubmitting,
	};
}

/**
 * Create state handlers object from state management
 */
export function createStateHandlers<T extends FieldValues>(stateManagement: {
	setActiveStep: (step: number) => void;
	markStepCompleted: (stepIndex: number) => void;
	markStepError: (stepIndex: number) => void;
	clearStepError: (stepIndex: number) => void;
	updateFormData: (data: Partial<T>) => void;
	setIsSubmitting: (isSubmitting: boolean) => void;
}) {
	return {
		setActiveStep: stateManagement.setActiveStep,
		markStepCompleted: stateManagement.markStepCompleted,
		markStepError: stateManagement.markStepError,
		clearStepError: stateManagement.clearStepError,
		updateFormData: stateManagement.updateFormData,
		setIsSubmitting: stateManagement.setIsSubmitting,
	};
}
