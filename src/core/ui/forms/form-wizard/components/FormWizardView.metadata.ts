import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { calculateStepMetadata } from '@core/ui/forms/wizard/helpers/wizardUtils';
import type { FieldValues } from 'react-hook-form';

import type { StepMetadata } from './FormWizardView.helpers';

/**
 * Calculate step metadata (current step, position, progress)
 */
export function getStepMetadata<T extends FieldValues>(
	activeStep: number,
	steps: readonly FormWizardStep<T>[]
): StepMetadata<T> {
	const currentStep = steps[activeStep];
	const metadata = calculateStepMetadata(activeStep, steps.length);

	return {
		currentStep,
		...metadata,
	};
}
