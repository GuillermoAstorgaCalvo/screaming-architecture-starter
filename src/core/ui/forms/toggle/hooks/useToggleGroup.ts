import type {
	ToggleGroupContextValue,
	ToggleGroupProps,
} from '@core/ui/forms/toggle/types/ToggleGroupTypes';
import { useCallback, useMemo, useState } from 'react';

function createSelectedValues(currentValue: string | string[]): string[] {
	if (Array.isArray(currentValue)) {
		return currentValue;
	}
	if (currentValue) {
		return [currentValue];
	}
	return [];
}

interface ToggleHandlerParams {
	toggleValue: string;
	selectedValues: string[];
	isControlled: boolean;
	setInternalValue: (value: string | string[]) => void;
	onValueChange: ToggleGroupProps['onValueChange'];
}

function handleSingleToggle(params: ToggleHandlerParams) {
	const { toggleValue, selectedValues, isControlled, setInternalValue, onValueChange } = params;
	const newValue = selectedValues.includes(toggleValue) ? '' : toggleValue;
	if (!isControlled) {
		setInternalValue(newValue);
	}
	onValueChange?.(newValue);
}

function handleMultipleToggle(params: ToggleHandlerParams) {
	const { toggleValue, selectedValues, isControlled, setInternalValue, onValueChange } = params;
	const newValues = selectedValues.includes(toggleValue)
		? selectedValues.filter(v => v !== toggleValue)
		: [...selectedValues, toggleValue];
	if (!isControlled) {
		setInternalValue(newValues);
	}
	onValueChange?.(newValues);
}

interface CreateToggleHandlerParams {
	type: ToggleGroupProps['type'];
	selectedValues: string[];
	isControlled: boolean;
	setInternalValue: (value: string | string[]) => void;
	onValueChange: ToggleGroupProps['onValueChange'];
}

function createToggleHandler(params: CreateToggleHandlerParams) {
	return (toggleValue: string) => {
		const handlerParams = {
			toggleValue,
			selectedValues: params.selectedValues,
			isControlled: params.isControlled,
			setInternalValue: params.setInternalValue,
			onValueChange: params.onValueChange,
		};
		if (params.type === 'single') {
			handleSingleToggle(handlerParams);
		} else {
			handleMultipleToggle(handlerParams);
		}
	};
}

function useToggleGroupValue(
	type: ToggleGroupProps['type'],
	value: ToggleGroupProps['value'],
	onValueChange: ToggleGroupProps['onValueChange']
) {
	const isControlled = value !== undefined;
	const [internalValue, setInternalValue] = useState<string | string[]>(
		type === 'single' ? '' : []
	);

	const currentValue = isControlled ? value : internalValue;
	const selectedValues = useMemo(() => createSelectedValues(currentValue), [currentValue]);

	const handleToggle = useCallback(
		(toggleValue: string) => {
			createToggleHandler({
				type,
				selectedValues,
				isControlled,
				setInternalValue,
				onValueChange,
			})(toggleValue);
		},
		[type, selectedValues, isControlled, onValueChange]
	);

	return { selectedValues, handleToggle };
}

export function useToggleGroup({
	type = 'single',
	value,
	onValueChange,
	variant = 'default',
	size = 'md',
	disabled = false,
}: Readonly<{
	type?: ToggleGroupProps['type'];
	value?: ToggleGroupProps['value'];
	onValueChange?: ToggleGroupProps['onValueChange'];
	variant?: ToggleGroupProps['variant'];
	size?: ToggleGroupProps['size'];
	disabled?: ToggleGroupProps['disabled'];
}>): ToggleGroupContextValue {
	const { selectedValues, handleToggle } = useToggleGroupValue(type, value, onValueChange);

	return {
		type,
		selectedValues,
		handleToggle,
		variant,
		size,
		groupDisabled: disabled,
	};
}
