import { buildTransferReturn } from '@core/ui/forms/transfer/helpers/useTransfer.helpers';
import { useTransferComputation } from '@core/ui/forms/transfer/hooks/useTransfer.computation';
import {
	useControlledValue,
	useTransferState,
} from '@core/ui/forms/transfer/hooks/useTransfer.state';
import type { UseTransferReturn } from '@core/ui/forms/transfer/types/useTransfer.types';
import type { TransferProps } from '@src-types/ui/data/transfer';

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
