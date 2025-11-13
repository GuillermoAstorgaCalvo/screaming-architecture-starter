import type { FormControls } from '@core/forms/formAdapter';
import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { FormWizardProps, FormWizardState } from './FormWizardTypes';
import { prepareWizardViewData } from './FormWizardView.data';
import { extractWizardProps } from './FormWizardView.props';
import { renderWizardSections } from './FormWizardView.sections';
import type { useFormWizardHandlers } from './useFormWizardHandlers';

interface FormWizardViewProps<T extends FieldValues = FieldValues> {
	readonly state: FormWizardState<T>;
	readonly steps: FormWizardProps<T>['steps'];
	readonly formControls: FormControls<T>;
	readonly handlers: ReturnType<typeof useFormWizardHandlers<T>>;
	readonly props: Omit<FormWizardProps<T>, 'steps' | 'formOptions'>;
}

export default function FormWizardView<T extends FieldValues = FieldValues>({
	state,
	steps,
	formControls,
	handlers,
	props,
}: Readonly<FormWizardViewProps<T>>) {
	const extractedProps = extractWizardProps(props);
	const viewData = useMemo(
		() => prepareWizardViewData(steps, state.activeStep, formControls),
		[steps, state.activeStep, formControls]
	);

	return (
		<div
			className={`flex flex-col gap-6 ${extractedProps.className ?? ''}`}
			{...extractedProps.restProps}
		>
			{renderWizardSections({
				viewData,
				extractedProps,
				state,
				steps,
				handlers,
				onCancel: props.onCancel,
			})}
		</div>
	);
}
