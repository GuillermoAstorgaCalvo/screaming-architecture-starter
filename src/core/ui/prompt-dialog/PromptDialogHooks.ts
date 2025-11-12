import { useCallback, useMemo, useState } from 'react';

import { createCancelHandler, createConfirmHandler } from './PromptDialogHelpers';

interface UsePromptDialogStateOptions {
	defaultValue: string;
	onClose: () => void;
	validate?: ((value: string) => string | undefined) | undefined;
	required: boolean;
	onConfirm?: ((value: string) => void | Promise<void>) | undefined;
	onCancel?: (() => void) | undefined;
}

interface HandlerCreationParams {
	value: string;
	validate: ((value: string) => string | undefined) | undefined;
	required: boolean;
	onConfirm: ((value: string) => void | Promise<void>) | undefined;
	onCancel: (() => void) | undefined;
	handleClose: () => void;
	setError: (error: string | undefined) => void;
}

/**
 * Hook to create confirm and cancel handlers
 */
function useActionHandlers({
	value,
	validate,
	required,
	onConfirm,
	onCancel,
	handleClose,
	setError,
}: HandlerCreationParams) {
	const handleConfirm = useMemo(
		() =>
			createConfirmHandler({
				value,
				validate,
				required,
				onConfirm,
				onClose: handleClose,
				setError,
			}),
		[value, validate, required, onConfirm, handleClose, setError]
	);

	const handleCancel = useMemo(
		() => createCancelHandler(onCancel, handleClose),
		[onCancel, handleClose]
	);

	return { handleConfirm, handleCancel };
}

/**
 * Custom hook to manage prompt dialog state and handlers
 */
export function usePromptDialogState({
	defaultValue,
	onClose,
	validate,
	required,
	onConfirm,
	onCancel,
}: UsePromptDialogStateOptions) {
	const [value, setValue] = useState(defaultValue);
	const [error, setError] = useState<string | undefined>(undefined);

	const handleClose = useCallback(() => {
		setValue(defaultValue);
		setError(undefined);
		onClose();
	}, [defaultValue, onClose]);

	const { handleConfirm, handleCancel } = useActionHandlers({
		value,
		validate,
		required,
		onConfirm,
		onCancel,
		handleClose,
		setError,
	});

	const handleValueChange = useCallback((newValue: string) => {
		setValue(newValue);
		setError(undefined);
	}, []);

	return {
		value,
		error,
		handleClose,
		handleConfirm,
		handleCancel,
		handleValueChange,
	};
}
