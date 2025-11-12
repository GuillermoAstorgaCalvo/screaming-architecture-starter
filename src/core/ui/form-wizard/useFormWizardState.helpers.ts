import type { Dispatch, SetStateAction } from 'react';
import type { FieldValues } from 'react-hook-form';

/**
 * Load persisted data from localStorage
 */
export function loadPersistedData<T extends FieldValues>(
	persistKey: string
): {
	activeStep?: number;
	formData?: Partial<T>;
	completedSteps?: number[];
} | null {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR runtime safety check
	if (globalThis.window === undefined) {
		return null;
	}

	try {
		const persisted = globalThis.window.localStorage.getItem(persistKey);
		if (!persisted) {
			return null;
		}
		return JSON.parse(persisted) as {
			activeStep?: number;
			formData?: Partial<T>;
			completedSteps?: number[];
		};
	} catch {
		return null;
	}
}

/**
 * Get initial state for form wizard
 */
export function getInitialState<T extends FieldValues>({
	persistData,
	persistKey,
	initialStep,
}: {
	persistData: boolean;
	persistKey: string;
	initialStep: number;
}): {
	activeStep: number;
	completedSteps: Set<number>;
	formData: Partial<T>;
} {
	if (persistData) {
		const persisted = loadPersistedData<T>(persistKey);
		if (persisted) {
			return {
				activeStep: persisted.activeStep ?? initialStep,
				completedSteps: new Set(persisted.completedSteps ?? []),
				formData: persisted.formData ?? {},
			};
		}
	}
	return {
		activeStep: initialStep,
		completedSteps: new Set<number>(),
		formData: {} as Partial<T>,
	};
}

interface FormWizardHandlersParams<T extends FieldValues> {
	setActiveStep: (step: number) => void;
	setCompletedSteps: Dispatch<SetStateAction<Set<number>>>;
	setErrorSteps: Dispatch<SetStateAction<Set<number>>>;
	setFormData: Dispatch<SetStateAction<Partial<T>>>;
	setIsSubmitting: (isSubmitting: boolean) => void;
	stepsLength: number;
	initialStep: number;
	persistData: boolean;
	persistKey: string;
}

function createSetActiveStepHandler(setActiveStep: (step: number) => void, stepsLength: number) {
	return (step: number) => {
		if (step >= 0 && step < stepsLength) {
			setActiveStep(step);
		}
	};
}

function createMarkStepCompletedHandler(
	setCompletedSteps: Dispatch<SetStateAction<Set<number>>>,
	setErrorSteps: Dispatch<SetStateAction<Set<number>>>
) {
	return (stepIndex: number) => {
		setCompletedSteps(prev => new Set([...prev, stepIndex]));
		setErrorSteps(prev => {
			const next = new Set(prev);
			next.delete(stepIndex);
			return next;
		});
	};
}

function createClearStepErrorHandler(setErrorSteps: Dispatch<SetStateAction<Set<number>>>) {
	return (stepIndex: number) => {
		setErrorSteps(prev => {
			const next = new Set(prev);
			next.delete(stepIndex);
			return next;
		});
	};
}

function createResetHandler<T extends FieldValues>({
	setActiveStep,
	setCompletedSteps,
	setErrorSteps,
	setFormData,
	setIsSubmitting,
	initialStep,
	persistData,
	persistKey,
}: FormWizardHandlersParams<T>) {
	return () => {
		setActiveStep(initialStep);
		setCompletedSteps(new Set());
		setErrorSteps(new Set());
		setFormData({} as Partial<T>);
		setIsSubmitting(false);
		if (persistData) {
			clearPersistedData(persistKey);
		}
	};
}

/**
 * Create form wizard action handlers
 */
export function createFormWizardHandlers<T extends FieldValues>(
	params: FormWizardHandlersParams<T>
) {
	const { setActiveStep, setCompletedSteps, setErrorSteps, setFormData, stepsLength } = params;

	return {
		handleSetActiveStep: createSetActiveStepHandler(setActiveStep, stepsLength),
		handleMarkStepCompleted: createMarkStepCompletedHandler(setCompletedSteps, setErrorSteps),
		handleMarkStepError: (stepIndex: number) => {
			setErrorSteps(prev => new Set([...prev, stepIndex]));
		},
		handleClearStepError: createClearStepErrorHandler(setErrorSteps),
		handleUpdateFormData: (data: Partial<T>) => {
			setFormData(prev => ({ ...prev, ...data }));
		},
		handleReset: createResetHandler(params),
	};
}

/**
 * Save data to localStorage
 */
export function savePersistedData<T extends FieldValues>(
	persistKey: string,
	data: {
		activeStep: number;
		formData: Partial<T>;
		completedSteps: number[];
	}
): void {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR runtime safety check
	if (globalThis.window === undefined) {
		return;
	}

	try {
		globalThis.window.localStorage.setItem(persistKey, JSON.stringify(data));
	} catch {
		// Ignore storage errors
	}
}

/**
 * Remove persisted data from localStorage
 */
export function clearPersistedData(persistKey: string): void {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- SSR runtime safety check
	if (globalThis.window === undefined) {
		return;
	}

	try {
		globalThis.window.localStorage.removeItem(persistKey);
	} catch {
		// Ignore storage errors
	}
}
