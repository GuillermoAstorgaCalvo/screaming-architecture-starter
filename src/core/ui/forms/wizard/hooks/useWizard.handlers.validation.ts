import i18n from '@core/i18n/i18n';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';

/**
 * Validation result for a wizard step
 */
export interface StepValidationResult {
	isValid: boolean;
	error?: string | undefined;
}

/**
 * Validate a step using its validator function
 */
export async function validateStep(
	step: WizardStepConfig,
	formData?: Record<string, unknown>
): Promise<StepValidationResult> {
	if (!step.validate) {
		return { isValid: true };
	}

	try {
		const data = formData ?? {};
		const result = await step.validate(data);
		return {
			isValid: result,
			error: result ? undefined : i18n.t('wizard.validationFailed', { ns: 'common' }),
		};
	} catch (error) {
		return {
			isValid: false,
			error:
				error instanceof Error ? error.message : i18n.t('wizard.validationError', { ns: 'common' }),
		};
	}
}

/**
 * Check if a step should be validated before navigation
 */
export function shouldValidateStep(step: WizardStepConfig | undefined): boolean {
	return step?.validateOnChange !== false;
}

/**
 * Check if navigation is allowed from a step after validation
 */
export function canNavigateFromStep(isValid: boolean, step: WizardStepConfig | undefined): boolean {
	return isValid || step?.optional === true;
}

/**
 * Mark a step as completed if it's valid and not optional
 */
export function markStepAsCompletedIfValid(
	step: WizardStepConfig | undefined,
	stepIndex: number,
	state: UseWizardStateReturn
): void {
	if (step && !step.optional) {
		const isValid = state.isStepValid(stepIndex);
		if (isValid) {
			state.markStepCompleted(stepIndex);
		}
	}
}
