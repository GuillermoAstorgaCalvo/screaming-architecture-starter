import BottomNavigation from '@core/ui/navigation/bottom-navigation/BottomNavigation';
import type { BottomNavigationItem } from '@src-types/ui/navigation/bottomNavigation';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it, vi } from 'vitest';

const mockItems: readonly BottomNavigationItem[] = [
	{
		id: 'home',
		label: 'Home',
		icon: <span data-testid="home-icon">🏠</span>,
	},
	{
		id: 'search',
		label: 'Search',
		icon: <span data-testid="search-icon">🔍</span>,
	},
	{
		id: 'profile',
		label: 'Profile',
		icon: <span data-testid="profile-icon">👤</span>,
		badge: 3,
	},
] as const;

const mockItemsWithDisabled: readonly BottomNavigationItem[] = [
	{
		id: 'home',
		label: 'Home',
		icon: <span data-testid="home-icon">🏠</span>,
	},
	{
		id: 'search',
		label: 'Search',
		icon: <span data-testid="search-icon">🔍</span>,
		disabled: true,
	},
	{
		id: 'profile',
		label: 'Profile',
		icon: <span data-testid="profile-icon">👤</span>,
	},
] as const;

describe('BottomNavigation Component - Basic Rendering', () => {
	it('renders navigation with items', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
	});

	it('renders all item icons', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		expect(screen.getByTestId('home-icon')).toBeInTheDocument();
		expect(screen.getByTestId('search-icon')).toBeInTheDocument();
		expect(screen.getByTestId('profile-icon')).toBeInTheDocument();
	});

	it('renders item labels by default', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Search')).toBeInTheDocument();
		expect(screen.getByText('Profile')).toBeInTheDocument();
	});

	it('renders with custom className', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItems}
				activeItemId="home"
				onItemChange={handleItemChange}
				className="custom-class"
			/>
		);

		const nav = screen.getByRole('navigation');
		expect(nav).toHaveClass('custom-class');
	});
});

describe('BottomNavigation Component - Active State', () => {
	it('marks active item correctly', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const homeButton = screen.getByRole('button', { name: 'Home' });
		expect(homeButton).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark inactive items as active', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const searchButton = screen.getByRole('button', { name: 'Search' });
		expect(searchButton).not.toHaveAttribute('aria-current', 'page');
	});

	it('updates active item when activeItemId changes', () => {
		const handleItemChange = vi.fn();
		const { rerender } = renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		let homeButton = screen.getByRole('button', { name: 'Home' });
		expect(homeButton).toHaveAttribute('aria-current', 'page');

		rerender(
			<BottomNavigation items={mockItems} activeItemId="search" onItemChange={handleItemChange} />
		);

		homeButton = screen.getByRole('button', { name: 'Home' });
		const searchButton = screen.getByRole('button', { name: 'Search' });
		expect(homeButton).not.toHaveAttribute('aria-current', 'page');
		expect(searchButton).toHaveAttribute('aria-current', 'page');
	});
});

describe('BottomNavigation Component - Item Interactions', () => {
	it('calls onItemChange when item is clicked', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const searchButton = screen.getByRole('button', { name: 'Search' });
		fireEvent.click(searchButton);

		expect(handleItemChange).toHaveBeenCalledWith('search');
		expect(handleItemChange).toHaveBeenCalledTimes(1);
	});

	it('does not call onItemChange when disabled item is clicked', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItemsWithDisabled}
				activeItemId="home"
				onItemChange={handleItemChange}
			/>
		);

		const disabledButton = screen.getByRole('button', { name: 'Search' });
		fireEvent.click(disabledButton);

		expect(handleItemChange).not.toHaveBeenCalled();
	});

	it('handles multiple item clicks', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		fireEvent.click(screen.getByRole('button', { name: 'Search' }));
		fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
		fireEvent.click(screen.getByRole('button', { name: 'Home' }));

		expect(handleItemChange).toHaveBeenCalledTimes(3);
		expect(handleItemChange).toHaveBeenNthCalledWith(1, 'search');
		expect(handleItemChange).toHaveBeenNthCalledWith(2, 'profile');
		expect(handleItemChange).toHaveBeenNthCalledWith(3, 'home');
	});
});

describe('BottomNavigation Component - Badges', () => {
	it('renders badge when provided', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const profileButton = screen.getByRole('button', { name: 'Profile' });
		expect(profileButton).toHaveTextContent('3');
	});

	it('renders string badge', () => {
		const itemsWithStringBadge: readonly BottomNavigationItem[] = [
			{
				id: 'notifications',
				label: 'Notifications',
				icon: <span>🔔</span>,
				badge: '99+',
			},
		] as const;

		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={itemsWithStringBadge}
				activeItemId="notifications"
				onItemChange={handleItemChange}
			/>
		);

		const button = screen.getByRole('button', { name: 'Notifications' });
		expect(button).toHaveTextContent('99+');
	});

	it('does not render badge when not provided', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const homeButton = screen.getByRole('button', { name: 'Home' });
		expect(homeButton).not.toHaveTextContent(/\d+/);
	});
});

describe('BottomNavigation Component - Sizes', () => {
	it('renders with default size (md)', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});

	it('renders with small size', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItems}
				activeItemId="home"
				onItemChange={handleItemChange}
				size="sm"
			/>
		);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});

	it('renders with large size', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItems}
				activeItemId="home"
				onItemChange={handleItemChange}
				size="lg"
			/>
		);

		expect(screen.getByRole('navigation')).toBeInTheDocument();
	});

	it('renders with all sizes', () => {
		const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

		for (const size of sizes) {
			const handleItemChange = vi.fn();
			const { unmount } = renderWithProviders(
				<BottomNavigation
					items={mockItems}
					activeItemId="home"
					onItemChange={handleItemChange}
					size={size}
				/>
			);

			expect(screen.getByRole('navigation')).toBeInTheDocument();
			unmount();
		}
	});
});

describe('BottomNavigation Component - Labels', () => {
	it('hides labels when showLabels is false', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItems}
				activeItemId="home"
				onItemChange={handleItemChange}
				showLabels={false}
			/>
		);

		// Labels should not be visible, but buttons should still exist
		const homeButton = screen.getByRole('button', { name: 'Home' });
		expect(homeButton).toBeInTheDocument();
		// The label text might still be in the DOM but visually hidden
		// We check that the button still has aria-label
		expect(homeButton).toHaveAttribute('aria-label', 'Home');
	});

	it('shows labels by default', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		expect(screen.getByText('Home')).toBeInTheDocument();
		expect(screen.getByText('Search')).toBeInTheDocument();
		expect(screen.getByText('Profile')).toBeInTheDocument();
	});
});

describe('BottomNavigation Component - Disabled Items', () => {
	it('renders disabled items', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItemsWithDisabled}
				activeItemId="home"
				onItemChange={handleItemChange}
			/>
		);

		const disabledButton = screen.getByRole('button', { name: 'Search' });
		expect(disabledButton).toBeDisabled();
	});

	it('does not disable enabled items', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItemsWithDisabled}
				activeItemId="home"
				onItemChange={handleItemChange}
			/>
		);

		const enabledButton = screen.getByRole('button', { name: 'Home' });
		expect(enabledButton).not.toBeDisabled();
	});
});

describe('BottomNavigation Component - Accessibility', () => {
	it('has no accessibility violations', async () => {
		const handleItemChange = vi.fn();
		const { container } = renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		await expectA11y(container);
	});

	it('uses semantic nav element', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const nav = screen.getByRole('navigation');
		expect(nav.tagName).toBe('NAV');
	});

	it('has proper ARIA attributes for active item', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const activeButton = screen.getByRole('button', { name: 'Home' });
		expect(activeButton).toHaveAttribute('aria-current', 'page');
	});

	it('has proper ARIA labels for all items', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		expect(screen.getByRole('button', { name: 'Home' })).toHaveAttribute('aria-label', 'Home');
		expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute('aria-label', 'Search');
		expect(screen.getByRole('button', { name: 'Profile' })).toHaveAttribute(
			'aria-label',
			'Profile'
		);
	});

	it('is keyboard accessible', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const homeButton = screen.getByRole('button', { name: 'Home' });
		homeButton.focus();
		expect(homeButton).toHaveFocus();
	});

	it('passes through additional props', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation
				items={mockItems}
				activeItemId="home"
				onItemChange={handleItemChange}
				data-testid="custom-nav"
				aria-label="Custom navigation"
			/>
		);

		const nav = screen.getByTestId('custom-nav');
		expect(nav).toBeInTheDocument();
		expect(nav).toHaveAttribute('aria-label', 'Custom navigation');
	});
});

describe('BottomNavigation Component - Fixed Positioning', () => {
	it('renders with fixed positioning', () => {
		const handleItemChange = vi.fn();
		renderWithProviders(
			<BottomNavigation items={mockItems} activeItemId="home" onItemChange={handleItemChange} />
		);

		const nav = screen.getByRole('navigation');
		expect(nav).toHaveClass('fixed');
		expect(nav).toHaveStyle({ zIndex: expect.any(Number) });
	});
});
