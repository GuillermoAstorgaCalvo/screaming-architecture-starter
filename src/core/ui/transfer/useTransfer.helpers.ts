import type { BuildTransferReturnParams, UseTransferReturn } from './useTransfer.types';

/**
 * Builds the return value for useTransfer hook
 */
export function buildTransferReturn<T>(params: BuildTransferReturnParams<T>): UseTransferReturn<T> {
	const {
		state,
		filteredSourceOptions,
		filteredTargetOptions,
		handlers,
		isMoveToTargetDisabled,
		isMoveToSourceDisabled,
		props,
	} = params;
	return {
		sourceOptions: filteredSourceOptions,
		targetOptions: filteredTargetOptions,
		selectedSourceValues: state.selectedSourceValues,
		selectedTargetValues: state.selectedTargetValues,
		sourceSearchValue: state.sourceSearchValue,
		targetSearchValue: state.targetSearchValue,
		handleSourceSearchChange: handlers.handleSourceSearchChange,
		handleTargetSearchChange: handlers.handleTargetSearchChange,
		handleSourceItemToggle: handlers.handleSourceItemToggle,
		handleTargetItemToggle: handlers.handleTargetItemToggle,
		handleSourceSelectAll: handlers.handleSourceSelectAll,
		handleSourceSelectNone: handlers.handleSourceSelectNone,
		handleTargetSelectAll: handlers.handleTargetSelectAll,
		handleTargetSelectNone: handlers.handleTargetSelectNone,
		handleMoveToTarget: handlers.handleMoveToTarget,
		handleMoveToSource: handlers.handleMoveToSource,
		isMoveToTargetDisabled,
		isMoveToSourceDisabled,
		props,
	};
}
