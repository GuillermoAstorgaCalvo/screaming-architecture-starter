import { useCallback, useState } from 'react';

/**
 * Hook to manage step state (current step navigation)
 */
export function useStepState(initialStep: number, controlledStep?: number) {
	const [currentStepState, setCurrentStepState] = useState(initialStep);
	const activeStep = controlledStep ?? currentStepState;

	const setCurrentStep = useCallback(
		(step: number) => {
			if (controlledStep === undefined) {
				setCurrentStepState(step);
			}
		},
		[controlledStep]
	);

	return { activeStep, setCurrentStep };
}
