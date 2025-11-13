import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';

import type { UseWizardStateReturn } from './useWizard.state.types';

/**
 * Computed values for wizard handlers
 */
export interface WizardHandlerComputedValues {
	currentStepIndex: number;
	currentStep: WizardStepConfig | undefined;
	totalSteps: number;
	isLastStep: boolean;
	isFirstStep: boolean;
	canGoPrevious: boolean;
	canGoNext: boolean;
}

/**
 * Compute wizard handler values from state and options
 */
export function computeWizardHandlerValues(
	state: UseWizardStateReturn,
	steps: readonly WizardStepConfig[],
	allowBackNavigation: boolean
): WizardHandlerComputedValues {
	const currentStepIndex = state.state.currentStep;
	const currentStep = steps[currentStepIndex];
	const totalSteps = steps.length;

	const isLastStep = currentStepIndex === totalSteps - 1;
	const isFirstStep = currentStepIndex === 0;

	const canGoPrevious = allowBackNavigation && !isFirstStep;
	const canGoNext = !isLastStep;

	return {
		currentStepIndex,
		currentStep,
		totalSteps,
		isLastStep,
		isFirstStep,
		canGoPrevious,
		canGoNext,
	};
}
