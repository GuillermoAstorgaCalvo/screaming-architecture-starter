import {
	renderHeaderSection,
	renderListSection,
	renderSearchSection,
} from './TransferList.renderers.sections';
import type { TransferListContentProps, TransferListSetup } from './TransferList.types';

/**
 * Renders the complete transfer list content (header, search, and list)
 */
export function renderTransferListContent<T>(
	setup: TransferListSetup<T>,
	props: TransferListContentProps<T>
) {
	return (
		<>
			{renderHeaderSection(setup, props)}
			{renderSearchSection(setup, props)}
			{renderListSection(setup, props)}
		</>
	);
}
