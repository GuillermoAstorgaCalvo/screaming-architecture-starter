import { calculateWizardProgressByCompletion } from '@core/ui/forms/wizard/helpers/wizardUtils';
import type {
	ResetHandlerParams,
	WizardState,
	WizardStateMemoParams,
} from '@core/ui/forms/wizard/types/useWizard.state.types';
import { useCallback, useMemo } from 'react';

/**
 * Hook to create reset handler for wizard state
 */
export function useResetHandler(params: ResetHandlerParams) {
	const {
		initialStep,
		controlledStep,
		setCurrentStep,
		setCompletedSteps,
		setSkippedSteps,
		setValidationState,
		setIsProcessing,
	} = params;

	return useCallback(() => {
		if (controlledStep === undefined) {
			setCurrentStep(initialStep);
		}
		setCompletedSteps(new Set());
		setSkippedSteps(new Set());
		setValidationState(new Map());
		setIsProcessing(false);
	}, [
		initialStep,
		controlledStep,
		setCurrentStep,
		setCompletedSteps,
		setSkippedSteps,
		setValidationState,
		setIsProcessing,
	]);
}

/**
 * Hook to calculate wizard progress percentage
 */
export function useWizardProgress(
	totalSteps: number,
	completedSteps: Set<number>,
	skippedSteps: Set<number>
) {
	return useMemo(
		() => calculateWizardProgressByCompletion(totalSteps, completedSteps, skippedSteps),
		[totalSteps, completedSteps, skippedSteps]
	);
}

/**
 * Hook to memoize wizard state object
 */
export function useWizardStateMemo(params: WizardStateMemoParams) {
	return useMemo<WizardState>(
		() => ({
			currentStep: params.activeStep,
			completedSteps: params.completedSteps,
			skippedSteps: params.skippedSteps,
			validationState: params.validationState,
			isProcessing: params.isProcessing,
		}),
		[
			params.activeStep,
			params.completedSteps,
			params.skippedSteps,
			params.validationState,
			params.isProcessing,
		]
	);
}
