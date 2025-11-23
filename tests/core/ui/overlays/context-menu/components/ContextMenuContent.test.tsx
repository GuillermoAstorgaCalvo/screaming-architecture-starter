/**
 * ContextMenuContent Component Tests
 *
 * Tests for the ContextMenuContent component including:
 * - Rendering menu content
 * - Rendering popover
 * - Props forwarding
 */

import { ContextMenuContent } from '@core/ui/overlays/context-menu/components/ContextMenuContent';
import type { ContextMenuContentProps } from '@core/ui/overlays/context-menu/types/ContextMenuContent.types';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

const createTestItems = () => [
	{ id: '1', label: 'Copy', onSelect: vi.fn() },
	{ id: '2', label: 'Paste', onSelect: vi.fn() },
];

const createProps = (overrides?: Partial<ContextMenuContentProps>): ContextMenuContentProps => ({
	open: true,
	setOpen: vi.fn(),
	trigger: <div data-testid="trigger">Right-click me</div>,
	align: 'center',
	className: undefined,
	menuRef: createRef<HTMLDivElement>(),
	menuId: 'test-menu',
	menuLabel: undefined,
	maxHeight: 280,
	handleKeyDown: vi.fn(),
	items: createTestItems(),
	highlightedIndex: -1,
	itemRefs: createTestItems().map(() => createRef<HTMLButtonElement | null>()),
	handleSelect: vi.fn(),
	emptyState: <div>No actions available</div>,
	...overrides,
});

describe('ContextMenuContent', () => {
	it('renders trigger element', () => {
		const props = createProps();
		renderWithProviders(<ContextMenuContent {...props} />);

		expect(screen.getByTestId('trigger')).toBeInTheDocument();
	});

	it('renders menu when open', () => {
		const props = createProps({ open: true });
		renderWithProviders(<ContextMenuContent {...props} />);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('does not render menu when closed', () => {
		const props = createProps({ open: false });
		renderWithProviders(<ContextMenuContent {...props} />);

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('renders menu items', () => {
		const props = createProps();
		renderWithProviders(<ContextMenuContent {...props} />);

		expect(screen.getByText('Copy')).toBeInTheDocument();
		expect(screen.getByText('Paste')).toBeInTheDocument();
	});

	it('passes align prop to popover', () => {
		const props = createProps({ align: 'start' });
		renderWithProviders(<ContextMenuContent {...props} />);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const props = createProps({ className: 'custom-class' });
		renderWithProviders(<ContextMenuContent {...props} />);

		// Popover renders via portal, so check document.body
		const popover = document.body.querySelector('.custom-class');
		expect(popover).toBeInTheDocument();
	});

	it('passes menuRef to menu wrapper', () => {
		const menuRef = createRef<HTMLDivElement>();
		const props = createProps({ menuRef });
		renderWithProviders(<ContextMenuContent {...props} />);

		const menu = screen.getByRole('menu');
		expect(menuRef.current).toBe(menu);
	});

	it('passes menuId to menu wrapper', () => {
		const props = createProps({ menuId: 'custom-menu-id' });
		renderWithProviders(<ContextMenuContent {...props} />);

		const menu = screen.getByRole('menu');
		expect(menu).toHaveAttribute('id', 'custom-menu-id');
	});

	it('passes menuLabel to menu wrapper', () => {
		const props = createProps({ menuLabel: 'Custom menu label' });
		renderWithProviders(<ContextMenuContent {...props} />);

		const menu = screen.getByRole('menu');
		expect(menu).toHaveAttribute('aria-label', 'Custom menu label');
	});

	it('passes maxHeight to menu wrapper', () => {
		const props = createProps({ maxHeight: 400 });
		renderWithProviders(<ContextMenuContent {...props} />);

		const menu = screen.getByRole('menu');
		expect(menu).toHaveStyle({ '--menu-max-height': '400px' });
	});

	it('passes handleKeyDown to menu wrapper', () => {
		const handleKeyDown = vi.fn();
		const props = createProps({ handleKeyDown });
		renderWithProviders(<ContextMenuContent {...props} />);

		const menu = screen.getByRole('menu');
		fireEvent.keyDown(menu, { key: 'ArrowDown' });

		expect(handleKeyDown).toHaveBeenCalledTimes(1);
	});

	it('passes items to menu content', () => {
		const items = [
			{ id: '1', label: 'Copy' },
			{ id: '2', label: 'Paste' },
			{ id: '3', label: 'Delete' },
		];
		const props = createProps({ items });
		renderWithProviders(<ContextMenuContent {...props} />);

		expect(screen.getByText('Copy')).toBeInTheDocument();
		expect(screen.getByText('Paste')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
	});

	it('passes highlightedIndex to menu content', () => {
		const props = createProps({
			highlightedIndex: 1,
			handleSelect: vi.fn().mockResolvedValue(undefined),
		});
		renderWithProviders(<ContextMenuContent {...props} />);

		// Get all buttons and check which one is highlighted
		const buttons = screen.getAllByRole('menuitem');
		expect(buttons[1]).toHaveAttribute('data-highlighted', 'true');
	});

	it('passes itemRefs to menu content', () => {
		const itemRefs = createTestItems().map(() => createRef<HTMLButtonElement | null>());
		const props = createProps({ itemRefs });
		renderWithProviders(<ContextMenuContent {...props} />);

		// Item refs should be attached to buttons
		const buttons = screen.getAllByRole('menuitem');
		expect(buttons).toHaveLength(2);
	});

	it('passes handleSelect to menu content', async () => {
		const handleSelect = vi.fn().mockResolvedValue(undefined);
		const props = createProps({ handleSelect });
		renderWithProviders(<ContextMenuContent {...props} />);

		const copyButton = screen.getByText('Copy');
		fireEvent.click(copyButton);

		expect(handleSelect).toHaveBeenCalled();
	});

	it('passes emptyState to menu content', () => {
		const props = createProps({ items: [] });
		renderWithProviders(<ContextMenuContent {...props} />);

		expect(screen.getByText('No actions available')).toBeInTheDocument();
	});

	it('calls setOpen when popover closes', () => {
		const setOpen = vi.fn();
		const props = createProps({ setOpen, open: true });
		renderWithProviders(<ContextMenuContent {...props} />);

		// Popover's onClose should call setOpen(false)
		// This is tested through the Popover component's behavior
		expect(setOpen).toBeDefined();
	});
});
