import { useMoveHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.move';
import { useSearchHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.search';
import { useSelectAllHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.selectAll';
import { useSelectionHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers.selection';
import type { TransferHandlersParams } from '@core/ui/forms/transfer/types/useTransfer.types';

/**
 * Creates all handlers for the transfer component
 */
export function useTransferHandlers<T>(params: TransferHandlersParams<T>) {
	const { disabled, currentValue, state, setValue, filteredSourceOptions, filteredTargetOptions } =
		params;

	const searchHandlers = useSearchHandlers({
		setSourceSearchValue: state.setSourceSearchValue,
		setTargetSearchValue: state.setTargetSearchValue,
		setSelectedSourceValues: state.setSelectedSourceValues,
		setSelectedTargetValues: state.setSelectedTargetValues,
	});

	const selectionHandlers = useSelectionHandlers(
		disabled,
		state.setSelectedSourceValues,
		state.setSelectedTargetValues
	);

	const selectAllHandlers = useSelectAllHandlers({
		disabled,
		filteredSourceOptions,
		filteredTargetOptions,
		setSelectedSourceValues: state.setSelectedSourceValues,
		setSelectedTargetValues: state.setSelectedTargetValues,
	});

	const moveHandlers = useMoveHandlers({
		disabled,
		currentValue,
		selectedSourceValues: state.selectedSourceValues,
		selectedTargetValues: state.selectedTargetValues,
		setValue,
		setSelectedSourceValues: state.setSelectedSourceValues,
		setSelectedTargetValues: state.setSelectedTargetValues,
		setSourceSearchValue: state.setSourceSearchValue,
		setTargetSearchValue: state.setTargetSearchValue,
	});

	return {
		...searchHandlers,
		...selectionHandlers,
		...selectAllHandlers,
		...moveHandlers,
	};
}
