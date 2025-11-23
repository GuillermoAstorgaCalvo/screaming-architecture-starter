/**
 * ContextMenu Component Tests
 *
 * Tests for the ContextMenu component including:
 * - Rendering with trigger and items
 * - Right-click trigger behavior
 * - Controlled and uncontrolled modes
 * - Item selection
 * - Keyboard navigation
 * - Separators
 * - Empty state
 * - Accessibility
 */

import ContextMenu, { type ContextMenuItem } from '@core/ui/overlays/context-menu/ContextMenu';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Mock useTranslation
vi.mock('@core/i18n/useTranslation', () => ({
	useTranslation: () => ({
		t: (key: string) => {
			if (key === 'noActionsAvailable') {
				return 'No actions available';
			}
			return key;
		},
	}),
}));

const createTestItems = (): ContextMenuItem[] => [
	{ id: '1', label: 'Copy', onSelect: vi.fn() },
	{ id: '2', label: 'Paste', onSelect: vi.fn() },
	{ id: '3', label: 'Delete', onSelect: vi.fn(), disabled: true },
];

describe('ContextMenu - Rendering', () => {
	it('renders trigger element', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} />);

		expect(screen.getByTestId('trigger')).toBeInTheDocument();
	});

	it('does not render menu when closed', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} isOpen={false} />);

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();
	});

	it('renders menu when open', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} />);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('renders menu items', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} />);

		expect(screen.getByText('Copy')).toBeInTheDocument();
		expect(screen.getByText('Paste')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
	});
});

describe('ContextMenu - Right-click Trigger', () => {
	it('opens menu on right-click', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} />);

		const triggerElement = screen.getByTestId('trigger');
		fireEvent.contextMenu(triggerElement);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('prevents default context menu behavior', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} />);

		const triggerElement = screen.getByTestId('trigger');
		const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
		const preventDefault = vi.spyOn(event, 'preventDefault');

		fireEvent(triggerElement, event);

		expect(preventDefault).toHaveBeenCalled();
	});

	it('calls original onContextMenu if provided', () => {
		const originalHandler = vi.fn();
		const trigger = (
			<div data-testid="trigger" onContextMenu={originalHandler}>
				Right-click me
			</div>
		);
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} />);

		const triggerElement = screen.getByTestId('trigger');
		fireEvent.contextMenu(triggerElement);

		expect(originalHandler).toHaveBeenCalled();
	});
});

describe('ContextMenu - Controlled Mode', () => {
	it('respects isOpen prop in controlled mode', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		const { rerender } = renderWithProviders(
			<ContextMenu trigger={trigger} items={createTestItems()} isOpen={false} />
		);

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();

		rerender(<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} />);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('calls onOpenChange when state changes', () => {
		const onOpenChange = vi.fn();
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu
				trigger={trigger}
				items={createTestItems()}
				isOpen={false}
				onOpenChange={onOpenChange}
			/>
		);

		const triggerElement = screen.getByTestId('trigger');
		fireEvent.contextMenu(triggerElement);

		expect(onOpenChange).toHaveBeenCalledWith(true);
	});
});

describe('ContextMenu - Uncontrolled Mode', () => {
	it('manages open state internally', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} />);

		const triggerElement = screen.getByTestId('trigger');
		fireEvent.contextMenu(triggerElement);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});
});

describe('ContextMenu - Item Selection', () => {
	it('calls onSelect when item is clicked', async () => {
		const itemOnSelect = vi.fn();
		const items: ContextMenuItem[] = [{ id: '1', label: 'Copy', onSelect: itemOnSelect }];
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={items} isOpen={true} />);

		const menuItem = screen.getByText('Copy');
		fireEvent.click(menuItem);

		await waitFor(() => {
			expect(itemOnSelect).toHaveBeenCalledTimes(1);
		});
	});

	it('calls onSelect prop when item is selected', async () => {
		const onSelect = vi.fn();
		const itemOnSelect = vi.fn();
		const items: ContextMenuItem[] = [{ id: '1', label: 'Copy', onSelect: itemOnSelect }];
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu trigger={trigger} items={items} isOpen={true} onSelect={onSelect} />
		);

		const menuItem = screen.getByText('Copy');
		fireEvent.click(menuItem);

		await waitFor(() => {
			expect(itemOnSelect).toHaveBeenCalledTimes(1);
			expect(onSelect).toHaveBeenCalledTimes(1);
		});
	});

	it('closes menu after item selection', async () => {
		const items: ContextMenuItem[] = [{ id: '1', label: 'Copy', onSelect: vi.fn() }];
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={items} />);

		const triggerElement = screen.getByTestId('trigger');
		fireEvent.contextMenu(triggerElement);

		expect(screen.getByRole('menu')).toBeInTheDocument();

		const menuItem = screen.getByText('Copy');
		fireEvent.click(menuItem);

		await waitFor(() => {
			expect(screen.queryByRole('menu')).not.toBeInTheDocument();
		});
	});

	it('does not select disabled items', () => {
		const itemOnSelect = vi.fn();
		const items: ContextMenuItem[] = [
			{ id: '1', label: 'Delete', onSelect: itemOnSelect, disabled: true },
		];
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={items} isOpen={true} />);

		const menuItem = screen.getByText('Delete');
		fireEvent.click(menuItem);

		expect(itemOnSelect).not.toHaveBeenCalled();
	});
});

describe('ContextMenu - Separators', () => {
	it('renders separators', () => {
		const items = [
			{ id: '1', label: 'Copy' },
			{ id: 'sep1', type: 'separator' as const },
			{ id: '2', label: 'Delete' },
		];
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={items} isOpen={true} />);

		expect(screen.getByText('Copy')).toBeInTheDocument();
		expect(screen.getByText('Delete')).toBeInTheDocument();
		// Separator should be rendered (check for divider element)
		const menu = screen.getByRole('menu');
		expect(menu.querySelector('hr, [role="separator"]')).toBeInTheDocument();
	});
});

describe('ContextMenu - Alignment', () => {
	it('renders with default alignment (center)', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} />);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('renders with start alignment', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} align="start" />
		);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});

	it('renders with end alignment', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} align="end" />
		);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});
});

describe('ContextMenu - Empty State', () => {
	it('renders default empty state when no items', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={[]} isOpen={true} />);

		expect(screen.getByText('No actions available')).toBeInTheDocument();
	});

	it('renders custom empty state', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu
				trigger={trigger}
				items={[]}
				isOpen={true}
				emptyState={<div data-testid="custom-empty">Custom empty</div>}
			/>
		);

		expect(screen.getByTestId('custom-empty')).toBeInTheDocument();
	});
});

describe('ContextMenu - Props', () => {
	it('applies custom className', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu
				trigger={trigger}
				items={createTestItems()}
				isOpen={true}
				className="custom-menu-class"
			/>
		);

		const menu = screen.getByRole('menu');
		expect(menu.closest('.custom-menu-class')).toBeInTheDocument();
	});

	it('applies custom maxHeight', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} maxHeight={400} />
		);

		const menu = screen.getByRole('menu');
		expect(menu).toHaveStyle({ '--menu-max-height': '400px' });
	});

	it('applies custom menuLabel', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu
				trigger={trigger}
				items={createTestItems()}
				isOpen={true}
				menuLabel="Custom menu label"
			/>
		);

		const menu = screen.getByRole('menu');
		expect(menu).toHaveAttribute('aria-label', 'Custom menu label');
	});
});

describe('ContextMenu - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const trigger = <button data-testid="trigger">Right-click me</button>;
		const { container } = renderWithProviders(
			<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} />
		);

		await expectA11y(container);
	});

	it('has proper ARIA attributes on trigger', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(<ContextMenu trigger={trigger} items={createTestItems()} isOpen={true} />);

		const triggerElement = screen.getByTestId('trigger');
		expect(triggerElement).toHaveAttribute('aria-haspopup', 'menu');
		expect(triggerElement).toHaveAttribute('aria-expanded', 'true');
	});

	it('has proper ARIA attributes on menu', () => {
		const trigger = <div data-testid="trigger">Right-click me</div>;
		renderWithProviders(
			<ContextMenu
				trigger={trigger}
				items={createTestItems()}
				isOpen={true}
				menuLabel="Test menu"
			/>
		);

		const menu = screen.getByRole('menu');
		expect(menu).toHaveAttribute('aria-label', 'Test menu');
		expect(menu).toHaveAttribute('tabIndex', '-1');
	});
});

describe('ContextMenu - Integration', () => {
	it('works with state management', () => {
		const TestComponent = () => {
			const [isOpen, setIsOpen] = useState(false);
			return (
				<div>
					<button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
					<ContextMenu
						trigger={<div data-testid="trigger">Right-click me</div>}
						items={createTestItems()}
						isOpen={isOpen}
						onOpenChange={setIsOpen}
					/>
				</div>
			);
		};

		renderWithProviders(<TestComponent />);

		expect(screen.queryByRole('menu')).not.toBeInTheDocument();

		const toggleButton = screen.getByText('Toggle');
		fireEvent.click(toggleButton);

		expect(screen.getByRole('menu')).toBeInTheDocument();
	});
});
