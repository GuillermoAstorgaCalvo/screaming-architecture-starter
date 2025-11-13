import type { UseWizardStateReturn } from './useWizard.state.types';

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
