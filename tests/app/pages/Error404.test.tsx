/**
 * Error404 Page Tests
 *
 * Tests for 404 error page rendering, content, and accessibility
 */

import Error404 from '@app/pages/Error404';
import { ROUTES } from '@core/config/routes';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Error404', () => {
	describe('rendering', () => {
		it('should render without crashing', () => {
			expect(() => {
				renderWithProviders(<Error404 />);
			}).not.toThrow();
		});

		it('should render main element', () => {
			renderWithProviders(<Error404 />);
			expect(screen.getByRole('main')).toBeInTheDocument();
		});
	});

	describe('content', () => {
		it('should display 404 title', () => {
			renderWithProviders(<Error404 />);
			expect(screen.getByText('404')).toBeInTheDocument();
		});

		it('should display page not found message', () => {
			renderWithProviders(<Error404 />);
			expect(screen.getByText('Page not found')).toBeInTheDocument();
		});

		it('should display return home link', () => {
			renderWithProviders(<Error404 />);
			const returnHomeLink = screen.getByRole('link', { name: /return to home/i });
			expect(returnHomeLink).toBeInTheDocument();
		});

		it('should have correct href for return home link', () => {
			renderWithProviders(<Error404 />);
			const returnHomeLink = screen.getByRole('link', { name: /return to home/i });
			expect(returnHomeLink).toHaveAttribute('href', ROUTES.HOME);
		});
	});

	describe('accessibility', () => {
		it('should have no accessibility violations', async () => {
			const { container } = renderWithProviders(<Error404 />);
			await expectA11y(container);
		});

		it('should have proper heading structure', () => {
			renderWithProviders(<Error404 />);
			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('404');
		});

		it('should have accessible link with proper text', () => {
			renderWithProviders(<Error404 />);
			const link = screen.getByRole('link', { name: /return to home/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', ROUTES.HOME);
		});
	});
});
