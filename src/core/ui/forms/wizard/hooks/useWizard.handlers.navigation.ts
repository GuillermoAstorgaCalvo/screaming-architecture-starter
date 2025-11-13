import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';

/**
 * Navigate to a step and trigger the step change callback
 */
export function navigateToStep(
	stepIndex: number,
	state: UseWizardStateReturn,
	onStepChange?: (stepIndex: number) => void
): void {
	state.setCurrentStep(stepIndex);
	onStepChange?.(stepIndex);
}
