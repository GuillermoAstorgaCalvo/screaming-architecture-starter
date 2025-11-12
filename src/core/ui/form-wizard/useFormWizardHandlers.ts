import type { FormControls } from '@core/forms/formAdapter';
import { canNavigateToStep } from '@core/ui/wizard/wizardUtils';
import { useCallback } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormWizardProps, FormWizardState } from './FormWizardTypes';
import { runCustomValidation, validateStepFields } from './useFormWizardHandlers.helpers';

interface HandlerDependencies<T extends FieldValues> {
	readonly state: FormWizardState<T>;
	readonly steps: FormWizardProps<T>['steps'];
	readonly formControls: FormControls<T>;
	readonly setActiveStep: (step: number) => void;
	readonly markStepCompleted: (stepIndex: number) => void;
	readonly markStepError: (stepIndex: number) => void;
	readonly clearStepError: (stepIndex: number) => void;
	readonly updateFormData: (data: Partial<T>) => void;
	readonly setIsSubmitting: (isSubmitting: boolean) => void;
	readonly onStepChange?: (stepIndex: number) => void;
	readonly onComplete?: (data: T) => void | Promise<void>;
	readonly onCancel?: () => void;
	readonly validateOnStepChange?: boolean;
	readonly allowBackNavigation?: boolean;
}

/**
 * Hook to manage form wizard handlers
 * Separated into smaller handler functions for better maintainability
 */
// eslint-disable-next-line max-lines-per-function
export function useFormWizardHandlers<T extends FieldValues = FieldValues>(
	deps: HandlerDependencies<T>
): {
	readonly handleNext: () => Promise<void>;
	readonly handlePrevious: () => void;
	readonly handleStepClick: (stepIndex: number) => void;
	readonly handleComplete: () => Promise<void>;
	readonly handleCancel: () => void;
	readonly validateCurrentStep: () => Promise<boolean>;
} {
	const validateCurrentStep = useCallback(async (): Promise<boolean> => {
		const currentStep = deps.steps[deps.state.activeStep];
		if (!currentStep) {
			return false;
		}

		deps.clearStepError(deps.state.activeStep);

		const validationContext = {
			stepIndex: deps.state.activeStep,
			markStepError: deps.markStepError,
		};
		const fieldsValid = await validateStepFields(deps.formControls, currentStep, validationContext);
		if (!fieldsValid) {
			return false;
		}

		const formData = deps.formControls.getValues();
		const customValid = await runCustomValidation(currentStep, formData, validationContext);
		if (!customValid) {
			return false;
		}

		if (deps.formControls.isValid || currentStep.optional) {
			deps.markStepCompleted(deps.state.activeStep);
		}

		return true;
	}, [deps]);

	const handleNext = useCallback(async () => {
		if (deps.state.activeStep >= deps.steps.length - 1) {
			return;
		}

		if (deps.validateOnStepChange) {
			const isValid = await validateCurrentStep();
			if (!isValid) {
				return;
			}
		} else {
			deps.markStepCompleted(deps.state.activeStep);
		}

		const currentData = deps.formControls.getValues();
		deps.updateFormData(currentData);

		const nextStep = deps.state.activeStep + 1;
		deps.setActiveStep(nextStep);
		deps.onStepChange?.(nextStep);
	}, [deps, validateCurrentStep]);

	const handlePrevious = useCallback(() => {
		if (deps.state.activeStep <= 0 || !deps.allowBackNavigation) {
			return;
		}

		const currentData = deps.formControls.getValues();
		deps.updateFormData(currentData);

		const previousStep = deps.state.activeStep - 1;
		deps.setActiveStep(previousStep);
		deps.onStepChange?.(previousStep);
	}, [deps]);

	const handleStepClick = useCallback(
		(stepIndex: number) => {
			if (!canNavigateToStep(stepIndex, deps.state.activeStep, deps.allowBackNavigation ?? true)) {
				return;
			}

			const currentData = deps.formControls.getValues();
			deps.updateFormData(currentData);

			deps.setActiveStep(stepIndex);
			deps.onStepChange?.(stepIndex);
		},
		[deps]
	);

	const handleComplete = useCallback(async () => {
		const isValid = await validateCurrentStep();
		if (!isValid) {
			return;
		}

		const allData = deps.formControls.getValues();
		deps.updateFormData(allData);

		deps.setIsSubmitting(true);
		try {
			await deps.onComplete?.(allData);
		} finally {
			deps.setIsSubmitting(false);
		}
	}, [deps, validateCurrentStep]);

	const handleCancel = useCallback(() => {
		deps.onCancel?.();
	}, [deps]);

	return {
		handleNext,
		handlePrevious,
		handleStepClick,
		handleComplete,
		handleCancel,
		validateCurrentStep,
	};
}
