import { type ChangeEvent, useCallback } from 'react';

export interface InputCallbacks {
	readonly updateInputValue: (value: string) => void;
	readonly handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export interface InputCallbacksParams {
	readonly isInputControlled: boolean;
	readonly isOpen: boolean;
	readonly setInternalInputValue: (value: string) => void;
	readonly onInputValueChange?: ((value: string) => void) | undefined;
	readonly openList: () => void;
}

export function useInputCallbacks(params: InputCallbacksParams): InputCallbacks {
	const { isInputControlled, isOpen, setInternalInputValue, onInputValueChange, openList } = params;
	const updateInputValue = useCallback(
		(nextValue: string) => {
			if (!isInputControlled) {
				setInternalInputValue(nextValue);
			}
			onInputValueChange?.(nextValue);
		},
		[isInputControlled, onInputValueChange, setInternalInputValue]
	);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const nextValue = event.target.value;
			updateInputValue(nextValue);
			if (!isOpen) {
				openList();
			}
		},
		[isOpen, openList, updateInputValue]
	);

	return { updateInputValue, handleChange };
}
