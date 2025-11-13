import type { FormControls } from '@core/forms/formAdapter';
import { prepareWizardViewData } from '@core/ui/forms/form-wizard/components/FormWizardView.data';
import { extractWizardProps } from '@core/ui/forms/form-wizard/components/FormWizardView.props';
import { renderWizardSections } from '@core/ui/forms/form-wizard/components/FormWizardView.sections';
import type { useFormWizardHandlers } from '@core/ui/forms/form-wizard/hooks/useFormWizardHandlers';
import type {
	FormWizardProps,
	FormWizardState,
} from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import { useMemo } from 'react';
import type { FieldValues } from 'react-hook-form';

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
