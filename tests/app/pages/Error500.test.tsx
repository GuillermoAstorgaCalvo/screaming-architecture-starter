/**
 * Error500 Page Tests
 *
 * Tests for 500 error page rendering, content, and accessibility
 */

import Error500 from '@app/pages/Error500';
import { ROUTES } from '@core/config/routes';
import { screen } from '@testing-library/react';
import { expectA11y } from '@tests/utils/a11y';
import { renderWithProviders } from '@tests/utils/testUtils';
import { describe, expect, it } from 'vitest';

describe('Error500', () => {
	describe('rendering', () => {
		it('should render without crashing', () => {
			expect(() => {
				renderWithProviders(<Error500 />);
			}).not.toThrow();
		});

		it('should render main element', () => {
			renderWithProviders(<Error500 />);
			expect(screen.getByRole('main')).toBeInTheDocument();
		});
	});

	describe('content', () => {
		it('should display 500 title', () => {
			renderWithProviders(<Error500 />);
			expect(screen.getByText('500')).toBeInTheDocument();
		});

		it('should display internal server error message', () => {
			renderWithProviders(<Error500 />);
			expect(screen.getByText('Internal server error')).toBeInTheDocument();
		});

		it('should display return home link', () => {
			renderWithProviders(<Error500 />);
			const returnHomeLink = screen.getByRole('link', { name: /return to home/i });
			expect(returnHomeLink).toBeInTheDocument();
		});

		it('should have correct href for return home link', () => {
			renderWithProviders(<Error500 />);
			const returnHomeLink = screen.getByRole('link', { name: /return to home/i });
			expect(returnHomeLink).toHaveAttribute('href', ROUTES.HOME);
		});
	});

	describe('accessibility', () => {
		it('should have no accessibility violations', async () => {
			const { container } = renderWithProviders(<Error500 />);
			await expectA11y(container);
		});

		it('should have proper heading structure', () => {
			renderWithProviders(<Error500 />);
			const heading = screen.getByRole('heading', { level: 1 });
			expect(heading).toBeInTheDocument();
			expect(heading).toHaveTextContent('500');
		});

		it('should have accessible link with proper text', () => {
			renderWithProviders(<Error500 />);
			const link = screen.getByRole('link', { name: /return to home/i });
			expect(link).toBeInTheDocument();
			expect(link).toHaveAttribute('href', ROUTES.HOME);
		});
	});
});
