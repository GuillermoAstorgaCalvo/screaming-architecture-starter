import type { WizardStepConfig } from '@src-types/ui/navigation';

import type { UseWizardStateReturn } from './useWizard.state.types';

/**
 * Options for wizard handlers
 */
export interface UseWizardHandlersOptions {
	/** Wizard state and state setters */
	state: UseWizardStateReturn;
	/** Array of wizard step configurations */
	steps: readonly WizardStepConfig[];
	/** Form data for validation */
	formData?: Record<string, unknown>;
	/** Callback when step changes */
	onStepChange?: (stepIndex: number) => void;
	/** Callback when wizard is completed */
	onComplete?: () => void | Promise<void>;
	/** Callback when wizard is cancelled */
	onCancel?: () => void;
	/** Whether to allow going back to previous steps */
	allowBackNavigation: boolean;
}

/**
 * Return type for useWizardHandlers hook
 */
export interface UseWizardHandlersReturn {
	/** Navigate to next step */
	handleNext: () => Promise<void>;
	/** Navigate to previous step */
	handlePrevious: () => void;
	/** Navigate to specific step */
	goToStep: (stepIndex: number) => Promise<void>;
	/** Skip current step */
	skipStep: () => Promise<void>;
	/** Complete the wizard */
	handleComplete: () => Promise<void>;
	/** Cancel the wizard */
	handleCancel: () => void;
	/** Validate current step */
	validateCurrentStep: () => Promise<boolean>;
	/** Check if can go to next step */
	canGoNext: boolean;
	/** Check if can go to previous step */
	canGoPrevious: boolean;
	/** Check if current step is the last step */
	isLastStep: boolean;
	/** Check if current step is the first step */
	isFirstStep: boolean;
}
