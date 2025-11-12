import { useCallback } from 'react';

import { useRatingState } from './useRatingState';

export interface UseRatingHandlersParams {
	readOnly: boolean;
	disabled: boolean;
	isControlled: boolean;
	setInternalValue: (value: number) => void;
	setHoverValue: (value: number | null) => void;
	onChange?: ((value: number) => void) | undefined;
}

export const useRatingHandlers = ({
	readOnly,
	disabled,
	isControlled,
	setInternalValue,
	setHoverValue,
	onChange,
}: UseRatingHandlersParams) => {
	const handleStarClick = useCallback(
		(starIndex: number) => {
			if (readOnly || disabled) return;

			const newValue = starIndex + 1;
			if (!isControlled) {
				setInternalValue(newValue);
			}
			onChange?.(newValue);
		},
		[readOnly, disabled, isControlled, onChange, setInternalValue]
	);

	const handleStarHover = useCallback(
		(starIndex: number) => {
			if (readOnly || disabled) return;
			setHoverValue(starIndex + 1);
		},
		[readOnly, disabled, setHoverValue]
	);

	const handleMouseLeave = useCallback(() => {
		if (readOnly || disabled) return;
		setHoverValue(null);
	}, [readOnly, disabled, setHoverValue]);

	return { handleStarClick, handleStarHover, handleMouseLeave };
};

export interface UseRatingStateAndHandlersParams {
	controlledValue?: number | undefined;
	defaultValue?: number | undefined;
	readOnly: boolean;
	disabled: boolean;
	onChange?: ((value: number) => void) | undefined;
}

export const useRatingStateAndHandlers = ({
	controlledValue,
	defaultValue,
	readOnly,
	disabled,
	onChange,
}: UseRatingStateAndHandlersParams) => {
	const { setInternalValue, setHoverValue, currentValue, displayValue } = useRatingState({
		controlledValue,
		defaultValue,
	});
	const { handleStarClick, handleStarHover, handleMouseLeave } = useRatingHandlers({
		readOnly,
		disabled,
		isControlled: controlledValue !== undefined,
		setInternalValue,
		setHoverValue,
		onChange,
	});

	return { currentValue, displayValue, handleStarClick, handleStarHover, handleMouseLeave };
};
