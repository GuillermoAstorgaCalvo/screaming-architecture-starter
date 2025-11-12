import type { FieldValues } from 'react-hook-form';

import type { FormWizardProps } from './FormWizardTypes';
import type { ExtractedWizardProps } from './FormWizardView.helpers';

/**
 * Extract and normalize wizard props with defaults
 */
export function extractWizardProps<T extends FieldValues>(
	props: Omit<FormWizardProps<T>, 'steps' | 'formOptions'>
): ExtractedWizardProps {
	const {
		orientation = 'horizontal',
		size = 'md',
		showNumbers = true,
		showNavigation = true,
		nextButtonLabel = 'Next',
		previousButtonLabel = 'Previous',
		finishButtonLabel = 'Finish',
		showProgress = true,
		allowBackNavigation = true,
		className,
		...restProps
	} = props;

	return {
		orientation,
		size,
		showNumbers,
		showNavigation,
		nextButtonLabel,
		previousButtonLabel,
		finishButtonLabel,
		showProgress,
		allowBackNavigation,
		className,
		restProps: restProps as ExtractedWizardProps['restProps'],
	};
}
