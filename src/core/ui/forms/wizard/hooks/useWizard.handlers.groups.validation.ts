import {
	useStepSkippingHandler,
	useValidationHandler,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.validation.impl';
import type { ValidationHandlersParams } from '@core/ui/forms/wizard/types/useWizard.handlers.groups.types';

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
