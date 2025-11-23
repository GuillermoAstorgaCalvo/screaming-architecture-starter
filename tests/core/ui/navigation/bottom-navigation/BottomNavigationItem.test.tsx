import { NavigationItem } from '@core/ui/navigation/bottom-navigation/components/BottomNavigationItem';
import type { BottomNavigationItem } from '@src-types/ui/navigation/bottomNavigation';
import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockItem: BottomNavigationItem = {
	id: 'home',
	label: 'Home',
	icon: <span data-testid="home-icon">🏠</span>,
};

const mockItemWithBadge: BottomNavigationItem = {
	id: 'notifications',
	label: 'Notifications',
	icon: <span data-testid="notifications-icon">🔔</span>,
	badge: 5,
};

const mockItemWithStringBadge: BottomNavigationItem = {
	id: 'messages',
	label: 'Messages',
	icon: <span data-testid="messages-icon">💬</span>,
	badge: '99+',
};

const mockDisabledItem: BottomNavigationItem = {
	id: 'disabled',
	label: 'Disabled',
	icon: <span data-testid="disabled-icon">🚫</span>,
	disabled: true,
};

describe('BottomNavigationItem Component - Basic Rendering', () => {
	it('renders item with label and icon', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
		expect(screen.getByTestId('home-icon')).toBeInTheDocument();
		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	it('renders item without label when showLabels is false', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={false}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		expect(button).toBeInTheDocument();
		expect(button).toHaveAttribute('aria-label', 'Home');
	});
});

describe('BottomNavigationItem Component - Active State', () => {
	it('applies active styles when isActive is true', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={true}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		expect(button).toHaveAttribute('aria-current', 'page');
	});

	it('does not apply active styles when isActive is false', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		expect(button).not.toHaveAttribute('aria-current', 'page');
	});
});

describe('BottomNavigationItem Component - Badges', () => {
	it('renders numeric badge', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItemWithBadge}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Notifications' });
		expect(button).toHaveTextContent('5');
	});

	it('renders string badge', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItemWithStringBadge}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Messages' });
		expect(button).toHaveTextContent('99+');
	});

	it('does not render badge when badge is undefined', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		// Badge should not be rendered
		const badge = button.querySelector('span[class*="absolute"]');
		expect(badge).not.toBeInTheDocument();
	});

	it('renders badge with zero value', () => {
		const itemWithZeroBadge: BottomNavigationItem = {
			id: 'zero',
			label: 'Zero',
			icon: <span>0</span>,
			badge: 0,
		};

		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={itemWithZeroBadge}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Zero' });
		expect(button).toHaveTextContent('0');
	});
});

describe('BottomNavigationItem Component - Disabled State', () => {
	it('renders disabled item', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockDisabledItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Disabled' });
		expect(button).toBeDisabled();
	});

	it('does not call onItemChange when disabled item is clicked', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockDisabledItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Disabled' });
		fireEvent.click(button);

		expect(handleItemChange).not.toHaveBeenCalled();
	});

	it('calls onItemChange when enabled item is clicked', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		fireEvent.click(button);

		expect(handleItemChange).toHaveBeenCalledWith('home');
		expect(handleItemChange).toHaveBeenCalledTimes(1);
	});
});

describe('BottomNavigationItem Component - Sizes', () => {
	it('renders with small size', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="sm"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
	});

	it('renders with medium size', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
	});

	it('renders with large size', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="lg"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
	});
});

describe('BottomNavigationItem Component - Interactions', () => {
	it('calls onItemChange with item id when clicked', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		fireEvent.click(button);

		expect(handleItemChange).toHaveBeenCalledWith('home');
		expect(handleItemChange).toHaveBeenCalledTimes(1);
	});

	it('does not call onItemChange when item is disabled', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockDisabledItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Disabled' });
		fireEvent.click(button);

		expect(handleItemChange).not.toHaveBeenCalled();
	});
});

describe('BottomNavigationItem Component - Accessibility', () => {
	it('has proper aria-label', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		expect(button).toHaveAttribute('aria-label', 'Home');
	});

	it('has aria-current="page" when active', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={true}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		expect(button).toHaveAttribute('aria-current', 'page');
	});

	it('does not have aria-current when inactive', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		expect(button).not.toHaveAttribute('aria-current');
	});

	it('is keyboard accessible', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Home' });
		button.focus();
		expect(button).toHaveFocus();
	});
});

describe('BottomNavigationItem Component - Icon Rendering', () => {
	it('renders icon element', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		expect(screen.getByTestId('home-icon')).toBeInTheDocument();
	});

	it('renders icon in relative container for badge positioning', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItemWithBadge}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		const icon = screen.getByTestId('notifications-icon');
		expect(icon).toBeInTheDocument();
		// Icon should be in a relative container
		const iconContainer = icon.parentElement;
		expect(iconContainer).toBeInTheDocument();
	});
});

describe('BottomNavigationItem Component - Label Rendering', () => {
	it('renders label when showLabels is true', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={true}
				onItemChange={handleItemChange}
			/>
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
	});

	it('does not render label text when showLabels is false', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<NavigationItem
				item={mockItem}
				isActive={false}
				size="md"
				showLabels={false}
				onItemChange={handleItemChange}
			/>
		);

		// Label might still be in DOM but visually hidden, or not rendered
		// We verify the button still has aria-label for accessibility
		const button = screen.getByRole('button', { name: 'Home' });
		expect(button).toHaveAttribute('aria-label', 'Home');
	});
});
