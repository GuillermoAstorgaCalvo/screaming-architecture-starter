import { navigateToStep } from '@core/ui/forms/wizard/hooks/useWizard.handlers.navigation';
import {
	canNavigateFromStep,
	markStepAsCompletedIfValid,
	shouldValidateStep,
} from '@core/ui/forms/wizard/hooks/useWizard.handlers.validation';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { useCallback } from 'react';

/**
 * Parameters for creating next step handler
 */
interface NextStepHandlerParams {
	isLastStep: boolean;
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	validateCurrentStep: () => Promise<boolean>;
	state: UseWizardStateReturn;
	onStepChange?: ((stepIndex: number) => void) | undefined;
}

/**
 * Create next step handler
 */
export function useNextStepHandler({
	isLastStep,
	currentStep,
	currentStepIndex,
	validateCurrentStep,
	state,
	onStepChange,
}: NextStepHandlerParams) {
	return useCallback(async (): Promise<void> => {
		if (isLastStep) {
			return;
		}

		if (shouldValidateStep(currentStep)) {
			const isValid = await validateCurrentStep();
			if (!canNavigateFromStep(isValid, currentStep)) {
				return;
			}
		}

		markStepAsCompletedIfValid(currentStep, currentStepIndex, state);

		const nextStepIndex = currentStepIndex + 1;
		navigateToStep(nextStepIndex, state, onStepChange);
	}, [isLastStep, currentStep, currentStepIndex, validateCurrentStep, state, onStepChange]);
}

/**
 * Parameters for creating previous step handler
 */
interface PreviousStepHandlerParams {
	canGoPrevious: boolean;
	currentStepIndex: number;
	state: UseWizardStateReturn;
	onStepChange?: ((stepIndex: number) => void) | undefined;
}

/**
 * Create previous step handler
 */
export function usePreviousStepHandler({
	canGoPrevious,
	currentStepIndex,
	state,
	onStepChange,
}: PreviousStepHandlerParams) {
	return useCallback((): void => {
		if (!canGoPrevious) {
			return;
		}

		const previousStepIndex = currentStepIndex - 1;
		navigateToStep(previousStepIndex, state, onStepChange);
	}, [canGoPrevious, currentStepIndex, state, onStepChange]);
}

/**
 * Parameters for creating go to step handler
 */
interface GoToStepHandlerParams {
	currentStepIndex: number;
	totalSteps: number;
	currentStep: WizardStepConfig | undefined;
	validateCurrentStep: () => Promise<boolean>;
	allowBackNavigation: boolean;
	state: UseWizardStateReturn;
	onStepChange?: ((stepIndex: number) => void) | undefined;
}

/**
 * Create go to step handler
 */
export function useGoToStepHandler({
	currentStepIndex,
	totalSteps,
	currentStep,
	validateCurrentStep,
	allowBackNavigation,
	state,
	onStepChange,
}: GoToStepHandlerParams) {
	return useCallback(
		async (stepIndex: number): Promise<void> => {
			if (stepIndex < 0 || stepIndex >= totalSteps) {
				return;
			}

			if (stepIndex > currentStepIndex && shouldValidateStep(currentStep)) {
				const isValid = await validateCurrentStep();
				if (!canNavigateFromStep(isValid, currentStep)) {
					return;
				}
			}

			if (stepIndex < currentStepIndex && !allowBackNavigation) {
				return;
			}

			navigateToStep(stepIndex, state, onStepChange);
		},
		[
			currentStepIndex,
			totalSteps,
			currentStep,
			validateCurrentStep,
			allowBackNavigation,
			state,
			onStepChange,
		]
	);
}

/**
 * Parameters for creating skip step handler
 */
interface SkipStepHandlerParams {
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	isLastStep: boolean;
	state: UseWizardStateReturn;
	onStepChange?: ((stepIndex: number) => void) | undefined;
	handleComplete: () => Promise<void>;
}

/**
 * Create skip step handler
 */
export function useSkipStepHandler({
	currentStep,
	currentStepIndex,
	isLastStep,
	state,
	onStepChange,
	handleComplete,
}: SkipStepHandlerParams) {
	return useCallback(async (): Promise<void> => {
		if (!currentStep?.skippable) {
			return;
		}

		state.markStepSkipped(currentStepIndex);

		if (isLastStep) {
			await handleComplete();
		} else {
			const nextStepIndex = currentStepIndex + 1;
			navigateToStep(nextStepIndex, state, onStepChange);
		}
	}, [currentStep, currentStepIndex, isLastStep, state, onStepChange, handleComplete]);
}
