import { DateRangePickerContainer } from './DateRangePickerContainer';
import { DateRangePickerField } from './DateRangePickerField';
import { generateEndDatePickerId, generateStartDatePickerId } from './DateRangePickerHelpers';
import { DateRangePickerLabel } from './DateRangePickerLabel';
import { DateRangePickerMessages } from './DateRangePickerMessages';
import type {
	DateRangePickerContentProps,
	DateRangePickerFieldWithLabelProps,
} from './DateRangePickerTypes';
import { DateRangePickerWrapper } from './DateRangePickerWrapper';

function buildDateRangePickerFieldProps(
	props: Readonly<DateRangePickerFieldWithLabelProps>,
	isStart: boolean
) {
	const {
		dateRangePickerId,
		startDatePickerClasses,
		endDatePickerClasses,
		startAriaDescribedBy,
		endAriaDescribedBy,
		required,
		disabled,
		startFieldProps,
		endFieldProps,
		startLabel,
		endLabel,
	} = props;

	if (isStart) {
		return {
			id: generateStartDatePickerId(dateRangePickerId),
			datePickerClasses: startDatePickerClasses,
			ariaDescribedBy: startAriaDescribedBy,
			disabled,
			required,
			props: startFieldProps,
			label: startLabel,
		};
	}

	return {
		id: generateEndDatePickerId(dateRangePickerId),
		datePickerClasses: endDatePickerClasses,
		ariaDescribedBy: endAriaDescribedBy,
		disabled,
		required,
		props: endFieldProps,
		label: endLabel,
	};
}

function DateRangePickerFieldWithLabel(props: Readonly<DateRangePickerFieldWithLabelProps>) {
	const { dateRangePickerId, label, required } = props;
	const startFieldProps = buildDateRangePickerFieldProps(props, true);
	const endFieldProps = buildDateRangePickerFieldProps(props, false);

	return (
		<DateRangePickerContainer>
			{label && dateRangePickerId ? (
				<DateRangePickerLabel id={dateRangePickerId} label={label} required={required} />
			) : null}
			<div className="flex flex-col gap-3 sm:flex-row">
				<DateRangePickerField {...startFieldProps} />
				<DateRangePickerField {...endFieldProps} />
			</div>
		</DateRangePickerContainer>
	);
}

function buildDateRangePickerFieldWithLabelProps(
	props: Readonly<DateRangePickerContentProps>
): DateRangePickerFieldWithLabelProps {
	const {
		dateRangePickerId,
		startDatePickerClasses,
		endDatePickerClasses,
		startAriaDescribedBy,
		endAriaDescribedBy,
		label,
		required,
		disabled,
		startFieldProps,
		endFieldProps,
		startLabel,
		endLabel,
	} = props;
	return {
		dateRangePickerId,
		startDatePickerClasses,
		endDatePickerClasses,
		startAriaDescribedBy,
		endAriaDescribedBy,
		label,
		required,
		disabled,
		startFieldProps,
		endFieldProps,
		startLabel,
		endLabel,
	};
}

export function DateRangePickerContent(props: Readonly<DateRangePickerContentProps>) {
	const { dateRangePickerId, error, helperText, fullWidth } = props;
	const fieldWithLabelProps = buildDateRangePickerFieldWithLabelProps(props);
	return (
		<DateRangePickerWrapper fullWidth={fullWidth}>
			<DateRangePickerFieldWithLabel {...fieldWithLabelProps} />
			{dateRangePickerId ? (
				<DateRangePickerMessages
					dateRangePickerId={dateRangePickerId}
					error={error}
					helperText={helperText}
				/>
			) : null}
		</DateRangePickerWrapper>
	);
}
