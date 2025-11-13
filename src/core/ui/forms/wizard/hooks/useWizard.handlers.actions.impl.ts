import {
	canNavigateFromStep,
	shouldValidateStep,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.validation';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { useCallback } from 'react';

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
