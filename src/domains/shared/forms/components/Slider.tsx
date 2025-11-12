import { useId } from 'react';

import type { SliderProps } from './slider.types';
import { buildSliderModel } from './sliderModel';
import { SliderView } from './SliderView';

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
