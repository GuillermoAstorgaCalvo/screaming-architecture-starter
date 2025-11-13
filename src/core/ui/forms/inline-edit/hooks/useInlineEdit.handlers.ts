import { type ChangeEvent, type FocusEvent, type KeyboardEvent, useCallback } from 'react';

import type { RefString } from './useInlineEdit.state';
import { shouldSaveOnBlur, trimValue } from './useInlineEdit.utils';

interface StartEditingParams {
	readonly getCurrentValueFn: () => string;
	readonly updateEditValue: (value: string) => void;
	readonly setOriginalValue: (value: string) => void;
	readonly startEditingState: () => void;
}

export function useStartEditingHandler(params: StartEditingParams) {
	const { getCurrentValueFn, updateEditValue, setOriginalValue, startEditingState } = params;
	return useCallback(() => {
		const v = getCurrentValueFn();
		updateEditValue(v);
		setOriginalValue(v);
		startEditingState();
	}, [getCurrentValueFn, updateEditValue, setOriginalValue, startEditingState]);
}

interface ChangeHandlerParams {
	readonly updateEditValue: (value: string) => void;
	readonly onChange?: ((value: string) => void) | undefined;
}

export function useChangeHandler(params: ChangeHandlerParams) {
	const { updateEditValue, onChange } = params;
	return useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			updateEditValue(e.target.value);
			onChange?.(e.target.value);
		},
		[updateEditValue, onChange]
	);
}

interface KeyDownHandlerParams {
	readonly editValueRef: RefString;
	readonly setIsEditing: (value: boolean) => void;
	readonly resetToOriginal: () => void;
	readonly onSave?: ((value: string) => void) | undefined;
	readonly onCancel?: (() => void) | undefined;
}

export function useKeyDownHandler(params: KeyDownHandlerParams) {
	const { editValueRef, setIsEditing, resetToOriginal, onSave, onCancel } = params;
	return useCallback(
		(e: KeyboardEvent<HTMLInputElement>) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				onSave?.(trimValue(editValueRef.current ?? ''));
				setIsEditing(false);
			} else if (e.key === 'Escape') {
				e.preventDefault();
				resetToOriginal();
				onCancel?.();
				setIsEditing(false);
			}
		},
		[editValueRef, setIsEditing, resetToOriginal, onSave, onCancel]
	);
}

interface BlurHandlerParams {
	readonly editValueRef: RefString;
	readonly originalValueRef: RefString;
	readonly setIsEditing: (value: boolean) => void;
	readonly onSave?: ((value: string) => void) | undefined;
	readonly onCancel?: (() => void) | undefined;
}

export function useBlurHandler(params: BlurHandlerParams) {
	const { editValueRef, originalValueRef, setIsEditing, onSave, onCancel } = params;
	return useCallback(
		(_e: FocusEvent<HTMLInputElement>) => {
			if (shouldSaveOnBlur(editValueRef.current ?? '', originalValueRef.current ?? '', onCancel)) {
				onSave?.(trimValue(editValueRef.current ?? ''));
			}
			setIsEditing(false);
		},
		[editValueRef, originalValueRef, setIsEditing, onSave, onCancel]
	);
}

export interface HandlerParams {
	readonly getCurrentValueFn: () => string;
	readonly updateEditValue: (value: string) => void;
	readonly setOriginalValue: (value: string) => void;
	readonly startEditingState: () => void;
	readonly editValueRef: RefString;
	readonly originalValueRef: RefString;
	readonly setIsEditing: (value: boolean) => void;
	readonly resetToOriginal: () => void;
	readonly onSave?: ((value: string) => void) | undefined;
	readonly onCancel?: (() => void) | undefined;
	readonly onChange?: ((value: string) => void) | undefined;
}

export function useInlineEditHandlers(params: HandlerParams) {
	const {
		getCurrentValueFn,
		updateEditValue,
		setOriginalValue,
		startEditingState,
		editValueRef,
		originalValueRef,
		setIsEditing,
		resetToOriginal,
		onSave,
		onCancel,
		onChange,
	} = params;

	const startEditing = useStartEditingHandler({
		getCurrentValueFn,
		updateEditValue,
		setOriginalValue,
		startEditingState,
	});

	const handleChange = useChangeHandler({
		updateEditValue,
		onChange,
	});

	const handleKeyDown = useKeyDownHandler({
		editValueRef,
		setIsEditing,
		resetToOriginal,
		onSave,
		onCancel,
	});

	const handleBlur = useBlurHandler({
		editValueRef,
		originalValueRef,
		setIsEditing,
		onSave,
		onCancel,
	});

	return { startEditing, handleChange, handleKeyDown, handleBlur };
}
