import Button from '@core/ui/button/Button';
import type { StandardSize } from '@src-types/ui/base';

export interface WizardNavigationProps {
	allowBackNavigation: boolean;
	canGoPrevious: boolean;
	isLastStep: boolean;
	canGoNext: boolean;
	currentStep?: { skippable?: boolean } | undefined;
	isProcessing: boolean;
	size: StandardSize;
	previousButtonLabel: string;
	nextButtonLabel: string;
	finishButtonLabel: string;
	onPrevious: () => void;
	onSkip: () => void | Promise<void>;
	onNext: () => void | Promise<void>;
	onComplete: () => void | Promise<void>;
}

function NavigationLeftButtons({
	allowBackNavigation,
	canGoPrevious,
	isLastStep,
	currentStep,
	isProcessing,
	size,
	previousButtonLabel,
	onPrevious,
	onSkip,
}: Readonly<{
	allowBackNavigation: boolean;
	canGoPrevious: boolean;
	isLastStep: boolean;
	currentStep?: { skippable?: boolean } | undefined;
	isProcessing: boolean;
	size: StandardSize;
	previousButtonLabel: string;
	onPrevious: () => void;
	onSkip: () => void | Promise<void>;
}>) {
	return (
		<div className="flex items-center gap-2">
			{allowBackNavigation && canGoPrevious ? (
				<Button variant="secondary" size={size} onClick={onPrevious} disabled={isProcessing}>
					{previousButtonLabel}
				</Button>
			) : null}
			{currentStep?.skippable && !isLastStep ? (
				<Button variant="ghost" size={size} onClick={onSkip} disabled={isProcessing}>
					Skip
				</Button>
			) : null}
		</div>
	);
}

function FinishButton({
	size,
	finishButtonLabel,
	isProcessing,
	onComplete,
}: Readonly<{
	size: StandardSize;
	finishButtonLabel: string;
	isProcessing: boolean;
	onComplete: () => void | Promise<void>;
}>) {
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
}: Readonly<{
	size: StandardSize;
	nextButtonLabel: string;
	canGoNext: boolean;
	isProcessing: boolean;
	onNext: () => void | Promise<void>;
}>) {
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

function NavigationRightButtons({
	isLastStep,
	canGoNext,
	isProcessing,
	size,
	nextButtonLabel,
	finishButtonLabel,
	onNext,
	onComplete,
}: Readonly<{
	isLastStep: boolean;
	canGoNext: boolean;
	isProcessing: boolean;
	size: StandardSize;
	nextButtonLabel: string;
	finishButtonLabel: string;
	onNext: () => void | Promise<void>;
	onComplete: () => void | Promise<void>;
}>) {
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

export function WizardNavigation(props: Readonly<WizardNavigationProps>) {
	return (
		<div className="flex items-center justify-between gap-4">
			<NavigationLeftButtons
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
			<NavigationRightButtons
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
