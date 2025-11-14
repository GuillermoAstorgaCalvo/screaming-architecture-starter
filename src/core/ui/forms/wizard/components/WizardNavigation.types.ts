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

export type WizardNavigationLeftButtonsProps = Pick<
	WizardNavigationProps,
	| 'allowBackNavigation'
	| 'canGoPrevious'
	| 'isLastStep'
	| 'currentStep'
	| 'isProcessing'
	| 'size'
	| 'previousButtonLabel'
	| 'onPrevious'
	| 'onSkip'
>;

export type WizardNavigationRightButtonsProps = Pick<
	WizardNavigationProps,
	| 'isLastStep'
	| 'canGoNext'
	| 'isProcessing'
	| 'size'
	| 'nextButtonLabel'
	| 'finishButtonLabel'
	| 'onNext'
	| 'onComplete'
>;

export type FinishButtonProps = Pick<
	WizardNavigationProps,
	'size' | 'finishButtonLabel' | 'isProcessing' | 'onComplete'
>;

export type NextButtonProps = Pick<
	WizardNavigationProps,
	'size' | 'nextButtonLabel' | 'canGoNext' | 'isProcessing' | 'onNext'
>;
