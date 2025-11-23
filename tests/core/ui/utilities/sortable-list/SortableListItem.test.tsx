/**
 * Tests for SortableListItem component
 *
 * Tests the SortableListItem component:
 * - Rendering
 * - Drag state classes
 * - Drag handle rendering
 * - Disabled state
 * - Accessibility attributes
 */

import { ListProvider } from '@core/ui/data-display/list/providers/ListProvider';
import SortableListItem from '@core/ui/utilities/sortable-list/components/SortableListItem';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

const TEST_ITEM_ID = 'sortable-list-item-1';
const TEST_ITEM_ID_CUSTOM = 'sortable-list-item-test-id';
const CLASS_OPACITY_DISABLED = 'opacity-disabled';
const ARIA_LABEL = 'aria-label';
const ARIA_LABEL_ITEM_3_OF_5 = 'Item 3 of 5';
const ARIA_POSINSET_3 = '3';
const ARIA_SETSIZE_5 = '5';

describe('SortableListItem - Rendering', () => {
	it('renders children', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0}>
					<div data-testid="child">Child content</div>
				</SortableListItem>
			</ListProvider>
		);

		expect(screen.getByTestId('child')).toBeInTheDocument();
	});

	it('renders with correct data attributes', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="test-id" index={2}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID_CUSTOM);
		expect(item).toHaveAttribute('data-sortable-item-id', 'test-id');
		expect(item).toHaveAttribute('data-sortable-item-index', '2');
	});

	it('applies custom className', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} className="custom-class">
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass('custom-class');
	});
});

describe('SortableListItem - Drag Handle', () => {
	it('shows default drag handle when showDragHandle is true', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} showDragHandle>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		expect(screen.getByTestId('sortable-list-item-drag-handle')).toBeInTheDocument();
	});

	it('hides drag handle when showDragHandle is false', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} showDragHandle={false}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		expect(screen.queryByTestId('sortable-list-item-drag-handle')).not.toBeInTheDocument();
	});

	it('renders custom drag handle', () => {
		const customHandle = <div data-testid="custom-handle">Custom</div>;
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} dragHandle={customHandle}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		expect(screen.getByTestId('custom-handle')).toBeInTheDocument();
	});

	it('prioritizes custom drag handle over showDragHandle', () => {
		const customHandle = <div data-testid="custom-handle">Custom</div>;
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} dragHandle={customHandle} showDragHandle>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		expect(screen.getByTestId('custom-handle')).toBeInTheDocument();
	});
});

describe('SortableListItem - Drag State', () => {
	it('applies dragging classes when isDragging is true', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} isDragging>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass(CLASS_OPACITY_DISABLED);
		expect(item).toHaveClass('scale-95');
	});

	it('applies drag target classes when isDragTarget is true', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} isDragTarget>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass('ring-2');
		expect(item).toHaveClass('ring-primary');
	});

	it('applies both dragging and drag target classes', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} isDragging isDragTarget>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass(CLASS_OPACITY_DISABLED);
		expect(item).toHaveClass('ring-2');
	});
});

describe('SortableListItem - Disabled State', () => {
	it('disables dragging when disabled', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} disabled>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveAttribute('draggable', 'false');
		expect(item).toHaveAttribute('tabIndex', '-1');
	});

	it('applies disabled classes when disabled', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0} disabled>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass(CLASS_OPACITY_DISABLED);
		expect(item).toHaveClass('cursor-not-allowed');
	});

	it('enables dragging when not disabled', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveAttribute('draggable', 'true');
		expect(item).toHaveAttribute('tabIndex', '0');
	});
});

describe('SortableListItem - Accessibility', () => {
	it('has proper ARIA attributes', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={2} aria-setsize={5} aria-posinset={3}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveAttribute(ARIA_LABEL, ARIA_LABEL_ITEM_3_OF_5);
		expect(item).toHaveAttribute('aria-posinset', ARIA_POSINSET_3);
		expect(item).toHaveAttribute('aria-setsize', ARIA_SETSIZE_5);
	});

	it('uses default aria-setsize when not provided', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveAttribute(ARIA_LABEL);
		expect(item.getAttribute(ARIA_LABEL)).toContain('unknown');
	});
});

describe('SortableListItem - Size Variants', () => {
	it('applies size classes for sm', () => {
		renderWithProviders(
			<ListProvider size="sm">
				<SortableListItem itemId="1" index={0}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass('py-sm');
		expect(item).toHaveClass('px-sm');
	});

	it('applies size classes for md', () => {
		renderWithProviders(
			<ListProvider size="md">
				<SortableListItem itemId="1" index={0}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass('py-md');
		expect(item).toHaveClass('px-md');
	});

	it('applies size classes for lg', () => {
		renderWithProviders(
			<ListProvider size="lg">
				<SortableListItem itemId="1" index={0}>
					<div>Content</div>
				</SortableListItem>
			</ListProvider>
		);

		const item = screen.getByTestId(TEST_ITEM_ID);
		expect(item).toHaveClass('py-lg');
		expect(item).toHaveClass('px-lg');
	});
});
