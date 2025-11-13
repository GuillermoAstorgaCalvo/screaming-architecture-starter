import type { WizardStepConfig } from '@src-types/ui/navigation/wizard';

import type { UseWizardStateReturn } from './useWizard.state.types';

/**
 * Parameters for creating validation handlers
 */
export interface ValidationHandlersParams {
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	formData?: Record<string, unknown> | undefined;
	totalSteps: number;
	steps: readonly WizardStepConfig[];
	state: UseWizardStateReturn;
}

/**
 * Parameters for creating action handlers
 */
export interface ActionHandlersParams {
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	validateCurrentStep: () => Promise<boolean>;
	markRemainingStepsAsSkipped: () => void;
	state: UseWizardStateReturn;
	onComplete?: (() => void | Promise<void>) | undefined;
	onCancel?: (() => void) | undefined;
}

/**
 * Parameters for creating basic navigation handlers
 */
export interface BasicNavigationHandlersParams {
	isLastStep: boolean;
	canGoPrevious: boolean;
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	validateCurrentStep: () => Promise<boolean>;
	state: UseWizardStateReturn;
	onStepChange?: ((stepIndex: number) => void) | undefined;
}

/**
 * Parameters for creating advanced navigation handlers
 */
export interface AdvancedNavigationHandlersParams {
	isLastStep: boolean;
	currentStep: WizardStepConfig | undefined;
	currentStepIndex: number;
	totalSteps: number;
	validateCurrentStep: () => Promise<boolean>;
	allowBackNavigation: boolean;
	state: UseWizardStateReturn;
	onStepChange?: ((stepIndex: number) => void) | undefined;
	handleComplete: () => Promise<void>;
}

/**
 * Parameters for creating all wizard handlers
 */
export interface AllWizardHandlersParams {
	state: UseWizardStateReturn;
	steps: readonly WizardStepConfig[];
	formData?: Record<string, unknown> | undefined;
	onStepChange?: ((stepIndex: number) => void) | undefined;
	onComplete?: (() => void | Promise<void>) | undefined;
	onCancel?: (() => void) | undefined;
	allowBackNavigation: boolean;
	currentStepIndex: number;
	currentStep: WizardStepConfig | undefined;
	totalSteps: number;
	isLastStep: boolean;
	canGoPrevious: boolean;
}

/**
 * Return type for validation handlers
 */
export interface ValidationHandlersReturn {
	validateCurrentStep: () => Promise<boolean>;
	markRemainingStepsAsSkipped: () => void;
}

/**
 * Return type for action handlers
 */
export interface ActionHandlersReturn {
	handleComplete: () => Promise<void>;
	handleCancel: () => void;
}

/**
 * Return type for basic navigation handlers
 */
export interface BasicNavigationHandlersReturn {
	handleNext: () => Promise<void>;
	handlePrevious: () => void;
}

/**
 * Return type for advanced navigation handlers
 */
export interface AdvancedNavigationHandlersReturn {
	goToStep: (stepIndex: number) => Promise<void>;
	skipStep: () => Promise<void>;
}

/**
 * Parameters for combining all handlers
 */
export interface CombineHandlersParams {
	validation: ValidationHandlersReturn;
	actions: ActionHandlersReturn;
	basicNav: BasicNavigationHandlersReturn;
	advancedNav: AdvancedNavigationHandlersReturn;
}
