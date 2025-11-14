import HelperText from '@core/ui/helper-text/HelperText';
import Label from '@core/ui/label/Label';
import Text from '@core/ui/text/Text';
import { classNames } from '@core/utils/classNames';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface AutocompleteComboboxFieldProps {
	readonly id: string;
	readonly labelId?: string | undefined;
	readonly label?: string | undefined;
	readonly value: string;
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
	readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly onFocus: () => void;
	readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

interface ComboboxInputProps {
	readonly id: string;
	readonly value: string;
	readonly placeholder?: string | undefined;
	readonly disabled: boolean;
	readonly required: boolean;
	readonly isOpen: boolean;
	readonly listboxId: string;
	readonly activeDescendant?: string | undefined;
	readonly ownedIds?: string | undefined;
	readonly error?: string | undefined;
	readonly onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	readonly onFocus: () => void;
	readonly onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

function getComboboxInputClassName(error?: string): string {
	return classNames(
		'w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
		error ? 'border-destructive focus:ring-destructive' : ''
	);
}

function getComboboxInputAriaProps(
	listboxId: string,
	isOpen: boolean,
	activeDescendant?: string,
	ownedIds?: string,
	error?: string
) {
	return {
		role: 'combobox' as const,
		'aria-controls': listboxId,
		'aria-expanded': isOpen,
		'aria-autocomplete': 'list' as const,
		'aria-activedescendant': activeDescendant,
		'aria-describedby': ownedIds,
		'aria-invalid': Boolean(error),
	};
}

function buildInputProps(props: Readonly<AutocompleteComboboxFieldProps>): ComboboxInputProps {
	return {
		id: props.id,
		value: props.value,
		placeholder: props.placeholder,
		disabled: props.disabled,
		required: props.required,
		isOpen: props.isOpen,
		listboxId: props.listboxId,
		activeDescendant: props.activeDescendant,
		ownedIds: props.ownedIds,
		error: props.error,
		onChange: props.onChange,
		onFocus: props.onFocus,
		onKeyDown: props.onKeyDown,
	};
}

function ComboboxInput(props: Readonly<ComboboxInputProps>) {
	const {
		id,
		value,
		placeholder,
		disabled,
		required,
		isOpen,
		listboxId,
		activeDescendant,
		ownedIds,
		error,
		onChange,
		onFocus,
		onKeyDown,
	} = props;

	const className = getComboboxInputClassName(error);
	const ariaProps = getComboboxInputAriaProps(listboxId, isOpen, activeDescendant, ownedIds, error);

	return (
		<input
			id={id}
			type="text"
			value={value}
			placeholder={placeholder}
			disabled={disabled}
			required={required}
			{...ariaProps}
			className={className}
			onChange={onChange}
			onFocus={onFocus}
			onKeyDown={onKeyDown}
			autoComplete="off"
		/>
	);
}

function renderFieldLabel(
	id: string,
	labelId: string | undefined,
	label: string | undefined,
	required: boolean
) {
	if (!label) return null;
	return (
		<Label id={labelId} htmlFor={id} size="sm" required={required}>
			{label}
		</Label>
	);
}

function renderHelperText(helperText: string | undefined, helperId: string | undefined) {
	if (!helperText || !helperId) return null;
	return (
		<HelperText id={helperId} size="sm">
			{helperText}
		</HelperText>
	);
}

function renderErrorText(error: string | undefined, errorId: string | undefined) {
	if (!error || !errorId) return null;
	return (
		<Text id={errorId} size="sm" className="text-destructive">
			{error}
		</Text>
	);
}

export default function AutocompleteComboboxField(props: Readonly<AutocompleteComboboxFieldProps>) {
	const { id, labelId, label, helperText, helperId, error, errorId, required } = props;
	const inputProps = buildInputProps(props);

	return (
		<div className="flex flex-col gap-1">
			{renderFieldLabel(id, labelId, label, required)}
			<ComboboxInput {...inputProps} />
			{renderHelperText(helperText, helperId)}
			{renderErrorText(error, errorId)}
		</div>
	);
}
