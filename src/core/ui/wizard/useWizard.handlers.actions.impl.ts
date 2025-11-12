import type { WizardStepConfig } from '@src-types/ui/navigation';
import { useCallback } from 'react';

import { canNavigateFromStep, shouldValidateStep } from './useWizard.handlers.validation';
import type { UseWizardStateReturn } from './useWizard.state.types';

/**
 * Parameters for creating completion handler
 */
interface CompletionHandlerParams {
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	validateCurrentStep: () => Promise<boolean>;
	markRemainingStepsAsSkipped: () => void;
	state: UseWizardStateReturn;
	onComplete?: (() => void | Promise<void>) | undefined;
}

/**
 * Create completion handler
 */
export function useCompletionHandler({
	currentStep,
	currentStepIndex,
	validateCurrentStep,
	markRemainingStepsAsSkipped,
	state,
	onComplete,
}: CompletionHandlerParams) {
	return useCallback(async (): Promise<void> => {
		if (shouldValidateStep(currentStep)) {
			const isValid = await validateCurrentStep();
			if (!canNavigateFromStep(isValid, currentStep)) {
				return;
			}
		}

		if (currentStep && !currentStep.optional) {
			state.markStepCompleted(currentStepIndex);
		}

		markRemainingStepsAsSkipped();

		state.setIsProcessing(true);
		try {
			await onComplete?.();
		} finally {
			state.setIsProcessing(false);
		}
	}, [
		currentStep,
		currentStepIndex,
		validateCurrentStep,
		markRemainingStepsAsSkipped,
		state,
		onComplete,
	]);
}

/**
 * Create cancel handler
 */
export function useCancelHandler(onCancel?: (() => void) | undefined) {
	return useCallback(() => {
		onCancel?.();
	}, [onCancel]);
}
