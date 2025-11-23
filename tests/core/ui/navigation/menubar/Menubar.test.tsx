/**
 * Menubar Component Tests
 *
 * Tests for the Menubar component including:
 * - Rendering
 * - Multiple items
 * - Keyboard navigation
 * - Click handling
 * - Submenu interactions
 * - Accessibility
 */

import Menubar from '@core/ui/navigation/menubar/Menubar';
import type { MenubarItem } from '@src-types/ui/navigation/menubar';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const createTestItems = (): readonly MenubarItem[] => [
	{ id: 'file', label: 'File' },
	{ id: 'edit', label: 'Edit' },
	{ id: 'view', label: 'View' },
];

describe('Menubar - Rendering', () => {
	it('renders menubar element', () => {
		const items = createTestItems();
		const { container } = renderWithProviders(<Menubar items={items} />);

		const menubar = container.querySelector('[role="menubar"]');
		expect(menubar).toBeInTheDocument();
	});

	it('renders all items', () => {
		const items = createTestItems();
		renderWithProviders(<Menubar items={items} />);

		expect(screen.getByText('File')).toBeInTheDocument();
		expect(screen.getByText('Edit')).toBeInTheDocument();
		expect(screen.getByText('View')).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const items = createTestItems();
		const { container } = renderWithProviders(<Menubar items={items} className="custom-menubar" />);

		const menubar = container.querySelector('[role="menubar"]');
		expect(menubar).toHaveClass('custom-menubar');
	});

	it('forwards additional HTML attributes', () => {
		const items = createTestItems();
		renderWithProviders(<Menubar items={items} data-testid="menubar" aria-label="Custom menu" />);

		const menubar = screen.getByTestId('menubar');
		expect(menubar).toHaveAttribute('aria-label', 'Custom menu');
	});

	it('has correct aria-label', () => {
		const items = createTestItems();
		const { container } = renderWithProviders(<Menubar items={items} />);

		const menubar = container.querySelector('[role="menubar"]');
		expect(menubar).toHaveAttribute('aria-label');
	});
});

describe('Menubar - Items with Submenus', () => {
	it('renders item with submenu', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		renderWithProviders(<Menubar items={items} />);

		expect(screen.getByText('File')).toBeInTheDocument();
	});

	it('renders multiple items with submenus', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
			{
				id: 'edit',
				label: 'Edit',
				submenu: [{ id: 'copy', label: 'Copy' }],
			},
		];

		renderWithProviders(<Menubar items={items} />);

		expect(screen.getByText('File')).toBeInTheDocument();
		expect(screen.getByText('Edit')).toBeInTheDocument();
	});

	it('handles mixed items with and without submenus', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'file', label: 'File' },
			{
				id: 'edit',
				label: 'Edit',
				submenu: [{ id: 'copy', label: 'Copy' }],
			},
		];

		renderWithProviders(<Menubar items={items} />);

		expect(screen.getByText('File')).toBeInTheDocument();
		expect(screen.getByText('Edit')).toBeInTheDocument();
	});
});

describe('Menubar - Interactions', () => {
	it('handles item click', () => {
		const onSelect = vi.fn();
		const items: readonly MenubarItem[] = [{ id: 'file', label: 'File', onSelect }];

		renderWithProviders(<Menubar items={items} />);

		const fileButton = screen.getByText('File');
		fireEvent.click(fileButton);

		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it('toggles submenu on click', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		renderWithProviders(<Menubar items={items} />);

		const fileButton = screen.getByText('File');
		fireEvent.click(fileButton);

		// Submenu should open (check via aria-expanded)
		const button = screen.getByRole('menuitem', { name: 'File' });
		expect(button).toHaveAttribute('aria-expanded', 'true');
	});

	it('closes submenu when clicking again', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		renderWithProviders(<Menubar items={items} />);

		const fileButton = screen.getByText('File');
		fireEvent.click(fileButton);
		fireEvent.click(fileButton);

		// Submenu should close
		const button = screen.getByRole('menuitem', { name: 'File' });
		expect(button).toHaveAttribute('aria-expanded', 'false');
	});
});

describe('Menubar - Keyboard Navigation', () => {
	it('handles ArrowRight key', () => {
		const items = createTestItems();

		renderWithProviders(<Menubar items={items} />);

		const menubar = screen.getByRole('menubar');
		menubar.focus();

		fireEvent.keyDown(menubar, { key: 'ArrowRight' });

		// First item should be active
		const fileButton = screen.getByRole('menuitem', { name: 'File' });
		expect(fileButton).toHaveAttribute('data-active', 'true');
	});

	it('handles ArrowLeft key', () => {
		const items = createTestItems();

		renderWithProviders(<Menubar items={items} />);

		const menubar = screen.getByRole('menubar');
		menubar.focus();

		// First navigate right, then left
		fireEvent.keyDown(menubar, { key: 'ArrowRight' });
		fireEvent.keyDown(menubar, { key: 'ArrowLeft' });

		// Should wrap to last item
		const viewButton = screen.getByRole('menuitem', { name: 'View' });
		expect(viewButton).toHaveAttribute('data-active', 'true');
	});

	it('handles ArrowDown key to open submenu', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		renderWithProviders(<Menubar items={items} />);

		const menubar = screen.getByRole('menubar');
		menubar.focus();

		fireEvent.keyDown(menubar, { key: 'ArrowRight' });
		fireEvent.keyDown(menubar, { key: 'ArrowDown' });

		const fileButton = screen.getByRole('menuitem', { name: 'File' });
		expect(fileButton).toHaveAttribute('aria-expanded', 'true');
	});

	it('handles Escape key to close submenu', () => {
		const items: readonly MenubarItem[] = [
			{
				id: 'file',
				label: 'File',
				submenu: [{ id: 'new', label: 'New' }],
			},
		];

		renderWithProviders(<Menubar items={items} />);

		const fileButton = screen.getByText('File');
		fireEvent.click(fileButton);

		const menubar = screen.getByRole('menubar');
		menubar.focus();
		fireEvent.keyDown(menubar, { key: 'Escape' });

		const button = screen.getByRole('menuitem', { name: 'File' });
		expect(button).toHaveAttribute('aria-expanded', 'false');
	});

	it('handles Enter key to activate item', () => {
		const onSelect = vi.fn();
		const items: readonly MenubarItem[] = [{ id: 'file', label: 'File', onSelect }];

		renderWithProviders(<Menubar items={items} />);

		const menubar = screen.getByRole('menubar');
		menubar.focus();

		fireEvent.keyDown(menubar, { key: 'ArrowRight' });
		fireEvent.keyDown(menubar, { key: 'Enter' });

		expect(onSelect).toHaveBeenCalled();
	});

	it('handles Space key to activate item', () => {
		const onSelect = vi.fn();
		const items: readonly MenubarItem[] = [{ id: 'file', label: 'File', onSelect }];

		renderWithProviders(<Menubar items={items} />);

		const menubar = screen.getByRole('menubar');
		menubar.focus();

		fireEvent.keyDown(menubar, { key: 'ArrowRight' });
		fireEvent.keyDown(menubar, { key: ' ' });

		expect(onSelect).toHaveBeenCalled();
	});

	it('skips disabled items during navigation', () => {
		const items: readonly MenubarItem[] = [
			{ id: 'file', label: 'File' },
			{ id: 'edit', label: 'Edit', disabled: true },
			{ id: 'view', label: 'View' },
		];

		renderWithProviders(<Menubar items={items} />);

		const menubar = screen.getByRole('menubar');
		menubar.focus();

		fireEvent.keyDown(menubar, { key: 'ArrowRight' });
		fireEvent.keyDown(menubar, { key: 'ArrowRight' });

		// Should skip disabled 'edit' and go to 'view'
		const viewButton = screen.getByRole('menuitem', { name: 'View' });
		expect(viewButton).toHaveAttribute('data-active', 'true');
	});
});

describe('Menubar - Accessibility', () => {
	it('passes accessibility checks', async () => {
		const items = createTestItems();
		const { container } = renderWithProviders(<Menubar items={items} />);

		await expectA11y(container);
	});

	it('has correct role', () => {
		const items = createTestItems();
		const { container } = renderWithProviders(<Menubar items={items} />);

		const menubar = container.querySelector('[role="menubar"]');
		expect(menubar).toBeInTheDocument();
	});

	it('is keyboard focusable', () => {
		const items = createTestItems();
		const { container } = renderWithProviders(<Menubar items={items} />);

		const menubar = container.querySelector('[role="menubar"]');
		expect(menubar).toHaveAttribute('tabIndex', '0');
	});

	it('has proper ARIA label', () => {
		const items = createTestItems();
		const { container } = renderWithProviders(<Menubar items={items} />);

		const menubar = container.querySelector('[role="menubar"]');
		expect(menubar).toHaveAttribute('aria-label');
	});
});
