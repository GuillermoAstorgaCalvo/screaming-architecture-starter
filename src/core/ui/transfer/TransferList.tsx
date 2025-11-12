import { extractTransferListProps } from './TransferList.helpers';
import { renderTransferListContent } from './TransferList.renderers';
import { setupTransferList } from './TransferList.setup';
import type { TransferListProps } from './TransferList.types';

/**
 * TransferList - Individual list panel for Transfer component
 *
 * Features:
 * - Searchable list of items
 * - Select all/none functionality
 * - Customizable item rendering
 * - Size variants: sm, md, lg
 * - Accessible: proper ARIA attributes
 * - Dark mode support
 */
export function TransferList<T = unknown>(props: Readonly<TransferListProps<T>>) {
	const { normalizedProps, setupProps } = extractTransferListProps(props);
	const setup = setupTransferList(setupProps);

	return (
		<div className={setup.containerClasses}>
			{renderTransferListContent(setup, normalizedProps)}
		</div>
	);
}
