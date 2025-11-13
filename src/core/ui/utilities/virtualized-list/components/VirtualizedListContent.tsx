import {
	getVirtualItemsStyle,
	mapVirtualItems,
} from '@core/ui/utilities/virtualized-list/helpers/VirtualizedListContentHelpers';
import type { VirtualizedListContentProps } from '@core/ui/utilities/virtualized-list/types/VirtualizedListContentTypes';
import { useMemo } from 'react';

/**
 * Content component for virtualized list
 *
 * Renders the virtualized items container with proper sizing
 * based on orientation and total size.
 */
export function VirtualizedListContent<T>({
	items,
	virtualItems,
	virtualizer,
	renderItem,
	getItemKey,
	orientation,
	totalSize,
}: Readonly<VirtualizedListContentProps<T>>) {
	const virtualItemsStyle = useMemo(
		() => getVirtualItemsStyle({ orientation, totalSize }),
		[totalSize, orientation]
	);

	const renderedItems = useMemo(
		() =>
			mapVirtualItems({
				items,
				virtualItems,
				virtualizer,
				renderItem,
				getItemKey,
				orientation,
			}),
		[items, virtualItems, virtualizer, renderItem, getItemKey, orientation]
	);

	return (
		<ul style={virtualItemsStyle} className="list-none m-0 p-0">
			{renderedItems}
		</ul>
	);
}
