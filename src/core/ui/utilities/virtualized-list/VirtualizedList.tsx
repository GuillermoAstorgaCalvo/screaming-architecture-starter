import { VirtualizedListWrapper } from '@core/ui/utilities/virtualized-list/components/VirtualizedListWrapper';
import { extractVirtualizedListProps } from '@core/ui/utilities/virtualized-list/helpers/VirtualizedListPropsHelpers';
import { useVirtualizedListSetupAndProps } from '@core/ui/utilities/virtualized-list/hooks/configuration/useVirtualizedListSetupAndProps';
import { useVirtualizedListRef } from '@core/ui/utilities/virtualized-list/hooks/utils/useVirtualizedListRef';
import type { VirtualizedListProps } from '@src-types/ui/layout/scroll';

/**
 * VirtualizedList - Efficiently renders large lists using virtualization
 *
 * Features:
 * - Vertical and horizontal scrolling support
 * - Fixed or dynamic item sizes
 * - Overscan for smooth scrolling
 * - Customizable container size
 * - Accessible with proper ARIA attributes
 * - Empty state support
 * - Smooth scrolling option
 *
 * @example
 * ```tsx
 * <VirtualizedList
 *   items={largeArray}
 *   renderItem={(item, index) => <div key={index}>{item.name}</div>}
 *   itemSize={50}
 *   containerSize={400}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <VirtualizedList
 *   items={items}
 *   renderItem={(item) => <ListItem>{item.title}</ListItem>}
 *   itemSize={(index) => index % 2 === 0 ? 60 : 80}
 *   orientation="vertical"
 *   overscan={2}
 * />
 * ```
 */

export default function VirtualizedList<T = unknown>(props: Readonly<VirtualizedListProps<T>>) {
	const extractedProps = extractVirtualizedListProps(props);
	const parentRef = useVirtualizedListRef();
	const wrapperProps = useVirtualizedListSetupAndProps({
		...extractedProps,
		parentRef,
	});

	return <VirtualizedListWrapper {...wrapperProps} />;
}
