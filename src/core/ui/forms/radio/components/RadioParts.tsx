import ErrorText from '@core/ui/error-text/ErrorText';
import {
	buildRadioFieldPropsFromLabelProps,
	buildRadioFieldWithLabelProps,
} from '@core/ui/forms/radio/helpers/RadioFieldPropsHelpers';
import { buildRadioHandlers } from '@core/ui/forms/radio/helpers/RadioHandlers';
import { buildRadioInputProps } from '@core/ui/forms/radio/helpers/RadioInputPropsHelpers';
import { useRadioFieldState } from '@core/ui/forms/radio/hooks/useRadioField';
import type {
	RadioContainerProps,
	RadioContentProps,
	RadioFieldProps,
	RadioFieldWithLabelProps,
	RadioLabelProps,
	RadioMessagesProps,
	RadioWrapperProps,
} from '@core/ui/forms/radio/types/RadioTypes';
import HelperText from '@core/ui/helper-text/HelperText';
import Label from '@core/ui/label/Label';
import { classNames } from '@core/utils/classNames';

export function RadioWrapper({ fullWidth, children, ...props }: Readonly<RadioWrapperProps>) {
	return (
		<div className={fullWidth ? 'w-full' : undefined} {...props}>
			{children}
		</div>
	);
}

export function RadioContainer({ children, className, ...props }: Readonly<RadioContainerProps>) {
	return (
		<div className={classNames('flex items-start gap-2', className)} {...props}>
			{children}
		</div>
	);
}

export function RadioField(props: Readonly<RadioFieldProps>) {
	const { checked, defaultChecked, disabled, props: inputProps } = props;
	const { inputRef, previousCheckedRef } = useRadioFieldState(checked, defaultChecked, disabled);
	const handlers = buildRadioHandlers({ disabled, checked, previousCheckedRef, inputProps });
	const inputPropsBuilt = buildRadioInputProps(props, handlers, inputRef);
	return <input {...inputPropsBuilt} />;
}

export function RadioMessages({ radioId, error, helperText }: Readonly<RadioMessagesProps>) {
	if (!error && !helperText) return null;
	return (
		<>
			{error ? <ErrorText id={`${radioId}-error`}>{error}</ErrorText> : null}
			{helperText ? (
				<HelperText id={`${radioId}-helper`} className={error ? 'sr-only' : undefined}>
					{helperText}
				</HelperText>
			) : null}
		</>
	);
}

export function RadioLabel({ id, label, required, size = 'sm' }: Readonly<RadioLabelProps>) {
	return (
		<Label htmlFor={id} required={required ?? false} size={size}>
			{label}
		</Label>
	);
}

function RadioFieldWithLabel(props: Readonly<RadioFieldWithLabelProps>) {
	const { radioId, label, required } = props;
	const fieldProps = buildRadioFieldPropsFromLabelProps(props);
	return (
		<RadioContainer>
			<RadioField {...fieldProps} />
			{label && radioId ? <RadioLabel id={radioId} label={label} required={required} /> : null}
		</RadioContainer>
	);
}

export function RadioContent(props: Readonly<RadioContentProps>) {
	const { radioId, error, helperText, fullWidth } = props;
	const fieldWithLabelProps = buildRadioFieldWithLabelProps(props);
	return (
		<RadioWrapper fullWidth={fullWidth}>
			<RadioFieldWithLabel {...fieldWithLabelProps} />
			{radioId ? <RadioMessages radioId={radioId} error={error} helperText={helperText} /> : null}
		</RadioWrapper>
	);
}
