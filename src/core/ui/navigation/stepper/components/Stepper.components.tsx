import {
	getStepElementConfig,
	getStepStatus,
	getStepStatusClasses,
} from '@core/ui/navigation/stepper/helpers/Stepper.helpers';
import { getStepperStepSizeClasses } from '@core/ui/variants/stepper';
import type { StepperProps, StepperStepStatus } from '@src-types/ui/navigation/stepper';
import { useMemo } from 'react';

/**
 * Check icon component for completed steps
 */
export const StepperCheckIcon = () => (
	<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
	</svg>
);

interface StepperStepNumberProps {
	readonly showNumbers: boolean;
	readonly status: StepperStepStatus;
	readonly stepIndex: number;
	readonly stepLabel: string;
	readonly isClickable: boolean;
}

/**
 * Step number component that displays the step number or check icon
 */
export function StepperStepNumber(props: StepperStepNumberProps) {
	if (!props.showNumbers) {
		return null;
	}

	const statusClasses = getStepStatusClasses(props.status);
	const numberClasses = `flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold transition-colors ${statusClasses} ${
		props.isClickable ? 'cursor-pointer' : ''
	}`;
	const label = `Step ${props.stepIndex + 1}: ${props.stepLabel}`;

	return (
		<span className={numberClasses} aria-label={label}>
			{props.status === 'completed' ? <StepperCheckIcon /> : props.stepIndex + 1}
		</span>
	);
}

interface StepperStepContentProps {
	readonly step: StepperProps['steps'][number];
	readonly size: StepperProps['size'];
}

/**
 * Step content component that displays the step label and description
 */
export const StepperStepContent = ({ step, size }: StepperStepContentProps) => {
	const sizeClasses = size ? getStepperStepSizeClasses(size) : '';
	return (
		<div className={`flex flex-col ${sizeClasses}`}>
			<span className="font-medium">{step.label}</span>
			{step.description ? (
				<span className="text-sm text-gray-600 dark:text-gray-400">{step.description}</span>
			) : null}
		</div>
	);
};

interface StepperStepItemProps {
	readonly step: StepperProps['steps'][number];
	readonly stepIndex: number;
	readonly status: StepperStepStatus;
	readonly size: StepperProps['size'];
	readonly showNumbers: boolean;
	readonly onClick?: (stepIndex: number) => void;
	readonly orientation: StepperProps['orientation'];
}

/**
 * Individual step item component
 */
export function StepperStepItem(props: StepperStepItemProps) {
	const { Element, isClickable, ...elementProps } = getStepElementConfig({
		onClick: props.onClick,
		stepIndex: props.stepIndex,
		status: props.status,
		orientation: props.orientation,
	});

	return (
		<Element {...elementProps}>
			<StepperStepNumber
				showNumbers={props.showNumbers}
				status={props.status}
				stepIndex={props.stepIndex}
				stepLabel={props.step.label}
				isClickable={isClickable}
			/>
			<StepperStepContent step={props.step} size={props.size} />
		</Element>
	);
}

interface StepperConnectorProps {
	readonly status: StepperStepStatus;
	readonly orientation: StepperProps['orientation'];
}

/**
 * Connector component between steps
 */
export const StepperConnector = ({ status, orientation }: StepperConnectorProps) => {
	const connectorClasses = useMemo(
		() => (status === 'completed' ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'),
		[status]
	);
	return orientation === 'vertical' ? (
		<div className={`w-0.5 h-12 ${connectorClasses} mx-4`} aria-hidden="true" />
	) : (
		<div className={`h-0.5 w-12 ${connectorClasses} my-4`} aria-hidden="true" />
	);
};

interface StepperStepRowProps {
	readonly step: StepperProps['steps'][number];
	readonly stepIndex: number;
	readonly isLast: boolean;
	readonly status: StepperStepStatus;
	readonly size: StepperProps['size'];
	readonly showNumbers: boolean;
	readonly onStepClick?: StepperProps['onStepClick'];
	readonly orientation: StepperProps['orientation'];
}

/**
 * Step row component that combines step item and connector
 */
export const StepperStepRow = (props: StepperStepRowProps) => (
	<div className="flex items-center">
		<StepperStepItem
			step={props.step}
			stepIndex={props.stepIndex}
			status={props.status}
			size={props.size}
			showNumbers={props.showNumbers}
			{...(props.onStepClick !== undefined && { onClick: props.onStepClick })}
			orientation={props.orientation}
		/>
		{props.isLast ? null : (
			<StepperConnector status={props.status} orientation={props.orientation} />
		)}
	</div>
);

interface StepperStepsProps {
	readonly steps: StepperProps['steps'];
	readonly activeStep: number;
	readonly size: StepperProps['size'];
	readonly showNumbers: boolean;
	readonly onStepClick?: StepperProps['onStepClick'];
	readonly orientation: StepperProps['orientation'];
}

/**
 * Steps container component that renders all step rows
 */
export function StepperSteps(props: StepperStepsProps) {
	return props.steps.map((step, index) => (
		<StepperStepRow
			key={step.id}
			step={step}
			stepIndex={index}
			isLast={index === props.steps.length - 1}
			status={getStepStatus(index, props.activeStep)}
			size={props.size}
			showNumbers={props.showNumbers}
			onStepClick={props.onStepClick}
			orientation={props.orientation}
		/>
	));
}
