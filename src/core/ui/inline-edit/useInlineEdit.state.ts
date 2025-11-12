import { useCallback, useEffect, useRef, useState } from 'react';

// State management functions
export function useEditingState() {
	const [isEditing, setIsEditing] = useState(false);
	const startEditing = useCallback(() => setIsEditing(true), []);
	const stopEditing = useCallback(() => setIsEditing(false), []);
	return { isEditing, setIsEditing, startEditing, stopEditing };
}

export function useEditValueState(initialValue: string) {
	const [editValue, setEditValue] = useState(initialValue);
	const editValueRef = useRef<string>(editValue);
	const originalValueRef = useRef<string>(initialValue);

	useEffect(() => {
		editValueRef.current = editValue;
	}, [editValue]);

	const updateEditValue = useCallback((value: string) => {
		setEditValue(value);
	}, []);

	const resetToOriginal = useCallback(() => {
		setEditValue(originalValueRef.current);
	}, []);

	const setOriginalValue = useCallback((value: string) => {
		originalValueRef.current = value;
	}, []);

	return {
		editValue,
		editValueRef,
		originalValueRef,
		updateEditValue,
		resetToOriginal,
		setOriginalValue,
	};
}

export type RefString = ReturnType<typeof useRef<string>>;

export interface UseInlineEditStateReturn {
	readonly isEditing: boolean;
	readonly setIsEditing: (value: boolean) => void;
	readonly startEditingState: () => void;
	readonly stopEditing: () => void;
	readonly editValue: string;
	readonly editValueRef: RefString;
	readonly originalValueRef: RefString;
	readonly updateEditValue: (value: string) => void;
	readonly resetToOriginal: () => void;
	readonly setOriginalValue: (value: string) => void;
}

export function useInlineEditState({
	initialValue,
}: {
	readonly initialValue: string;
}): UseInlineEditStateReturn {
	const {
		isEditing,
		setIsEditing,
		startEditing: startEditingState,
		stopEditing,
	} = useEditingState();
	const {
		editValue,
		editValueRef,
		originalValueRef,
		updateEditValue,
		resetToOriginal,
		setOriginalValue,
	} = useEditValueState(initialValue);

	return {
		isEditing,
		setIsEditing,
		startEditingState,
		stopEditing,
		editValue,
		editValueRef,
		originalValueRef,
		updateEditValue,
		resetToOriginal,
		setOriginalValue,
	};
}
