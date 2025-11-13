import { type FormControls, useFormAdapter } from '@core/forms/formAdapter';
import type { FieldValues } from 'react-hook-form';

import type { FormWizardProps } from './FormWizardTypes';

/**
 * Initialize form controls using form adapter
 */
export function useFormWizardForm<T extends FieldValues>(
	formOptions?: FormWizardProps<T>['formOptions']
): FormControls<T> {
	return useFormAdapter<T>(formOptions);
}
