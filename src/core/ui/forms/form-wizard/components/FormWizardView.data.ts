import type { FormControls } from '@core/forms/formAdapter';
import { renderStepContent } from '@core/ui/forms/form-wizard/components/FormWizardView.content';
import type { StepMetadata } from '@core/ui/forms/form-wizard/components/FormWizardView.helpers';
import { getStepMetadata } from '@core/ui/forms/form-wizard/components/FormWizardView.metadata';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { convertStepsToStepperSteps } from '@core/ui/forms/wizard/helpers/wizardUtils';
import type { StepperStep } from '@src-types/ui/navigation/stepper';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

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
