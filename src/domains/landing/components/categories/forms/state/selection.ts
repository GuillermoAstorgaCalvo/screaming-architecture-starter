import { useState } from 'react';

/**
 * State hook for selection form controls (checkboxes, radios, switches, selects, toggles)
 */
export function useSelectionState() {
	const [checkboxChecked, setCheckboxChecked] = useState(false);
	const [radioValue, setRadioValue] = useState('option1');
	const [switchChecked, setSwitchChecked] = useState(false);
	const [selectValue, setSelectValue] = useState('');
	const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
	const [togglePressed, setTogglePressed] = useState(false);
	const [toggleGroupSingle, setToggleGroupSingle] = useState<string>('option1');
	const [toggleGroupMultiple, setToggleGroupMultiple] = useState<string[]>(['opt1', 'opt2']);

	return {
		checkboxChecked,
		setCheckboxChecked,
		radioValue,
		setRadioValue,
		switchChecked,
		setSwitchChecked,
		selectValue,
		setSelectValue,
		multiSelectValue,
		setMultiSelectValue,
		togglePressed,
		setTogglePressed,
		toggleGroupSingle,
		setToggleGroupSingle,
		toggleGroupMultiple,
		setToggleGroupMultiple,
	};
}
