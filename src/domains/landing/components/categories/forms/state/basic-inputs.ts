import { useState } from 'react';

/**
 * State hook for basic input form controls
 */
export function useBasicInputsState() {
	const [inputValue, setInputValue] = useState('');
	const [textareaValue, setTextareaValue] = useState('');
	const [numberValue, setNumberValue] = useState<number | string>(0);
	const [searchValue, setSearchValue] = useState('');

	return {
		inputValue,
		setInputValue,
		textareaValue,
		setTextareaValue,
		numberValue,
		setNumberValue,
		searchValue,
		setSearchValue,
	};
}
