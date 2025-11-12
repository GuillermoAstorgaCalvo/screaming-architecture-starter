import type { StandardSize } from '@src-types/ui/base';
import type { WizardProps } from '@src-types/ui/navigation';
import { type ReactNode, useMemo } from 'react';

import type { useWizard } from './useWizard';
import type { WizardNavigationProps } from './WizardNavigation';
import { convertStepsToStepperSteps } from './wizardUtils';

interface UseStepperStepsProps {
	steps: ReadonlyArray<{ id: string; label: string; description?: string; content: ReactNode }>;
}

export function useStepperSteps({ steps }: UseStepperStepsProps) {
	return useMemo(() => {
		const stepperSteps = convertStepsToStepperSteps(steps);
		// Add content back since StepperStep doesn't include it, but we need it for WizardBody
		return stepperSteps.map((step, index) => ({
			...step,
			content: steps[index]?.content,
		}));
	}, [steps]);
}

export interface UseWizardStateReturn {
	currentStepIndex: number;
	isProcessing: boolean;
	currentStepContent: ReactNode;
	wizardProgress: number;
	canGoPrevious: boolean;
	isLastStep: boolean;
	canGoNext: boolean;
	goToStep: (stepIndex: number) => Promise<void>;
	handlePrevious: () => void;
	skipStep: () => void | Promise<void>;
	handleComplete: () => void | Promise<void>;
	handleNext: () => void | Promise<void>;
	currentStep?: { skippable?: boolean } | undefined;
}

export function useWizardState(wizard: ReturnType<typeof useWizard>): UseWizardStateReturn {
	const {
		currentStep,
		state,
		progress: wizardProgress,
		canGoPrevious,
		isLastStep,
		canGoNext,
		goToStep,
		handlePrevious,
		skipStep,
		handleComplete,
		handleNext,
	} = wizard;
	const { currentStep: currentStepIndex, isProcessing } = state;
	const currentStepContent = currentStep?.content;

	return {
		currentStepIndex,
		isProcessing,
		currentStepContent,
		wizardProgress,
		canGoPrevious,
		isLastStep,
		canGoNext,
		goToStep,
		handlePrevious,
		skipStep,
		handleComplete,
		handleNext,
		currentStep,
	};
}

export function createNavigationProps(
	wizardState: UseWizardStateReturn,
	navProps: {
		allowBackNavigation: boolean;
		size: StandardSize;
		previousButtonLabel: string;
		nextButtonLabel: string;
		finishButtonLabel: string;
	}
): WizardNavigationProps {
	return {
		allowBackNavigation: navProps.allowBackNavigation,
		canGoPrevious: wizardState.canGoPrevious,
		isLastStep: wizardState.isLastStep,
		canGoNext: wizardState.canGoNext,
		currentStep: wizardState.currentStep,
		isProcessing: wizardState.isProcessing,
		size: navProps.size,
		previousButtonLabel: navProps.previousButtonLabel,
		nextButtonLabel: navProps.nextButtonLabel,
		finishButtonLabel: navProps.finishButtonLabel,
		onPrevious: wizardState.handlePrevious,
		onSkip: wizardState.skipStep,
		onNext: wizardState.handleNext,
		onComplete: wizardState.handleComplete,
	};
}

interface WizardConfig {
	steps: WizardProps['steps'];
	orientation: 'horizontal' | 'vertical';
	size: StandardSize;
	showNumbers: boolean;
	showNavigation: boolean;
	nextButtonLabel: string;
	previousButtonLabel: string;
	finishButtonLabel: string;
	showProgress: boolean;
	allowBackNavigation: boolean;
	className?: string | undefined;
}

export function extractWizardConfig(props: Readonly<WizardProps>): WizardConfig {
	return {
		steps: props.steps,
		orientation: props.orientation ?? 'horizontal',
		size: props.size ?? 'md',
		showNumbers: props.showNumbers ?? true,
		showNavigation: props.showNavigation ?? true,
		nextButtonLabel: props.nextButtonLabel ?? 'Next',
		previousButtonLabel: props.previousButtonLabel ?? 'Previous',
		finishButtonLabel: props.finishButtonLabel ?? 'Finish',
		showProgress: props.showProgress ?? true,
		allowBackNavigation: props.allowBackNavigation ?? true,
		className: props.className,
	};
}
