import type { TransferProps } from '@src-types/ui/data/transfer';

import { useTransferComputation } from './useTransfer.computation';
import { buildTransferReturn } from './useTransfer.helpers';
import { useControlledValue, useTransferState } from './useTransfer.state';
import type { UseTransferReturn } from './useTransfer.types';

/**
 * Hook for managing Transfer component state and interactions
 */
export function useTransfer<T = unknown>(props: Readonly<TransferProps<T>>): UseTransferReturn<T> {
	const {
		options,
		value: controlledValue,
		defaultValue,
		onChange,
		showSearch = true,
		filterFn,
		disabled = false,
	} = props;

	const { currentValue, setValue } = useControlledValue(controlledValue, defaultValue, onChange);
	const state = useTransferState();

	const computation = useTransferComputation({
		options,
		currentValue,
		state,
		setValue,
		showSearch,
		filterFn,
		disabled,
	});

	return buildTransferReturn({
		state,
		filteredSourceOptions: computation.filteredSourceOptions,
		filteredTargetOptions: computation.filteredTargetOptions,
		handlers: computation.handlers,
		isMoveToTargetDisabled: computation.isMoveToTargetDisabled,
		isMoveToSourceDisabled: computation.isMoveToSourceDisabled,
		props,
	});
}
