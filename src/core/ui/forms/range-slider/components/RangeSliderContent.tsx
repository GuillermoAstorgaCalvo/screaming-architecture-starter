import { RangeSliderContainer } from '@core/ui/forms/range-slider/components/RangeSliderContainer';
import { RangeSliderField } from '@core/ui/forms/range-slider/components/RangeSliderField';
import { RangeSliderLabel } from '@core/ui/forms/range-slider/components/RangeSliderLabel';
import { RangeSliderMessages } from '@core/ui/forms/range-slider/components/RangeSliderMessages';
import { RangeSliderWrapper } from '@core/ui/forms/range-slider/components/RangeSliderWrapper';
import type {
	RangeSliderContentProps,
	RangeSliderFieldWithLabelProps,
} from '@core/ui/forms/range-slider/types/RangeSliderTypes';

function buildRangeSliderFieldPropsFromLabelProps(props: Readonly<RangeSliderFieldWithLabelProps>) {
	const {
		rangeSliderId,
		sliderClasses,
		trackClasses,
		activeTrackClasses,
		thumbClasses,
		ariaDescribedBy,
		disabled,
		required,
		min,
		max,
		step,
		value,
		defaultValue,
		onChange,
		fieldProps,
	} = props;
	return {
		minId: rangeSliderId ? `${rangeSliderId}-min` : undefined,
		maxId: rangeSliderId ? `${rangeSliderId}-max` : undefined,
		sliderClasses,
		trackClasses,
		activeTrackClasses,
		thumbClasses,
		ariaDescribedBy,
		disabled,
		required,
		min,
		max,
		step,
		value,
		defaultValue,
		onChange,
		props: fieldProps,
	};
}

function RangeSliderFieldWithLabel(props: Readonly<RangeSliderFieldWithLabelProps>) {
	const { rangeSliderId, label, required } = props;
	const fieldProps = buildRangeSliderFieldPropsFromLabelProps(props);
	return (
		<RangeSliderContainer>
			<RangeSliderField {...fieldProps} />
			{label && rangeSliderId ? (
				<RangeSliderLabel id={rangeSliderId} label={label} required={required} />
			) : null}
		</RangeSliderContainer>
	);
}

function buildRangeSliderFieldWithLabelProps(props: Readonly<RangeSliderContentProps>) {
	const {
		rangeSliderId,
		sliderClasses,
		trackClasses,
		activeTrackClasses,
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
		onChange,
		fieldProps,
	} = props;
	return {
		rangeSliderId,
		sliderClasses,
		trackClasses,
		activeTrackClasses,
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
		onChange,
		fieldProps,
	};
}

export function RangeSliderContent(props: Readonly<RangeSliderContentProps>) {
	const { rangeSliderId, error, helperText, fullWidth } = props;
	const fieldWithLabelProps = buildRangeSliderFieldWithLabelProps(props);
	return (
		<RangeSliderWrapper fullWidth={fullWidth}>
			<RangeSliderFieldWithLabel {...fieldWithLabelProps} />
			{rangeSliderId ? (
				<RangeSliderMessages rangeSliderId={rangeSliderId} error={error} helperText={helperText} />
			) : null}
		</RangeSliderWrapper>
	);
}
