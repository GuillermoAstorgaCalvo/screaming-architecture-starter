import type { FormControls } from '@core/forms/formAdapter';
import { convertStepsToStepperSteps } from '@core/ui/wizard/wizardUtils';
import type { StepperStep } from '@src-types/ui/navigation';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormWizardStep } from './FormWizardTypes';
import { renderStepContent } from './FormWizardView.content';
import type { StepMetadata } from './FormWizardView.helpers';
import { getStepMetadata } from './FormWizardView.metadata';

export interface WizardViewData<T extends FieldValues> {
	readonly stepperSteps: StepperStep[];
	readonly stepMetadata: StepMetadata<T>;
	readonly stepContent: ReactNode;
}

/**
 * Prepare wizard view data
 */
export function prepareWizardViewData<T extends FieldValues>(
	steps: readonly FormWizardStep<T>[],
	activeStep: number,
	formControls: FormControls<T>
): WizardViewData<T> {
	const stepperSteps = convertStepsToStepperSteps(steps);
	const stepMetadata = getStepMetadata(activeStep, steps);
	const stepContent = renderStepContent(stepMetadata.currentStep, formControls);

	return {
		stepperSteps,
		stepMetadata,
		stepContent,
	};
}
