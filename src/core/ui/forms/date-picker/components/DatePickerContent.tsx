import { DatePickerContainer } from './DatePickerContainer';
import { DatePickerField } from './DatePickerField';
import { DatePickerLabel } from './DatePickerLabel';
import { DatePickerMessages } from './DatePickerMessages';
import type { DatePickerContentProps, DatePickerFieldWithLabelProps } from './DatePickerTypes';
import { DatePickerWrapper } from './DatePickerWrapper';

function buildDatePickerFieldPropsFromLabelProps(props: Readonly<DatePickerFieldWithLabelProps>) {
	const { datePickerId, datePickerClasses, ariaDescribedBy, disabled, required, fieldProps } =
		props;
	return {
		id: datePickerId,
		datePickerClasses,
		ariaDescribedBy,
		disabled,
		required,
		props: fieldProps,
	};
}

function DatePickerFieldWithLabel(props: Readonly<DatePickerFieldWithLabelProps>) {
	const { datePickerId, label, required } = props;
	const fieldProps = buildDatePickerFieldPropsFromLabelProps(props);
	return (
		<DatePickerContainer>
			{label && datePickerId ? (
				<DatePickerLabel id={datePickerId} label={label} required={required} />
			) : null}
			<DatePickerField {...fieldProps} />
		</DatePickerContainer>
	);
}

function buildDatePickerFieldWithLabelProps(props: Readonly<DatePickerContentProps>) {
	const {
		datePickerId,
		datePickerClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		fieldProps,
	} = props;
	return {
		datePickerId,
		datePickerClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		fieldProps,
	};
}

export function DatePickerContent(props: Readonly<DatePickerContentProps>) {
	const { datePickerId, error, helperText, fullWidth } = props;
	const fieldWithLabelProps = buildDatePickerFieldWithLabelProps(props);
	return (
		<DatePickerWrapper fullWidth={fullWidth}>
			<DatePickerFieldWithLabel {...fieldWithLabelProps} />
			{datePickerId ? (
				<DatePickerMessages datePickerId={datePickerId} error={error} helperText={helperText} />
			) : null}
		</DatePickerWrapper>
	);
}
