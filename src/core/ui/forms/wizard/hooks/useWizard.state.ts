import { useStepState } from '@core/ui/forms/wizard/hooks/useWizard.state.step';
import {
	useStepHelpers,
	useStepTracking,
} from '@core/ui/forms/wizard/hooks/useWizard.state.tracking';
import {
	useResetHandler,
	useWizardProgress,
	useWizardStateMemo,
} from '@core/ui/forms/wizard/hooks/useWizard.state.utils';
import { useValidationState } from '@core/ui/forms/wizard/hooks/useWizard.state.validation';
import type {
	StepValidationState,
	UseWizardStateOptions,
	UseWizardStateReturn,
} from '@core/ui/forms/wizard/types/useWizard.state.types';
import { useState } from 'react';

interface WizardStateHooks {
	activeStep: number;
	setCurrentStep: (step: number) => void;
	completedSteps: Set<number>;
	skippedSteps: Set<number>;
	markStepCompleted: (stepIndex: number) => void;
	markStepSkipped: (stepIndex: number) => void;
	setCompletedSteps: (value: Set<number>) => void;
	setSkippedSteps: (value: Set<number>) => void;
	validationState: Map<number, StepValidationState>;
	setStepValidation: (stepIndex: number, validation: StepValidationState) => void;
	isStepValid: (stepIndex: number) => boolean;
	setValidationState: (value: Map<number, StepValidationState>) => void;
	isProcessing: boolean;
	setIsProcessing: (value: boolean) => void;
	isStepCompleted: (stepIndex: number) => boolean;
	isStepSkipped: (stepIndex: number) => boolean;
}

function useWizardStateHooks(
	initialStep: number,
	controlledStep: number | undefined
): WizardStateHooks {
	const { activeStep, setCurrentStep } = useStepState(initialStep, controlledStep);
	const stepTracking = useStepTracking();
	const {
		completedSteps,
		skippedSteps,
		markStepCompleted,
		markStepSkipped,
		setCompletedSteps,
		setSkippedSteps,
	} = stepTracking;
	const validation = useValidationState();
	const { validationState, setStepValidation, isStepValid, setValidationState } = validation;
	const [isProcessing, setIsProcessing] = useState(false);
	const { isStepCompleted, isStepSkipped } = useStepHelpers(completedSteps, skippedSteps);

	return {
		activeStep,
		setCurrentStep,
		completedSteps,
		skippedSteps,
		markStepCompleted,
		markStepSkipped,
		setCompletedSteps,
		setSkippedSteps,
		validationState,
		setStepValidation,
		isStepValid,
		setValidationState,
		isProcessing,
		setIsProcessing,
		isStepCompleted,
		isStepSkipped,
	};
}

function useWizardStateComposition(
	hooks: WizardStateHooks,
	options: UseWizardStateOptions
): UseWizardStateReturn {
	const reset = useResetHandler({
		initialStep: options.initialStep,
		controlledStep: options.controlledStep,
		setCurrentStep: hooks.setCurrentStep,
		setCompletedSteps: hooks.setCompletedSteps,
		setSkippedSteps: hooks.setSkippedSteps,
		setValidationState: hooks.setValidationState,
		setIsProcessing: hooks.setIsProcessing,
	});
	const progress = useWizardProgress(options.totalSteps, hooks.completedSteps, hooks.skippedSteps);
	const state = useWizardStateMemo({
		activeStep: hooks.activeStep,
		completedSteps: hooks.completedSteps,
		skippedSteps: hooks.skippedSteps,
		validationState: hooks.validationState,
		isProcessing: hooks.isProcessing,
	});

	return {
		state,
		setCurrentStep: hooks.setCurrentStep,
		markStepCompleted: hooks.markStepCompleted,
		markStepSkipped: hooks.markStepSkipped,
		setStepValidation: hooks.setStepValidation,
		setIsProcessing: hooks.setIsProcessing,
		reset,
		progress,
		isStepCompleted: hooks.isStepCompleted,
		isStepSkipped: hooks.isStepSkipped,
		isStepValid: hooks.isStepValid,
	};
}

/**
 * Hook to manage wizard state
 */
export function useWizardState({
	initialStep,
	totalSteps,
	controlledStep,
}: UseWizardStateOptions): UseWizardStateReturn {
	const hooks = useWizardStateHooks(initialStep, controlledStep);
	return useWizardStateComposition(hooks, {
		initialStep,
		totalSteps,
		...(controlledStep !== undefined && { controlledStep }),
	});
}
