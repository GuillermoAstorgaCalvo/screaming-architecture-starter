import type { ValidationHandlersParams } from './useWizard.handlers.groups.types';
import { useStepSkippingHandler, useValidationHandler } from './useWizard.handlers.validation.impl';

/**
 * Hook to create validation-related handlers
 */
export function useValidationHandlers({
	currentStep,
	currentStepIndex,
	formData,
	totalSteps,
	steps,
	state,
}: ValidationHandlersParams) {
	const validateCurrentStep = useValidationHandler({
		currentStep,
		currentStepIndex,
		formData,
		state,
	});

	const markRemainingStepsAsSkipped = useStepSkippingHandler({
		currentStepIndex,
		totalSteps,
		steps,
		state,
	});

	return {
		validateCurrentStep,
		markRemainingStepsAsSkipped,
	};
}
