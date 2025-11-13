import Stepper from '@core/ui/stepper/Stepper';
import type { StandardSize } from '@src-types/ui/base';
import type { StepperOrientation, StepperStep } from '@src-types/ui/navigation/stepper';
import type { ReactNode } from 'react';

interface StepperSectionProps {
	readonly steps: StepperStep[];
	readonly activeStep: number;
	readonly orientation: StepperOrientation;
	readonly size: StandardSize;
	readonly showNumbers: boolean;
	readonly allowBackNavigation: boolean;
	readonly onStepClick?: (stepIndex: number) => void;
}

/**
 * Stepper section component
 */
export function StepperSection({
	steps,
	activeStep,
	orientation,
	size,
	showNumbers,
	allowBackNavigation,
	onStepClick,
}: Readonly<StepperSectionProps>) {
	return (
		<Stepper
			steps={steps}
			activeStep={activeStep}
			orientation={orientation}
			size={size}
			showNumbers={showNumbers}
			{...(allowBackNavigation && { onStepClick })}
		/>
	);
}

interface ContentSectionProps {
	readonly content: ReactNode;
}

/**
 * Content section component
 */
export function ContentSection({ content }: Readonly<ContentSectionProps>) {
	return <div className="flex-1 min-h-0">{content}</div>;
}
