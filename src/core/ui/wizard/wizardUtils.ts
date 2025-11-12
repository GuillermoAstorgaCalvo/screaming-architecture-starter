import type { StepperStep } from '@src-types/ui/navigation';

/**
 * Calculate wizard progress percentage based on active step
 * @param activeStep - Current active step index (0-based)
 * @param totalSteps - Total number of steps
 * @returns Progress percentage (0-100)
 */
export function calculateWizardProgress(activeStep: number, totalSteps: number): number {
	if (totalSteps === 0) {
		return 0;
	}
	return Math.round(((activeStep + 1) / totalSteps) * 100);
}

/**
 * Calculate wizard progress percentage based on completed/skipped steps
 * @param totalSteps - Total number of steps
 * @param completedSteps - Set of completed step indices
 * @param skippedSteps - Set of skipped step indices
 * @returns Progress percentage (0-100)
 */
export function calculateWizardProgressByCompletion(
	totalSteps: number,
	completedSteps: Set<number>,
	skippedSteps: Set<number>
): number {
	if (totalSteps === 0) {
		return 0;
	}
	const completed = completedSteps.size + skippedSteps.size;
	return Math.round((completed / totalSteps) * 100);
}

/**
 * Convert wizard steps to stepper steps format
 * @param steps - Array of steps with id, label, and optional description
 * @returns Array of StepperStep objects
 */
export function convertStepsToStepperSteps<
	T extends { id: string; label: string; description?: string },
>(steps: readonly T[]): StepperStep[] {
	return steps.map(step => ({
		id: step.id,
		label: step.label,
		...(step.description !== undefined && { description: step.description }),
	}));
}

/**
 * Calculate step metadata (position, progress, etc.)
 * @param activeStep - Current active step index (0-based)
 * @param totalSteps - Total number of steps
 * @returns Step metadata object
 */
export function calculateStepMetadata(activeStep: number, totalSteps: number) {
	const isFirstStep = activeStep === 0;
	const isLastStep = activeStep === totalSteps - 1;
	const progress = calculateWizardProgress(activeStep, totalSteps);

	return {
		isFirstStep,
		isLastStep,
		progress,
	};
}

/**
 * Determine if navigation to a step is allowed
 * @param targetStep - Step index to navigate to
 * @param currentStep - Current active step index
 * @param allowBackNavigation - Whether back navigation is allowed
 * @returns True if navigation is allowed
 */
export function canNavigateToStep(
	targetStep: number,
	currentStep: number,
	allowBackNavigation: boolean
): boolean {
	if (targetStep === currentStep) {
		return false;
	}
	if (targetStep < currentStep && !allowBackNavigation) {
		return false;
	}
	return true;
}
