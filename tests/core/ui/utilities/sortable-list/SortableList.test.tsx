/**
 * Tests for SortableList component
 *
 * Tests the SortableList component:
 * - Rendering items
 * - Drag and drop functionality
 * - Keyboard navigation
 * - Variants and sizes
 * - Custom drag handles
 * - Disabled state
 * - Accessibility
 */

import SortableList from '@core/ui/utilities/sortable-list/SortableList';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface TestItem {
	id: string;
	data: string;
}

const mockItems: TestItem[] = [
	{ id: '1', data: 'Item 1' },
	{ id: '2', data: 'Item 2' },
	{ id: '3', data: 'Item 3' },
];

const TEST_ID_SORTABLE_LIST = 'sortable-list';
const ATTR_ARIA_LABEL = 'aria-label';

describe('SortableList - Rendering', () => {
	it('renders list items', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div data-testid={`item-${item.id}`}>{item.data}</div>}
				onReorder={onReorder}
			/>
		);

		expect(screen.getByTestId('item-1')).toBeInTheDocument();
		expect(screen.getByTestId('item-2')).toBeInTheDocument();
		expect(screen.getByTestId('item-3')).toBeInTheDocument();
	});

	it('renders empty list', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={[]}
				renderItem={() => <div>Item</div>}
				onReorder={onReorder}
				data-testid={TEST_ID_SORTABLE_LIST}
			/>
		);

		const list = screen.getByTestId(TEST_ID_SORTABLE_LIST);
		expect(list).toBeInTheDocument();
		expect(screen.queryAllByRole('listitem')).toHaveLength(0);
	});

	it('renders with custom aria-label', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
				aria-label="Custom sortable list"
			/>
		);

		const list = screen.getByLabelText('Custom sortable list');
		expect(list).toBeInTheDocument();
	});

	it('uses default aria-label when not provided', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
				data-testid={TEST_ID_SORTABLE_LIST}
			/>
		);

		const list = screen.getByTestId(TEST_ID_SORTABLE_LIST);
		expect(list).toHaveAttribute(ATTR_ARIA_LABEL);
	});
});

describe('SortableList - Variants and Sizes', () => {
	it('applies default variant classes', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
			/>
		);

		const list = screen.getByRole('list');
		expect(list).toHaveClass('list-none');
	});

	it('applies bordered variant', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
				variant="bordered"
			/>
		);

		const list = screen.getByRole('list');
		expect(list).toHaveClass('border');
		expect(list).toHaveClass('rounded-lg');
	});

	it('applies divided variant', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
				variant="divided"
				data-testid="sortable-list-divided"
			/>
		);

		const list = screen.getByTestId('sortable-list-divided');
		expect(list).toHaveClass('divide-y');
	});

	it('applies custom className', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
				className="custom-class"
				data-testid="sortable-list-custom"
			/>
		);

		const list = screen.getByTestId('sortable-list-custom');
		expect(list).toHaveClass('custom-class');
	});
});

describe('SortableList - Drag Handle', () => {
	it('shows drag handle by default', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
			/>
		);

		const handles = screen.getAllByTestId('sortable-list-item-drag-handle');
		expect(handles.length).toBe(mockItems.length);
	});

	it('hides drag handle when showDragHandle is false', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
				showDragHandle={false}
			/>
		);

		const handles = screen.queryAllByTestId('sortable-list-item-drag-handle');
		expect(handles.length).toBe(0);
	});

	it('renders custom drag handle', () => {
		const onReorder = vi.fn();
		const customHandle = <div data-testid="custom-handle">Custom Handle</div>;
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
				dragHandle={customHandle}
			/>
		);

		const handles = screen.getAllByTestId('custom-handle');
		expect(handles.length).toBe(mockItems.length);
	});
});

// Helper functions for Drag and Drop tests
type OnReorderCallback = (items: readonly TestItem[]) => void;

const renderSortableListWithTestIds = (onReorder: OnReorderCallback) => {
	return renderWithProviders(
		<SortableList
			items={mockItems}
			renderItem={item => <div data-testid={`item-${item.id}`}>{item.data}</div>}
			onReorder={onReorder}
		/>
	);
};

const getListItemByTestId = (itemId: string) => {
	return screen.getByTestId(`sortable-list-item-${itemId}`);
};

const performDragOver = (targetItem: HTMLElement) => {
	const dragOverEvent = new DragEvent('dragover', {
		bubbles: true,
		cancelable: true,
	});
	const preventDefaultSpy = vi.spyOn(dragOverEvent, 'preventDefault');
	targetItem.dispatchEvent(dragOverEvent);
	return preventDefaultSpy;
};

const performDragAndDrop = async (
	firstItem: HTMLElement,
	secondItem: HTMLElement,
	onReorder: OnReorderCallback
) => {
	fireEvent.dragStart(firstItem);
	fireEvent.dragOver(secondItem);
	fireEvent.drop(secondItem);

	await waitFor(() => {
		expect(onReorder).toHaveBeenCalled();
	});

	const reorderedCall = (onReorder as ReturnType<typeof vi.fn>).mock.calls[0]?.[0];
	expect(reorderedCall).toBeDefined();
	expect(reorderedCall.length).toBe(mockItems.length);
};

describe('SortableList - Drag and Drop', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles drag start', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div data-testid={`item-${item.id}`}>{item.data}</div>}
				onReorder={onReorder}
			/>
		);

		const firstItem = screen.getByTestId('sortable-list-item-1');
		expect(firstItem).toBeInTheDocument();

		const dragStartEvent = new DragEvent('dragstart', {
			bubbles: true,
			cancelable: true,
		});
		firstItem.dispatchEvent(dragStartEvent);
		// Drag start should be handled (implementation dependent)
	});

	it('handles drag over', () => {
		const onReorder = vi.fn();
		renderSortableListWithTestIds(onReorder);

		const firstItem = getListItemByTestId('1');
		const secondItem = getListItemByTestId('2');

		expect(firstItem).toBeInTheDocument();
		expect(secondItem).toBeInTheDocument();

		fireEvent.dragStart(firstItem);
		const preventDefaultSpy = performDragOver(secondItem);
		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('handles drop and reorders items', async () => {
		const onReorder = vi.fn();
		renderSortableListWithTestIds(onReorder);

		const firstItem = getListItemByTestId('1');
		const secondItem = getListItemByTestId('2');

		expect(firstItem).toBeInTheDocument();
		expect(secondItem).toBeInTheDocument();

		await performDragAndDrop(firstItem, secondItem, onReorder);
	});

	it('handles drag end', () => {
		const onReorder = vi.fn();
		renderSortableListWithTestIds(onReorder);

		const firstItem = getListItemByTestId('1');
		expect(firstItem).toBeInTheDocument();

		fireEvent.dragStart(firstItem);
		fireEvent.dragEnd(firstItem);
		// Drag end should reset state
	});
});

// Helper functions for Keyboard Navigation tests
const renderSortableListForKeyboard = (onReorder: OnReorderCallback, disabled = false) => {
	return renderWithProviders(
		<SortableList
			items={mockItems}
			renderItem={item => <div data-testid={`item-${item.id}`}>{item.data}</div>}
			onReorder={onReorder}
			disabled={disabled}
		/>
	);
};

const performKeyboardAction = async (itemId: string, key: string, onReorder: OnReorderCallback) => {
	const item = getListItemByTestId(itemId);
	expect(item).toBeInTheDocument();

	item.focus();
	fireEvent.keyDown(item, { key });

	await waitFor(() => {
		expect(onReorder).toHaveBeenCalled();
	});
};

const performKeyboardActionDisabled = (
	itemId: string,
	key: string,
	onReorder: OnReorderCallback
) => {
	const item = getListItemByTestId(itemId);
	expect(item).toBeInTheDocument();

	item.focus();
	fireEvent.keyDown(item, { key });
	expect(onReorder).not.toHaveBeenCalled();
};

describe('SortableList - Keyboard Navigation', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('handles ArrowUp key', async () => {
		const onReorder = vi.fn();
		renderSortableListForKeyboard(onReorder);
		await performKeyboardAction('2', 'ArrowUp', onReorder);
	});

	it('handles ArrowDown key', async () => {
		const onReorder = vi.fn();
		renderSortableListForKeyboard(onReorder);
		await performKeyboardAction('1', 'ArrowDown', onReorder);
	});

	it('handles Home key', async () => {
		const onReorder = vi.fn();
		renderSortableListForKeyboard(onReorder);
		await performKeyboardAction('3', 'Home', onReorder);
	});

	it('handles End key', async () => {
		const onReorder = vi.fn();
		renderSortableListForKeyboard(onReorder);
		await performKeyboardAction('1', 'End', onReorder);
	});

	it('does not handle keyboard navigation when disabled', () => {
		const onReorder = vi.fn();
		renderSortableListForKeyboard(onReorder, true);
		performKeyboardActionDisabled('1', 'ArrowDown', onReorder);
	});
});

describe('SortableList - Disabled State', () => {
	it('disables drag and drop when disabled', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div data-testid={`item-${item.id}`}>{item.data}</div>}
				onReorder={onReorder}
				disabled
			/>
		);

		const items = screen.getAllByRole('listitem');
		for (const item of items) {
			expect(item).toHaveAttribute('draggable', 'false');
			expect(item).toHaveAttribute('tabIndex', '-1');
		}
	});

	it('does not call onReorder when disabled and dragging', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div data-testid={`item-${item.id}`}>{item.data}</div>}
				onReorder={onReorder}
				disabled
			/>
		);

		const firstItem = screen.getByTestId('sortable-list-item-1');
		const secondItem = screen.getByTestId('sortable-list-item-2');

		fireEvent.dragStart(firstItem);
		fireEvent.dragOver(secondItem);
		fireEvent.drop(secondItem);

		expect(onReorder).not.toHaveBeenCalled();
	});
});

describe('SortableList - Accessibility', () => {
	it('has proper ARIA attributes', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
			/>
		);

		const list = screen.getByRole('list');
		expect(list).toHaveAttribute(ATTR_ARIA_LABEL);

		const items = screen.getAllByRole('listitem');
		for (const [index, item] of items.entries()) {
			expect(item).toHaveAttribute('data-sortable-item-id');
			expect(item).toHaveAttribute('data-sortable-item-index', String(index));
			expect(item).toHaveAttribute(ATTR_ARIA_LABEL);
			expect(item).toHaveAttribute('aria-posinset', String(index + 1));
			expect(item).toHaveAttribute('aria-setsize', String(mockItems.length));
		}
	});

	it('has proper tabIndex for keyboard navigation', () => {
		const onReorder = vi.fn();
		renderWithProviders(
			<SortableList
				items={mockItems}
				renderItem={item => <div>{item.data}</div>}
				onReorder={onReorder}
			/>
		);

		const items = screen.getAllByRole('listitem');
		for (const item of items) {
			expect(item).toHaveAttribute('tabIndex', '0');
		}
	});
});
