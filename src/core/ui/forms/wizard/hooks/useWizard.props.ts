import type { WizardProps } from '@src-types/ui/navigation/wizard';
import type { HTMLAttributes } from 'react';

/**
 * Extracted wizard props for internal use
 */
export interface ExtractedWizardProps {
	readonly steps: WizardProps['steps'];
	readonly initialStep: number;
	readonly controlledStep: number | undefined;
	readonly onStepChange: WizardProps['onStepChange'];
	readonly onComplete: WizardProps['onComplete'];
	readonly onCancel: WizardProps['onCancel'];
	readonly orientation: NonNullable<WizardProps['orientation']>;
	readonly size: NonNullable<WizardProps['size']>;
	readonly showNumbers: boolean;
	readonly showNavigation: boolean;
	readonly nextButtonLabel: string;
	readonly previousButtonLabel: string;
	readonly finishButtonLabel: string;
	readonly showProgress: boolean;
	readonly allowBackNavigation: boolean;
	readonly formData: WizardProps['formData'];
	readonly className: string | undefined;
	readonly rest: Readonly<Omit<HTMLAttributes<HTMLDivElement>, 'className'>>;
}

function getDefaultValue<T>(value: T | undefined, defaultValue: T): T {
	return value ?? defaultValue;
}

function extractDefaults(props: Readonly<WizardProps>) {
	return {
		initialStep: getDefaultValue(props.initialStep, 0),
		orientation: getDefaultValue(props.orientation, 'horizontal' as const),
		size: getDefaultValue(props.size, 'md' as const),
		showNumbers: getDefaultValue(props.showNumbers, true),
		showNavigation: getDefaultValue(props.showNavigation, true),
		nextButtonLabel: getDefaultValue(props.nextButtonLabel, 'Next'),
		previousButtonLabel: getDefaultValue(props.previousButtonLabel, 'Previous'),
		finishButtonLabel: getDefaultValue(props.finishButtonLabel, 'Finish'),
		showProgress: getDefaultValue(props.showProgress, true),
		allowBackNavigation: getDefaultValue(props.allowBackNavigation, true),
	};
}

/**
 * Extract and normalize wizard props
 */
export function extractWizardProps(props: Readonly<WizardProps>): ExtractedWizardProps {
	const defaults = extractDefaults(props);
	const { steps, activeStep, onStepChange, onComplete, onCancel, formData, className, ...rest } =
		props;

	return {
		steps,
		initialStep: defaults.initialStep,
		controlledStep: activeStep,
		onStepChange,
		onComplete,
		onCancel,
		orientation: defaults.orientation,
		size: defaults.size,
		showNumbers: defaults.showNumbers,
		showNavigation: defaults.showNavigation,
		nextButtonLabel: defaults.nextButtonLabel,
		previousButtonLabel: defaults.previousButtonLabel,
		finishButtonLabel: defaults.finishButtonLabel,
		showProgress: defaults.showProgress,
		allowBackNavigation: defaults.allowBackNavigation,
		formData,
		className,
		rest,
	};
}
