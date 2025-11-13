import { type ChangeEvent, type FocusEvent, type KeyboardEvent, useCallback } from 'react';

import type { useInlineEditHandlers } from './useInlineEdit.handlers';
import type { UseInlineEditStateReturn } from './useInlineEdit.state';

// Value utility functions
export function getCurrentValue(controlledValue?: string, defaultValue?: string): string {
	return controlledValue ?? defaultValue ?? '';
}

export function trimValue(value: string): string {
	return value.trim();
}

export function shouldSaveOnBlur(
	editValue: string,
	originalValue: string,
	onCancel?: () => void
): boolean {
	return editValue !== originalValue || !onCancel;
}

// Value initialization
export function useInlineEditValue({
	controlledValue,
	defaultValue,
}: {
	readonly controlledValue?: string | undefined;
	readonly defaultValue?: string | undefined;
}) {
	const currentValue = getCurrentValue(controlledValue, defaultValue);
	const getCurrentValueFn = useCallback(
		() => getCurrentValue(controlledValue, defaultValue),
		[controlledValue, defaultValue]
	);
	return { currentValue, getCurrentValueFn };
}

// Return value construction
export function buildInlineEditReturn(
	state: Pick<UseInlineEditStateReturn, 'isEditing' | 'editValue' | 'stopEditing'>,
	handlers: ReturnType<typeof useInlineEditHandlers>
) {
	return {
		isEditing: state.isEditing,
		editValue: state.editValue,
		startEditing: handlers.startEditing,
		stopEditing: state.stopEditing,
		handleChange: handlers.handleChange,
		handleKeyDown: handlers.handleKeyDown,
		handleBlur: handlers.handleBlur,
	} as {
		readonly isEditing: boolean;
		readonly editValue: string;
		readonly startEditing: () => void;
		readonly stopEditing: () => void;
		readonly handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
		readonly handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
		readonly handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
	};
}
