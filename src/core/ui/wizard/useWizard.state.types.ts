/**
 * Step validation state
 */
export interface StepValidationState {
	/** Whether the step has been validated */
	isValidated: boolean;
	/** Whether the step is valid */
	isValid: boolean;
	/** Validation error message if any */
	error?: string;
}

/**
 * Wizard state
 */
export interface WizardState {
	/** Current active step index (0-based) */
	currentStep: number;
	/** Set of completed step indices */
	completedSteps: Set<number>;
	/** Set of skipped step indices */
	skippedSteps: Set<number>;
	/** Validation state for each step */
	validationState: Map<number, StepValidationState>;
	/** Whether wizard is in a loading/processing state */
	isProcessing: boolean;
}

/**
 * Options for initializing wizard state
 */
export interface UseWizardStateOptions {
	/** Initial step index */
	initialStep: number;
	/** Total number of steps */
	totalSteps: number;
	/** Controlled current step (if provided) */
	controlledStep?: number;
}

/**
 * Return type for useWizardState hook
 */
export interface UseWizardStateReturn {
	/** Current wizard state */
	state: WizardState;
	/** Set current step */
	setCurrentStep: (step: number) => void;
	/** Mark step as completed */
	markStepCompleted: (stepIndex: number) => void;
	/** Mark step as skipped */
	markStepSkipped: (stepIndex: number) => void;
	/** Update validation state for a step */
	setStepValidation: (stepIndex: number, validation: StepValidationState) => void;
	/** Set processing state */
	setIsProcessing: (processing: boolean) => void;
	/** Reset wizard state */
	reset: () => void;
	/** Calculate progress percentage (0-100) */
	progress: number;
	/** Check if step is completed */
	isStepCompleted: (stepIndex: number) => boolean;
	/** Check if step is skipped */
	isStepSkipped: (stepIndex: number) => boolean;
	/** Check if step is valid */
	isStepValid: (stepIndex: number) => boolean;
}

/**
 * Parameters for reset handler
 */
export interface ResetHandlerParams {
	initialStep: number;
	controlledStep: number | undefined;
	setCurrentStep: (step: number) => void;
	setCompletedSteps: (value: Set<number>) => void;
	setSkippedSteps: (value: Set<number>) => void;
	setValidationState: (value: Map<number, StepValidationState>) => void;
	setIsProcessing: (value: boolean) => void;
}

/**
 * Parameters for wizard state memo
 */
export interface WizardStateMemoParams {
	activeStep: number;
	completedSteps: Set<number>;
	skippedSteps: Set<number>;
	validationState: Map<number, StepValidationState>;
	isProcessing: boolean;
}
