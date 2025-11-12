import type { StandardSize } from '@src-types/ui/base';
import type { DatePickerProps } from '@src-types/ui/forms-dates';
import { useId } from 'react';

import {
	generateDatePickerId,
	getAriaDescribedBy,
	getDatePickerClasses,
} from './DatePickerHelpers';
import type { DatePickerContentProps, DatePickerInputProps } from './DatePickerTypes';

export interface UseDatePickerPropsOptions {
	readonly props: Readonly<DatePickerProps>;
}

export interface UseDatePickerPropsReturn {
	readonly contentProps: Readonly<DatePickerContentProps>;
}

interface UseDatePickerStateOptions {
	readonly datePickerId?: string | undefined;
	readonly label?: string | undefined;
	readonly error?: string | undefined;
	readonly helperText?: string | undefined;
	readonly size: StandardSize;
	readonly className?: string | undefined;
}

interface UseDatePickerStateReturn {
	readonly finalId: string | undefined;
	readonly datePickerClasses: string;
	readonly ariaDescribedBy: string | undefined;
}

/**
 * Hook to compute date picker state (ID, ARIA attributes, and classes)
 */
function useDatePickerState({
	datePickerId,
	label,
	error,
	helperText,
	size,
	className,
}: Readonly<UseDatePickerStateOptions>): UseDatePickerStateReturn {
	const generatedId = useId();
	const finalId = generateDatePickerId(generatedId, datePickerId, label);
	const ariaDescribedBy = finalId ? getAriaDescribedBy(finalId, error, helperText) : undefined;

	const datePickerClasses = getDatePickerClasses({
		size,
		className,
	});

	return { finalId, datePickerClasses, ariaDescribedBy };
}

interface BuildDatePickerContentPropsOptions {
	readonly props: Readonly<DatePickerProps>;
	readonly state: UseDatePickerStateReturn;
	readonly fieldProps: Readonly<DatePickerInputProps>;
}

function buildDatePickerContentProps(
	options: Readonly<BuildDatePickerContentPropsOptions>
): DatePickerContentProps {
	const { props, state, fieldProps } = options;
	return {
		datePickerId: state.finalId,
		datePickerClasses: state.datePickerClasses,
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
 * Hook to process DatePicker component props and return content props
 */
export function useDatePickerProps({
	props,
}: Readonly<UseDatePickerPropsOptions>): UseDatePickerPropsReturn {
	const { label, error, helperText, size = 'md', datePickerId, className, ...rest } = props;

	const state = useDatePickerState({
		datePickerId,
		label,
		error,
		helperText,
		size,
		className,
	});

	const fieldProps: Readonly<DatePickerInputProps> = rest;
	const contentProps = buildDatePickerContentProps({ props, state, fieldProps });

	return { contentProps };
}
