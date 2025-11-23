import { useState } from 'react';

import { useAdvancedState } from './state/advanced';
import { useBasicInputsState } from './state/basic-inputs';
import { useComplexFormsState } from './state/complex-forms';
import { useDateTimeState } from './state/date-time';
import { useSelectionState } from './state/selection';
import { useSpecializedState } from './state/specialized';

export interface FormsCategoryState {
	activeSubcategory: string;
	setActiveSubcategory: (value: string) => void;
	inputValue: string;
	setInputValue: (value: string) => void;
	textareaValue: string;
	setTextareaValue: (value: string) => void;
	checkboxChecked: boolean;
	setCheckboxChecked: (value: boolean) => void;
	radioValue: string;
	setRadioValue: (value: string) => void;
	switchChecked: boolean;
	setSwitchChecked: (value: boolean) => void;
	selectValue: string;
	setSelectValue: (value: string) => void;
	dateValue: string;
	setDateValue: (value: string) => void;
	emailValue: string;
	setEmailValue: (value: string) => void;
	passwordValue: string;
	setPasswordValue: (value: string) => void;
	phoneValue: string;
	setPhoneValue: (value: string) => void;
	numberValue: number | string;
	setNumberValue: (value: number | string) => void;
	searchValue: string;
	setSearchValue: (value: string) => void;
	otpValue: string;
	setOtpValue: (value: string) => void;
	ratingValue: number;
	setRatingValue: (value: number) => void;
	sliderValue: number;
	setSliderValue: (value: number) => void;
	multiSelectValue: string[];
	setMultiSelectValue: (value: string[]) => void;
	autocompleteValue: string;
	setAutocompleteValue: (value: string) => void;
	comboboxValue: string;
	setComboboxValue: (value: string) => void;
	dateRangeStart: string;
	setDateRangeStart: (value: string) => void;
	dateRangeEnd: string;
	setDateRangeEnd: (value: string) => void;
	rangeSliderValue: [number, number];
	setRangeSliderValue: (value: [number, number]) => void;
	timeValue: string;
	setTimeValue: (value: string) => void;
	richTextValue: string;
	setRichTextValue: (value: string) => void;
	segmentedValue: string;
	setSegmentedValue: (value: string) => void;
	colorInputValue: string;
	setColorInputValue: (value: string) => void;
	colorPickerValue: string;
	setColorPickerValue: (value: string) => void;
	currencyValue: string;
	setCurrencyValue: (value: string) => void;
	tagInputValue: string[];
	setTagInputValue: (value: string[]) => void;
	togglePressed: boolean;
	setTogglePressed: (value: boolean) => void;
	toggleGroupSingle: string;
	setToggleGroupSingle: (value: string) => void;
	toggleGroupMultiple: string[];
	setToggleGroupMultiple: (value: string[]) => void;
	inlineEditValue: string;
	setInlineEditValue: (value: string) => void;
	transferValue: string[];
	setTransferValue: (value: string[]) => void;
}

/**
 * Main state hook that combines all form category state hooks
 */
export function useFormsCategoryState() {
	const [activeSubcategory, setActiveSubcategory] = useState('basic-inputs');
	const basicInputs = useBasicInputsState();
	const selection = useSelectionState();
	const dateTime = useDateTimeState();
	const specialized = useSpecializedState();
	const advanced = useAdvancedState();
	const complexForms = useComplexFormsState();

	return {
		activeSubcategory,
		setActiveSubcategory,
		...basicInputs,
		...selection,
		...dateTime,
		...specialized,
		...advanced,
		...complexForms,
	};
}
