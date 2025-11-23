/**
 * MenubarSubmenuItem Component Tests
 *
 * Tests for the MenubarSubmenuItem component including:
 * - Rendering
 * - Disabled state
 * - Icons and shortcuts
 * - Click handling
 * - Accessibility
 */

import { MenubarSubmenuItem } from '@core/ui/navigation/menubar/components/MenubarSubmenuItem';
import type { MenubarSubmenuItem as MenubarSubmenuItemType } from '@src-types/ui/navigation/menubar';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

describe('MenubarSubmenuItem - Rendering', () => {
	it('renders button element', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New' };
		renderWithProviders(<MenubarSubmenuItem item={item} />);

		const button = screen.getByRole('menuitem');
		expect(button).toBeInTheDocument();
	});

	it('renders label text', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New' };
		renderWithProviders(<MenubarSubmenuItem item={item} />);

		expect(screen.getByText('New')).toBeInTheDocument();
	});

	it('renders icon when provided', () => {
		const item: MenubarSubmenuItemType = {
			id: 'new',
			label: 'New',
			icon: <span data-testid="icon">📄</span>,
		};
		renderWithProviders(<MenubarSubmenuItem item={item} />);

		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('renders shortcut when provided', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New', shortcut: 'Ctrl+N' };
		renderWithProviders(<MenubarSubmenuItem item={item} />);

		expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
	});

	it('does not render icon when not provided', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New' };
		const { container } = renderWithProviders(<MenubarSubmenuItem item={item} />);

		// Icon container might exist but be empty, so we check for the icon specifically
		const icon = container.querySelector('[data-testid="icon"]');
		expect(icon).not.toBeInTheDocument();
	});
});

describe('MenubarSubmenuItem - Disabled State', () => {
	it('disables button when item is disabled', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New', disabled: true };
		renderWithProviders(<MenubarSubmenuItem item={item} />);

		const button = screen.getByRole('menuitem');
		expect(button).toBeDisabled();
	});

	it('enables button when item is not disabled', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New', disabled: false };
		renderWithProviders(<MenubarSubmenuItem item={item} />);

		const button = screen.getByRole('menuitem');
		expect(button).not.toBeDisabled();
	});

	it('applies disabled styling when disabled', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New', disabled: true };
		const { container } = renderWithProviders(<MenubarSubmenuItem item={item} />);

		const button = container.querySelector('button');
		expect(button).toHaveClass('opacity-60');
		expect(button).toHaveClass('cursor-not-allowed');
	});
});

describe('MenubarSubmenuItem - Interactions', () => {
	it('calls onSelect when button is clicked', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New' };
		const onSelect = vi.fn();

		renderWithProviders(<MenubarSubmenuItem item={item} onSelect={onSelect} />);

		const button = screen.getByRole('menuitem');
		fireEvent.click(button);

		expect(onSelect).toHaveBeenCalledTimes(1);
	});

	it('does not call onSelect when disabled', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New', disabled: true };
		const onSelect = vi.fn();

		renderWithProviders(<MenubarSubmenuItem item={item} onSelect={onSelect} />);

		const button = screen.getByRole('menuitem');
		fireEvent.click(button);

		expect(onSelect).not.toHaveBeenCalled();
	});

	it('handles async onSelect', async () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New' };
		const onSelect = vi.fn().mockResolvedValue(undefined);

		renderWithProviders(<MenubarSubmenuItem item={item} onSelect={onSelect} />);

		const button = screen.getByRole('menuitem');
		fireEvent.click(button);

		expect(onSelect).toHaveBeenCalledTimes(1);
		await onSelect();
	});

	it('does not call onSelect when not provided', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New' };

		renderWithProviders(<MenubarSubmenuItem item={item} />);

		const button = screen.getByRole('menuitem');
		fireEvent.click(button);

		// Should not throw error
		expect(button).toBeInTheDocument();
	});
});

describe('MenubarSubmenuItem - Accessibility', () => {
	it('has correct role', () => {
		const item: MenubarSubmenuItemType = { id: 'new', label: 'New' };
		renderWithProviders(<MenubarSubmenuItem item={item} />);

		const button = screen.getByRole('menuitem');
		expect(button).toBeInTheDocument();
	});

	it('hides icon from screen readers', () => {
		const item: MenubarSubmenuItemType = {
			id: 'new',
			label: 'New',
			icon: <span data-testid="icon">📄</span>,
		};

		const { container } = renderWithProviders(<MenubarSubmenuItem item={item} />);

		// The icon is wrapped in a span with aria-hidden
		const iconWrapper = container.querySelector('[aria-hidden="true"]');
		expect(iconWrapper).toBeInTheDocument();
		expect(iconWrapper).toContainElement(screen.getByTestId('icon'));
	});
});
