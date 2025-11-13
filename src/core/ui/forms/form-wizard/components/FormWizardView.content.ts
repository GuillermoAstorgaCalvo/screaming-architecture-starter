import type { FormControls } from '@core/forms/formAdapter';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

/**
 * Render step content with form controls
 */
export function renderStepContent<T extends FieldValues>(
	currentStep: FormWizardStep<T> | undefined,
	formControls: FormControls<T>
): ReactNode {
	if (!currentStep) {
		return null;
	}

	return currentStep.content({
		register: formControls.register,
		errors: formControls.errors,
		setValue: formControls.setValue,
		getValues: formControls.getValues,
		watch: formControls.watch,
		trigger: formControls.trigger,
		control: formControls.control,
		isValid: formControls.isValid,
		isDirty: formControls.isDirty,
	});
}
