import { combineAllHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers.combine';
import type { WizardHandlerComputedValues } from '@core/ui/forms/wizard/hooks/useWizard.handlers.computed';
import { useActionHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers.groups.actions';
import {
	useAdvancedNavigationHandlers,
	useBasicNavigationHandlers,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.groups.navigation';
import { useValidationHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers.groups.validation';
import type {
	ActionHandlersReturn,
	AllWizardHandlersParams,
	ValidationHandlersReturn,
} from '@core/ui/forms/wizard/types/useWizard.handlers.groups.types';
import type { UseWizardHandlersOptions } from '@core/ui/forms/wizard/types/useWizard.handlers.types';

/**
 * Hook to create validation handlers with computed parameters
 */
function useValidationHandlersGroup(params: AllWizardHandlersParams) {
	const { currentStep, currentStepIndex, formData, totalSteps, steps, state } = params;
	return useValidationHandlers({
		currentStep,
		currentStepIndex,
		formData,
		totalSteps,
		steps,
		state,
	});
}

/**
 * Hook to create action handlers with computed parameters
 */
function useActionHandlersGroup(
	params: AllWizardHandlersParams,
	validation: ValidationHandlersReturn
): ActionHandlersReturn {
	const { currentStep, currentStepIndex, state, onComplete, onCancel } = params;
	return useActionHandlers({
		currentStep,
		currentStepIndex,
		validateCurrentStep: validation.validateCurrentStep,
		markRemainingStepsAsSkipped: validation.markRemainingStepsAsSkipped,
		state,
		onComplete,
		onCancel,
	});
}

/**
 * Hook to create basic navigation handlers with computed parameters
 */
function useBasicNavigationHandlersGroup(
	params: AllWizardHandlersParams,
	validation: ValidationHandlersReturn
) {
	const { isLastStep, canGoPrevious, currentStep, currentStepIndex, state, onStepChange } = params;
	return useBasicNavigationHandlers({
		isLastStep,
		canGoPrevious,
		currentStep,
		currentStepIndex,
		validateCurrentStep: validation.validateCurrentStep,
		state,
		onStepChange,
	});
}

/**
 * Hook to create advanced navigation handlers with computed parameters
 */
function useAdvancedNavigationHandlersGroup(
	params: AllWizardHandlersParams,
	validation: ValidationHandlersReturn,
	actions: ActionHandlersReturn
) {
	const {
		isLastStep,
		currentStep,
		currentStepIndex,
		totalSteps,
		allowBackNavigation,
		state,
		onStepChange,
	} = params;
	return useAdvancedNavigationHandlers({
		isLastStep,
		currentStep,
		currentStepIndex,
		totalSteps,
		validateCurrentStep: validation.validateCurrentStep,
		allowBackNavigation,
		state,
		onStepChange,
		handleComplete: actions.handleComplete,
	});
}

/**
 * Hook to create all wizard handlers in sequence
 */
function useAllWizardHandlers(params: AllWizardHandlersParams) {
	const validation = useValidationHandlersGroup(params);
	const actions = useActionHandlersGroup(params, validation);
	const basicNav = useBasicNavigationHandlersGroup(params, validation);
	const advancedNav = useAdvancedNavigationHandlersGroup(params, validation, actions);

	return combineAllHandlers({
		validation,
		actions,
		basicNav,
		advancedNav,
	});
}

/**
 * Hook to create all wizard handlers
 */
export function useWizardHandlersCreation(
	options: UseWizardHandlersOptions,
	computed: WizardHandlerComputedValues
) {
	const { state, steps, formData, onStepChange, onComplete, onCancel, allowBackNavigation } =
		options;
	const {
		currentStepIndex,
		currentStep,
		totalSteps,
		isLastStep,
		isFirstStep,
		canGoPrevious,
		canGoNext,
	} = computed;

	const handlers = useAllWizardHandlers({
		state,
		steps,
		formData,
		onStepChange,
		onComplete,
		onCancel,
		allowBackNavigation,
		currentStepIndex,
		currentStep,
		totalSteps,
		isLastStep,
		canGoPrevious,
	});

	return {
		...handlers,
		canGoNext,
		canGoPrevious,
		isLastStep,
		isFirstStep,
	};
}
