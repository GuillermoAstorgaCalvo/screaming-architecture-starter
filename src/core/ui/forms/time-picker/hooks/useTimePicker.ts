import {
	generateTimePickerId,
	getAriaDescribedBy,
	getTimePickerClasses,
} from '@core/ui/forms/time-picker/helpers/TimePickerHelpers';
import type {
	TimePickerContentProps,
	TimePickerInputProps,
} from '@core/ui/forms/time-picker/types/TimePickerTypes';
import type { StandardSize } from '@src-types/ui/base';
import type { TimePickerProps } from '@src-types/ui/forms-dates';
import { useId } from 'react';

export interface UseTimePickerPropsOptions {
	readonly props: Readonly<TimePickerProps>;
}

export interface UseTimePickerPropsReturn {
	readonly contentProps: Readonly<TimePickerContentProps>;
}

interface UseTimePickerStateOptions {
	readonly timePickerId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

interface UseTimePickerStateReturn {
	readonly finalId: string | undefined;
	readonly timePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
}

/**
 * Hook to compute time picker state (ID, ARIA attributes, and classes)
 */
function useTimePickerState({
	timePickerId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseTimePickerStateOptions>): UseTimePickerStateReturn {
	const generatedId = useId();
	const finalId = generateTimePickerId(generatedId, timePickerId, label);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;

	const timePickerClasses = getTimePickerClasses({
		size,
		className,
	});

	return { finalId, timePickerClasses, ariaDescribedBy };
}

interface BuildTimePickerContentPropsOptions {
	readonly props: Readonly<TimePickerProps>;
	readonly state: UseTimePickerStateReturn;
	readonly fieldProps: Readonly<TimePickerInputProps>;
}

function buildTimePickerContentProps(
	options: Readonly<BuildTimePickerContentPropsOptions>
): TimePickerContentProps {
	const { props, state, fieldProps } = options;
	return {
		timePickerId: state.finalId,
		timePickerClasses: state.timePickerClasses,
		ariaDescribedBy: state.ariaDescribedBy,
		label: props.label,
		error: props.error,
		helperText: props.helperText,
		required: props.required,
		fullWidth: props.fullWidth ?? false,
		disabled: props.disabled,
		fieldProps,
	};
}

/**
 * Hook to process TimePicker component props and return content props
 */
export function useTimePickerProps({
	props,
}: Readonly<UseTimePickerPropsOptions>): UseTimePickerPropsReturn {
	const { label, error, helperText, size = 'md', timePickerId, className, ...rest } = props;

	const state = useTimePickerState({
		timePickerId,
		label,
		error,
		helperText,
		size,
		className,
	});

	const fieldProps: Readonly<TimePickerInputProps> = rest;
	const contentProps = buildTimePickerContentProps({ props, state, fieldProps });

	return { contentProps };
}
