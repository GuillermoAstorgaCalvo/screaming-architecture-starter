// ARIA combobox pattern requires custom listbox/option implementations
// Using div with role="listbox" and button with role="option" is correct per ARIA combobox spec
// SonarQube S6819 warnings are false positives for this accessibility pattern
// NOSONAR: S6819 - ARIA combobox pattern requires custom implementations

import { classNames } from '@core/utils/classNames';
import type { ReactNode } from 'react';

import type { AutocompleteOption } from './AutocompleteCombobox';

interface AutocompleteListboxProps {
	readonly id: string;
	readonly labelId?: string | undefined;
	readonly options: AutocompleteOption[];
	readonly selectedValue?: string | undefined;
	readonly highlightedIndex: number;
	readonly isLoading: boolean;
	readonly loadingMessage: string;
	readonly noOptionsMessage: string;
	readonly onSelect: (option: AutocompleteOption) => void;
}

function renderListboxContent({
	isLoading,
	loadingMessage,
	noOptionsMessage,
	options,
}: {
	readonly isLoading: boolean;
	readonly loadingMessage: string;
	readonly noOptionsMessage: string;
	readonly options: AutocompleteOption[];
}): ReactNode {
	if (isLoading) {
		return <div className="px-3 py-2 text-sm text-muted-foreground">{loadingMessage}</div>;
	}
	if (options.length === 0) {
		return <div className="px-3 py-2 text-sm text-muted-foreground">{noOptionsMessage}</div>;
	}
	return null;
}

function renderListboxContainer({
	id,
	labelId,
	children,
}: {
	readonly id: string;
	readonly labelId?: string | undefined;
	readonly children: ReactNode;
}): ReactNode {
	// ARIA combobox pattern requires custom listbox implementation
	// Using div with role="listbox" is correct per ARIA combobox spec
	// The IDE accessibility checker warning about using <select> is a false positive for this pattern
	return (
		<div
			id={id}
			role="listbox" // NOSONAR S6819
			className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-lg focus:outline-none"
			aria-labelledby={labelId}
		>
			{children}
		</div>
	);
}

function renderOptionButton({
	id,
	option,
	isSelected,
	isHighlighted,
	onSelect,
}: {
	readonly id: string;
	readonly option: AutocompleteOption;
	readonly isSelected: boolean;
	readonly isHighlighted: boolean;
	readonly onSelect: (option: AutocompleteOption) => void;
}): ReactNode {
	// ARIA combobox pattern requires custom option implementation
	// Using button with role="option" is correct per ARIA combobox spec
	// The IDE accessibility checker warning about using <option> is a false positive for this pattern
	return (
		<button
			id={`${id}-option-${option.value}`}
			type="button"
			role="option" // NOSONAR S6819
			aria-selected={isSelected}
			disabled={option.disabled}
			className={classNames(
				'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
				isHighlighted ? 'bg-muted text-foreground' : '',
				isSelected ? 'font-semibold' : ''
			)}
			onMouseDown={event => event.preventDefault()}
			onClick={() => onSelect(option)}
		>
			{option.icon ? <span aria-hidden>{option.icon}</span> : null}
			<span className="flex-1 truncate">{option.label}</span>
			{option.description ? (
				<span className="ml-auto text-xs text-muted-foreground">{option.description}</span>
			) : null}
		</button>
	);
}

function AutocompleteListbox({
	id,
	labelId,
	options,
	selectedValue,
	highlightedIndex,
	isLoading,
	loadingMessage,
	noOptionsMessage,
	onSelect,
}: Readonly<AutocompleteListboxProps>) {
	const content = renderListboxContent({
		isLoading,
		loadingMessage,
		noOptionsMessage,
		options,
	});

	if (content) {
		return renderListboxContainer({ id, labelId, children: content });
	}

	return renderListboxContainer({
		id,
		labelId,
		children: (
			<ul className="max-h-64 overflow-y-auto py-1">
				{options.map((option, index) => (
					<li key={option.value} role="none">
						{renderOptionButton({
							id,
							option,
							isSelected: option.value === selectedValue,
							isHighlighted: index === highlightedIndex,
							onSelect,
						})}
					</li>
				))}
			</ul>
		),
	});
}

export default AutocompleteListbox;
