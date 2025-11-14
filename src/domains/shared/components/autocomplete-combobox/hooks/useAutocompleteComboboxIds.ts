import { useId } from 'react';

interface UseAutocompleteComboboxIdsProps {
	readonly id?: string | undefined;
	readonly label?: string | undefined;
	readonly helperText?: string | undefined;
	readonly error?: string | undefined;
}

export function useAutocompleteComboboxIds({
	id,
	label,
	helperText,
	error,
}: Readonly<UseAutocompleteComboboxIdsProps>) {
	const generatedId = useId();
	const comboboxId = id ?? generatedId;
	const labelId = label ? `${comboboxId}-label` : undefined;
	const listboxId = `${comboboxId}-listbox`;
	const helperId = helperText ? `${comboboxId}-helper` : undefined;
	const errorId = error ? `${comboboxId}-error` : undefined;
	const ownedIds = [helperId, errorId].filter(Boolean).join(' ') || undefined;

	return {
		comboboxId,
		labelId,
		listboxId,
		helperId,
		errorId,
		ownedIds,
	};
}
