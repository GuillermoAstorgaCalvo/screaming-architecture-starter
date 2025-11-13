import { useWizardHandlers } from '@core/ui/forms/wizard/hooks/useWizard.handlers';
import { extractWizardProps } from '@core/ui/forms/wizard/hooks/useWizard.props';
import { useWizardState } from '@core/ui/forms/wizard/hooks/useWizard.state';
import type { UseWizardHandlersReturn } from '@core/ui/forms/wizard/types/useWizard.handlers.types';
import type { UseWizardStateReturn } from '@core/ui/forms/wizard/types/useWizard.state.types';
import type { WizardProps } from '@src-types/ui/navigation/wizard';

/**
 * Return type for useWizard hook
 */
export interface UseWizardReturn extends UseWizardStateReturn, UseWizardHandlersReturn {
	/** Current step configuration */
	currentStep: WizardProps['steps'][number] | undefined;
	/** Total number of steps */
	totalSteps: number;
	/** Step status for stepper component */
	getStepStatus: (stepIndex: number) => 'pending' | 'active' | 'completed' | 'error';
}

/**
 * Hook to manage wizard state and navigation
 *
 * @param props - Wizard component props
 * @returns Wizard state, handlers, and utilities
 */
function getStepStatus(
	stepIndex: number,
	currentStepIndex: number,
	state: ReturnType<typeof useWizardState>
): 'pending' | 'active' | 'completed' | 'error' {
	if (stepIndex < currentStepIndex) {
		// Check if step was skipped or completed
		if (state.isStepSkipped(stepIndex)) {
			return 'completed'; // Show skipped steps as completed
		}
		return state.isStepCompleted(stepIndex) ? 'completed' : 'pending';
	}

	if (stepIndex === currentStepIndex) {
		// Check validation state for current step
		const validation = state.state.validationState.get(stepIndex);
		if (validation?.isValidated && !validation.isValid) {
			return 'error';
		}
		return 'active';
	}

	return 'pending';
}

export function useWizard(props: Readonly<WizardProps>): UseWizardReturn {
	const extractedProps = extractWizardProps(props);
	const {
		steps,
		initialStep,
		controlledStep,
		formData,
		allowBackNavigation,
		onStepChange,
		onComplete,
		onCancel,
	} = extractedProps;

	const totalSteps = steps.length;

	// Initialize wizard state
	const state = useWizardState({
		initialStep,
		totalSteps,
		...(controlledStep !== undefined && { controlledStep }),
	});

	// Initialize handlers
	const handlers = useWizardHandlers({
		state,
		steps,
		...(formData !== undefined && { formData }),
		...(onStepChange !== undefined && { onStepChange }),
		...(onComplete !== undefined && { onComplete }),
		...(onCancel !== undefined && { onCancel }),
		allowBackNavigation,
	});

	const currentStepIndex = state.state.currentStep;
	const currentStep = steps[currentStepIndex];

	const getStepStatusForIndex = (stepIndex: number) =>
		getStepStatus(stepIndex, currentStepIndex, state);

	return {
		...state,
		...handlers,
		currentStep,
		totalSteps,
		getStepStatus: getStepStatusForIndex,
	};
}
