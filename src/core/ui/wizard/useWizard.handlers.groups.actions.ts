import { useCancelHandler, useCompletionHandler } from './useWizard.handlers.actions.impl';
import type { ActionHandlersParams } from './useWizard.handlers.groups.types';

/**
 * Hook to create action handlers (complete, cancel)
 */
export function useActionHandlers({
	currentStep,
	currentStepIndex,
	validateCurrentStep,
	markRemainingStepsAsSkipped,
	state,
	onComplete,
	onCancel,
}: ActionHandlersParams) {
	const handleComplete = useCompletionHandler({
		currentStep,
		currentStepIndex,
		validateCurrentStep,
		markRemainingStepsAsSkipped,
		state,
		onComplete,
	});

	const handleCancel = useCancelHandler(onCancel);

	return {
		handleComplete,
		handleCancel,
	};
}
