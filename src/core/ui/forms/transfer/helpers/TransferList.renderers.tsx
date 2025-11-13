import {
	renderHeaderSection,
	renderListSection,
	renderSearchSection,
} from '@core/ui/forms/transfer/helpers/TransferList.renderers.sections';
import type {
	TransferListContentProps,
	TransferListSetup,
} from '@core/ui/forms/transfer/types/TransferList.types';

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
