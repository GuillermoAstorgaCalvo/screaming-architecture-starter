import {
	computeSourceAndTargetOptions,
	filterOptions,
} from '@core/ui/forms/transfer/helpers/useTransfer.utils';
import { useTransferHandlers } from '@core/ui/forms/transfer/hooks/useTransfer.handlers';
import type {
	ComputedDisabledStatesParams,
	FilteredOptionsParams,
	TransferComputationParams,
	TransferComputationResult,
} from '@core/ui/forms/transfer/types/useTransfer.types';
import { useMemo } from 'react';

/**
 * Computes disabled states for move buttons
 */
export function useComputedDisabledStates<T>(params: ComputedDisabledStatesParams<T>) {
	const {
		disabled,
		selectedSourceValues,
		selectedTargetValues,
		filteredSourceOptions,
		filteredTargetOptions,
	} = params;

	const isMoveToTargetDisabled = useMemo(
		() => disabled || selectedSourceValues.size === 0 || filteredSourceOptions.length === 0,
		[disabled, selectedSourceValues.size, filteredSourceOptions.length]
	);

	const isMoveToSourceDisabled = useMemo(
		() => disabled || selectedTargetValues.size === 0 || filteredTargetOptions.length === 0,
		[disabled, selectedTargetValues.size, filteredTargetOptions.length]
	);

	return { isMoveToTargetDisabled, isMoveToSourceDisabled };
}

/**
 * Computes filtered options for both source and target
 */
export function useFilteredOptions<T>(params: FilteredOptionsParams<T>) {
	const {
		sourceOptions,
		targetOptions,
		sourceSearchValue,
		targetSearchValue,
		showSearch,
		filterFn,
	} = params;

	const filteredSourceOptions = useMemo(
		() =>
			filterOptions({
				options: sourceOptions,
				searchValue: sourceSearchValue,
				showSearch,
				...(filterFn && { filterFn }),
			}),
		[sourceOptions, sourceSearchValue, showSearch, filterFn]
	);

	const filteredTargetOptions = useMemo(
		() =>
			filterOptions({
				options: targetOptions,
				searchValue: targetSearchValue,
				showSearch,
				...(filterFn && { filterFn }),
			}),
		[targetOptions, targetSearchValue, showSearch, filterFn]
	);

	return { filteredSourceOptions, filteredTargetOptions };
}

/**
 * Computes all derived values and handlers for the transfer component
 */
export function useTransferComputation<T>(
	params: TransferComputationParams<T>
): TransferComputationResult<T> {
	const { options, currentValue, state, setValue, showSearch, filterFn, disabled } = params;

	const { sourceOptions, targetOptions } = useMemo(
		() => computeSourceAndTargetOptions(options, currentValue),
		[options, currentValue]
	);

	const { filteredSourceOptions, filteredTargetOptions } = useFilteredOptions({
		sourceOptions,
		targetOptions,
		sourceSearchValue: state.sourceSearchValue,
		targetSearchValue: state.targetSearchValue,
		showSearch,
		...(filterFn && { filterFn }),
	});

	const handlers = useTransferHandlers({
		disabled,
		currentValue,
		state,
		setValue,
		filteredSourceOptions,
		filteredTargetOptions,
	});

	const { isMoveToTargetDisabled, isMoveToSourceDisabled } = useComputedDisabledStates({
		disabled,
		selectedSourceValues: state.selectedSourceValues,
		selectedTargetValues: state.selectedTargetValues,
		filteredSourceOptions,
		filteredTargetOptions,
	});

	return {
		filteredSourceOptions,
		filteredTargetOptions,
		handlers,
		isMoveToTargetDisabled,
		isMoveToSourceDisabled,
	};
}
