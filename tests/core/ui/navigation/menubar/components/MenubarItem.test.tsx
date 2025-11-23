/**
 * MenubarItem Component Tests
 *
 * Tests for the MenubarItem component including:
 * - Rendering
 * - Active state
 * - Disabled state
 * - Icons and shortcuts
 * - Click handling
 * - Accessibility
 */

import { MenubarItem } from '@core/ui/navigation/menubar/components/MenubarItem';
import type { MenubarItem as MenubarItemType } from '@src-types/ui/navigation/menubar';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

describe('MenubarItem - Rendering', () => {
	it('renders button element', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const button = screen.getByRole('menuitem');
		expect(button).toBeInTheDocument();
	});

	it('renders label text', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		expect(screen.getByText('File')).toBeInTheDocument();
	});

	it('renders icon when provided', () => {
		const item: MenubarItemType = {
			id: 'file',
			label: 'File',
			icon: <span data-testid="icon">📄</span>,
		};
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});

	it('renders shortcut when provided', () => {
		const item: MenubarItemType = { id: 'file', label: 'File', shortcut: 'Ctrl+N' };
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		expect(screen.getByText('Ctrl+N')).toBeInTheDocument();
	});

	it('does not render icon when not provided', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const { container } = renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const iconContainer = container.querySelector('[aria-hidden="true"]');
		expect(iconContainer).not.toBeInTheDocument();
	});
});

describe('MenubarItem - Active State', () => {
	it('applies active classes when isActive is true', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const { container } = renderWithProviders(
			<MenubarItem
				item={item}
				isActive={true}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const button = container.querySelector('button');
		expect(button).toHaveAttribute('data-active', 'true');
	});

	it('does not apply active classes when isActive is false', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const { container } = renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const button = container.querySelector('button');
		expect(button).not.toHaveAttribute('data-active');
	});
});

describe('MenubarItem - Disabled State', () => {
	it('disables button when item is disabled', () => {
		const item: MenubarItemType = { id: 'file', label: 'File', disabled: true };
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const button = screen.getByRole('menuitem');
		expect(button).toBeDisabled();
	});

	it('enables button when item is not disabled', () => {
		const item: MenubarItemType = { id: 'file', label: 'File', disabled: false };
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const button = screen.getByRole('menuitem');
		expect(button).not.toBeDisabled();
	});
});

describe('MenubarItem - Interactions', () => {
	it('calls onClick when button is clicked', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		const onClick = vi.fn();

		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={onClick}
			/>
		);

		const button = screen.getByRole('menuitem');
		fireEvent.click(button);

		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', () => {
		const item: MenubarItemType = { id: 'file', label: 'File', disabled: true };
		const onClick = vi.fn();

		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={onClick}
			/>
		);

		const button = screen.getByRole('menuitem');
		fireEvent.click(button);

		expect(onClick).not.toHaveBeenCalled();
	});
});

describe('MenubarItem - Accessibility', () => {
	it('has correct role', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const button = screen.getByRole('menuitem');
		expect(button).toBeInTheDocument();
	});

	it('has aria-label when label is string', () => {
		const item: MenubarItemType = { id: 'file', label: 'File' };
		renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		const button = screen.getByLabelText('File');
		expect(button).toBeInTheDocument();
	});

	it('hides icon from screen readers', () => {
		const item: MenubarItemType = {
			id: 'file',
			label: 'File',
			icon: <span data-testid="icon">📄</span>,
		};

		const { container } = renderWithProviders(
			<MenubarItem
				item={item}
				isActive={false}
				itemRef={createRef<HTMLButtonElement>() as React.RefObject<HTMLButtonElement>}
				onClick={vi.fn()}
			/>
		);

		// The icon is wrapped in a span with aria-hidden
		const iconWrapper = container.querySelector('[aria-hidden="true"]');
		expect(iconWrapper).toBeInTheDocument();
		expect(iconWrapper).toContainElement(screen.getByTestId('icon'));
	});
});
