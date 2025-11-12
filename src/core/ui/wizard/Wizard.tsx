import type { WizardProps } from '@src-types/ui/navigation';
import { twMerge } from 'tailwind-merge';

import { useWizard } from './useWizard';
import { WizardBody } from './WizardComponents';
import {
	createNavigationProps,
	extractWizardConfig,
	useStepperSteps,
	useWizardState,
} from './WizardHelpers';

/**
 * Wizard - Multi-step form wizard component with validation and navigation
 *
 * Features:
 * - Step navigation (next/previous/validation)
 * - Step state management (completed, skipped, validated)
 * - Progress tracking
 * - Optional step skipping
 * - Form validation per step
 * - Integration with Stepper component
 * - Accessible navigation
 *
 * @example
 * ```tsx
 * <Wizard
 *   steps={[
 *     {
 *       id: 'step1',
 *       label: 'Personal Info',
 *       content: <PersonalInfoForm />,
 *     },
 *     {
 *       id: 'step2',
 *       label: 'Address',
 *       content: <AddressForm />,
 *     },
 *   ]}
 *   onComplete={() => console.log('Wizard completed')}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Wizard
 *   steps={steps}
 *   formData={formValues}
 *   onComplete={handleComplete}
 *   showProgress
 *   allowBackNavigation
 * />
 * ```
 */
export default function Wizard(props: Readonly<WizardProps>) {
	const config = extractWizardConfig(props);
	const wizard = useWizard(props);
	const wizardState = useWizardState(wizard);
	const stepperSteps = useStepperSteps({ steps: config.steps });
	const wizardClasses = twMerge('w-full', config.className);

	const handleStepClick = (stepIndex: number) => {
		wizardState.goToStep(stepIndex).catch(() => {
			// Ignore errors
		});
	};

	const navigationProps = createNavigationProps(wizardState, {
		allowBackNavigation: config.allowBackNavigation,
		size: config.size,
		previousButtonLabel: config.previousButtonLabel,
		nextButtonLabel: config.nextButtonLabel,
		finishButtonLabel: config.finishButtonLabel,
	});

	return (
		<div className={wizardClasses} {...props}>
			<WizardBody
				stepperSteps={stepperSteps}
				currentStepIndex={wizardState.currentStepIndex}
				orientation={config.orientation}
				size={config.size}
				showNumbers={config.showNumbers}
				allowBackNavigation={config.allowBackNavigation}
				onStepClick={handleStepClick}
				showProgress={config.showProgress}
				wizardProgress={wizardState.wizardProgress}
				currentStepContent={wizardState.currentStepContent}
				showNavigation={config.showNavigation}
				navigationProps={navigationProps}
			/>
		</div>
	);
}
