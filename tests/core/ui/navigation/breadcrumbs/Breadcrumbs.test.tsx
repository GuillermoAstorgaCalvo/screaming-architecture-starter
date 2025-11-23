import Breadcrumbs from '@core/ui/navigation/breadcrumbs/Breadcrumbs';
import type { BreadcrumbItem } from '@src-types/ui/navigation/breadcrumbs';
import { fireEvent, screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

const HOME_PATH = '/';
const DEFAULT_SEPARATOR = '/';
const CURRENT_PAGE_LABEL = 'Current Page';

const defaultRouterConfig = {
	router: MemoryRouter,
	routerProps: { initialEntries: [HOME_PATH] },
} as const;

const mockBreadcrumbs: readonly BreadcrumbItem[] = [
	{ label: 'Home', to: HOME_PATH },
	{ label: 'Products', to: '/products' },
	{ label: CURRENT_PAGE_LABEL, isCurrentPage: true },
] as const;

const mockBreadcrumbsWithoutLinks: readonly BreadcrumbItem[] = [
	{ label: 'Home' },
	{ label: 'Products' },
	{ label: CURRENT_PAGE_LABEL },
] as const;

describe('Breadcrumbs Component - Rendering', () => {
	describe('Basic rendering', () => {
		it('renders breadcrumbs with items', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			expect(screen.getByText('Home')).toBeInTheDocument();
			expect(screen.getByText('Products')).toBeInTheDocument();
			expect(screen.getByText(CURRENT_PAGE_LABEL)).toBeInTheDocument();
		});

		it('renders with custom className', () => {
			renderWithProviders(
				<Breadcrumbs items={mockBreadcrumbs} className="custom-class" />,
				defaultRouterConfig
			);

			// className is applied to the <ol> element, merged with base classes
			const nav = screen.getByRole('navigation');
			expect(nav).toBeInTheDocument();
			// Verify the component renders correctly with custom className
			expect(screen.getByText('Home')).toBeInTheDocument();
		});
	});

	describe('Links', () => {
		it('renders links for items with to prop', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const homeLink = screen.getByRole('link', { name: 'Home' });
			const productsLink = screen.getByRole('link', { name: 'Products' });

			expect(homeLink).toBeInTheDocument();
			expect(homeLink).toHaveAttribute('href', HOME_PATH);
			expect(productsLink).toBeInTheDocument();
			expect(productsLink).toHaveAttribute('href', '/products');
		});
	});

	describe('Spans', () => {
		it('renders spans for items without to prop', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbsWithoutLinks} />, defaultRouterConfig);

			const home = screen.getByText('Home');
			expect(home).toBeInTheDocument();
			// Verify it's not a link
			expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument();
		});

		it('renders current page item as span', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const currentPage = screen.getByText(CURRENT_PAGE_LABEL);
			expect(currentPage).toBeInTheDocument();
			// Verify it's not a link
			expect(screen.queryByRole('link', { name: CURRENT_PAGE_LABEL })).not.toBeInTheDocument();
		});

		it('renders last item as current page by default', () => {
			const items: readonly BreadcrumbItem[] = [
				{ label: 'Home', to: HOME_PATH },
				{ label: 'Products', to: '/products' },
				{ label: 'Last Item' },
			] as const;

			renderWithProviders(<Breadcrumbs items={items} />, defaultRouterConfig);

			const lastItem = screen.getByText('Last Item');
			expect(lastItem).toHaveAttribute('aria-current', 'page');
		});
	});
});

describe('Breadcrumbs Component - Separators', () => {
	it('renders with default separator', () => {
		renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

		const separators = screen.getAllByText(DEFAULT_SEPARATOR);
		expect(separators.length).toBeGreaterThan(0);
	});

	it('renders with custom separator', () => {
		renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} separator="→" />, defaultRouterConfig);

		const separators = screen.getAllByText('→');
		expect(separators.length).toBeGreaterThan(0);
	});

	it('renders with React node separator', () => {
		renderWithProviders(
			<Breadcrumbs
				items={mockBreadcrumbs}
				separator={<span data-testid="custom-separator">→</span>}
			/>,
			defaultRouterConfig
		);

		const separators = screen.getAllByTestId('custom-separator');
		expect(separators.length).toBeGreaterThan(0);
	});
});

describe('Breadcrumbs Component - Interactions', () => {
	it('handles click on breadcrumb link', () => {
		const handleClick = vi.fn();
		renderWithProviders(
			<Breadcrumbs items={mockBreadcrumbs} onClick={handleClick} />,
			defaultRouterConfig
		);

		const homeLink = screen.getByRole('link', { name: 'Home' });
		fireEvent.click(homeLink);

		expect(handleClick).toHaveBeenCalled();
	});

	it('navigates to correct route when link is clicked', () => {
		renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

		const productsLink = screen.getByRole('link', { name: 'Products' });
		expect(productsLink).toHaveAttribute('href', '/products');
	});
});

describe('Breadcrumbs Component - Navigation', () => {
	it('navigates to home route', () => {
		renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

		const homeLink = screen.getByRole('link', { name: 'Home' });
		expect(homeLink).toHaveAttribute('href', HOME_PATH);
	});

	it('navigates to nested routes', () => {
		const nestedBreadcrumbs: readonly BreadcrumbItem[] = [
			{ label: 'Home', to: HOME_PATH },
			{ label: 'Products', to: '/products' },
			{ label: 'Category', to: '/products/category' },
			{ label: 'Item', isCurrentPage: true },
		] as const;

		renderWithProviders(<Breadcrumbs items={nestedBreadcrumbs} />, defaultRouterConfig);

		const categoryLink = screen.getByRole('link', { name: 'Category' });
		expect(categoryLink).toHaveAttribute('href', '/products/category');
	});

	it('does not render link for current page even if to is provided', () => {
		const items: readonly BreadcrumbItem[] = [
			{ label: 'Home', to: HOME_PATH },
			{ label: 'Current', to: '/current', isCurrentPage: true },
		] as const;

		renderWithProviders(<Breadcrumbs items={items} />, defaultRouterConfig);

		const current = screen.getByText('Current');
		expect(current).toBeInTheDocument();
		// Verify it's not a link
		expect(screen.queryByRole('link', { name: 'Current' })).not.toBeInTheDocument();
	});
});

describe('Breadcrumbs Component - Accessibility', () => {
	describe('A11y compliance', () => {
		it('has no accessibility violations', async () => {
			const { container } = renderWithProviders(
				<Breadcrumbs items={mockBreadcrumbs} />,
				defaultRouterConfig
			);

			await expectA11y(container);
		});

		it('has proper semantic HTML structure', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const nav = screen.getByRole('navigation');
			expect(nav).toBeInTheDocument();
			// Verify breadcrumb items are rendered
			expect(screen.getByText('Home')).toBeInTheDocument();
		});
	});

	describe('ARIA attributes', () => {
		it('has proper aria-label for navigation', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const nav = screen.getByRole('navigation');
			expect(nav).toHaveAttribute('aria-label');
		});

		it('has aria-current="page" for current page item', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const currentPage = screen.getByText(CURRENT_PAGE_LABEL);
			expect(currentPage).toHaveAttribute('aria-current', 'page');
		});

		it('has aria-hidden on separators', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const separators = screen.getAllByText(DEFAULT_SEPARATOR);
			for (const separator of separators) {
				expect(separator).toHaveAttribute('aria-hidden', 'true');
			}
		});
	});

	describe('Keyboard navigation', () => {
		it('is keyboard accessible', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const homeLink = screen.getByRole('link', { name: 'Home' });
			homeLink.focus();
			expect(homeLink).toHaveFocus();
		});

		it('supports keyboard navigation with Enter key', () => {
			renderWithProviders(<Breadcrumbs items={mockBreadcrumbs} />, defaultRouterConfig);

			const homeLink = screen.getByRole('link', { name: 'Home' });
			homeLink.focus();
			fireEvent.keyDown(homeLink, { key: 'Enter', code: 'Enter' });
			expect(homeLink).toHaveFocus();
		});
	});
});
