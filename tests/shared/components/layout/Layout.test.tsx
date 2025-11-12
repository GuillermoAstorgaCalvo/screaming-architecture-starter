import Layout from '@shared/components/layout/Layout';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Layout', () => {
	it('renders children content', () => {
		renderWithProviders(
			<Layout>
				<div>Test Content</div>
			</Layout>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('renders Navbar component', () => {
		renderWithProviders(<Layout>Content</Layout>);

		// Navbar should be present (check for navigation element)
		expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
	});

	it('renders SkipToContent component', () => {
		renderWithProviders(<Layout>Content</Layout>);

		// SkipToContent should be present (check for skip link)
		const skipLink = screen.getByRole('link', { name: /skip to main content/i });
		expect(skipLink).toBeInTheDocument();
		expect(skipLink).toHaveAttribute('href', '#main-content');
	});

	it('wraps content in main element with correct id', () => {
		renderWithProviders(
			<Layout>
				<div>Test Content</div>
			</Layout>
		);

		const main = screen.getByRole('main');
		expect(main).toHaveAttribute('id', 'main-content');
		expect(main).toHaveTextContent('Test Content');
	});

	it('applies custom className to main element', () => {
		renderWithProviders(
			<Layout className="custom-class">
				<div>Content</div>
			</Layout>
		);

		const main = screen.getByRole('main');
		expect(main).toHaveClass('custom-class');
	});

	it('passes theme config to Navbar when provided', () => {
		const themeConfig = {
			theme: 'light' as const,
			resolvedTheme: 'light' as const,
			setTheme: () => {},
		};

		renderWithProviders(
			<Layout theme={themeConfig}>
				<div>Content</div>
			</Layout>
		);

		// ThemeToggle should be present when theme is provided
		expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
	});

	it('does not render ThemeToggle when theme is not provided', () => {
		renderWithProviders(<Layout>Content</Layout>);

		// ThemeToggle should not be present
		expect(screen.queryByRole('button', { name: /toggle theme/i })).not.toBeInTheDocument();
	});
});
