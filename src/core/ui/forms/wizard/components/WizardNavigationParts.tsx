import { useTranslation } from '@core/i18n/useTranslation';
import Button from '@core/ui/button/Button';

import type {
	FinishButtonProps,
	NextButtonProps,
	WizardNavigationLeftButtonsProps,
	WizardNavigationRightButtonsProps,
} from './WizardNavigation.types';

export function WizardNavigationLeftButtons({
	allowBackNavigation,
	canGoPrevious,
	isLastStep,
	currentStep,
	isProcessing,
	size,
	previousButtonLabel,
	onPrevious,
	onSkip,
}: Readonly<WizardNavigationLeftButtonsProps>) {
	const { t } = useTranslation('common');
	return (
		<div className="flex items-center gap-2">
			{allowBackNavigation && canGoPrevious ? (
				<Button variant="secondary" size={size} onClick={onPrevious} disabled={isProcessing}>
					{previousButtonLabel}
				</Button>
			) : null}

			{currentStep?.skippable && !isLastStep ? (
				<Button variant="ghost" size={size} onClick={onSkip} disabled={isProcessing}>
					{t('wizard.skip')}
				</Button>
			) : null}
		</div>
	);
}

export function WizardNavigationRightButtons({
	isLastStep,
	canGoNext,
	isProcessing,
	size,
	nextButtonLabel,
	finishButtonLabel,
	onNext,
	onComplete,
}: Readonly<WizardNavigationRightButtonsProps>) {
	return (
		<div className="flex items-center gap-2">
			{isLastStep ? (
				<FinishButton
					size={size}
					finishButtonLabel={finishButtonLabel}
					isProcessing={isProcessing}
					onComplete={onComplete}
				/>
			) : (
				<NextButton
					size={size}
					nextButtonLabel={nextButtonLabel}
					canGoNext={canGoNext}
					isProcessing={isProcessing}
					onNext={onNext}
				/>
			)}
		</div>
	);
}

function FinishButton({
	size,
	finishButtonLabel,
	isProcessing,
	onComplete,
}: Readonly<FinishButtonProps>) {
	return (
		<Button
			variant="primary"
			size={size}
			onClick={onComplete}
			disabled={isProcessing}
			isLoading={isProcessing}
		>
			{finishButtonLabel}
		</Button>
	);
}

function NextButton({
	size,
	nextButtonLabel,
	canGoNext,
	isProcessing,
	onNext,
}: Readonly<NextButtonProps>) {
	return (
		<Button
			variant="primary"
			size={size}
			onClick={onNext}
			disabled={isProcessing || !canGoNext}
			isLoading={isProcessing}
		>
			{nextButtonLabel}
		</Button>
	);
}
