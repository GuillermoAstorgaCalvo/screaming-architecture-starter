import {
	DEFAULT_RANGE_SLIDER_END,
	DEFAULT_RANGE_SLIDER_START,
	DEFAULT_SLIDER_VALUE,
} from '@domains/landing/components/categories/forms/constants/constants';
import { useState } from 'react';

/**
 * State hook for advanced form controls (autocomplete, combobox, rich text, sliders, segmented)
 */
export function useAdvancedState() {
	const [autocompleteValue, setAutocompleteValue] = useState('');
	const [comboboxValue, setComboboxValue] = useState('');
	const [richTextValue, setRichTextValue] = useState('');
	const [sliderValue, setSliderValue] = useState(DEFAULT_SLIDER_VALUE);
	const [rangeSliderValue, setRangeSliderValue] = useState<[number, number]>([
		DEFAULT_RANGE_SLIDER_START,
		DEFAULT_RANGE_SLIDER_END,
	]);
	const [segmentedValue, setSegmentedValue] = useState('option1');

	return {
		autocompleteValue,
		setAutocompleteValue,
		comboboxValue,
		setComboboxValue,
		richTextValue,
		setRichTextValue,
		sliderValue,
		setSliderValue,
		rangeSliderValue,
		setRangeSliderValue,
		segmentedValue,
		setSegmentedValue,
	};
}
