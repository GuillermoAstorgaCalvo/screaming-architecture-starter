import type { StepValidationState } from '@core/ui/forms/wizard/types/useWizard.state.types';
import { useCallback, useState } from 'react';

/**
 * Hook to manage step validation state
 */
export function useValidationState() {
	const [validationState, setValidationState] = useState<Map<number, StepValidationState>>(
		new Map()
	);

	const setStepValidation = useCallback((stepIndex: number, validation: StepValidationState) => {
		setValidationState(prev => {
			const next = new Map(prev);
			next.set(stepIndex, validation);
			return next;
		});
	}, []);

	const isStepValid = useCallback(
		(stepIndex: number) => {
			const validation = validationState.get(stepIndex);
			return validation ? validation.isValid : true;
		},
		[validationState]
	);

	return { validationState, setStepValidation, isStepValid, setValidationState };
}
