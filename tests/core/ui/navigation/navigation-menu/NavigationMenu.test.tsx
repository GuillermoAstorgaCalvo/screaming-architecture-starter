import NavigationMenu from '@core/ui/navigation/navigation-menu/NavigationMenu';
import type { NavigationMenuItem } from '@src-types/ui/navigation/navigationMenu';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const defaultRouterConfig = {
	router: MemoryRouter,
	routerProps: { initialEntries: ['/'] },
} as const;

describe('NavigationMenu', () => {
	const createMockItems = (): readonly NavigationMenuItem[] => [
		{ id: 'home', label: 'Home', to: '/' },
		{ id: 'about', label: 'About', to: '/about' },
		{ id: 'contact', label: 'Contact', to: '/contact' },
	];

	describe('Rendering', () => {
		it('renders navigation menu with items', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			expect(screen.getByRole('navigation')).toBeInTheDocument();
			expect(screen.getByRole('menu')).toBeInTheDocument();
			expect(screen.getByText('Home')).toBeInTheDocument();
			expect(screen.getByText('About')).toBeInTheDocument();
			expect(screen.getByText('Contact')).toBeInTheDocument();
		});

		it('renders with correct aria-label', async () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			await waitFor(() => {
				const nav = screen.getByRole('navigation');
				expect(nav).toHaveAttribute('aria-label');
			});
		});

		it('renders all menu items', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menuItems = screen.getAllByRole('menuitem');
			expect(menuItems).toHaveLength(items.length);
		});
	});

	describe('Active Item', () => {
		it('marks active item with aria-current="page"', () => {
			const items = createMockItems();
			const activeItemId = 'about';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const aboutItem = screen.getByRole('menuitem', { name: 'About' });
			expect(aboutItem).toHaveAttribute('aria-current', 'page');
		});

		it('does not mark inactive items with aria-current', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const aboutItem = screen.getByRole('menuitem', { name: 'About' });
			expect(aboutItem).not.toHaveAttribute('aria-current');
		});
	});

	describe('User Interactions', () => {
		it('calls onItemChange when item is clicked', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const aboutItem = screen.getByRole('menuitem', { name: 'About' });
			fireEvent.click(aboutItem);

			expect(onItemChange).toHaveBeenCalledWith('about');
		});

		it('handles keyboard navigation with ArrowRight', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			fireEvent.keyDown(menu, { key: 'ArrowRight' });

			expect(onItemChange).toHaveBeenCalledWith('about');
		});

		it('handles keyboard navigation with ArrowLeft', () => {
			const items = createMockItems();
			const activeItemId = 'about';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			fireEvent.keyDown(menu, { key: 'ArrowLeft' });

			expect(onItemChange).toHaveBeenCalledWith('home');
		});

		it('handles keyboard navigation with ArrowDown', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			fireEvent.keyDown(menu, { key: 'ArrowDown' });

			expect(onItemChange).toHaveBeenCalledWith('about');
		});

		it('handles keyboard navigation with ArrowUp', () => {
			const items = createMockItems();
			const activeItemId = 'about';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			fireEvent.keyDown(menu, { key: 'ArrowUp' });

			expect(onItemChange).toHaveBeenCalledWith('home');
		});

		it('handles keyboard navigation with Home key', () => {
			const items = createMockItems();
			const activeItemId = 'contact';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			fireEvent.keyDown(menu, { key: 'Home' });

			expect(onItemChange).toHaveBeenCalledWith('home');
		});

		it('handles keyboard navigation with End key', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			fireEvent.keyDown(menu, { key: 'End' });

			expect(onItemChange).toHaveBeenCalledWith('contact');
		});

		it('skips disabled items during keyboard navigation', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home', to: '/' },
				{ id: 'about', label: 'About', to: '/about', disabled: true },
				{ id: 'contact', label: 'Contact', to: '/contact' },
			];
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			fireEvent.keyDown(menu, { key: 'ArrowRight' });

			expect(onItemChange).toHaveBeenCalledWith('contact');
		});
	});

	describe('Variants', () => {
		it('renders with default variant', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					variant="default"
				/>,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			expect(menu).toBeInTheDocument();
		});

		it('renders with underline variant', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					variant="underline"
				/>,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			expect(menu.className).toContain('border-b');
		});

		it('renders with pills variant', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					variant="pills"
				/>,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			expect(menu.className).toContain('bg-muted');
			expect(menu.className).toContain('rounded-lg');
		});
	});

	describe('Sizes', () => {
		it('renders with sm size', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					size="sm"
				/>,
				defaultRouterConfig
			);

			const menuItems = screen.getAllByRole('menuitem');
			expect(menuItems[0]?.className).toContain('text-sm');
		});

		it('renders with md size', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					size="md"
				/>,
				defaultRouterConfig
			);

			const menuItems = screen.getAllByRole('menuitem');
			expect(menuItems[0]?.className).toContain('text-base');
		});

		it('renders with lg size', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					size="lg"
				/>,
				defaultRouterConfig
			);

			const menuItems = screen.getAllByRole('menuitem');
			expect(menuItems[0]?.className).toContain('text-lg');
		});
	});

	describe('Orientation', () => {
		it('renders with horizontal orientation', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					orientation="horizontal"
				/>,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			expect(menu).toHaveAttribute('aria-orientation', 'horizontal');
			expect(menu.className).toContain('flex-row');
		});

		it('renders with vertical orientation', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					orientation="vertical"
				/>,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			expect(menu).toHaveAttribute('aria-orientation', 'vertical');
			expect(menu.className).toContain('flex-col');
		});
	});

	describe('Custom Props', () => {
		it('passes custom className to nav element', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					className="custom-class"
				/>,
				defaultRouterConfig
			);

			const menu = screen.getByRole('menu');
			expect(menu.className).toContain('custom-class');
		});

		it('passes additional HTML attributes to nav element', () => {
			const items = createMockItems();
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu
					items={items}
					activeItemId={activeItemId}
					onItemChange={onItemChange}
					data-testid="custom-nav"
				/>,
				defaultRouterConfig
			);

			const nav = screen.getByTestId('custom-nav');
			expect(nav).toBeInTheDocument();
		});
	});

	describe('Disabled Items', () => {
		it('renders disabled items', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home', to: '/' },
				{ id: 'about', label: 'About', disabled: true },
			];
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const aboutItem = screen.getByRole('menuitem', { name: 'About' });
			expect(aboutItem).toBeDisabled();
		});

		it('does not call onItemChange when disabled item is clicked', () => {
			const items: readonly NavigationMenuItem[] = [
				{ id: 'home', label: 'Home', to: '/' },
				{ id: 'about', label: 'About', disabled: true },
			];
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			const aboutItem = screen.getByRole('menuitem', { name: 'About' });
			fireEvent.click(aboutItem);

			expect(onItemChange).not.toHaveBeenCalled();
		});
	});

	describe('Items with Icons', () => {
		it('renders items with icons', () => {
			const icon = <span data-testid="home-icon">🏠</span>;
			const items: readonly NavigationMenuItem[] = [{ id: 'home', label: 'Home', to: '/', icon }];
			const activeItemId = 'home';
			const onItemChange = vi.fn();

			renderWithProviders(
				<NavigationMenu items={items} activeItemId={activeItemId} onItemChange={onItemChange} />,
				defaultRouterConfig
			);

			expect(screen.getByTestId('home-icon')).toBeInTheDocument();
		});
	});
});
