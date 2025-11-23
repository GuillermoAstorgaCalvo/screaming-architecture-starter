/**
 * Tests for VirtualizedListContent component
 *
 * Tests virtualized items container rendering
 */

import { VirtualizedListContent } from '@core/ui/utilities/virtualized-list/components/VirtualizedListContent';
import type { useVirtualizer } from '@tanstack/react-virtual';
import { type RenderResult, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

interface TestItem {
	id: number;
	name: string;
}

type VirtualItems = ReturnType<
	ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>['getVirtualItems']
>;

const createMockItems = (): TestItem[] => [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
	{ id: 3, name: 'Item 3' },
];

const ItemRenderer = (item: TestItem): ReactElement => <div>{item.name}</div>;
ItemRenderer.displayName = 'ItemRenderer';

const createItemRenderer = () => ItemRenderer;

const createMockVirtualizer = () =>
	({
		measureElement: vi.fn(),
	}) as unknown as ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;

const createEmptyVirtualItems = (): VirtualItems => [] as VirtualItems;

const TEST_ID = 'virtualized-list-content';

const renderComponent = (props: {
	items: TestItem[];
	virtualItems: VirtualItems;
	virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	renderItem: (item: TestItem) => ReactElement;
	getItemKey?: (item: TestItem, index: number) => string;
	orientation: 'vertical' | 'horizontal';
	totalSize: number;
}): RenderResult => {
	return renderWithProviders(
		<VirtualizedListContent
			items={props.items}
			virtualItems={props.virtualItems}
			virtualizer={props.virtualizer}
			renderItem={props.renderItem}
			getItemKey={props.getItemKey}
			orientation={props.orientation}
			totalSize={props.totalSize}
			data-testid={TEST_ID}
		/>
	);
};

const createTestSetup = () => {
	const items = createMockItems();
	// False positive: renderItem is a render function prop, not a render() result
	// eslint-disable-next-line testing-library/render-result-naming-convention
	const renderItem = createItemRenderer();
	const virtualizer = createMockVirtualizer();
	return { items, renderItem, virtualizer };
};

const createVirtualItems = (count: number): VirtualItems => {
	return Array.from({ length: count }, (_, index) => ({
		index,
		start: index * 50,
		end: (index + 1) * 50,
		size: 50,
	})) as VirtualItems;
};

const testRendering = () => {
	const { items, renderItem, virtualizer } = createTestSetup();
	const virtualItems = createVirtualItems(2);

	renderComponent({
		items,
		virtualItems,
		virtualizer,
		renderItem,
		orientation: 'vertical',
		totalSize: 150,
	});

	// Use getByRole when items are present - this is the preferred Testing Library approach
	expect(screen.getByRole('list')).toBeInTheDocument();
	expect(screen.getByText('Item 1')).toBeInTheDocument();
	expect(screen.getByText('Item 2')).toBeInTheDocument();
};

/**
 * Helper to get the list element for testing.
 * Uses getByTestId which is the Testing Library recommended approach
 * for testing implementation details (like CSS styles) that can't be accessed semantically.
 */
const getListElement = (): HTMLElement => {
	return screen.getByTestId(TEST_ID);
};

const testVerticalStyles = () => {
	const { items, renderItem, virtualizer } = createTestSetup();
	const virtualItems = createEmptyVirtualItems();

	renderComponent({
		items,
		virtualItems,
		virtualizer,
		renderItem,
		orientation: 'vertical',
		totalSize: 1000,
	});

	const ul = getListElement();
	expect(ul).toBeInTheDocument();
	expect(ul).toHaveStyle({
		height: '1000px',
		width: '100%',
		position: 'relative',
	});
	expect(ul).toHaveClass('list-none', 'm-0', 'p-0');
};

const testHorizontalStyles = () => {
	const { items, renderItem, virtualizer } = createTestSetup();
	const virtualItems = createEmptyVirtualItems();

	renderComponent({
		items,
		virtualItems,
		virtualizer,
		renderItem,
		orientation: 'horizontal',
		totalSize: 2000,
	});

	const ul = getListElement();
	expect(ul).toBeInTheDocument();
	expect(ul).toHaveStyle({
		width: '2000px',
		height: '100%',
		position: 'relative',
	});
};

const testGetItemKey = () => {
	const { items, renderItem, virtualizer } = createTestSetup();
	const virtualItems = createVirtualItems(1);
	const getItemKey = (_item: TestItem, index: number) => `key-${index}`;

	renderComponent({
		items,
		virtualItems,
		virtualizer,
		renderItem,
		getItemKey,
		orientation: 'vertical',
		totalSize: 150,
	});

	expect(screen.getByText('Item 1')).toBeInTheDocument();
};

const testEmptyVirtualItems = () => {
	const { items, renderItem, virtualizer } = createTestSetup();
	const virtualItems = createEmptyVirtualItems();

	renderComponent({
		items,
		virtualItems,
		virtualizer,
		renderItem,
		orientation: 'vertical',
		totalSize: 150,
	});

	const ul = getListElement();
	expect(ul).toBeInTheDocument();
	// Verify empty state: list has no children
	expect(ul).toBeEmptyDOMElement();
};

const testMemoization = () => {
	const { items, renderItem, virtualizer } = createTestSetup();
	const virtualItems = createEmptyVirtualItems();

	const { rerender } = renderComponent({
		items,
		virtualItems,
		virtualizer,
		renderItem,
		orientation: 'vertical',
		totalSize: 1000,
	});

	const ul = getListElement();
	const firstStyle = ul?.getAttribute('style');

	rerender(
		<VirtualizedListContent
			items={items}
			virtualItems={virtualItems}
			virtualizer={virtualizer}
			renderItem={renderItem}
			orientation="vertical"
			totalSize={1000}
			data-testid={TEST_ID}
		/>
	);

	const ulAfterRerender = getListElement();
	const secondStyle = ulAfterRerender?.getAttribute('style');
	expect(firstStyle).toBe(secondStyle);
};

describe('VirtualizedListContent', () => {
	describe('rendering', () => {
		it('should render virtual items', testRendering);
	});

	describe('styles', () => {
		it('should render ul with correct styles for vertical orientation', testVerticalStyles);

		it('should render ul with correct styles for horizontal orientation', testHorizontalStyles);
	});

	describe('edge cases', () => {
		it('should use getItemKey when provided', testGetItemKey);

		it('should handle empty virtualItems array', testEmptyVirtualItems);
	});

	describe('memoization', () => {
		it('should memoize styles based on orientation and totalSize', testMemoization);
	});
});
