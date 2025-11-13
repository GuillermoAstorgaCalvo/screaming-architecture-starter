import {
	type ExtractedWizardProps,
	renderContentSection,
	renderNavigationSection,
	renderProgressSection,
	renderStepperSection,
} from '@core/ui/forms/form-wizard/components/FormWizardView.helpers';
import type { useFormWizardHandlers } from '@core/ui/forms/form-wizard/hooks/useFormWizardHandlers';
import type {
	FormWizardProps,
	FormWizardState,
} from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

import type { WizardViewData } from './FormWizardView.data';

interface RenderSectionsParams<T extends FieldValues> {
	readonly viewData: WizardViewData<T>;
	readonly extractedProps: ExtractedWizardProps;
	readonly state: FormWizardState<T>;
	readonly steps: FormWizardProps<T>['steps'];
	readonly handlers: ReturnType<typeof useFormWizardHandlers<T>>;
	readonly onCancel: (() => void) | undefined;
}

/**
 * Render all wizard sections
 */
export function renderWizardSections<T extends FieldValues>({
	viewData,
	extractedProps,
	state,
	steps,
	handlers,
	onCancel,
}: RenderSectionsParams<T>): ReactNode {
	return (
		<>
			{renderStepperSection({
				stepperSteps: viewData.stepperSteps,
				activeStep: state.activeStep,
				extractedProps,
				onStepClick: handlers.handleStepClick,
			})}
			{renderProgressSection({
				showProgress: extractedProps.showProgress,
				activeStep: state.activeStep,
				totalSteps: steps.length,
				progress: viewData.stepMetadata.progress,
			})}
			{renderContentSection({ content: viewData.stepContent })}
			{renderNavigationSection({
				showNavigation: extractedProps.showNavigation,
				state,
				handlers,
				stepMetadata: viewData.stepMetadata,
				extractedProps,
				onCancel,
			})}
		</>
	);
}
