import { calculateStepMetadata } from '@core/ui/wizard/wizardUtils';
import type { FieldValues } from 'react-hook-form';

import type { FormWizardStep } from './FormWizardTypes';
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
