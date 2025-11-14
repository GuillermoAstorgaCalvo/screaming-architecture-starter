import { SliderView } from '@domains/shared/components/slider/components/SliderView';
import { buildSliderModel } from '@domains/shared/components/slider/helpers/sliderModel';
import type { SliderProps } from '@domains/shared/components/slider/types/slider.types';
import { useId } from 'react';

export default function Slider(props: Readonly<SliderProps>) {
	const {
		id,
		label,
		value,
		min = 0,
		max = 100,
		step = 1,
		helperText,
		showValue = false,
		formatValue,
		marks,
		onChange,
		disabled,
		className,
		...rest
	} = props;
	const generatedId = useId();
	const sliderId = id ?? generatedId;
	const model = buildSliderModel({
		sliderId,
		value,
		min,
		max,
		step,
		helperText,
		formatValue,
		marks,
		disabled,
		onChange,
		inputProps: rest,
		className,
		label,
		showValue,
	});

	return <SliderView {...model} />;
}
