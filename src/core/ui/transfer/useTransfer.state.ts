import { useCallback, useState } from 'react';

/**
 * Manages controlled/uncontrolled value state
 */
export function useControlledValue(
	controlledValue: string[] | undefined,
	defaultValue: string[] | undefined,
	onChange?: (value: string[]) => void
) {
	const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue ?? []);
	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : uncontrolledValue;

	const setValue = useCallback(
		(newValue: string[]) => {
			if (isControlled) {
				onChange?.(newValue);
			} else {
				setUncontrolledValue(newValue);
				onChange?.(newValue);
			}
		},
		[isControlled, onChange]
	);

	return { currentValue, setValue };
}

/**
 * Manages transfer component state
 */
export function useTransferState() {
	const [sourceSearchValue, setSourceSearchValue] = useState('');
	const [targetSearchValue, setTargetSearchValue] = useState('');
	const [selectedSourceValues, setSelectedSourceValues] = useState<Set<string>>(new Set());
	const [selectedTargetValues, setSelectedTargetValues] = useState<Set<string>>(new Set());

	return {
		sourceSearchValue,
		targetSearchValue,
		selectedSourceValues,
		selectedTargetValues,
		setSourceSearchValue,
		setTargetSearchValue,
		setSelectedSourceValues,
		setSelectedTargetValues,
	};
}
