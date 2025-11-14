import { classNames } from '@core/utils/classNames';
import type { AutocompleteOption } from '@domains/shared/components/autocomplete-combobox/AutocompleteCombobox';
import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

import AutocompleteComboboxField from './AutocompleteComboboxField';
import AutocompleteListbox from './AutocompleteComboboxParts';

interface AutocompleteComboboxBodyProps {
	readonly className?: string | undefined;
	readonly containerRef: RefObject<HTMLDivElement | null>;
	readonly comboboxId: string;
	readonly labelId?: string | undefined;
	readonly label?: string | undefined;
	readonly resolvedInputValue: string;
	readonly placeholder?: string | undefined;
	readonly helperText?: string | undefined;
	readonly helperId?: string | undefined;
	readonly error?: string | undefined;
	readonly errorId?: string | undefined;
	readonly disabled: boolean;
	readonly required: boolean;
	readonly isOpen: boolean;
	readonly listboxId: string;
	readonly activeDescendant?: string | undefined;
	readonly ownedIds?: string | undefined;
	readonly filteredOptions: AutocompleteOption[];
	readonly highlightedIndex: number;
	readonly selectedValue?: string | undefined;
	readonly isLoading: boolean;
	readonly loadingMessage: string;
	readonly noOptionsMessage: string;
	readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly onFocus: () => void;
	readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	readonly onSelect: (option: AutocompleteOption) => void;
}

function buildFieldProps(props: Readonly<AutocompleteComboboxBodyProps>) {
	return {
		id: props.comboboxId,
		labelId: props.labelId,
		label: props.label,
		value: props.resolvedInputValue,
		placeholder: props.placeholder,
		helperText: props.helperText,
		helperId: props.helperId,
		error: props.error,
		errorId: props.errorId,
		disabled: props.disabled,
		required: props.required,
		isOpen: props.isOpen,
		listboxId: props.listboxId,
		activeDescendant: props.activeDescendant,
		ownedIds: props.ownedIds,
		onChange: props.onChange,
		onFocus: props.onFocus,
		onKeyDown: props.onKeyDown,
	};
}

function buildListboxProps(props: Readonly<AutocompleteComboboxBodyProps>) {
	return {
		id: props.listboxId,
		labelId: props.labelId,
		options: props.filteredOptions,
		selectedValue: props.selectedValue,
		highlightedIndex: props.highlightedIndex,
		isLoading: props.isLoading,
		loadingMessage: props.loadingMessage,
		noOptionsMessage: props.noOptionsMessage,
		onSelect: props.onSelect,
	};
}

export default function AutocompleteComboboxBody(props: Readonly<AutocompleteComboboxBodyProps>) {
	const { className, containerRef, isOpen } = props;
	const fieldProps = buildFieldProps(props);
	const listboxProps = buildListboxProps(props);

	return (
		<div className={classNames('relative w-full', className)} ref={containerRef}>
			<AutocompleteComboboxField {...fieldProps} />
			{isOpen ? <AutocompleteListbox {...listboxProps} /> : null}
		</div>
	);
}
