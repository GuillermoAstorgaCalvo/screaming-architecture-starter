/**
 * TransferList.renderers.list Tests
 *
 * Tests for TransferList list renderer including:
 * - List item rendering
 * - Empty state rendering
 * - Selection handling
 * - Custom renderers
 */

import {
	renderList,
	renderListItem,
} from '@core/ui/forms/transfer/helpers/TransferList.renderers.list';
import type {
	RenderListItemProps,
	RenderListProps,
} from '@core/ui/forms/transfer/types/TransferList.types';
import type { TransferOption } from '@src-types/ui/data/transfer';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('renderListItem', () => {
	const createOption = (overrides?: Partial<TransferOption>): TransferOption => ({
		value: '1',
		label: 'Option 1',
		...overrides,
	});

	const createProps = (
		overrides?: Partial<RenderListItemProps<unknown>>
	): RenderListItemProps<unknown> => ({
		option: createOption(),
		isSelected: false,
		disabled: false,
		size: 'md',
		renderItem: undefined,
		onItemToggle: vi.fn(),
		...overrides,
	});

	it('renders list item with checkbox', () => {
		const props = createProps();
		renderWithProviders(renderListItem(props));

		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeInTheDocument();
		expect(checkbox).not.toBeChecked();
	});

	it('renders selected item with checked checkbox', () => {
		const props = createProps({ isSelected: true });
		renderWithProviders(renderListItem(props));

		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeChecked();
	});

	it('renders default label when renderItem is not provided', () => {
		const props = createProps({ option: createOption({ label: 'Test Label' }) });
		renderWithProviders(renderListItem(props));

		expect(screen.getByText('Test Label')).toBeInTheDocument();
	});

	it('uses custom renderItem when provided', () => {
		const customRender = vi.fn(option => <div>Custom: {option.label}</div>);
		const props = createProps({ renderItem: customRender });
		renderWithProviders(renderListItem(props));

		expect(customRender).toHaveBeenCalled();
		expect(screen.getByText(/Custom:/)).toBeInTheDocument();
	});

	it('calls onItemToggle when item is clicked', () => {
		const onItemToggle = vi.fn();
		const props = createProps({ onItemToggle });
		renderWithProviders(renderListItem(props));

		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(onItemToggle).toHaveBeenCalledWith('1');
	});

	it('calls onItemToggle when checkbox is clicked', () => {
		const onItemToggle = vi.fn();
		const props = createProps({ onItemToggle });
		renderWithProviders(renderListItem(props));

		const checkbox = screen.getByRole('checkbox');
		fireEvent.click(checkbox);

		expect(onItemToggle).toHaveBeenCalledWith('1');
	});

	it('does not call onItemToggle when item is disabled', () => {
		const onItemToggle = vi.fn();
		const props = createProps({
			option: createOption({ disabled: true }),
			onItemToggle,
		});
		renderWithProviders(renderListItem(props));

		const listItem = screen.getByRole('listitem');
		fireEvent.click(listItem);

		expect(onItemToggle).not.toHaveBeenCalled();
	});

	it('does not call onItemToggle when component is disabled', () => {
		const onItemToggle = vi.fn();
		const props = createProps({ disabled: true, onItemToggle });
		renderWithProviders(renderListItem(props));

		const listItem = screen.getByRole('listitem');
		fireEvent.click(listItem);

		expect(onItemToggle).not.toHaveBeenCalled();
	});

	it('disables checkbox when option is disabled', () => {
		const props = createProps({ option: createOption({ disabled: true }) });
		renderWithProviders(renderListItem(props));

		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeDisabled();
	});

	it('disables checkbox when component is disabled', () => {
		const props = createProps({ disabled: true });
		renderWithProviders(renderListItem(props));

		const checkbox = screen.getByRole('checkbox');
		expect(checkbox).toBeDisabled();
	});

	it('sets aria-selected attribute', () => {
		const props = createProps({ isSelected: true });
		renderWithProviders(renderListItem(props));

		const listItem = screen.getByRole('listitem');
		expect(listItem).toHaveAttribute('aria-selected', 'true');
	});

	it('applies disabled styling to disabled option', () => {
		const props = createProps({ option: createOption({ disabled: true }) });
		const { container } = renderWithProviders(renderListItem(props));

		const button = container.querySelector('button');
		expect(button).toBeInTheDocument();
		expect(button).toHaveClass('opacity-disabled');
		expect(button).toHaveClass('cursor-not-allowed');
	});
});

describe('renderList', () => {
	const createOptions = (): TransferOption[] => [
		{ value: '1', label: 'Option 1' },
		{ value: '2', label: 'Option 2' },
		{ value: '3', label: 'Option 3' },
	];

	const createProps = (
		overrides?: Partial<RenderListProps<unknown>>
	): RenderListProps<unknown> => ({
		options: createOptions(),
		selectedValues: new Set(),
		headerId: 'header-1',
		listContainerClasses: 'list-container',
		maxHeight: 300,
		size: 'md',
		disabled: false,
		renderItem: undefined,
		renderEmpty: undefined,
		type: 'source',
		onItemToggle: vi.fn(),
		...overrides,
	});

	it('renders list with all options', () => {
		const props = createProps();
		renderWithProviders(renderList(props));

		expect(screen.getByText('Option 1')).toBeInTheDocument();
		expect(screen.getByText('Option 2')).toBeInTheDocument();
		expect(screen.getByText('Option 3')).toBeInTheDocument();
	});

	it('renders empty state when options array is empty', () => {
		const props = createProps({ options: [] });
		renderWithProviders(renderList(props));

		expect(screen.getByText('No items available')).toBeInTheDocument();
	});

	it('uses custom renderEmpty when provided', () => {
		const customEmpty = vi.fn(() => <div>Custom Empty</div>);
		const props = createProps({ options: [], renderEmpty: customEmpty });
		renderWithProviders(renderList(props));

		expect(customEmpty).toHaveBeenCalledWith('source');
		expect(screen.getByText('Custom Empty')).toBeInTheDocument();
	});

	it('applies maxHeight style', () => {
		const props = createProps({ maxHeight: 500 });
		const { container } = renderWithProviders(renderList(props));

		const containerEl = container.querySelector('.list-container');
		expect(containerEl).toHaveStyle({ maxHeight: '500px' });
	});

	it('sets aria-labelledby attribute', () => {
		const props = createProps({ headerId: 'custom-header' });
		const { container } = renderWithProviders(renderList(props));

		const containerEl = container.querySelector('.list-container');
		expect(containerEl).toHaveAttribute('aria-labelledby', 'custom-header');
	});

	it('renders selected items correctly', () => {
		const props = createProps({ selectedValues: new Set(['1', '3']) });
		renderWithProviders(renderList(props));

		const checkboxes = screen.getAllByRole('checkbox');
		expect(checkboxes[0]).toBeChecked();
		expect(checkboxes[1]).not.toBeChecked();
		expect(checkboxes[2]).toBeChecked();
	});
});
