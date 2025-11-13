import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';
import { useCallback } from 'react';

import { validateStep } from './useWizard.handlers.validation';
import type { UseWizardStateReturn } from './useWizard.state.types';

/**
 * Parameters for creating validation handler
 */
interface ValidationHandlerParams {
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	formData?: Record<string, unknown> | undefined;
	state: UseWizardStateReturn;
}

/**
 * Create validation handler for current step
 */
export function useValidationHandler({
	currentStep,
	currentStepIndex,
	formData,
	state,
}: ValidationHandlerParams) {
	return useCallback(async (): Promise<boolean> => {
		if (!currentStep) {
			return false;
		}

		if (currentStep.optional || currentStep.skippable) {
			return true;
		}

		if (!currentStep.validate) {
			return true;
		}

		const validation = await validateStep(currentStep, formData);
		state.setStepValidation(currentStepIndex, {
			isValidated: true,
			isValid: validation.isValid,
			...(validation.error !== undefined && { error: validation.error }),
		});

		return validation.isValid;
	}, [currentStep, currentStepIndex, formData, state]);
}

/**
 * Parameters for creating step skipping handler
 */
interface StepSkippingParams {
	currentStepIndex: number;
	totalSteps: number;
	steps: readonly WizardStepConfig[];
	state: UseWizardStateReturn;
}

/**
 * Create handler to mark remaining steps as skipped
 */
export function useStepSkippingHandler({
	currentStepIndex,
	totalSteps,
	steps,
	state,
}: StepSkippingParams) {
	return useCallback((): void => {
		for (let i = currentStepIndex + 1; i < totalSteps; i++) {
			if (steps[i]?.optional || steps[i]?.skippable) {
				state.markStepSkipped(i);
			}
		}
	}, [currentStepIndex, totalSteps, steps, state]);
}
