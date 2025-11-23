/**
 * Tests for VirtualizedListWrapper component
 *
 * Tests wrapper component that handles empty and populated states
 */

import { VirtualizedListWrapper } from '@core/ui/utilities/virtualized-list/components/VirtualizedListWrapper';
import type { useVirtualizer } from '@tanstack/react-virtual';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Test data and mocks
const mockItems = [
	{ id: 1, name: 'Item 1' },
	{ id: 2, name: 'Item 2' },
];

const CUSTOM_CLASS_NAME = 'custom-class';
const CUSTOM_EMPTY_MESSAGE = 'Custom empty message';
const DATA_TESTID_ATTR = 'data-testid';

const mockRenderItem = (item: { id: number; name: string }) => <div>{item.name}</div>;

const createMockVirtualizer = (virtualItemsCount = 1) => {
	return {
		getVirtualItems: vi.fn(() =>
			Array.from({ length: virtualItemsCount }, (_, i) => ({
				index: i,
				start: i * 50,
				end: (i + 1) * 50,
				size: 50,
			}))
		),
		getTotalSize: vi.fn(() => 100),
		measureElement: vi.fn(),
	} as unknown as ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
};

const parentRef = { current: document.createElement('div') };

// Helper function to render wrapper with default props
const renderWrapper = (props: {
	items?: Array<{ id: number; name: string }>;
	virtualizer?: ReturnType<typeof useVirtualizer<HTMLDivElement, Element>>;
	emptyMessage?: string;
	className?: string;
	getItemKey?: (item: { id: number; name: string }, index: number) => string;
	orientation?: 'vertical' | 'horizontal';
	containerSize?: number;
	smoothScroll?: boolean;
	[DATA_TESTID_ATTR]?: string;
}): ReactElement => {
	const {
		items = [],
		virtualizer = createMockVirtualizer(),
		emptyMessage,
		className,
		getItemKey,
		orientation = 'vertical',
		containerSize = 400,
		smoothScroll = false,
		[DATA_TESTID_ATTR]: dataTestId,
	} = props;

	return (
		<VirtualizedListWrapper
			items={items}
			renderItem={mockRenderItem}
			virtualizer={virtualizer}
			orientation={orientation}
			containerSize={containerSize}
			smoothScroll={smoothScroll}
			parentRef={parentRef}
			{...(emptyMessage !== undefined && { emptyMessage })}
			{...(className !== undefined && { className })}
			{...(getItemKey !== undefined && { getItemKey })}
			{...(dataTestId !== undefined && { [DATA_TESTID_ATTR]: dataTestId })}
		/>
	);
};

// Helper functions for test assertions
const expectEmptyStateRendered = () => {
	expect(screen.queryByText('Item 1')).not.toBeInTheDocument();
};

const expectItemsRendered = () => {
	expect(screen.getByText('Item 1')).toBeInTheDocument();
	expect(screen.getByText('Item 2')).toBeInTheDocument();
};

const expectClassNameApplied = (testId: string, className: string) => {
	const element = screen.getByTestId(testId);
	expect(element).toHaveClass(className);
};

const expectTestIdAttribute = (testId: string) => {
	const element = screen.getByTestId(testId);
	expect(element).toBeInTheDocument();
};

describe('VirtualizedListWrapper - rendering states', () => {
	it('should render VirtualizedListEmpty when items array is empty', () => {
		renderWithProviders(renderWrapper({ items: [] }));
		expectEmptyStateRendered();
	});

	it('should render VirtualizedListContainer when items array has items', () => {
		const mockVirtualizerWithItems = createMockVirtualizer(2);
		renderWithProviders(
			renderWrapper({
				items: mockItems,
				virtualizer: mockVirtualizerWithItems,
			})
		);
		expectItemsRendered();
	});
});

describe('VirtualizedListWrapper - empty state props', () => {
	it('should pass emptyMessage to VirtualizedListEmpty', () => {
		renderWithProviders(
			renderWrapper({
				items: [],
				emptyMessage: CUSTOM_EMPTY_MESSAGE,
			})
		);
		expect(screen.getByText(CUSTOM_EMPTY_MESSAGE)).toBeInTheDocument();
	});

	it('should pass className to VirtualizedListEmpty when items are empty', () => {
		renderWithProviders(
			renderWrapper({
				items: [],
				className: CUSTOM_CLASS_NAME,
				[DATA_TESTID_ATTR]: 'empty-list',
			})
		);
		expectClassNameApplied('empty-list', CUSTOM_CLASS_NAME);
	});
});

describe('VirtualizedListWrapper - container props', () => {
	it('should pass className to VirtualizedListContainer when items exist', () => {
		renderWithProviders(
			renderWrapper({
				items: mockItems,
				className: CUSTOM_CLASS_NAME,
				[DATA_TESTID_ATTR]: 'list-container',
			})
		);
		expectClassNameApplied('list-container', CUSTOM_CLASS_NAME);
	});

	it('should pass all props to VirtualizedListContainer', () => {
		const getItemKey = (_item: { id: number; name: string }, index: number) => `key-${index}`;
		renderWithProviders(
			renderWrapper({
				items: mockItems,
				getItemKey,
				orientation: 'horizontal',
				containerSize: 600,
				smoothScroll: true,
			})
		);
		expect(screen.getByText('Item 1')).toBeInTheDocument();
	});
});

describe('VirtualizedListWrapper - additional props', () => {
	it('should pass through additional props to empty state', () => {
		renderWithProviders(
			renderWrapper({
				items: [],
				[DATA_TESTID_ATTR]: 'empty-wrapper',
			})
		);
		expectTestIdAttribute('empty-wrapper');
	});

	it('should pass through additional props to container', () => {
		renderWithProviders(
			renderWrapper({
				items: mockItems,
				[DATA_TESTID_ATTR]: 'list-wrapper',
			})
		);
		expectTestIdAttribute('list-wrapper');
	});
});
