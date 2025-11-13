import type { FormControls } from '@core/forms/formAdapter';
import type { FormWizardStep } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { FieldValues, Path } from 'react-hook-form';

interface ValidationContext {
	readonly stepIndex: number;
	readonly markStepError: (stepIndex: number) => void;
}

/**
 * Validate step fields
 */
export async function validateStepFields<T extends FieldValues>(
	formControls: FormControls<T>,
	step: FormWizardStep<T>,
	context: ValidationContext
): Promise<boolean> {
	// If step has specific fields to validate, validate only those
	if (step.validateFields && step.validateFields.length > 0) {
		const fieldsToValidate = step.validateFields as Path<T>[];
		const isValid = await formControls.trigger(fieldsToValidate);
		if (!isValid) {
			context.markStepError(context.stepIndex);
			return false;
		}
	} else {
		// Validate all fields
		const isValid = await formControls.trigger();
		if (!isValid) {
			context.markStepError(context.stepIndex);
			return false;
		}
	}
	return true;
}

/**
 * Run custom step validation
 */
export async function runCustomValidation<T extends FieldValues>(
	step: FormWizardStep<T>,
	formData: T,
	context: ValidationContext
): Promise<boolean> {
	if (step.validate) {
		const isValid = await step.validate(formData);
		if (!isValid) {
			context.markStepError(context.stepIndex);
			return false;
		}
	}
	return true;
}
