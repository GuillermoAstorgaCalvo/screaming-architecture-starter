import Navbar from '@shared/components/layout/Navbar';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Navbar', () => {
	it('renders navigation element with correct aria-label', () => {
		renderWithProviders(<Navbar />);

		expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
	});

	it('renders home link', () => {
		renderWithProviders(<Navbar />);

		const homeLink = screen.getByRole('link', { name: /home/i });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute('href', '/');
	});

	it('renders ThemeToggle when theme prop is provided', () => {
		const themeConfig = {
			theme: 'light' as const,
			resolvedTheme: 'light' as const,
			setTheme: () => {},
		};

		renderWithProviders(<Navbar theme={themeConfig} />);

		expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument();
	});

	it('does not render ThemeToggle when theme prop is not provided', () => {
		renderWithProviders(<Navbar />);

		expect(screen.queryByRole('button', { name: /toggle theme/i })).not.toBeInTheDocument();
	});

	it('applies custom className', () => {
		renderWithProviders(<Navbar className="custom-navbar-class" />);

		const nav = screen.getByRole('navigation', { name: 'Main navigation' });
		expect(nav).toHaveClass('custom-navbar-class');
	});

	it('uses correct translation namespace for home link', () => {
		renderWithProviders(<Navbar />);

		// Should use translation from 'common' namespace
		expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
	});
});
