import i18n from '@core/i18n/i18n';
import type { WizardNavigationProps } from '@core/ui/forms/wizard/components/WizardNavigation.types';
import { convertStepsToStepperSteps } from '@core/ui/forms/wizard/helpers/wizardUtils';
import type { useWizard } from '@core/ui/forms/wizard/hooks/useWizard';
import type { StandardSize } from '@src-types/ui/base';
import type { WizardProps } from '@src-types/ui/navigation/wizard';
import { type ReactNode, useMemo } from 'react';

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

const getDefaultWizardConfig = (): Omit<WizardConfig, 'steps' | 'className'> => {
	const t = (key: string) => i18n.t(key, { ns: 'common' });
	return {
		orientation: 'horizontal',
		size: 'md',
		showNumbers: true,
		showNavigation: true,
		nextButtonLabel: t('wizard.next'),
		previousButtonLabel: t('wizard.previous'),
		finishButtonLabel: t('wizard.finish'),
		showProgress: true,
		allowBackNavigation: true,
	};
};

export function extractWizardConfig(props: Readonly<WizardProps>): WizardConfig {
	return {
		...getDefaultWizardConfig(),
		...props,
		steps: props.steps,
		className: props.className,
	};
}
