import {
	buildActionsProps,
	buildSourceListProps,
	buildTargetListProps,
} from './TransferContent.builders';
import {
	extractTransferProps,
	getActionLabels,
	getContainerClasses,
	getListLabels,
} from './TransferContent.helpers';
import { renderActions, renderSourceList, renderTargetList } from './TransferContent.renderers';
import type { TransferContentProps } from './TransferContent.types';

/**
 * TransferContent - Main content component for Transfer
 */
export function TransferContent<T = unknown>(transferData: Readonly<TransferContentProps<T>>) {
	const transferProps = extractTransferProps(transferData.props);
	const containerClasses = getContainerClasses(transferProps.size, transferProps.className);
	const listLabels = getListLabels(transferProps.labels);
	const actionLabels = getActionLabels(transferProps.labels);

	const sourceListProps = buildSourceListProps(transferData, transferProps, listLabels);
	const targetListProps = buildTargetListProps(transferData, transferProps, listLabels);
	const actionsProps = buildActionsProps(transferData, transferProps, actionLabels);

	return (
		<div
			{...transferProps.restProps}
			className={containerClasses}
			id={transferProps.transferId}
			aria-label="Transfer list"
		>
			{renderSourceList(sourceListProps)}
			{renderActions(actionsProps)}
			{renderTargetList(targetListProps)}
		</div>
	);
}
