import {
	useGoToStepHandler,
	useNextStepHandler,
	usePreviousStepHandler,
	useSkipStepHandler,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.navigation.impl';
import type {
	AdvancedNavigationHandlersParams,
	BasicNavigationHandlersParams,
} from '@core/ui/forms/wizard/types/useWizard.handlers.groups.types';

/**
 * Hook to create basic navigation handlers (next, previous)
 */
export function useBasicNavigationHandlers({
	isLastStep,
	canGoPrevious,
	currentStep,
	currentStepIndex,
	validateCurrentStep,
	state,
	onStepChange,
}: BasicNavigationHandlersParams) {
	const handleNext = useNextStepHandler({
		isLastStep,
		currentStep,
		currentStepIndex,
		validateCurrentStep,
		state,
		onStepChange,
	});

	const handlePrevious = usePreviousStepHandler({
		canGoPrevious,
		currentStepIndex,
		state,
		onStepChange,
	});

	return {
		handleNext,
		handlePrevious,
	};
}

/**
 * Hook to create advanced navigation handlers (goTo, skip)
 */
export function useAdvancedNavigationHandlers({
	isLastStep,
	currentStep,
	currentStepIndex,
	totalSteps,
	validateCurrentStep,
	allowBackNavigation,
	state,
	onStepChange,
	handleComplete,
}: AdvancedNavigationHandlersParams) {
	const goToStep = useGoToStepHandler({
		currentStepIndex,
		totalSteps,
		currentStep,
		validateCurrentStep,
		allowBackNavigation,
		state,
		onStepChange,
	});

	const skipStep = useSkipStepHandler({
		currentStep,
		currentStepIndex,
		isLastStep,
		state,
		onStepChange,
		handleComplete,
	});

	return {
		goToStep,
		skipStep,
	};
}
