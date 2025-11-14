import { useTranslation } from '@core/i18n/useTranslation';
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

function useBodyProps(props: Readonly<AutocompleteComboboxProps>) {
	const { t } = useTranslation('common');
	return useAutocompleteComboboxSetup({
		id: props.id,
		label: props.label,
		helperText: props.helperText,
		error: props.error,
		value: props.value,
		inputValue: props.inputValue,
		options: props.options,
		disabled: props.disabled ?? false,
		required: props.required ?? false,
		placeholder: props.placeholder,
		isLoading: props.isLoading ?? false,
		loadingMessage: props.loadingMessage ?? t('loadingOptions'),
		noOptionsMessage: props.noOptionsMessage ?? t('noMatches'),
		className: props.className,
		onValueChange: props.onValueChange,
		onInputValueChange: props.onInputValueChange,
		onOptionSelect: props.onOptionSelect,
	});
}

export default function AutocompleteCombobox(props: Readonly<AutocompleteComboboxProps>) {
	return <AutocompleteComboboxBody {...useBodyProps(props)} />;
}
