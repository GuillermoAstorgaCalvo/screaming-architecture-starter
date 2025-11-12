import { useState } from 'react';

export interface UseRatingStateParams {
	controlledValue?: number | undefined;
	defaultValue?: number | undefined;
}

export const useRatingState = ({ controlledValue, defaultValue }: UseRatingStateParams) => {
	const [internalValue, setInternalValue] = useState(defaultValue ?? 0);
	const [hoverValue, setHoverValue] = useState<number | null>(null);

	const isControlled = controlledValue !== undefined;
	const currentValue = isControlled ? controlledValue : internalValue;
	const displayValue = hoverValue ?? currentValue;

	return {
		internalValue,
		setInternalValue,
		hoverValue,
		setHoverValue,
		isControlled,
		currentValue,
		displayValue,
	};
};
