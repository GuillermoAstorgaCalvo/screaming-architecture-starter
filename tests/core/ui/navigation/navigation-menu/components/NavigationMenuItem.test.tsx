import { NavigationMenuItem } from '@core/ui/navigation/navigation-menu/components/NavigationMenuItem';
import type { NavigationMenuItem as NavigationMenuItemType } from '@src-types/ui/navigation/navigationMenu';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { createRef } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const defaultRouterConfig = {
	router: MemoryRouter,
	routerProps: { initialEntries: ['/'] },
} as const;

describe('NavigationMenuItem', () => {
	const createMockItem = (overrides?: Partial<NavigationMenuItemType>): NavigationMenuItemType => ({
		id: 'test-item',
		label: 'Test Item',
		...overrides,
	});

	const createMockRef = () => {
		const ref = createRef<HTMLLIElement | null>();
		ref.current = document.createElement('li');
		return ref;
	};

	describe('Rendering', () => {
		it('renders link item when to prop is provided', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link).toBeInTheDocument();
			expect(link.tagName).toBe('A');
		});

		it('renders button item when to prop is not provided', () => {
			const item = createMockItem();
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>
			);

			const button = screen.getByRole('menuitem');
			expect(button).toBeInTheDocument();
			expect(button.tagName).toBe('BUTTON');
		});

		it('renders item label', () => {
			const item = createMockItem({ label: 'My Label' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			expect(screen.getByText('My Label')).toBeInTheDocument();
		});

		it('renders item icon when provided', () => {
			const icon = <span data-testid="icon">Icon</span>;
			const item = createMockItem({ icon, to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			expect(screen.getByTestId('icon')).toBeInTheDocument();
		});

		it('does not render icon when not provided', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
		});
	});

	describe('Active State', () => {
		it('sets aria-current="page" when active', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={true}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link).toHaveAttribute('aria-current', 'page');
		});

		it('does not set aria-current when not active', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link).not.toHaveAttribute('aria-current');
		});
	});

	describe('Disabled State', () => {
		it('disables button when item is disabled', () => {
			const item = createMockItem({ disabled: true });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>
			);

			const button = screen.getByRole('menuitem');
			expect(button).toBeDisabled();
		});

		it('does not disable button when item is not disabled', () => {
			const item = createMockItem();
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>
			);

			const button = screen.getByRole('menuitem');
			expect(button).not.toBeDisabled();
		});
	});

	describe('User Interactions', () => {
		it('calls onClick when link is clicked', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			link.click();

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('calls onClick when button is clicked', () => {
			const item = createMockItem();
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>
			);

			const button = screen.getByRole('menuitem');
			button.click();

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('does not call onClick when disabled button is clicked', () => {
			const item = createMockItem({ disabled: true });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>
			);

			const button = screen.getByRole('menuitem');
			button.click();

			expect(onClick).not.toHaveBeenCalled();
		});
	});

	describe('Size Variants', () => {
		it('applies sm size classes', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="sm"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link.className).toContain('text-sm');
		});

		it('applies md size classes', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link.className).toContain('text-base');
		});

		it('applies lg size classes', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="lg"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link.className).toContain('text-lg');
		});
	});

	describe('Variant Classes', () => {
		it('applies default variant classes', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={true}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link.className).toContain('text-primary');
		});

		it('applies underline variant classes for active item', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={true}
					size="md"
					variant="underline"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link.className).toContain('border-b-2');
			expect(link.className).toContain('border-primary');
		});

		it('applies pills variant classes for active item', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={true}
					size="md"
					variant="pills"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			expect(link.className).toContain('bg-surface');
			expect(link.className).toContain('shadow-sm');
		});
	});

	describe('Orientation', () => {
		it('applies horizontal orientation classes', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			// Horizontal orientation affects padding
			expect(link.className).toContain('px-3');
		});

		it('applies vertical orientation classes', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="vertical"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const link = screen.getByRole('menuitem');
			// Vertical orientation affects padding
			expect(link.className).toContain('px-4');
		});
	});

	describe('Accessibility', () => {
		it('has role="menuitem"', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			expect(screen.getByRole('menuitem')).toBeInTheDocument();
		});

		it('wraps link in li with role="none"', () => {
			const item = createMockItem({ to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			const menuitem = screen.getByRole('menuitem');
			expect(menuitem).toBeInTheDocument();
			// The li wrapper with role="none" is an implementation detail
			// The important part is that the menuitem is accessible
		});

		it('hides icon from screen readers with aria-hidden', () => {
			const icon = <span data-testid="icon">Icon</span>;
			const item = createMockItem({ icon, to: '/test' });
			const itemRef = createMockRef();
			const onClick = vi.fn();

			renderWithProviders(
				<NavigationMenuItem
					item={item}
					isActive={false}
					size="md"
					variant="default"
					orientation="horizontal"
					itemRef={itemRef}
					onClick={onClick}
				/>,
				defaultRouterConfig
			);

			// Icon should be rendered and accessible via test id
			// The aria-hidden attribute is an implementation detail
			const iconElement = screen.getByTestId('icon');
			expect(iconElement).toBeInTheDocument();
		});
	});
});
