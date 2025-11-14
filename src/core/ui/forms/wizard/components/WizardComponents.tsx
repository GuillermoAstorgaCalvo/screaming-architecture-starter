import { useTranslation } from '@core/i18n/useTranslation';
import { WizardNavigation } from '@core/ui/forms/wizard/components/WizardNavigation';
import type { WizardNavigationProps } from '@core/ui/forms/wizard/components/WizardNavigation.types';
import Progress from '@core/ui/progress/Progress';
import Stepper from '@core/ui/stepper/Stepper';
import type { StandardSize } from '@src-types/ui/base';
import type { ReactNode } from 'react';

interface WizardStepperProps {
	steps: Array<{ id: string; label: string; description?: string; content: ReactNode }>;
	activeStep: number;
	orientation: 'horizontal' | 'vertical';
	size: StandardSize;
	showNumbers: boolean;
	allowBackNavigation: boolean;
	onStepClick: (stepIndex: number) => void;
}

export function WizardStepper({
	steps,
	activeStep,
	orientation,
	size,
	showNumbers,
	allowBackNavigation,
	onStepClick,
}: Readonly<WizardStepperProps>) {
	return (
		<div className="mb-8">
			<Stepper
				steps={steps}
				activeStep={activeStep}
				orientation={orientation}
				size={size}
				showNumbers={showNumbers}
				{...(allowBackNavigation && {
					onStepClick: (stepIndex: number) => {
						onStepClick(stepIndex);
					},
				})}
			/>
		</div>
	);
}

interface WizardProgressProps {
	showProgress: boolean;
	progress: number;
}

export function WizardProgressIndicator({ showProgress, progress }: Readonly<WizardProgressProps>) {
	const { t } = useTranslation('common');
	if (!showProgress) {
		return null;
	}

	return (
		<div className="mb-6">
			<Progress
				value={progress}
				max={100}
				size="sm"
				showValue
				aria-label={t('wizard.progress', { progress: progress.toString() })}
			/>
		</div>
	);
}

interface WizardContentProps {
	content: ReactNode;
}

export function WizardContent({ content }: Readonly<WizardContentProps>) {
	return (
		<div className="mb-8" style={{ minHeight: 'calc(var(--spacing-4xl) * 3.125)' }}>
			{content}
		</div>
	);
}

interface WizardBodyProps {
	stepperSteps: Array<{ id: string; label: string; description?: string; content: ReactNode }>;
	currentStepIndex: number;
	orientation: 'horizontal' | 'vertical';
	size: StandardSize;
	showNumbers: boolean;
	allowBackNavigation: boolean;
	onStepClick: (stepIndex: number) => void;
	showProgress: boolean;
	wizardProgress: number;
	currentStepContent: ReactNode;
	showNavigation: boolean;
	navigationProps: WizardNavigationProps;
}

export function WizardBody({
	stepperSteps,
	currentStepIndex,
	orientation,
	size,
	showNumbers,
	allowBackNavigation,
	onStepClick,
	showProgress,
	wizardProgress,
	currentStepContent,
	showNavigation,
	navigationProps,
}: Readonly<WizardBodyProps>) {
	return (
		<>
			<WizardStepper
				steps={stepperSteps}
				activeStep={currentStepIndex}
				orientation={orientation}
				size={size}
				showNumbers={showNumbers}
				allowBackNavigation={allowBackNavigation}
				onStepClick={onStepClick}
			/>

			<WizardProgressIndicator showProgress={showProgress} progress={wizardProgress} />

			<WizardContent content={currentStepContent} />

			{showNavigation ? <WizardNavigation {...navigationProps} /> : null}
		</>
	);
}
