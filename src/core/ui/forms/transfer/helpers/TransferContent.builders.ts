import type {
	extractTransferProps,
	getActionLabels,
	getListLabels,
} from '@core/ui/forms/transfer/helpers/TransferContent.helpers';
import type {
	RenderActionsProps,
	RenderSourceListProps,
	RenderTargetListProps,
} from '@core/ui/forms/transfer/types/TransferContent.types';
import type { UseTransferReturn } from '@core/ui/forms/transfer/types/useTransfer.types';

/**
 * Builds props for the source list component
 */
export function buildSourceListProps<T>(
	transferData: UseTransferReturn<T>,
	transferProps: ReturnType<typeof extractTransferProps<T>>,
	listLabels: ReturnType<typeof getListLabels>
): RenderSourceListProps<T> {
	return {
		sourceOptions: transferData.sourceOptions,
		selectedSourceValues: transferData.selectedSourceValues,
		sourceSearchValue: transferData.sourceSearchValue,
		handleSourceSearchChange: transferData.handleSourceSearchChange,
		handleSourceItemToggle: transferData.handleSourceItemToggle,
		handleSourceSelectAll: transferData.handleSourceSelectAll,
		handleSourceSelectNone: transferData.handleSourceSelectNone,
		sourceTitle: transferProps.sourceTitle,
		searchPlaceholder: transferProps.searchPlaceholder,
		showSearch: transferProps.showSearch,
		size: transferProps.size,
		disabled: transferProps.disabled,
		renderItem: transferProps.renderItem,
		renderEmpty: transferProps.renderEmpty,
		maxHeight: transferProps.maxHeight,
		showSelectAll: transferProps.showSelectAll,
		listLabels,
	};
}

/**
 * Builds props for the target list component
 */
export function buildTargetListProps<T>(
	transferData: UseTransferReturn<T>,
	transferProps: ReturnType<typeof extractTransferProps<T>>,
	listLabels: ReturnType<typeof getListLabels>
): RenderTargetListProps<T> {
	return {
		targetOptions: transferData.targetOptions,
		selectedTargetValues: transferData.selectedTargetValues,
		targetSearchValue: transferData.targetSearchValue,
		handleTargetSearchChange: transferData.handleTargetSearchChange,
		handleTargetItemToggle: transferData.handleTargetItemToggle,
		handleTargetSelectAll: transferData.handleTargetSelectAll,
		handleTargetSelectNone: transferData.handleTargetSelectNone,
		targetTitle: transferProps.targetTitle,
		searchPlaceholder: transferProps.searchPlaceholder,
		showSearch: transferProps.showSearch,
		size: transferProps.size,
		disabled: transferProps.disabled,
		renderItem: transferProps.renderItem,
		renderEmpty: transferProps.renderEmpty,
		maxHeight: transferProps.maxHeight,
		showSelectAll: transferProps.showSelectAll,
		listLabels,
	};
}

/**
 * Builds props for the actions component
 */
export function buildActionsProps<T>(
	transferData: UseTransferReturn<T>,
	transferProps: ReturnType<typeof extractTransferProps<T>>,
	actionLabels: ReturnType<typeof getActionLabels>
): RenderActionsProps {
	return {
		handleMoveToTarget: transferData.handleMoveToTarget,
		handleMoveToSource: transferData.handleMoveToSource,
		isMoveToTargetDisabled: transferData.isMoveToTargetDisabled,
		isMoveToSourceDisabled: transferData.isMoveToSourceDisabled,
		size: transferProps.size,
		disabled: transferProps.disabled,
		actionLabels,
	};
}
