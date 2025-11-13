import { type FormControls, useFormAdapter } from '@core/forms/formAdapter';
import type { FormWizardProps } from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { FieldValues } from 'react-hook-form';

/**
 * Initialize form controls using form adapter
 */
export function useFormWizardForm<T extends FieldValues>(
	formOptions?: FormWizardProps<T>['formOptions']
): FormControls<T> {
	return useFormAdapter<T>(formOptions);
}
