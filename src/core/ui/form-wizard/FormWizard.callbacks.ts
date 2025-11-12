import type { FieldValues } from 'react-hook-form';

/**
 * Build callbacks object from config, only including defined callbacks
 */
export function buildCallbacks<T extends FieldValues>(config: {
	onStepChange?: (stepIndex: number) => void;
	onComplete?: (data: T) => void | Promise<void>;
	onCancel?: () => void;
}): {
	onStepChange?: (stepIndex: number) => void;
	onComplete?: (data: T) => void | Promise<void>;
	onCancel?: () => void;
} {
	const callbacks: {
		onStepChange?: (stepIndex: number) => void;
		onComplete?: (data: T) => void | Promise<void>;
		onCancel?: () => void;
	} = {};
	if (config.onStepChange !== undefined) {
		callbacks.onStepChange = config.onStepChange;
	}
	if (config.onComplete !== undefined) {
		callbacks.onComplete = config.onComplete;
	}
	if (config.onCancel !== undefined) {
		callbacks.onCancel = config.onCancel;
	}
	return callbacks;
}
