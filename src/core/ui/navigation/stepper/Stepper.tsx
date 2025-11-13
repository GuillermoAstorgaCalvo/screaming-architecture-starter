import { StepperSteps } from '@core/ui/navigation/stepper/components/Stepper.components';
import { getStepperVariantClasses } from '@core/ui/variants/stepper';
import type { StepperProps } from '@src-types/ui/navigation/stepper';
import { useMemo } from 'react';

/**
 * Stepper - Multi-step progress indicator component
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Step status tracking (pending, active, completed, error)
 * - Optional step navigation via click handlers
 * - Customizable sizes and styling
 * - Accessible: proper ARIA attributes
 * - Dark mode support
 *
 * @example
 * ```tsx
 * <Stepper
 *   steps={[
 *     { id: '1', label: 'Step 1', description: 'First step' },
 *     { id: '2', label: 'Step 2', description: 'Second step' },
 *     { id: '3', label: 'Step 3', description: 'Third step' },
 *   ]}
 *   activeStep={1}
 *   orientation="horizontal"
 *   onStepClick={(index) => console.log('Clicked step', index)}
 * />
 * ```
 */
export default function Stepper({
	steps,
	activeStep,
	orientation = 'horizontal',
	size = 'md',
	showNumbers = true,
	onStepClick,
	className,
	...props
}: Readonly<StepperProps>) {
	const stepperClasses = useMemo(
		() => getStepperVariantClasses({ orientation, className }),
		[orientation, className]
	);

	return (
		<nav className={stepperClasses} aria-label="Steps" {...props}>
			<StepperSteps
				steps={steps}
				activeStep={activeStep}
				size={size}
				showNumbers={showNumbers}
				onStepClick={onStepClick}
				orientation={orientation}
			/>
		</nav>
	);
}
