import { DatePickerContainer } from '@core/ui/forms/date-picker/components/DatePickerContainer';
import { DatePickerField } from '@core/ui/forms/date-picker/components/DatePickerField';
import { DatePickerLabel } from '@core/ui/forms/date-picker/components/DatePickerLabel';
import { DatePickerMessages } from '@core/ui/forms/date-picker/components/DatePickerMessages';
import { DatePickerWrapper } from '@core/ui/forms/date-picker/components/DatePickerWrapper';
import type {
	DatePickerContentProps,
	DatePickerFieldWithLabelProps,
} from '@core/ui/forms/date-picker/types/DatePickerTypes';

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
