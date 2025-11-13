import type { MoveHandlersParams } from '@core/ui/forms/transfer/types/useTransfer.types';
import { useCallback } from 'react';

interface MoveToTargetParams {
	readonly disabled: boolean;
	readonly currentValue: string[];
	readonly selectedSourceValues: Set<string>;
	readonly setValue: (value: string[]) => void;
	readonly setSelectedSourceValues: (value: Set<string>) => void;
	readonly setSourceSearchValue: (value: string) => void;
}

/**
 * Creates a handler for moving items from source to target
 */
function useMoveToTargetHandler(params: MoveToTargetParams) {
	const {
		disabled,
		currentValue,
		selectedSourceValues,
		setValue,
		setSelectedSourceValues,
		setSourceSearchValue,
	} = params;

	return useCallback(() => {
		if (disabled || selectedSourceValues.size === 0) return;
		setValue([...currentValue, ...Array.from(selectedSourceValues)]);
		setSelectedSourceValues(new Set());
		setSourceSearchValue('');
	}, [
		disabled,
		selectedSourceValues,
		currentValue,
		setValue,
		setSelectedSourceValues,
		setSourceSearchValue,
	]);
}

interface MoveToSourceParams {
	readonly disabled: boolean;
	readonly currentValue: string[];
	readonly selectedTargetValues: Set<string>;
	readonly setValue: (value: string[]) => void;
	readonly setSelectedTargetValues: (value: Set<string>) => void;
	readonly setTargetSearchValue: (value: string) => void;
}

/**
 * Creates a handler for moving items from target to source
 */
function useMoveToSourceHandler(params: MoveToSourceParams) {
	const {
		disabled,
		currentValue,
		selectedTargetValues,
		setValue,
		setSelectedTargetValues,
		setTargetSearchValue,
	} = params;

	return useCallback(() => {
		if (disabled || selectedTargetValues.size === 0) return;
		const valuesToMove = new Set(Array.from(selectedTargetValues));
		setValue(currentValue.filter(v => !valuesToMove.has(v)));
		setSelectedTargetValues(new Set());
		setTargetSearchValue('');
	}, [
		disabled,
		selectedTargetValues,
		currentValue,
		setValue,
		setSelectedTargetValues,
		setTargetSearchValue,
	]);
}

/**
 * Creates move handlers for transferring items between lists
 */
export function useMoveHandlers(params: MoveHandlersParams) {
	const {
		disabled,
		currentValue,
		selectedSourceValues,
		selectedTargetValues,
		setValue,
		setSelectedSourceValues,
		setSelectedTargetValues,
		setSourceSearchValue,
		setTargetSearchValue,
	} = params;

	const handleMoveToTarget = useMoveToTargetHandler({
		disabled,
		currentValue,
		selectedSourceValues,
		setValue,
		setSelectedSourceValues,
		setSourceSearchValue,
	});

	const handleMoveToSource = useMoveToSourceHandler({
		disabled,
		currentValue,
		selectedTargetValues,
		setValue,
		setSelectedTargetValues,
		setTargetSearchValue,
	});

	return { handleMoveToTarget, handleMoveToSource };
}
