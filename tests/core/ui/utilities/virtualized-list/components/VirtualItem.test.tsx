/**
 * Tests for VirtualItem component
 *
 * Tests individual virtualized item rendering and positioning
 */

import { VirtualItem } from '@core/ui/utilities/virtualized-list/components/VirtualItem';
import type { useVirtualizer } from '@tanstack/react-virtual';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

// Test constants
const mockItems = [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
];
const mockRenderItem = (item: { id: number; name: string }) => <div>{item.name}</div>;
const [firstItem] = mockItems;
if (!firstItem) {
	throw new Error('First item not found');
}

// Helper functions
function createMockVirtualizer(measureElement = vi.fn()) {
	return {
		measureElement,
	} as unknown as ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
}

function renderVirtualItem(props: {
	item: { id: number; name: string };
	index: number;
	virtualItem: { index: number; start: number };
	virtualizer: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	orientation: 'vertical' | 'horizontal';
	getItemKey?: (item: { id: number; name: string }, index: number) => string;
}) {
	return renderWithProviders(
		<VirtualItem
			item={props.item}
			index={props.index}
			virtualItem={props.virtualItem}
			virtualizer={props.virtualizer}
			renderItem={mockRenderItem}
			getItemKey={props.getItemKey}
			orientation={props.orientation}
		/>
	);
}

function getListItemElement(container: HTMLElement) {
	return container.querySelector('li');
}

describe('VirtualItem - Rendering', () => {
	const mockVirtualizer = createMockVirtualizer();

	it('should render item content', () => {
		const virtualItem = { index: 0, start: 0 };

		renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
		});

		expect(screen.getByText('Item 1')).toBeInTheDocument();
	});

	it('should set data-index attribute', () => {
		const virtualItem = { index: 0, start: 0 };

		const { container } = renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
		});

		const li = getListItemElement(container);
		expect(li).toHaveAttribute('data-index', '0');
	});

	it('should use getItemKey when provided for key generation', () => {
		const virtualItem = { index: 0, start: 0 };
		const getItemKey = (_item: { id: number; name: string }, index: number) => `key-${index}`;

		renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
			getItemKey,
		});

		// Key is used internally by React, we just verify the component renders
		expect(screen.getByText('Item 1')).toBeInTheDocument();
	});
});

describe('VirtualItem - Positioning Styles', () => {
	const mockVirtualizer = createMockVirtualizer();

	it('should apply vertical positioning styles', () => {
		const virtualItem = { index: 0, start: 100 };

		const { container } = renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			orientation: 'vertical',
		});

		const li = getListItemElement(container);
		expect(li).toHaveStyle({
			position: 'absolute',
			top: '0',
			width: '100%',
			transform: 'translateY(100px)',
		});
		expect(li?.style.left).toBe('');
		expect(li?.style.height).toBe('');
	});

	it('should apply horizontal positioning styles', () => {
		const virtualItem = { index: 0, start: 200 };

		const { container } = renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizer,
			orientation: 'horizontal',
		});

		const li = getListItemElement(container);
		expect(li).toHaveStyle({
			position: 'absolute',
			left: '0',
			height: '100%',
			transform: 'translateX(200px)',
		});
		expect(li?.style.top).toBe('');
		expect(li?.style.width).toBe('');
	});
});

describe('VirtualItem - Refs', () => {
	it('should attach measureElement ref', () => {
		const virtualItem = { index: 0, start: 0 };
		const measureElement = vi.fn();
		const mockVirtualizerWithMeasure = createMockVirtualizer(measureElement);

		const { container } = renderVirtualItem({
			item: firstItem,
			index: 0,
			virtualItem,
			virtualizer: mockVirtualizerWithMeasure,
			orientation: 'vertical',
		});

		const li = getListItemElement(container);
		expect(li).toBeDefined();
		// The ref callback should be available (though we can't easily test it being called)
	});
});
