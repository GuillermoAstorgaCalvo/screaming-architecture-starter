import { useInlineEditHandlers } from '@core/ui/forms/inline-edit/hooks/useInlineEdit.handlers';
import { useInlineEditState } from '@core/ui/forms/inline-edit/hooks/useInlineEdit.state';
import {
	buildInlineEditReturn,
	useInlineEditValue,
} from '@core/ui/forms/inline-edit/hooks/useInlineEdit.utils';
import type { ChangeEvent, FocusEvent, KeyboardEvent } from 'react';

export interface UseInlineEditOptions {
	readonly value?: string;
	readonly defaultValue?: string;
	readonly onSave?: (value: string) => void;
	readonly onCancel?: () => void;
	readonly onChange?: (value: string) => void;
}

export interface UseInlineEditReturn {
	readonly isEditing: boolean;
	readonly editValue: string;
	readonly startEditing: () => void;
	readonly stopEditing: () => void;
	readonly handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
	readonly handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	readonly handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
}

/**
 * Hook to manage inline edit state and handlers
 *
 * Manages the editing state, tracks the current edit value,
 * and handles save/cancel operations.
 *
 * @param options - Configuration options for inline edit
 * @returns State and handlers for inline editing
 */
export function useInlineEdit({
	value: controlledValue,
	defaultValue,
	onSave,
	onCancel,
	onChange,
}: Readonly<UseInlineEditOptions>): UseInlineEditReturn {
	const { currentValue, getCurrentValueFn } = useInlineEditValue({
		controlledValue,
		defaultValue,
	});

	const state = useInlineEditState({ initialValue: currentValue });

	const handlers = useInlineEditHandlers({
		getCurrentValueFn,
		updateEditValue: state.updateEditValue,
		setOriginalValue: state.setOriginalValue,
		startEditingState: state.startEditingState,
		editValueRef: state.editValueRef,
		originalValueRef: state.originalValueRef,
		setIsEditing: state.setIsEditing,
		resetToOriginal: state.resetToOriginal,
		onSave,
		onCancel,
		onChange,
	});

	return buildInlineEditReturn(state, handlers);
}
