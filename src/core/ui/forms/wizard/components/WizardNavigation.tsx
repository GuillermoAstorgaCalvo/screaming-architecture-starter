import type { WizardNavigationProps } from './WizardNavigation.types';
import { WizardNavigationLeftButtons, WizardNavigationRightButtons } from './WizardNavigationParts';

export function WizardNavigation(props: Readonly<WizardNavigationProps>) {
	return (
		<div className="flex items-center justify-between gap-4">
			<WizardNavigationLeftButtons
				allowBackNavigation={props.allowBackNavigation}
				canGoPrevious={props.canGoPrevious}
				isLastStep={props.isLastStep}
				currentStep={props.currentStep}
				isProcessing={props.isProcessing}
				size={props.size}
				previousButtonLabel={props.previousButtonLabel}
				onPrevious={props.onPrevious}
				onSkip={props.onSkip}
			/>
			<WizardNavigationRightButtons
				isLastStep={props.isLastStep}
				canGoNext={props.canGoNext}
				isProcessing={props.isProcessing}
				size={props.size}
				nextButtonLabel={props.nextButtonLabel}
				finishButtonLabel={props.finishButtonLabel}
				onNext={props.onNext}
				onComplete={props.onComplete}
			/>
		</div>
	);
}
