import { TimePickerContainer } from './TimePickerContainer';
import { TimePickerField } from './TimePickerField';
import { TimePickerLabel } from './TimePickerLabel';
import { TimePickerMessages } from './TimePickerMessages';
import type { TimePickerContentProps, TimePickerFieldWithLabelProps } from './TimePickerTypes';
import { TimePickerWrapper } from './TimePickerWrapper';

function buildTimePickerFieldPropsFromLabelProps(props: Readonly<TimePickerFieldWithLabelProps>) {
	const { timePickerId, timePickerClasses, ariaDescribedBy, disabled, required, fieldProps } =
		props;
	return {
		id: timePickerId,
		timePickerClasses,
		ariaDescribedBy,
		disabled,
		required,
		props: fieldProps,
	};
}

function TimePickerFieldWithLabel(props: Readonly<TimePickerFieldWithLabelProps>) {
	const { timePickerId, label, required } = props;
	const fieldProps = buildTimePickerFieldPropsFromLabelProps(props);
	return (
		<TimePickerContainer>
			{label && timePickerId ? (
				<TimePickerLabel id={timePickerId} label={label} required={required} />
			) : null}
			<TimePickerField {...fieldProps} />
		</TimePickerContainer>
	);
}

function buildTimePickerFieldWithLabelProps(props: Readonly<TimePickerContentProps>) {
	const {
		timePickerId,
		timePickerClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		fieldProps,
	} = props;
	return {
		timePickerId,
		timePickerClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		fieldProps,
	};
}

export function TimePickerContent(props: Readonly<TimePickerContentProps>) {
	const { timePickerId, error, helperText, fullWidth } = props;
	const fieldWithLabelProps = buildTimePickerFieldWithLabelProps(props);
	return (
		<TimePickerWrapper fullWidth={fullWidth}>
			<TimePickerFieldWithLabel {...fieldWithLabelProps} />
			{timePickerId ? (
				<TimePickerMessages timePickerId={timePickerId} error={error} helperText={helperText} />
			) : null}
		</TimePickerWrapper>
	);
}
