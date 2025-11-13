import { useEffect, useMemo, useState } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormWizardState } from './FormWizardTypes';
import {
	createFormWizardHandlers,
	getInitialState,
	savePersistedData,
} from './useFormWizardState.helpers';

/**
 * Hook to manage form wizard state values and persistence
 */
function useFormWizardStateValues<T extends FieldValues>({
	persistData,
	persistKey,
	initialStep,
}: {
	persistData: boolean;
	persistKey: string;
	initialStep: number;
}) {
	const initialState = getInitialState<T>({ persistData, persistKey, initialStep });
	const [activeStep, setActiveStep] = useState(initialState.activeStep);
	const [completedSteps, setCompletedSteps] = useState(initialState.completedSteps);
	const [errorSteps, setErrorSteps] = useState(new Set<number>());
	const [formData, setFormData] = useState<Partial<T>>(initialState.formData);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (persistData) {
			savePersistedData(persistKey, {
				activeStep,
				formData,
				completedSteps: Array.from(completedSteps),
			});
		}
	}, [activeStep, formData, completedSteps, persistData, persistKey]);

	return {
		activeStep,
		setActiveStep,
		completedSteps,
		setCompletedSteps,
		errorSteps,
		setErrorSteps,
		formData,
		setFormData,
		isSubmitting,
		setIsSubmitting,
	};
}

interface UseFormWizardHandlersParams<T extends FieldValues> {
	stateValues: ReturnType<typeof useFormWizardStateValues<T>>;
	stepsLength: number;
	initialStep: number;
	persistData: boolean;
	persistKey: string;
}

/**
 * Hook to create form wizard handlers
 */
function useFormWizardHandlers<T extends FieldValues>({
	stateValues,
	stepsLength,
	initialStep,
	persistData,
	persistKey,
}: UseFormWizardHandlersParams<T>) {
	const { setActiveStep, setCompletedSteps, setErrorSteps, setFormData, setIsSubmitting } =
		stateValues;

	return useMemo(
		() =>
			createFormWizardHandlers({
				setActiveStep,
				setCompletedSteps,
				setErrorSteps,
				setFormData,
				setIsSubmitting,
				stepsLength,
				initialStep,
				persistData,
				persistKey,
			}),
		[
			stepsLength,
			initialStep,
			persistData,
			persistKey,
			setActiveStep,
			setCompletedSteps,
			setErrorSteps,
			setFormData,
			setIsSubmitting,
		]
	);
}

/**
 * Hook to combine form wizard state values
 */
function useFormWizardStateCombined<T extends FieldValues>({
	stateValues,
}: {
	stateValues: ReturnType<typeof useFormWizardStateValues<T>>;
}) {
	const { activeStep, completedSteps, errorSteps, formData, isSubmitting } = stateValues;

	return useMemo(() => {
		return {
			activeStep,
			completedSteps,
			errorSteps,
			formData,
			isSubmitting,
		};
	}, [activeStep, completedSteps, errorSteps, formData, isSubmitting]);
}

/**
 * Hook to manage form wizard state
 */
export function useFormWizardState<T extends FieldValues = FieldValues>({
	initialStep = 0,
	persistData = false,
	persistKey = 'form-wizard-data',
	steps,
}: {
	readonly initialStep?: number;
	readonly persistData?: boolean;
	readonly persistKey?: string;
	readonly steps: readonly unknown[];
}): {
	readonly state: FormWizardState<T>;
	readonly setActiveStep: (step: number) => void;
	readonly markStepCompleted: (stepIndex: number) => void;
	readonly markStepError: (stepIndex: number) => void;
	readonly clearStepError: (stepIndex: number) => void;
	readonly updateFormData: (data: Partial<T>) => void;
	readonly setIsSubmitting: (isSubmitting: boolean) => void;
	readonly reset: () => void;
} {
	const stateValues = useFormWizardStateValues<T>({ persistData, persistKey, initialStep });
	const handlers = useFormWizardHandlers({
		stateValues,
		stepsLength: steps.length,
		initialStep,
		persistData,
		persistKey,
	});
	const state = useFormWizardStateCombined({ stateValues });

	return {
		state,
		setActiveStep: handlers.handleSetActiveStep,
		markStepCompleted: handlers.handleMarkStepCompleted,
		markStepError: handlers.handleMarkStepError,
		clearStepError: handlers.handleClearStepError,
		updateFormData: handlers.handleUpdateFormData,
		setIsSubmitting: stateValues.setIsSubmitting,
		reset: handlers.handleReset,
	};
}
