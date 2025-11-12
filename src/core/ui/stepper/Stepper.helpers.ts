import type { StepperProps, StepperStepStatus } from '@src-types/ui/navigation';

/**
 * Determines the status of a step based on its index and the active step
 *
 * @param stepIndex - The index of the step
 * @param activeStep - The index of the currently active step
 * @returns The status of the step
 */
export function getStepStatus(stepIndex: number, activeStep: number): StepperStepStatus {
	if (stepIndex < activeStep) {
		return 'completed';
	}
	if (stepIndex === activeStep) {
		return 'active';
	}
	return 'pending';
}

/**
 * Gets the CSS classes for a step based on its status
 *
 * @param status - The status of the step
 * @returns The CSS classes string
 */
export function getStepStatusClasses(status: StepperStepStatus): string {
	switch (status) {
		case 'completed': {
			return 'bg-primary text-white border-primary';
		}
		case 'active': {
			return 'bg-primary text-white border-primary ring-2 ring-primary ring-offset-2';
		}
		case 'error': {
			return 'bg-red-500 text-white border-red-500';
		}
		case 'pending':
		default: {
			return 'bg-gray-200 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600';
		}
	}
}

interface StepElementConfig {
	readonly Element: 'button' | 'div';
	readonly isClickable: boolean;
	readonly className: string;
	readonly onClick?: (() => void) | undefined;
	readonly type?: 'button' | undefined;
	readonly ariaCurrent?: 'step' | undefined;
	readonly ariaDisabled?: true | undefined;
}

/**
 * Gets the configuration for a step element (button or div) based on clickability
 *
 * @param config - Configuration object
 * @param config.onClick - Optional click handler
 * @param config.stepIndex - The index of the step
 * @param config.status - The status of the step
 * @param config.orientation - The orientation of the stepper
 * @returns The element configuration
 */
export function getStepElementConfig({
	onClick,
	stepIndex,
	status,
	orientation,
}: {
	readonly onClick?: ((stepIndex: number) => void) | undefined;
	readonly stepIndex: number;
	readonly status: StepperStepStatus;
	readonly orientation: StepperProps['orientation'];
}): StepElementConfig {
	const isClickable = Boolean(onClick);
	const Element: StepElementConfig['Element'] = isClickable ? 'button' : 'div';
	const layout =
		orientation === 'vertical'
			? 'flex-row items-start text-left'
			: 'flex-col items-center text-center';
	const interactivity = isClickable
		? 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
		: 'cursor-default';

	return {
		Element,
		isClickable,
		className: `flex ${layout} gap-2 ${interactivity}`,
		onClick: isClickable ? () => onClick?.(stepIndex) : undefined,
		type: isClickable ? ('button' as const) : undefined,
		ariaCurrent: status === 'active' ? ('step' as const) : undefined,
		ariaDisabled: isClickable ? undefined : (true as const),
	};
}
