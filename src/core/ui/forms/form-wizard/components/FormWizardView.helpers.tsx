import {
	ContentSection,
	StepperSection,
} from '@core/ui/forms/form-wizard/components/FormWizardView.layout';
import { NavigationSection } from '@core/ui/forms/form-wizard/components/FormWizardView.navigation';
import { ProgressSection } from '@core/ui/forms/form-wizard/components/FormWizardView.progress';
import type { useFormWizardHandlers } from '@core/ui/forms/form-wizard/hooks/useFormWizardHandlers';
import type {
	FormWizardProps,
	FormWizardState,
	FormWizardStep,
} from '@core/ui/forms/form-wizard/types/FormWizardTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { StepperOrientation, StepperStep } from '@src-types/ui/navigation/stepper';
import type { ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

export interface StepMetadata<T extends FieldValues> {
	readonly currentStep: FormWizardStep<T> | undefined;
	readonly isFirstStep: boolean;
	readonly isLastStep: boolean;
	readonly progress: number;
}

export interface ExtractedWizardProps {
	readonly orientation: StepperOrientation;
	readonly size: StandardSize;
	readonly showNumbers: boolean;
	readonly showNavigation: boolean;
	readonly nextButtonLabel: string;
	readonly previousButtonLabel: string;
	readonly finishButtonLabel: string;
	readonly showProgress: boolean;
	readonly allowBackNavigation: boolean;
	readonly className: string | undefined;
	readonly restProps: Omit<
		FormWizardProps<FieldValues>,
		'steps' | 'formOptions' | keyof ExtractedWizardProps
	>;
}

/**
 * Render stepper section
 */
export function renderStepperSection({
	stepperSteps,
	activeStep,
	extractedProps,
	onStepClick,
}: {
	readonly stepperSteps: StepperStep[];
	readonly activeStep: number;
	readonly extractedProps: ExtractedWizardProps;
	readonly onStepClick: (stepIndex: number) => void;
}) {
	return (
		<StepperSection
			steps={stepperSteps}
			activeStep={activeStep}
			orientation={extractedProps.orientation}
			size={extractedProps.size}
			showNumbers={extractedProps.showNumbers}
			allowBackNavigation={extractedProps.allowBackNavigation}
			onStepClick={onStepClick}
		/>
	);
}

/**
 * Render progress section
 */
export function renderProgressSection({
	showProgress,
	activeStep,
	totalSteps,
	progress,
}: {
	readonly showProgress: boolean;
	readonly activeStep: number;
	readonly totalSteps: number;
	readonly progress: number;
}) {
	return (
		<ProgressSection
			showProgress={showProgress}
			activeStep={activeStep}
			totalSteps={totalSteps}
			progress={progress}
		/>
	);
}

/**
 * Render content section
 */
export function renderContentSection({ content }: { readonly content: ReactNode }) {
	return <ContentSection content={content} />;
}

/**
 * Render navigation section
 */
export function renderNavigationSection<T extends FieldValues>({
	showNavigation,
	state,
	handlers,
	stepMetadata,
	extractedProps,
	onCancel,
}: {
	readonly showNavigation: boolean;
	readonly state: FormWizardState<T>;
	readonly handlers: ReturnType<typeof useFormWizardHandlers<T>>;
	readonly stepMetadata: StepMetadata<T>;
	readonly extractedProps: ExtractedWizardProps;
	readonly onCancel: (() => void) | undefined;
}) {
	return (
		<NavigationSection
			showNavigation={showNavigation}
			state={state}
			handlers={handlers}
			isFirstStep={stepMetadata.isFirstStep}
			isLastStep={stepMetadata.isLastStep}
			size={extractedProps.size}
			allowBackNavigation={extractedProps.allowBackNavigation}
			previousButtonLabel={extractedProps.previousButtonLabel}
			nextButtonLabel={extractedProps.nextButtonLabel}
			finishButtonLabel={extractedProps.finishButtonLabel}
			onCancel={onCancel}
		/>
	);
}
