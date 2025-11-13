import {
	useCancelHandler,
	useCompletionHandler,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.actions.impl';
import type { ActionHandlersParams } from '@core/ui/forms/wizard/types/useWizard.handlers.groups.types';

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
