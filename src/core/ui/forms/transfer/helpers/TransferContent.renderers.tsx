import { TransferActions } from '@core/ui/forms/transfer/components/TransferActions';
import { TransferList } from '@core/ui/forms/transfer/components/TransferList';
import type {
	RenderActionsProps,
	RenderSourceListProps,
	RenderTargetListProps,
} from '@core/ui/forms/transfer/types/TransferContent.types';

/**
 * Renders the source list component
 */
export function renderSourceList<T>(props: RenderSourceListProps<T>) {
	return (
		<TransferList
			type="source"
			options={props.sourceOptions}
			selectedValues={props.selectedSourceValues}
			searchValue={props.sourceSearchValue}
			onSearchChange={props.handleSourceSearchChange}
			onItemToggle={props.handleSourceItemToggle}
			onSelectAll={props.handleSourceSelectAll}
			onSelectNone={props.handleSourceSelectNone}
			title={props.sourceTitle}
			searchPlaceholder={props.searchPlaceholder}
			showSearch={props.showSearch}
			size={props.size}
			disabled={props.disabled}
			{...(props.renderItem !== undefined && { renderItem: props.renderItem })}
			{...(props.renderEmpty !== undefined && { renderEmpty: props.renderEmpty })}
			maxHeight={props.maxHeight}
			showSelectAll={props.showSelectAll}
			labels={props.listLabels}
		/>
	);
}

/**
 * Renders the target list component
 */
export function renderTargetList<T>(props: RenderTargetListProps<T>) {
	return (
		<TransferList
			type="target"
			options={props.targetOptions}
			selectedValues={props.selectedTargetValues}
			searchValue={props.targetSearchValue}
			onSearchChange={props.handleTargetSearchChange}
			onItemToggle={props.handleTargetItemToggle}
			onSelectAll={props.handleTargetSelectAll}
			onSelectNone={props.handleTargetSelectNone}
			title={props.targetTitle}
			searchPlaceholder={props.searchPlaceholder}
			showSearch={props.showSearch}
			size={props.size}
			disabled={props.disabled}
			{...(props.renderItem !== undefined && { renderItem: props.renderItem })}
			{...(props.renderEmpty !== undefined && { renderEmpty: props.renderEmpty })}
			maxHeight={props.maxHeight}
			showSelectAll={props.showSelectAll}
			labels={props.listLabels}
		/>
	);
}

/**
 * Renders the transfer actions component
 */
export function renderActions(props: RenderActionsProps) {
	return (
		<TransferActions
			onMoveToTarget={props.handleMoveToTarget}
			onMoveToSource={props.handleMoveToSource}
			isMoveToTargetDisabled={props.isMoveToTargetDisabled}
			isMoveToSourceDisabled={props.isMoveToSourceDisabled}
			size={props.size}
			disabled={props.disabled}
			labels={props.actionLabels}
		/>
	);
}
