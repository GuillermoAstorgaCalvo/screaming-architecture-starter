import { SliderContainer } from './SliderContainer';
import { SliderField } from './SliderField';
import { SliderLabel } from './SliderLabel';
import { SliderMessages } from './SliderMessages';
import type { SliderContentProps, SliderFieldWithLabelProps } from './SliderTypes';
import { SliderWrapper } from './SliderWrapper';

function buildSliderFieldPropsFromLabelProps(props: Readonly<SliderFieldWithLabelProps>) {
	const {
		sliderId,
		sliderClasses,
		trackClasses,
		thumbClasses,
		ariaDescribedBy,
		disabled,
		required,
		min,
		max,
		step,
		value,
		defaultValue,
		fieldProps,
	} = props;
	return {
		id: sliderId,
		sliderClasses,
		trackClasses,
		thumbClasses,
		ariaDescribedBy,
		disabled,
		required,
		min,
		max,
		step,
		value,
		defaultValue,
		props: fieldProps,
	};
}

function SliderFieldWithLabel(props: Readonly<SliderFieldWithLabelProps>) {
	const { sliderId, label, required } = props;
	const fieldProps = buildSliderFieldPropsFromLabelProps(props);
	return (
		<SliderContainer>
			<SliderField {...fieldProps} />
			{label && sliderId ? <SliderLabel id={sliderId} label={label} required={required} /> : null}
		</SliderContainer>
	);
}

function buildSliderFieldWithLabelProps(props: Readonly<SliderContentProps>) {
	const {
		sliderId,
		sliderClasses,
		trackClasses,
		thumbClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		min,
		max,
		step,
		value,
		defaultValue,
		fieldProps,
	} = props;
	return {
		sliderId,
		sliderClasses,
		trackClasses,
		thumbClasses,
		ariaDescribedBy,
		label,
		required,
		disabled,
		min,
		max,
		step,
		value,
		defaultValue,
		fieldProps,
	};
}

export function SliderContent(props: Readonly<SliderContentProps>) {
	const { sliderId, error, helperText, fullWidth } = props;
	const fieldWithLabelProps = buildSliderFieldWithLabelProps(props);
	return (
		<SliderWrapper fullWidth={fullWidth}>
			<SliderFieldWithLabel {...fieldWithLabelProps} />
			{sliderId ? (
				<SliderMessages sliderId={sliderId} error={error} helperText={helperText} />
			) : null}
		</SliderWrapper>
	);
}
