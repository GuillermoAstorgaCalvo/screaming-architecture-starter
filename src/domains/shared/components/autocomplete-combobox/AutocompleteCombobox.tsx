import AutocompleteComboboxBody from '@domains/shared/components/autocomplete-combobox/components/AutocompleteComboboxBody';
import { useAutocompleteComboboxSetup } from '@domains/shared/components/autocomplete-combobox/hooks/useAutocompleteComboboxSetup';
import type { ReactNode } from 'react';

export interface AutocompleteOption {
	readonly value: string;
	readonly label: string;
	readonly description?: string;
	readonly icon?: ReactNode;
	readonly disabled?: boolean;
	readonly keywords?: string[];
}

export interface AutocompleteComboboxProps {
	readonly id?: string;
	readonly label?: string;
	readonly value?: string;
	readonly inputValue?: string;
	readonly placeholder?: string;
	readonly helperText?: string;
	readonly error?: string;
	readonly disabled?: boolean;
	readonly required?: boolean;
	readonly options: AutocompleteOption[];
	readonly onValueChange?: (value: string | undefined) => void;
	readonly onInputValueChange?: (value: string) => void;
	readonly onOptionSelect?: (option: AutocompleteOption | undefined) => void;
	readonly noOptionsMessage?: string;
	readonly loadingMessage?: string;
	readonly isLoading?: boolean;
	readonly className?: string;
}

export default function AutocompleteCombobox({
	id,
	label,
	value,
	inputValue,
	placeholder,
	helperText,
	error,
	disabled = false,
	required = false,
	options,
	onValueChange,
	onInputValueChange,
	onOptionSelect,
	noOptionsMessage = 'No matches',
	loadingMessage = 'Loading options…',
	isLoading = false,
	className,
}: Readonly<AutocompleteComboboxProps>) {
	const bodyProps = useAutocompleteComboboxSetup({
		id,
		label,
		helperText,
		error,
		value,
		inputValue,
		options,
		disabled,
		required,
		placeholder,
		isLoading,
		loadingMessage,
		noOptionsMessage,
		className,
		onValueChange,
		onInputValueChange,
		onOptionSelect,
	});

	return <AutocompleteComboboxBody {...bodyProps} />;
}
