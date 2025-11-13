import type { FormWizardState } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';

/**
 * Synchronize controlled and internal active step state
 */
export function useActiveStepSync(
	controlledActiveStep: number | undefined,
	internalActiveStep: number
): number {
	return useMemo(() => {
		return controlledActiveStep ?? internalActiveStep;
	}, [controlledActiveStep, internalActiveStep]);
}

/**
 * Create combined wizard state with synchronized active step
 */
export function useWizardStateWithSync<T extends FieldValues>(
	state: FormWizardState<T>,
	currentActiveStep: number
): FormWizardState<T> {
	return useMemo(() => {
		return { ...state, activeStep: currentActiveStep };
	}, [state, currentActiveStep]);
}

/**
 * Synchronize wizard state with controlled active step
 */
export function useWizardStateSync<T extends FieldValues>(
	stateManagement: {
		state: FormWizardState<T>;
	},
	controlledActiveStep: number | undefined
): FormWizardState<T> {
	const currentActiveStep = useActiveStepSync(
		controlledActiveStep,
		stateManagement.state.activeStep
	);
	return useWizardStateWithSync(stateManagement.state, currentActiveStep);
}
