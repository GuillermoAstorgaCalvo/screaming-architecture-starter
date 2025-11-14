import { useTranslation } from '@core/i18n/useTranslation';
import {
	buildActionsProps,
	buildSourceListProps,
	buildTargetListProps,
} from '@core/ui/forms/transfer/helpers/TransferContent.builders';
import {
	extractTransferProps,
	getActionLabels,
	getContainerClasses,
	getListLabels,
} from '@core/ui/forms/transfer/helpers/TransferContent.helpers';
import {
	renderActions,
	renderSourceList,
	renderTargetList,
} from '@core/ui/forms/transfer/helpers/TransferContent.renderers';
import type { TransferContentProps } from '@core/ui/forms/transfer/types/TransferContent.types';

/**
 * TransferContent - Main content component for Transfer
 */
export function TransferContent<T = unknown>(transferData: Readonly<TransferContentProps<T>>) {
	const { t } = useTranslation('common');
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
			aria-label={t('a11y.transferList')}
		>
			{renderSourceList(sourceListProps)}
			{renderActions(actionsProps)}
			{renderTargetList(targetListProps)}
		</div>
	);
}
